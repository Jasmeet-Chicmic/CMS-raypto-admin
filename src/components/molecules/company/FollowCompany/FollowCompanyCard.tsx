"use client";

import React from "react";
import Image from "next/image";
import { dummyProfile } from "@/assets";

export interface FollowCompanyCardProps {
  logo: string;
  name: string;
  description: string;
  industry: string;
}

const FollowCompanyCard = ({
  logo,
  name,
  description,
  industry,
}: FollowCompanyCardProps) => {
  console.log(logo);
  return (
    <div className="bg-[#FFF8F5] rounded-xl p-4 shadow-sm w-full max-w-sm">
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="w-10 h-10 relative bg-white rounded shrink-0">
          <Image
            src={dummyProfile}
            alt={`${name} logo`}
            fill
            className="object-contain rounded"
          />
        </div>

        {/* Company Info */}
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-base text-black">{name}</h3>
          <p className="text-sm text-gray-500 leading-snug">{description}</p>
          <p className="text-sm text-[#B3472A] mt-1">{industry}</p>

          <button className="bg-[#592C16] text-white px-4 py-1.5 text-sm rounded-md mt-3 hover:bg-[#4b2413] transition">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowCompanyCard;
