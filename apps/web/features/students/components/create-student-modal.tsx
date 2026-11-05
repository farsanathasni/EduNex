"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useDepartment } from "@/features/departments/api/department-query";
import { useCreateManagedStudent } from "@/features/students/api/student-query";
import { studentCreateSchema } from "@/features/students/validation/student-management-schema";

export default function CreateStudentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const departmentQuery = useDepartment();
  const mutation = useCreateManagedStudent();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = studentCreateSchema.safeParse({ name, email, admissionNumber, departmentId, semester, phone });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") next[field] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    mutation.mutate({
      name: parsed.data.name,
      email: parsed.data.email,
      admissionNumber: parsed.data.admissionNumber,
      departmentId: Number(parsed.data.departmentId),
      semester: Number(parsed.data.semester),
      ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
    }, { onSuccess: onCreated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="create-student-title" className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 id="create-student-title" className="text-xl font-semibold">Create Student</h2>
            <p className="mt-1 text-sm text-text-muted">A password setup link will be sent to the student&apos;s email.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending} aria-label="Close create student dialog">Close</Button>
        </header>

        <form onSubmit={submit} className="space-y-4 overflow-y-auto p-5">
          <Field label="Full name" error={errors.name}><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} disabled={mutation.isPending} /></Field>
          <Field label="Email" error={errors.email}><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} disabled={mutation.isPending} /></Field>
          <Field label="Admission number" error={errors.admissionNumber}><Input value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} maxLength={30} disabled={mutation.isPending} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department" error={errors.departmentId}>
              <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} disabled={departmentQuery.isPending || departmentQuery.isError || mutation.isPending} className="w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-60">
                <option value="">Select department</option>
                {(departmentQuery.data ?? []).map((department) => <option key={department.id} value={department.id}>{department.name} ({department.code})</option>)}
              </select>
              {departmentQuery.isError && <span className="block text-xs font-normal text-red-600">Unable to load departments. <button type="button" onClick={() => void departmentQuery.refetch()} className="underline">Try again</button></span>}
            </Field>
            <Field label="Semester" error={errors.semester}>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} disabled={mutation.isPending} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <option key={item} value={item}>Semester {item}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Phone number (optional)" error={errors.phone}><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Include country code" disabled={mutation.isPending} /></Field>

          {mutation.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{mutation.error.message || "Unable to create student."}</p>}
          <footer className="flex justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending || departmentQuery.isPending || departmentQuery.isError}>
              {mutation.isPending ? "Creating..." : "Create Student"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5 text-sm font-medium"><span>{label}</span>{children}{error && <span className="block text-xs font-normal text-red-600">{error}</span>}</label>;
}
