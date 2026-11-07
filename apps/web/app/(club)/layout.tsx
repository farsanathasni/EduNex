import { RouteGuard } from "@/features/auth/components/route-guard";

export default function StudentClubRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard roles={["student"]}>{children}</RouteGuard>;
}
