import CountUp from "./CountUp";
import Person from "./Person";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#17794f" />
      <path d="M5.8 10.4l2.8 2.8 5.6-5.8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero-bg relative isolate overflow-hidden pt-28 text-white md:pt-36">
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="beam pulse-glow absolute -left-24 top-8 -z-10 h-28 w-[620px] origin-left -rotate-[24deg] rounded-full bg-lime/50 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-4xl px-4 text-center">
        <h4 className="rise d1 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl">
          Create invoices. Send emails.<br /><span className="text-lime">All in one place.</span>
        </h4>
        <p className="rise d2 mx-auto mt-6 max-w-xl text-base text-white/75 md:text-lg">
          Pick a design, add your details and send the PDF to your client from your own email address, without ever leaving the page.
        </p>

        <form action="/register" method="get" className="rise d3 mx-auto mt-8 flex max-w-md items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1.5 backdrop-blur">
          <label htmlFor="hero-email" className="sr-only">Your email address</label>
          <input id="hero-email" name="email" type="email" required placeholder="Your email address" autoComplete="email"
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/50" />
          <button className="btn-primary rounded-full px-5 py-2.5">Get started free</button>
        </form>
        <p className="rise d3 mt-3 text-sm text-white/55">Free plan. No card needed.</p>
      </div>

      {/* Person between two floating cards */}
      <div className="rise d4 relative mx-auto mt-10 h-[430px] max-w-5xl md:mt-14 md:h-[540px]">
        <div className="pulse-glow absolute bottom-0 left-1/2 h-[88%] w-[78%] -translate-x-1/2 rounded-full bg-lime/30 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/2 h-[96%] -translate-x-1/2"><Person /></div>

        {/* left: paid invoice */}
        <div className="float-a absolute left-2 top-[34%] w-[168px] md:left-[5%] md:w-[236px]">
          <div className="glass rounded-2xl p-3.5 text-ink md:p-4">
            <div className="flex items-center justify-between text-xs text-muted md:text-sm">
              <span>INV-0042</span>
              <span className="flex items-center gap-1 rounded-full bg-ok/10 px-2 py-0.5 font-medium text-ok"><Check className="h-3.5 w-3.5" />Paid</span>
            </div>
            <div className="mt-2 font-display text-2xl font-semibold md:text-[32px]">₦<CountUp to={1360000} /></div>
            <svg viewBox="0 0 200 44" className="mt-2 h-9 w-full" aria-hidden="true">
              <path className="draw" d="M2 36 C30 34 40 20 64 24 S104 38 128 20 S170 6 198 8" fill="none" stroke="#2d7a5f" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="mt-1 text-xs text-muted">Sample Client Ltd</div>
          </div>
        </div>

        {/* right: delivered email */}
        <div className="float-b absolute right-2 top-[14%] w-[176px] md:right-[5%] md:w-[250px]">
          <div className="glass rounded-2xl p-3.5 text-ink md:p-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-lime">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Invoice INV-0042</div>
                <div className="truncate text-xs text-muted">to client@example.com</div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-sage px-2 py-1 text-xs font-medium">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#1a3d39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
              INV-0042.pdf
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ok"><Check className="h-4 w-4" />Delivered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
