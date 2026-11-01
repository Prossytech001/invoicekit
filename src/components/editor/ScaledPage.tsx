"use client";

import { useEffect, useRef, useState } from "react";

const PAGE_WIDTH = 794; // A4 at 96 dpi

// Draws the invoice at its real A4 width, then scales it down to fit the available space.
// `overlay` adds a faint diagonal word (like PREVIEW) across the page.
export default function ScaledPage({ children, overlay }: { children: React.ReactNode; overlay?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);

  useEffect(() => {
    const update = () => {
      if (outer.current) setScale(Math.min(1, outer.current.clientWidth / PAGE_WIDTH));
      if (inner.current) setHeight(inner.current.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="w-full">
      <div className="relative overflow-hidden" style={{ height: height * scale }}>
        <div
          ref={inner}
          className="absolute left-0 top-0 bg-white shadow-lg ring-1 ring-black/5"
          style={{ width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          {children}
          {overlay && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
              <span className="-rotate-[30deg] select-none text-[130px] font-black tracking-widest text-gray-900/[0.07]">{overlay}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}