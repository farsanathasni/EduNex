import StaffDirectory from "@/features/staff/components/staff-directory";

export default function HodStaffPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-medium text-text-muted">HOD WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">Staff Management</h1>
        <p className="mt-2 text-sm text-text-muted">
          View and update staff assigned to your department.
        </p>
      </header>
      <StaffDirectory
        canChangeDepartment={false}
        showTypeFilter={false}
        fixedStaffType="faculty"
      />
    </section>
  );
}
