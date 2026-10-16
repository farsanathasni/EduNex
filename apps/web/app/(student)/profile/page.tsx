
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateStudentProfile,
  useStudentProfile,
} from "../studentQuery";
import Card from "@/app/ui/card";
import Button from "@/app/ui/button";
import Input from "@/app/ui/input";
import PageHeader from "@/app/ui/pageHeader";



const departments = [
  { id: "1", name: "Computer Science and Engineering (CSE)" },
  { id: "2", name: "Electronics and Communication Engineering (ECE)" },
  { id: "3", name: "Mechanical Engineering (ME)" },
  { id: "4", name: "Commerce (B.Com)" },
  { id: "5", name: "Business Administration (BBA)" },
  { id: "6", name: "Mathematics (B.Sc Mathematics)" },
  { id: "7", name: "English (BA English)" },
  { id: "8", name: "Physics (B.Sc Physics)" },
  { id: "9", name: "Chemistry (B.Sc Chemistry)" },
  { id: "10", name: "Economics (BA Economics)" },
  { id: "11", name: "Malayalam (BA Malayalam)" },
  {
    id: "12",
    name: "Artificial Intelligence and Data Science (B.Sc AI & DS)",
  },
];

const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

const selectClass =
  "mt-1.5 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function StudentProfile() {
  const router = useRouter();
  const profileQuery = useStudentProfile();
  const createProfile = useCreateStudentProfile();

  const [formData, setFormData] = useState({
    admissionNumber: "",
    departmentId: "",
    semester: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createProfile.mutate(formData, {
      onSuccess: () => router.push("/dashboard"),
    });
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
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-3 py-4 font-roobert text-text sm:px-4 sm:py-6">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-subtle blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary-hover/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Header */}
        
{/* Reusable Page Header */}
{/* Reusable Page Header */}
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



        {/* Progress indicator */}
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

        {/* Form card */}
        <Card padding="md">
          <div className="mb-5 border-b border-border-subtle pb-4">
            <h2 className="text-subheading font-bold text-text">
              Academic details
            </h2>

            <p className="mt-1 text-label text-text-muted">
              Enter your official college details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admission number */}
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
                className="mt-1.5"
              />

              <p className="mt-1.5 text-caption text-text-subtle">
                Enter the admission number issued by your college.
              </p>
            </div>

            {/* Department */}
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
                className={selectClass}
              >
                <option value="">Choose your department</option>

                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
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
                className={selectClass}
              >
                <option value="">Choose your semester</option>

                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-label font-semibold text-text"
              >
                Phone number
                <span className="ml-1 text-red-500">*</span>
              </label>

              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
                className="mt-1.5"
              />
            </div>

            {/* Error state */}
            {createProfile.isError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <p className="font-semibold">
                  Unable to save your profile
                </p>

                <p className="mt-1">
                  Please check your details and try again.
                </p>
              </div>
            )}

            {/* Submit */}
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
