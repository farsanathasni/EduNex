"use client";

import CoordinatorRouteLayout from "@/app/club-coordinator/layout";


export default function AnnouncementCoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CoordinatorRouteLayout>{children}</CoordinatorRouteLayout>;
}