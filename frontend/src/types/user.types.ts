export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: {
    meta: PaginationMeta;
    links: { next: string | null; prev: string | null };
  };
}
