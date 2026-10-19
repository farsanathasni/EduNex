
import RoleLoginForm from "@/app/ui/role-login-form";

export default function TeacherLoginPage() {
  return (
    <RoleLoginForm
      title="Teacher Login"
      description="Sign in to manage your classes and academic activities."
      dashboardPath="/teacher/dashboard"
    />
  );
}
