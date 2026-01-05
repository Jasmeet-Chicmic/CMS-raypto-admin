"use client";
import Table, { TableColumn } from "@/components/atoms/Table";
import React, { useEffect, useState } from "react";
import {
  BADGE_TYPE_NAMES,
  BADGE_TYPES,
  BadgesInterface,
  BadgeTypes,
} from "../helpers/types";
import Image from "next/image";
import { ResponseType, SORT_DIRECTION } from "@/shared/types";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import SelectFilter from "@/components/atoms/SelectFilter";
import { BADGES_TYPE_OPTIONS } from "../helpers/constants";
import { EllipsisVertical, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { MODAL_TYPE } from "@/components/molecules/ConfirmationModal/helpers/constants";
import { MESSAGES, STRING } from "@/shared/strings";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { deleteBadgeAction } from "@/api/badges";
import { toast } from "react-toastify";
import { BASE_URL } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { Menu } from "@/components/atoms/Menu";

const BadgesList = ({
  badgesListData,
  searchString,
}: {
  badgesListData: ResponseType & {
    data: { data: BadgesInterface[]; count: number };
  };
  searchString: string;
}) => {
  const [sortKey, setSortKey] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<{
    open: boolean;
    type?: MODAL_TYPE;
    badgeId?: string;
  }>({
    open: false,
  });
  const columns: TableColumn<BadgesInterface>[] = [
    {
      field: "_id",
      title: "Id",
      render: (data) => (data?._id ? `#${data._id.slice(-6)}` : ""),
    },
    {
      field: "name",
      title: "Name",
      render: (data) => `${data?.name ?? ""}`,
      sortable: true,
      sortKey: "name",
    },
    {
      field: "type",
      title: "Type",
      render: (data) => BADGE_TYPE_NAMES[data?.type ?? BADGE_TYPES.CONDITIONAL],
    },
    {
      field: "imageURL",
      title: "Image",
      render: (data) =>
        data?.imageURL ? (
          <Image
            src={`${BASE_URL}/${data?.imageURL}`}
            alt={"badge-image"}
            className=" object-cover rounded-full"
            width={20}
            height={20}
          />
        ) : (
          ""
        ),
    },
    {
      field: "",
      title: "Actions",
      render: (data) => {
        return (
          <div className="flex items-center space-x-2">
            <Trash2
              className="text-gray-500 cursor-pointer"
              onClick={() => {
                setModal({
                  open: true,
                  type: MODAL_TYPE.DELETE,
                  badgeId: data._id,
                });
              }}
            />
            <Link href={`/badges/view/${data._id}`}>
              <Eye className="text-gray-500 cursor-pointer" />
            </Link>
            <Menu
              items={[
                {
                  label: "Edit",
                  onClick: () =>
                    redirect(`${ROUTES.BADGES_EDIT}?id=${data._id}`),
                },
              ]}
              menuButton={<EllipsisVertical />}
            />
          </div>
        );
      },
    },
  ];
  const handleDelete = async () => {
    if (!modal.badgeId) {
      return;
    }
    const res = await deleteBadgeAction({
      badgeIds: [modal.badgeId],
    });
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setModal({ open: false });
  };
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
  }, [currentPage, pageSize, sortKey, sortDirection, searchParams, router]);
  return (
    <div>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <SearchToolbar
              initialQuery={searchString}
              placeholder="Search Badge"
            />
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700"
              onClick={() => redirect(`${ROUTES.BADGES_ADD}`)}
            >
              <Plus size={18} />
              <span>Create Badge</span>
            </button>
          </div>
          <div className="flex justify-end items-center gap-x-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-400">
              Filters
            </h2>
            <SelectFilter<BadgeTypes>
              paramName="badgeType"
              options={BADGES_TYPE_OPTIONS}
              placeholder="Filter by Type"
              className="w-60"
            />
          </div>
        </div>
      </div>
      <Table<BadgesInterface>
        data={badgesListData?.data.data}
        columns={columns}
        keyExtractor={(item) => item._id || ""}
        handleSort={(sortKey, sortDirection) => {
          setSortKey(sortKey);
          setSortDirection(sortDirection);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={badgesListData?.data.count}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); // reset to first page
        }}
        title="Badges"
      />
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() => {
          if (modal.badgeId) handleDelete();
        }}
        title={
          modal.type === MODAL_TYPE.DELETE
            ? STRING.DELETE_USER
            : STRING.SUSPEND_USER
        }
        message={
          modal.type === MODAL_TYPE.DELETE
            ? MESSAGES.DELETE_CONFIRMATION
            : MESSAGES.SUSPEND_CONFIRMATION
        }
      />
    </div>
  );
};

export default BadgesList;
