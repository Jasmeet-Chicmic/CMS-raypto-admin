"use client";

import React from "react";
import Image from "next/image";
import { dummyProfile } from "@/assets";

export interface ViewerCardProps {
  avatar: string;
  name: string;
  description: string;
  timeViewed: string;
}

const ViewerCard = ({
  avatar,
  name,
  description,
  timeViewed,
}: ViewerCardProps) => {
  console.log(avatar);
  return (
    <div className="flex justify-between items-start  p-4 rounded-md shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={dummyProfile}
            alt={`${name} logo`}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-black">{name}</p>
          <p className="text-sm text-gray-700">{description}</p>
          <p className="text-[0.875rem] text-[#A3AED0] mt-1">
            Viewed {timeViewed}
          </p>
        </div>
      </div>

      <button className="bg-[#5C2600] text-white text-sm px-4 py-2 rounded-md hover:opacity-90">
        View profile
      </button>
    </div>
  );
};

export default ViewerCard;
