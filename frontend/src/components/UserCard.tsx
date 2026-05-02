import { useState } from "react";
import { Button } from "./ui/Button";
import { theme } from "../utils/theme";
import type { User } from "../types/user.types";

interface UserCardProps {
  user: User;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (user: User) => void;
}

export const UserCard = ({ user, onDelete, onUpdate }: UserCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show inline confirm box instead of browser dialog
  const handleDeleteClick = () => {
    setShowConfirm(true);
    setError(null);
  };

  // User confirmed — proceed with delete
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);

    try {
      await onDelete(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // User cancelled — hide confirm box
  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: showConfirm ? theme.colors.error : theme.colors.border,
      }}
      className="rounded-lg border p-4 flex flex-col gap-3"
    >
      {/* Main row — avatar, info, buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar — first letter of name as visual identifier */}
        <div
          style={{ backgroundColor: theme.colors.primary }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        >
          <span
            style={{ color: theme.colors.textPrimary }}
            className="text-sm font-bold uppercase"
          >
            {user.name.charAt(0)}
          </span>
        </div>

        {/* User info — truncate long text to prevent layout break */}
        <div className="flex-1 min-w-0">
          <p
            style={{ color: theme.colors.textPrimary }}
            className="text-sm font-semibold truncate"
          >
            {user.name}
          </p>
          <p
            style={{ color: theme.colors.textSecondary }}
            className="text-xs truncate"
          >
            @{user.username}
          </p>
          <p
            style={{ color: theme.colors.textSecondary }}
            className="text-xs truncate"
          >
            {user.email}
          </p>
        </div>

        {/* Inline error — shown if delete fails */}
        {error && (
          <p style={{ color: theme.colors.error }} className="text-xs">
            {error}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            label="Edit"
            variant="ghost"
            onClick={() => onUpdate(user)}
            disabled={showConfirm}
          />
          <Button
            label="Delete"
            variant="danger"
            onClick={handleDeleteClick}
            isLoading={isDeleting}
            disabled={showConfirm}
          />
        </div>
      </div>

      {/* Inline confirm box — replaces browser window.confirm */}
      {showConfirm && (
        <div
          style={{
            backgroundColor: theme.colors.navyBg,
            borderColor: theme.colors.error,
          }}
          className="rounded-md border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <p style={{ color: theme.colors.textSecondary }} className="text-xs">
            Are you sure you want to delete{" "}
            <span
              style={{ color: theme.colors.textPrimary }}
              className="font-semibold"
            >
              "{user.name}"
            </span>
            ? This cannot be undone.
          </p>

          <div className="flex gap-2 shrink-0">
            <Button
              label="Cancel"
              variant="ghost"
              onClick={handleCancelDelete}
            />
            <Button
              label="Yes, Delete"
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            />
          </div>
        </div>
      )}
    </div>
  );
};
