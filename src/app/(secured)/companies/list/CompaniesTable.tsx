"use client";

import { Plus, EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { deleteCompanyAction, getCompaniesAction } from "@/api/companies";
import Button from "@/components/atoms/Button";
import { Menu } from "@/components/atoms/Menu";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import SelectFilter from "@/components/atoms/SelectFilter";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import {
  ENTITY_STATUS_LABELS,
  INDUSTRY_SECTOR_NAMES,
  INDUSTRY_SECTORS,
} from "@/shared/constants";
import { Company, ResponseType, SORT_DIRECTION } from "@/shared/types";

import { SECTOR_TYPE_OPTIONS } from "../../users/helpers/constant";
import AddCompanyModal from "./AddCompanyModal";
import {
  CompanyTableData,
  transformCompanyData,
  formatDate,
} from "../helpers/transformers";
import { getStatusColor } from "@/shared/utils";

enum MODAL_TYPE {
  DELETE = 1,
  SUSPEND = 2,
}

const CompaniesTable = ({
  data,
  searchString,
}: {
  data: ResponseType & { data: { companies: Company[]; count: number } };
  searchString: string;
}) => {
  const router = useRouter();

  // Transform the API data to include all required columns
  const transformedData = transformCompanyData(data?.data?.companies || []);

  const columns: TableColumn<CompanyTableData>[] = [
    {
      field: "companyName",
      title: "Company Name",
      render: (data) => (
        <Link
          href={`/companies/view/${data._id}/profile`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {data?.companyName}
        </Link>
      ),
      sortable: true,
      sortKey: "name",
    },
    {
      field: "sector",
      title: "Industry",
      render: (data) =>
        data?.sector ? INDUSTRY_SECTOR_NAMES[data.sector] : "",
    },
    {
      field: "createdBy",
      title: "Created By",
      render: (data) => data?.createdBy || "N/A",
    },
    {
      field: "createdAt",
      title: "Created Date",
      render: (data) => (data?.createdAt ? formatDate(data.createdAt) : "N/A"),
      sortable: true,
      sortKey: "createdAt",
    },
    {
      field: "linkedUsersCount",
      title: "Linked Users",
      render: (data) => data?.linkedUsersCount || 0,
      sortable: true,
      sortKey: "linkedUsersCount",
    },
    {
      field: "status",
      title: "Status",
      render: (data) => (
        <span
          className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getStatusColor(data?.status || "")}`}
        >
          {ENTITY_STATUS_LABELS[data?.status] || "N/A"}
        </span>
      ),
      sortable: true,
      sortKey: "status",
    },
    {
      field: "flagsCount",
      title: "Flags Count",
      render: (data) => (
        <span
          className={`px-2 py-1 rounded-full text-[0.875] font-medium ${data?.flagsCount > 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600"}`}
        >
          {data?.flagsCount || 0}
        </span>
      ),
      sortable: true,
      sortKey: "flagsCount",
    },
    {
      field: "",
      title: "Actions",
      render: (data) => (
        <div className="flex items-center space-x-2">
          <Link href={`/companies/view/${data._id}/profile`}>
            <Eye
              className="text-gray-500 cursor-pointer hover:text-blue-600"
              size={16}
            />
          </Link>
          <Menu
            items={[
              {
                label: "Approve",
                onClick: () =>
                  void handleStatusAction(data._id || "", "Approved"),
              },
              {
                label: "Reject",
                onClick: () =>
                  void handleStatusAction(data._id || "", "Rejected"),
              },
              {
                label: "Flag",
                onClick: () =>
                  void handleStatusAction(data._id || "", "Flagged"),
              },
              {
                label: "Edit",
                onClick: () =>
                  void (async () => {
                    const res = await getCompaniesAction({
                      companyId: data._id,
                    });
                    setSelectedCompany(res.data.companies[0]);
                    setOpen(true);
                  })(),
              },
              {
                label: "Delete",
                onClick: () => {
                  setModal({ open: true, data: data, type: MODAL_TYPE.DELETE });
                },
              },
            ]}
            menuButton={
              <EllipsisVertical className="cursor-pointer" size={16} />
            }
          />
        </div>
      ),
    },
  ];

  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modal, setModal] = useState<{
    open: boolean;
    data?: CompanyTableData;
    type?: MODAL_TYPE;
  }>({
    open: false,
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  const handleDelete = async () => {
    if (!modal.data?._id) return;
    const res = await deleteCompanyAction({
      companyIds: [modal.data?._id],
    });
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setModal({ open: false });
  };

  const handleStatusAction = async (companyId: string, status: string) => {
    // TODO: Implement status change API call when backend is ready
    toast.info(
      `Status change to ${status} will be implemented when backend is ready`,
    );
    console.log(`Changing status for company ${companyId} to ${status}`);
  };

  return (
    <>
      <div className="bg-white rounded-t-lg shadow-sm border border-gray-200">
        {/* Table Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <SearchToolbar
                initialQuery={searchString}
                placeholder="Search Company"
              />
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Plus size={18} />
                <span>Add New Company</span>
              </Button>
            </div>
            <div className="flex justify-end items-center gap-x-3">
              <h2 className="text-lg font-semibold text-gray-900 ">Filters</h2>
              <SelectFilter<INDUSTRY_SECTORS>
                paramName="sector"
                options={SECTOR_TYPE_OPTIONS}
                placeholder="Filter by Sector"
                className="w-60"
              />
            </div>
          </div>
        </div>
      </div>
      <Table<CompanyTableData>
        data={transformedData}
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
        totalItems={data?.data?.count ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); // reset to first page
        }}
        title="Companies"
      />
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() => void handleDelete()}
        title={"Delete Company"}
        message={"Are you sure you want to delete this company?"}
      />
      <AddCompanyModal
        setOpen={setOpen}
        open={open}
        company={selectedCompany}
        setSelectedComany={setSelectedCompany}
      />
    </>
  );
};

export default CompaniesTable;
