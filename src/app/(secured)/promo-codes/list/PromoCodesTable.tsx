"use client";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { deletePromoCodeAction, getPromoCodeAction } from "@/api/promoCodes";
import Button from "@/components/atoms/Button";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { PromoCode, SORT_DIRECTION } from "@/shared/types";

import AddPromoCodeModal from "./AddPromoCodeModal";

const PromoCodesTable = ({
  data,
  searchString,
}: {
  data: { data: PromoCode[]; count: number };
  searchString: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<
    PromoCode | undefined
  >(undefined);
  const [modal, setModal] = useState<{
    open: boolean;
    data?: PromoCode;
  }>({ open: false });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const columns: TableColumn<PromoCode>[] = [
    {
      title: "Code",
      field: "code",
    },
    {
      title: "Title",
      field: "title",
      sortable: true,
      sortKey: "title",
    },
    {
      title: "Is Active",
      field: "isActive",
      render: (item) =>
        item.isActive ? (
          <div className="text-green-500 bg-green-500/10 px-2 py-1 rounded-md w-min">
            Active
          </div>
        ) : (
          <div className="text-red-500 bg-red-500/10 px-2 py-1 rounded-md w-min">
            Inactive
          </div>
        ),
      sortable: true,
      sortKey: "isActive",
    },
    {
      title: "Actions",
      field: "",
      render: (item) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              const res = await getPromoCodeAction({
                promotionalCodeId: item._id || "",
              });
              console.log(res, "res");
              setSelectedPromoCode(
                res.data?.data?.map((item: PromoCode) => ({
                  ...item,
                  users: item.users?.map((user) => ({
                    ...user,
                    value: user?._id,
                    label: `${user?.name ?? ""}`,
                  })),
                }))?.[0],
              );
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setModal({ open: true, data: item });
            }}
          >
            Delete
          </Button>
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
  const handleDelete = async () => {
    if (!modal.data?._id) return;
    const res = await deletePromoCodeAction({
      promotionalCodeIds: [modal.data?._id],
    });
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setModal({ open: false });
  };
  console.log(data, "data");
  return (
    <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      {/* Table Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <SearchToolbar
              initialQuery={searchString}
              placeholder="Search Promo Code"
            />
            <Button
              variant="primary"
              type="button"
              onClick={() => setOpen(true)}
            >
              <Plus size={18} />
              <span>Add New Promo Code</span>
            </Button>
          </div>
        </div>
      </div>
      <Table<PromoCode>
        data={data?.data || []}
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
        totalItems={data?.count ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); // reset to first page
        }}
        title="users"
      />
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={handleDelete}
        title={"Delete Promo Code"}
        message={"Are you sure you want to delete this promo code?"}
      />
      <AddPromoCodeModal
        open={open}
        setOpen={setOpen}
        promoCode={selectedPromoCode}
        setSelectedPromoCode={setSelectedPromoCode}
      />
    </div>
  );
};

export default PromoCodesTable;
