"use client";

import React, { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  useCreateStudentProfile,
  useStudentProfile,
} from "@/features/students/api/student-query";
import { studentProfileSchema } from "@/features/students/validation/student-profile-schema";
import { Department } from "@/features/departments/api/department";
import { useDepartment } from "@/features/departments/api/department-query";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const selectClass =
  "mt-1.5 w-full cursor-pointer appearance-none rounded-lg border border-border bg-surface px-3 py-2.5 pr-10 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-500";

const phoneClass =
  "mt-1.5 rounded-lg border border-border bg-surface px-3 py-0.5 text-label text-text transition hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 [&_input]:bg-transparent [&_input]:py-2 [&_input]:text-text [&_input]:outline-none [&_input::placeholder]:text-text-subtle";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

type FormErrors = Partial<
  Record<"admissionNumber" | "departmentId" | "semester" | "phone", string>
>;

/** Shape of the HTTP error we read from the mutation / query (axios-like). */
type ApiError = {
  response?: { status?: number; data?: { message?: string } };
};

function toApiError(error: unknown): ApiError {
  return typeof error === "object" && error !== null
    ? (error as ApiError)
    : {};
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

function Banner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`relative overflow-hidden rounded-3xl bg-brand text-text-on-primary shadow-lg ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10"
      />
      <div className="relative z-10">{children}</div>
    </header>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card padding="lg">
      <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-subheading font-bold text-text">{title}</h2>
          <p className="text-caption text-text-muted">{description}</p>
        </div>
      </div>
      <dl className="grid gap-5 sm:grid-cols-2">{children}</dl>
    </Card>
  );
}

function ProfileDetail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="min-w-0">
      <dt className="text-caption font-medium text-text-muted">{label}</dt>
      <dd
        className={`mt-1 break-words text-label ${
          hasValue ? "font-semibold text-text" : "text-text-subtle"
        }`}
      >
        {hasValue ? value : "Not provided"}
      </dd>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1.5 text-caption text-red-600">
      {message}
    </p>
  );
}

function Required() {
  return (
    <span className="ml-1 text-accent" aria-hidden="true">
      *
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function StudentProfile() {
  const router = useRouter();
  const profileQuery = useStudentProfile();
  const createProfile = useCreateStudentProfile();

  const departmentQuery = useDepartment();

  const departments: Department[] = Array.isArray(departmentQuery.data)
    ? departmentQuery.data
    : [];

  const [formData, setFormData] = useState({
    admissionNumber: "",
    departmentId: "",
    semester: "",
    phone: undefined as string | undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setServerError("");
    createProfile.reset();
  };

  const handlePhoneChange = (value?: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    setErrors((prev) => ({
      ...prev,
      phone: undefined,
    }));

    setServerError("");
    createProfile.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = studentProfileSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          field in formData &&
          !fieldErrors[field as keyof FormErrors]
        ) {
          fieldErrors[field as keyof FormErrors] = issue.message;
        }
      }

      setErrors(fieldErrors);
      setServerError("");
      return;
    }

    if (!formData.phone || !isPossiblePhoneNumber(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Enter a valid international phone number.",
      }));
      return;
    }

    setErrors({});
    setServerError("");

    createProfile.mutate(
      {
        admissionNumber: validation.data.admissionNumber,
        departmentId: validation.data.departmentId,
        semester: validation.data.semester,
        phone: validation.data.phone,
      },
      {
        onSuccess: () => {
          router.push("/studentDashboard");
        },
        onError: (error: unknown) => {
          const { response } = toApiError(error);
          const status = response?.status;
          const message = response?.data?.message;

          if (status === 409) {
            setErrors((prev) => ({
              ...prev,
              admissionNumber:
                message || "This student profile already exists.",
            }));
            return;
          }

          setServerError(
            message || "Unable to save your profile. Please try again.",
          );
        },
      },
    );
  };

  /* ------------------------------ Loading ------------------------------ */

  if (profileQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-roobert">
        <Card role="status" className="text-center" padding="lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-subtle border-t-primary" />
          <p className="text-label font-medium text-text-muted">
            Loading your student profile...
          </p>
        </Card>
      </main>
    );
  }

  /* ------------------------------- Error ------------------------------- */

  if (profileQuery.isError) {
    const status = toApiError(profileQuery.error).response?.status;

    if (status !== 404) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 font-roobert">
          <Card
            role="alert"
            padding="lg"
            className="flex max-w-md flex-col items-center px-6 py-12 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-subheading font-bold text-text">
              Unable to load your student profile
            </h1>
            <p className="mt-2 text-label text-text-muted">
              Check your connection and try again.
            </p>
            <Button
              type="button"
              className="mt-6"
              onClick={() => profileQuery.refetch()}
            >
              Try again
            </Button>
          </Card>
        </main>
      );
    }
  }

  /* --------------------------- Existing profile --------------------------- */

  if (profileQuery.data?.success && profileQuery.data.data) {
    const profile = profileQuery.data.data;

    const initials = profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase();

    return (
      <main className="min-h-screen bg-background px-4 py-8 font-roobert text-text sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Banner */}
          <Banner className="px-6 py-8 sm:px-10 sm:py-10">
            <p className="mb-5 text-label font-semibold text-white/80">
              Student portal
            </p>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                aria-hidden="true"
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-heading font-extrabold backdrop-blur-sm"
              >
                {initials || "ST"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="break-words text-display-sm font-extrabold tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-caption font-semibold text-white">
                    Active student
                  </span>
                </div>

                <p className="mt-1.5 break-all text-label text-white/80">
                  {profile.email}
                </p>
                <p className="mt-1 text-caption text-white/70">
                  Admission no. {profile.admissionNumber}
                </p>
              </div>

              <div className="w-fit shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-caption text-white/80">Current semester</p>
                <p className="mt-1 text-heading font-extrabold leading-none">
                  {profile.semester ?? "—"}
                </p>
              </div>
            </div>
          </Banner>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              icon={<User className="h-5 w-5" />}
              title="Personal information"
              description="Your registered contact details"
            >
              <ProfileDetail label="Full name" value={profile.name} />
              <ProfileDetail label="Email address" value={profile.email} />
              <ProfileDetail label="Phone number" value={profile.phone} />
            </SectionCard>

            <SectionCard
              icon={<GraduationCap className="h-5 w-5" />}
              title="Academic information"
              description="Your college and department details"
            >
              <ProfileDetail
                label="Department"
                value={profile.departmentName}
              />
              <ProfileDetail
                label="Current semester"
                value={profile.semester ? `Semester ${profile.semester}` : null}
              />
              <ProfileDetail
                label="Admission number"
                value={profile.admissionNumber}
              />
            </SectionCard>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => profileQuery.refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh profile
            </Button>

            <Button
              type="button"
              onClick={() => router.push("/studentDashboard")}
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="pb-4 text-center text-caption text-text-subtle">
            EduNex · Connecting students, faculty and campus life.
          </p>
        </div>
      </main>
    );
  }

  /* --------------------------- Create profile form --------------------------- */

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-roobert text-text sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <Banner className="px-6 pb-20 pt-8 sm:px-10 sm:pt-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
            <GraduationCap className="h-4 w-4" />
            EduNex · Student profile
          </p>
          <h1 className="mt-4 text-display-sm font-extrabold tracking-tight">
            Complete your student profile
          </h1>
          <p className="mt-3 text-body leading-relaxed text-white/80">
            Just a few more details to get your campus journey started.
          </p>
        </Banner>

        <Card
          padding="lg"
          className="relative z-10 -mt-12 mx-3 shadow-lg sm:mx-6"
        >
          <div className="mb-5 border-b border-border-subtle pb-4">
            <h2 className="text-subheading font-bold text-text">
              Academic details
            </h2>
            <p className="mt-1 text-label text-text-muted">
              Enter your official college details below. All fields are
              required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Admission number */}
            <div>
              <label
                htmlFor="admissionNumber"
                className="text-label font-semibold text-text"
              >
                Admission number
                <Required />
              </label>

              <Input
                id="admissionNumber"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                placeholder="e.g. EDU2026001"
                autoComplete="off"
                required
                aria-invalid={!!errors.admissionNumber}
                aria-describedby={
                  errors.admissionNumber ? "admissionNumber-error" : undefined
                }
                className="mt-1.5 aria-[invalid=true]:border-red-500"
              />

              {errors.admissionNumber ? (
                <FieldError
                  id="admissionNumber-error"
                  message={errors.admissionNumber}
                />
              ) : (
                <p className="mt-1.5 text-caption text-text-subtle">
                  Enter the admission number issued by your college.
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="departmentId"
                className="text-label font-semibold text-text"
              >
                Department
                <Required />
              </label>

              <div className="relative">
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.departmentId}
                  aria-describedby={
                    errors.departmentId ? "departmentId-error" : undefined
                  }
                  className={selectClass}
                >
                  <option value="">Choose your department</option>

                  {departments.map((department: Department) => (
                    <option key={department.id} value={String(department.id)}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 mt-[3px] h-4 w-4 -translate-y-1/2 text-text-subtle"
                />
              </div>

              {departmentQuery.isLoading && (
                <p className="mt-1.5 text-caption text-text-muted">
                  Loading departments...
                </p>
              )}

              {departmentQuery.isError && (
                <p role="alert" className="mt-1.5 text-caption text-red-600">
                  Unable to load departments. Please try again.
                </p>
              )}

              <FieldError id="departmentId-error" message={errors.departmentId} />
            </div>

            {/* Semester */}
            <div>
              <label
                htmlFor="semester"
                className="text-label font-semibold text-text"
              >
                Current semester
                <Required />
              </label>

              <div className="relative">
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.semester}
                  aria-describedby={
                    errors.semester ? "semester-error" : undefined
                  }
                  className={selectClass}
                >
                  <option value="">Choose your semester</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 mt-[3px] h-4 w-4 -translate-y-1/2 text-text-subtle"
                />
              </div>

              <FieldError id="semester-error" message={errors.semester} />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-label font-semibold text-text"
              >
                Phone number
                <Required />
              </label>

              <PhoneInput
                id="phone"
                international
                defaultCountry="IN"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                autoComplete="tel"
                className={phoneClass}
              />

              <FieldError id="phone-error" message={errors.phone} />
            </div>

            {(serverError || createProfile.isError) && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-label text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Unable to save your profile</p>
                  <p className="mt-0.5">
                    {serverError || "Please check your details and try again."}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={createProfile.isPending}
              className="w-full"
              size="lg"
            >
              {createProfile.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving profile...
                </>
              ) : (
                <>
                  Save profile
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-caption leading-relaxed text-text-subtle">
              Your information will be saved to your EduNex student profile.
            </p>
          </form>
        </Card>

        <p className="mt-6 text-center text-caption text-text-subtle">
          EduNex · Connecting students, faculty and campus life.
        </p>
      </div>
    </main>
  );
}
