import { SearchBar } from "./components/SearchBar.js";
import { UserList } from "./components/UserList.js";
import { UserForm } from "./components/UseForm.js";
import { Pagination } from "./components/Pagination.js";
import { Button } from "./components/ui/Button.js";
import { Toast } from "./components/ui/Toast.js";
import { theme } from "./utils/theme.js";
import { useDashboard } from "./hooks/useDashboard.js";

const App = () => {
  const {
    // Data
    users,
    pagination,
    isLoading,
    error,
    // Form state
    showForm,
    editingUser,
    // Handlers
    handleSearch,
    handlePageChange,
    handleSubmit,
    handleDeleteWithToast,
    handleOpenCreate,
    handleOpenEdit,
    handleCancel,
    // Toast
    toast,
    hideToast,
  } = useDashboard();
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
              className="text-md font-bold"
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
          onDelete={handleDeleteWithToast}
          onUpdate={handleOpenEdit}
        />

        {/* Pagination — only renders if more than one page */}
        {pagination && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </main>
      {/* Toast — fixed bottom right, auto dismisses */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default App;
