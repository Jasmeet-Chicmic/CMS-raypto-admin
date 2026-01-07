import { Check, DollarSign, Users } from "lucide-react";

import StatsCard from "@/components/atoms/StatCard";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import {
  GetParamsType,
  SubscriptionPlan,
  User,
  UserSubscription,
} from "@/shared/types";
import SubscribersTable from "./SubscribersTable";

const SubscriptionViewPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    skip?: number;
    limit?: number;
    search?: string;
  }>;
}) => {
  const { id } = await params;
  const { skip, limit, search } = await searchParams;
  const data = await getRequest<
    ResponseType & { data: { data: SubscriptionPlan[] } },
    GetParamsType & { subscriptionPlanId: string }
  >(API_END_POINTS.SUBSCRIPTION_PLANS, {
    subscriptionPlanId: id,
  });
  const plan = data?.data?.data?.[0];
  console.log(plan, "subscription");
  const subscriptionUsers = await getRequest<
    ResponseType & {
      data: { data: (UserSubscription & { user: User })[]; count: number };
    },
    GetParamsType & { subscriptionPlanId: string }
  >(API_END_POINTS.SUBSCRIPTION_USERS, {
    subscriptionPlanId: id,
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(search && { searchString: search }),
  });
  console.log(subscriptionUsers, "subscriptionUsers");
  const stats = [
    {
      title: "Subscribers",
      value: subscriptionUsers?.data?.count || 0,
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: "$ 1999",
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Yearly Revenue",
      value: "$ 19999",
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
    },
  ];
  return (
    <div className="mt-[20px]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Subscription Plan
      </h1>
      <p className="text-gray-600 dark:text-white">
        View and manage subscribers for this subscription plan
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        {stats.map((stat, index) => (
          <StatsCard {...stat} key={stat.title} index={index} />
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Left: Plan Details (1/3) */}
        <div
          key={plan?._id}
          className="md:w-1/3 w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800 dark:text-white"
        >
          {/* Plan Header */}
          <div
            className={`p-4 text-white bg-gray-500 dark:bg-gray-800 dark:text-white`}
            style={{ backgroundColor: plan?.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg dark:text-white">
                  {plan?.name}
                </h3>
              </div>
            </div>
            {plan?.monthlyPrice === 0 && plan?.yearlyPrice === 0 ? (
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold dark:text-white">Free</span>
              </div>
            ) : (
              <div className="flex items-baseline space-x-1">
                {plan?.monthlyPrice !== undefined && (
                  <span className="text-3xl font-bold dark:text-white">
                    {plan?.monthlyPrice === 0
                      ? "Free"
                      : `$${plan?.monthlyPrice}`}
                    {plan?.monthlyPrice > 0 && (
                      <span className="text-sm opacity-80">/monthly</span>
                    )}
                  </span>
                )}
                {plan?.yearlyPrice !== undefined && (
                  <span className="text-3xl font-bold dark:text-white">
                    {plan?.yearlyPrice === 0 ? "Free" : `$${plan?.yearlyPrice}`}
                    {plan?.yearlyPrice > 0 && (
                      <span className="text-sm opacity-80">/yearly</span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Plan Content */}
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4 dark:text-white">
              {plan?.description}
            </p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">
                Features
              </h4>
              <ul className="space-y-1">
                {plan?.features.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600 dark:text-white"
                  >
                    <Check
                      size={14}
                      className="text-green-500 mr-2 flex-shrink-0"
                    />
                    {feature}
                  </li>
                ))}
                {plan?.features.length > 3 && (
                  <li className="text-sm text-gray-500 dark:text-white">
                    +{plan?.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-white">
                Status
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-[0.875] font-medium rounded-full ${
                    plan?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {plan?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Subscribers Table (2/3) */}
        <div className="md:w-2/3 w-full">
          <h1 className="text-2xl font-bold mb-4">Subscribers</h1>
          <SubscribersTable
            subscribers={subscriptionUsers?.data?.data || []}
            total={subscriptionUsers?.data?.count || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionViewPage;
