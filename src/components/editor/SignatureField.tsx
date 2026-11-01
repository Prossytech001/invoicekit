"use client";

import { useEffect, useRef, useState } from "react";
import { getPath } from "@/lib/invoice-utils";
import { useDraft } from "@/store/invoiceStore";

const MAX_W = 480;
const MAX_DATA_URL = 250_000; // keep the stored image small

// Crops the transparent margin around the ink and shrinks it to a small PNG.
function exportTrimmed(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const px = ctx.getImageData(0, 0, width, height).data;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (px[(y * width + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) return "";
  const pad = 8;
  const sx = Math.max(0, minX - pad), sy = Math.max(0, minY - pad);
  const sw = Math.min(width - sx, maxX - minX + pad * 2), sh = Math.min(height - sy, maxY - minY + pad * 2);
  const scale = Math.min(1, MAX_W / sw);
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(sw * scale));
  out.height = Math.max(1, Math.round(sh * scale));
  out.getContext("2d")!.drawImage(canvas, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}

async function imageFileToSignature(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Use a PNG, JPG or WebP image.");
  if (file.size > 3 * 1024 * 1024) throw new Error("Image is too large. Maximum size is 3 MB.");
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_W / bmp.width, 160 / bmp.height);
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(bmp.width * scale));
  c.height = Math.max(1, Math.round(bmp.height * scale));
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  const url = c.toDataURL("image/png");
  if (url.length > MAX_DATA_URL) throw new Error("That image is too detailed. Try a simpler or smaller signature image.");
  return url;
}

function DrawPad({ onDone, onCancel }: { onDone: (dataUrl: string) => void; onCancel: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [empty, setEmpty] = useState(true);

  function setup() {
    const c = ref.current!;
    const ratio = window.devicePixelRatio || 1;
    c.width = c.clientWidth * ratio;
    c.height = c.clientHeight * ratio;
    const ctx = c.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827";
  }
  useEffect(setup, []);

  const point = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const ctx = () => ref.current!.getContext("2d")!;

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = point(e);
    last.current = p;
    const g = ctx();
    g.beginPath();
    g.moveTo(p.x, p.y);
    g.lineTo(p.x + 0.1, p.y);
    g.stroke();
    setEmpty(false);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const p = point(e);
    const g = ctx();
    g.beginPath();
    g.moveTo(last.current.x, last.current.y);
    g.lineTo(p.x, p.y);
    g.stroke();
    last.current = p;
  }
  const up = () => {
    drawing.current = false;
    last.current = null;
  };
  function clear() {
    const c = ref.current!;
    ctx().clearRect(0, 0, c.width, c.height);
    setEmpty(true);
  }

  return (
    <div>
      <canvas
        ref={ref}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="h-40 w-full touch-none rounded-lg border border-gray-300 bg-white"
        aria-label="Signature drawing area"
      />
      <p className="mt-1 text-xs text-gray-400">Sign above with your mouse, finger or stylus.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={empty}
          onClick={() => {
            const url = exportTrimmed(ref.current!);
            if (url) onDone(url);
          }}
          className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          Use this signature
        </button>
        <button type="button" onClick={clear} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Clear</button>
        <button type="button" onClick={onCancel} className="px-2 py-2 text-sm text-gray-500 underline">Cancel</button>
      </div>
    </div>
  );
}

export default function SignatureField({ fieldKey, label }: { fieldKey: string; label: string }) {
  const value = useDraft((s) => getPath(s.data, fieldKey)) as string | undefined;
  const setField = useDraft((s) => s.setField);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function save(url: string) {
    setField(fieldKey, url);
    // stamp today's date the first time a signature is added
    const dateKey = "extras.signatureDate";
    if (!getPath(useDraft.getState().data, dateKey)) setField(dateKey, new Date().toISOString().slice(0, 10));
    setDrawing(false);
    setError("");
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      save(await imageFileToSignature(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not use that image.");
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-xs font-medium text-gray-700">{label}</span>
      {drawing ? (
        <DrawPad onDone={save} onCancel={() => setDrawing(false)} />
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-48 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white">
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Your signature" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No signature yet</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setDrawing(true)} className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                {value ? "Draw again" : "Draw signature"}
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Upload image
              </button>
              {value && (
                <button type="button" onClick={() => setField(fieldKey, "")} className="text-sm text-gray-500 underline hover:text-red-600">Remove</button>
              )}
            </div>
            <p className="text-xs text-gray-400">A PNG with a transparent background looks best.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onPick} />
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}