// components/JobDropdown.tsx
"use client";

import {
  ExternalLink,
  Edit,
  Archive,
  Eye,
  Lock,
  Link,
  Trash,
  Users,
  Send,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  onAction?: (action: string) => void;
}
export const ACTION = {
  OPEN: "open",
  EDIT: "edit",
  ARCHIVE: "archive",
  VIEW: "view",
  PRIVATE: "private",
  COPY: "copy",
  DELETE: "delete",
  HIRINGS: "hirings",
};
const actions = [
  { icon: ExternalLink, label: "Open in new tab", action: ACTION.OPEN },
  { icon: Edit, label: "Edit job post", action: ACTION.EDIT },
  { icon: Archive, label: "Archive", action: ACTION.ARCHIVE },
  { icon: Eye, label: "View job post", action: ACTION.VIEW },
  { icon: Lock, label: "Make private – Invite only", action: ACTION.PRIVATE },
  { icon: Link, label: "Copy link", action: ACTION.COPY },
  { icon: Trash, label: "Delete job", action: ACTION.DELETE },
  { icon: Users, label: "Hirings", action: ACTION.HIRINGS },
];

export const JobDropdown = ({ onAction }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 6h0 M12 12h0 M12 18h0" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 bg-white border rounded-lg shadow-lg text-sm py-2">
          {actions.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              className="flex w-full items-center px-4 py-2 hover:bg-gray-100 text-left gap-2"
              onClick={() => {
                onAction?.(action);
                setIsOpen(false);
              }}
            >
              <Icon size={16} className="text-gray-700" />
              <span>{label}</span>
            </button>
          ))}

          <div className="px-4 pt-2 pb-3">
            <label
              htmlFor="invite-search"
              className="text-[0.875rem] text-[#A3AED0] mb-1 block"
            >
              Invite someone
            </label>
            <div className="flex items-center border rounded px-2 py-1">
              <input
                id="invite-search"
                type="text"
                placeholder="Search here"
                className="flex-1 text-sm outline-none"
              />
              <Send size={14} className="text-[#592C16]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
