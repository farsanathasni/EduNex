
import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

// HOD can manage user accounts.
export const hod = ac.newRole({
  ...adminAc.statements,
});

// Teachers cannot manage other users.
export const teacher = ac.newRole({});

// Club coordinators cannot manage other users.
export const clubCoordinator = ac.newRole({});
