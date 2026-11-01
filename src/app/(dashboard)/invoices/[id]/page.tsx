import { notFound } from "next/navigation";
import InvoiceEditor from "@/components/editor/InvoiceEditor";
import InvoiceViewer from "@/components/invoices/InvoiceViewer";
import { InvoiceRecord } from "@/lib/invoice-types";
import { serverApi } from "@/lib/server-session";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await serverApi<InvoiceRecord>(`/invoices/${id}`);
  if (!invoice) notFound();

  // Drafts open in the editor; issued and archived invoices are read-only.
  if (invoice.status === "draft") {
    return <InvoiceEditor templateId={invoice.template_id} initial={{ id: invoice.id, template_id: invoice.template_id, data: invoice.data }} />;
  }
  return <InvoiceViewer invoice={invoice} />;
}