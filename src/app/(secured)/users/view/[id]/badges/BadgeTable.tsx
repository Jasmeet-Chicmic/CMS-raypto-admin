"use client";
import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import Button from "@/components/atoms/Button";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import AssignBadgeModal from "./AssignBadgeModal";
import { BadgesInterface } from "@/app/(secured)/badges/helpers/types";
import Image from "next/image";
import { BASE_URL } from "@/shared/constants";
import Pagination from "@/components/atoms/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteUserBadgeAction } from "@/api/badges";
import { toast } from "react-toastify";

const BadgeTable = ({
  data,
  userId,
  count,
}: {
  data: { badge: BadgesInterface; createdAt: string; _id: string }[];
  userId: string;
  count: number;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState({ open: false, badgeId: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("limit")) || 5,
  );
  const handlePageChange = (page: number) => {
    console.log(page, "page");
    setCurrentPage(page);
  };
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (currentPage > 0) {
      newParams.set("skip", (currentPage * pageSize).toString());
    } else {
      newParams.delete("skip"); // Optional: clean URL
    }

    if (pageSize !== 10) {
      newParams.set("limit", pageSize.toString());
    } else {
      newParams.delete("limit");
    }

    router.push(`?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };
  const columns: TableColumn<{
    badge: BadgesInterface;
    createdAt: string;
    _id: string;
  }>[] = [
    {
      title: "Name",
      field: "badge",
      render: (value) => (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            {value.badge.name}
          </h4>
        </div>
      ),
    },
    // {
    //   title: "Type",
    //   field: "badge",
    //   render: (value) => (
    //     <div className="text-sm font-semibold text-gray-800 dark:text-white">
    //       {value.badge.type}
    //     </div>
    //   ),
    // },
    {
      title: "Assigned On",
      field: "createdAt",
      render: (value: { createdAt: string }) => (
        <div>{format(new Date(value.createdAt), "dd MMM yyyy")}</div>
      ),
    },
    {
      title: "Image",
      field: "badge",
      render: (value) =>
        value.badge.imageURL ? (
          <Image
            src={`${BASE_URL}/${value.badge.imageURL}`}
            alt="badge-image"
            className="object-cover rounded-full"
            width={32}
            height={32}
          />
        ) : (
          <span className="text-gray-400 text-sm italic">No image</span>
        ),
    },
    {
      title: "Actions",
      field: "",
      render: (value) => (
        <div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsOpen({ open: true, badgeId: value._id })}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
  const onConfirmModal = () => {
    startTransition(async () => {
      const data = await deleteUserBadgeAction({
        userBadgeIds: [isOpen.badgeId],
      });
      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setIsOpen({ open: false, badgeId: "" });
      router.refresh();
    });
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Assigned Badges
        </h2>
        <AssignBadgeModal
          userId={userId}
          assignedBadges={data.map((item) => item.badge._id)}
        />
      </div>
      <Table
        columns={columns}
        data={data}
        keyExtractor={(item) => item._id}
        hideSelectCol
      />
      {/* Pagination and ConfirmationModal can be added as needed */}
      <Pagination
        totalItems={count}
        currentPage={currentPage + 1}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        title="Promo Codes"
      />
      <ConfirmationModal
        isOpen={isOpen.open}
        onClose={() => setIsOpen({ open: false, badgeId: "" })}
        onConfirm={onConfirmModal}
        title="Unassign Badge"
        message="Are you sure you want to unassign this badge?"
        isLoading={isLoading}
      />
    </>
  );
};

export default BadgeTable;
