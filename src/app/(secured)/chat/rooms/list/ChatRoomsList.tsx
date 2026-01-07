"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Plus, Trash2, Pencil, Save } from "lucide-react";

import Table, { TableColumn } from "@/components/atoms/Table";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { ResponseType, SORT_DIRECTION } from "@/shared/types";
import { deleteChatRooms, getChatRoomsList } from "@/api/chat";
import { ChatRoom, MODAL_TYPE } from "../../helpers/types";
import { CHAT_STRINGS } from "../../helpers/constants";
import ChatRoomModal from "./ChatRoomModal";
import { formatDate } from "@/shared/utils";
import {
  CHAT_TRANSLATION_LANGUAGE_OPTIONS,
  CHAT_TRANSLATION_LANGUAGE,
  CONFIG_TYPE,
} from "@/shared/constants";
import { RewardConfig, updateConfigAction } from "@/api/config";
import Switch from "@/components/atoms/Switch/Switch";
import Select from "@/components/atoms/Select";

interface ChatRoomsListProps {
  chatRoomsData: ResponseType & {
    data: { data: ChatRoom[]; count: number };
  };
  searchString: string;
  initialTranslationConfig: RewardConfig | null;
}

const ChatRoomsList: React.FC<ChatRoomsListProps> = ({
  chatRoomsData,
  searchString,
  initialTranslationConfig,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigSaving, setIsConfigSaving] = useState(false);

  const [enableChatTranslation, setEnableChatTranslation] = useState(
    initialTranslationConfig?.enableChatTranslation || false,
  );
  const [chatTranslationLanguage, setChatTranslationLanguage] = useState(
    initialTranslationConfig?.chatTranslationLanguage ||
      CHAT_TRANSLATION_LANGUAGE.ENGLISH,
  );

  const [roomsData, setRoomsData] = useState(chatRoomsData);

  // Sync with props when they change (e.g. via URL params)
  useEffect(() => {
    setRoomsData(chatRoomsData);
  }, [chatRoomsData]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getChatRoomsList({
        searchString,
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sortKey,
        sortDirection,
      });
      if (res.status) {
        setRoomsData(res);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [modal, setModal] = useState<{
    open: boolean;
    type?: MODAL_TYPE;
    room?: ChatRoom;
  }>({
    open: false,
  });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    roomId?: string;
  }>({
    open: false,
  });

  const columns: TableColumn<ChatRoom>[] = [
    {
      field: "_id",
      title: "ID",
      render: (data) => (data?._id ? `#${data._id.slice(-6)}` : ""),
    },
    {
      field: "name",
      title: "Name",
      render: (data) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {data?.name ?? ""}
        </span>
      ),
      sortable: true,
      sortKey: "name",
    },
    {
      field: "logoURL",
      title: "Logo",
      render: (data) => {
        // Validate URL
        const isValidUrl = (url: string) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        };

        if (data?.logoURL && isValidUrl(data.logoURL)) {
          return (
            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.logoURL}
                alt={data.name || "Room logo"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `<span class="text-gray-400 text-[0.875] flex items-center justify-center w-full h-full">—</span>`;
                }}
              />
            </div>
          );
        }

        return (
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-[0.875]">—</span>
          </div>
        );
      },
    },
    {
      field: "createdAt",
      title: "Created At",
      render: (data) =>
        data?.createdAt ? formatDate(new Date(data.createdAt)) : "—",
      sortable: true,
      sortKey: "createdAt",
    },
    {
      field: "",
      title: "Actions",
      render: (data) => (
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() =>
              setModal({ open: true, type: MODAL_TYPE.EDIT, room: data })
            }
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, roomId: data._id })}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!deleteModal.roomId) return;

    setIsLoading(true);
    try {
      const res = await deleteChatRooms({
        chatRoomIds: [deleteModal.roomId],
      });
      if (res.status) {
        toast.success(res.message || "Chat room deleted successfully");
        fetchData();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete chat room");
      }
    } catch {
      toast.error("An error occurred while deleting the chat room");
    } finally {
      setIsLoading(false);
      setDeleteModal({ open: false });
    }
  };

  const handleSaveConfig = async () => {
    setIsConfigSaving(true);
    try {
      const res = await updateConfigAction({
        type: CONFIG_TYPE.CHAT_TRANSLATION,
        enableChatTranslation,
        ...(enableChatTranslation && { chatTranslationLanguage }),
      });
      if (res.status) {
        toast.success(res.message || "Translation settings updated");
        fetchData();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update settings");
      }
    } catch {
      toast.error("An error occurred while saving settings");
    } finally {
      setIsConfigSaving(false);
    }
  };

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
  }, [currentPage, pageSize, sortKey, sortDirection, searchParams, router]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-[24px] shadow-sm">
      {/* Header */}
      <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            {CHAT_STRINGS.CHAT_ROOMS}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <SearchToolbar
              initialQuery={searchString}
              placeholder={CHAT_STRINGS.SEARCH_ROOMS}
            />

            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translation:
                </span>
                <Switch
                  enabled={enableChatTranslation}
                  onToggle={() =>
                    setEnableChatTranslation(!enableChatTranslation)
                  }
                />
              </div>

              {enableChatTranslation && (
                <div className="w-40">
                  <Select
                    options={CHAT_TRANSLATION_LANGUAGE_OPTIONS}
                    value={CHAT_TRANSLATION_LANGUAGE_OPTIONS.find(
                      (opt) => opt.value === chatTranslationLanguage,
                    )}
                    onChange={(opt: { label: string; value: number } | null) =>
                      setChatTranslationLanguage(
                        opt?.value || CHAT_TRANSLATION_LANGUAGE.ENGLISH,
                      )
                    }
                    placeholder="Language"
                    className="text-sm"
                  />
                </div>
              )}

              <button
                onClick={handleSaveConfig}
                disabled={isConfigSaving}
                className="p-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                title="Save Translation Settings"
              >
                {isConfigSaving ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Save size={18} />
                )}
              </button>
            </div>

            <button
              className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setModal({ open: true, type: MODAL_TYPE.CREATE })}
            >
              <Plus size={18} />
              <span>{CHAT_STRINGS.CREATE_ROOM}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table - grows to fill available space */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <Table<ChatRoom>
            data={roomsData?.data?.data || []}
            columns={columns}
            keyExtractor={(item) => item._id || ""}
            handleSort={(sortKey, sortDirection) => {
              setSortKey(sortKey);
              setSortDirection(sortDirection);
            }}
            hideSelectCol={true}
            emptyMessage={CHAT_STRINGS.NO_ROOMS}
          />
        </div>

        {/* Pagination - pushed to bottom */}
        <div className="mt-auto flex-shrink-0">
          <Pagination
            totalItems={roomsData?.data?.count || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page + 1)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            title="Chat Rooms"
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ChatRoomModal
        isOpen={
          modal.open &&
          (modal.type === MODAL_TYPE.CREATE || modal.type === MODAL_TYPE.EDIT)
        }
        onClose={() => setModal({ open: false })}
        onSuccess={fetchData}
        room={modal.room}
        isEdit={modal.type === MODAL_TYPE.EDIT}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        onConfirm={() => void handleDelete()}
        title={CHAT_STRINGS.DELETE_ROOM}
        message={CHAT_STRINGS.DELETE_ROOM_CONFIRMATION}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatRoomsList;
