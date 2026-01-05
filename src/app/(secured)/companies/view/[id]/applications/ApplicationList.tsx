"use client";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import { deleteApplicationAction } from "@/api/companies";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { Menu } from "@/components/atoms/Menu";
import { PageLabel } from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Application } from "@/shared/types";

const ApplicationList = ({
  applications,
  searchString,
  total,
}: {
  applications: Application[];
  searchString?: string;
  total: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>("");
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip"); // Optional: clean URL
    }
    router.push(`?${newParams.toString()}`);
  }, [currentPage, pageSize, router, searchParams]);

  const handleDelete = async (applicationId: string) => {
    const response = await deleteApplicationAction({
      jobApplicationIds: [applicationId],
    });
    if (response?.status) {
      toast.success("Application deleted successfully");
      setIsConfirmationModalOpen(false);
      setSelectedApplicationId("");
      router.refresh();
    } else {
      toast.error(response?.message);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Applications</div>
        <div className="flex items-center gap-2">
          <SearchToolbar
            placeholder="Search applications"
            initialQuery={searchString}
          />
        </div>
      </div>
      {applications.map((application) => (
        <div
          key={application?._id}
          className="bg-white border rounded-2xl p-6 shadow flex flex-col gap-4 relative"
        >
          {/* Header: Avatar, Name, Role, Resume */}
          <div className="flex items-center gap-4">
            <Avatar>
              {application?.user?.profilePicture ? (
                <AvatarImage
                  src={application?.user?.profilePicture}
                  alt={application?.user?.name || "User"}
                />
              ) : (
                <AvatarFallback>
                  {application?.user?.name?.[0] || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col flex-1">
              <div className="font-semibold text-base text-black">
                {application?.user?.name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.875rem] text-[#A3AED0] font-medium">
                Resume
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-500 px-2 py-1 text-[0.875]"
                onClick={() => {
                  window.open(application?.resume, "_blank");
                }}
              >
                Download PDF
              </Button>
            </div>
            <Menu
              items={[
                { label: "View", onClick: () => {} },
                { label: "Hire", onClick: () => {} },
                { label: "Reject", onClick: () => {} },
                {
                  label: "Delete",
                  onClick: () => {
                    setSelectedApplicationId(application?._id);
                    setIsConfirmationModalOpen(true);
                  },
                },
              ]}
              menuButton={<EllipsisVertical className="cursor-pointer" />}
            />
          </div>

          {/* Job Title */}
          <div className="mt-2">
            <span className="text-sm text-gray-500 font-medium">
              Applied for
            </span>
            <div className="font-semibold text-lg text-black">
              {application?.job?.title}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mt-2">
            <div className="font-semibold text-black text-base mb-1">
              Cover letter
            </div>
            <div className="text-sm text-gray-500">
              {application?.coverLetter}
            </div>
          </div>

          {/* Matching Skills */}
          <div className="mt-2">
            <div className="text-[0.875rem] text-[#A3AED0] font-medium mb-1">
              Matching skills
            </div>
            <div className="flex flex-wrap gap-2">
              {application?.job?.skills?.length ? (
                application?.job?.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-500 text-gray-500 px-3 py-1 rounded-full text-[0.875] font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[0.875] text-gray-400">
                  No skills listed
                </span>
              )}
            </div>
          </div>

          {/* Footer: Rating, Jobs, Location, Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-500">
            <div className="flex items-center gap-4">
              {/* Rating (placeholder) */}
              <div className="flex items-center gap-1 text-gray-500">
                {Array.from(new Array(5)).map((_, i) => (
                  <span key={i}>
                    {i < (application?.rating ?? 0) ? "★" : "☆"}
                  </span>
                ))}
                <span className="ml-1 text-[0.875]">
                  (4 of 23{" "}
                  <span className="bg-yellow-200 px-1 rounded">Jobs</span>)
                </span>
              </div>
              {/* Location (placeholder) */}
              <span className="text-[0.875rem] text-[#A3AED0]">• London</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-500 px-4"
              >
                Message
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-gray-500 hover:bg-gray-500 px-4"
              >
                Hire <span className="ml-1">👜</span>
              </Button>
            </div>
          </div>
        </div>
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
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => void handleDelete(selectedApplicationId)}
        title="Delete Application"
        message="Are you sure you want to delete this application?"
      />
    </div>
  );
};

export default ApplicationList;
