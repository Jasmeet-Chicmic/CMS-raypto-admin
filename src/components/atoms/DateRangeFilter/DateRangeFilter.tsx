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
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            From Date
          </label>
          <input
            type="date"
            id={id ? `${id}-from` : undefined}
            value={fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            max={today}
            className="w-full px-3 py-2.5 border-2 border-[#4F46E540] rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] hover:border-[#4F46E5] transition-all duration-200 dark:bg-gray-800 dark:border-[#4F46E540] dark:text-white font-medium cursor-pointer"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor={id ? `${id}-to` : undefined}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
            className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4F46E5] dark:bg-gray-800 dark:text-white font-medium transition-all duration-200 ${
              !fromDate
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                : "border-[#4F46E540] focus:border-[#4F46E5] hover:border-[#4F46E5] cursor-pointer"
            }`}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={handleApply}
          disabled={!fromDate}
          className={`flex-1 px-4 py-2 bg-[#4F46E5] text-white font-semibold rounded-lg hover:bg-[#3311DD] transition-all duration-200 ${
            !fromDate ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Apply
        </button>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 border-2 border-[#4F46E5] text-[#4F46E5] font-semibold rounded-lg hover:bg-[#4F46E5] hover:text-white transition-all duration-200 dark:border-[#4F46E5] dark:text-[#4F46E5]"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
