import { RouteGuard } from "@/features/auth/components/route-guard";

export default function ClubAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard roles={["student", "faculty"]}>{children}</RouteGuard>;
}
