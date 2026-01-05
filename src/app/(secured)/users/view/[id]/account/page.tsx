// import SearchToolbar from "@/components/atoms/SearchToolbar";
// import InvoiceList from "@/components/molecules/user/InvoiceList";
// import UserProjectsTable from "@/components/molecules/user/UserProjectsTable/UserProjectsTable";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, ProjectType, SORT_DIRECTION } from "@/shared/types";

const AccountPage = async ({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
  }>;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { searchString, skip, limit, sortKey, sortDirection } =
    await searchParams;
  await getRequest<
    ResponseType & { data: { data: ProjectType[]; count: number } },
    GetParamsType
  >(API_END_POINTS.USER, {
    userId: id,
    ...(searchString && { searchString }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-900 dark:border-gray-800">
        {/* <SearchToolbar initialQuery={searchString} placeholder="Search User" /> */}
        {/* <UserProjectsTable data={data?.data} userId={id} /> */}
      </div>
      {/* <InvoiceList userId={id} /> */}
    </div>
  );
};

export default AccountPage;
