// import ViewersList from "@/components/molecules/company/CompanyViewerCard/ViewerList";
// import { ViewerCardProps } from "@/components/molecules/company/CompanyViewerCard/ViewerCard";
// import ProfileView from "@/components/molecules/company/ProfileView/ProfileView";
// import { FollowCompanyCardProps } from "@/components/molecules/company/FollowCompany/FollowCompanyCard";
// import FollowCompanyList from "@/components/molecules/company/FollowCompany/FollowCompanyList";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, Job, SORT_DIRECTION } from "@/shared/types";

const JobPage = async ({
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
  const data = await getRequest<
    ResponseType & { data: { jobs: Job[]; total: number } },
    GetParamsType
  >(API_END_POINTS.JOBS, {
    companyId: id,
    ...(searchString && { searchString }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
  });
  console.log(data, "Test: JobPage");
  return (
    <div className="space-y-6">
      {/* <ViewersList viewers={sampleViewers} />
      <FollowCompanyList companies={sampleCompany} /> */}
    </div>
  );
};

export default JobPage;
