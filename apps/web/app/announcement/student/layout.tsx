"use client";

import StudentRouteLayout from "@/app/(student)/student/layout";

export default function AnnouncementStudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentRouteLayout>{children}</StudentRouteLayout>;
}
