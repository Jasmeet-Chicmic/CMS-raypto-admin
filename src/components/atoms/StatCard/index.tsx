import React from "react";

export interface StatCardProps {
  title?: string;
  value?: string | number;
  change?: string;
  changeColor?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string; // This corresponds to iconBgColor
  index?: number;
}

const StatCard: React.FC<
  StatCardProps & {
    stat?: Partial<StatCardProps & { bgColor?: string; iconBgColor?: string }>;
  }
> = ({
  title,
  value,
  change,
  changeColor = "text-green-500",
  subtitle,
  icon,
  color,
  index,
  stat, // Handle legacy object wrapper
}) => {
  // Extract values from legacy 'stat' object if present
  const displayTitle = title ?? stat?.title;
  const displayValue = value ?? stat?.value;
  const displaySubtitle = subtitle ?? stat?.subtitle;
  const displayIcon = icon ?? stat?.icon;
  const displayColor =
    color ?? stat?.color ?? stat?.bgColor ?? stat?.iconBgColor;
  const displayChange = change ?? stat?.change;
  const displayChangeColor = changeColor ?? stat?.changeColor;
  return (
    <div
      key={index}
      className="bg-white dark:bg-[#1A1A1A] dark:border-[#1E2939] border border-[#E5E7EB] rounded-[20px] p-6 transition-all duration-300 shadow-sm [&_svg]:transition-colors [&_svg]:duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {displayTitle && (
            <p className="text-[0.875rem] font-medium text-[#364153] dark:text-[#D1D5D0] mb-0 group-hover:!text-white transition-colors duration-300">
              {displayTitle}
            </p>
          )}

          <div className="flex items-baseline gap-2">
            {displayValue !== undefined && (
              <h3 className="text-[1.75rem] font-bold text-[#1E2939] dark:text-[#ffffff] group-hover:!text-white transition-colors duration-300">
                {displayValue}
              </h3>
            )}
            {displayChange && (
              <span
                className={`text-sm font-medium ${displayChangeColor} group-hover:!text-white transition-colors duration-300`}
              >
                {displayChange}
              </span>
            )}
          </div>

          {displaySubtitle && (
            <p className="text-[0.8rem] font-medium text-[#99A1AF] dark:text-[#99A1AF] mb-0 group-hover:!text-white transition-colors duration-300">
              {displaySubtitle}
            </p>
          )}
        </div>

        {displayIcon && (
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              displayColor || "bg-gray-100 dark:bg-[#1A1A1A]"
            } group-hover:bg-white group-hover:text-[#4F46E5] [&_svg]:group-hover:!text-[#4F46E5]`}
          >
            {displayIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
