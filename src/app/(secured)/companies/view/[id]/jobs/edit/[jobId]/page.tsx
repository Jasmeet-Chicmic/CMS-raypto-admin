import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, Job } from "@/shared/types";
import CreateJobPage from "../../create/CreateJobPage";

const EditJobPage = async ({
  params,
}: {
  params: Promise<{ id: string; jobId: string }>;
}) => {
  const { id, jobId } = await params;
  const data = await getRequest<
    ResponseType & { data: { jobs: Job[]; total: number } },
    GetParamsType & { jobId: string }
  >(API_END_POINTS.JOBS, {
    companyId: id,
    jobId,
  });
  console.log(data, "Test: EditJobPage");
  return <CreateJobPage job={data?.data?.jobs?.[0]} />;
};

export default EditJobPage;
