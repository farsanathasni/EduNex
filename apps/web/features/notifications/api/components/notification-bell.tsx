"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import {
  useMarkNotificationRead,
  useNotifications,
  useNotificationStream,
} from "../notification-query";

import type { Notification as ApiNotification } from "../notifications";

import {
  getNotificationHref,
  NOTIFICATIONS_PAGE,
} from "../../utils/notification-links";

import type { NotificationRole } from "../../utils/notification-links";

import { timeAgo } from "../../utils/time-ago";
import { NotificationListSkeleton } from "./notification-list-skeleton";

const PREVIEW_COUNT = 5;

export function NotificationBell({ role }: { role: NotificationRole }) {
  useNotificationStream();

  const router = useRouter();
  const { data: items = [], isLoading } = useNotifications();

  const markRead = useMarkNotificationRead();
  const [open, setOpen] = useState(false);

  const unread = items.filter((n) => !n.isRead).length;
  const allPage = NOTIFICATIONS_PAGE[role];

  function handleItemClick(n: ApiNotification) {
    if (!n.isRead) {
      markRead.mutate(n.id);
    }

    setOpen(false);

    const href = getNotificationHref(role, n);
    router.push(href ?? allPage);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          router.push(allPage);
        }}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 w-80 pt-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <div className="border-b border-border px-4 py-3 font-semibold text-text">Notifications</div>

            {isLoading ? (
              <div className="p-3">
                <NotificationListSkeleton count={3} />
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-text-muted">No notifications yet.</p>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {items.slice(0, PREVIEW_COUNT).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(n)}
                      className={`min-h-11 w-full border-b border-border px-4 py-3 text-left hover:bg-secondary/60 ${
                        n.isRead ? "text-text-muted" : "bg-primary-subtle/20 font-medium text-text"
                      }`}
                    >
                      <div className="text-sm">{n.title}</div>
                      <p className="text-xs">{n.message}</p>
                      <p className="mt-1 text-xs text-text-muted">{timeAgo(n.createdAt)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(allPage);
              }}
              className="min-h-11 w-full border-t border-border py-2 text-sm font-medium text-primary hover:bg-secondary/60"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}