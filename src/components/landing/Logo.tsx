export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#b8d95d" />
      <path d="M10 7.5h9l4.5 4.5v12a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1Z" fill="#1a3d39" />
      <path d="M12.8 17.6l2.5 2.5 4.6-4.9" stroke="#b8d95d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function Logo({ dark = false, size = 30 }: { dark?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className={`font-display text-xl font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}>Invoice Kit</span>
    </span>
  );
}
