// import ScrollToTop from "@/components/atoms/ScrollToTop/ScrollToTop";
import UserLayout from "@/components/layouts/UserLayout";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, User, UserSubscription } from "@/shared/types";

interface CurrencyGGR {
  currency: number;
  amount: number;
}

interface UserStats {
  totalBetCount: number;
  totalBetAmount: CurrencyGGR[];
  uniqueGamesPlayed: number;
  stats: CurrencyGGR[];
  referralEarnedAmount: CurrencyGGR[];
  promotionEarnedAmount: CurrencyGGR[];
  grossGamingRevenue: CurrencyGGR[];
}

const Layout = async ({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [data, currentSubscription, statsData] = await Promise.all([
    getRequest<
      ResponseType & { data: { data: User[]; total: number } },
      GetParamsType
    >(API_END_POINTS.USER, {
      ...(id && { userId: id }),
    }),
    getRequest<
      ResponseType & {
        data: { subscription: UserSubscription };
      },
      GetParamsType
    >(API_END_POINTS.CURRENT_SUBSCRIPTION, {
      ...(id && { userId: id }),
    }),
    getRequest<ResponseType & { data: UserStats }, GetParamsType>(
      API_END_POINTS.USER_STATS,
      {
        ...(id && { userId: id }),
      },
    ),
  ]);
  console.log(currentSubscription?.data?.subscription, "currentSubscription");
  return (
    <>
      {/* <ScrollToTop /> */}
      <UserLayout
        data={data?.data?.data?.[0]}
        currentSubscription={currentSubscription?.data?.subscription}
        statsData={statsData?.data}
      >
        {children}
      </UserLayout>
    </>
  );
};
export default Layout;
