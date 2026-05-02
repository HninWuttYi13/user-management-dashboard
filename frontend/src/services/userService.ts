import httpClient from "../utils/httpClient";
import type {
  CreateUserInput,
  DeleteUserResponse,
  UpdateUserInput,
  UserListResponse,
  UserQueryParams,
  UserResponse,
} from "../types/user.types";

// GER /api/users - fetch paginated and filtered user list
export const getAllUser = async (
  params?: UserQueryParams,
): Promise<UserListResponse> => {
  const response = await httpClient.get<UserListResponse>("/users", { params });
  return response.data;
};

//GET /api/users/:id - fetch single user by UUID
export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await httpClient.get<UserResponse>(`/users/${id}`);
  return response.data;
};
//POST /api/users - create new user
export const createUser = async (
  data: CreateUserInput,
): Promise<UserResponse> => {
  const response = await httpClient.post<UserResponse>(`/users`, data);
  return response.data;
};
// PUT /api/users/:id — update existing user
export const updateUser = async (
  id: string,
  data: UpdateUserInput,
): Promise<UserResponse> => {
  const response = await httpClient.put<UserResponse>(`/users/${id}`, data);
  return response.data;
};

// DELETE /api/users/:id — delete user by UUID
export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  const response = await httpClient.delete<DeleteUserResponse>(`/users/${id}`);
  return response.data;
};
