import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "../../config/database.js";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "../../db/schema/rbac-schema.js";
import { SUPER_ADMIN_SLUG } from "./rbac.access.js";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

export const listRoles = () =>
  db
    .select({
      id: roles.id,
      name: roles.name,
      slug: roles.slug,
      description: roles.description,
      isSystem: roles.isSystem,
      totalAssigned: count(userRoles.id),
    })
    .from(roles)
    .leftJoin(userRoles, eq(userRoles.roleId, roles.id))
    .groupBy(roles.id)
    .orderBy(roles.id);

// Every permission, grouped by resource, for the checkbox screen.
export const getPermissionCatalog = async () => {
  const rows = await db
    .select()
    .from(permissions)
    .orderBy(permissions.resource, permissions.id);

  const grouped = new Map<
    string,
    { id: number; action: string; description: string | null }[]
  >();

  for (const row of rows) {
    const list = grouped.get(row.resource) ?? [];
    list.push({ id: row.id, action: row.action, description: row.description });
    grouped.set(row.resource, list);
  }

  return [...grouped.entries()].map(([resource, items]) => ({
    resource,
    permissions: items,
  }));
};

export const getRoleDetail = async (roleId: number) => {
  const [role] = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
  if (!role) return null;

  const [assigned] = await db
    .select({ total: count() })
    .from(userRoles)
    .where(eq(userRoles.roleId, roleId));

  const rows =
    role.slug === SUPER_ADMIN_SLUG
      ? await db.select({ id: permissions.id }).from(permissions)
      : await db
          .select({ id: rolePermissions.permissionId })
          .from(rolePermissions)
          .where(eq(rolePermissions.roleId, roleId));

  return {
    ...role,
    totalAssigned: assigned.total,
    permissionIds: rows.map((r) => r.id),
  };
};

// Returns the ids that do not exist in the permissions table.
export const findUnknownPermissionIds = async (ids: number[]) => {
  if (ids.length === 0) return [];
  const found = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(inArray(permissions.id, ids));
  const known = new Set(found.map((f) => f.id));
  return ids.filter((id) => !known.has(id));
};

export const permissionIdsToKeys = async (ids: number[]) => {
  if (ids.length === 0) return [];
  const rows = await db
    .select({ resource: permissions.resource, action: permissions.action })
    .from(permissions)
    .where(inArray(permissions.id, ids));
  return rows.map((r) => `${r.resource}:${r.action}`);
};

const replacePermissions = async (
  tx: Pick<typeof db, "delete" | "insert">,
  roleId: number,
  ids: number[],
) => {
  await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  const unique = [...new Set(ids)];
  if (unique.length > 0) {
    await tx
      .insert(rolePermissions)
      .values(unique.map((permissionId) => ({ roleId, permissionId })));
  }
};

export const createRole = async (input: {
  name: string;
  description?: string;
  permissionIds: number[];
}) => {
  const slug = slugify(input.name);
  if (!slug) throw new Error("ROLE_NAME_INVALID");

  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.slug, slug))
      .limit(1);
    if (existing) throw new Error("ROLE_EXISTS");

    const [role] = await tx
      .insert(roles)
      .values({ name: input.name, slug, description: input.description ?? null })
      .returning();

    await replacePermissions(tx, role.id, input.permissionIds);
    return role;
  });
};

export const updateRole = async (
  roleId: number,
  input: { name?: string; description?: string; permissionIds?: number[] },
) =>
  db.transaction(async (tx) => {
    const [role] = await tx.select().from(roles).where(eq(roles.id, roleId)).limit(1);
    if (!role) throw new Error("ROLE_NOT_FOUND");
    if (role.slug === SUPER_ADMIN_SLUG) throw new Error("ROLE_LOCKED");
    if (input.name && input.name !== role.name && role.isSystem) {
      throw new Error("ROLE_SYSTEM_RENAME");
    }

    if (input.name !== undefined || input.description !== undefined) {
      await tx
        .update(roles)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
        })
        .where(eq(roles.id, roleId));
    }

    if (input.permissionIds) {
      await replacePermissions(tx, roleId, input.permissionIds);
    }

    return { id: roleId };
  });

export const deleteRole = async (roleId: number) => {
  const [role] = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
  if (!role) throw new Error("ROLE_NOT_FOUND");
  if (role.isSystem) throw new Error("ROLE_SYSTEM_DELETE");

  const [assigned] = await db
    .select({ total: count() })
    .from(userRoles)
    .where(and(eq(userRoles.roleId, roleId)));
  if (assigned.total > 0) throw new Error("ROLE_IN_USE");

  await db.delete(roles).where(eq(roles.id, roleId));
};
