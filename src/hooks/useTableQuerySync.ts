import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { SORT_DIRECTION } from "@/shared/types";

/**
 * Configuration options for the useTableQuerySync hook
 */
export interface UseTableQuerySyncOptions {
  /**
   * Default page size (defaults to 10)
   */
  defaultPageSize?: number;
  /**
   * Default sort key (defaults to empty string)
   */
  defaultSortKey?: string;
  /**
   * Default sort direction (defaults to 1 for ascending)
   */
  defaultSortDirection?: SORT_DIRECTION;
  /**
   * Skip URL update on first render (defaults to false)
   * Set to true only if the table is on a page with other client components
   * that should not be reset on mount (e.g., charts)
   */
  skipFirstRender?: boolean;
}

/**
 * Return type for the useTableQuerySync hook
 */
export interface UseTableQuerySyncReturn {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;
  /**
   * Current page size
   */
  pageSize: number;
  /**
   * Current sort key
   */
  sortKey: string;
  /**
   * Current sort direction
   */
  sortDirection: SORT_DIRECTION;
  /**
   * Selected row IDs
   */
  selectedRows: string[];
  /**
   * Set the current page
   */
  setCurrentPage: (page: number) => void;
  /**
   * Set the page size
   */
  setPageSize: (size: number) => void;
  /**
   * Set the sort key
   */
  setSortKey: (key: string) => void;
  /**
   * Set the sort direction
   */
  setSortDirection: (direction: SORT_DIRECTION) => void;
  /**
   * Set the selected rows
   */
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  /**
   * Handler for sort changes (combines setSortKey and setSortDirection)
   */
  handleSort: (sortKey: string, sortDirection: SORT_DIRECTION) => void;
  /**
   * Handler for page changes (converts 0-indexed to 1-indexed)
   */
  handlePageChange: (page: number) => void;
  /**
   * Handler for page size changes (resets to page 1)
   */
  handlePageSizeChange: (size: number) => void;
}

/**
 * Custom hook for managing table pagination, sorting, and URL query synchronization.
 *
 * This hook encapsulates the common logic for:
 * - Managing pagination state (currentPage, pageSize)
 * - Managing sorting state (sortKey, sortDirection)
 * - Synchronizing state with URL query parameters
 * - Providing handlers for pagination and sorting changes
 *
 * @param options - Configuration options for the hook
 * @returns Object containing state, setters, and handlers
 *
 * @example
 * ```tsx
 * const {
 *   currentPage,
 *   pageSize,
 *   sortKey,
 *   sortDirection,
 *   selectedRows,
 *   setSelectedRows,
 *   handleSort,
 *   handlePageChange,
 *   handlePageSizeChange,
 * } = useTableQuerySync({
 *   defaultSortKey: "createdAt",
 *   defaultSortDirection: -1,
 * });
 * ```
 */
export const useTableQuerySync = (
  options: UseTableQuerySyncOptions = {},
): UseTableQuerySyncReturn => {
  const {
    defaultPageSize = 10,
    defaultSortKey = "",
    defaultSortDirection = 1,
    skipFirstRender = false,
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  // Initialize state from URL parameters
  const [currentPage, setCurrentPage] = useState(() => {
    const skip = searchParams.get("skip");
    const limit = searchParams.get("limit");
    if (skip && limit) {
      return Math.floor(Number(skip) / Number(limit)) + 1;
    }
    return 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const limit = searchParams.get("limit");
    return limit ? Number(limit) : defaultPageSize;
  });

  const [sortKey, setSortKey] = useState(() => {
    return searchParams.get("sortKey") || defaultSortKey;
  });

  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(() => {
    const urlSortDirection = searchParams.get("sortDirection");
    return urlSortDirection
      ? (Number(urlSortDirection) as SORT_DIRECTION)
      : defaultSortDirection;
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Sync state with URL query parameters
  useEffect(() => {
    // Skip first render only if explicitly requested
    if (skipFirstRender && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const newParams = new URLSearchParams(searchParams.toString());

    // Handle skip parameter (pagination)
    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip");
    }

    // Handle limit parameter (page size)
    if (pageSize === defaultPageSize) {
      newParams.delete("limit");
    } else {
      newParams.set("limit", pageSize.toString());
    }

    // Handle sort parameters
    if (sortKey) {
      newParams.set("sortKey", sortKey);
      newParams.set("sortDirection", sortDirection.toString());
    } else {
      newParams.delete("sortKey");
      newParams.delete("sortDirection");
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);

  // Handler for sort changes
  const handleSort = (newSortKey: string, newSortDirection: SORT_DIRECTION) => {
    setSortKey(newSortKey);
    setSortDirection(newSortDirection);
  };

  // Handler for page changes (converts 0-indexed to 1-indexed)
  const handlePageChange = (page: number) => {
    setCurrentPage(page + 1);
  };

  // Handler for page size changes (resets to page 1)
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    sortKey,
    sortDirection,
    selectedRows,
    setCurrentPage,
    setPageSize,
    setSortKey,
    setSortDirection,
    setSelectedRows,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  };
};
