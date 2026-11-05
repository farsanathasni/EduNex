"use client";

import { useParams } from "next/navigation";
import StudentDetailsPage from "@/features/students/components/student-details-page";

export default function HodStudentDetailsRoute() {
  const params = useParams<{ studentId: string }>();
  const studentId = Number(params.studentId);
  return (
    <StudentDetailsPage
      studentId={studentId}
      directoryHref="/hod/students"
      canEdit
      canAssignCoordinator
    />
  );
}
