"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const Loading = () => {
  const baseId = useId();

  // Header info widths
  const headerInfoWidths = [
    { height: "h-8", width: "w-32", margin: "mb-2" },
    { height: "h-4", width: "w-48", margin: "mb-1" },
    { height: "h-4", width: "w-56", margin: "mb-1" },
    { height: "h-4", width: "w-40", margin: "mb-1" },
  ];

  // Invoice form fields
  const invoiceFields = [
    { labelWidth: "w-16", hasMarginBottom: true },
    { labelWidth: "w-20", hasMarginBottom: true },
    { labelWidth: "w-20", hasMarginBottom: false },
  ];

  // Totals section items
  const totalsItems = [
    { height: "h-4", width: "w-32" },
    { height: "h-4", width: "w-24" },
    { height: "h-4", width: "w-24" },
    { height: "h-4", width: "w-24" },
    { height: "h-6", width: "w-32" },
  ];

  // Table row cells (Qty, Price, Delete button)
  const tableCells = [
    { height: "h-8", width: "w-12", rounded: false },
    { height: "h-6", width: "w-12", rounded: false },
    { height: "h-8", width: "w-8", rounded: true },
  ];

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
        <form className="flex gap-2">
          {/* Main Form Card */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6 flex-1 min-w-0">
            {/* Header and Invoice Info */}
            <div className="flex justify-between items-start">
              <div>
                {headerInfoWidths.map((item, idx) => (
                  <Skeleton
                    key={`${baseId}-header-info-${idx}`}
                    className={`${item.height} ${item.width} ${item.margin}`}
                  />
                ))}
              </div>
              <div className="w-[300px] space-y-2 bg-gray-100 p-4 rounded">
                {invoiceFields.map((field, idx) => (
                  <div key={`${baseId}-invoice-field-${idx}`}>
                    <Skeleton className={`h-3 ${field.labelWidth} mb-1`} />
                    <Skeleton
                      className={`h-8 w-full rounded ${field.hasMarginBottom ? "mb-2" : ""}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Invoice To and Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded mb-2" />
              </div>
              <div>
                <table className="w-full text-left border-t border-b">
                  <thead className="bg-white text-sm">
                    <tr>
                      {["Item", "Cost", "Qty", "Price", ""].map((col, i) => (
                        <th key={`${baseId}-header-${i}`} className="p-2">
                          <Skeleton className="h-4 w-16" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Array(2)).map((_, rowIdx) => (
                      <tr className="border-t" key={`${baseId}-row-${rowIdx}`}>
                        <td className="p-2">
                          <Skeleton className="h-8 w-32 mb-2" />
                          <Skeleton className="h-6 w-40" />
                        </td>
                        <td className="p-2 flex flex-col gap-5">
                          <Skeleton className="h-8 w-16 mb-2" />
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <div className="flex gap-2">
                              {Array.from(new Array(3)).map((_, taxIdx) => (
                                <Skeleton
                                  key={`${baseId}-tax-${rowIdx}-${taxIdx}`}
                                  className="h-4 w-8"
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        {tableCells.map((cell, cellIdx) => (
                          <td
                            key={`${baseId}-cell-${rowIdx}-${cellIdx}`}
                            className="p-2"
                          >
                            <Skeleton
                              className={`${cell.height} ${cell.width} ${cell.rounded ? "rounded" : ""}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Skeleton className="h-8 w-32 mt-4" />
              </div>
            </div>
            {/* Salesperson and Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2 text-right text-sm">
                {totalsItems.map((item, idx) => (
                  <Skeleton
                    key={`${baseId}-total-${idx}`}
                    className={`${item.height} ${item.width} ml-auto`}
                  />
                ))}
              </div>
            </div>
            {/* Notes */}
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          {/* Sidebar Actions */}
          <div className="w-[20%] min-w-[220px]">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div className="flex flex-col gap-2">
                {Array.from(new Array(2)).map((_, idx) => (
                  <Skeleton
                    key={`${baseId}-sidebar-btn-${idx}`}
                    className={`h-10 w-full ${idx === 0 ? "mb-2" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Loading;
