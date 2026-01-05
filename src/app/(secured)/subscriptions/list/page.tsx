import { Check, DollarSign, Shield, Users } from "lucide-react";

import StatsCard from "@/components/atoms/StatCard";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import {
  GetParamsType,
  SORT_DIRECTION,
  SubscriptionPlan,
} from "@/shared/types";

import PlanManagement from "./PlanManagement";

const PlansListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    search?: string;
  }>;
}) => {
  const stats = [
    {
      title: "Total Plans",
      value: "4",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Plans",
      value: "2",
      icon: <Check className="w-5 h-5" />,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Total Subscribers",
      value: "19,860",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: "237",
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
    },
  ];
  const { skip, limit, sortKey, sortDirection, search } = await searchParams;

  const data = await getRequest<
    ResponseType & { data: { data: SubscriptionPlan[]; count: number } },
    GetParamsType
  >(API_END_POINTS.SUBSCRIPTION_PLANS, {
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
    ...(search && { searchString: search }),
  });

  return (
    <div className=" mt-[20px]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Subscription Plans
      </h1>
      <p className="text-gray-600 dark:text-white">
        Create and manage subscription plans for your users
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-3">
        {stats.map((stat, index) => (
          <StatsCard {...stat} key={stat.title} index={index} />
        ))}
      </div>
      <PlanManagement data={data.data.data} total={data.data.count} />
    </div>
  );
};

export default PlansListPage;
