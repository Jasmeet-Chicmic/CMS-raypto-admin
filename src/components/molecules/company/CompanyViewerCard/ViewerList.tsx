"use client";

import ViewerCard, { ViewerCardProps } from "./ViewerCard";

interface ViewersListProps {
  viewers: ViewerCardProps[];
}

const ViewersList = ({ viewers }: ViewersListProps) => {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Viewers</h3>
          <div className="text-[0.875]">
            Your company’s reach across industries, job functions.
          </div>
        </div>
        <select className="border rounded p-2 text-sm">
          <option>Last 7 days</option>
          <option>Last 15 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {viewers.map((viewer, idx) => (
        <ViewerCard
          key={idx}
          avatar={viewer.avatar}
          name={viewer.name}
          description={viewer.description}
          timeViewed={viewer.timeViewed}
        />
      ))}
    </div>
  );
};
export default ViewersList;
