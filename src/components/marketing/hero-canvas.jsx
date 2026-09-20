import { useEffect, useRef } from "react";

/**
 * Mouse-reactive financial graph rendered on a canvas.
 * Chart lines bow gently toward the cursor, data points glow nearby and fine
 * particles drift with the pointer. Seeded randomness keeps the scene stable.
 */
export function HeroCanvas({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* Pointer state — eased every frame for smooth motion. */
    const HOME_X = () => width / 2;
    const HOME_Y = () => height * 0.45;
    const pointer = { x: HOME_X(), y: HOME_Y(), px: HOME_X(), py: HOME_Y(), active: false };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    /* Deterministic pseudo-random so re-mounts look identical. */
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    /* Fine particles drifting across the scene. */
    const particles = Array.from({ length: 42 }, () => ({
      x: rand() * 1600,
      y: rand() * 900,
      r: 0.6 + rand() * 1.3,
      vx: (rand() - 0.5) * 7,
      vy: (rand() - 0.5) * 7,
      a: 0.1 + rand() * 0.22,
    }));

    /* Three layered chart lines. */
    const lines = [
      { base: 0.62, amp: 0.15, phase: 0.0, freq: 0.9, speed: 0.05, color: "59,130,246", alpha: 0.5, width: 1.6, points: true },
      { base: 0.72, amp: 0.11, phase: 1.7, freq: 1.25, speed: 0.036, color: "99,102,241", alpha: 0.34, width: 1.1, points: false },
      { base: 0.52, amp: 0.09, phase: 3.1, freq: 0.7, speed: 0.028, color: "34,211,238", alpha: 0.26, width: 1, points: false },
    ];
    const STEP = 26;

    const ease = 0.08;
    let raf = 0;
    let last = performance.now();

    const draw = (now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const t = now / 1000;

      /* Ease the pointer; relax to center when idle. */
      const tx = pointer.active ? pointer.x : HOME_X();
      const ty = pointer.active ? pointer.y : HOME_Y();
      pointer.px += (tx - pointer.px) * ease;
      pointer.py += (ty - pointer.py) * ease;
      const nx = width > 0 ? pointer.px / width - 0.5 : 0;
      const ny = height > 0 ? pointer.py / height - 0.5 : 0;

      ctx.clearRect(0, 0, width, height);

      /* Subtle market grid with a hint of parallax. */
      const gridGap = 56;
      const gx = (((nx * -14) % gridGap) + gridGap) % gridGap;
      const gy = (((ny * -10) % gridGap) + gridGap) % gridGap;
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = gx; x < width; x += gridGap) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = gy; y < height; y += gridGap) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.restore();

      /* Chart lines — vertices rise toward the cursor. */
      const sigma = Math.max(140, width * 0.16);
      for (const line of lines) {
        const drift = t * line.speed;
        ctx.save();
        ctx.strokeStyle = `rgba(${line.color},${line.alpha})`;
        ctx.lineWidth = line.width;
        ctx.lineJoin = "round";
        ctx.beginPath();
        const glow = [];
        for (let x = -STEP; x <= width + STEP; x += STEP) {
          const u = (x / width) * Math.PI * 2 * line.freq;
          const wave =
            Math.sin(u + line.phase + drift) * line.amp +
            Math.sin(u * 0.5 + line.phase * 0.6 + drift * 0.7) * line.amp * 0.45;
          let y = height * line.base + wave * height;
          const dx = x - pointer.px;
          const dy = y - pointer.py;
          const pull = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
          y -= pull * 46 * line.width;
          if (x >= 0 && x <= width && line.points) glow.push({ x, y, pull });
          if (x === -STEP) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        /* Data points on the main line; glow intensifies near the cursor. */
        if (line.points) {
          for (const p of glow) {
            ctx.fillStyle = `rgba(147,197,253,${0.22 + p.pull * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.6 + p.pull * 2.2, 0, Math.PI * 2);
            ctx.fill();
            if (p.pull > 0.4) {
              const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 24);
              halo.addColorStop(0, `rgba(59,130,246,${0.2 * p.pull})`);
              halo.addColorStop(1, "rgba(59,130,246,0)");
              ctx.fillStyle = halo;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }

      /* Particles — drift slowly and brighten near the pointer. */
      ctx.save();
      for (const p of particles) {
        p.x += p.vx * dt + nx * 10 * dt;
        p.y += p.vy * dt + ny * 10 * dt;
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
        const dx = p.x - pointer.px;
        const dy = p.y - pointer.py;
        const near = Math.exp(-(dx * dx + dy * dy) / 28800);
        ctx.fillStyle = `rgba(148,197,253,${Math.min(0.8, p.a + near * 0.45)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + near * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const parent = canvas.parentElement;
    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    if (reduceMotion) draw(performance.now());
    else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
