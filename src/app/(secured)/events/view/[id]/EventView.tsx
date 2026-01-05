"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import {
  EVENT_STATUS,
  EVENT_VIEW_CONFIG,
  QUICK_ACTION_LABELS,
  QUICK_ACTION_DESCRIPTIONS,
  BUTTON_STYLES,
  BUTTON_LABELS,
  EVENT_STATUS_NAMES,
} from "../../helpers/constants";
import {
  EventViewProps,
  ActionButton,
  QuickAction,
  EventAction,
} from "../../helpers/types";
import EventViewHeader from "./EventViewHeader";
import EventViewContent from "./EventViewContent";
import EventViewSidebar from "./EventViewSidebar";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";

const EventView = ({
  event,
  config = {},
  onAction,
  onModeratorNotesChange,
  moderatorNotes = "",
  isLoading = false,
  customData,
}: EventViewProps) => {
  const [modal, setModal] = useState<{
    open: boolean;
    action?: EventAction;
    title?: string;
    message?: string;
  }>({ open: false });

  // Merge default config with provided config
  const mergedConfig = {
    layout: { ...EVENT_VIEW_CONFIG.LAYOUT, ...config.layout },
    actions: { ...EVENT_VIEW_CONFIG.ACTIONS, ...config.actions },
    content: { ...EVENT_VIEW_CONFIG.CONTENT, ...config.content },
    sidebar: { ...EVENT_VIEW_CONFIG.SIDEBAR, ...config.sidebar },
  };

  const handleAction = (action: EventAction) => {
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

    const modalContent = modalConfig[action];
    if (modalContent) {
      setModal({
        open: true,
        action,
        title: modalContent.title,
        message: modalContent.message,
      });
    } else if (onAction) {
      onAction(action, event);
    }
  };

  const handleConfirmAction = () => {
    if (modal.action && onAction) {
      onAction(modal.action, event);
      setModal({ open: false });
    }
  };

  // Generate action buttons based on configuration
  const getActionButtons = (): ActionButton[] => {
    const buttons: ActionButton[] = [];

    if (
      mergedConfig.actions.showApprove &&
      (event.status === EVENT_STATUS.PENDING_REVIEW ||
        event.status === EVENT_STATUS.FLAGGED)
    ) {
      buttons.push({
        key: "approve",
        label: BUTTON_LABELS.approve,
        icon: "CheckCircle",
        variant: "success",
        onClick: () => handleAction("approve"),
      });
    }

    if (
      mergedConfig.actions.showReject &&
      (event.status === EVENT_STATUS.PENDING_REVIEW ||
        event.status === EVENT_STATUS.FLAGGED)
    ) {
      buttons.push({
        key: "reject",
        label: BUTTON_LABELS.reject,
        icon: "XCircle",
        variant: "danger",
        onClick: () => handleAction("reject"),
      });
    }

    if (
      mergedConfig.actions.showFeature &&
      event.status === EVENT_STATUS.APPROVED
    ) {
      buttons.push({
        key: "feature",
        label: BUTTON_LABELS.feature,
        icon: "Star",
        variant: "primary",
        onClick: () => handleAction("feature"),
      });
    }

    if (mergedConfig.actions.showSpam) {
      buttons.push({
        key: "spam",
        label: BUTTON_LABELS.spam,
        icon: "Flag",
        variant: "warning",
        onClick: () => handleAction("spam"),
      });
    }

    if (mergedConfig.actions.showDelete) {
      buttons.push({
        key: "delete",
        label: BUTTON_LABELS.delete,
        icon: "Trash2",
        variant: "danger",
        onClick: () => handleAction("delete"),
      });
    }

    if (mergedConfig.actions.showBan) {
      buttons.push({
        key: "ban",
        label: BUTTON_LABELS.ban,
        icon: "Ban",
        variant: "danger",
        onClick: () => handleAction("ban"),
      });
    }

    if (
      mergedConfig.actions.showRestore &&
      (event.status === EVENT_STATUS.REJECTED ||
        event.status === EVENT_STATUS.DELETED)
    ) {
      buttons.push({
        key: "restore",
        label: BUTTON_LABELS.restore,
        icon: "RotateCcw",
        variant: "success",
        onClick: () => handleAction("restore"),
      });
    }

    return buttons;
  };

  // Generate quick actions
  const getQuickActions = (): QuickAction[] => {
    const actions: QuickAction[] = [];

    actions.push({
      key: "view-rsvps",
      label: QUICK_ACTION_LABELS.VIEW_ALL_RSVPS,
      description: QUICK_ACTION_DESCRIPTIONS.VIEW_ALL_RSVPS,
      icon: "Users",
      onClick: () => toast.info("View all RSVPs functionality"),
    });

    actions.push({
      key: "export-data",
      label: QUICK_ACTION_LABELS.EXPORT_DATA,
      description: QUICK_ACTION_DESCRIPTIONS.EXPORT_DATA,
      icon: "FileText",
      onClick: () => toast.info("Export data functionality"),
    });

    actions.push({
      key: "contact-creator",
      label: QUICK_ACTION_LABELS.CONTACT_CREATOR,
      description: QUICK_ACTION_DESCRIPTIONS.CONTACT_CREATOR,
      icon: "MessageSquare",
      onClick: () => toast.info("Contact creator functionality"),
    });

    return actions;
  };

  const actionButtons = getActionButtons();
  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {mergedConfig.layout.showHeader && <EventViewHeader event={event} />}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Content */}
          {mergedConfig.layout.showContent && (
            <div className="lg:col-span-2">
              <EventViewContent
                event={event}
                config={mergedConfig.content}
                customData={customData}
              />
            </div>
          )}

          {/* Right Column: Analytics & Meta */}
          {mergedConfig.layout.showSidebar && (
            <div className="lg:col-span-1">
              <EventViewSidebar
                event={event}
                config={mergedConfig.sidebar}
                moderatorNotes={moderatorNotes}
                onModeratorNotesChange={onModeratorNotesChange}
                customData={customData}
                quickActions={quickActions}
              />
            </div>
          )}
        </div>

        {/* Admin Actions Panel - Inside the page */}
        {mergedConfig.layout.showActions && actionButtons.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Admin Actions
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              {/* Event Status Info */}
              <div className="flex items-center gap-4 mr-auto">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Event Status:
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {EVENT_STATUS_NAMES[event.status]}
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
                {actionButtons.map((button) => (
                  <button
                    key={button.key}
                    onClick={button.onClick}
                    disabled={isLoading || button.disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_STYLES[button.variant]}`}
                  >
                    <span>{button.label}</span>
                  </button>
                ))}

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
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={handleConfirmAction}
        title={modal.title || ""}
        message={modal.message || ""}
      />
    </div>
  );
};

export default EventView;
