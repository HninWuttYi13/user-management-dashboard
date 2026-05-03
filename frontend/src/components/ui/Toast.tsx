import { useEffect } from "react";
import { theme } from "../../utils/theme";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  // Auto dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        backgroundColor:
          type === "success" ? theme.colors.success : theme.colors.error,
        color: theme.colors.textPrimary,
      }}
      className="fixed bottom-6  left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium"
    >
      {/* Icon */}
      <span>{type === "success" ? "✓" : "✕"}</span>

      {/* Message */}
      <span>{message}</span>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{ color: theme.colors.navyBg }}
        className="ml-2  hover:opacity-100 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
