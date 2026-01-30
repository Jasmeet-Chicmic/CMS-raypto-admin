"use client";

import React from "react";
import { Reward } from "@/app/(secured)/bonus-slides/helpers/types";
import { CURRENCY_TYPE, CURRENCY_TYPE_NAMES } from "@/shared/constants";
import { Plus, Trash2, Coins, CreditCard } from "lucide-react";
import { getCurrencyStep, truncateToCurrencyPrecision } from "@/shared/utils";

interface RewardFormProps {
  rewards: Reward[];
  onChange: (rewards: Reward[]) => void;
}

const defaultReward: Reward = {
  currency: CURRENCY_TYPE.ETH,
  amount: "0",
  isAmountWithdrawable: true,
};

const RewardForm = ({ rewards, onChange }: RewardFormProps) => {
  const handleAddReward = () => {
    onChange([...rewards, { ...defaultReward }]);
  };

  const handleRemoveReward = (index: number) => {
    onChange(rewards.filter((_, i) => i !== index));
  };

  const handleRewardChange = (
    index: number,
    field: keyof Reward,
    value: number | boolean | string,
  ) => {
    const updated = [...rewards];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const currencyOptions = Object.entries(CURRENCY_TYPE_NAMES).map(
    ([key, label]) => ({
      value: Number.parseInt(key),
      label,
    }),
  );

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-textprimary dark:text-sidebartext uppercase tracking-wider">
          Manage Rewards <span className="text-red-500 font-bold">*</span>
        </h3>
        <button
          type="button"
          onClick={handleAddReward}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primarycolor dark:bg-secondarycolor text-bgwhite dark:text-textprimary rounded-xl hover:bg-primaryhover dark:hover:bg-secondaryhover transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Add New Benefit
        </button>
      </div>

      <div className="space-y-6">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 dark:bg-darkbgsecondary border border-bordercolor1 dark:border-bordercolor2 rounded-2xl transition-all duration-300 hover:border-primarycolor/30 dark:hover:border-secondarycolor/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              {/* Currency */}
              <div className="md:col-span-5">
                <label
                  htmlFor={`reward-asset-${index}`}
                  className="block text-xs font-bold text-textparagraph dark:text-sidebartext mb-2 uppercase"
                >
                  Reward Asset
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sidebartext">
                    <Coins className="w-4 h-4" />
                  </div>
                  <select
                    id={`reward-asset-${index}`}
                    value={reward.currency}
                    onChange={(e) => {
                      handleRewardChange(
                        index,
                        "currency",
                        Number.parseInt(e.target.value),
                      );
                      handleRewardChange(index, "amount", "0");
                    }}
                    className="w-full pl-10 pr-4 py-3 text-sm font-medium border border-bordercolor1 rounded-xl focus:outline-none focus:ring-2 focus:ring-primarycolor/20 dark:focus:ring-secondarycolor/20 focus:border-primarycolor dark:focus:border-secondarycolor transition-all dark:bg-darkbgprimary dark:border-bordercolor2 dark:text-sidebartext appearance-none"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="md:col-span-4">
                <label
                  htmlFor={`reward-value-${index}`}
                  className="block text-xs font-bold text-textparagraph dark:text-sidebartext mb-2 uppercase"
                >
                  Reward Value
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sidebartext">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    id={`reward-value-${index}`}
                    type="number"
                    min="0"
                    step={getCurrencyStep(reward.currency)}
                    value={reward.amount}
                    onChange={(e) =>
                      handleRewardChange(
                        index,
                        "amount",
                        truncateToCurrencyPrecision(
                          Number(e.target.value),
                          Number(reward.currency),
                        ) || 0,
                      )
                    }
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 text-sm font-bold border border-bordercolor1 rounded-xl focus:outline-none focus:ring-2 focus:ring-primarycolor/20 dark:focus:ring-secondarycolor/20 focus:border-primarycolor dark:focus:border-secondarycolor transition-all dark:bg-darkbgprimary dark:border-bordercolor2 dark:text-sidebartext"
                  />
                </div>
              </div>

              {/* Withdrawable & Remove */}
              <div className="md:col-span-3 flex items-center justify-between gap-4 h-[44px]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`withdrawable-${index}`}
                    checked={reward.isAmountWithdrawable}
                    onChange={(e) =>
                      handleRewardChange(
                        index,
                        "isAmountWithdrawable",
                        e.target.checked,
                      )
                    }
                    className="w-5 h-5 text-primarycolor dark:text-secondarycolor border-bordercolor1 dark:border-bordercolor2 rounded-lg focus:ring-primarycolor dark:focus:ring-secondarycolor dark:bg-darkbgprimary transition-colors"
                  />
                  <label
                    htmlFor={`withdrawable-${index}`}
                    className="text-sm font-bold text-textparagraph dark:text-sidebartext cursor-pointer select-none"
                  >
                    Withdrawable
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveReward(index)}
                  className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                  title="Remove reward"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {rewards.length === 0 && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
            <p className="text-red-500 text-sm font-bold">
              At least one reward benefit is required for this slide.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardForm;
