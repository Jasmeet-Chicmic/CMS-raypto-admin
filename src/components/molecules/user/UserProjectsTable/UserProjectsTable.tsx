"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Table, { TableColumn } from "@/components/atoms/Table";
import Pagination from "@/components/atoms/Pagination";
import { ProjectType, SORT_DIRECTION } from "@/shared/types";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteProjectAction } from "@/api/user";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

const UserProjectsTable = ({
  data,
  userId,
}: {
  data: { data: ProjectType[]; count: number };
  userId: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [modal, setModal] = useState<{ open: boolean; data?: ProjectType }>({
    open: false,
  });

  const handleDeleteProjects = async () => {
    if (!modal.data?._id) return;
    const res = await deleteProjectAction({
      projectIds: [modal.data?._id],
      userId: userId || "",
    });
    console.log(res);
    if (res?.status) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message || "Failed to delete projects");
    }
    setModal({ open: false });
    router.refresh();
  };

  const columns: TableColumn<ProjectType>[] = [
    {
      title: "Project",
      field: (row) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.imageURL}
            alt={row.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-[0.875] text-gray-400">
              Leader: {row.leader.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Progress",
      field: (row) => (
        <div className="w-full">
          <div className="text-[0.875] font-medium mb-1">{row.progress}%</div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className={`h-full rounded ${
                row.progress >= 80
                  ? "bg-green-500"
                  : row.progress >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Team Members",
      field: (row) => (
        <div className="text-sm">
          {row.teamMembers.map((member) => member.name).join(", ")}
        </div>
      ),
    },
    {
      field: "",
      title: "Actions",
      render: (data) => (
        <div className="flex items-center space-x-2">
          <Trash2
            className="text-gray-500 cursor-pointer"
            onClick={() => setModal({ open: true, data: data })}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip"); // Optional: clean URL
    }

    if (pageSize !== 10) {
      newParams.set("limit", pageSize.toString());
    } else {
      newParams.delete("limit");
    }
    if (sortKey) {
      newParams.set("sortKey", sortKey);
      newParams.set("sortDirection", sortDirection.toString());
    } else {
      newParams.delete("sortKey");
      newParams.delete("sortDirection");
    }

    router.push(`?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);

  return (
    <div className="space-y-6">
      <Table<ProjectType>
        columns={columns}
        data={data?.data || []}
        keyExtractor={(item) => item._id}
        handleSort={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={data?.count ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => {
          console.log("on page change", page);
          setCurrentPage(page + 1);
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="Projects"
      />
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() => void handleDeleteProjects()}
        title={"Delete Project"}
        message={"Are you sure you want to delete this project?"}
      />
    </div>
  );
};

export default UserProjectsTable;
