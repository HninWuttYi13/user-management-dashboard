import { useState } from "react";
import { useToast } from "./useToast";
import { useUsers } from "./useUsers";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user.types";

export const useDashboard = () => {
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

  //Toast
  const { toast, showToast, hideToast } = useToast();
  // Local UI State
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
        // Update mode — id exists and extract message from response
       const response = await handleUpdate(id, data as UpdateUserInput);
       showToast(response.message, "success")
      } else {
        // Create mode — no id
        const response =await handleCreate(data as CreateUserInput);
        showToast(response.message, "success");
      }
      // Close form after successful submission
      handleCancel();
    };
  //handle delete -show message from backend in toast
  const handleDeleteWithToast = async(id: string): Promise<void>=> {
    try {
      const response = await handleDelete(id);
      showToast(response.message, "success")
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete user",
        "error",
      );
    }
  }
  return {
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
  };
};
