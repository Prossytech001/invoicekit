import { notFound } from "next/navigation";
import { calculate } from "@/engine/calculate";
import { mergeDraft } from "@/lib/draft";
import { getTemplate } from "@/templates/registry";
import type { InvoiceDraft } from "@/templates/types";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";

// Print-only page. The backend's headless browser opens this URL (with a short-lived signed token)
// and saves it as a PDF. It is not linked anywhere in the app.
export default async function RenderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await fetch(`${BACKEND}/api/pdf/render-data/${token}`, { cache: "no-store" });
  if (!res.ok) notFound();

  const inv = (await res.json()) as { template_id: string; data: Partial<InvoiceDraft> };
  const def = getTemplate(inv.template_id);
  if (!def) notFound();

  const data = mergeDraft(inv.data);
  const totals = calculate(data);

  return (
    <>
      <style>{`
        @page { size: A4; margin: 14mm 0; }
        html, body { background: #fff !important; margin: 0; padding: 0; }
        body { min-height: 0 !important; }
        .pdf-root { width: 210mm; margin: 0 auto; }
        .pdf-root > div { min-height: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important; }
        .pdf-root [data-watermark] { position: fixed !important; }
        .pdf-root * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        thead { display: table-header-group; }
        tr { break-inside: avoid; }
      `}</style>
      <div className="pdf-root">
        <def.Component data={data} totals={totals} accent={def.manifest.accent} />
      </div>
    </>
  );
}