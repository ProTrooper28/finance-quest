/* Dependency-free confetti burst, used on the result screen. */

const STYLE_ID = "finquest-confetti-style";
const BURST_ID = "finquest-confetti-burst";
const COLORS = ["#2563eb", "#3b82f6", "#6366f1", "#22d3ee", "#10b981", "#f9fafb"];

export function fireConfetti(count = 90) {
  if (typeof document === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .fq-confetti-piece{position:fixed;top:-12px;z-index:9999;pointer-events:none;border-radius:2px;will-change:transform,opacity;}
      @keyframes fq-confetti-fall{
        0%{transform:translate3d(var(--x),-12px,0) rotate(0deg);opacity:1}
        100%{transform:translate3d(var(--x2),105vh,0) rotate(var(--r));opacity:0}
      }`;
    document.head.appendChild(style);
  }

  document.getElementById(BURST_ID)?.remove();
  const container = document.createElement("div");
  container.id = BURST_ID;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "fq-confetti-piece";
    const size = 5 + Math.random() * 6;
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 30;
    const duration = 2.2 + Math.random() * 1.8;
    piece.style.cssText = `
      left:${startX}vw;width:${size}px;height:${size * (Math.random() > 0.5 ? 1 : 0.5)}px;
      background:${COLORS[i % COLORS.length]};
      --x:${drift}vw;--x2:${drift + (Math.random() - 0.5) * 24}vw;--r:${Math.round(Math.random() * 720 - 360)}deg;
      animation:fq-confetti-fall ${duration}s cubic-bezier(.23,.86,.44,1) forwards;
      animation-delay:${Math.random() * 0.4}s;`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4800);
}
