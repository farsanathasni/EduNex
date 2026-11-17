"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useMarkNotificationRead, useNotifications, useNotificationStream } from "../notification-query";
import { getNotificationHref, NotificationRole, NOTIFICATIONS_PAGE } from "../../utils/notification-links";
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

  function handleItemClick(n: Notification) {
    if (!n.isRead) markRead.mutate(n.id);
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
      {/* clicking the bell opens the full page */}
      <button
        onClick={() => {
          setOpen(false);
          router.push(allPage);
        }}
        className="relative rounded-full p-2 hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* pt-2 (not margin) keeps the hover area connected to the bell */}
      {open && (
        <div className="absolute right-0 z-50 w-80 pt-2">
          <div className="overflow-hidden rounded-md border bg-white shadow-lg">
            <div className="border-b px-4 py-3 font-semibold">Notifications</div>

{isLoading ? (
  <div className="p-3">
    <NotificationListSkeleton count={3} />
  </div>
) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {items.slice(0, PREVIEW_COUNT).map((n) => (
                  <li
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`cursor-pointer border-b px-4 py-3 hover:bg-gray-50 ${
                      n.isRead ? "text-gray-500" : "bg-blue-50/50 font-medium"
                    }`}
                  >
                    <div className="text-sm">{n.title}</div>
                    <p className="text-xs">{n.message}</p>
                    <p className="mt-1 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => {
                setOpen(false);
                router.push(allPage);
              }}
              className="w-full border-t py-2 text-sm text-blue-600 hover:bg-gray-50"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}