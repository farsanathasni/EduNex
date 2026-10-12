
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "@/validation/login-schema";


export default function LoginPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setServerError("");

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setServerError(
          error.message || "Invalid email or password."
        );
        return;
      }

      // Redirect after successful login
      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError(
        "Unable to log in. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

        {/* Logo and heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-2xl font-bold text-white shadow-md">
            E
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome to EduNex
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your campus dashboard
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              {...register("email")}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
              }`}
            />

            {errors.email && (
              <p
                id="email-error"
                className="mt-1.5 text-sm text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
              }`}
            />

            {errors.password && (
              <p
                id="password-error"
                className="mt-1.5 text-sm text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline"
          >
            Create an account
          </Link>
        </p>

        {/* Teacher login link */}
        <div className="mt-5 border-t border-slate-100 pt-5 text-center">
          <p className="text-sm text-slate-500">
            Are you a teacher?{" "}
            <Link
              href="/teacher-login"
              className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
            >
              Teacher Login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} EduNex Campus Management
        </p>
      </div>
    </main>
  );
}
