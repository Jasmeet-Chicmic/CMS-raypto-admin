"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, Trash2, Pencil, X, Check } from "lucide-react";
import Link from "next/link";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

import Pagination from "@/components/atoms/Pagination";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { ResponseType, SORT_DIRECTION } from "@/shared/types";
import { deleteChatMessages, updateChatMessage } from "@/api/chat";
import { ChatMessage } from "../../helpers/types";
import { CHAT_STRINGS } from "../../helpers/constants";
import { ROUTES } from "@/shared/routes";

interface ChatMessagesViewProps {
  messagesData: ResponseType & {
    data: { data: ChatMessage[]; count: number };
  };
  chatroomId: string;
  chatRoomName: string;
}

// Helper function to get initials from name
const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

// Helper function to highlight wallet addresses and mentions
const highlightText = (text: string): React.ReactNode => {
  // Pattern for wallet addresses (0x followed by hex characters)
  const walletPattern = /(0x[a-fA-F0-9]{40,})/g;
  // Pattern for mentions (@ followed by alphanumeric)
  const mentionPattern = /(@[a-zA-Z0-9]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Find all matches
  const matches: Array<{
    start: number;
    end: number;
    type: "wallet" | "mention";
  }> = [];

  let match;
  while ((match = walletPattern.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      type: "wallet",
    });
  }

  walletPattern.lastIndex = 0; // Reset regex
  while ((match = mentionPattern.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      type: "mention",
    });
  }

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Build parts array
  matches.forEach((match) => {
    // Add text before match
    if (match.start > lastIndex) {
      parts.push(text.substring(lastIndex, match.start));
    }
    // Add highlighted match
    const matchText = text.substring(match.start, match.end);
    parts.push(
      <span
        key={key++}
        className={`font-medium ${
          match.type === "wallet" ? "text-green-400" : "text-green-300"
        }`}
      >
        {matchText}
      </span>,
    );
    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
};

// Format date for separator
const formatDateSeparator = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isToday(dateObj)) {
    return `TODAY • ${format(dateObj, "h:mm a")}`;
  }
  if (isYesterday(dateObj)) {
    return `YESTERDAY • ${format(dateObj, "h:mm a")}`;
  }
  return format(dateObj, "MMMM d • h:mm a").toUpperCase();
};

// Group messages by date
const groupMessagesByDate = (messages: ChatMessage[]) => {
  const groups: Array<{ date: Date; messages: ChatMessage[] }> = [];
  let currentGroup: { date: Date; messages: ChatMessage[] } | null = null;

  messages.forEach((message) => {
    if (!message.createdAt) return;
    const messageDate = new Date(message.createdAt);

    if (!currentGroup || !isSameDay(currentGroup.date, messageDate)) {
      currentGroup = { date: messageDate, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(message);
  });

  return groups;
};

const ChatMessagesView: React.FC<ChatMessagesViewProps> = ({
  messagesData,
  chatroomId,
  chatRoomName,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDeletingRef = useRef(false);
  const previousMessagesCountRef = useRef(0);

  const [sortKey] = useState("");
  const [sortDirection] = useState<SORT_DIRECTION>(-1);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const [editingMessage, setEditingMessage] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    messageId?: string;
  }>({
    open: false,
  });

  const messages = useMemo(
    () => messagesData?.data?.data || [],
    [messagesData?.data?.data],
  );
  const groupedMessages = groupMessagesByDate(messages);

  // Scroll to bottom only when new messages are added, not when deleted
  useEffect(() => {
    const currentMessagesCount = messages.length;
    const previousMessagesCount = previousMessagesCountRef.current;

    // Only scroll if:
    // 1. Initial load (previous count is 0 and current > 0)
    // 2. New messages added (current count > previous count)
    // Don't scroll if messages were deleted
    if (
      !isDeletingRef.current &&
      (previousMessagesCount === 0 ||
        currentMessagesCount > previousMessagesCount)
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Reset delete flag after messages update
    if (isDeletingRef.current) {
      isDeletingRef.current = false;
    }

    // Update previous count
    previousMessagesCountRef.current = currentMessagesCount;
  }, [messages.length]);

  const handleEditSave = async () => {
    if (!editingMessage) return;

    if (!editingMessage.message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateChatMessage({
        chatMessageId: editingMessage.id,
        message: editingMessage.message.trim(),
      });

      if (res.status) {
        toast.success(res.message || "Message updated successfully");
        setEditingMessage(null);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update message");
      }
    } catch {
      toast.error("An error occurred while updating the message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.messageId) return;

    setIsLoading(true);
    // Set flag to prevent scrolling after delete
    isDeletingRef.current = true;
    try {
      const res = await deleteChatMessages({
        chatMessageIds: [deleteModal.messageId],
      });
      if (res.status) {
        toast.success(res.message || "Message deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete message");
      }
      router.refresh();
    } catch {
      toast.error("An error occurred while deleting the message");
    } finally {
      setIsLoading(false);
      setDeleteModal({ open: false });
    }
  };

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip");
    }

    if (pageSize !== 50) {
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
  }, [
    currentPage,
    pageSize,
    sortKey,
    sortDirection,
    searchParams,
    router,
    chatroomId,
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href={ROUTES.CHAT_ROOMS_LIST}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-300" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                {chatRoomName || "Chat Room"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-green-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-green-600">
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">{CHAT_STRINGS.NO_MESSAGES}</p>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              {/* Date Separator */}
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="px-4 text-[0.875] text-gray-400 font-medium">
                  {formatDateSeparator(group.date)}
                </span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              {/* Messages */}
              {group.messages.map((message) => (
                <button
                  type="button"
                  key={message._id}
                  className="flex items-start space-x-3 group w-full text-left"
                  onMouseEnter={() => setHoveredMessageId(message._id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                  tabIndex={0}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(message.senderName)}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-semibold text-sm">
                        {message.senderName || "Unknown"}:
                      </span>
                      {hoveredMessageId === message._id && (
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setEditingMessage({
                                id: message._id,
                                message: message.message,
                              })
                            }
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} className="text-gray-400" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                messageId: message._id,
                              })
                            }
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Message Bubble */}
                    {editingMessage?.id === message._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingMessage.message}
                          onChange={(e) =>
                            setEditingMessage({
                              ...editingMessage,
                              message: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEditSave();
                            } else if (e.key === "Escape") {
                              setEditingMessage(null);
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          autoFocus
                        />
                        <button
                          onClick={handleEditSave}
                          className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || !editingMessage.message.trim()}
                          title="Save"
                        >
                          <Check size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => setEditingMessage(null)}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X size={16} className="text-gray-300" />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
                        <p className="text-gray-100 text-sm break-words">
                          {highlightText(message.message)}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pagination */}
      {messagesData?.data?.count > pageSize && (
        <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 px-4 py-3">
          <Pagination
            totalItems={messagesData?.data?.count || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page + 1)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            title="Messages"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        onConfirm={() => void handleDelete()}
        title="Delete Message"
        message={CHAT_STRINGS.DELETE_MESSAGE_CONFIRMATION}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatMessagesView;
