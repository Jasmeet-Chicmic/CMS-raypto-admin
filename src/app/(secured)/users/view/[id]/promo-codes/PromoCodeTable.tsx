"use client";
import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { unassignPromoCodeAction } from "@/api/promoCodes";
import Button from "@/components/atoms/Button";
import Pagination from "@/components/atoms/Pagination";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { PromoCode } from "@/shared/types";

import AssignPromoCodeModal from "./AssignPromoCodeModal";

const PromoCodeTable = ({
  data,
  userId,
  count,
}: {
  data: { promoCode: PromoCode; createdAt: string; _id: string }[];
  userId: string;
  count: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState({ open: false, promoCodeId: "" });
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("skip")) || 0,
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("limit")) || 10,
  );
  const handlePageChange = (page: number) => {
    console.log(page, "page");
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };
  const handleUnassignPromoCode = async () => {
    const res = await unassignPromoCodeAction({
      userPromotionCodeIds: [isOpen.promoCodeId],
    });
    console.log(res, "res");
    if (res.status) {
      toast.success("Promo code unassigned successfully");
      setIsOpen({ open: false, promoCodeId: "" });
      router.refresh();
    } else {
      toast.error("Failed to unassign promo code");
    }
  };
  const columns: TableColumn<{
    promoCode: PromoCode;
    createdAt: string;
    _id: string;
  }>[] = [
    {
      title: "Name",
      field: "promoCode",
      render: (value) => (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            {value.promoCode.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-white">
            {value.promoCode.description}
          </p>
        </div>
      ),
    },
    {
      title: "Code",
      field: "promoCode",
      render: (value) => (
        <div className="text-sm font-semibold text-gray-800 dark:text-white">
          {value.promoCode.code}
        </div>
      ),
    },
    {
      title: "Assigned On",
      field: "createdAt",
      render: (value: { createdAt: string }) => (
        <div>{format(new Date(value.createdAt), "dd MMM yyyy")}</div>
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
            onClick={() => setIsOpen({ open: true, promoCodeId: value._id })}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
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
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Assigned Promo Codes
        </h2>
        <AssignPromoCodeModal
          userId={userId}
          assignedPromoCodes={data.map((item) => item.promoCode.code)}
        />
      </div>
      <Table
        columns={columns}
        data={data}
        keyExtractor={(item) => item._id}
        hideSelectCol
      />
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
        onClose={() => setIsOpen({ open: false, promoCodeId: "" })}
        onConfirm={handleUnassignPromoCode}
        title="Unassign Promo Code"
        message="Are you sure you want to unassign this promo code?"
      />
    </>
  );
};

export default PromoCodeTable;
