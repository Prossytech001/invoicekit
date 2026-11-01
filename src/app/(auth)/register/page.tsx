"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthShell, { buttonClass, ErrorBox, FieldLabel, inputClass, PasswordInput } from "@/components/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("email");
    if (e) setEmail(e);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    setError("");
    setBusy(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, displayName: name }),
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-900 underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <ErrorBox>{error}</ErrorBox>}
        <label className="block">
          <FieldLabel>Your name</FieldLabel>
          <input className={inputClass} required autoComplete="name" placeholder="Your name"
            value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input className={inputClass} type="email" required autoComplete="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <PasswordInput required minLength={8} maxLength={72} autoComplete="new-password" placeholder="At least 8 characters"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className={buttonClass} disabled={busy}>{busy ? "Creating..." : "Sign Up"}</button>
      </form>
    </AuthShell>
  );
}