import { useState } from "react";
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
const getVariantStyle = (variant: string, isHovered: boolean): React.CSSProperties => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: isHovered ? theme.colors.primaryDark : theme.colors.primary,
        color: theme.colors.textPrimary,
      };
    case "danger":
      return {
        backgroundColor: isHovered
          ? theme.colors.dangerDark
          : theme.colors.primary,
        color: theme.colors.textPrimary,
      };
    case "ghost":
      return {
        backgroundColor: isHovered ? theme.colors.primary: "transparent",
        border: `1px solid ${theme.colors.primary}`,
        color: isHovered ? theme.colors.primaryDark :theme.colors.primary,
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
  const [isHovered, setIsHovered ] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={getVariantStyle(variant, isHovered && !disabled)}
      onMouseEnter={()=> setIsHovered(true)}
      onMouseLeave={()=> setIsHovered(false)}
      className={`
            px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {isLoading ? "Loading" : label}
    </button>
  );
};
