// src/api/config.ts
"use server";

import { API_END_POINTS } from "@/shared/api";
import { getRequest, putRequest } from "@/shared/fetcher";
import { ResponseType } from "@/shared/types";

export interface CurrencyWiseConfig {
  currency: number;
  loginRewardPayout: number;
  depositBonusPercentage: number;
}

export interface ReferralRewardConfig {
  currency: number;
  rewardAmountNonWithdrawable: number;
  rewardAmountWithdrawable: number;
  betCount: number;
  minimumBetAmount: number;
  commissionPercentage: number;
}

export interface RewardConfig {
  _id: string;
  type: number;
  currencyWiseConfigs?: CurrencyWiseConfig[];
  enableChatTranslation?: boolean;
  chatTranslationLanguage?: number;
  referralTimeLimitInHours?: number;
  referralRewardConfig?: ReferralRewardConfig[];
}

export interface GetConfigParams {
  type?: number;
}

export interface UpdateConfigParams {
  type: number;
  currencyWiseConfigs?: CurrencyWiseConfig[];
  enableChatTranslation?: boolean;
  chatTranslationLanguage?: number;
  referralTimeLimitInHours?: number;
  referralRewardConfig?: ReferralRewardConfig[];
}

// Get config by type
export async function getConfigAction(params: GetConfigParams = {}) {
  return await getRequest<
    ResponseType & { data: RewardConfig },
    GetConfigParams
  >(API_END_POINTS.CONFIG, params);
}

// Update config
export async function updateConfigAction(params: UpdateConfigParams) {
  console.log(
    "updateConfigAction called with params:",
    JSON.stringify(params, null, 2),
  );
  try {
    const result = await putRequest<
      ResponseType & { data: RewardConfig },
      UpdateConfigParams
    >(API_END_POINTS.CONFIG, params);
    console.log("updateConfigAction result:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("updateConfigAction error:", error);
    throw error;
  }
}
