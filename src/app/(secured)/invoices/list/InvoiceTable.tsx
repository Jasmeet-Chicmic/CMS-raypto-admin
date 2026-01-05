"use client";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { deleteInvoiceAction } from "@/api/invoices";
import { Menu } from "@/components/atoms/Menu";
import Pagination from "@/components/atoms/Pagination";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { INVOICE_STATUS, INVOICE_STATUS_NAMES } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { Invoice, SORT_DIRECTION } from "@/shared/types";
import { cn, formatDate, formatNumberValue } from "@/shared/utils";

const InvoiceTable = ({
  data,
}: {
  data: { data: { data: Invoice[]; count: number } };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [modal, setModal] = useState<{ open: boolean; data?: Invoice }>({
    open: false,
  });
  const columns: TableColumn<Invoice>[] = [
    {
      field: "invoiceNumber",
      title: "Invoice No.",
      render: (data) => (data._id ? `#${data.invoiceNumber}` : ""),
    },
    {
      field: "dateIssued",
      title: "Issued on",
      render: (data) => (data.dateIssued ? formatDate(data.dateIssued) : "N/A"),
    },
    {
      field: "user",
      title: "Client Name",
      render: (data) => (
        <div>
          {data?.user?.firstName} {data?.user?.lastName}
        </div>
      ),
    },
    {
      field: "invoiceAmount",
      title: "Invoice Amount",
      render: (data) =>
        data.invoiceAmount
          ? `$${formatNumberValue(data.invoiceAmount)}`
          : "N/A",
    },
    {
      field: "dateDue",
      title: "Due by",
      render: (data) => (data.dateDue ? formatDate(data.dateDue) : "N/A"),
    },
    {
      field: "status",
      title: "Status",
      render: (data) => (
        <span
          className={cn(
            "bg-orange-100 size-fit px-2 py-1 rounded-md text-orange-600",
            data.status === INVOICE_STATUS.PAID &&
              "bg-green-100 text-green-600",
            data.status === INVOICE_STATUS.PENDING &&
              "bg-gray-200 text-gray-600",
          )}
        >
          {INVOICE_STATUS_NAMES[data.status as INVOICE_STATUS]}
        </span>
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
          <Link href={`${ROUTES.INVOICES_PREVIEW}?id=${data._id}`}>
            <Eye className="text-gray-500 cursor-pointer" />
          </Link>
          <Menu
            items={[
              {
                label: "Edit",
                onClick: () =>
                  redirect(`${ROUTES.INVOICES_EDIT}?id=${data._id}`),
              },
            ]}
            menuButton={<EllipsisVertical />}
          />
        </div>
      ),
    },
  ];
  const handleDelete = async () => {
    if (!modal.data?._id) return;
    const res = await deleteInvoiceAction({
      invoiceIds: [modal.data?._id],
    });
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setModal({ open: false });
    router.refresh();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);
  return (
    <>
      <Table<Invoice>
        data={data?.data?.data || []}
        columns={columns}
        keyExtractor={(item) => item._id}
        // isLoading={isFetching}
        handleSort={(sortKey, sortDirection) => {
          setSortKey(sortKey);
          setSortDirection(sortDirection);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={data?.data?.count || 0}
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
        onConfirm={() => void handleDelete()}
        title={"Delete Invoice"}
        message={"Are you sure you want to delete this invoice?"}
      />
    </>
  );
};

export default InvoiceTable;
