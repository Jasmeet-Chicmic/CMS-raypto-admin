import Image from "next/image";
import { MapPin, Mail, Phone, Wallet as WalletIcon } from "lucide-react";

import { dummyProfile } from "@/assets";

import { walletTruncate } from "@/shared/utils";
import { User } from "@/shared/types";

const UserProfileCard = ({ userData }: { userData: User }) => {
  console.log(userData, "userData");
  const {
    wallet,
    name,
    firstName = "Unknown",
    email = userData?.email || "N/A",
    phoneNumber,
  } = userData;

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-[20px] md:w-[400px] shadow-[0_0_10px_0_rgba(0,0,0,0.025)] border border-gray-100 dark:border-gray-800 transition-all duration-300 p-8 w-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-0">
          {/* Profile Image with Gradient Background */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e8ecff] to-[#f4f7fe] dark:from-[#3311CC]/20 dark:to-[#4F46E5]/20 flex items-center justify-center p-1">
              <Image
                src={dummyProfile}
                alt={firstName}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <h3 className="text-[2rem] font-bold text-[#2B3674] dark:text-white mb-2">
            {name || walletTruncate(wallet)}
          </h3>

          {/* Location - using wallet as location placeholder */}
          <div className="flex items-center gap-1 text-[#A3AED0] dark:text-gray-400 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-[0.95rem] font-medium">
              {walletTruncate(wallet)}
            </span>
          </div>

          {/* Stats Row */}
          {/* <div className="flex items-center justify-center gap-12 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-[0.9rem] font-medium text-[#A3AED0] dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-[2rem] font-bold text-[#2B3674] dark:text-white leading-none">
                  {stat.value}
                </p>
              </div>
            ))}
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

        {/* Contact Details */}
        <div className="space-y-3">
          {/* Wallet */}
          <div className="flex items-center gap-3 p-3 bg-[#F4F7FE] dark:bg-[#4F46E5]/20 rounded-xl hover:bg-[#eef2fc] dark:hover:bg-gray-800/60 transition-all duration-300">
            <div className="p-2 bg-white dark:bg-white rounded-lg shadow-sm">
              <WalletIcon className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#A3AED0] dark:text-gray-400 uppercase tracking-wide">
                Wallet Address
              </p>
              <p className="text-sm font-semibold text-[#2B3674] dark:text-white truncate">
                {walletTruncate(wallet) || "N/A"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-[#F4F7FE] dark:bg-[#4F46E5]/20 rounded-xl hover:bg-[#eef2fc] dark:hover:bg-gray-800/60 transition-all duration-300">
            <div className="p-2 bg-white dark:bg-white rounded-lg shadow-sm">
              <Mail className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#A3AED0] dark:text-gray-400 uppercase tracking-wide">
                Email Address
              </p>
              <p className="text-sm font-semibold text-[#2B3674] dark:text-white truncate">
                {email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 p-3 bg-[#F4F7FE] dark:bg-[#4F46E5]/20 rounded-xl hover:bg-[#eef2fc] dark:hover:bg-gray-800/60 transition-all duration-300">
            <div className="p-2 bg-white dark:bg-white rounded-lg shadow-sm">
              <Phone className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#A3AED0] dark:text-gray-400 uppercase tracking-wide">
                Contact Number
              </p>
              <p className="text-sm font-semibold text-[#2B3674] dark:text-white">
                {phoneNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileCard;
