import { theme } from "../../utils/theme";
//Reusable button component
interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}
//Inline styles using them constants
const getVariantStyle = (variant: string): React.CSSProperties => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: theme.colors.primary,
        color: theme.colors.textPrimary,
      };
    case "danger":
      return {
        backgroundColor: theme.colors.error,
        color: theme.colors.textPrimary,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        border: `1px solid ${theme.colors.primary}`,
        color: theme.colors.primary,
      };
    default:
      return {};
  }
};
export const Button = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={getVariantStyle(variant)}
      className={`
            px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? "Loading" : label}
    </button>
  );
};
