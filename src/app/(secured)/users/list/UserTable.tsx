"use client";

import {
  Copy,
  Eye,
  LogOut,
  ChevronDown,
  BadgeCheck,
  Menu,
  RotateCcw,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";

import {
  deleteUserAction,
  blockUserAction,
  suspendUserAction,
  logoutUserAction,
} from "@/api/user";

import SearchToolbar from "@/components/atoms/SearchToolbar";
import { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import CustomMenu from "@/components/atoms/Menu/Menu";
import Select from "@/components/atoms/Select";
import FilterSidebar from "@/components/molecules/FilterSidebar";

import { ResponseType, User } from "@/shared/types";
import {
  USER_BLOCK_STATUS,
  CURRENCY_TYPE,
  CURRENCY_TYPE_NAMES,
} from "@/shared/constants";
import { MESSAGES, STRING } from "@/shared/strings";
import { MODAL_TYPE } from "@/components/molecules/ConfirmationModal/helpers/constants";
import {
  formatDate,
  walletTruncate,
  formatCurrency,
  createSortableColumn,
} from "@/shared/utils";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";

import {
  TEXT_SECONDARY,
  TEXT_PRIMARY_DARK as TEXT_PRIMARY,
  TEXT_SIZE_SM,
  TEXT_SIZE_XS,
  TEXT_GRAY_WHITE,
} from "@/shared/styles";

const CURRENCY_OPTIONS = Object.entries(CURRENCY_TYPE)
  .filter((entry): entry is [string, number] => typeof entry[1] === "number")
  .map(([key, value]) => ({
    label: CURRENCY_TYPE_NAMES[value] || key,
    value: value,
  }));

const USER_STATUS_FILTER_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Blocked", value: "blocked" },
  { label: "Suspicious", value: "suspicious" },
];

const UserTable = ({
  data,
  searchString,
}: {
  data: ResponseType & { data: { data: User[]; count: number } };
  searchString: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modal, setModal] = useState<{
    open: boolean;
    data?: User;
    type?: MODAL_TYPE;
  }>({
    open: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleDelete = async () => {
    if (!modal.data?._id) return;
    const res = await deleteUserAction({
      userIds: [modal.data?._id],
    });
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setModal({ open: false });
  };

  const handleSuspend = async () => {
    if (!modal.data?._id) return;
    const res = await suspendUserAction({
      userId: modal.data?._id,
      isSuspended: !modal.data.isSuspended,
    });
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setModal({ open: false });
  };

  const handleBlockToggle = async () => {
    if (!modal.data?._id) return;
    const isBlocked = modal.data.status === USER_BLOCK_STATUS.INACTIVE;
    const newStatus = isBlocked
      ? USER_BLOCK_STATUS.ACTIVE
      : USER_BLOCK_STATUS.INACTIVE;

    const res = await blockUserAction({
      userId: modal.data._id,
      status: newStatus,
    });
    if (res.status) {
      toast.success(
        res.message ||
          (isBlocked
            ? "User unblocked successfully"
            : "User blocked successfully"),
      );
    } else {
      toast.error(res.message || "Failed to update user status");
    }
    router.refresh();
    setModal({ open: false });
  };

  const handleStatusChange = async (userId: string, newStatus: number) => {
    const res = await blockUserAction({
      userId,
      status: newStatus,
    });
    if (res.status) {
      toast.success(
        res.message ||
          (newStatus === USER_BLOCK_STATUS.ACTIVE
            ? "User activated successfully"
            : "User deactivated successfully"),
      );
    } else {
      toast.error(res.message || "Failed to update user status");
    }
    router.refresh();
  };

  const handleLogout = async () => {
    if (!modal.data?._id) return;
    setIsActionLoading(true);
    try {
      const res = await logoutUserAction({
        userId: modal.data._id,
      });
      if (res.status) {
        toast.success(res.message || "User logged out successfully");
      } else {
        toast.error(res.message || "Failed to logout user");
      }
      router.refresh();
      setModal({ open: false });
    } catch (error) {
      console.error("User logout error:", error);
      toast.error("An error occurred while logging out the user.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns: TableColumn<User>[] = [
    createSortableColumn("wallet", "Wallet", (data) => {
      if (!data?.wallet) return "";
      return walletTruncate(data?.wallet);
    }),
    createSortableColumn("name", "Name", (data) => (
      <span className={TEXT_GRAY_WHITE}>
        {`${data?.name ?? ""} ${data?.lastName ?? ""}`}
      </span>
    )),
    {
      field: "email",
      title: "Email",
      render: (data) => {
        const email = data?.email;
        if (!email) return <span>-</span>;
        const truncatedEmail =
          email.length > 20 ? `${email.slice(0, 20)}...` : email;
        return (
          <div
            className={`flex items-center gap-1.5 !${TEXT_SIZE_SM} ${TEXT_PRIMARY}`}
          >
            <div className="flex items-center gap-1">
              {data?.isEmailVerified && (
                <span title="Verified" className="flex items-center">
                  <BadgeCheck
                    size={16}
                    className="text-green-500 fill-blue-50 dark:fill-blue-900/30"
                  />
                </span>
              )}
              <span title={email}>{truncatedEmail}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(email);
                toast.success("Email copied to clipboard");
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Copy email"
            >
              <Copy size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        );
      },
      sortable: false,
      sortKey: "email",
    },
    {
      field: "phoneNumber",
      title: "Phone Number",
      render: (data) => `${data?.phoneNumber ?? "-"}`,
      sortable: false,
      sortKey: "phoneNumber",
    },
    createSortableColumn("betAmount", "Total Bet", (data) => {
      const currencyParam = searchParams.get("currency");
      const currency = currencyParam ? Number(currencyParam) : 1;
      return data?.betAmount ? (
        <div className="flex items-center gap-1">
          <span className="font-medium">{formatCurrency(data.betAmount)}</span>
          <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>
            {CURRENCY_TYPE_NAMES[currency] || ""}
          </span>
        </div>
      ) : (
        "-"
      );
    }),
    {
      field: "profit",
      title: "Profit",
      render: (data) => {
        const currencyParam = searchParams.get("currency");
        const currency = currencyParam ? Number(currencyParam) : 1;
        return data?.profit ? (
          <div className="flex items-center gap-1">
            <span className="font-medium">{formatCurrency(data.profit)}</span>
            <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>
              {CURRENCY_TYPE_NAMES[currency] || ""}
            </span>
          </div>
        ) : (
          "-"
        );
      },
      sortable: false,
      sortKey: "profit",
    },
    createSortableColumn("rtp", "RTP", (data) => {
      const currencyParam = searchParams.get("currency");
      const currency = currencyParam ? Number(currencyParam) : 1;
      return data?.rtp ? (
        <div className="flex items-center gap-1">
          <span className="font-medium">{data.rtp.toFixed(2)}</span>
          <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>
            {CURRENCY_TYPE_NAMES[currency] || ""}
          </span>
        </div>
      ) : (
        "-"
      );
    }),
    createSortableColumn("createdAt", "Joined At", (item) => (
      <span className={`${TEXT_SIZE_SM} ${TEXT_PRIMARY}`}>
        {formatDate(item.createdAt)}
      </span>
    )),

    {
      field: "status",
      title: "Status",
      render: (item) => (
        <CustomMenu
          menuButton={
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${TEXT_SIZE_SM} font-bold transition-all duration-200 border cursor-pointer ${
                item.status === USER_BLOCK_STATUS.ACTIVE
                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  item.status === USER_BLOCK_STATUS.ACTIVE
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              {item.status === USER_BLOCK_STATUS.ACTIVE ? "Active" : "Inactive"}
              <ChevronDown size={14} className="opacity-60" />
            </div>
          }
          items={[
            {
              label: (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-medium">Active</span>
                </div>
              ),
              onClick: () =>
                void handleStatusChange(item._id, USER_BLOCK_STATUS.ACTIVE),
              disabled: item.status === USER_BLOCK_STATUS.ACTIVE,
            },
            {
              label: (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-medium">Inactive</span>
                </div>
              ),
              onClick: () =>
                void handleStatusChange(item._id, USER_BLOCK_STATUS.INACTIVE),
              disabled: item.status === USER_BLOCK_STATUS.INACTIVE,
            },
          ]}
        />
      ),
      sortable: false,
      sortKey: "status",
    },
    {
      field: "",
      title: "Actions",
      render: (data) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              router.push(`/users/view/${data._id}/transaction`, {
                scroll: false,
              });
            }}
            className="text-gray-500 hover:text-blue-600 transition-colors dark:text-white"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() =>
              setModal({ open: true, data: data, type: MODAL_TYPE.LOGOUT })
            }
            className="text-gray-500 hover:text-red-600 transition-colors dark:text-red-600"
            title="Logout User"
          >
            <LogOut size={18} />
          </button>
        </div>
      ),
      fixed: "right",
    },
  ];

  const getModalConfig = () => {
    const { type, data } = modal;

    switch (type) {
      case MODAL_TYPE.DELETE:
        return {
          onConfirm: handleDelete,
          title: STRING.DELETE_USER,
          message: MESSAGES.DELETE_CONFIRMATION,
        };
      case MODAL_TYPE.BLOCK_TOGGLE:
        return {
          onConfirm: handleBlockToggle,
          title:
            data?.status === USER_BLOCK_STATUS.INACTIVE
              ? STRING.UNBLOCK_USER
              : STRING.BLOCK_USER,
          message:
            data?.status === USER_BLOCK_STATUS.INACTIVE
              ? MESSAGES.UNBLOCK_CONFIRMATION
              : MESSAGES.BLOCK_CONFIRMATION,
        };
      case MODAL_TYPE.LOGOUT:
        return {
          onConfirm: handleLogout,
          title: STRING.LOGOUT_USER,
          message: MESSAGES.LOGOUT_CONFIRMATION,
        };
      default:
        return {
          onConfirm: handleSuspend,
          title: STRING.SUSPEND_USER,
          message: MESSAGES.SUSPEND_CONFIRMATION,
        };
    }
  };

  const modalConfig = getModalConfig();

  const config: DataTableConfig<User> = useMemo(
    () => ({
      columns,
      keyExtractor: (item) => item._id || "",
      paginationTitle: "users",
      rowClassName: (item) =>
        item.isSuspicious ? "border border-red-500" : "",
      queryConfig: {
        defaultSortKey: "createdAt",
        defaultSortDirection: -1,
      },
      header: (
        <>
          <div className="bg-white px-6 pt-7 pb-3 rounded-[20px_20px_0_0] dark:bg-gray-900 dark:border-gray-800">
            <div className="dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className={`text-[1.5rem] font-bold ${TEXT_PRIMARY}`}>
                    Users
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <SearchToolbar
                    initialQuery={searchString}
                    placeholder="Search User"
                  />
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-[8px] hover:bg-[#3311DD] transition-all duration-200 focus:outline-none focus:ring-0 font-medium"
                  >
                    <Menu size={18} />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            title="User Filters"
            footer={
              <button
                onClick={() => {
                  router.push(pathname);
                  setIsFilterOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 font-medium"
              >
                <RotateCcw size={18} />
                <span>Clear All Filters</span>
              </button>
            }
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="user-status-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  User Status
                </label>
                {(() => {
                  let userStatusValue: { label: string; value: string } | null =
                    null;

                  if (searchParams.get("isSuspicious") === "true") {
                    userStatusValue = {
                      label: "Suspicious",
                      value: "suspicious",
                    };
                  } else if (
                    searchParams.get("status") ===
                    USER_BLOCK_STATUS.ACTIVE.toString()
                  ) {
                    userStatusValue = { label: "Active", value: "active" };
                  } else if (
                    searchParams.get("status") ===
                    USER_BLOCK_STATUS.INACTIVE.toString()
                  ) {
                    userStatusValue = { label: "Blocked", value: "blocked" };
                  }

                  return (
                    <Select
                      inputId="user-status-filter"
                      placeholder="Select Status"
                      isClearable
                      options={USER_STATUS_FILTER_OPTIONS}
                      value={userStatusValue}
                      onChange={(option) => {
                        const newParams = new URLSearchParams(
                          searchParams.toString(),
                        );
                        newParams.delete("status");
                        newParams.delete("isSuspicious");

                        if (option?.value === "active") {
                          newParams.set(
                            "status",
                            USER_BLOCK_STATUS.ACTIVE.toString(),
                          );
                        } else if (option?.value === "blocked") {
                          newParams.set(
                            "status",
                            USER_BLOCK_STATUS.INACTIVE.toString(),
                          );
                        } else if (option?.value === "suspicious") {
                          newParams.set("isSuspicious", "true");
                        }

                        router.push(`?${newParams.toString()}`);
                      }}
                    />
                  );
                })()}
              </div>

              <div>
                <label
                  htmlFor="joined-at-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Joined At
                </label>
                <input
                  id="joined-at-filter"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-300 transition-all"
                  onChange={(e) => {
                    const val = e.target.value;
                    const newParams = new URLSearchParams(
                      searchParams.toString(),
                    );
                    if (val) {
                      newParams.set("joinedAt", val);
                    } else {
                      newParams.delete("joinedAt");
                    }
                    router.push(`?${newParams.toString()}`);
                  }}
                  value={searchParams.get("joinedAt") || ""}
                />
              </div>

              <div>
                <label
                  htmlFor="currency-filter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Currency
                </label>
                <Select
                  inputId="currency-filter"
                  placeholder="Select Currency"
                  isClearable={false}
                  options={CURRENCY_OPTIONS}
                  value={
                    CURRENCY_OPTIONS.find(
                      (opt) =>
                        opt.value.toString() ===
                        (searchParams.get("currency") || "1"),
                    ) || CURRENCY_OPTIONS[0]
                  }
                  onChange={(
                    option: { label: string; value: number } | null,
                  ) => {
                    const newParams = new URLSearchParams(
                      searchParams.toString(),
                    );
                    if (option) {
                      newParams.set("currency", option.value.toString());
                    } else {
                      newParams.delete("currency");
                    }
                    router.push(`?${newParams.toString()}`);
                  }}
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          </FilterSidebar>
        </>
      ),
      footer: (
        <ConfirmationModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false })}
          isLoading={isActionLoading}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
        />
      ),
    }),
    [
      columns,
      modalConfig,
      searchString,
      isFilterOpen,
      searchParams,
      router,
      pathname,
      modal.open,
      isActionLoading,
    ],
  );

  return (
    <DataTable
      data={data?.data?.data || []}
      totalCount={data?.data?.count ?? 0}
      config={config}
    />
  );
};

export default UserTable;
