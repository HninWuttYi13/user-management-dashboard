import {  useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { theme } from "../utils/theme";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.types";

interface UserFormProps {
  //user provided-> update mode, null -> create mode
  editingUser: User | null;
  onSubmit: (
    id: string | null,
    data: CreateUserInput | UpdateUserInput,
  ) => Promise<void>;
  onCancel: () => void;
}
//Types
interface FormFields {
  name: string;
  username: string;
  email: string;
}
interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
}
// Initial Values
const EMPTY_FORMS: FormFields = {
  name: "",
  username: "",
  email: "",
};
// Client-side validation — mirrors backend Zod rules
// Provides instant feedback without a network round trip
// Backend still validates as the source of truth
const validateForm = (fields: FormFields, isUpdate: boolean): FormErrors => {
  const errors: FormErrors = {};

  if (!isUpdate || fields.name) {
    if (!fields.name.trim()) {
      errors.name = "Name is required";
    } else if (fields.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
  }

  if (!isUpdate || fields.username) {
    if (!fields.username.trim()) {
      errors.username = "Username is required";
    } else if (fields.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
  }

  if (!isUpdate || fields.email) {
    if (!fields.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = "Invalid email format";
    }
  }

  return errors;
};
// Component
export const UserForm = ({
  editingUser,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const isUpdate = editingUser !== null;

  // Derive initial form values from props 
  // key prop in parent will remount this component when editingUser changes
  const [fields, setFields] = useState<FormFields>(
    editingUser
      ? {
          name: editingUser.name,
          username: editingUser.username,
          email: editingUser.email,
        }
      : EMPTY_FORMS,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Field Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    //clear fields error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //client-side validation before hitting API server
    const validationErrors = validateForm(fields, isUpdate);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isUpdate) {
        //only send changed fields for  update
        const changeFields: UpdateUserInput = {};
        if (fields.name !== editingUser.name) changeFields.name = fields.name;
        if (fields.username !== editingUser.username)
          changeFields.username = fields.username;
        if (fields.email !== editingUser.email)
          changeFields.email = fields.email;
       await onSubmit(editingUser.id, changeFields);
      } else {
        //send all fields for create user
        await onSubmit(null, fields as CreateUserInput);
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.border,
      }}
      className="rounded-lg border p-6 mb-6"
    >
      {/* Form header — shows mode */}
      <h2
        style={{ color: theme.colors.textPrimary }}
        className="text-base font-semibold mb-4"
      >
        {isUpdate ? `Edit User — ${editingUser?.name}` : "Create New User"}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4">
          {/* Name field */}
          <Input
            label="Full Name"
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="e.g. Harry Potter"
            error={errors.name}
          />

          {/* Username field */}
          <Input
            label="Username"
            name="username"
            value={fields.username}
            onChange={handleChange}
            placeholder="e.g. harrypotter"
            error={errors.username}
          />

          {/* Email field */}
          <Input
            label="Email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="e.g. harry@example.com"
            error={errors.email}
          />

          {/* API error — shown below fields */}
          {submitError && (
            <p style={{ color: theme.colors.error }} className="text-sm">
              ⚠ {submitError}
            </p>
          )}

          {/* Form actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              label={isUpdate ? "Save Changes" : "Create User"}
              variant="primary"
              isLoading={isSubmitting}
            />
            <Button
              type="button"
              label="Cancel"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
