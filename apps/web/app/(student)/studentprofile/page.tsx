
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateStudentProfile,
  useStudentProfile,
} from "../studentQuery";

// import { studentProfileSchema } from "@/lib/validations/studentProfileSchema";

import Card from "@/app/ui/card";
import Button from "@/app/ui/button";
import Input from "@/app/ui/input";
import PageHeader from "@/app/ui/pageHeader";
import { studentProfileSchema } from "@/validation/student-validation";
import { Department } from "@/lib/department";
import { useDepartment } from "@/app/(department)/departmentQuery";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const selectClass =
  "mt-1.5 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type FormErrors = Partial<
  Record<
    "admissionNumber" | "departmentId" | "semester" | "phone",
    string
  >
>;

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (
  !formData.phone ||
  !isPossiblePhoneNumber(formData.phone)
) {
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
        onError: (error: any) => {
          const status = error.response?.status;
          const message = error.response?.data?.message;

          if (status === 409) {
            setErrors((prev) => ({
              ...prev,
              admissionNumber:
                message || "This student profile already exists.",
            }));
            return;
          }

          setServerError(
            message || "Unable to save your profile. Please try again."
          );
        },
      }
    );
  };

  if (profileQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-roobert">
        <Card className="text-center" padding="lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-subtle border-t-primary" />
          <p className="text-label font-medium text-text-muted">
            Loading your student profile...
          </p>
        </Card>
      </main>
    );
  }

  if (profileQuery.isError) {
    const status = (profileQuery.error as any).response?.status;

    if (status !== 404) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
          <Card padding="lg" className="text-center">
            <p className="text-text">
              Unable to load your student profile.
            </p>
            <Button
              type="button"
              className="mt-4"
              onClick={() => profileQuery.refetch()}
            >
              Try again
            </Button>
          </Card>
        </main>
      );
    }
  }

  if (profileQuery.data?.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-roobert">
        <Card className="w-full max-w-md text-center" padding="lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-3xl text-primary">
            ✓
          </div>

          <h1 className="text-heading-sm font-bold text-text">
            Profile Already Exists
          </h1>

          <p className="mt-2 text-label text-text-muted">
            Your student profile is already set up.
          </p>

          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => router.push("/studentDashboard")}
          >
            Go to Dashboard
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-3 py-4 font-roobert text-text sm:px-4 sm:py-6">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-subtle blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary-hover/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        <PageHeader
          className="mb-5"
          eyebrow="EduNex · Campus Management"
          title={
            <>
              Complete Your{" "}
              <span className="text-primary">Student Profile</span>
            </>
          }
          description="Just a few more details to get your campus journey started."
        />

        <Card className="mb-5 flex items-center gap-3" padding="sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-xl">
            🎓
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label font-semibold text-text">
                Student information
              </p>
              <span className="text-caption font-medium text-primary">
                Profile setup
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary-hover">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="mb-5 border-b border-border-subtle pb-4">
            <h2 className="text-subheading font-bold text-text">
              Academic details
            </h2>
            <p className="mt-1 text-label text-text-muted">
              Enter your official college details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="admissionNumber"
                className="text-label font-semibold text-text"
              >
                Admission number
                <span className="ml-1 text-red-500">*</span>
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
                  errors.admissionNumber
                    ? "admissionNumber-error"
                    : undefined
                }
                className="mt-1.5"
              />

              {errors.admissionNumber ? (
                <p id="admissionNumber-error" className="mt-1 text-sm text-red-600">
                  {errors.admissionNumber}
                </p>
              ) : (
                <p className="mt-1.5 text-caption text-text-subtle">
                  Enter the admission number issued by your college.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="departmentId"
                className="text-label font-semibold text-text"
              >
                Department
                <span className="ml-1 text-red-500">*</span>
              </label>

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

{departmentQuery.isLoading && (
  <p className="mt-1 text-sm text-text-muted">
    Loading departments...
  </p>
)}

{departmentQuery.isError && (
  <p className="mt-1 text-sm text-red-600">
    Unable to load departments. Please try again.
  </p>
)}

{errors.departmentId && (
  <p id="departmentId-error" className="mt-1 text-sm text-red-600">
    {errors.departmentId}
  </p>
)}
            </div>

            <div>
              <label
                htmlFor="semester"
                className="text-label font-semibold text-text"
              >
                Current semester
                <span className="ml-1 text-red-500">*</span>
              </label>

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

              {errors.semester && (
                <p id="semester-error" className="mt-1 text-sm text-red-600">
                  {errors.semester}
                </p>
              )}
            </div>

            <div>
  <label
    htmlFor="phone"
    className="text-label font-semibold text-text"
  >
    Phone number
    <span className="ml-1 text-red-500">*</span>
  </label>

  <PhoneInput
    id="phone"
    international
    defaultCountry="IN"
    value={formData.phone}
    onChange={handlePhoneChange}
    placeholder="Enter phone number"
    autoComplete="tel"
    className="mt-1.5"
  />

  {errors.phone && (
    <p className="mt-1 text-sm text-red-600">
      {errors.phone}
    </p>
  )}
</div>

            {(serverError || createProfile.isError) && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <p className="font-semibold">
                  Unable to save your profile
                </p>
                <p className="mt-1">
                  {serverError || "Please check your details and try again."}
                </p>
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
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                  Saving profile...
                </>
              ) : (
                <>
                  Save Profile
                  <span aria-hidden="true">→</span>
                </>
              )}
            </Button>

            <p className="text-center text-caption leading-relaxed text-text-subtle">
              Your information will be saved to your EduNex student profile.
            </p>
          </form>
        </Card>

        <p className="mt-5 text-center text-caption text-text-subtle">
          EduNex · Connecting students, faculty, and campus life.
        </p>
      </div>
    </main>
  );
}
