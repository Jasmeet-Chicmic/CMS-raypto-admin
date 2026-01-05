"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const EditJobLoading = () => {
  const baseId = useId();

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-4 rounded-lg animate-pulse">
      <Skeleton className="h-8 w-32" /> {/* Edit Job Title */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Description */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        {/* Job Type */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Location */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Salary Category */}
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="w-1/2">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Key Responsibilities */}
        <div>
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        {/* Skills */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="space-y-4">
            {Array.from(new Array(5)).map((_, id) => (
              <div
                key={`${baseId}-skill-${id}`}
                className="flex items-center gap-2"
              >
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>

        {/* Preferred Experience */}
        <div>
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Sector */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Status */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Visibility */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
};

export default EditJobLoading;
