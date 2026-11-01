import Link from "next/link";
import Reveal from "./Reveal";
import MiniInvoice, { Variant } from "./MiniInvoice";
import Logo from "./Logo";

/* ---------- strip under the hero ---------- */
export function Strip() {
  const items = ["PDF invoices in seconds", "Send from your own address", "Real delivery tracking", "Works on phone and desktop"];
  return (
    <section className="bg-ink-deep pb-10 pt-2 text-white/70">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 px-4 text-sm">
        {items.map((t) => (
          <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-lime" />{t}</li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- how it works ---------- */
const steps = [
  { t: "Choose a design", d: "Browse invoice templates and switch between them at any time. Your details stay put." },
  { t: "Add your details", d: "Fill in your business, your customer and your items. Totals, discounts and tax are worked out for you." },
  { t: "Send or download", d: "Download the PDF, or attach it to an email and send it to your client straight away." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">From blank page to sent invoice in three steps</h2>
        </Reveal>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 120}>
                <div className="card h-full p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-lime font-display text-lg font-semibold text-ink">{i + 1}</span>
                  <h3 className="mt-5 text-xl font-semibold">{s.t}</h3>
                  <p className="mt-2 text-muted">{s.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- template gallery ---------- */
const gallery: { v: Variant; name: string; note: string; scale?: boolean }[] = [
  { v: "modern", name: "Modern", note: "Clean blue accent" },
  { v: "corporate", name: "Corporate", note: "Traditional serif layout" },
  { v: "minimalist", name: "Minimalist", note: "Stripped-back design", scale: true },
  { v: "freelancer", name: "Freelancer", note: "Fresh and simple" },
  { v: "creative", name: "Creative", note: "Warm and bold" },
];

export function Templates() {
  return (
    <section id="templates" className="relative overflow-hidden bg-ink-deep py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(184,217,93,0.16),transparent)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h4 className="text-3xl font-semibold text-white md:text-5xl">Pick a style. Keep your details.</h4>
            <p className="mt-4 text-white/70">Every template uses the same information, so you can switch designs and see the change instantly without typing anything again.</p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="-mx-4 mt-14 overflow-x-auto px-4 pb-4 [scrollbar-width:none]">
            <ul className="mx-auto flex min-w-max items-end justify-center gap-6 pt-6 md:gap-8">
              {gallery.map((g) => (
                <li key={g.v} className={`flex flex-col items-center ${g.scale ? "md:-translate-y-4" : ""}`}>
                  <div className="relative">
                    <div className="spot pointer-events-none absolute -top-6 left-1/2 h-40 w-[220px] -translate-x-1/2 -translate-y-full" aria-hidden="true" />
                    <div className={`template-card ${g.scale ? "md:scale-110" : ""}`}><MiniInvoice variant={g.v} /></div>
                  </div>
                  <div className="plaque mt-6 w-[168px] rounded-sm px-3 py-2 text-center">
                    <div className="text-sm font-bold">{g.name}</div>
                    <div className="text-xs italic opacity-75">{g.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="mt-6 text-center text-sm text-white/50">Sample content shown. Your own business and customer details fill the template.</p>
      </div>
    </section>
  );
}

/* ---------- features ---------- */
function Tile({ className = "", title, text, children }: { className?: string; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className={`card flex flex-col overflow-hidden p-6 ${className}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-muted">{text}</p>
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-sage py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal><h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">Everything between “new invoice” and “paid”</h2></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <Tile className="h-full" title="Write the email. Attach the invoice." text="Start an email, then attach an existing invoice or create a new one in a side panel. Your draft stays exactly as you left it, and the new invoice attaches itself.">
              <div className="rounded-lg border border-line bg-paper p-4 text-sm">
                <div className="flex gap-2 border-b border-line pb-2"><span className="text-muted">To</span><span>client@example.com</span></div>
                <div className="flex gap-2 border-b border-line py-2"><span className="text-muted">Subject</span><span>Invoice INV-0042 from Studio Northwind</span></div>
                <div className="space-y-2 py-3"><div className="h-2 w-5/6 rounded bg-line" /><div className="h-2 w-2/3 rounded bg-line" /></div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-sage px-2.5 py-1 text-xs font-medium">INV-0042.pdf</span>
                  <span className="btn-primary pointer-events-none !py-1.5">Send</span>
                </div>
              </div>
            </Tile>
          </Reveal>
          <Reveal delay={100} className="md:col-span-2">
            <Tile className="h-full" title="Send from your own address" text="Verify your domain once and clients see your address, with no platform name in sight.">
              <div className="rounded-lg border border-line bg-paper p-3 text-sm">
                <div className="text-xs text-muted">From</div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate font-medium">billing@yourbusiness.com</span>
                  <span className="rounded-full bg-ok/10 px-2 py-0.5 text-xs font-medium text-ok">Verified</span>
                </div>
              </div>
            </Tile>
          </Reveal>
          <Reveal className="md:col-span-2">
            <Tile className="h-full" title="Honest delivery status" text="“Accepted” and “Delivered” are different things. You only see Delivered when the other server confirms it.">
              <ol className="space-y-3 text-sm">
                {[["Accepted", "10:02", true], ["Delivered", "10:02", true], ["Opened by client", "", false]].map(([a, b, on]) => (
                  <li key={a as string} className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${on ? "bg-ok" : "border border-line bg-white"}`} />
                    <span className={on ? "font-medium" : "text-muted"}>{a as string}</span>
                    <span className="ml-auto text-muted">{b as string}</span>
                  </li>
                ))}
              </ol>
            </Tile>
          </Reveal>
          <Reveal delay={100} className="md:col-span-2">
            <Tile className="h-full" title="PDFs that run to many pages" text="Long invoices break cleanly across pages, and issued invoices are locked so the record never changes.">
              <div className="relative h-24">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="absolute h-20 w-16 rounded border border-line bg-white shadow-sm" style={{ left: `${i * 26}px`, top: `${i * 4}px`, zIndex: 3 - i }}>
                    <div className="m-2 space-y-1.5"><div className="h-1.5 rounded bg-lime" /><div className="h-1 rounded bg-line" /><div className="h-1 rounded bg-line" /></div>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>
          <Reveal delay={200} className="md:col-span-2">
            <Tile className="h-full" title="Customers and files in one place" text="Save customers once and fill invoices and emails in a click. Keep uploads and every invoice PDF together.">
              <div className="flex flex-wrap gap-2 text-sm">
                {["Adaeze Foods", "Northwind Ltd", "Lagos Logistics", "K. Mensah"].map((c) => <span key={c} className="rounded-full border border-line bg-paper px-3 py-1">{c}</span>)}
              </div>
            </Tile>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- pricing ---------- */
const plans = [
  { name: "Free", note: "Everything you need to start", live: true, items: ["Selected invoice and email templates", "Up to 100 emails a month", "Unlimited PDF downloads", "Customers and document library"] },
  { name: "Pro", note: "For growing businesses", live: false, items: ["Premium templates", "Higher sending limits", "Custom branding", "Saved signatures and templates"] },
  { name: "Business", note: "For teams", live: false, items: ["Multiple business profiles", "Team collaboration", "Advanced reporting", "Priority support"] },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal><h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">Start free. Upgrade when you outgrow it.</h2></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div className={`flex h-full flex-col rounded-xl border p-6 ${p.live ? "border-ink bg-ink text-white" : "border-line bg-surface"}`}>
                <h3 className={`text-2xl font-semibold ${p.live ? "text-white" : ""}`}>{p.name}</h3>
                <p className={`mt-1 text-sm ${p.live ? "text-white/70" : "text-muted"}`}>{p.note}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2.5"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.live ? "bg-lime" : "bg-accent"}`} />{it}</li>
                  ))}
                </ul>
                {p.live ? <Link href="/register" className="btn-primary mt-8">Start free</Link> : <span className="btn-ghost pointer-events-none mt-8 opacity-70">Coming soon</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- final call to action + footer ---------- */
export function FinalCta() {
  return (
    <section className="bg-paper px-4 pb-20 md:pb-28">
      <Reveal>
        <div className="hero-bg relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-16 text-center text-white md:py-24">
          <div className="pulse-glow absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-lime/40 blur-3xl" aria-hidden="true" />
          <h4 className="mx-auto max-w-2xl text-3xl font-semibold text-lime md:text-5xl">Send your first invoice today</h4>
          <p className="mx-auto mt-4 max-w-md text-white/70">Create an account, pick a design and have a professional invoice ready for your client.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-primary px-7 py-3 text-base">Start free</Link>
            <Link href="/login" className="btn border border-white/30 px-7 py-3 text-base text-white hover:bg-white/10">Log in</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink-deep py-10 text-sm text-white/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
        <Logo dark size={26} />
        <nav className="flex gap-6" aria-label="Footer">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#templates" className="hover:text-white">Templates</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <Link href="/login" className="hover:text-white">Log in</Link>
        </nav>
        <span>© 2026 Invoice Kit</span>
      </div>
    </footer>
  );
}
