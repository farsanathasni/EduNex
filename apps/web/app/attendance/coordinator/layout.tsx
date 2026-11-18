import { RouteGuard } from "@/features/auth/components/route-guard";
import CoordinatorLayout from "@/app/club-coordinator/layout";

export default function CoordinatorAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={["student"]} coordinatorOnly>
      <CoordinatorLayout>{children}</CoordinatorLayout>
    </RouteGuard>
  );
}