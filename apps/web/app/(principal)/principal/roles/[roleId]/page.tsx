"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPermissionCatalog,
  getRole,
  updateRole,
  type ApiResponse,
  type PermissionGroup,
  type RoleDetail,
} from "@/features/principal/api/roles";

export default function RoleDetailsPage() {
  const params = useParams<{ roleId: string }>();
  const parsedId = Number(params.roleId);
  const roleId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissionIds, setPermissionIds] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: roleResponse,
    isPending: roleLoading,
    isError: roleError,
    error: roleQueryError,
    refetch: refetchRole,
  } = useQuery<ApiResponse<RoleDetail>>({
    queryKey: ["principal", "role", roleId],
    queryFn: () => getRole(roleId!),
    enabled: roleId !== null,
    retry: false,
  });

  const {
    data: permissionResponse,
    isPending: permissionsLoading,
    isError: permissionsError,
    refetch: refetchPermissions,
  } = useQuery<ApiResponse<PermissionGroup[]>>({
    queryKey: ["principal", "role-permissions"],
    queryFn: getPermissionCatalog,
    retry: false,
  });

  const role = roleResponse?.data;
  const permissionGroups = permissionResponse?.data ?? [];
  const isSuperAdmin = role?.slug === "super-admin";
  const nameIsLocked = role?.isSystem ?? false;

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setPermissionIds(role.permissionIds);
    }
  }, [role]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateRole(roleId!, {
        ...(nameIsLocked ? {} : { name: name.trim() }),
        description: description.trim(),
        permissionIds,
      }),
    onSuccess: async () => {
      setSuccessMessage("Role changes saved successfully.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["principal", "role", roleId] }),
        queryClient.invalidateQueries({ queryKey: ["principal", "roles"] }),
      ]);
    },
  });

  function togglePermission(id: number) {
    setSuccessMessage("");
    setPermissionIds((current) =>
      current.includes(id)
        ? current.filter((permissionId) => permissionId !== id)
        : [...current, id],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    updateMutation.mutate();
  }

  if (roleId === null) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-red-600">Invalid role ID.</p>
        <Link href="/principal/roles" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to Roles &amp; Permissions
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/principal/roles" className="inline-flex text-sm text-primary hover:underline">
        ← Back to Roles &amp; Permissions
      </Link>

      {roleLoading ? (
        <p className="text-text-muted">Loading role details...</p>
      ) : roleError || !role ? (
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-red-600">
            {roleQueryError instanceof Error ? roleQueryError.message : "Unable to load this role."}
          </p>
          <button
            type="button"
            onClick={() => void refetchRole()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </section>
      ) : (
        <>
          <header>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{role.name}</h1>
                <p className="mt-2 text-sm text-text-muted">Role details and permission access.</p>
              </div>
              <span className="rounded-full bg-surface px-3 py-1 text-sm text-text-muted">
                {role.isSystem ? "System role" : "Custom role"}
              </span>
            </div>
          </header>

          <section className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-text-muted">Slug</p>
              <p className="mt-1 font-medium">{role.slug}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-text-muted">Assigned users</p>
              <p className="mt-1 font-medium">{role.totalAssigned}</p>
            </div>
          </section>

          {isSuperAdmin ? (
            <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2 text-sm text-text-muted">{role.description || "No description"}</p>
              </div>
              <div className="rounded-lg bg-background p-3 text-sm text-text-muted">
                Super Admin is protected and cannot be changed.
              </div>
              <PermissionsList
                groups={permissionGroups}
                selectedIds={role.permissionIds}
                loading={permissionsLoading}
                error={permissionsError}
                onRetry={() => void refetchPermissions()}
              />
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <section className="space-y-5 rounded-xl border border-border bg-surface p-5">
                <div>
                  <label htmlFor="role-name" className="mb-2 block text-sm font-medium">Role name</label>
                  <input
                    id="role-name"
                    value={name}
                    onChange={(event) => { setName(event.target.value); setSuccessMessage(""); }}
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={nameIsLocked}
                    aria-describedby={nameIsLocked ? "system-role-name-note" : undefined}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                  />
                  {nameIsLocked && (
                    <p id="system-role-name-note" className="mt-1 text-xs text-text-muted">
                      System role names cannot be changed.
                    </p>
                  )}
                  {!nameIsLocked && name.trim().length < 2 && (
                    <p className="mt-1 text-xs text-red-600">Enter at least 2 characters.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="role-description" className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    id="role-description"
                    value={description}
                    onChange={(event) => { setDescription(event.target.value); setSuccessMessage(""); }}
                    maxLength={500}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-right text-xs text-text-muted">{description.length}/500</p>
                </div>
              </section>

              <PermissionsList
                groups={permissionGroups}
                selectedIds={permissionIds}
                loading={permissionsLoading}
                error={permissionsError}
                onToggle={togglePermission}
                onRetry={() => void refetchPermissions()}
              />

              {updateMutation.error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {updateMutation.error instanceof Error
                    ? updateMutation.error.message
                    : "Unable to save role changes."}
                </p>
              )}
              {successMessage && (
                <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {successMessage}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    updateMutation.isPending ||
                    permissionsLoading ||
                    permissionsError ||
                    (!nameIsLocked && name.trim().length < 2)
                  }
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}

function PermissionsList({
  groups,
  selectedIds,
  loading,
  error,
  onToggle,
  onRetry,
}: {
  groups: PermissionGroup[];
  selectedIds: number[];
  loading: boolean;
  error: boolean;
  onToggle?: (id: number) => void;
  onRetry: () => void;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Permissions</h2>
          <p className="mt-1 text-sm text-text-muted">Permissions are grouped by module.</p>
        </div>
        <span className="text-xs text-text-muted">{selectedIds.length} selected</span>
      </div>
      {loading ? (
        <p className="text-sm text-text-muted">Loading permissions...</p>
      ) : error ? (
        <div>
          <p className="text-sm text-red-600">Unable to load permissions.</p>
          <button type="button" onClick={onRetry} className="mt-2 text-sm text-primary hover:underline">Try again</button>
        </div>
      ) : groups.length === 0 ? (
        <p className="text-sm text-text-muted">No permissions are available.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.resource} className="rounded-xl border border-border p-4">
              <h3 className="mb-3 text-sm font-semibold capitalize">{group.resource}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.permissions.map((permission) => {
                  const checked = selectedIds.includes(permission.id);
                  return (
                    <label key={permission.id} className={`flex items-start gap-2 rounded-lg p-2 text-sm ${checked ? "bg-primary/5" : ""} ${onToggle ? "cursor-pointer" : "cursor-default"}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle?.(permission.id)}
                        disabled={!onToggle}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="font-medium capitalize">{permission.action}</span>
                        {permission.description && (
                          <span className="mt-0.5 block text-xs text-text-muted">{permission.description}</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
