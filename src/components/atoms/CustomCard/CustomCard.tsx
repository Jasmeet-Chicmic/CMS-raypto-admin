import { useTranslations } from "next-intl";
import React from "react";

interface CustomCardProps {
  title?: string;
  subtitle?: string;
  value?: string | number;
  change?: string;
  changeColor?: string; // Tailwind color class like text-green-600
  children: React.ReactNode;
  className?: string;
  totalValue?: string;
}

const CustomCard = ({
  title,
  subtitle,
  value,
  change,
  changeColor = "text-green-600",
  children,
  className = "",
  totalValue,
}: CustomCardProps) => {
  const t = useTranslations("language");
  return (
    <div
      className={`bg-white shadow-customsm rounded-[5px] py-[25px] w-full dark:bg-gray-900 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-[10px] px-[25px]">
          {title && (
            <h2 className="text-title text-gray-800 mb-[12px] dark:text-gray-400">
              {t(title)}
            </h2>
          )}
          {subtitle && (
            <p className="text-subtitle text-gray-500 dark:text-gray-400">
              {t(subtitle)}
            </p>
          )}
          {totalValue && (
            <h2 className="text-subheading text-gray-800 dark:text-gray-400">
              {totalValue}
            </h2>
          )}
        </div>
      )}

      {children}

      {(value || change) && (
        <div className="flex items-center justify-between mt-4 px-6">
          {value && (
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-400">
              {value}
            </p>
          )}
          {change && (
            <p className={`text-sm ${changeColor} dark:text-gray-400`}>
              {change}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCard;
