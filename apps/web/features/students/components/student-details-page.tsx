"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentDetails } from "@/features/students/api/student-query";
import Button from "@/components/ui/button";
import EditStudentModal from "@/features/students/components/edit-student-modal";
import DeleteStudentDialog from "@/features/students/components/delete-student-dialog";

export default function StudentDetailsPage({
  studentId,
  directoryHref,
  canEdit = false,
  canDelete = false,
  canChangeDepartment = false,
  canAssignCoordinator = false,
}: {
  studentId: number;
  directoryHref: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canChangeDepartment?: boolean;
  canAssignCoordinator?: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const query = useStudentDetails(studentId);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link href={directoryHref}>
        <Button type="button" variant="outline" size="sm">Back to Student Directory</Button>
      </Link>
      {query.isPending ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">Loading student details...</p>
      ) : query.isError ? (
        <section className="rounded-xl border border-border bg-surface p-8 text-center">
          <p role="alert" className="text-sm text-red-600">{query.error.message || "Unable to load student details."}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => void query.refetch()}>Try again</Button>
        </section>
      ) : query.data ? (
        <section className="rounded-xl border border-border bg-surface">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
            <div>
              <h1 className="text-2xl font-bold">{query.data.name}</h1>
              <p className="mt-1 text-sm text-text-muted">Student details</p>
            </div>
            {(canEdit || canDelete) && (
              <div className="flex flex-wrap gap-2">
                {canEdit && (
                  <Button type="button" variant="outline" onClick={() => { setSuccessMessage(""); setIsEditing(true); }}>
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button type="button" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => setIsDeleting(true)}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </header>
          {successMessage && <p role="status" className="mx-6 mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{successMessage}</p>}
          <dl className="grid gap-5 p-6 sm:grid-cols-2">
            <Detail label="Email" value={query.data.email} />
            <Detail label="Admission number" value={query.data.admissionNumber} />
            <Detail label="Department" value={query.data.departmentName} />
            <Detail label="Semester" value={`Semester ${query.data.semester}`} />
            <Detail label="Phone" value={query.data.phone || "Not provided"} />
          </dl>
        </section>
      ) : null}
      {query.data && isEditing && canEdit && (
        <EditStudentModal
          key={query.data.id}
          student={query.data}
          canChangeDepartment={canChangeDepartment}
          canAssignCoordinator={canAssignCoordinator}
          onClose={() => setIsEditing(false)}
          onUpdated={() => {
            setIsEditing(false);
            setSuccessMessage("Student details updated successfully.");
            void query.refetch();
          }}
        />
      )}
      {query.data && isDeleting && canDelete && (
        <DeleteStudentDialog
          student={query.data}
          onClose={() => setIsDeleting(false)}
          onDeleted={() => router.push(directoryHref)}
        />
      )}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-text-muted">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;
}
