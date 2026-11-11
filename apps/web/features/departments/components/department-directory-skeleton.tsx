
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentDirectorySkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-background text-text-muted">
            <tr>
              {["Department", "Code", "Description", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-3 font-medium"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-48" />
                </td>

                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-14 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </footer>
    </div>
  );
}
