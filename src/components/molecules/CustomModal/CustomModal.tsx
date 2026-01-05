"use client";

import clsx from "clsx";
import { ReactNode, useEffect } from "react";

import CheckClickOutside from "@/components/atoms/CheckClickOutside";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}
const sizeClassMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};
const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  size = "lg",
}: ModalProps) => {
  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/10 backdrop-blur-sm dark:bg-gray-900/50">
      <CheckClickOutside
        onClick={onClose}
        className={clsx("w-full", sizeClassMap[size], className)}
      >
        <div
          className={`bg-white rounded-lg shadow-lg p-6 relative dark:bg-gray-900 dark:border-gray-800 ${className}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg dark:text-white"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Title */}
          {title && (
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {title}
            </h3>
          )}

          {/* Modal Content */}
          {children}
        </div>
      </CheckClickOutside>
    </div>
  );
};

export default CustomModal;
