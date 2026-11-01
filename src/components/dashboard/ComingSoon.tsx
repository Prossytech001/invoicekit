export default function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <p className="font-semibold text-emerald-950">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{text}</p>
    </div>
  );
}