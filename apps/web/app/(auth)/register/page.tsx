"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import {
  RegisterFormValues,
  registerSchema,
} from "@/validation/register-schema";

import Button from "@/app/ui/button";
import Card from "@/app/ui/card";
import Input from "@/app/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleRegister(values: RegisterFormValues) {
    setMessage("");
    setIsSuccess(false);

    try {
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setMessage(error.message || "Registration failed.");
        return;
      }

      setIsSuccess(true);
      setMessage("Account created successfully!");

      router.push("/profile");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg border border-border bg-surface p-6 shadow-lg sm:p-10">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            E
          </div>

          <div>
            <h1 className="text-2xl font-bold text-text">EduNex</h1>
            <p className="text-xs tracking-wider text-text-muted">
              CAMPUS MANAGEMENT
            </p>
          </div>
        </Link>

        <h2 className="text-heading font-bold text-text">
          Create your account
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Join your campus community.
        </p>

        <form
          onSubmit={handleSubmit(handleRegister)}
          noValidate
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-text"
            >
              Full name
            </label>

            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              className="w-full"
            />

            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

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
              <p id="email-error" className="mt-1 text-sm text-red-600">
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
              className="w-full"
            />

            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {message && (
            <p
              role={isSuccess ? "status" : "alert"}
              className={`rounded-xl border p-3 text-sm ${
                isSuccess
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}