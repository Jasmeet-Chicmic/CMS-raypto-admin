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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm">
      <CheckClickOutside
        onClick={onClose}
        className={clsx("w-full px-4", sizeClassMap[size], className)}
      >
        <div
          className={`bg-bgwhite dark:bg-darkbgprimary rounded-[20px] shadow-lg p-8 relative border border-bordercolor1 dark:border-bordercolor2 ${className}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-sidebartext hover:text-textprimary dark:text-sidebartext/60 dark:hover:text-sidebartext transition-colors text-xl"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Title */}
          {title && (
            <h3 className="text-[1.5rem] font-bold mb-6 text-textprimary dark:text-sidebartext leading-none">
              {title}
            </h3>
          )}

          {/* Modal Content */}
          <div className="text-textparagraph dark:text-sidebartext/80">
            {children}
          </div>
        </div>
      </CheckClickOutside>
    </div>
  );
};

export default CustomModal;
