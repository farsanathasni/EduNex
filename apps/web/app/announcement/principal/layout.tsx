"use client";

import PrincipalLayout from "@/app/(principal)/principal/layout";

export default function AnnouncementPrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrincipalLayout>{children}</PrincipalLayout>;
}