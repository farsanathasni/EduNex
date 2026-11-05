import StudentDirectory from "@/features/students/components/student-directory";

export default function PrincipalStudentsPage() {
  return (
    <StudentDirectory
      showDepartmentFilter
      title="Student Management"
      canEdit
      canDelete
      canChangeDepartment
      canAssignCoordinator
      canCreate
    />
  );
}
