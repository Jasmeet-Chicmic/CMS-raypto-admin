"use client";

import { useState } from "react";
import RewardConfigForm from "./RewardConfigForm";
import ChatTranslationConfigForm from "./ChatTranslationConfigForm";
import ReferralConfigForm from "./ReferralConfigForm";
import type { RewardConfig } from "./page";

interface ConfigTabsProps {
  rewardConfig: RewardConfig | null;
  chatTranslationConfig: RewardConfig | null;
  referralConfig: RewardConfig | null;
}

const ConfigTabs = ({
  rewardConfig,
  chatTranslationConfig,
  referralConfig,
}: ConfigTabsProps) => {
  const [currentTab, setCurrentTab] = useState("rewards");

  const tabs = [
    { id: "rewards", label: "Rewards" },
    { id: "referral", label: "Referral" },
    // { id: "chat-translation", label: "Chat Translation" },
  ];

  return (
    <div>
      {/* Header with Tabs */}
      <div className="bg-white rounded-t-[12px] dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                Configurations
              </h2>
              {/* <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                Manage system configurations and settings
              </p> */}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                currentTab === tab.id
                  ? "text-[#4F46E5] dark:text-white"
                  : "text-[#A3AED0] hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {currentTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4F46E5] rounded-t-full shadow-[0_-1px_10px_rgba(67,24,255,0.3)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-[20px] dark:bg-gray-900 dark:border-gray-800">
        {currentTab === "rewards" && (
          <RewardConfigForm initialConfig={rewardConfig} />
        )}
        {currentTab === "referral" && (
          <ReferralConfigForm initialConfig={referralConfig} />
        )}
        {currentTab === "chat-translation" && (
          <ChatTranslationConfigForm initialConfig={chatTranslationConfig} />
        )}
      </div>
    </div>
  );
};

export default ConfigTabs;
