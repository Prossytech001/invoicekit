// Asks the backend to render the invoice as a PDF. Only works for paid invoices.
async function fetchPdf(invoiceId: string): Promise<Blob> {
  const res = await fetch(`/api/pdf/${invoiceId}`, { method: "POST", credentials: "same-origin" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Could not create the PDF. Please try again.");
  }
  return res.blob();
}

export async function downloadInvoicePdf(invoiceId: string, filename = "invoice.pdf") {
  const url = URL.createObjectURL(await fetchPdf(invoiceId));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// Opens the PDF in a new tab so the user can print it from the browser's PDF viewer.
export async function printInvoicePdf(invoiceId: string) {
  const tab = window.open("", "_blank"); // open first, so the pop-up blocker allows it
  try {
    const url = URL.createObjectURL(await fetchPdf(invoiceId));
    if (tab) tab.location.href = url;
    else window.location.href = url;
  } catch (e) {
    tab?.close();
    throw e;
  }
}