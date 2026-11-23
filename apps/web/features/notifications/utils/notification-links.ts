
import type { Notification } from "../api/notifications";

export type NotificationRole =
  | "student"
  | "coordinator"
  | "hod"
  | "principal"
  | "faculty";

const LINKS: Record<NotificationRole, Record<string, string>> = {
  student: {
    event: "/student/events",
    membership: "/student/my-memberships",
    announcement: "/announcement/student",
    issue: "/student/issues",
    lost_found: "/student/lost-found",
  },

  coordinator: {
    event: "/club-coordinator/events",
    membership_request: "/club-coordinator/membership-requests",
    announcement: "/announcement/coordinator",
  },

  faculty: {
    event: "/teacher/events",
    announcement: "/announcement/faculty",
    issue: "/teacher/issues",
    lost_found: "/teacher/lost-found",
  },

  hod: {
    event_approval: "/hod/approvals",
    issue: "/hod/issues",
    lost_found: "/hod/lost-found",
    announcement: "/announcement/hod",
  },

  principal: {
    event_approval: "/principal/approvals",
    event: "/principal/events",
    issue: "/principal/issues",
    lost_found: "/principal/lost-found",
    announcement: "/announcement/principal",
  },
};

export function getNotificationHref(
  role: NotificationRole,
  notification: Notification,
): string | null {
  if (!notification.referenceType) return null;

  const href = LINKS[role][notification.referenceType] ?? null;

  if (!href) return null;

  if (
    (notification.referenceType === "issue" ||
      notification.referenceType === "lost_found") &&
    notification.referenceId != null
  ) {
    return `${href}/${notification.referenceId}`;
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
