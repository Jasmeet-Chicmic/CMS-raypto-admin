"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { RefreshCw, Info, X } from "lucide-react";
import { format } from "date-fns";

import Select from "@/components/atoms/Select";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import {
  deleteChatMessages,
  updateChatMessage,
  getChatMessages,
} from "@/api/chat";
import { ChatMessage, ChatRoom } from "../helpers/types";
import { CHAT_STRINGS } from "../helpers/constants";
import AdminChatMessage from "./AdminChatMessage";

interface LiveChatViewProps {
  chatRooms: ChatRoom[];
  initialMessages: ChatMessage[];
  initialRoom?: ChatRoom;
  initialCount: number;
}

const CHAT_RULES = [
  "Don't spam or use excessive capital letters when chatting.",
  "Don't harass or be offensive to other users or staff.",
  "Don't share personal information (including socials) of you or other players.",
  "Don't beg or ask for loans, rains, or tips.",
  "Don't use alternative accounts on chat. This is forbidden.",
  "No suspicious behavior that can be seen as potential scams.",
  "Don't engage in advertising, trading, selling, buying, or offering services.",
  "No discussion of streamers, Twitch, or any other similar platforms.",
  "Don't use URL shortening services. Always submit the full link.",
  "Don't share codes, scripts, or any other bot service.",
  "Only use the language specified in the chat channel.",
  "No politics or religion talk in chat. This is strictly forbidden.",
];

const LiveChatView: React.FC<LiveChatViewProps> = ({
  chatRooms,
  initialMessages,
  initialRoom,
  initialCount,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | undefined>(
    initialRoom,
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    messageId?: string;
  }>({ open: false });

  const roomOptions = chatRooms.map((room) => ({
    label: room.name,
    value: room._id,
    logoURL: room.logoURL,
  }));

  // Reverse messages so newer ones are at bottom
  const sortedMessages = [...messages].reverse();

  // Scroll to bottom on initial load and when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (roomId: string) => {
    setIsRefreshing(true);
    try {
      const res = await getChatMessages({ chatroomId: roomId, limit: 50 });
      if (res.status) {
        setMessages(res.data?.data || []);
        setTotalCount(res.data?.count || 0);
      } else {
        toast.error(res.message || "Failed to fetch messages");
      }
    } catch {
      toast.error("An error occurred while fetching messages");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRoomChange = async (
    option: { value: string; label: string } | null,
  ) => {
    if (option) {
      const room = chatRooms.find((r) => r._id === option.value);
      if (room) {
        setSelectedRoom(room);
        await fetchMessages(room._id);
      }
    }
  };

  const handleRefresh = () => {
    if (selectedRoom) {
      fetchMessages(selectedRoom._id);
    }
  };

  const handleStartEdit = (messageId: string) => {
    setEditingMessageId(messageId);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleEditMessage = async (messageId: string, newMessage: string) => {
    setIsLoading(true);
    try {
      const res = await updateChatMessage({
        chatMessageId: messageId,
        message: newMessage,
      });
      if (res.status) {
        toast.success(res.message || "Message updated successfully");
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, message: newMessage } : msg,
          ),
        );
      } else {
        toast.error(res.message || "Failed to update message");
      }
    } catch {
      toast.error("An error occurred while updating the message");
    } finally {
      setIsLoading(false);
      setEditingMessageId(null);
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteModal.messageId) return;

    setIsLoading(true);
    try {
      const res = await deleteChatMessages({
        chatMessageIds: [deleteModal.messageId],
      });
      if (res.status) {
        toast.success(res.message || "Message deleted successfully");
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== deleteModal.messageId),
        );
        setTotalCount((prev) => prev - 1);
      } else {
        toast.error(res.message || "Failed to delete message");
      }
    } catch {
      toast.error("An error occurred while deleting the message");
    } finally {
      setIsLoading(false);
      setDeleteModal({ open: false });
    }
  };

  const formatOptionLabel = (option: {
    label: string;
    value: string;
    logoURL?: string;
  }) => (
    <div className="flex items-center gap-2">
      {option.logoURL && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={option.logoURL}
          alt={option.label}
          className="w-5 h-5 rounded-full object-cover bg-black"
        />
      )}
      <span className="font-semibold">{option.label}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-[20px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        {/* Header - Room Selector */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xl font-bold text-[#1B2559] dark:text-white hidden sm:block">
                Live Chat
              </h2>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
              <Select
                options={roomOptions}
                value={
                  selectedRoom
                    ? {
                        label: selectedRoom.name,
                        value: selectedRoom._id,
                        logoURL: selectedRoom.logoURL,
                      }
                    : null
                }
                onChange={handleRoomChange}
                placeholder="Select a room..."
                className="min-w-[180px]"
                formatOptionLabel={formatOptionLabel}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-row items-center mr-2">
                <span className="text-[0.875rem] font-medium text-[#121213] dark:text-gray-400">
                  Messages
                </span>
                <span className="ml-2 px-2 py-1 text-[0.875] font-bold rounded-full bg-red-500 text-white">
                  {totalCount.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                className={`p-2.5 rounded-xl bg-[#F4F7FE] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#4F46E5] dark:text-[#4F46E5] transition-all ${isRefreshing ? "animate-spin" : ""}`}
                disabled={isRefreshing}
                title="Refresh messages"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={() => setIsRulesModalOpen(true)}
                className="p-2.5 rounded-xl bg-[#F4F7FE] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#4F46E5] dark:text-[#4F46E5] transition-all"
                title="Chat Rules"
              >
                <Info size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Date/Time Sub-header */}
        <div className="flex items-center justify-between px-6 py-2 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[12px] font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-wider">
              {format(new Date(), "MMMM yyyy")}
            </span>
          </div>
          <span className="text-[12px] font-medium text-[#A3AED0] dark:text-gray-400">
            {format(new Date(), "EEEE, h:mm a")}
          </span>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6 bg-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500 transition-colors"
        >
          {isRefreshing ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                Loading messages...
              </div>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Info size={32} className="text-gray-400" />
              </div>
              <p className="text-[#1B2559] dark:text-white font-bold text-lg mb-1">
                No Messages Yet
              </p>
              <p className="text-[#A3AED0] dark:text-gray-400 max-w-[250px]">
                {CHAT_STRINGS.NO_MESSAGES}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message) => (
                <AdminChatMessage
                  key={message._id}
                  message={message}
                  isEditing={editingMessageId === message._id}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={(id) =>
                    setDeleteModal({ open: true, messageId: id })
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        onConfirm={() => void handleDeleteMessage()}
        title="Delete Message"
        message={CHAT_STRINGS.DELETE_MESSAGE_CONFIRMATION}
        isLoading={isLoading}
      />

      {/* Chat Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 bg-[#1B2559]/30 backdrop-blur-sm flex items-center justify-center z-[100] transition-all">
          <div className="bg-white dark:bg-gray-900 rounded-[24px] max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <span className="text-xl">📜</span>
                </div>
                <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                  Chat Rules
                </h2>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-3">
                {CHAT_RULES.map((rule, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-indigo-500/20 transition-all hover:bg-white dark:hover:bg-gray-800 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-[12px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 text-center">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#4F46E5] text-white font-bold hover:bg-[#3311DB] transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChatView;
