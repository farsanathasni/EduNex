"use client";

import HodLayout from "@/app/(hod)/hod/layout";

export default function AnnouncementHodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HodLayout>{children}</HodLayout>;
}