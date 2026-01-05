import React from "react";
import SelectFilter from "@/components/atoms/SelectFilter";
import {
  GROUP_STATUS_OPTIONS,
  GROUP_ACTIVITY_OPTIONS,
  GROUP_TRUST_LEVEL_OPTIONS,
  GROUP_TOPICS_OPTIONS,
} from "../helpers/constants";

const GroupFilters = () => {
  const filterClasses = "w-40";
  return (
    <>
      <div className="w-full md:w-1/5">
        <SelectFilter
          paramName="topic"
          options={GROUP_TOPICS_OPTIONS}
          placeholder="Topic"
          className={filterClasses}
        />
      </div>
      <div className="w-full md:w-1/5">
        <SelectFilter
          paramName="status"
          options={GROUP_STATUS_OPTIONS}
          placeholder="Status"
          className={filterClasses}
        />
      </div>
      <div className="w-full md:w-1/5">
        <SelectFilter
          paramName="activity"
          options={GROUP_ACTIVITY_OPTIONS}
          placeholder="Activity"
          className={filterClasses}
        />
      </div>
      <div className="w-full md:w-1/5">
        <SelectFilter
          paramName="trustLevel"
          options={GROUP_TRUST_LEVEL_OPTIONS}
          placeholder="Trust Level"
          className={filterClasses}
        />
      </div>
    </>
  );
};

export default GroupFilters;
