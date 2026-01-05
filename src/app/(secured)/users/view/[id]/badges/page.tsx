import { Check, Info, Tag } from "lucide-react";
import StatsCard from "@/components/atoms/StatCard";
import BadgeTable from "./BadgeTable";
import { getUserBadges } from "@/api/badges";

const stats = [
  {
    title: "Total Assigned",
    value: 2,
    icon: <Tag className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Used",
    value: 1,
    icon: <Check className="w-5 h-5" />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Available",
    value: 1,
    icon: <Info className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-600",
  },
];

const BadgesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ limit: number; skip: number }>;
}) => {
  const { id } = await params;
  const { limit = 10, skip = 0 } = await searchParams;
  const userBadges = await getUserBadges({
    userId: id,
    limit: limit,
    skip: skip,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatsCard {...stat} key={stat.title} index={index} />
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        <BadgeTable
          data={userBadges?.data.data}
          userId={id}
          count={userBadges?.data.count}
        />
      </div>
    </div>
  );
};

export default BadgesPage;
