"use client";

import { useRef, useState } from "react";
import { getPath } from "@/lib/invoice-utils";
import { uploadLogo } from "@/lib/upload";
import { useDraft } from "@/store/invoiceStore";

export default function LogoUpload({ fieldKey, label }: { fieldKey: string; label: string }) {
  const url = useDraft((s) => getPath(s.data, fieldKey)) as string | undefined;
  const setField = useDraft((s) => s.setField);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      setField(fieldKey, await uploadLogo(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-xs font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Logo preview" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">No logo</span>
          )}
        </div>
        <div className="space-y-2">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onPick} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {busy ? "Uploading..." : url ? "Replace logo" : "Upload logo"}
            </button>
            {url && !busy && (
              <button type="button" onClick={() => setField(fieldKey, "")} className="text-sm text-gray-500 underline hover:text-red-600">
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">PNG, JPG or WebP, up to 2 MB.</p>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}