import { useState, useCallback, useEffect } from "react";

interface ToastState {
  message: string;
  type: "success" | "error";
  visible: boolean;
}

const INITIAL_TOAST: ToastState = {
  message: "",
  type: "success",
  visible: false,
};

const TOAST_DURATION = 3000; 

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST);

  // Auto disappear toast after TOAST_DURATION milliseconds
  // Runs whenever toast becomes visible
  // Cleanup cancels timer if toast is manually closed before timeout
  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast(INITIAL_TOAST);
    }, TOAST_DURATION);

    // Cancel timer if toast is hidden before timeout
    return () => clearTimeout(timer);
  }, [toast.visible]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type, visible: true });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast(INITIAL_TOAST);
  }, []);

  return { toast, showToast, hideToast };
};
