import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

import Button from "./Button";

type PaginationProps = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (selectedPage: number) => void;
  onPageSizeChange: (size: number) => void;
  title: string;
};
export const PageLabel = ({
  page,
  currentPage,
}: {
  page: number;
  currentPage: number;
}) => (
  <Button
    variant={page === currentPage ? "primary" : "ghost"}
    size="sm"
    className={`w-8 h-8 p-0 min-w-0 flex items-center justify-center transition-all ${
      page === currentPage
        ? "shadow-sm shadow-[#4F46E5]/20"
        : "text-[#1b2559] bg-transparent hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
    }`}
  >
    {page}
  </Button>
);

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  title = "items",
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const [inputPage, setInputPage] = useState("");

  const handleJump = () => {
    const page = Number.parseInt(inputPage, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page - 1); // react-paginate uses 0-based index
      setInputPage("");
    }
  };

  return (
    <div className="bg-white px-6 py-5 rounded-b-[20px] flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 border-t border-[#f4f7fe] dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center space-x-6">
        {/* Page size selector */}
        <div className="flex items-center space-x-3">
          <label
            htmlFor="pageSize"
            className="text-sm font-semibold text-[#A3AED0] dark:text-gray-400"
          >
            Show
          </label>
          <div className="relative">
            <select
              id="pageSize"
              className="appearance-none border border-gray-100 rounded-[10px] px-3 py-1.5 text-sm bg-white text-[#1B2559] font-bold outline-none hover:border-[#4F46E5] focus:border-[#4F46E5] cursor-pointer transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 min-w-[70px]"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={totalItems === 0}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#1B2559] dark:text-gray-400">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Show count info */}
        {totalItems === 0 ? (
          <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
            No {title} to display
          </p>
        ) : (
          <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
            Showing{" "}
            <span className="font-bold text-[#A3AED0] dark:text-gray-200">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-[#A3AED0] dark:text-gray-200">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#A3AED0] dark:text-gray-200">
              {totalItems}
            </span>{" "}
            {title}
          </p>
        )}
      </div>

      {totalPages > 0 && (
        <div className="flex items-center space-x-4 lg:flex-row gap-4 flex-col w-full lg:w-auto">
          {/* Pagination */}
          <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage - 1}
            onPageChange={(selected) => onPageChange(selected.selected)}
            containerClassName="flex space-x-1 items-center"
            pageClassName="rounded-md overflow-hidden"
            activeClassName="active"
            disabledClassName="opacity-30 cursor-not-allowed"
            previousLabel={
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 min-w-0 text-gray-400 hover:text-[#4F46E5] bg-transparent hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            }
            nextLabel={
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 min-w-0 text-gray-400 hover:text-[#4F46E5] bg-transparent hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            }
            pageLabelBuilder={(page) => (
              <PageLabel page={page} currentPage={currentPage} />
            )}
            breakLabel={<span className="text-gray-400 px-1">...</span>}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
          />

          {/* Jump to page */}
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-[10px] border border-gray-100 dark:border-gray-700">
            <input
              type="number"
              min={1}
              max={totalPages}
              className="w-16 bg-transparent border-none px-2 py-1 text-sm font-bold text-[#1B2559] dark:text-gray-200 outline-none placeholder:font-medium placeholder:text-gray-400"
              placeholder="Page"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleJump}
              disabled={!inputPage}
              className="h-[28px] rounded-[8px] px-3 text-[0.875] font-bold bg-[#4F46E5] hover:bg-[#3311DD]"
            >
              Go
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
