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
      <div className="bg-bgwhite rounded-t-[12px] dark:bg-darkbgprimary dark:border-darkbordercolor1">
        <div className="p-6 dark:border-darkbgprimary">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-[1.5rem] font-bold text-textprimary dark:text-bgwhite">
                Configurations
              </h2>
              {/* <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight">
                Manage system configurations and settings
              </p> */}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-bordercolor1 dark:border-bordercolor2/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                currentTab === tab.id
                  ? "text-primarycolor dark:text-secondarycolor"
                  : "text-sidebartext hover:text-gray-600 dark:text-gray-500 dark:hover:text-darklabelprimary"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {currentTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primarycolor dark:bg-secondarycolor rounded-t-full shadow-[0_-1px_10px_rgba(67,24,255,0.3)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-bgwhite rounded-b-[20px] dark:bg-darkbgprimary dark:border-darkbordercolor1">
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
