import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import {
  GetParamsType,
  ResponseType,
  SORT_DIRECTION,
  User,
} from "@/shared/types";
import { USER_ROLES } from "@/shared/constants";
import UserTable from "./UserTable";

const UserManagment = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    role?: USER_ROLES;
    status?: number;
    isSuspicious?: boolean;
    joinedAt?: string;
    currency?: number;
  }>;
}) => {
  const {
    searchString,
    role,
    skip,
    limit,
    sortKey,
    sortDirection,
    status,
    isSuspicious,
    joinedAt,
    currency,
  } = await searchParams;
  const data = await getRequest<
    ResponseType & { data: { users: User[]; total: number } },
    GetParamsType
  >(API_END_POINTS.USER, {
    ...(searchString && { searchString }),
    ...(role && { role }),
    ...(skip && { skip: Number(skip) }),
    ...(limit && { limit: Number(limit) }),
    ...(sortKey && { sortKey, sortDirection }),
    ...(status && { status: Number(status) }),
    ...(isSuspicious && { isSuspicious: String(isSuspicious) === "true" }),
    ...(joinedAt && { joinedAt }),
    currency: currency ? Number(currency) : 1,
  });

  // const stats = [
  //   {
  //     title: "Session",
  //     value: "21,459",
  //     change: "(+29%)",
  //     subtitle: "Total Users",
  //     icon: <Users className="w-5 h-5" />,
  //     color: "bg-purple-100 text-purple-600",
  //   },
  //   {
  //     title: "Paid Users",
  //     value: "4,567",
  //     change: "(+18%)",
  //     subtitle: "Last week analytics",
  //     icon: <CreditCard className="w-5 h-5" />,
  //     color: "bg-red-100 text-red-600",
  //   },
  //   {
  //     title: "Active Users",
  //     value: "19,860",
  //     change: "(-14%)",
  //     subtitle: "Last week analytics",
  //     icon: <UserCheck className="w-5 h-5" />,
  //     color: "bg-green-100 text-green-600",
  //   },
  //   {
  //     title: "Pending Users",
  //     value: "237",
  //     change: "(+42%)",
  //     subtitle: "Last week analytics",
  //     icon: <Clock className="w-5 h-5" />,
  //     color: "bg-orange-100 text-orange-600",
  //   },
  // ];

  return (
    <div className="space-y-6 mt-[20px]">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <StatsCard stat={stat} key={stat.title} index={index} />
        ))}
      </div> */}
      <div className="overflow-x-auto">
        <UserTable data={data} searchString={searchString || ""} />
      </div>
    </div>
  );
};

export default UserManagment;
