export type LostFoundPortal = "student" | "teacher" | "hod" | "principal";

export function lostFoundHref(
  portal: LostFoundPortal,
  path: "" | "new" | "my-claims" | "audit" | number = "",
): string {
  const base = `/${portal}/lost-found`;

  if (path === "") return base;
  if (typeof path === "number") return `${base}/${path}`;

  return `${base}/${path}`;
}
