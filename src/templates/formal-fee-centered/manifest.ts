import { CURRENCIES } from "../formal-fee-header/manifest";
import type { TemplateManifest } from "../types";

export const manifest: TemplateManifest = {
  id: "formal-fee-centered",
  name: "Formal Invoice, Centered Style",
  category: "Professional services",
  description: "Centered logo and title, From / To / details columns, amount-only itemization and name and signature lines.",
  access: "free",
  accent: "#1e3a5f",
  itemColumns: ["description", "amount"],
  sections: [
    {
      id: "business",
      title: "From (your business)",
      fields: [
        { key: "business.name", label: "Business name", type: "text", required: true, full: true },
        { key: "business.address", label: "Address", type: "textarea", full: true },
        { key: "business.email", label: "Email", type: "email" },
        { key: "business.phone", label: "Phone", type: "tel" },
      ],
    },
    {
      id: "branding",
      title: "Logo and watermark",
      fields: [
        { key: "business.logo", label: "Business logo", type: "image", full: true },
        { key: "extras.showWatermark", label: "Show logo as faded watermark", type: "checkbox", full: true },
        { key: "extras.watermarkOpacity", label: "Watermark strength", type: "range", min: 2, max: 20, step: 1, full: true, showIf: { key: "extras.showWatermark", equals: true } },
      ],
    },
    {
      id: "client",
      title: "To (client)",
      fields: [
        { key: "customer.name", label: "Client name", type: "text", required: true, full: true },
        { key: "customer.email", label: "Email", type: "email" },
        { key: "customer.phone", label: "Phone", type: "tel" },
        { key: "customer.address", label: "Address", type: "textarea", full: true },
      ],
    },
    {
      id: "details",
      title: "Invoice details",
      fields: [
        { key: "invoice.number", label: "Invoice number", type: "text", required: true, placeholder: "INV-0001" },
        { key: "invoice.currency", label: "Currency", type: "select", options: CURRENCIES },
        { key: "extras.subject", label: "Subject line", type: "text", full: true, placeholder: "e.g. Application approval fee" },
        { key: "invoice.issueDate", label: "Invoice date", type: "date", required: true },
        { key: "extras.dueTerms", label: "Due", type: "select", options: ["On Receipt", "Net 7", "Net 14", "Net 30", "Specific date"] },
        { key: "invoice.dueDate", label: "Due date", type: "date", showIf: { key: "extras.dueTerms", equals: "Specific date" } },
        { key: "invoice.paymentMethod", label: "Payment method", type: "text", placeholder: "e.g. Bank transfer" },
      ],
    },
    { id: "items", title: "Itemization", kind: "items" },
    {
      id: "closing",
      title: "Payment and notes",
      fields: [
        { key: "payment.details", label: "Account details for payment", type: "textarea", full: true, placeholder: "Bank name, account number, etc." },
        { key: "invoice.notes", label: "Notes", type: "textarea", full: true },
        
      ],
    },
        {
      id: "signature",
      title: "Signature",
      fields: [
        { key: "extras.showSignature", label: "Show signature area on the invoice", type: "checkbox", full: true },
        { key: "extras.signerName", label: "Name", type: "text", placeholder: "e.g. Jane Doe", showIf: { key: "extras.showSignature", equals: true } },
        { key: "extras.signerTitle", label: "Title (optional)", type: "text", placeholder: "e.g. Managing Director", showIf: { key: "extras.showSignature", equals: true } },
        { key: "extras.signatureImage", label: "Signature", type: "signature", full: true, showIf: { key: "extras.showSignature", equals: true } },
        { key: "extras.signatureDate", label: "Signature date", type: "date", showIf: { key: "extras.showSignature", equals: true } },
      ],
    },
  ],
};