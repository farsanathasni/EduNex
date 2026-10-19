
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import {
  type LoginFormValues,
  loginSchema,
} from "@/validation/login-schema";

import Button from "@/app/ui/button";
import Card from "@/app/ui/card";
import Input from "@/app/ui/input";

type RoleLoginFormProps = {
  title: string;
  description: string;
  dashboardPath: string;
};

export default function RoleLoginForm({
  title,
  description,
  dashboardPath,
}: RoleLoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      router.push(dashboardPath);
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

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            EduNex Campus
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-text">
            {title}
          </h1>

          <p className="mt-2 text-sm text-text-muted">{description}</p>
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
              Work email
            </label>

            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@college.edu"
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

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
                className="w-full pr-20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

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
            {isSubmitting ? "Signing in..." : "Sign in to EduNex"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-subtle">
          Your account is provided by your institution. Public registration is
          not available.
        </p>

        <p className="mt-5 border-t border-border-subtle pt-5 text-center text-xs text-text-subtle">
          © {new Date().getFullYear()} EduNex Campus Management
        </p>
      </Card>
    </main>
  );
}
