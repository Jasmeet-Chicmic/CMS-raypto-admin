import { getConfigAction, RewardConfig } from "@/api/config";
import { CONFIG_TYPE } from "@/shared/constants";
import ConfigTabs from "./ConfigTabs";

const ConfigsPage = async () => {
  // Fetch all configs separately - each type has its own data
  const rewardConfigData = await getConfigAction({ type: CONFIG_TYPE.REWARDS });
  const chatTranslationConfigData = await getConfigAction({
    type: CONFIG_TYPE.CHAT_TRANSLATION,
  });
  const referralConfigData = await getConfigAction({
    type: CONFIG_TYPE.REFERRAL,
  });
  console.log(referralConfigData, "referralConfigData");

  return (
    <div className="space-y-6 mt-[20px]">
      <ConfigTabs
        rewardConfig={rewardConfigData?.data || null}
        chatTranslationConfig={chatTranslationConfigData?.data || null}
        referralConfig={referralConfigData?.data || null}
      />
    </div>
  );
};

export default ConfigsPage;

export type { RewardConfig };
