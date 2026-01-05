import React from "react";
import GroupTable from "./GroupTable";

const GroupsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString: string;
    topic: string;
    status?: string;
    activity?: string;
    trustLevel?: string;
    limit: string;
    skip: string;
    sortKey?: string;
    sortDirection?: string;
  }>;
}) => {
  const {
    searchString,
    topic,
    status,
    activity,
    trustLevel,
    limit,
    skip,
    sortKey,
    sortDirection,
  } = await searchParams;
  console.log("GroupsListPage::searchParams", {
    searchString,
    topic,
    status,
    activity,
    trustLevel,
    limit,
    skip,
    sortKey,
    sortDirection,
  });
  return (
    <div className="space-y-6 mt-[20px]">
      <div className="overflow-x-auto">
        <GroupTable searchString={searchString} />
      </div>
    </div>
  );
};

export default GroupsListPage;
