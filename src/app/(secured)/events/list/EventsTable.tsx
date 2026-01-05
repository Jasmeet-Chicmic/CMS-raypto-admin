"use client";

import { Download, EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Menu } from "@/components/atoms/Menu";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import SelectFilter from "@/components/atoms/SelectFilter";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { SORT_DIRECTION } from "@/shared/types";

import {
  ACTION_MESSAGES,
  BUTTON_TEXT,
  CREATOR_TYPE,
  CREATOR_TYPE_OPTIONS,
  DUMMY_EVENTS,
  EVENT_STATUS,
  EVENT_STATUS_OPTIONS,
  EVENT_TYPE,
  EVENT_TYPE_NAMES,
  EVENT_TYPE_OPTIONS,
  MODAL_CONTENT,
  PLACEHOLDERS,
  TRUST_LEVEL_OPTIONS,
  Event,
  ModalState,
  EventStatusBadge,
  TrustLevelBadge,
  EventStatusFilter,
  EventTypeFilter,
  CreatorTypeFilter,
  TrustLevelFilter,
} from "../helpers";
import { TABLE_ACTIONS } from "@/shared/constants";

const EventsTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const columns: TableColumn<Event>[] = [
    {
      field: "title",
      title: "Event Title",
      render: (data) => (
        <Link
          href={`/events/view/${data._id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          {data.title}
        </Link>
      ),
      sortable: true,
      sortKey: "title",
    },
    {
      field: "createdBy",
      title: "Created By",
      render: (data) => (
        <Link
          href={
            data.createdBy.type === CREATOR_TYPE.USER
              ? `/users/view/${data.createdBy._id}/account`
              : `/companies/view/${data.createdBy._id}/jobs`
          }
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {data.createdBy.name}
        </Link>
      ),
      sortable: true,
      sortKey: "createdBy",
    },
    {
      field: "type",
      title: "Type",
      render: (data) => (
        <span
          className={`px-2 py-1 rounded text-[0.875] font-medium ${
            data.type === EVENT_TYPE.FREE
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          }`}
        >
          {EVENT_TYPE_NAMES[data.type]}
        </span>
      ),
      sortable: true,
      sortKey: "type",
    },
    {
      field: "eventDate",
      title: "Event Date/Time",
      render: (data) => (
        <span className="text-sm">
          {new Date(data.eventDate).toLocaleDateString()}{" "}
          {new Date(data.eventDate).toLocaleTimeString()}
        </span>
      ),
      sortable: true,
      sortKey: "eventDate",
    },
    {
      field: "status",
      title: "Status",
      render: (data) => <EventStatusBadge status={data.status} />,
      sortable: true,
      sortKey: "status",
    },
    {
      field: "trustLevel",
      title: "Trust Level",
      render: (data) => <TrustLevelBadge level={data.trustLevel} />,
      sortable: true,
      sortKey: "trustLevel",
    },
    {
      field: "rsvpCount",
      title: "RSVP Count",
      render: (data) => <span className="font-medium">{data.rsvpCount}</span>,
      sortable: true,
      sortKey: "rsvpCount",
    },
    {
      field: "reports",
      title: "Reports",
      render: (data) => (
        <span
          className={`font-medium ${data.reports > 0 ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          {data.reports}
        </span>
      ),
      sortable: true,
      sortKey: "reports",
    },
    {
      field: "",
      title: "Actions",
      render: (data) => (
        <div className="flex items-center space-x-2">
          <Link href={`/events/view/${data._id}`}>
            <Eye
              className="text-gray-500 cursor-pointer hover:text-blue-600"
              size={16}
            />
          </Link>
          <Menu
            items={[
              {
                label: TABLE_ACTIONS.APPROVE,
                onClick: () => handleAction(TABLE_ACTIONS.APPROVE, data),
                disabled:
                  data.status !== EVENT_STATUS.PENDING_REVIEW &&
                  data.status !== EVENT_STATUS.FLAGGED,
              },
              {
                label: TABLE_ACTIONS.REJECT,
                onClick: () => handleAction(TABLE_ACTIONS.REJECT, data),
                disabled:
                  data.status !== EVENT_STATUS.PENDING_REVIEW &&
                  data.status !== EVENT_STATUS.FLAGGED,
              },
              {
                label: TABLE_ACTIONS.FEATURE,
                onClick: () => handleAction(TABLE_ACTIONS.FEATURE, data),
                disabled: data.status !== EVENT_STATUS.APPROVED,
              },
              {
                label: TABLE_ACTIONS.DELETE,
                onClick: () => handleAction(TABLE_ACTIONS.DELETE, data),
              },
              {
                label: TABLE_ACTIONS.MARK_AS_SPAM,
                onClick: () => handleAction(TABLE_ACTIONS.MARK_AS_SPAM, data),
              },
              {
                label: TABLE_ACTIONS.BAN_CREATOR,
                onClick: () => handleAction(TABLE_ACTIONS.BAN_CREATOR, data),
              },
              {
                label: TABLE_ACTIONS.RESTORE,
                onClick: () => handleAction(TABLE_ACTIONS.RESTORE, data),
                disabled:
                  data.status !== EVENT_STATUS.REJECTED &&
                  data.status !== EVENT_STATUS.DELETED,
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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [modal, setModal] = useState<ModalState>({ open: false });

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip");
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
  }, [currentPage, pageSize, sortKey, sortDirection, router, searchParams]);

  const handleAction = (action: TABLE_ACTIONS, event: Event) => {
    setModal({ open: true, data: event, action });
  };

  const handleConfirmAction = async () => {
    if (!modal.data || !modal.action) return;

    // Simulate API call
    const message =
      ACTION_MESSAGES[modal.action as keyof typeof ACTION_MESSAGES];
    toast.success(message || "Action completed");
    setModal({ open: false });
    // In real implementation, you would call the API here
    // router.refresh();
  };

  const getModalContent = () => {
    if (!modal.data || !modal.action) return { title: "", message: "" };

    const content = MODAL_CONTENT[modal.action as keyof typeof MODAL_CONTENT];
    if (!content) return { title: "", message: "" };

    return {
      title: content.title,
      message: `${content.message} "${modal.data.title}"?`,
    };
  };

  return (
    <>
      <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        {/* Table Controls */}
        <div className="p-6 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <SearchToolbar
                initialQuery={searchParams.get("searchString") || ""}
                placeholder={PLACEHOLDERS.SEARCH_EVENTS}
              />
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800">
                <Download size={18} />
                <span>{BUTTON_TEXT.EXPORT}</span>
              </button>
              {/* <Button
                variant="primary"
                type="button"
                onClick={() => toast.info(TOAST_MESSAGES.ADD_EVENT_COMING_SOON)}
              >
                <Plus size={18} />
                <span>{BUTTON_TEXT.ADD_EVENT}</span>
              </Button> */}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-400">
                {BUTTON_TEXT.FILTERS}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <SelectFilter<EventStatusFilter>
                  paramName="status"
                  options={EVENT_STATUS_OPTIONS}
                  placeholder={PLACEHOLDERS.FILTER_BY_STATUS}
                  className="w-48"
                />
                <SelectFilter<EventTypeFilter>
                  paramName="type"
                  options={EVENT_TYPE_OPTIONS}
                  placeholder={PLACEHOLDERS.FILTER_BY_TYPE}
                  className="w-40"
                />
                <SelectFilter<CreatorTypeFilter>
                  paramName="creatorType"
                  options={CREATOR_TYPE_OPTIONS}
                  placeholder={PLACEHOLDERS.FILTER_BY_CREATOR}
                  className="w-48"
                />
                <SelectFilter<TrustLevelFilter>
                  paramName="trustLevel"
                  options={TRUST_LEVEL_OPTIONS}
                  placeholder={PLACEHOLDERS.FILTER_BY_TRUST}
                  className="w-44"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Table<Event>
        data={DUMMY_EVENTS}
        columns={columns}
        keyExtractor={(item) => item._id}
        handleSort={(sortKey, sortDirection) => {
          setSortKey(sortKey);
          setSortDirection(sortDirection);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />

      <Pagination
        totalItems={DUMMY_EVENTS.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="events"
      />

      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() => void handleConfirmAction()}
        title={getModalContent().title}
        message={getModalContent().message}
      />
    </>
  );
};

export default EventsTable;
