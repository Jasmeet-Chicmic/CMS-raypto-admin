import React from "react";

interface ProfileViewProps {
  count: number;
}

const ProfileView = ({ count }: ProfileViewProps) => {
  return (
    <div className="bg-white p-6 rounded shadow flex justify-between items-center">
      <div className="flex flex-col">
        <div className="text-sm text-gray-500">Total company profile views</div>
        <div className="text-[0.875rem] text-[#A3AED0]">
          Your company’s reach and influence across Black Rise
        </div>
      </div>
      <div className="text-3xl font-semibold">{count}</div>
    </div>
  );
};

export default ProfileView;
