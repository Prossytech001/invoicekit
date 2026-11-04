"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculate } from "@/engine/calculate";
import { getTemplate } from "@/templates/registry";
import { sampleDraft } from "@/templates/sample";

const PAGE_WIDTH = 794; // A4 at 96 dpi

// A small picture of the real invoice design: the actual template, filled with sample data, scaled down.
export default function TemplateThumbnail({ templateId }: { templateId: string }) {
  const def = getTemplate(templateId);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const totals = useMemo(() => calculate(sampleDraft), []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / PAGE_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!def) return null;
  const Template = def.Component;

  return (
    <div
      ref={box}
      className="relative w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
      style={{ aspectRatio: "210 / 297" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 select-none text-left"
        style={{
          width: PAGE_WIDTH,
          transform: `scale(${scale ?? 0.3})`,
          transformOrigin: "top left",
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        <Template data={sampleDraft} totals={totals} accent={def.manifest.accent} />
      </div>
    </div>
  );
}