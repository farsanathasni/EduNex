import { RouteGuard } from "@/features/auth/components/route-guard";
import CoordinatorLayout from "../../features/coordinator/components/coordinator-layout" // your actual path

export default function CoordinatorRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard roles={["student"]} coordinatorOnly>
      <CoordinatorLayout>{children}</CoordinatorLayout>
    </RouteGuard>
  );
}