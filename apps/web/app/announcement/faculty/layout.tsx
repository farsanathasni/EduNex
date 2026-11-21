"use client";

import TeacherLayout from "@/app/(faculty)/layout";


export default function AnnouncementFacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherLayout>{children}</TeacherLayout>;
}