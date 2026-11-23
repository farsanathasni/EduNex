"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  LOST_FOUND_CATEGORIES,
  LOST_FOUND_STATUSES,
  useLostFoundItemsQuery,
  type ItemListParams,
  type LostFoundCategory,
  type LostFoundStatus,
} from "../api/lost-found-query";
import { lostFoundHref, type LostFoundPortal } from "../portal";
import {
  LOST_FOUND_CATEGORY_LABELS,
  LOST_FOUND_STATUS_LABELS,
  formatLostFoundDate,
  lostFoundStatusBadgeClass,
} from "../utils/lost-found-ui";

type Density = "grid" | "list";

export default function ItemList({ portal }: { portal: LostFoundPortal }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LostFoundCategory | "">("");
  const [status, setStatus] = useState<LostFoundStatus | "">("");
  const [mine, setMine] = useState(false);
  const [density, setDensity] = useState<Density>("grid");
  const [page, setPage] = useState(1);

  const params: ItemListParams = {
    search: search || undefined,
    category: category || undefined,
    status: status || undefined,
    mine,
    page,
    limit: 9,
  };

  const { data, isLoading, isError } = useLostFoundItemsQuery(params);

  const changeFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={search}
          onChange={(event) => changeFilter(setSearch, event.target.value)}
          placeholder="Search items or places"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text lg:col-span-2"
        />

        <select
          value={category}
          onChange={(event) =>
            changeFilter(
              setCategory,
              event.target.value as LostFoundCategory | "",
            )
          }
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
        >
          <option value="">All categories</option>
          {LOST_FOUND_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {LOST_FOUND_CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            changeFilter(setStatus, event.target.value as LostFoundStatus | "")
          }
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
        >
          <option value="">All statuses</option>
          {LOST_FOUND_STATUSES.map((value) => (
            <option key={value} value={value}>
              {LOST_FOUND_STATUS_LABELS[value]}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={mine}
              onChange={(event) =>
                changeFilter(setMine, event.target.checked)
              }
            />
            Mine
          </label>
          <button
            type="button"
            onClick={() =>
              setDensity((current) => (current === "grid" ? "list" : "grid"))
            }
            className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs text-text"
          >
            {density === "grid" ? "List view" : "Grid view"}
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Loading items...</p>}
      {isError && (
        <p className="text-sm text-red-600">Could not load lost &amp; found items.</p>
      )}
      {data?.items.length === 0 && (
        <p className="text-sm text-text-muted">
          No items match these filters.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div
          className={
            density === "grid"
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "space-y-3"
          }
        >
          {data.items.map((item) => (
            <Link
              key={item.id}
              href={lostFoundHref(portal, item.id)}
              className={`rounded-2xl border border-border bg-surface p-4 transition hover:border-primary/40 ${
                density === "list" ? "flex gap-4" : "space-y-3"
              }`}
            >
              {item.photos[0] && (
                <Image
                  src={item.photos[0].url}
                  alt={item.title}
                  width={density === "grid" ? 600 : 120}
                  height={density === "grid" ? 320 : 90}
                  unoptimized
                  className={
                    density === "grid"
                      ? "h-40 w-full rounded-xl object-cover"
                      : "h-24 w-32 shrink-0 rounded-xl object-cover"
                  }
                />
              )}

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="truncate font-semibold text-text">
                    {item.title}
                  </h2>
                  <span
                    className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${lostFoundStatusBadgeClass(item.status)}`}
                  >
                    {LOST_FOUND_STATUS_LABELS[item.status]}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-text-muted">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                  <span>{LOST_FOUND_CATEGORY_LABELS[item.category]}</span>
                  <span>{item.place}</span>
                  <span>{formatLostFoundDate(item.dateFound)}</span>
                  {item.claimCount !== null && (
                    <span>{item.claimCount} claim(s)</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
