"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { uploadSlideImage } from "@/api/bonusSlides";
import { toast } from "react-toastify";
import { BASE_URL } from "@/shared/constants";

// Upload file type constant (matches backend)
const UPLOAD_FILE_TYPE = {
  BONUS_BACKGROUND_IMAGE: 1,
  ROOM_LOGO: 2,
};

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

const ImageUpload = ({
  label,
  value,
  onChange,
  required = false,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", String(UPLOAD_FILE_TYPE.BONUS_BACKGROUND_IMAGE));

      const result = await uploadSlideImage(formData);
      console.log("Upload result:", result); // Debug log
      if (result.status && result.data?.filePath) {
        console.log("FilePath received:", result.data.filePath); // Debug log
        // Update preview with the actual uploaded path
        setPreview(result.data.filePath);
        onChange(result.data.filePath);
        toast.success("Image uploaded successfully");
        // Revoke blob URL to free memory
        URL.revokeObjectURL(blobUrl);
      } else {
        toast.error(result.message || "Failed to upload image");
        setPreview(value || "");
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      toast.error("Error uploading image");
      setPreview(value || "");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  const getImageSrc = () => {
    if (!preview) return "";
    // If it's a blob URL (local preview), use directly
    if (preview.startsWith("blob:")) return preview;
    // If it's already a full URL
    if (preview.startsWith("http")) return preview;
    // Otherwise, prepend BASE_URL (remove trailing slash if present)
    const baseUrl = BASE_URL?.replace(/\/$/, "") || "";
    return `${baseUrl}/${preview}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!preview ? (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center rounded-md">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative inline-block">
          <div className="relative w-32 h-24 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={getImageSrc()}
              alt={label}
              fill
              className="object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition text-sm shadow disabled:opacity-50"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
