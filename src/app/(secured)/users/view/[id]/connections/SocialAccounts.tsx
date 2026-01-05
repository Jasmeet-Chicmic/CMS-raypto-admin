"use client";

import { Link, Link2Off } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateUserConnection } from "@/api/user";
import { SOCIAL_ACCOUNTS } from "@/shared/constants";

import { SOCIAL_TYPE_MAP } from "./helpers/constants";
import { BackendSocialAccount } from "./helpers/types";

const allAccountTypes = [
  SOCIAL_ACCOUNTS.FACEBOOK,
  SOCIAL_ACCOUNTS.TWITTER,
  SOCIAL_ACCOUNTS.LINKEDIN,
  SOCIAL_ACCOUNTS.DRIBBLE,
  SOCIAL_ACCOUNTS.BEHANCE,
];

interface SocialAccountsProps {
  userId: string;
  initialConnectedAccounts: BackendSocialAccount[]; // from backend
}

const SocialAccounts = ({
  userId,
  initialConnectedAccounts,
}: SocialAccountsProps) => {
  const [isLoading, startTransition] = useTransition();

  const [accounts, setAccounts] = useState<BackendSocialAccount[]>(
    allAccountTypes.map((type) => {
      const connected = initialConnectedAccounts.find(
        (acc) => acc.type === type,
      );
      return {
        type,
        link: connected?.link || "",
      };
    }),
  );

  const updateSocialAccounts = (updatedAccounts: BackendSocialAccount[]) => {
    const onlyConnected = updatedAccounts.filter((acc) => acc.link);
    startTransition(async () => {
      const res = await updateUserConnection({
        userId,
        socialAccounts: onlyConnected,
      });
      if (res.status) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  const handleConnect = (type: SOCIAL_ACCOUNTS) => {
    const updated = accounts.map((acc) =>
      acc.type === type ? { ...acc, link: "@YourUsername" } : acc,
    );
    setAccounts(updated);
    updateSocialAccounts(updated);
  };

  const handleDisconnect = (type: SOCIAL_ACCOUNTS) => {
    const updated = accounts.map((acc) =>
      acc.type === type ? { ...acc, link: "" } : acc,
    );
    setAccounts(updated);
    updateSocialAccounts(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 dark:text-white">
          Social Accounts
        </h2>
        <p className="text-sm text-gray-600 dark:text-white">
          Display content from social accounts on your site
        </p>
      </div>

      <div className="space-y-4 dark:bg-gray-900 dark:border-gray-800">
        {accounts.map((account, idx) => {
          const info = SOCIAL_TYPE_MAP[account.type];
          const isConnected = !!account.link;

          return (
            <div
              key={idx}
              className="flex items-center justify-between py-2 dark:bg-gray-900 dark:border-gray-800"
            >
              {/* Left Side */}
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg p-1.5 dark:text-white ${info.color}`}
                >
                  <div className="w-full h-full rounded-sm flex items-center justify-center">
                    <span className="text-[0.875] font-bold text-white dark:text-white">
                      {info.iconText}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {info.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-white">
                    {account.link || "Not Connected"}
                  </p>
                </div>
              </div>

              {/* Right Side Buttons */}
              {isConnected ? (
                <button
                  onClick={() => handleDisconnect(account.type)}
                  disabled={isLoading}
                  className="text-sm px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center space-x-2 disabled:opacity-50 dark:bg-red-900 dark:text-white"
                >
                  <Link2Off size={14} />
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(account.type)}
                  disabled={isLoading}
                  className="text-sm px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center space-x-2 disabled:opacity-50 dark:bg-green-900 dark:text-white"
                >
                  <Link size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialAccounts;
