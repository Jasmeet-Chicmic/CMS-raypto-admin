"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import { deleteJobAction } from "@/api/companies";
import Button from "@/components/atoms/Button";
import { PageLabel } from "@/components/atoms/Pagination";
import SearchInput from "@/components/atoms/SearchInput";

import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { JobCard } from "./JobCard";

import type { Job } from "@/shared/types";
interface JobListProps {
  jobs: Job[];
  total: number;
  companyId: string;
}

const JobList = ({ jobs, total, companyId }: JobListProps) => {
  const router = useRouter();
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    open: false,
    jobId: "",
  });
  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    if (searchString) {
      newParams.set("searchString", searchString);
    } else {
      newParams.delete("searchString");
    }
    if (currentPage > 0) {
      newParams.set("skip", (currentPage * pageSize).toString());
    } else {
      newParams.delete("skip");
    }
    router.push(`?${newParams.toString()}`);
  }, [searchString, currentPage, router]);
  const handleDelete = async () => {
    const res = await deleteJobAction({ jobIds: [isDeleteModalOpen.jobId] });
    if (res.status) {
      toast.success(res.message);
      setIsDeleteModalOpen({ open: false, jobId: "" });
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsDeleteModalOpen({ open: false, jobId: "" });
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <SearchInput
          value={searchString}
          onChange={setSearchString}
          placeholder="Search jobs"
          className="w-full"
        />
        <Button
          variant="primary"
          className="min-w-32 ml-2"
          onClick={() =>
            router.push(`/companies/view/${companyId}/jobs/create`)
          }
        >
          Create Job
        </Button>
      </div>
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          companyId={companyId}
          handleDelete={() =>
            setIsDeleteModalOpen({ open: true, jobId: job._id })
          }
        />
      ))}
      {Math.ceil(total / pageSize) > 1 && (
        <div className="flex justify-center mt-4">
          <ReactPaginate
            pageCount={Math.ceil(total / pageSize)}
            forcePage={currentPage}
            onPageChange={(selected) => {
              console.log(selected);
              setCurrentPage(selected.selected);
            }}
            containerClassName="flex space-x-2 items-center paginationWrapper"
            pageClassName="rounded"
            activeClassName="text-black font-bold dark:text-white"
            previousLabel={
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            }
            nextLabel={
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            }
            pageLabelBuilder={(page) => (
              <PageLabel page={page} currentPage={currentPage + 1} />
            )}
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen.open}
        onClose={() => setIsDeleteModalOpen({ open: false, jobId: "" })}
        onConfirm={() => void handleDelete()}
        title="Delete Job"
        message="Are you sure you want to delete this job?"
      />
    </div>
  );
};
export default JobList;
