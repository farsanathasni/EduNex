"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useNotificationsPage,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../notification-query"
import { getNotificationHref, type NotificationRole } from "../../utils/notification-links"
import { timeAgo } from "../../utils/time-ago";
import type { Notification } from "../notifications"

export function NotificationsPage({ role }: { role: NotificationRole }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading, isFetching } = useNotificationsPage(page, unreadOnly);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const items = data?.data ?? [];
  const pagination = data?.pagination;

  function handleClick(n: Notification) {
    if (!n.isRead) markRead.mutate(n.id);
    const href = getNotificationHref(role, n);
    if (href) router.push(href);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <button
          onClick={() => markAllRead.mutate()}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2">
        {[
          { label: "All", value: false },
          { label: "Unread", value: true },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setUnreadOnly(tab.value);
              setPage(1);
            }}
            className={`rounded-full border px-4 py-1 text-sm ${
              unreadOnly === tab.value ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ul className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="animate-pulse space-y-2 rounded-md border bg-white p-4">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/5 rounded bg-gray-200" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <p className="rounded-md border bg-white p-8 text-center text-sm text-gray-500">
          {unreadOnly ? "No unread notifications." : "No notifications yet."}
        </p>
      ) : (
        <ul className={`space-y-3 ${isFetching ? "opacity-70" : ""}`}>
          {items.map((n) => (
            <li
              key={n.id}
              onClick={() => handleClick(n)}
              className={`cursor-pointer rounded-md border p-4 hover:bg-gray-50 ${
                n.isRead ? "bg-white text-gray-500" : "bg-blue-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`text-sm ${n.isRead ? "" : "font-semibold"}`}>
                  {n.title}
                </span>
                {!n.isRead && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                )}
              </div>
              <p className="mt-1 text-sm">{n.message}</p>
              <p className="mt-2 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}