"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "@/validation/login-schema";

import Button from "@/app/ui/button";
import Card from "@/app/ui/card";
import Input from "@/app/ui/input";

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
        setServerError(error.message || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError(
        "Unable to log in. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            E
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-text">
            Welcome to EduNex
          </h1>

          <p className="mt-2 text-sm text-text-muted">
            Sign in to access your campus dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-text"
            >
              Email address
            </label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className="w-full"
            />

            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-600">
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

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
              className="w-full"
            />

            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-5 border-t border-border-subtle pt-5 text-center">
          <p className="text-sm text-text-muted">
            Are you a teacher?{" "}
            <Link
              href="/teacher-login"
              className="font-semibold text-primary hover:underline"
            >
              Teacher Login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-text-subtle">
          © {new Date().getFullYear()} EduNex Campus Management
        </p>
      </Card>
    </main>
  );
}