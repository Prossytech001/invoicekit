"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthShell, { buttonClass, ErrorBox, FieldLabel, inputClass, PasswordInput } from "@/components/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
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
      title="Welcome back"
      subtitle={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-emerald-900 underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <ErrorBox>{error}</ErrorBox>}
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input className={inputClass} type="email" required autoComplete="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <PasswordInput required autoComplete="current-password" placeholder="Password" maxLength={72}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className={buttonClass} disabled={busy}>{busy ? "Signing in..." : "Sign In"}</button>
      </form>
    </AuthShell>
  );
}