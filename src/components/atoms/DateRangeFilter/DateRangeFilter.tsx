"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface DateRangeFilterProps {
  /** Initial from date value */
  initialFromDate?: string;
  /** Initial to date value */
  initialToDate?: string;
  /** Callback when filter is applied */
  onApply?: (fromDate: string, toDate: string) => void;
  /** Callback when filter is cleared */
  onClear?: () => void;
  /** Whether to automatically update URL params (default: true) */
  useUrlParams?: boolean;
  /** Custom class name for the container */
  className?: string;
  /** ID for the date range filter (used as prefix for input IDs) */
  id?: string;
}

const DateRangeFilter = ({
  initialFromDate = "",
  initialToDate = "",
  onApply,
  onClear,
  useUrlParams = true,
  className = "",
  id,
}: DateRangeFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);

  // Sync state with props when they change (e.g. on tab switch)
  useEffect(() => {
    setFromDate(initialFromDate);
    setToDate(initialToDate);
  }, [initialFromDate, initialToDate]);

  const today = new Date().toISOString().split("T")[0];

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    if (value) {
      const from = new Date(value);
      const to = new Date(from);
      to.setDate(from.getDate() + 30);

      const now = new Date();
      const finalTo = to > now ? now : to;

      setToDate(finalTo.toISOString().split("T")[0]);
    } else {
      setToDate("");
    }
  };

  const handleApply = () => {
    if (useUrlParams) {
      const newParams = new URLSearchParams(searchParams.toString());

      // Reset pagination when filtering
      newParams.delete("skip");

      if (fromDate) {
        newParams.set("fromDate", fromDate);
      } else {
        newParams.delete("fromDate");
      }

      if (toDate) {
        newParams.set("toDate", toDate);
      } else {
        newParams.delete("toDate");
      }

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }

    onApply?.(fromDate, toDate);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");

    if (useUrlParams) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("fromDate");
      newParams.delete("toDate");
      newParams.delete("skip");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }

    onClear?.();
  };

  const hasFilters = fromDate || toDate;

  // Calculate maximum date for toDate (30 days after fromDate, capped at today)
  const getMaxToDate = (): string => {
    if (!fromDate) return today;
    const date = new Date(fromDate);
    date.setDate(date.getDate() + 30);
    const maxRange = date.toISOString().split("T")[0];
    return maxRange < today ? maxRange : today;
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-row items-end gap-3">
        <div className="flex flex-col flex-1">
          <label
            htmlFor={id ? `${id}-from` : undefined}
            className="text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-1"
          >
            From Date
          </label>
          <input
            type="date"
            id={id ? `${id}-from` : undefined}
            value={fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            max={today}
            className="w-full px-3 py-2.5 border-2 border-primarycolor rounded-lg focus:ring-0 transition-all duration-200 dark:bg-darkbgprimary dark:border-secondarycolor dark:text-sidebartext font-medium cursor-pointer"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor={id ? `${id}-to` : undefined}
            className="text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-1"
          >
            To Date
          </label>
          <input
            type="date"
            id={id ? `${id}-to` : undefined}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={!fromDate}
            min={fromDate}
            max={getMaxToDate()}
            className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-0 transition-all duration-200 ${
              !fromDate
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-darkbgprimary border-primarycolor dark:border-secondarycolor"
                : "border-primarycolor dark:border-secondarycolor cursor-pointer"
            }`}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={handleApply}
          disabled={!fromDate}
          className={`flex-1 px-4 py-2 bg-primarycolor dark:bg-secondarycolor text-bgwhite dark:text-bgblack font-semibold rounded-lg hover:bg-primaryhover dark:hover:bg-secondaryhover transition-all duration-200 ${
            !fromDate ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Apply
        </button>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 border-2 border-bordercolor1 dark:border-bordercolor2 text-primarycolor dark:text-secondarycolor font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-darkbgsecondary transition-all duration-200"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
