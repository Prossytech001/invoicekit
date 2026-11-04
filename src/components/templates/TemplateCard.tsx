"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ScaledPage from "@/components/editor/ScaledPage";
import { calculate } from "@/engine/calculate";
import { getTemplate } from "@/templates/registry";
import { sampleDraft } from "@/templates/sample";
import TemplateThumbnail from "./TemplateThumbnail";

function PreviewModal({ templateId, onClose }: { templateId: string; onClose: () => void }) {
  const def = getTemplate(templateId);
  const totals = useMemo(() => calculate(sampleDraft), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!def) return null;
  const Template = def.Component;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl rounded-2xl bg-gray-100 p-4 shadow-xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-emerald-950">{def.manifest.name}</h3>
          <div className="flex items-center gap-3">
            <Link
              href={`/create/${def.manifest.id}?new=1`}
              className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Use This Template
            </Link>
            <button onClick={onClose} aria-label="Close preview" className="text-2xl leading-none text-gray-500 hover:text-gray-800">×</button>
          </div>
        </div>
        <ScaledPage>
          <Template data={sampleDraft} totals={totals} accent={def.manifest.accent} />
        </ScaledPage>
        <p className="mt-3 text-center text-xs text-gray-500">Sample content. You'll enter your own details next.</p>
      </div>
    </div>
  );
}

export default function TemplateCard({ templateId }: { templateId: string }) {
  const def = getTemplate(templateId);
  const [open, setOpen] = useState(false);
  if (!def) return null;
  const { manifest } = def;

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(true))}
          aria-label={`Preview ${manifest.name}`}
          className="cursor-zoom-in bg-gray-100 p-5 text-left"
        >
          <TemplateThumbnail templateId={templateId} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-emerald-950">{manifest.name}</h3>
            <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-800">
              {manifest.access}
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm text-gray-600">{manifest.description}</p>
          <p className="mt-3 text-xs text-gray-400">{manifest.category}</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Preview
            </button>
            <Link
              href={`/create/${manifest.id}?new=1`}
              className="flex-1 rounded-full bg-emerald-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Use This Template
            </Link>
          </div>
        </div>
      </div>
      {open && <PreviewModal templateId={templateId} onClose={() => setOpen(false)} />}
    </>
  );
}