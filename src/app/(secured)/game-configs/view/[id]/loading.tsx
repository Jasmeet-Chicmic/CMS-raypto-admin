"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  const baseId = useId();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-6 mt-[20px]">
        <div className="bg-bgwhite rounded-lg shadow-sm border bordergray200 dark:bg-darkbgprimary dark:border-darkbordercolor1">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-bordergray200 dark:border-labelprimary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Status Toggles Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border bordergray200 rounded-lg dark:border-labelprimary">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              </div>
              <div className="p-4 border bordergray200 rounded-lg dark:border-labelprimary">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              </div>
            </div>

            {/* Amount Limits Table Skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-bordergray200 dark:border-labelprimary">
                      <th className="py-3 px-4">
                        <Skeleton className="h-4 w-20" />
                      </th>
                      <th className="py-3 px-4">
                        <Skeleton className="h-4 w-28" />
                      </th>
                      <th className="py-3 px-4">
                        <Skeleton className="h-4 w-24" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Array(6)).map((_, id) => (
                      <tr
                        key={`${baseId}-row-${id}`}
                        className="border-b border-bordergray200 bordergray100 dark:border-darkbgprimary"
                      >
                        <td className="py-3 px-4">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-10 w-full rounded-lg" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-10 w-full rounded-lg" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="p-6 border-t bordergray200 dark:border-labelprimary flex justify-end gap-4">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
