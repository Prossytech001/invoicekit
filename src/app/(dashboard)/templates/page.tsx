import Link from "next/link";
import { templates } from "@/templates/registry";

// Basic list for now; the full gallery (previews, search, filters) comes next.
export default function TemplatesPage() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map(({ manifest }) => (
        <div key={manifest.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-emerald-950">{manifest.name}</h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-800">
              {manifest.access}
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm text-gray-600">{manifest.description}</p>
          <p className="mt-3 text-xs text-gray-400">{manifest.category}</p>
          <Link
            href={`/create/${manifest.id}?new=1`}
            className="mt-4 rounded-full bg-emerald-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Use This Template
          </Link>
        </div>
      ))}
    </div>
  );
}