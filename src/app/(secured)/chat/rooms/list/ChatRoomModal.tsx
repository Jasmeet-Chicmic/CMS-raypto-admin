"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import CustomModal from "@/components/molecules/CustomModal";
import { createChatRoom, updateChatRoom } from "@/api/chat";
import { uploadSlideImage } from "@/api/bonusSlides";
import { ChatRoom } from "../../helpers/types";
import { CHAT_STRINGS } from "../../helpers/constants";
import { ImageUpload, UPLOAD_FILE_TYPE } from "@/components/atoms/ImageUpload";

interface ChatRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  room?: ChatRoom;
  isEdit?: boolean;
}

const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  room,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoURL: "",
  });

  useEffect(() => {
    if (isEdit && room) {
      setFormData({
        name: room.name || "",
        logoURL: room.logoURL || "",
      });
    } else {
      setFormData({
        name: "",
        logoURL: "",
      });
    }
  }, [isEdit, room, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (url: string) => {
    // If url is a relative path (from file upload), prepend base URL
    let fullUrl = url;
    if (url && !url.startsWith("http") && !url.startsWith("blob:")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
      fullUrl = `${baseUrl}/${url}`;
    }
    setFormData((prev) => ({
      ...prev,
      logoURL: fullUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    // Logo URL is required
    if (!formData.logoURL.trim()) {
      toast.error("Room logo is required");
      return;
    }

    setIsLoading(true);
    try {
      let res;
      if (isEdit && room) {
        res = await updateChatRoom({
          chatRoomId: room._id,
          name: formData.name.trim(),
          logoURL: formData.logoURL.trim(),
        });
      } else {
        res = await createChatRoom({
          name: formData.name.trim(),
          logoURL: formData.logoURL.trim(),
        });
      }

      if (res.status) {
        toast.success(
          res.message ||
            (isEdit
              ? "Chat room updated successfully"
              : "Chat room created successfully"),
        );
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? CHAT_STRINGS.EDIT_ROOM : CHAT_STRINGS.CREATE_ROOM}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {CHAT_STRINGS.ROOM_NAME} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={CHAT_STRINGS.ENTER_ROOM_NAME}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <ImageUpload
            label={CHAT_STRINGS.ROOM_LOGO}
            value={formData.logoURL}
            onChange={handleLogoChange}
            required
            uploadFunction={uploadSlideImage}
            fileType={UPLOAD_FILE_TYPE.ROOM_LOGO}
            aspectRatio="16/9"
            placeholder="Click or drag to upload room logo"
            maxSize={2}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ChatRoomModal;
