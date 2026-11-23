import { isValidElement, type KeyboardEvent, type ReactNode } from "react";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type ColumnHidePriority = "low" | "medium" | "high";

export type ColumnMobilePriority = "primary" | "secondary" | "hidden";

export interface DataTableColumn<T> {
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  className?: string;
  sortable?: boolean;
  hidePriority?: ColumnHidePriority;
  mobileLabel?: ReactNode;
  mobilePriority?: ColumnMobilePriority;
  mobileRenderer?: (row: T, index: number) => ReactNode;
  mobileIsStatus?: boolean;
}

export interface DataTableAction<T> {
  label: string;
  onClick: (row: T) => void;
  ariaLabel?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface DataTableSortState {
  columnIndex: number;
  direction: "asc" | "desc";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyState: ReactNode;
  rowActions?: (row: T) => DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  getRowKey?: (row: T, index: number) => string | number;
  minWidthClassName?: string;
  onSort?: (columnIndex: number) => void;
  sortState?: DataTableSortState;
  caption?: string;
}

const visibilityClass = (priority?: ColumnHidePriority) => {
  if (priority === "low") return "hidden sm:table-cell";
  if (priority === "medium") return "hidden md:table-cell";
  return "";
};

const headerCellClass =
  "sticky top-0 z-10 bg-background px-4 py-3 text-left font-medium text-text-muted";

export default function DataTable<T>({
  columns,
  rows,
  loading = false,
  emptyState,
  rowActions,
  onRowClick,
  getRowKey,
  minWidthClassName = "min-w-[760px]",
  onSort,
  sortState,
  caption,
}: DataTableProps<T>) {
  const hasActions = Boolean(rowActions);

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick || event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-subtle">
      <div className="overflow-x-auto">
        <table className={`w-full text-left text-sm ${minWidthClassName}`}>
          {caption ? <caption className="sr-only">{caption}</caption> : null}

          <thead className="border-b border-border bg-background">
            <tr>
              {columns.map((column, index) => {
                const isSorted = sortState?.columnIndex === index;
                const ariaSort = isSorted
                  ? sortState.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : column.sortable
                    ? "none"
                    : undefined;

                return (
                  <th
                    key={`${String(column.header)}-${index}`}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`${headerCellClass} ${visibilityClass(column.hidePriority)} ${column.className ?? ""}`}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(index)}
                        className="inline-flex items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        {column.header}
                        <span aria-hidden="true">{isSorted && sortState.direction === "asc" ? "↑" : "↓"}</span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}

              {hasActions ? (
                <th scope="col" className={headerCellClass}>
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`} className="border-b border-border last:border-0">
                    {columns.map((column, columnIndex) => (
                      <td
                        key={`skeleton-cell-${columnIndex}`}
                        className={`px-4 py-4 ${visibilityClass(column.hidePriority)} ${column.className ?? ""}`}
                      >
                        <Skeleton className="h-4 w-full max-w-32" />
                      </td>
                    ))}
                    {hasActions ? (
                      <td className="px-4 py-4">
                        <Skeleton className="h-8 w-20 rounded-lg" />
                      </td>
                    ) : null}
                  </tr>
                ))
              : rows.map((row, index) => (
                  <tr
                    key={getRowKey ? getRowKey(row, index) : index}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick ? (event) => handleRowKeyDown(event, row) : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-secondary/60 ${
                      index % 2 === 1 ? "bg-background/40" : ""
                    } ${onRowClick ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" : ""}`}
                  >
                    {columns.map((column, columnIndex) => (
                      <td
                        key={`cell-${columnIndex}`}
                        className={`px-4 py-3 align-top ${visibilityClass(column.hidePriority)} ${column.className ?? ""}`}
                      >
                        {column.cell(row, index)}
                      </td>
                    ))}

                    {rowActions ? (
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap items-center gap-2">
                          {rowActions(row).map((action) => (
                            <Button
                              key={action.label}
                              type="button"
                              variant="outline"
                              size="sm"
                              aria-label={action.ariaLabel ?? action.label}
                              disabled={action.disabled}
                              onClick={(event) => {
                                event.stopPropagation();
                                action.onClick(row);
                              }}
                              className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${action.className ?? ""}`}
                              title={action.ariaLabel ?? action.label}
                            >
                              {action.icon}
                              <span className="sr-only sm:not-sr-only">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && rows.length === 0 ? (
        <div className="border-t border-border px-4 py-10 text-center text-label text-text-muted">
          {emptyState}
        </div>
      ) : null}
    </div>
  );
}

function mobileLabelOf<T>(column: DataTableColumn<T>, index: number) {
  if (column.mobileLabel !== undefined) return column.mobileLabel;
  if (typeof column.header === "string") return column.header;
  return `Field ${index + 1}`;
}

function renderMobileValue<T>(
  column: DataTableColumn<T>,
  row: T,
  index: number,
) {
  const value = column.mobileRenderer
    ? column.mobileRenderer(row, index)
    : column.cell(row, index);
  const label = mobileLabelOf(column, index);
  const labelText = typeof label === "string" ? label : "";
  const isStatus =
    column.mobileIsStatus ?? /status|state|stage/i.test(labelText);

  if (!isStatus || value === null || value === undefined || isValidElement(value)) {
    return value;
  }

  return <Badge tone="neutral">{value}</Badge>;
}

export function ResponsiveDataTable<T>(props: DataTableProps<T>) {
  const { columns, rows, loading = false, emptyState, rowActions, onRowClick, getRowKey } = props;

  const visibleColumns = columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => column.mobilePriority !== "hidden");

  const primaryColumn =
    visibleColumns.find(({ column }) => column.mobilePriority === "primary") ??
    visibleColumns[0];
  const secondaryColumns = visibleColumns.filter(
    (entry) => entry !== primaryColumn,
  );

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    row: T,
  ) => {
    if (!onRowClick || event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="hidden md:block">
        <DataTable {...props} />
      </div>

      <div className="space-y-3 md:hidden">
        {loading
          ? Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={`mobile-skeleton-${rowIndex}`}
                className="space-y-3 rounded-xl border border-border bg-surface p-4 shadow-subtle"
              >
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))
          : rows.map((row, index) => {
              const actions = rowActions?.(row) ?? [];

              return (
                <div
                  key={getRowKey ? getRowKey(row, index) : index}
                  role={onRowClick ? "button" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => handleCardKeyDown(event, row)
                      : undefined
                  }
                  className={`space-y-3 rounded-xl border border-border bg-surface p-4 shadow-subtle ${
                    onRowClick
                      ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      : ""
                  }`}
                >
                  {primaryColumn ? (
                    <div className="min-w-0 break-anywhere text-label font-semibold text-text">
                      {renderMobileValue(primaryColumn.column, row, index)}
                    </div>
                  ) : null}

                  {secondaryColumns.length > 0 ? (
                    <dl className="grid gap-2">
                      {secondaryColumns.map(({ column, index: columnIndex }) => (
                        <div
                          key={`mobile-field-${columnIndex}`}
                          className="flex min-w-0 flex-col gap-0.5"
                        >
                          <dt className="text-caption font-medium text-text-muted">
                            {mobileLabelOf(column, columnIndex)}
                          </dt>
                          <dd className="min-w-0 break-anywhere text-label text-text">
                            {renderMobileValue(column, row, index)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {actions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {actions.map((action) => (
                        <Button
                          key={action.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          aria-label={action.ariaLabel ?? action.label}
                          disabled={action.disabled}
                          onClick={(event) => {
                            event.stopPropagation();
                            action.onClick(row);
                          }}
                          className={`min-h-11 flex-1 ${action.className ?? ""}`}
                          title={action.ariaLabel ?? action.label}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

        {!loading && rows.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-label text-text-muted shadow-subtle">
            {emptyState}
          </div>
        ) : null}
      </div>
    </div>
  );
}
