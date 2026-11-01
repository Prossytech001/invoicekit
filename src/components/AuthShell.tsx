"use client";

import Link from "next/link";
import { useState } from "react";

export const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20";

export const buttonClass =
  "w-full rounded-full bg-emerald-900 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-xs font-medium text-gray-700">{children}</span>;
}

export function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {children}
    </p>
  );
}

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={`${inputClass} pr-10`} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {show ? (
            <>
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            </>
          ) : (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

function LogoMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900 text-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </svg>
    </span>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-2 font-semibold text-emerald-950">
          <LogoMark /> InvoiceKit
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Right: showcase panel (hidden on mobile) */}
      <aside className="relative hidden overflow-hidden bg-emerald-950 lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-white/[0.03]" />

        <div className="relative w-80">
          <div className="rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-emerald-900">INVOICE</span>
              <span className="text-xs text-gray-400">#INV-0042</span>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              {[
                ["Website design", "$1,800.00"],
                ["Brand guidelines", "$450.00"],
                ["Hosting (1 year)", "$200.00"],
              ].map(([label, amount]) => (
                <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-medium text-gray-900">{amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">Total due</span>
              <span className="text-lg font-bold text-emerald-900">$2,450.00</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-8 rounded-lg bg-white px-4 py-3 shadow-xl">
            <div className="text-[10px] uppercase tracking-wide text-gray-400">Status</div>
            <div className="text-sm font-semibold text-emerald-700">✓ Paid</div>
          </div>
        </div>

        <div className="relative mt-20 max-w-sm text-center">
          <h2 className="text-2xl font-semibold text-white">Invoices that look professional</h2>
          <p className="mt-3 text-sm leading-relaxed text-emerald-100/70">
            Pick a template, fill in your details, and download a polished PDF in minutes.
          </p>
          <div className="mt-6 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>
      </aside>
    </div>
  );
}