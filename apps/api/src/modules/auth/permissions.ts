
import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

// EduNex RBAC is the source of truth for permissions.
export const superAdmin = ac.newRole({});

// HOD account-management access is handled by EduNex RBAC, not Better Auth.
export const hod = ac.newRole({});

// Teachers cannot manage other users.
export const teacher = ac.newRole({});

// Club coordinators cannot manage other users.
export const clubCoordinator = ac.newRole({});


export const student=ac.newRole({})
