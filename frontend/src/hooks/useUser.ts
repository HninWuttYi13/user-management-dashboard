import { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getAllUser,
  updateUser,
} from "../services/userService.js";
import type {
  CreateUserInput,
  PaginationData,
  UpdateUserInput,
  User,
  UserQueryParams,
} from "../types/user.types.js";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

// Internal state managed by this hook (UI state + data)
interface UsersState {
  users: User[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
}

// What this hook exposes to components
interface UseUsersReturn extends UsersState {
  params: UserQueryParams;
  handleSearch: (filters: Partial<UserQueryParams>) => void;
  handlePageChange: (page: number) => void;
  handleCreate: (data: CreateUserInput) => Promise<void>;
  handleUpdate: (id: string, data: UpdateUserInput) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

// ─────────────────────────────────────────────
// Default Values
// ─────────────────────────────────────────────

// Initial UI state (avoids undefined issues)
const INITIAL_STATE: UsersState = {
  users: [],
  pagination: null,
  isLoading: false,
  error: null,
};

// Default query parameters for API
const DEFAULT_PARAMS: UserQueryParams = {
  page: 1,
  limit: 10,
};

// Hook
export const useUsers = (): UseUsersReturn => {
  // Main state: holds data + UI states
  const [state, setState] = useState<UsersState>(INITIAL_STATE);

  // Query params: controls what data to fetch (page, search, limit)
  const [params, setParams] = useState<UserQueryParams>(DEFAULT_PARAMS);

  // Fetch Users
  // Runs automatically whenever params change
  // (search, pagination, filtering)
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await getAllUser(params);

        // Only update state if this request is still the latest one
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            users: response.data.users,
            pagination: response.data.pagination,
            isLoading: false,
          }));
        }
      } catch (error) {
        // Only update error state if this request is still the latest one
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to fetch users";
          setState((prev) => ({ ...prev, error: message, isLoading: false }));
        }
      }
    };

     fetchUsers();

    // Cleanup — cancel stale request when params change before response arrives
    return () => {
      cancelled = true;
    };
  }, [params]); // ← only params here, no fetchUsers reference needed

  //Search & Pagination 

  // Update search filters → reset page to 1
  const handleSearch = (filters: Partial<UserQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...filters,
      page: 1, // important: avoid invalid page after filtering
    }));
  };

  // Change only page number (keep filters)
  const handlePageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  // CRUD Operations 
  // After each operation → re-fetch to sync with backend

  const handleCreate = async (data: CreateUserInput): Promise<void> => {
    await createUser(data);
    setParams((prev) => ({ ...prev })); // trigger re-fetch
  };

  const handleUpdate = async (
    id: string,
    data: UpdateUserInput,
  ): Promise<void> => {
    await updateUser(id, data);
    setParams((prev) => ({ ...prev })); // trigger re-fetch
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteUser(id);
    setParams((prev) => ({ ...prev })); // trigger re-fetch
  };

  // Return 

  return {
    ...state, // users, pagination, isLoading, error
    params,
    handleSearch,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
