import { useState } from "react";
import { Button } from "./ui/Button";
import { theme } from "../utils/theme";
import type { User } from "../types/user.types";

interface UserCardProps {
  user: User;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (user: User) => void;
}
export const UserCard = ({ user, onDelete, onUpdate }: UserCardProps )=> {
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //handle delete with loading and error state
  const handleDelete = async () => {
    //confirm before delete
    const confirmed = window.confirm(`Are you sure to delete "${user.name}"?`);
    if (!confirmed) return;
    setIsDelete(false);
    setError(null);
    try {
        await onDelete(user.id)
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete User")
    } finally {
        setIsDelete(false);
    }
  };
  return (
    <div
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.border,
      }}
      className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      {/* Avatar- first letter of name as visual identifier */}
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
      {/* User info- use truncate long text to prevent layout break */}
      <div className="flex-1 min-w-0">
        {/* show name */}
        <p
          style={{ color: theme.colors.textPrimary }}
          className="text-sm font-semibold truncate"
        >
          {user.name}
        </p>
        {/* show username */}
        <p
          style={{ color: theme.colors.textSecondary }}
          className="text-xs truncate"
        >
          @{user.username}
        </p>
        {/* show user's email */}
        <p
          style={{ color: theme.colors.textSecondary }}
          className="text-xs truncate"
        >
          {user.email}
        </p>
      </div>
      {/* inline error that shown when delete fails */}
      {error && (
        <p style={{color: theme.colors.error}} className="text-xs">
            {error}
        </p>
      )}
      {/* Action buttons */}
      <div className="flex gap-2 shrink-0">
         <Button 
         label="Edit"
         variant="ghost"
         onClick={()=> onUpdate(user)}
         />
        <Button
        label="Delete"
        variant="danger"
        onClick={handleDelete}
        isLoading={isDelete}
        />
      </div>
    </div>
  );
};
