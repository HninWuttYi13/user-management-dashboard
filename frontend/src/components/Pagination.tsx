import { Button } from "./ui/Button.js";
import { theme } from "../utils/theme.js";
import type { PaginationData } from "../types/user.types.js";

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { meta } = pagination;
  const { currentPage, lastPage, total, perPage } = meta;

  // Do not render if only one page
  if (lastPage <= 1) return null;

  // Calculate showing range — e.g. "Showing 1-10 of 30"
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  // Generate page numbers to show
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];

    // Always show first page
    pages.push(1);

    // Show pages around current page
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < lastPage) {
        pages.push(i);
      }
    }

    // Always show last page
    if (lastPage > 1) pages.push(lastPage);

    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Showing X-Y of Z */}
      <p style={{ color: theme.colors.textSecondary }} className="text-xs">
        Showing {from}–{to} of {total} users
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          label="← Prev"
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {/* Page number buttons */}
        {pageNumbers.map((page, index) => {
          // Add ellipsis gap between non-consecutive pages
          const prevPage = pageNumbers[index - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span
                  style={{ color: theme.colors.textSecondary }}
                  className="px-2 text-sm"
                >
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(page)}
                style={{
                  // Highlight current page with brand color
                  backgroundColor:
                    page === currentPage ? theme.colors.primary : "transparent",
                  color:
                    page === currentPage
                      ? theme.colors.textPrimary
                      : theme.colors.textSecondary,
                  borderColor: theme.colors.border,
                }}
                className="w-8 h-8 rounded-md text-sm border transition-colors duration-200"
              >
                {page}
              </button>
            </div>
          );
        })}

        {/* Next button */}
        <Button
          label="Next →"
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
        />
      </div>
    </div>
  );
};
