// components/JobCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { JOB_LOCATION, JOBS_LOCATION_LABELS } from "@/shared/constants";

import { ACTION, JobDropdown } from "./JobDropDown";

import type { Job } from "@/shared/types";
interface JobCardProps {
  job: Job;
  companyId: string;
  handleDelete: () => void;
}

export const JobCard = ({ job, companyId, handleDelete }: JobCardProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(job.isExpanded);
  const handleDropdownAction = (action: string) => {
    switch (action) {
      case ACTION.OPEN:
        // window.open(`/jobs/${job}`, "_blank");
        break;
      case ACTION.EDIT:
        router.push(`/companies/view/${companyId}/jobs/edit/${job._id}`);
        break;
      case ACTION.ARCHIVE:
        console.log("Archiving job:", job);
        break;
      case ACTION.VIEW:
        console.log("Viewing job post in same tab");
        // window.location.href = `/jobs/${job}`;
        break;
      case ACTION.PRIVATE:
        console.log("Marking as private...");
        break;
      case ACTION.COPY:
        navigator.clipboard.writeText(`${window.location.origin}/jobs/${job}`);
        toast.success("Link copied to clipboard");
        break;
      case ACTION.DELETE:
        handleDelete();
        break;
      case ACTION.HIRINGS:
        console.log("Opening hirings for:", job);
        break;
      default:
        console.log("Unhandled action:", action);
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl border space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Company Avatar or Initials */}
          {/* {job.companyProfilePicture ? (
            <Image
              src={job.companyProfilePicture}
              alt={job.companyName}
              width={96}
              height={96}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="bg-[#592C16] text-white w-12 h-12 rounded flex items-center justify-center font-bold text-lg uppercase">
              {job.companyName?.slice(0, 2) || "NA"}
            </div>
          )} */}

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.companyName}</p>
          </div>
        </div>
        <JobDropdown onAction={handleDropdownAction} />
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        {/* <span>{COUNTRY_NAMES[job.companyLocation]}</span> */}
        <span>{JOBS_LOCATION_LABELS[job.location]}</span>
        {job.location === JOB_LOCATION.IN_PERSON && (
          <span>{job.inPersonLocation}</span>
        )}
        {/* <span>{job.schedule}</span> */}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {job.skills.map((skill, idx) => (
          <span
            key={idx}
            className="bg-white px-3 py-1 text-sm border rounded-full text-[#592C16]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="text-sm text-gray-700 leading-relaxed">
        {job.description.length < 120 ? (
          job.description
        ) : expanded ? (
          <>
            {job.description}
            <button
              onClick={() => setExpanded(false)}
              className="text-[0.875] text-[#592C16] block mt-1"
            >
              less
            </button>
          </>
        ) : (
          <>
            {job.description.slice(0, 120)}...
            <button
              onClick={() => setExpanded(true)}
              className="text-[0.875] text-[#592C16] block mt-1"
            >
              more
            </button>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className="bg-[#592C16] text-white px-4 py-2 text-sm rounded-md"
          onClick={() =>
            router.push(
              `/companies/view/${companyId}/applications?jobId=${job._id}`,
            )
          }
        >
          View applications
        </button>
        <button
          className="border border-[#592C16] text-[#592C16] px-4 py-2 text-sm rounded-md"
          onClick={() =>
            router.push(`/companies/view/${companyId}/jobs/edit/${job._id}`)
          }
        >
          Edit
        </button>
      </div>
    </div>
  );
};
