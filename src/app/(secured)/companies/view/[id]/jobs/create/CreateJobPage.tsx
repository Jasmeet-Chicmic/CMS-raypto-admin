"use client";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

import { createJobAction, updateJobAction } from "@/api/companies";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FormConfig } from "@/components/molecules/FormBuilder/types";
import {
  INDUSTRY_SECTORS,
  INDUSTRY_SECTORS_OPTIONS,
  JOB_LOCATION,
  JOB_LOCATION_OPTIONS,
  JOB_SALARY_CATEGORY,
  JOB_SALARY_CATEGORY_OPTIONS,
  JOB_STATUS,
  JOB_STATUS_OPTIONS,
  JOB_TYPE,
  JOB_TYPE_OPTIONS,
  JOB_VISIBILITY,
  JOB_VISIBILITY_OPTIONS,
} from "@/shared/constants";
import { Job } from "@/shared/types";

export type JobFormType = {
  companyId?: string;
  title: string;
  description: string;
  jobType: JOB_TYPE;
  location: JOB_LOCATION;
  inPersonLocation?: string;
  salaryCategory: JOB_SALARY_CATEGORY;
  customSalaryAmount?: number;
  applicationOpenDate: string;
  applicationCloseDate: string;
  keyResponsibilities: string;
  skills: string[];
  preferredExperience: string;
  sector: INDUSTRY_SECTORS;
  customSector?: string;
  status: JOB_STATUS;
  visibility: JOB_VISIBILITY;
};

const CreateJobPage = ({ job }: { job?: Job }) => {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  // @ts-expect-error - TODO: fix this
  const formConfig: FormConfig<JobFormType> = ({ watch }) => [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    {
      name: "jobType",
      label: "Job Type",
      type: "select",
      options: JOB_TYPE_OPTIONS,
    },
    {
      name: "location",
      label: "Location",
      type: "select",
      options: JOB_LOCATION_OPTIONS,
      width:
        watch("location") === JOB_LOCATION.IN_PERSON ? "w-[49%]" : "w-full",
    },
    ...(watch("location") === JOB_LOCATION.IN_PERSON
      ? [
          {
            name: "inPersonLocation",
            label: "In-Person Location",
            type: "text",
            width: "w-[49%]",
          },
        ]
      : []),
    {
      name: "salaryCategory",
      label: "Salary Category",
      type: "select",
      options: JOB_SALARY_CATEGORY_OPTIONS,
    },
    {
      name: "applicationOpenDate",
      label: "Application Open Date",
      type: "date",
      width: "w-[49%]",
    },
    {
      name: "applicationCloseDate",
      label: "Application Close Date",
      type: "date",
      width: "w-[49%]",
    },
    {
      name: "keyResponsibilities",
      label: "Key Responsibilities",
      type: "textarea",
    },
    {
      name: "skills",
      label: "Skills",
      type: "array",
      items: {
        type: "text",
      },
    },
    {
      name: "preferredExperience",
      label: "Preferred Experience",
      type: "text",
    },
    {
      name: "sector",
      label: "Sector",
      type: "select",
      options: INDUSTRY_SECTORS_OPTIONS,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: JOB_STATUS_OPTIONS,
    },
    {
      name: "visibility",
      label: "Visibility",
      type: "select",
      options: JOB_VISIBILITY_OPTIONS,
    },
  ];
  const onSubmit = (data: JobFormType) => {
    console.log(data);
    startTransition(async () => {
      if (job?._id) {
        const res = await updateJobAction({
          title: data.title,
          description: data.description,
          jobType: data.jobType,
          location: data.location,
          inPersonLocation: data.inPersonLocation,
          salaryCategory: data.salaryCategory,
          customSalaryAmount: data.customSalaryAmount,
          applicationOpenDate: data.applicationOpenDate,
          applicationCloseDate: data.applicationCloseDate,
          keyResponsibilities: data.keyResponsibilities,
          skills: data.skills,
          preferredExperience: data.preferredExperience,
          sector: data.sector,
          status: data.status,
          visibility: data.visibility,
          jobId: job._id,
        });
        if (res.status) {
          toast.success(res.message);
          router.push(`/companies/view/${id}/jobs`);
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createJobAction({ ...data, companyId: id as string });
        if (res.status) {
          toast.success(res.message);
          router.push(`/companies/view/${id}/jobs`);
        } else {
          toast.error(res.message);
        }
      }
    });
  };
  return (
    <div className="space-y-6 bg-white p-4 rounded-lg">
      <h1 className="text-2xl font-bold">{job?._id ? "Edit" : "Create"} Job</h1>
      <FormBuilder
        formConfig={formConfig}
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={{
          ...job,
          applicationOpenDate: job?.applicationOpenDate
            ? new Date(job.applicationOpenDate).toISOString().split("T")[0]
            : undefined,
          applicationCloseDate: job?.applicationCloseDate
            ? new Date(job.applicationCloseDate).toISOString().split("T")[0]
            : undefined,
        }}
      />
    </div>
  );
};

export default CreateJobPage;
