"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import WorldMap to avoid SSR issues
const WorldMap = dynamic(
  () => import("react-svg-worldmap").then((mod) => mod.WorldMap),
  { ssr: false },
);

interface DataItem {
  country: string;
  value: number | string;
}

interface StyleContext {
  countryValue: number;
  minValue: number;
  maxValue: number;
  color: string;
}

interface WorldMapChartProps {
  data: DataItem[];
}

const WorldMapChart = ({ data }: WorldMapChartProps) => {
  const stylingFunction = (context: StyleContext) => {
    // Calculate max value from data if available, otherwise use a default
    const maxValue =
      data.length > 0 ? Math.max(...data.map((d) => Number(d.value))) : 100;

    const opacityLevel =
      0.3 +
      (10 * (Number(context.countryValue) - context.minValue)) /
        (maxValue - context.minValue || 1);

    return {
      fill: context.color,
      fillOpacity: Number.isNaN(opacityLevel) ? 0 : opacityLevel,
      stroke: "white",
      strokeWidth: 1,
      strokeOpacity: 0.2,
      cursor: "pointer",
    };
  };

  const filteredData = data.filter(
    (item) => item.country !== "EP" && item.country !== "WO",
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-0 dark:border-gray-800 w-full h-full">
      <div className="mb-4">
        <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
          Users by Country
        </h3>
        <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
          Global distribution of active users
        </p>
      </div>
      <div className="flex justify-center items-center overflow-hidden w-full h-full">
        <WorldMap
          richInteraction={true}
          backgroundColor={"transparent"}
          borderColor={"white"}
          color={"#4F46E5"} // Using the primary purple-blue color
          tooltipBgColor={"#1f2937"}
          title=""
          valueSuffix=" users"
          valuePrefix=":"
          size="responsive"
          data={filteredData}
          styleFunction={
            stylingFunction as unknown as (context: unknown) => object
          }
        />
      </div>
    </div>
  );
};

export default WorldMapChart;
