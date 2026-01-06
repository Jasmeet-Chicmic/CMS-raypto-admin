"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { BASE_URL } from "@/shared/constants";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

// Upload file types
export const UPLOAD_FILE_TYPE = {
  BONUS_BACKGROUND_IMAGE: 1,
  ROOM_LOGO: 2,
  DEFAULT: 1,
};

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  uploadFunction?: (formData: FormData) => Promise<{
    status: boolean;
    message?: string;
    data?: { filePath: string };
  }>;
  fileType?: number;
  accept?: string;
  maxSize?: number; // in MB
  aspectRatio?: string; // e.g., "16/9", "1/1", "4/3"
  placeholder?: string;
  className?: string;
  previewClassName?: string;
  disabled?: boolean;
  id?: string;
}

const getImageSrc = (path: string) => {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("http")) return path;
  const baseUrl = BASE_URL?.replace(/\/$/, "") || "";
  const encodedPath = encodeURI(path);
  return `${baseUrl}/${encodedPath}`;
};

const ImageUpload = ({
  label,
  value,
  onChange,
  required = false,
  uploadFunction,
  fileType = UPLOAD_FILE_TYPE.DEFAULT,
  accept = "image/*",
  maxSize = 5, // 5MB default
  aspectRatio = "16/9",
  placeholder = "Click or drag to upload",
  className = "",
  previewClassName = "",
  disabled = false,
  id,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();

  const inputId =
    id ||
    `image-upload-${label ? label.replaceAll(/\s+/g, "-").toLowerCase() : generatedId.replaceAll(":", "")}`;

  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview("");
    }
  }, [value]);

  const validateFile = (file: File): boolean => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;

    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    setIsUploading(true);

    try {
      if (uploadFunction) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", String(fileType));

        const result = await uploadFunction(formData);
        if (result.status && result.data?.filePath) {
          setPreview(result.data.filePath);
          onChange(result.data.filePath);
          toast.success("Image uploaded successfully");
          URL.revokeObjectURL(blobUrl);
        } else {
          toast.error(result.message || "Failed to upload image");
          setPreview(value || "");
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        // No upload function - just use blob URL for local preview
        onChange(blobUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image");
      setPreview(value || "");
      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input for re-upload
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={disabled || isUploading}
        aria-label={label || "Upload image"}
        className={`
          relative overflow-hidden rounded-[20px] border-2 border-dashed transition-all duration-300 cursor-pointer group w-full text-left
          ${
            isDragging
              ? "border-[#4F46E5] bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10"
              : preview
                ? "border-transparent"
                : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 dark:hover:bg-[#4F46E5]/10"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${previewClassName}
        `}
        style={{ aspectRatio }}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {preview ? (
          // Preview state
          <div className="relative w-full h-full bg-[#042e14]">
            <Image
              src={getImageSrc(preview)}
              alt={label || "Uploaded image"}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isUploading || disabled}
                  className="p-3 bg-white/90 dark:bg-gray-900/90 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl backdrop-blur-md"
                  title="Remove image"
                >
                  <X size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={isUploading || disabled}
                  className="p-3 bg-[#4F46E5] text-white rounded-2xl shadow-xl hover:bg-[#4F46E5]/90 transition-all"
                  title="Change image"
                >
                  <Upload size={20} />
                </button>
              </div>
            </div>

            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={32} className="text-[#4F46E5] animate-spin" />
                  <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                    Uploading
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-6">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={40} className="text-[#4F46E5] animate-spin" />
                <p className="text-sm font-bold text-[#4F46E5] uppercase tracking-wider">
                  Processing...
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-[20px] bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                  {isDragging ? (
                    <Upload size={28} className="text-[#4F46E5]" />
                  ) : (
                    <ImageIcon
                      size={28}
                      className="text-[#4F46E5] opacity-60"
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#1B2559] dark:text-gray-200 mb-1">
                    {isDragging ? "Drop to upload" : placeholder}
                  </p>
                  <p className="text-[12px] font-medium text-[#A3AED0] dark:text-gray-500">
                    Supports JPG, PNG, GIF (Max {maxSize}MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default ImageUpload;
