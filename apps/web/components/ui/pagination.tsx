import Button from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
  showTotal?: boolean;
  className?: string;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  pageSize,
  showTotal = false,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const rangeStart = total === undefined ? null : (page - 1) * (pageSize ?? 1) + 1;
  const rangeEnd =
    total === undefined
      ? null
      : Math.min(page * (pageSize ?? 1), total);

  return (
    <nav
      aria-label="Pagination"
      className={`flex w-full min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-between ${className}`}
    >
      <div className="min-w-0 text-center text-caption text-text-muted sm:text-left">
        <p className="whitespace-nowrap">
          Page {page} of {totalPages}
        </p>
        {showTotal && total !== undefined ? (
          <p className="whitespace-nowrap">
            {rangeStart}–{rangeEnd} of {total}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
