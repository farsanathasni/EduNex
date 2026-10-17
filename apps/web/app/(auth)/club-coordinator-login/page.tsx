
import RoleLoginForm from "@/app/ui/role-login-form";

export default function ClubCoordinatorLoginPage() {
  return (
    <RoleLoginForm
      title="Club Coordinator Login"
      description="Sign in to manage your clubs, events, and activities."
      dashboardPath="/club-coordinator/dashboard"
    />
  );
}
