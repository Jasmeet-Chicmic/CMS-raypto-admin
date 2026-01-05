"use client";

import {
  Ban,
  CheckCircle,
  RotateCcw,
  Star,
  Trash2,
  XCircle,
  Flag,
} from "lucide-react";
import { useState } from "react";

import { EVENT_STATUS } from "../../helpers/constants";
import { Event } from "../../helpers/types";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";

interface AdminActionsPanelProps {
  event: Event;
  onAction: (action: string) => void;
  isLoading: boolean;
}

const AdminActionsPanel = ({
  event,
  onAction,
  isLoading,
}: AdminActionsPanelProps) => {
  const [modal, setModal] = useState<{
    open: boolean;
    action?: string;
    title?: string;
    message?: string;
  }>({ open: false });

  const handleAction = (action: string) => {
    const modalConfig = {
      approve: {
        title: "Approve Event",
        message: `Are you sure you want to approve "${event.title}"? This will make it visible to the public.`,
      },
      reject: {
        title: "Reject Event",
        message: `Are you sure you want to reject "${event.title}"? This will hide it from the public.`,
      },
      feature: {
        title: "Feature Event",
        message: `Are you sure you want to feature "${event.title}"? This will promote it on the homepage.`,
      },
      delete: {
        title: "Delete Event",
        message: `Are you sure you want to permanently delete "${event.title}"? This action cannot be undone.`,
      },
      spam: {
        title: "Mark as Spam",
        message: `Are you sure you want to mark "${event.title}" as spam? This will affect the creator's trust score.`,
      },
      ban: {
        title: "Ban Creator",
        message: `Are you sure you want to ban the creator of "${event.title}"? This will prevent them from creating future events.`,
      },
      restore: {
        title: "Restore Event",
        message: `Are you sure you want to restore "${event.title}"? This will make it visible again.`,
      },
    };

    const config = modalConfig[action as keyof typeof modalConfig];
    if (config) {
      setModal({
        open: true,
        action,
        title: config.title,
        message: config.message,
      });
    } else {
      onAction(action);
    }
  };

  const handleConfirmAction = () => {
    if (modal.action) {
      onAction(modal.action);
      setModal({ open: false });
    }
  };

  const getActionButtonStyle = (
    variant: "primary" | "danger" | "warning" | "success",
  ) => {
    const baseStyle =
      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    switch (variant) {
      case "primary":
        return `${baseStyle} bg-blue-600 hover:bg-blue-700 text-white`;
      case "danger":
        return `${baseStyle} bg-red-600 hover:bg-red-700 text-white`;
      case "warning":
        return `${baseStyle} bg-yellow-600 hover:bg-yellow-700 text-white`;
      case "success":
        return `${baseStyle} bg-green-600 hover:bg-green-700 text-white`;
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Fixed Admin Actions Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Event Status Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Event Status:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                  {event.status === EVENT_STATUS.APPROVED
                    ? "Approved"
                    : event.status === EVENT_STATUS.PENDING_REVIEW
                      ? "Pending"
                      : event.status === EVENT_STATUS.REJECTED
                        ? "Rejected"
                        : event.status === EVENT_STATUS.DELETED
                          ? "Deleted"
                          : "Flagged"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Reports:
                </span>
                <span
                  className={`ml-2 font-medium ${event.reports > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {event.reports}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Approve - Only for Pending/Flagged */}
              {(event.status === EVENT_STATUS.PENDING_REVIEW ||
                event.status === EVENT_STATUS.FLAGGED) && (
                <button
                  onClick={() => handleAction("approve")}
                  disabled={isLoading}
                  className={getActionButtonStyle("success")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              )}

              {/* Reject - Only for Pending/Flagged */}
              {(event.status === EVENT_STATUS.PENDING_REVIEW ||
                event.status === EVENT_STATUS.FLAGGED) && (
                <button
                  onClick={() => handleAction("reject")}
                  disabled={isLoading}
                  className={getActionButtonStyle("danger")}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              )}

              {/* Feature - Only for Approved */}
              {event.status === EVENT_STATUS.APPROVED && (
                <button
                  onClick={() => handleAction("feature")}
                  disabled={isLoading}
                  className={getActionButtonStyle("primary")}
                >
                  <Star className="w-4 h-4" />
                  Feature
                </button>
              )}

              {/* Mark as Spam - Always available */}
              <button
                onClick={() => handleAction("spam")}
                disabled={isLoading}
                className={getActionButtonStyle("warning")}
              >
                <Flag className="w-4 h-4" />
                Mark as Spam
              </button>

              {/* Delete - Always available */}
              <button
                onClick={() => handleAction("delete")}
                disabled={isLoading}
                className={getActionButtonStyle("danger")}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              {/* Ban Creator - Always available */}
              <button
                onClick={() => handleAction("ban")}
                disabled={isLoading}
                className={getActionButtonStyle("danger")}
              >
                <Ban className="w-4 h-4" />
                Ban Creator
              </button>

              {/* Restore - Only for Rejected/Deleted */}
              {(event.status === EVENT_STATUS.REJECTED ||
                event.status === EVENT_STATUS.DELETED) && (
                <button
                  onClick={() => handleAction("restore")}
                  disabled={isLoading}
                  className={getActionButtonStyle("success")}
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={handleConfirmAction}
        title={modal.title || ""}
        message={modal.message || ""}
      />
    </>
  );
};

export default AdminActionsPanel;
