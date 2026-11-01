export type Variant = "modern" | "corporate" | "minimalist" | "freelancer" | "creative";

const themes: Record<Variant, { accent: string; font: string; band: string; bandText: string }> = {
  modern:     { accent: "#2f4bd0", font: "Helvetica, Arial, sans-serif", band: "#2f4bd0", bandText: "#fff" },
  corporate:  { accent: "#0b2b4a", font: "Georgia, 'Times New Roman', serif", band: "#0b2b4a", bandText: "#fff" },
  minimalist: { accent: "#111111", font: "Helvetica, Arial, sans-serif", band: "transparent", bandText: "#111" },
  freelancer: { accent: "#0e6b57", font: "'Trebuchet MS', Arial, sans-serif", band: "#e3f2ec", bandText: "#0e6b57" },
  creative:   { accent: "#c8501e", font: "Verdana, Geneva, sans-serif", band: "#fff1ea", bandText: "#c8501e" },
};

const rows = [["Brand identity", "1", "450,000"], ["Website design", "1", "820,000"], ["Monthly support", "3", "90,000"]];

/** Small sample invoice used on the landing page. All content is placeholder text. */
export default function MiniInvoice({ variant }: { variant: Variant }) {
  const t = themes[variant];
  return (
    <div className="relative h-[262px] w-[196px] overflow-hidden rounded-[5px] bg-white text-[#1a1a1a] shadow-2xl" style={{ fontFamily: t.font }}>
      <div className="flex items-start justify-between px-3 py-2.5" style={{ background: t.band, color: t.bandText, borderBottom: variant === "minimalist" ? "1px solid #ddd" : variant === "corporate" ? "3px double #0b2b4a" : undefined }}>
        <div>
          <div className="text-[11px] font-bold tracking-wide">INVOICE</div>
          <div className="text-[6.5px] opacity-80">Studio Northwind</div>
        </div>
        <div className="text-right text-[6.5px] leading-tight opacity-90">INV-0042<br />12 Nov 2026</div>
      </div>
      <div className="flex justify-between px-3 pt-2.5 text-[6.5px] leading-snug">
        <div><div className="text-[#888]">Bill to</div><div className="font-semibold">Sample Client Ltd</div><div>Lagos, Nigeria</div></div>
        <div className="text-right"><div className="text-[#888]">Due</div><div className="font-semibold">26 Nov 2026</div></div>
      </div>
      <div className="px-3 pt-2.5">
        <div className="flex border-b pb-1 text-[6px] font-semibold" style={{ borderColor: t.accent, color: t.accent }}>
          <span className="flex-1">Description</span><span className="w-5 text-right">Qty</span><span className="w-12 text-right">Amount</span>
        </div>
        {rows.map((r) => (
          <div key={r[0]} className="flex border-b border-[#eee] py-[3px] text-[6.5px]">
            <span className="flex-1">{r[0]}</span><span className="w-5 text-right">{r[1]}</span><span className="w-12 text-right">{r[2]}</span>
          </div>
        ))}
      </div>
      <div className="ml-auto mt-2.5 w-[88px] pr-3 text-[6.5px]">
        <div className="flex justify-between"><span className="text-[#888]">Subtotal</span><span>1,360,000</span></div>
        <div className="mt-1 flex justify-between border-t pt-1 text-[8px] font-bold" style={{ borderColor: t.accent, color: t.accent }}><span>Total</span><span>₦1,360,000</span></div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 space-y-1">
        <div className="h-[3px] w-3/4 rounded bg-[#e6e6e6]" /><div className="h-[3px] w-1/2 rounded bg-[#e6e6e6]" />
      </div>
      {variant === "creative" && <div className="absolute -bottom-5 -right-5 h-16 w-16 rounded-full opacity-20" style={{ background: t.accent }} />}
    </div>
  );
}
