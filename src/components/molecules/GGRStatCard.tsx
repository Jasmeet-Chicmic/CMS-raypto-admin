"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { CURRENCY_TYPE_NAMES } from "@/shared/constants";
import Select from "@/components/atoms/Select";
import { formatCurrency } from "@/shared/utils";

interface CurrencyGGR {
  currency: number;
  amount: number;
}

interface GGRStatCardProps {
  stats: CurrencyGGR[];
  title?: string;
}

interface CurrencyOption {
  label: string;
  value: number;
}

const GGRStatCard: React.FC<GGRStatCardProps> = ({
  stats,
  title = "Gross Gaming Revenue",
}) => {
  const currencyOptions: CurrencyOption[] = useMemo(
    () =>
      stats.map((stat) => ({
        label:
          CURRENCY_TYPE_NAMES[stat.currency] || `Currency ${stat.currency}`,
        value: stat.currency,
      })),
    [stats],
  );

  const [selectedOption, setSelectedOption] = useState<CurrencyOption | null>(
    currencyOptions[0] || null,
  );

  const selectedStat = stats.find((s) => s.currency === selectedOption?.value);
  const ggrValue = selectedStat?.amount || 0;

  return (
    <div className="bg-white group dark:bg-gray-900 rounded-[20px] p-6 transition-all duration-300 hover:bg-gradient-to-r from-[#868CFF] to-[#4F46E5] hover:shadow-lg hover:shadow-indigo-500/30 [&_svg]:transition-colors [&_svg]:duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.875rem] font-medium text-[#A3AED0] dark:text-gray-400 mb-0 group-hover:!text-white transition-colors duration-300">
              {title}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-[1.75rem] font-bold text-[#1B2559] dark:text-white group-hover:!text-white transition-colors duration-300">
              {formatCurrency(ggrValue)}
            </h3>
          </div>

          <p className="text-[0.8rem] font-medium text-[#A3AED0] dark:text-gray-400 mb-0 group-hover:!text-white transition-colors duration-300">
            {selectedOption?.label || "Selected currency"} GGR
          </p>
        </div>

        <div className="flex flex-col items-end justify-center gap-2">
          {/* Currency Select Dropdown */}
          <div className="w-32 group-hover:opacity-90 transition-opacity">
            <Select
              value={selectedOption}
              onChange={(option) =>
                setSelectedOption(option as CurrencyOption | null)
              }
              options={currencyOptions}
              isClearable={false}
              placeholder="Currency"
              classNamePrefix="react-select"
            />
          </div>

          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-[#4F46E5] text-[#ffffff] dark:bg-[#4F46E5] group-hover:bg-white group-hover:text-[#4F46E5] [&_svg]:group-hover:!text-[#4F46E5]`}
          >
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GGRStatCard;
