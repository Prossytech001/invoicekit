import { fmtDate } from "@/lib/invoice-utils";

// Shared signature area. With a signature image it shows the signed version;
// without one it shows blank lines, so the invoice can also be printed and signed by hand.
export default function SignatureBlock({ extras, variant }: { extras: Record<string, unknown>; variant: "inline" | "stacked" }) {
  const name = String(extras.signerName ?? "").trim();
  const title = String(extras.signerTitle ?? "").trim();
  const image = typeof extras.signatureImage === "string" ? extras.signatureImage : "";
  const date = image ? fmtDate(String(extras.signatureDate ?? "")) : "";
  const who = [name, title].filter(Boolean).join(", ");

  const img = image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="Signature" style={{ maxHeight: 54, maxWidth: 230, objectFit: "contain", mixBlendMode: "multiply" }} />
  ) : null;

  if (variant === "stacked") {
    return (
      <div className="mx-auto mt-14 w-[330px] space-y-6 text-[13px]" style={{ breakInside: "avoid" }}>
        <div className="flex items-end gap-4">
          <span className="w-20">Name:</span>
          <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5">{who}</span>
        </div>
        <div className="flex items-end gap-4">
          <span className="w-20">Signature:</span>
          <span className="flex h-[58px] flex-1 items-end border-b border-dotted border-gray-400">{img}</span>
        </div>
        {date && (
          <div className="flex items-end gap-4">
            <span className="w-20">Date:</span>
            <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5">{date}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-12 flex items-end gap-10 border-y border-gray-100 py-6 text-[12px]" style={{ breakInside: "avoid" }}>
      <div className="flex-1">
        <div className="flex h-[60px] items-end border-b border-gray-400">{img}</div>
        <div className="mt-1 text-[11px] text-gray-500">Signature{who ? ` · ${who}` : ""}</div>
      </div>
      <div className="w-[190px]">
        <div className="flex h-[60px] items-end border-b border-gray-400 pb-1 text-gray-700">{date}</div>
        <div className="mt-1 text-[11px] text-gray-500">Date</div>
      </div>
    </div>
  );
}