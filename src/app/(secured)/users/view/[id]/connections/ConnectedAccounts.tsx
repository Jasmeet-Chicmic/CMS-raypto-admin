"use client";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateUserConnection } from "@/api/user";
import { CONNECTED_ACCOUNTS } from "@/shared/constants";

import { CONNECTED_ACCOUNT_UI_MAP } from "./helpers/constants";
import { BackendConnectedAccount } from "./helpers/types";

interface ConnectedAccountsProps {
  initialConnectedAccountData: BackendConnectedAccount[];
  userId: string;
}

const allAccountTypes = [
  CONNECTED_ACCOUNTS.GOOGLE,
  CONNECTED_ACCOUNTS.SLACK,
  CONNECTED_ACCOUNTS.GITHUB,
  CONNECTED_ACCOUNTS.MAILCHIMP,
  CONNECTED_ACCOUNTS.ASANA,
];

const ConnectedAccounts = ({
  initialConnectedAccountData,
  userId,
}: ConnectedAccountsProps) => {
  const [isLoading, startTransition] = useTransition();
  const [accounts, setAccounts] = useState(
    allAccountTypes.map((type) => {
      const connected = initialConnectedAccountData.find(
        (acc) => acc.type === type,
      );
      return {
        type,
        isConnected: connected?.isConnected || false,
      };
    }),
  );
  const handleConnectedAccountToggle = (type: CONNECTED_ACCOUNTS) => {
    const updatedState = accounts.map((acc) =>
      acc.type === type ? { ...acc, isConnected: !acc.isConnected } : acc,
    );
    setAccounts(updatedState);
    udpateAccounts(updatedState);
  };

  const udpateAccounts = (connectedAccounts: BackendConnectedAccount[]) => {
    startTransition(async () => {
      const res = await updateUserConnection({
        userId,
        connectedAccounts: connectedAccounts,
      });
      if (res.status) toast.success(res.message);
      else toast.error(res.message);
    });
  };
  return (
    <div className="bg-white p-6 rounded-xl border space-y-6 dark:bg-gray-900 dark:border-gray-800">
      <div>
        <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
          Connected Accounts
        </h2>
        <p className="text-sm text-gray-500 dark:text-white">
          Display content from your connected accounts on your site
        </p>
      </div>
      <div className="space-y-4">
        {accounts.map((acc) => {
          const ui = CONNECTED_ACCOUNT_UI_MAP[acc.type];

          return (
            <div key={acc.type} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold text-sm dark:text-white ${ui.color}`}
                >
                  {ui.iconText}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {ui.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-white">
                    {ui.description}
                  </p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <span className="sr-only">Toggle {ui.name} connection</span>
                <input
                  type="checkbox"
                  checked={acc.isConnected}
                  onChange={() => handleConnectedAccountToggle(acc.type)}
                  className="sr-only peer"
                  disabled={isLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative transition-all duration-200 dark:bg-gray-800">
                  <div
                    className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200 ${
                      acc.isConnected ? "translate-x-full" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedAccounts;
