
import { Skeleton } from "@/components/ui/skeleton";

type EventsTableSkeletonProps = {
  rows?: number;
  columns: {
    width: string;
    secondaryWidth?: string;
    shape?: "text" | "badge" | "button";
  }[];
};

export default function EventsTableSkeleton({
  rows = 5,
  columns,
}: EventsTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-border">
          {columns.map((column, columnIndex) => (
            <td key={columnIndex} className="px-4 py-4">
              {column.shape === "badge" ? (
                <Skeleton className="h-6 w-20 rounded-full" />
              ) : column.shape === "button" ? (
                <Skeleton className="h-8 w-16 rounded-lg" />
              ) : (
                <div className="space-y-2">
                  <Skeleton className={`h-4 ${column.width}`} />
                  {column.secondaryWidth && (
                    <Skeleton
                      className={`h-3 ${column.secondaryWidth}`}
                    />
                  )}
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
