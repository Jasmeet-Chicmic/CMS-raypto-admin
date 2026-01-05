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
  EVENT_STATUS,
  EVENT_STATUS_OPTIONS,
  EVENT_TYPE,
  MODAL_CONTENT,
  PLACEHOLDERS,
  Event,
  EventAction,
  ModalState,
  EventStatusBadge,
  EventStatusFilter,
} from "../../../../events/helpers";

// Dummy data for company events (filtered by company ID)
const getCompanyEvents = (companyId: string): Event[] => {
  return [
    {
      _id: "evt_001",
      title: "Tech Conference 2024",
      createdBy: {
        _id: companyId,
        name: "TechCorp Inc",
        type: 2, // COMPANY
        email: "events@techcorp.com",
        avatar:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
      },
      type: EVENT_TYPE.PAID,
      eventDate: "2024-03-15T10:00:00Z",
      status: EVENT_STATUS.APPROVED,
      trustLevel: 3,
      rsvpCount: 150,
      reports: 0,
      description:
        "Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.",
      location:
        "San Francisco Convention Center, 123 Main St, San Francisco, CA 94105",
      price: 299,
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      media: {
        banner:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop",
        ],
      },
      tags: ["Technology", "AI", "Networking"],
      category: "Technology",
      maxAttendees: 500,
      isOnline: false,
      timezone: "America/Los_Angeles",
    },
    {
      _id: "evt_002",
      title: "Free Coding Workshop",
      createdBy: {
        _id: companyId,
        name: "TechCorp Inc",
        type: 2, // COMPANY
        email: "events@techcorp.com",
        avatar:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
      },
      type: EVENT_TYPE.FREE,
      eventDate: "2024-03-20T14:00:00Z",
      status: EVENT_STATUS.PENDING_REVIEW,
      trustLevel: 2,
      rsvpCount: 45,
      reports: 0,
      description:
        "Learn React basics in this hands-on workshop. Perfect for beginners looking to start their web development journey.",
      location: "Online",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
      media: {
        banner:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop",
      },
      tags: ["Programming", "React", "Workshop"],
      category: "Education",
      maxAttendees: 100,
      isOnline: true,
      meetingUrl: "https://zoom.us/j/123456789",
      timezone: "UTC",
    },
    {
      _id: "evt_003",
      title: "Design Meetup",
      createdBy: {
        _id: companyId,
        name: "TechCorp Inc",
        type: 2, // COMPANY
        email: "events@techcorp.com",
        avatar:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
      },
      type: EVENT_TYPE.PAID,
      eventDate: "2024-04-01T16:00:00Z",
      status: EVENT_STATUS.FLAGGED,
      trustLevel: 2,
      rsvpCount: 89,
      reports: 2,
      description: "UI/UX design networking event for professionals",
      location: "New York, NY",
      price: 50,
      createdAt: "2024-01-30T09:00:00Z",
      updatedAt: "2024-01-30T09:00:00Z",
      media: {
        banner:
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop",
      },
      tags: ["Design", "UI/UX", "Networking"],
      category: "Design",
      maxAttendees: 200,
      isOnline: false,
      timezone: "America/New_York",
    },
    {
      _id: "evt_004",
      title: "Rejected Event",
      createdBy: {
        _id: companyId,
        name: "TechCorp Inc",
        type: 2, // COMPANY
        email: "events@techcorp.com",
        avatar:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
      },
      type: EVENT_TYPE.FREE,
      eventDate: "2024-04-05T20:00:00Z",
      status: EVENT_STATUS.REJECTED,
      trustLevel: 2,
      rsvpCount: 0,
      reports: 1,
      description: "Inappropriate content",
      location: "Online",
      createdAt: "2024-02-01T15:00:00Z",
      updatedAt: "2024-02-01T16:30:00Z",
      isOnline: true,
      timezone: "UTC",
    },
  ];
};

interface CompanyEventsListProps {
  companyId: string;
}

const CompanyEventsList = ({ companyId }: CompanyEventsListProps) => {
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
      field: "status",
      title: "Event Status",
      render: (data) => <EventStatusBadge status={data.status} />,
      sortable: true,
      sortKey: "status",
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
      field: "createdAt",
      title: "Created Date",
      render: (data) => (
        <span className="text-sm">
          {new Date(data.createdAt).toLocaleDateString()}{" "}
          {new Date(data.createdAt).toLocaleTimeString()}
        </span>
      ),
      sortable: true,
      sortKey: "createdAt",
    },
    {
      field: "rsvpCount",
      title: "RSVP Count",
      render: (data) => <span className="font-medium">{data.rsvpCount}</span>,
      sortable: true,
      sortKey: "rsvpCount",
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
                label: "Approve",
                onClick: () => handleAction("approve", data),
                disabled:
                  data.status !== EVENT_STATUS.PENDING_REVIEW &&
                  data.status !== EVENT_STATUS.FLAGGED,
              },
              {
                label: "Reject",
                onClick: () => handleAction("reject", data),
                disabled:
                  data.status !== EVENT_STATUS.PENDING_REVIEW &&
                  data.status !== EVENT_STATUS.FLAGGED,
              },
              {
                label: "Feature",
                onClick: () => handleAction("feature", data),
                disabled: data.status !== EVENT_STATUS.APPROVED,
              },
              {
                label: "Delete",
                onClick: () => handleAction("delete", data),
              },
              {
                label: "Mark as Spam",
                onClick: () => handleAction("spam", data),
              },
              {
                label: "Restore",
                onClick: () => handleAction("restore", data),
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

  // Get company events
  const companyEvents = getCompanyEvents(companyId);

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

  const handleAction = (action: EventAction, event: Event) => {
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
              {/* <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus size={18} />
                <span>Create Event</span>
              </button> */}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Table<Event>
        data={companyEvents}
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
        totalItems={companyEvents.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="company events"
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

export default CompanyEventsList;
