import { RouteGuard } from "@/features/auth/components/route-guard";

export default function CoordinatorRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard roles={["club-coordinator"]}>{children}</RouteGuard>;
}
