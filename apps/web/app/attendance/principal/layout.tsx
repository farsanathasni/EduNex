import { RouteGuard } from "@/features/auth/components/route-guard";

export default function PrincipalAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={["super-admin"]}>
      {children}
    </RouteGuard>
  );
}
