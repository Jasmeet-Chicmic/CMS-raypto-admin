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
      <div className="bg-bgwhite dark:bg-darkbgprimary rounded-[20px] md:w-[400px] shadow-[0_0_10px_0_rgba(0,0,0,0.025)] border border-bordercolor1 dark:border-darkbordercolor1 transition-all duration-300 p-8 w-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-0">
          {/* Profile Image with Gradient Background */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primarycolor/10 to-secondarycolor/10 dark:from-secondarycolor/20 dark:to-primarycolor/20 flex items-center justify-center p-1">
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
          <h3 className="text-[2rem] font-bold text-textprimary dark:text-sidebartext mb-2">
            {name || walletTruncate(wallet)}
          </h3>

          {/* Location - using wallet as location placeholder */}
          <div className="flex items-center gap-1 text-sidebartext dark:text-sidebartext/60 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-[0.95rem] font-medium">
              {walletTruncate(wallet)}
            </span>
          </div>

          {/* Stats Row */}
          {/* <div className="flex items-center justify-center gap-12 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-[0.9rem] font-medium text-sidebartext dark:bordercolor1 mb-1">
                  {stat.label}
                </p>
                <p className="text-[2rem] font-bold text-[#2B3674] dark:text-sidebartext leading-none">
                  {stat.value}
                </p>
              </div>
            ))}
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-bordercolor1 dark:border-bordercolor2 mb-6" />

        {/* Contact Details */}
        <div className="space-y-3">
          {/* Wallet */}
          <div className="flex items-center gap-3 p-3 bg-primarycolor/5 dark:bg-darkbgsecondary rounded-xl hover:bg-primarycolor/10 dark:hover:bg-secondarycolor/10 transition-all duration-300">
            <div className="p-2 bg-bgwhite dark:bg-darkbgprimary rounded-lg shadow-sm">
              <WalletIcon className="w-4 h-4 text-primarycolor dark:text-secondarycolor" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-bgblack dark:text-sidebartext/60 uppercase tracking-wide">
                Wallet Address
              </p>
              <p className="text-sm font-semibold text-textprimary dark:text-sidebartext truncate">
                {walletTruncate(wallet) || "N/A"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-primarycolor/5 dark:bg-darkbgsecondary rounded-xl hover:bg-primarycolor/10 dark:hover:bg-secondarycolor/10 transition-all duration-300">
            <div className="p-2 bg-bgwhite dark:bg-darkbgprimary rounded-lg shadow-sm">
              <Mail className="w-4 h-4 text-primarycolor dark:text-secondarycolor" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-bgblack dark:text-sidebartext/60 uppercase tracking-wide">
                Email Address
              </p>
              <p className="text-sm font-semibold text-textprimary dark:text-sidebartext truncate">
                {email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 p-3 bg-primarycolor/5 dark:bg-darkbgsecondary rounded-xl hover:bg-primarycolor/10 dark:hover:bg-secondarycolor/10 transition-all duration-300">
            <div className="p-2 bg-bgwhite dark:bg-darkbgprimary rounded-lg shadow-sm">
              <Phone className="w-4 h-4 text-primarycolor dark:text-secondarycolor" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-bgblack dark:text-sidebartext/60 uppercase tracking-wide">
                Contact Number
              </p>
              <p className="text-sm font-semibold text-textprimary dark:text-sidebartext">
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
