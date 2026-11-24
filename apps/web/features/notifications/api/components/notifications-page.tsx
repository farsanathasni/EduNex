"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Tabs from "@/components/ui/tabs";

import {
  useNotificationsPage,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../notification-query";
import { getNotificationHref, type NotificationRole } from "../../utils/notification-links";
import { timeAgo } from "../../utils/time-ago";
import type { Notification } from "../notifications";

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

  const isStudent = role === "student";
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          ariaLabel="Notification filter"
          items={[{ value: "all", label: "All" }, { value: "unread", label: "Unread" }]}
          value={unreadOnly ? "unread" : "all"}
          onValueChange={(value) => {
            setUnreadOnly(value === "unread");
            setPage(1);
          }}
          className="w-full sm:w-fit"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllRead.mutate()}
          className="min-h-11 w-full sm:ml-auto sm:w-auto"
        >
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <ul className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className={`animate-pulse space-y-2 border border-border bg-surface p-4 ${isStudent ? "rounded-3xl" : "rounded-md"}`}>
              <div className="h-4 w-1/3 rounded bg-secondary" />
              <div className="h-3 w-3/4 rounded bg-secondary" />
              <div className="h-3 w-1/5 rounded bg-secondary" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <Card padding="lg" className={`${isStudent ? "rounded-3xl" : ""} text-center text-sm text-text-muted`}>
          {unreadOnly ? "No unread notifications." : "No notifications yet."}
        </Card>
      ) : (
        <ul className={`space-y-3 ${isFetching ? "opacity-70" : ""}`}>
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => handleClick(n)}
                className={`w-full border border-border p-4 text-left transition hover:bg-secondary/60 ${isStudent ? "rounded-3xl" : "rounded-md"} ${
                  n.isRead ? "bg-surface text-text-muted" : "bg-primary-subtle/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-sm ${n.isRead ? "" : "font-semibold text-text"}`}>{n.title}</span>
                  {!n.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm">{n.message}</p>
                <p className="mt-2 text-xs text-text-muted">{timeAgo(n.createdAt)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="min-h-11">Previous</Button>
          <span className="text-sm text-text-muted">Page {pagination.page} of {pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="min-h-11">Next</Button>
        </div>
      )}
    </>
  );

  if (isStudent) {
    return (
      <PageContainer className="space-y-6 py-6 sm:py-8">
        <PageHeader eyebrow="Stay up to date" title="Notifications" description="Catch up on campus activity, updates, and requests." />
        {content}
      </PageContainer>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold">Notifications</h1>
      {content}
    </div>
  );
}