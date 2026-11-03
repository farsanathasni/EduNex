
import { api } from "@/lib/axios";

// One role in the roles list
export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  totalAssigned: number;
}

// Permission inside a resource group
export interface Permission {
  id: number;
  action: string;
  description: string | null;
}

// Permissions grouped by resource
export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

// Single role details
export interface RoleDetail extends Role {
  permissionIds: number[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all roles
export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  const response = await api.get("/roles");
  return response.data;
};

// Fetch one role
export const getRole = async (
  id: number,
): Promise<ApiResponse<RoleDetail>> => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

// Fetch available permissions
export const getPermissionCatalog = async (): Promise<
  ApiResponse<PermissionGroup[]>
> => {
  const response = await api.get("/roles/permissions");
  return response.data;
};

// Create a new role
export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionIds: number[];
}

export const createRole = async (
  data: CreateRoleInput,
): Promise<ApiResponse<Role>> => {
  const response = await api.post("/roles", data);
  return response.data;
};

// Update an existing role
export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export const updateRole = async (
  id: number,
  data: UpdateRoleInput,
): Promise<ApiResponse<{ id: number }>> => {
  const response = await api.patch(`/roles/${id}`, data);
  return response.data;
};

// Delete a role
export const deleteRole = async (
  id: number,
): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};
