//Core user entity-  matches backend User interface
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}
//Pagination metadata from backend
export interface PaginationMeta {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}
export interface PaginationLinks {
  next: string | null;
  prev: string | null;
}
export interface PaginationData {
  meta: PaginationMeta;
  links: PaginationLinks;
}
//Generic API response wrapper - matches backend successResponse Shape
export interface ApiResponse<T>{
  success: boolean;
  message: string;
  data: T;
}
//Specific response types
export type UserListData = {
  users: User[];
  pagination: PaginationData;
}
export type UserListResponse = ApiResponse<UserListData>;
export type UserResponse = ApiResponse<User>;
export type DeleteUserResponse = ApiResponse<null>;
//Form input types - used in create and update forms
export interface CreateUserInput {
  name: string;
  username: string;
  email: string;
}
export type UpdateUserInput = Partial<CreateUserInput>;
//Query params for GET /api/users
export interface UserQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  username?: string;
  email?: string;
}