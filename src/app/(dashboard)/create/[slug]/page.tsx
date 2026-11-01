import { notFound } from "next/navigation";
import InvoiceEditor from "@/components/editor/InvoiceEditor";
import { getTemplate } from "@/templates/registry";

export default async function CreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { slug } = await params;
  const { new: isNew } = await searchParams;
  if (!getTemplate(slug)) notFound();
  return <InvoiceEditor templateId={slug} isNew={isNew === "1"} />;
}