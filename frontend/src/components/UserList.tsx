import { UserCard } from "./UserCard";
import { theme } from "../utils/theme";
import type { User } from "../types/user.types";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (user: User) => void;
}
export const UserList = ({
  users,
  isLoading,
  error,
  onDelete,
  onUpdate,
}: UserListProps) => {
  //loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div
          style={{ borderTopColor: theme.colors.primary }}
          className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
        >
          <span
            style={{ color: theme.colors.textSecondary }}
            className="ml-3 text-sm"
          >
            Loading users...
          </span>
        </div>
      </div>
    );
  }
  //Error state
  if (error) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.error,
          color: theme.colors.error,
        }}
        className="rounded-lg border p-6 text-center text-sm"
      >
        {error}
      </div>
    );
  }
  //Empty state
  if (users.length === 0) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border,
          color: theme.colors.textSecondary,
        }}
        className="rounded-lg border p-12 text-center"
      >
        <p className="text-sm">No users found.</p>
        <p className="text-xs mt-1">
          Try adjusting your search or create a new user.
        </p>
      </div>
    );
  }
  //   User List
  return (
    <div className="flex flex-col gap-3">
      {/* List header-show total count */}
      <div className="flex items-center justify-between mb-1">
        <p style={{ color: theme.colors.textSecondary }} className="text-xs">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>
      </div>
      {/* show one card per user */}
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
