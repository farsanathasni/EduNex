import { Notification } from "../api/notifications";


export type NotificationRole = "student" | "coordinator" | "hod" | "principal" | "faculty" ;

const LINKS: Record<NotificationRole, Record<string, string>> = {
  student: {
    event: "/student/events",
    membership: "/student/my-memberships",
    announcement: "/student/dashboard",
    issue: "/student/issues",
  },
  coordinator: {
    event: "/club-coordinator/events",
    membership_request: "/club-coordinator/membership-requests",
  },
  faculty: {
    event: "/teacher/events",        // adjust to a real teacher page
    announcement: "/teacher",
    issue: "/teacher/issues",
  },
  hod: {
    event_approval: "/hod/approvals",
    issue: "/hod/issues",
  },
  principal: {
    event_approval: "/principal/approvals",
    event: "/principal/events",
    issue: "/principal/issues",
  },
};

export function getNotificationHref(
  role: NotificationRole,
  n: Notification,
): string | null {
  if (!n.referenceType) return null;

  const href = LINKS[role][n.referenceType] ?? null;
  if (!href) return null;

  if (n.referenceType === "issue" && n.referenceId != null) {
    return `${href}/${n.referenceId}`;
  }

  return href;
}

export const NOTIFICATIONS_PAGE: Record<NotificationRole, string> = {
  student: "/student/notifications",
  coordinator: "/club-coordinator/notifications",
  hod: "/hod/notifications",
  faculty: "/teacher/notifications",
  principal: "/principal/notifications",
};