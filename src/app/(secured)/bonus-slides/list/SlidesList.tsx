"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TableColumn } from "@/components/atoms/Table";
import { SlideListItem } from "../helpers/types";
import { ROUTES } from "@/shared/routes";
import { deleteSlide, toggleSlideStatus } from "@/api/bonusSlides";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2, Plus, Menu, RotateCcw } from "lucide-react";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { MODAL_TYPE } from "@/components/molecules/ConfirmationModal/helpers/constants";
import { MESSAGES, STRING } from "@/shared/strings";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import Select from "@/components/atoms/Select";
import { useTheme } from "next-themes";
import { THEME_TYPE } from "@/shared/constants";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import { createSortableColumn } from "@/shared/utils";
import { getStatusSelectStyles } from "@/shared/selectStyles";

import {
  TEXT_GRAY_WHITE as TEXT_PRIMARY,
  TEXT_PRIMARY_DARK as TEXT_SECONDARY,
  TEXT_SECONDARY as TEXT_MUTED,
  TEXT_SIZE_SM,
} from "@/shared/styles";

// Status filter options
const STATUS_FILTER_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const IS_ACTIVE_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

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

// Helper function to get filter value from search params
const getFilterValue = (
  searchParams: URLSearchParams,
  paramName: string,
  options: { label: string; value: string }[],
) => {
  const paramValue = searchParams.get(paramName);
  return options.find((opt) => opt.value === paramValue) || null;
};

// Helper function to handle filter changes
const updateSearchParams = (
  router: ReturnType<typeof useRouter>,
  searchParams: URLSearchParams,
  paramName: string,
  value: string | null,
) => {
  const newParams = new URLSearchParams(searchParams.toString());
  if (value === null) {
    newParams.delete(paramName);
  } else {
    newParams.set(paramName, value);
  }
  router.push(`?${newParams.toString()}`);
};

const SlidesList = ({ slidesListData, searchString }: SlidesListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === THEME_TYPE.DARK;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    type?: MODAL_TYPE;
    slideId?: string;
  }>({
    open: false,
  });

  const slides = slidesListData?.data?.data || [];
  const totalCount = slidesListData?.data?.count || 0;

  const handleDelete = useCallback(async () => {
    if (!modal.slideId) return;

    const result = await deleteSlide(modal.slideId);
    if (result.status) {
      toast.success("Slide deleted successfully");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete slide");
    }
    setModal({ open: false });
  }, [modal.slideId, router]);

  const handleStatusUpdate = useCallback(
    async (id: string, isActive: boolean) => {
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
    },
    [router],
  );

  const getStatusStyles = useCallback(
    (isPositive: boolean) => getStatusSelectStyles(isPositive, isDark),
    [isDark],
  );

  const columns: TableColumn<SlideListItem>[] = useMemo(
    () => [
      createSortableColumn("title", "Title", (item) => (
        <span className={`font-medium ${TEXT_PRIMARY}`}>{item.title}</span>
      )),
      createSortableColumn("isActive", "Status", (item) => (
        <div className="w-[120px]">
          <Select
            options={IS_ACTIVE_OPTIONS}
            value={IS_ACTIVE_OPTIONS.find((opt) => opt.value === item.isActive)}
            onChange={(val) =>
              val && handleStatusUpdate(item._id, val.value as boolean)
            }
            isSearchable={false}
            styles={getStatusStyles(item.isActive)}
          />
        </div>
      )),
      createSortableColumn("createdAt", "Created", (item) => (
        <span className={`${TEXT_SIZE_SM} ${TEXT_SECONDARY}`}>
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      )),
      {
        title: "Actions",
        field: "",
        render: (item) => (
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                router.push(`${ROUTES.BONUS_SLIDES_EDIT}?id=${item._id}`)
              }
              className="text-gray-500 hover:text-blue-600 transition-colors dark:text-white"
              title="View"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() =>
                router.push(`${ROUTES.BONUS_SLIDES_EDIT}?id=${item._id}`)
              }
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
        fixed: "right",
      },
    ],
    [getStatusStyles, handleStatusUpdate, router],
  );

  const config: DataTableConfig<SlideListItem> = useMemo(
    () => ({
      columns,
      keyExtractor: (item) => item._id || "",
      paginationTitle: "slides",
      queryConfig: {
        defaultSortKey: "createdAt",
        defaultSortDirection: -1,
      },
      header: (
        <>
          <div className="bg-white px-6 pt-7 pb-3 rounded-[20px_20px_0_0] dark:bg-gray-900 dark:border-gray-800">
            <div className="dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className={`text-[1.5rem] font-bold ${TEXT_SECONDARY}`}>
                    Bonus Slides
                  </h2>
                  <p
                    className={`text-[14px] font-medium ${TEXT_MUTED} dark:text-gray-400`}
                  >
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
                    className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-0 font-medium"
                  >
                    <Plus size={18} />
                    <span>Add New Slide</span>
                  </button>
                </div>
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
                  options={STATUS_FILTER_OPTIONS}
                  value={getFilterValue(
                    searchParams,
                    "isActive",
                    STATUS_FILTER_OPTIONS,
                  )}
                  onChange={(option: { label: string; value: string } | null) =>
                    updateSearchParams(
                      router,
                      searchParams,
                      "isActive",
                      option?.value || null,
                    )
                  }
                />
              </div>
            </div>
          </FilterSidebar>
        </>
      ),
      footer: (
        <ConfirmationModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false })}
          onConfirm={() => void handleDelete()}
          title={STRING.DELETE_USER}
          message={MESSAGES.DELETE_CONFIRMATION}
        />
      ),
    }),
    [
      columns,
      searchString,
      isFilterOpen,
      searchParams,
      router,
      pathname,
      modal.open,
      handleDelete,
    ],
  );

  return <DataTable data={slides} totalCount={totalCount} config={config} />;
};

export default SlidesList;
