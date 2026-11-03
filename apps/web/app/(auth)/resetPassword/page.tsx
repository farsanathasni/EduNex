"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc]">
          <p className="text-gray-600">Loading reset password page...</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
