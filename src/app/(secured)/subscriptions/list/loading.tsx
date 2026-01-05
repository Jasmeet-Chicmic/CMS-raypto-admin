"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const SubscriptionPlansLoading = () => {
  const baseId = useId();

  return (
    <main className="flex-1 overflow-y-auto animate-pulse">
      <div className="space-y-6 mt-[20px] px-4">
        {/* Heading */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {Array.from(new Array(4)).map((_, i) => (
            <div
              key={`${baseId}-stat-${i}`}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-full">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Section Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from(new Array(4)).map((_, i) => (
            <div
              key={`${baseId}-plan-${i}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 bg-gray-200">
                <Skeleton className="h-6 w-24 mb-2" />
                <div className="flex items-baseline space-x-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="p-4 space-y-4">
                <Skeleton className="h-4 w-full" />
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SubscriptionPlansLoading;
