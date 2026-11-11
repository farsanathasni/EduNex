
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffDirectorySkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-background">
            <tr>
              {[
                "Name",
                "Employee ID",
                "Email",
                "Staff Type",
                "Department",
                "Designation",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-3 font-medium text-text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-36" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>

                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>

                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-14 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <Skeleton className="h-4 w-36" />

        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </footer>
    </div>
  );
}
