
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  principalLoginSchema,
  type PrincipalLoginInput,
} from "@/validation/principal-login-schema";

import { getPrincipalDashboard } from "@/lib/principal";

export default function PrincipalLoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrincipalLoginInput>({
    resolver: zodResolver(principalLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit = async (data: PrincipalLoginInput) => {
  setLoginError("");

  let loginSucceeded = false;

  try {
    
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setLoginError(
        result.error.message || "Login failed. Please try again.",
      );
      return;
    }

    loginSucceeded = true;

    
    const dashboardResult = await getPrincipalDashboard();

    if (!dashboardResult.success) {
      await authClient.signOut();
      setLoginError(
        dashboardResult.message ||
          "Your account does not have Principal access.",
      );
      return;
    }

    
    router.replace("/principal");
    router.refresh();
  } catch (error) {
    if (loginSucceeded) {
      await authClient.signOut();
    }

    const apiError = error as {
      response?: {
        status?: number;
        data?: { message?: string };
      };
    };

    const status = apiError.response?.status;
    const message = apiError.response?.data?.message;

    if (status === 403) {
      setLoginError(
        "Your account does not have active Principal permissions.",
      );
    } else if (status === 401) {
      setLoginError(
        "Your session could not be verified. Please sign in again.",
      );
    } else if (status) {
      setLoginError(
        message || "Unable to verify Principal access. Please try again.",
      );
    } else {
      setLoginError(
        "Unable to log in or verify Principal access. Please check your connection.",
      );
    }
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            E
          </div>

          <h1 className="text-2xl font-bold text-text">EduNex</h1>

          <p className="mt-2 text-sm text-text-muted">
            Principal Administration Portal
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Sign in to access your Principal dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-text"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "principal-email-error" : undefined}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {errors.email && (
              <p
                id="principal-email-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "principal-password-error" : undefined
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {errors.password && (
              <p
                id="principal-password-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          Authorized Principal access only.
        </p>
      </div>
    </main>
  );
}
