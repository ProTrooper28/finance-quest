import { useEffect, useRef } from "react";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
const POSTER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";
const FADE = 0.9;

export function GlobeBackground() {
  const aRef = useRef(null);
  const bRef = useRef(null);

  useEffect(() => {
    const A = aRef.current;
    const B = bRef.current;
    if (!A || !B) return;

    const play = (v) => {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      A.removeAttribute("autoplay");
      A.pause();
      B.pause();
      try {
        A.currentTime = 0;
      } catch {
        /* first frame not ready yet */
      }
      return;
    }

    let cur = A;
    let nxt = B;
    let swapping = false;
    let timer;
    play(A);

    // The clip's last frame doesn't match its first, so cross-fade two copies at the loop point.
    const tick = () => {
      if (swapping || !cur.duration) return;
      if (cur.duration - cur.currentTime > FADE) return;
      swapping = true;
      const out = cur;
      nxt.currentTime = 0;
      play(nxt);
      nxt.classList.add("is-active");
      out.classList.remove("is-active");
      cur = nxt;
      nxt = out;
      timer = setTimeout(() => {
        out.pause();
        out.currentTime = 0;
        swapping = false;
      }, FADE * 1000 + 100);
    };

    A.addEventListener("timeupdate", tick);
    B.addEventListener("timeupdate", tick);
    return () => {
      clearTimeout(timer);
      A.removeEventListener("timeupdate", tick);
      B.removeEventListener("timeupdate", tick);
    };
  }, []);

  return (
    <div className="gb" role="img" aria-label="Slowly rotating purple dot-matrix globe against a starfield">
      <div className="gb-stage">
        <video ref={aRef} className="gb-video is-active" autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" poster={POSTER}>
          <source src={VIDEO} type="video/mp4" />
        </video>
        <video ref={bRef} className="gb-video" muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" poster={POSTER}>
          <source src={VIDEO} type="video/mp4" />
        </video>
      </div>
      <div className="gb-scrim" />
    </div>
  );
}
