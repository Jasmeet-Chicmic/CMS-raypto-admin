import Image from "next/image";

import { dummyProfile } from "@/assets";
import {
  COUNTRIES,
  COUNTRY_NAMES,
  INDUSTRY_SECTOR_NAMES,
  INDUSTRY_SECTORS,
} from "@/shared/constants";
import { Company } from "@/shared/types";

const CompanyProfileCard = ({ CompanyData }: { CompanyData: Company }) => {
  const {
    companyName = "Synapse Tech 1",
    email = "info@synapsetech.com",
    companyProfilePicture = "/images/companies/synapse.png",
    contactNumber = "+1-234-567-8901",
    country = COUNTRIES.AUSTRALIA,
    sector = INDUSTRY_SECTORS.AGRICULTURE_FOOD,
  } = CompanyData;

  return (
    <div className="bg-white p-6 shadow text-center dark:bg-gray-900 dark:border-gray-800">
      {/* Company Logo */}
      <div className="mb-4">
        <Image
          src={dummyProfile}
          alt={companyProfilePicture}
          width={96}
          height={96}
          className="mx-auto rounded-lg object-cover"
        />
      </div>

      {/* Company Name */}
      <h3 className="text-xl font-semibold mb-2 dark:text-white">
        {companyName}
      </h3>

      {/* Industry Badge */}
      <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full inline-block mb-4 dark:bg-gray-800 dark:text-white">
        {INDUSTRY_SECTOR_NAMES[sector]}
      </span>

      {/* Verification Status */}
      {CompanyData.isVerified && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-[0.875] font-medium dark:bg-green-900/20 dark:text-green-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        </div>
      )}

      {/* Company Details */}
      <div className="text-left space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Information
          </h4>
          <div className="space-y-1 text-sm">
            <p className="dark:text-white">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>{" "}
              {email}
            </p>
            <p className="dark:text-white">
              <span className="text-gray-600 dark:text-gray-400">Phone:</span>{" "}
              {contactNumber}
            </p>
          </div>
        </div>

        <div>
          <div className="space-y-1 text-sm">
            <p className="dark:text-white">
              <span className="text-gray-600 dark:text-gray-400">Country:</span>{" "}
              {COUNTRY_NAMES[country] || "N/A"}
            </p>
          </div>
        </div>

        {/* Company Status */}
        <div>
          <div className="space-y-1 text-sm">
            <p className="dark:text-white">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span
                className={`ml-1 px-2 py-1 rounded-full text-[0.875] font-medium ${
                  CompanyData.isSuspended
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                }`}
              >
                {CompanyData.isSuspended ? "Suspended" : "Active"}
              </span>
            </p>
            {CompanyData.flagsCount && CompanyData.flagsCount > 0 && (
              <p className="dark:text-white">
                <span className="text-gray-600 dark:text-gray-400">Flags:</span>
                <span className="ml-1 px-2 py-1 rounded-full text-[0.875] font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {CompanyData.flagsCount}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileCard;
