
import type { Mode } from "@/stores/mode-store";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  description?: string;
  permission?: [string, string];
  roles?: string[];
  mode?: Mode;
};

const ADMIN = ["super-admin"];
const HOD = ["hod", "super-admin"];
const FACULTY = ["faculty", "super-admin"];

export const NAV: NavItem[] = [
  
  {
  label: "Overview",
  href: "/dashboard",
  icon: "⌂",
  roles: ["hod"],
},

  // Administration
  {
    label: "Overview",
    href: "/principal",
    icon: "\u2302",
    roles: ADMIN,
  },
  {
    label: "Staff Management",
    href: "/principal/staff",
    icon: "♙",
    roles: ADMIN,
    permission: ["staff", "create"],
  },
  {
    label: "Departments",
    href: "/principal/departments",
    icon: "▦",
    roles: ADMIN,
    permission: ["department", "view"],
  },
  {
    label: "College Students",
    href: "/principal/students",
    icon: "♧",
    roles: ADMIN,
    permission: ["student", "view"],
  },
  {
    label: "Coordinators",
    href: "/principal/coordinators",
    icon: "★",
    roles: ADMIN,
    permission: ["coordinator", "view"],
  },
  {
    label: "Clubs",
    href: "/principal/clubs",
    icon: "◈",
    roles: ADMIN,
    permission: ["club", "view"],
  },
  {
    label: "College Events",
    href: "/principal/events",
    icon: "▣",
    roles: ADMIN,
    permission: ["event", "view"],
  },
  {
    label: "Approvals",
    href: "/principal/approvals",
    icon: "✓",
    roles: ADMIN,
    permission: ["event", "approve"],
  },
  {
    label: "Roles & Permissions",
    href: "/principal/roles",
    icon: "⚙",
    roles: ADMIN,
    permission: ["role", "view"],
  },

  // Head of Department
  {
    label: "Department Overview",
    href: "/hod/dashboard",
    icon: "⌂",
    roles: HOD,
    permission: ["staff", "view"],
  },
  {
    label: "Staff Management",
    href: "/hod/staff",
    icon: "\u2659",
    roles: HOD,
    permission: ["staff", "view"],
  },
  {
    label: "Students",
    href: "/hod/students",
    icon: "♧",
    roles: HOD,
    permission: ["student", "view"],
  },
  {
    label: "Clubs",
    href: "/hod/clubs",
    icon: "◈",
    roles: HOD,
    permission: ["club", "view"],
  },
  {
    label: "Event Approvals",
    href: "/hod/approvals",
    icon: "✓",
    roles: HOD,
    permission: ["event", "approve"],
  },

  // Faculty
  
  // Faculty / Teacher
  {
    label: "Dashboard",
    href: "/teacher",
    icon: "⌂",
    roles: FACULTY,
  },
  {
    label: "My Class",
    href: "/teacher/classes",
    icon: "▤",
    roles: FACULTY,
  },
  {
    label: "My Students",
    href: "/teacher/students",
    icon: "♙",
    roles: FACULTY,
    permission: ["student", "view"],
  },
  
{
  label: "Study Materials",
  href: "/teacher/study-materials",
  icon: "▤",
  roles: FACULTY,
},

  // Student view
  // Student view
{
  label: "Overview",
  href: "/studentDashboard",
  icon: "\u2302",
  roles: ["student"],
  mode: "student",
},
{
  label: "Events",
  href: "/studentEvents",
  icon: "▣",
  roles: ["student"],
  permission: ["event", "view"],
  mode: "student",
},
{
  label: "Explore Clubs",
  href: "/student",
  icon: "\u25c8",
  roles: ["student"],
  permission: ["club", "view"],
  mode: "student",
},
{
  label: "My Memberships",
  href: "/student/my-memberships",
  icon: "\u2667",
  roles: ["student"],
  permission: ["club", "view"],
  mode: "student",
},
{
  label: "My Profile",
  href: "/studentprofile",
  icon: "☺",
  roles: ["student"],
  mode: "student",
},

  // Coordinator view
  {
    label: "My Clubs",
    href: "/club-coordinator/clubs",
    icon: "◈",
    roles: ["student"],
    permission: ["club", "view"],
    mode: "coordinator",
  },
  {
    label: "My Club Events",
    href: "/club-coordinator/events",
    icon: "▣",
    roles: ["student"],
    permission: ["event", "view"],
    mode: "coordinator",
  },
  {
    label: "Membership Requests",
    href: "/club-coordinator/membership-requests",
    icon: "♧",
    roles: ["student"],
    // permission: ["club", "update"],
    mode: "coordinator",
  },
  {
    label: "Club Members",
    href: "/club-coordinator/members",
    icon: "♙",
    roles: ["student"],
    // permission: ["club", "update"],
    mode: "coordinator",
  },
  {
    label: "Request Event",
    href: "/club-coordinator/request-event",
    icon: "+",
    roles: ["student"],
    permission: ["event", "create"],
    mode: "coordinator",
  },
  {
    label: "My Profile",
    href: "/club-coordinator/profile",
    icon: "☺",
    roles: ["student"],
    mode: "coordinator",
  },
];

export const isNavVisible = (
  item: NavItem,
  ctx: {
    mode: Mode;
    isSuperAdmin: boolean;
    hasAnyRole: (slugs: string[]) => boolean;
    can: (resource: string, action: string) => boolean;
  },
) => {
  const isSuperAdmin =
    ctx.isSuperAdmin || ctx.hasAnyRole(["super-admin"]);

  if (item.href === "/dashboard" && isSuperAdmin) {
    return false;
  }

  const roleAllowed =
    !item.roles || ctx.hasAnyRole(item.roles);

  const permissionAllowed =
    !item.permission ||
    ctx.can(item.permission[0], item.permission[1]);

  const modeAllowed =
    !item.mode || ctx.mode === item.mode;

  return roleAllowed && permissionAllowed && modeAllowed;
};
