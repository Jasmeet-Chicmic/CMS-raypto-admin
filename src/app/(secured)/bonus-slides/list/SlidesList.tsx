"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Table, { TableColumn } from "@/components/atoms/Table";
import { SlideListItem } from "../helpers/types";
import { ROUTES } from "@/shared/routes";
import { deleteSlide, toggleSlideStatus } from "@/api/bonusSlides";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2, Plus, Menu, RotateCcw } from "lucide-react";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { MODAL_TYPE } from "@/components/molecules/ConfirmationModal/helpers/constants";
import { MESSAGES, STRING } from "@/shared/strings";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import { SORT_DIRECTION } from "@/shared/types";
import Select from "@/components/atoms/Select";
import { useTheme } from "next-themes";
import { THEME_TYPE } from "@/shared/constants";
import { StylesConfig } from "react-select";
import FilterSidebar from "@/components/molecules/FilterSidebar";

interface SlidesListProps {
  slidesListData: {
    status: boolean;
    data: {
      data: SlideListItem[];
      count: number;
    };
  };
  searchString: string;
}

const SlidesList = ({ slidesListData, searchString }: SlidesListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === THEME_TYPE.DARK;

  // Table state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    type?: MODAL_TYPE;
    slideId?: string;
  }>({
    open: false,
  });

  const slides = slidesListData?.data?.data || [];
  const totalCount = slidesListData?.data?.count || 0;

  // Sync URL params with state
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip");
    }

    if (pageSize !== 10) {
      newParams.set("limit", pageSize.toString());
    } else {
      newParams.delete("limit");
    }

    if (sortKey) {
      newParams.set("sortKey", sortKey);
      newParams.set("sortDirection", sortDirection.toString());
    } else {
      newParams.delete("sortKey");
      newParams.delete("sortDirection");
    }

    router.push(`?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);

  const handleView = (slideId: string) => {
    router.push(`${ROUTES.BONUS_SLIDES_EDIT}?id=${slideId}`);
  };

  const handleEdit = (slideId: string) => {
    router.push(`${ROUTES.BONUS_SLIDES_EDIT}?id=${slideId}`);
  };

  const handleDelete = async () => {
    if (!modal.slideId) return;

    const result = await deleteSlide(modal.slideId);
    if (result.status) {
      toast.success("Slide deleted successfully");
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.message || "Failed to delete slide");
    }
    setModal({ open: false });
  };

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    try {
      const res = await toggleSlideStatus(id, isActive);

      if (res.status) {
        toast.success(res.message || "Status updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred while updating status");
    }
  };

  const isActiveOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  const getStatusStyles = (
    isPositive: boolean,
  ): StylesConfig<{ value: boolean; label: string }, false> => ({
    control: (provided) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      fontSize: "12px",
      borderRadius: "9999px",
      backgroundColor: isPositive
        ? isDark
          ? "#064e3b"
          : "#f0fdf4"
        : isDark
          ? "#7f1d1d"
          : "#fef2f2",
      borderColor: isPositive
        ? isDark
          ? "#065f46"
          : "#bbf7d0"
        : isDark
          ? "#991b1b"
          : "#fecaca",
      boxShadow: "none",
      "&:hover": {
        borderColor: isPositive
          ? isDark
            ? "#059669"
            : "#86efac"
          : isDark
            ? "#dc2626"
            : "#fca5a5",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 12px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isPositive
        ? isDark
          ? "#34d399"
          : "#15803d"
        : isDark
          ? "#f87171"
          : "#b91c1c",
      fontWeight: "600",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 8px 0 0",
      color: isPositive
        ? isDark
          ? "#34d399"
          : "#15803d"
        : isDark
          ? "#f87171"
          : "#b91c1c",
      "&:hover": {
        color: isPositive
          ? isDark
            ? "#34d399"
            : "#15803d"
          : isDark
            ? "#f87171"
            : "#b91c1c",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      overflow: "hidden",
      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      backgroundColor: isDark ? "#111827" : "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? isPositive
          ? isDark
            ? "#064e3b"
            : "#f0fdf4"
          : isDark
            ? "#7f1d1d"
            : "#fef2f2"
        : state.isFocused
          ? isPositive
            ? isDark
              ? "#065f46"
              : "#f0fdf4"
            : isDark
              ? "#991b1b"
              : "#fef2f2"
          : "transparent",
      color:
        state.isSelected || state.isFocused
          ? isPositive
            ? isDark
              ? "#34d399"
              : "#15803d"
            : isDark
              ? "#f87171"
              : "#b91c1c"
          : isDark
            ? "#9ca3af"
            : "#374151",
      fontSize: "12px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isPositive
          ? isDark
            ? "#065f46"
            : "#dcfce7"
          : isDark
            ? "#991b1b"
            : "#fee2e2",
      },
    }),
  });

  const columns: TableColumn<SlideListItem>[] = [
    {
      title: "Title",
      field: "title",
      sortable: true,
      sortKey: "title",
    },
    {
      title: "Status",
      field: "isActive",
      render: (item) => (
        <div className="w-[120px]">
          <Select
            options={isActiveOptions}
            value={isActiveOptions.find((opt) => opt.value === item.isActive)}
            onChange={(val) =>
              val && handleStatusUpdate(item._id, val.value as boolean)
            }
            isSearchable={false}
            styles={getStatusStyles(item.isActive)}
          />
        </div>
      ),
    },
    {
      title: "Created",
      field: "createdAt",
      sortable: true,
      sortKey: "createdAt",
      render: (item) => (
        <span className="text-[#1b2559] text-[0.875rem] dark:text-[#ffffff]">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Actions",
      field: "",
      render: (item) => (
        <div className="flex items-center space-x-3 justify-end">
          <button
            onClick={() => handleView(item._id)}
            className="text-gray-500 hover:text-blue-600 transition-colors dark:text-white"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(item._id)}
            className="text-gray-500 hover:text-purple-600 transition-colors dark:text-white"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() =>
              setModal({
                open: true,
                type: MODAL_TYPE.DELETE,
                slideId: item._id,
              })
            }
            className="text-gray-500 hover:text-red-600 transition-colors dark:text-red-600"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-[24px] dark:bg-gray-900">
      {/* Table Controls */}
      <div className="p-6 rounded-[24px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
              Bonus Slides
            </h2>
            <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
              Manage promotional slider content
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SearchToolbar
              initialQuery={searchString}
              placeholder="Search Slides"
            />
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-[8px] hover:bg-[#3311DD] transition-all duration-200 focus:outline-none focus:ring-0 font-medium"
            >
              <Menu size={18} />
              <span>Filters</span>
            </button>
            <button
              onClick={() => router.push(ROUTES.BONUS_SLIDES_ADD)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700"
            >
              <Plus size={18} />
              <span>Add New Slide</span>
            </button>
          </div>
        </div>
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Bonus Slide Filters"
        footer={
          <button
            onClick={() => {
              router.push(pathname);
              setIsFilterOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 font-medium"
          >
            <RotateCcw size={18} />
            <span>Clear All Filters</span>
          </button>
        }
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Status
            </label>
            <Select
              inputId="status-filter"
              placeholder="Select Status"
              isClearable
              options={[
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ]}
              value={
                searchParams.get("isActive") === "true"
                  ? { label: "Active", value: "true" }
                  : searchParams.get("isActive") === "false"
                    ? { label: "Inactive", value: "false" }
                    : null
              }
              onChange={(option: { label: string; value: string } | null) => {
                const newParams = new URLSearchParams(searchParams.toString());
                if (option) {
                  newParams.set("isActive", option.value);
                } else {
                  newParams.delete("isActive");
                }
                router.push(`?${newParams.toString()}`);
              }}
            />
          </div>
        </div>
      </FilterSidebar>
      {/* Table */}
      <Table<SlideListItem>
        data={slides}
        columns={columns}
        keyExtractor={(item) => item._id}
        isLoading={isPending}
        handleSort={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />

      {/* Pagination */}
      <Pagination
        totalItems={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="slides"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() => void handleDelete()}
        title={STRING.DELETE_USER}
        message={MESSAGES.DELETE_CONFIRMATION}
      />
    </div>
  );
};

export default SlidesList;
