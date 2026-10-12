
"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
      const router=useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "Login failed");
        return;
      }

      setMessage("Login successful!");
      router.push("/dashbord")
      // Add role-based dashboard redirect after login.
    } catch {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-cyan-100/60 sm:p-10">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-xl font-bold text-white">
            E
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">EduNex</h1>
            <p className="text-xs tracking-wider text-slate-500">
              CAMPUS MANAGEMENT
            </p>
          </div>
        </Link>

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome back!
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to continue your campus journey.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-cyan-700 hover:text-cyan-800"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50"
              required
            />
          </div>

          {message && (
            <p role="status" className="text-sm text-slate-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-700 hover:underline"
          >
            Create account
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-slate-400">
          © EduNex · Campus, connected.
        </p>
      </section>
    </main>
  );
}
