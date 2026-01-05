"use client";
import { format } from "date-fns";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Menu } from "@/components/atoms/Menu";
import Pagination from "@/components/atoms/Pagination";
import Table, { TableColumn } from "@/components/atoms/Table";
import { Invoice, SORT_DIRECTION } from "@/shared/types";

import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

const InvoiceTable = ({
  data,
}: {
  data: { data: Invoice[]; count: number };
}) => {
  const columns: TableColumn<Invoice>[] = [
    {
      title: "#",
      field: (row) => `#${row.invoiceNumber}`,
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Total",
      field: (row) => `$${row.invoiceAmount}`,
    },
    {
      title: "Issued Date",
      field: (row) => `${format(row.dateIssued, "dd/mm/yyyy")}`,
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
          <Eye className="text-gray-500 cursor-pointer" />
          <Menu
            items={[
              { label: "Download", onClick: () => {} },
              { label: "Edit", onClick: () => {} },
              { label: "Duplicate", onClick: () => {} },
            ]}
            menuButton={<EllipsisVertical />}
          />
        </div>
      ),
    },
  ];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modal, setModal] = useState<{ open: boolean; data?: Invoice }>({
    open: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Invoices</h2>
      </div>
      <Table<Invoice>
        columns={columns}
        data={data?.data || []}
        keyExtractor={(item) => item._id}
        handleSort={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        hideSelectCol
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
        title="Invoice"
      />
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() =>
          void (async () => {
            //   await suspendUserAction({
            //     userId: userData?._id,
            //     isSuspended: !userData?.isSuspended,
            //   });
            //   setIsSuspendOpen(false);
            router.refresh();
            setModal({ open: false });
          })()
        }
        title={"Delete Invoice"}
        message={"Are you sure you want to delete this invoice?"}
      />
    </div>
  );
};

export default InvoiceTable;
