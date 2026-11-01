"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = new FormData(e.currentTarget);
    try {
      await api(isRegister ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: f.get("email"),
          password: f.get("password"),
          ...(isRegister ? { displayName: f.get("displayName") || undefined } : {}),
        }),
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-bold">{isRegister ? "Create your account" : "Welcome back"}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isRegister && (
          <label className="block text-sm font-medium">Name (optional)
            <input name="displayName" type="text" autoComplete="name" className={input} />
          </label>
        )}
        <label className="block text-sm font-medium">Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block text-sm font-medium">Password
          <input name="password" type="password" required minLength={isRegister ? 8 : 1} maxLength={72}
            autoComplete={isRegister ? "new-password" : "current-password"} className={input} />
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        {isRegister ? "Already have an account? " : "New here? "}
        <Link className="text-blue-600 underline" href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </main>
  );
}
