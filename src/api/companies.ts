"use server";

import { JobFormType } from "@/app/(secured)/companies/view/[id]/jobs/create/CreateJobPage";
import { API_END_POINTS } from "@/shared/api";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/fetcher";
import { Company, GetParamsType, ResponseType } from "@/shared/types";

export async function getCompaniesAction(
  payload: GetParamsType & { companyId?: string },
) {
  return await getRequest<ResponseType, GetParamsType & { companyId?: string }>(
    API_END_POINTS.COMPANY,
    payload,
  );
}

export async function createCompanyAction(payload: Company) {
  return await postRequest<ResponseType, Company>(
    API_END_POINTS.COMPANY,
    payload,
  );
}

export async function updateCompanyAction(
  payload: Company & { companyId: string },
) {
  return await putRequest<ResponseType, Company & { companyId: string }>(
    API_END_POINTS.COMPANY,
    payload,
  );
}

export async function deleteCompanyAction(payload: { companyIds: string[] }) {
  return await deleteRequest<
    ResponseType,
    {
      companyIds: string[];
    }
  >(API_END_POINTS.COMPANY, payload);
}

export async function createJobAction(payload: JobFormType) {
  return await postRequest<ResponseType, JobFormType>(
    API_END_POINTS.JOBS,
    payload,
  );
}

export async function updateJobAction(
  payload: JobFormType & { jobId: string },
) {
  return await putRequest<ResponseType, JobFormType & { jobId: string }>(
    API_END_POINTS.JOBS,
    payload,
  );
}

export async function deleteJobAction(payload: { jobIds: string[] }) {
  return await deleteRequest<ResponseType, { jobIds: string[] }>(
    API_END_POINTS.JOBS,
    payload,
  );
}

export async function deleteApplicationAction(payload: {
  jobApplicationIds: string[];
}) {
  return await deleteRequest<ResponseType, { jobApplicationIds: string[] }>(
    API_END_POINTS.APPLICATIONS,
    payload,
  );
}
