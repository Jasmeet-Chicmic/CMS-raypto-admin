"use client";

import { useId } from "react";

export default function ConfigsLoading() {
  const baseId = useId();

  return (
    <div className="space-y-6 mt-[20px]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 animate-pulse">
        <div className="p-6 dark:border-gray-800">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from(new Array(3)).map((_, id) => (
            <div
              key={`${baseId}-item-${id}`}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
