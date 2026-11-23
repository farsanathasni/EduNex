import { Notification } from "../api/notifications";


export type NotificationRole = "student" | "coordinator" | "hod" | "principal" | "faculty" ;

const LINKS: Record<NotificationRole, Record<string, string>> = {
  student: {
    event: "/student/events",
    membership: "/student/my-memberships",
    announcement: "/student/dashboard",
    issue: "/student/issues",
    lost_found: "/student/lost-found",
  },
  coordinator: {
    event: "/club-coordinator/events",
    membership_request: "/club-coordinator/membership-requests",
  },
  faculty: {
    event: "/teacher/events",        // adjust to a real teacher page
    announcement: "/teacher",
    issue: "/teacher/issues",
    lost_found: "/teacher/lost-found",
  },
  hod: {
    event_approval: "/hod/approvals",
    issue: "/hod/issues",
    lost_found: "/hod/lost-found",
  },
  principal: {
    event_approval: "/principal/approvals",
    event: "/principal/events",
    issue: "/principal/issues",
    lost_found: "/principal/lost-found",
  },
};

export function getNotificationHref(
  role: NotificationRole,
  n: Notification,
): string | null {
  if (!n.referenceType) return null;

  const href = LINKS[role][n.referenceType] ?? null;
  if (!href) return null;

  if (
    (n.referenceType === "issue" || n.referenceType === "lost_found") &&
    n.referenceId != null
  ) {
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