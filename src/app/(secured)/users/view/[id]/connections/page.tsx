import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, User } from "@/shared/types";

import ConnectedAccounts from "./ConnectedAccounts";
import SocialAccounts from "./SocialAccounts";

const ConnectionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data = await getRequest<
    ResponseType & { data: { users: User[]; total: number } },
    GetParamsType
  >(API_END_POINTS.USER, {
    ...(id && { userId: id }),
  });
  const socialAccountsData = data.data.users[0].socialAccounts || [];
  const connectedAccountsData = data.data.users[0].connectedAccounts || [];
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <ConnectedAccounts
          initialConnectedAccountData={connectedAccountsData}
          userId={id}
        />

        <SocialAccounts
          initialConnectedAccounts={socialAccountsData}
          userId={id}
        />
      </div>
    </div>
  );
};

export default ConnectionPage;
