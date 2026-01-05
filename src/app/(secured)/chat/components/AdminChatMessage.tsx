"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Check, X, Trash2 } from "lucide-react";
import { ChatMessage } from "../helpers/types";

interface AdminChatMessageProps {
  message: ChatMessage;
  isEditing: boolean;
  onStartEdit: (messageId: string) => void;
  onCancelEdit: () => void;
  onEditMessage: (messageId: string, newMessage: string) => void;
  onDeleteMessage: (messageId: string) => void;
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

// Helper function to truncate wallet address
const truncateAddress = (address?: string): string => {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get display name from message - check senderUser first, then senderName
const getDisplayName = (message: ChatMessage): string => {
  // Check senderUser object first (from frontend API structure)
  if (message.senderUser?.name) {
    return message.senderUser.name;
  }
  if (message.senderUser?.wallet) {
    return truncateAddress(message.senderUser.wallet);
  }
  // Fallback to senderName field
  if (message.senderName) {
    return message.senderName;
  }
  // Fallback to senderId
  if (message.senderId) {
    return truncateAddress(message.senderId);
  }
  return "Unknown";
};

const AdminChatMessage: React.FC<AdminChatMessageProps> = ({
  message,
  isEditing,
  onCancelEdit,
  onEditMessage,
  onDeleteMessage,
}) => {
  const [editText, setEditText] = useState(message?.message || "");
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const MAX_CHARACTERS = 200;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing, editText.length]);

  useEffect(() => {
    setEditText(message?.message || "");
  }, [message?.message]);

  const handleEditSubmit = () => {
    if (editText.trim() && editText.trim() !== message?.message) {
      onEditMessage(message._id, editText.trim());
    } else {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === "Escape") {
      onCancelEdit();
      setEditText(message?.message || "");
    }
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDeleteMessage(message._id);
  };

  const displayName = getDisplayName(message);

  const renderMessageContent = () => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-3 w-full mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= MAX_CHARACTERS) {
                setEditText(newValue);
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-indigo-500 rounded-xl text-gray-900 dark:text-white text-sm outline-none shadow-sm transition-all"
            maxLength={MAX_CHARACTERS}
            placeholder="Edit your message..."
          />
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1.5 flex items-center gap-1.5 bg-green-500 text-white rounded-lg text-[12px] font-bold hover:bg-green-600 transition-all shadow-sm active:scale-[0.98]"
              onClick={handleEditSubmit}
              title="Save Changes"
            >
              <Check size={14} strokeWidth={3} />
              <span>Save</span>
            </button>
            <button
              className="px-3 py-1.5 flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-[12px] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
              onClick={() => {
                onCancelEdit();
                setEditText(message?.message || "");
              }}
              title="Cancel Editing"
            >
              <X size={14} strokeWidth={3} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="text-[#1B2559] dark:text-gray-300 text-sm break-all leading-relaxed font-medium [&_a]:text-[#4F46E5] dark:[&_a]:text-[#4F46E5] [&_a]:font-bold [&_a]:no-underline [&_a:hover]:underline [&_.user-reference]:text-[#4F46E5] dark:[&_.user-reference]:text-indigo-400"
        dangerouslySetInnerHTML={{
          __html: message?.message || "",
        }}
      />
    );
  };

  return (
    <div className="relative border-gray-400/20 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 rounded-[16px] p-4 group hover:bg-white dark:hover:bg-gray-800 transition-all border hover:border-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* 3-dot menu at top right */}
      {!isEditing && (
        <div className="absolute top-3 right-3">
          <button
            ref={menuButtonRef}
            className="p-1.5 dark:text-[#ffffff] rounded-lg opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-[#1B2559] dark:hover:text-white transition-all shadow-sm"
            onClick={() => setShowMenu(!showMenu)}
            title="Options"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl py-1.5 min-w-[140px] z-20 shadow-xl animate-in zoom-in-95 duration-100"
            >
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2 text-red-500 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left whitespace-nowrap"
                onClick={handleDeleteClick}
              >
                <Trash2 size={14} strokeWidth={2.5} />
                <span>Delete Message</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar - Round with gradient and shadow */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#868CFF] to-[#4F46E5] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 overflow-hidden uppercase">
            {getInitials(message?.senderUser?.name || message?.senderName)}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
        </div>

        {/* Message content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[#1B2559] dark:text-white font-bold text-sm">
              {displayName}
            </span>
            <span className="text-[11px] font-medium text-[#A3AED0] dark:text-gray-500">
              {/* If message.createdAt exists, could format it here */}
            </span>
          </div>
          {renderMessageContent()}
        </div>
      </div>
    </div>
  );
};
export default AdminChatMessage;
