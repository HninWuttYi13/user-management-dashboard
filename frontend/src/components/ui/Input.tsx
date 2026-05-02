import { theme } from "../../utils/theme";
interface InputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
}
export const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          style={{ color: theme.colors.textSecondary }}
          className="text-sm font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: error ? theme.colors.error : theme.colors.border,
          color: theme.colors.textPrimary,
        }}
        className="
      w-full px-3 py-2 rounded-md text-sm border 
      focus:outline-none
       placeholder:text-slate-500 
       transition-colors duration-200 
       disabled:opacity-50
      "
      />
      {error && (
        <span style={{ color: theme.colors.error }} className="text-xs">
          {error}
        </span>
      )}
    </div>
  );
};
