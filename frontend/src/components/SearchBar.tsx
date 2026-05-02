import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { theme } from "../utils/theme";
import type { UserQueryParams } from "../types/user.types";

interface SearchBarProps {
  onSearch: (filters: Partial<UserQueryParams>) => void;
  isLoading?: boolean;
}
// Initial empty search state
const INITIAL_SEARCH = {
  name: "",
  username: "",
  email: "",
};
export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [filters, setFilters] = useState(INITIAL_SEARCH);
  //update individual filter field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  //Submit search with current filters
  const handleSearch = () => {
    onSearch({
      name: filters.name || undefined,
      username: filters.username || undefined,
      email: filters.email || undefined,
    });
  };
  //Clear all filters and reset search
  const handleReset = () => {
    setFilters(INITIAL_SEARCH);
    onSearch({});
  };
  //Allow search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <div
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.border,
      }}
      className="rounded-lg border p-4 mb-6"
    >
      <p
        style={{ color: theme.colors.textSecondary }}
        className="text-sm mb-3 font-medium"
      >
        Search Users
      </p>
      {/* Three search fields side by side */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* search by name */}
        <div className="flex-1">
          <Input
            name="name"
            value={filters.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by name"
          />
        </div>
        {/* search by username */}
        <div className="flex-1">
          <Input
            name="username"
            value={filters.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by username"
          />
        </div>
        {/* search by email */}
        <div className="flex-1">
          <Input
            name="email"
            value={filters.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by email..."
          />
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 items-end">
          <Button
            label="Search"
            onClick={handleSearch}
            isLoading={isLoading}
            variant="primary"
          />
          <Button
            label="Reset"
            onClick={handleReset}
            variant="ghost"
          />
        </div>
      </div>
    </div>
  );
};
