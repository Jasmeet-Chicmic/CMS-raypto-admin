import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { Application, GetParamsType } from "@/shared/types";

import ApplicationList from "./ApplicationList";

const JobApplicationsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ searchString?: string; jobId?: string }>;
}) => {
  const { id } = await params;
  const { searchString, jobId } = await searchParams;
  const data = await getRequest<
    ResponseType & { data: { jobApplications: Application[]; count: number } },
    GetParamsType
  >(API_END_POINTS.APPLICATIONS, {
    companyId: id,
    ...(searchString && { searchString }),
    ...(jobId && { jobId }),
  });
  return (
    <ApplicationList
      applications={data?.data?.jobApplications ?? []}
      searchString={searchString}
      total={data?.data?.count ?? 0}
    />
  );
};

export default JobApplicationsPage;
