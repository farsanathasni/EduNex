
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

const searchParams = useSearchParams();

const token = searchParams.get("token") || "";

  

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid or missing reset link. Please request a new email."
      );
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(
          result.error.message || "Unable to reset password."
        );
        return;
      }

      setSuccess(
        "Password created successfully! You can now log in."
      );
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-[#234c96]">
          Set Your Password
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Create a password for your EduNex account.
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success ? (
          <div>
            <p className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>

            <button
              type="button"
              onClick={() => router.push("/hod-login")}
              className="w-full rounded-lg bg-[#234c96] px-4 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Go to HOD Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your new password"
                minLength={8}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#234c96]"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                minLength={8}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#234c96]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-lg bg-[#234c96] px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Setting Password..." : "Create Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
