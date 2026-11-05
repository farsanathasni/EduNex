import { RouteGuard } from "@/features/auth/components/route-guard";

export default function StudentRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard roles={["student"]}>{children}</RouteGuard>;
}
