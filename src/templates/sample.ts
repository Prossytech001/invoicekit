import type { InvoiceDraft } from "./types";

// A neutral placeholder logo so previews show the logo area and the watermark.
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="90" viewBox="0 0 240 90"><rect x="0" y="10" width="70" height="70" rx="16" fill="#14463a"/><path d="M22 58 L35 28 L48 58 M27 49 H43" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="84" y="56" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#14463a">Your Logo</text></svg>`;

// Fixed sample content (no random ids or dates) so the server and browser render the same thing.
export const sampleDraft: InvoiceDraft = {
  business: {
    name: "Bright Studio Ltd",
    address: "14 Market Road\nLagos, Nigeria",
    email: "hello@brightstudio.example",
    phone: "+234 800 000 0000",
    logo: `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`,
  },
  customer: {
    name: "Sample Client Ltd",
    email: "accounts@sampleclient.example",
    phone: "+234 800 111 1111",
    address: "7 Example Street\nAbuja, Nigeria",
  },
  invoice: {
    number: "INV-0042",
    issueDate: "2026-01-15",
    dueDate: "",
    currency: "USD",
    paymentMethod: "Bank transfer",
    notes: "Payment is due within the agreed terms. Thank you for your business.",
  },
  items: [
    { id: "s1", description: "Website design and build", qty: "1", unitPrice: 180000 },
    { id: "s2", description: "Brand guidelines document", qty: "1", unitPrice: 45000 },
    { id: "s3", description: "Hosting and maintenance (12 months)", qty: "12", unitPrice: 2500 },
  ],
  taxes: [{ label: "Tax", rate: "7.5" }],
  payment: { details: "Bank: Example Bank\nAccount name: Bright Studio Ltd\nAccount no: 0000000000" },
  extras: {
    dueTerms: "Net 14",
    subject: "Website design project",
    showSignature: true,
    signerName: "Jane Doe",
    signerTitle: "Director",
    showWatermark: true,
    watermarkOpacity: 8,
  },
};