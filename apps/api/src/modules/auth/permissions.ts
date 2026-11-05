
import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

// HOD account-management access is handled by EduNex RBAC, not Better Auth.
export const hod = ac.newRole({});

// Teachers cannot manage other users.
export const teacher = ac.newRole({});

// Club coordinators cannot manage other users.
export const clubCoordinator = ac.newRole({});


export const student=ac.newRole({})
