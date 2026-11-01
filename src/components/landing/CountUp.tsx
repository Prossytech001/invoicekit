"use client";
import { useEffect, useState } from "react";

export default function CountUp({ to, prefix = "", delay = 900, duration = 1800 }: { to: number; prefix?: string; delay?: number; duration?: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    let raf = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [to, delay, duration]);

  return <>{prefix}{n.toLocaleString("en")}</>;
}
