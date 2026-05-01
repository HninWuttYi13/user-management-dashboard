import type { Request } from "express";

export interface PaginationMeta {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}

export interface PaginationLinks {
  next: string | null;
  prev: string | null;
}

export interface PaginationData {
  meta: PaginationMeta;
  links: PaginationLinks;
}

/**
 * Generate complete pagination data including metadata and navigation links
 * @param req - Express request object used to build absolute URLs
 * @param total - Total number of items across all pages
 * @param currentPage - Current page number (1-based)
 * @param perPage - Number of items per page
 * @returns Complete pagination meta and next/prev navigation links
 */
export function generatePaginationData(
  req: Request,
  total: number,
  currentPage: number,
  perPage: number,
): PaginationData {
  // Return safe defaults when there is no data
  if (total === 0) {
    return {
      meta: { total: 0, currentPage: 1, lastPage: 1, perPage },
      links: { next: null, prev: null },
    };
  }

  const lastPage = Math.ceil(total / perPage);

  // Clamp currentPage to lastPage in case of out-of-range requests
  const normalizedPage = currentPage > lastPage ? lastPage : currentPage;

  const meta: PaginationMeta = {
    total,
    currentPage: normalizedPage,
    lastPage,
    perPage,
  };

  // Build base URL from request to support any deployment domain
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const queryParams = new URLSearchParams();

  // Preserve existing query params (e.g. search, filter) in pagination links
  for (const [key, value] of Object.entries(req.query)) {
    if (value !== undefined) {
      queryParams.set(key, String(value));
    }
  }

  queryParams.set("limit", perPage.toString());

  const links: PaginationLinks = { next: null, prev: null };

  if (normalizedPage < lastPage) {
    queryParams.set("page", (normalizedPage + 1).toString());
    links.next = `${baseUrl}?${queryParams.toString()}`;
  }

  if (normalizedPage > 1) {
    queryParams.set("page", (normalizedPage - 1).toString());
    links.prev = `${baseUrl}?${queryParams.toString()}`;
  }

  return { meta, links };
}
/*
Example response:
*/
// {
//     "meta": {
//       "total": 150,
//       "currentPage": 2,
//       "lastPage": 15,
//       "perPage": 10
//     },
//     "links": {
//       "next": "https://api.example.com/users?search=john&limit=10&page=3",
//       "prev": "https://api.example.com/users?search=john&limit=10&page=1"
//     }
//   }
