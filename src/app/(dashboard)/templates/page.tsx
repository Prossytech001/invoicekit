import TemplateCard from "@/components/templates/TemplateCard";
import { templates } from "@/templates/registry";

// Each card shows a picture of the real design. Search and filters can be added on top of this later.
export default function TemplatesPage() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map(({ manifest }) => (
        <TemplateCard key={manifest.id} templateId={manifest.id} />
      ))}
    </div>
  );
}