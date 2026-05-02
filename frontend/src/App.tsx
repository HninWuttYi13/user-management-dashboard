import { useState } from "react";
import { useUsers } from "./hooks/useUser.js";
import { SearchBar } from "./components/SearchBar.js";
import { UserList } from "./components/UserList.js";
import { UserForm } from "./components/UseForm.js";
import { Pagination } from "./components/Pagination.js";
import { Button } from "./components/ui/Button.js";
import { theme } from "./utils/theme.js";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "./types/user.types.js";

const App = () => {
  // ── Custom Hook ────────────────────────────
  // Single source of truth for all user data and operations
  const {
    users,
    pagination,
    isLoading,
    error,
    handleSearch,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useUsers();

  //  Local UI State
  // Controls form visibility and which user is being edited
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form Handlers

  // Open form in create mode
  const handleOpenCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  // Open form in edit mode — pre-fills with user data
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Close form and reset editing state
  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // Handle form submission for both create and update
  const handleSubmit = async (
    id: string | null,
    data: CreateUserInput | UpdateUserInput,
  ): Promise<void> => {
    if (id) {
      // Update mode — id exists
      await handleUpdate(id, data as UpdateUserInput);
    } else {
      // Create mode — no id
      await handleCreate(data as CreateUserInput);
    }
    // Close form after successful submission
    handleCancel();
  };

  //  Render 
  return (
    <div style={{ backgroundColor: theme.colors.navyBg, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: theme.colors.cardBg,
          borderBottomColor: theme.colors.border,
        }}
        className="border-b px-6 py-4"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              style={{
                color: theme.colors.textPrimary,
                borderLeftColor: theme.colors.border,
              }}
              className="text-md"
            >
              User Management
            </span>
          </div>

          {/* Create button */}
          <Button
            label={showForm && !editingUser ? "Cancel" : "+ Create User"}
            variant={showForm && !editingUser ? "ghost" : "primary"}
            onClick={showForm && !editingUser ? handleCancel : handleOpenCreate}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Create / Edit Form */}
        {/* key forces remount when editingUser changes — resets form state */}
        {showForm && (
          <UserForm
            key={editingUser?.id ?? "create"}
            editingUser={editingUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Search bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* User list — handles loading, error, empty states internally */}
        <UserList
          users={users}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          onUpdate={handleOpenEdit}
        />

        {/* Pagination — only renders if more than one page */}
        {pagination && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  );
};

export default App;
