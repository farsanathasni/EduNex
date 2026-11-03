import type { Mode } from "@/stores/mode-store";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  description?: string;
  /** Needs this permission: [resource, action]. */
  permission?: [string, string];
  /** Needs at least one of these role slugs. */
  roles?: string[];
  /** Only shown in this mode (student / coordinator view). */
  mode?: Mode;
};

const ADMIN = ["super-admin", "principal"];
const HOD = ["hod", "super-admin"];

// ONE place that decides who sees what. Adjust hrefs to your real pages.
export const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "⌂" },

  // Administration
  { label: "Staff Management", href: "/principal/staff", icon: "♙", roles: ADMIN, permission: ["staff", "create"], description: "Add HODs, manage staff accounts and assignments." },
  { label: "Departments", href: "/principal/departments", icon: "▦", roles: ADMIN, permission: ["department", "view"], description: "View college departments and their details." },
  { label: "College Students", href: "/principal/students", icon: "♧", roles: ADMIN, permission: ["student", "view"], description: "Browse students by department and semester." },
  { label: "College Events", href: "/principal/events", icon: "▣", roles: ADMIN, permission: ["event", "view"], description: "View college-wide event information." },
  {
  label: "Roles & Permissions",
  href: "/principal/roles",
  icon: "⚙",
  roles: ADMIN,
  permission: ["role", "view"],
  description: "Manage roles and their permissions.",
},

  // Head of Department
  { label: "Department Overview", href: "/hod", icon: "⌂", roles: HOD, permission: ["staff", "view"], description: "Your department at a glance." },
  { label: "Students", href: "/hod/students", icon: "♧", roles: HOD, permission: ["student", "view"], description: "Students in your department." },
  { label: "Clubs", href: "/hod/clubs", icon: "◈", roles: HOD, permission: ["club", "view"], description: "Clubs in your department." },
  { label: "Coordinators", href: "/hod/coordinators", icon: "★", roles: HOD, permission: ["coordinator", "view"], description: "Appoint and manage club coordinators." },
  { label: "Event Approvals", href: "/hod/event-approvals", icon: "✓", roles: HOD, permission: ["event", "approve"], description: "Review events waiting for approval." },

  // Student view
  { label: "My Profile", href: "/student", icon: "☺", roles: ["student"], mode: "student", description: "Your student profile and details." },
  { label: "Events", href: "/student/events", icon: "▣", roles: ["student"], permission: ["event", "view"], mode: "student", description: "Browse college events." },

  // Coordinator view
  { label: "My Club Events", href: "/club-coordinator", icon: "▣", roles: ["club-coordinator"], permission: ["event", "view"], mode: "coordinator", description: "Create and manage events for your clubs." },
];

export const isNavVisible = (
  item: NavItem,
  ctx: {
    mode: Mode;
    hasAnyRole: (slugs: string[]) => boolean;
    can: (resource: string, action: string) => boolean;
  },
) =>
  (!item.roles || ctx.hasAnyRole(item.roles)) &&
  (!item.permission || ctx.can(item.permission[0], item.permission[1])) &&
  (!item.mode || item.mode === ctx.mode);