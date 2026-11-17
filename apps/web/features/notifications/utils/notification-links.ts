import { Notification } from "../api/notifications";


export type NotificationRole = "student" | "coordinator" | "hod" | "principal" | "faculty" ;

const LINKS: Record<NotificationRole, Record<string, string>> = {
  student: {
    event: "/studentEvents",
    membership: "/student/my-memberships",
    announcement: "/studentDashboard",
  },
  coordinator: {
    event: "/club-coordinator/events",
    membership_request: "/club-coordinator/membership-requests",
  },
  faculty: {
    event: "/teacher/events",        // adjust to a real teacher page
    announcement: "/teacher",
  },
  hod: {
    event_approval: "/hod/approvals",
  },
  principal: {
    event_approval: "/principal/approvals",
    event: "/principal/events",
  },
};

export function getNotificationHref(
  role: NotificationRole,
  n: Notification,
): string | null {
  if (!n.referenceType) return null;
  return LINKS[role][n.referenceType] ?? null;
}

export const NOTIFICATIONS_PAGE: Record<NotificationRole, string> = {
  student: "/studentNotifications",
  coordinator: "/club-coordinator/notifications",
  hod: "/hod/notifications",
  faculty: "/teacher/notifications",
  principal: "/principal/notifications",
};