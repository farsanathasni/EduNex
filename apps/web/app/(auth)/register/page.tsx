
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { RegisterFormValues, registerSchema } from "@/validation/register-schema";


const departments = [
  "Computer Science",
  "Computer Science and Engineering",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Commerce",
  "Management",
];

const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

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
      department: "",
      semester: "",
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

      // Department and semester are not yet saved to the database.
      setIsSuccess(true);
      setMessage("Account created successfully!");

      router.push("/dashbord");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    }
  }

  const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50";
  const errorClass = "mt-1 text-sm text-red-600";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-cyan-100/60 sm:p-10">
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
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join your campus community.
        </p>

        <form
          onSubmit={handleSubmit(handleRegister)}
          noValidate
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              {...register("name")}
              placeholder="Enter your full name"
              autoComplete="name"
              className={inputClass}
            />
            {errors.name && (
              <p className={errorClass}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
              </label>
              <select {...register("department")} className={`${inputClass} bg-white`}>
                <option value="">Select department</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className={errorClass}>{errors.department.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Semester
              </label>
              <select {...register("semester")} className={`${inputClass} bg-white`}>
                <option value="">Select semester</option>
                {semesters.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className={errorClass}>{errors.semester.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={inputClass}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          {message && (
            <p
              role={isSuccess ? "status" : "alert"}
              className={`rounded-lg p-3 text-sm ${
                isSuccess
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
