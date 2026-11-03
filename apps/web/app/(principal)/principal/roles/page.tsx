
"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRoles,
  getRole,
  getPermissionCatalog,
  createRole,
  updateRole,
  type ApiResponse,
  type Role,
  type RoleDetail,
  type PermissionGroup,
} from "@/features/principal/api/roles";

export default function RolesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissionIds, setPermissionIds] = useState<number[]>([]);

  const isEditing = editingRoleId !== null;

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<Role[]>>({
    queryKey: ["principal", "roles"],
    queryFn: getRoles,
    retry: false,
  });

  const {
    data: permissionData,
    isPending: permissionsLoading,
    isError: permissionsError,
  } = useQuery<ApiResponse<PermissionGroup[]>>({
    queryKey: ["principal", "role-permissions"],
    queryFn: getPermissionCatalog,
    enabled: isModalOpen,
    retry: false,
  });

  const {
    data: roleDetailData,
    isPending: roleLoading,
    isError: roleLoadingError,
  } = useQuery<ApiResponse<RoleDetail>>({
    queryKey: ["principal", "role", editingRoleId],
    queryFn: () => getRole(editingRoleId!),
    enabled: isModalOpen && isEditing,
    retry: false,
  });

  const roleDetail = roleDetailData?.data;

  useEffect(() => {
    if (roleDetail && editingRoleId !== null) {
      setName(roleDetail.name);
      setDescription(roleDetail.description ?? "");
      setPermissionIds(roleDetail.permissionIds);
    }
  }, [roleDetail, editingRoleId]);

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["principal", "roles"],
      });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: {
      id: number;
      data: {
        name?: string;
        description?: string;
        permissionIds?: number[];
      };
    }) => updateRole(input.id, input.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["principal", "roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["principal", "role", editingRoleId],
      });
      closeModal();
    },
  });

  const roles = data?.data ?? [];
  const permissionGroups = permissionData?.data ?? [];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function closeModal() {
    setIsModalOpen(false);
    setEditingRoleId(null);
    setName("");
    setDescription("");
    setPermissionIds([]);
    createMutation.reset();
    updateMutation.reset();
  }

  function openCreateModal() {
    closeModal();
    setIsModalOpen(true);
  }

  function openEditModal(roleId: number) {
    setName("");
    setDescription("");
    setPermissionIds([]);
    createMutation.reset();
    updateMutation.reset();
    setEditingRoleId(roleId);
    setIsModalOpen(true);
  }

  function togglePermission(id: number) {
    setPermissionIds((current) =>
      current.includes(id)
        ? current.filter((permissionId) => permissionId !== id)
        : [...current, id],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isEditing && editingRoleId !== null) {
      updateMutation.mutate({
        id: editingRoleId,
        data: {
          name: name.trim(),
          description: description.trim(),
          permissionIds,
        },
      });
    } else {
      createMutation.mutate({
        name: name.trim(),
        description: description.trim() || undefined,
        permissionIds,
      });
    }
  }

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="mt-2 text-sm text-text-muted">
            Manage roles and control what users can access in EduNex.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          + Create Role
        </button>
      </header>

      {isPending ? (
        <p className="text-text-muted">Loading roles...</p>
      ) : isError ? (
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Unable to load roles."}
          </p>
          <button
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="p-4">Role</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4">Assigned Users</th>
                <th className="p-4">Type</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4 font-medium">{role.name}</td>
                  <td className="p-4 text-text-muted">{role.slug}</td>
                  <td className="p-4">
                    {role.description || "No description"}
                  </td>
                  <td className="p-4">{role.totalAssigned}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-background px-3 py-1 text-xs">
                      {role.isSystem ? "System" : "Custom"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openEditModal(role.id)}
                      disabled={role.slug === "super-admin"}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {roles.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-text-muted"
                  >
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Edit Role" : "Create New Role"}
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  {isEditing
                    ? "Update role details and permissions."
                    : "Define a role and assign its permissions."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-text-muted hover:bg-background"
              >
                ✕
              </button>
            </div>

            {isEditing && roleLoading ? (
              <p className="p-6 text-sm text-text-muted">
                Loading role details...
              </p>
            ) : isEditing && roleLoadingError ? (
              <p className="p-6 text-sm text-red-600">
                Unable to load role details. Close the modal and try again.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="space-y-5 overflow-y-auto p-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Event Manager"
                      required
                      minLength={2}
                      maxLength={100}
                      disabled={isEditing && !!roleDetail?.isSystem}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                    />
                    {isEditing && roleDetail?.isSystem && (
                      <p className="mt-1 text-xs text-text-muted">
                        System role names cannot be changed.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the responsibilities of this role"
                      maxLength={500}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Permissions</h3>
                      <span className="text-xs text-text-muted">
                        {permissionIds.length} selected
                      </span>
                    </div>

                    {permissionsLoading ? (
                      <p className="text-sm text-text-muted">
                        Loading permissions...
                      </p>
                    ) : permissionsError ? (
                      <p className="text-sm text-red-600">
                        Unable to load permissions.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {permissionGroups.map((group) => (
                          <div
                            key={group.resource}
                            className="rounded-xl border border-border p-4"
                          >
                            <h4 className="mb-3 text-sm font-semibold capitalize">
                              {group.resource}
                            </h4>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {group.permissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex cursor-pointer items-start gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={permissionIds.includes(
                                      permission.id,
                                    )}
                                    onChange={() =>
                                      togglePermission(permission.id)
                                    }
                                    className="mt-1 accent-primary"
                                  />

                                  <span>
                                    <span className="font-medium capitalize">
                                      {permission.action}
                                    </span>
                                    {permission.description && (
                                      <span className="mt-0.5 block text-xs text-text-muted">
                                        {permission.description}
                                      </span>
                                    )}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {mutationError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {mutationError instanceof Error
                        ? mutationError.message
                        : "Unable to save role."}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-border p-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSaving ||
                      name.trim().length < 2 ||
                      permissionsLoading ||
                      permissionsError
                    }
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : isEditing
                        ? "Save Changes"
                        : "Create Role"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
