
import RoleLoginForm from "@/features/auth/components/role-login-form";

export default function ClubCoordinatorLoginPage() {
  return (
    <RoleLoginForm
      title="Club Coordinator Login"
      description="Sign in to manage your clubs, events, and activities."
      dashboardPath="/club-coordinator/dashboard"
    />
  );
}
