"use client";

import {
  Ban,
  CheckCircle,
  RotateCcw,
  Star,
  Trash2,
  XCircle,
  Flag,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Company } from "@/shared/types";
import { COMPANY_ACTIONS, COMPANY_ACTION_CONFIG } from "./constants";
import { getStatusColor } from "@/shared/utils";
import { ENTITY_STATUS, ENTITY_STATUS_LABELS } from "@/shared/constants";

interface CompanyActionsPanelProps {
  company: Company;
  onAction: (action: string) => void;
  isLoading: boolean;
}

const CompanyActionsPanel = ({
  company,
  onAction,
  isLoading,
}: CompanyActionsPanelProps) => {
  const [modal, setModal] = useState<{
    open: boolean;
    action?: string;
    title?: string;
    message?: string;
  }>({ open: false });

  const handleAction = (action: string) => {
    const config =
      COMPANY_ACTION_CONFIG[action as keyof typeof COMPANY_ACTION_CONFIG];
    if (config) {
      setModal({
        open: true,
        action,
        title: config.title,
        message: config.message.replace(
          "this company",
          `"${company.companyName}"`,
        ),
      });
    } else {
      onAction(action);
    }
  };

  const handleConfirmAction = () => {
    if (modal.action) {
      onAction(modal.action);
      setModal({ open: false });

      // Show success message
      const message =
        COMPANY_ACTION_CONFIG[
          modal.action as keyof typeof COMPANY_ACTION_CONFIG
        ]?.title;
      if (message) {
        toast.success(message.replace("Company", "Company") + " successfully");
      }
    }
  };

  const getActionButtonStyle = (
    variant: "primary" | "danger" | "warning" | "success",
  ) => {
    const baseClasses =
      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700`;
      case "danger":
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700`;
      case "warning":
        return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700`;
      case "success":
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700`;
      default:
        return `${baseClasses} bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700`;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Admin Actions
          </h2>
        </div>

        <div className="space-y-4">
          {/* Company Status Info */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Company Status:
              </span>
              <span
                className={`ml-2 font-medium ${getStatusColor(company.status as ENTITY_STATUS)}`}
              >
                {company.status
                  ? ENTITY_STATUS_LABELS[company.status]
                  : "Active"}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Verification:
              </span>
              <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                {company.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Flags:</span>
              <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                {company.flagsCount || 0}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Verify - Only for unverified companies */}
            {!company.isVerified && (
              <button
                onClick={() => handleAction(COMPANY_ACTIONS.VERIFY)}
                disabled={isLoading}
                className={getActionButtonStyle("success")}
              >
                <Shield className="w-4 h-4" />
                Verify
              </button>
            )}

            {/* Approve - Only for pending/flagged companies */}
            {(company.status === ENTITY_STATUS.PENDING ||
              company.status === ENTITY_STATUS.FLAGGED) && (
              <button
                onClick={() => handleAction(COMPANY_ACTIONS.APPROVE)}
                disabled={isLoading}
                className={getActionButtonStyle("success")}
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            )}

            {/* Reject - Only for pending/flagged companies */}
            {(company.status === ENTITY_STATUS.PENDING ||
              company.status === ENTITY_STATUS.FLAGGED) && (
              <button
                onClick={() => handleAction(COMPANY_ACTIONS.REJECT)}
                disabled={isLoading}
                className={getActionButtonStyle("danger")}
                type="button"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            )}

            {/* Feature - Only for approved companies */}
            {company.status === ENTITY_STATUS.APPROVED && (
              <button
                onClick={() => handleAction(COMPANY_ACTIONS.FEATURE)}
                disabled={isLoading}
                className={getActionButtonStyle("primary")}
              >
                <Star className="w-4 h-4" />
                Feature
              </button>
            )}

            {/* Flag - Always available */}
            <button
              onClick={() => handleAction(COMPANY_ACTIONS.FLAG)}
              disabled={isLoading}
              className={getActionButtonStyle("warning")}
            >
              <Flag className="w-4 h-4" />
              Flag
            </button>

            {/* Mark as Spam - Always available */}
            <button
              onClick={() => handleAction(COMPANY_ACTIONS.SPAM)}
              disabled={isLoading}
              className={getActionButtonStyle("warning")}
            >
              <Flag className="w-4 h-4" />
              Mark as Spam
            </button>

            {/* Delete - Always available */}
            <button
              onClick={() => handleAction(COMPANY_ACTIONS.DELETE)}
              disabled={isLoading}
              className={getActionButtonStyle("danger")}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>

            {/* Ban - Always available */}
            <button
              onClick={() => handleAction(COMPANY_ACTIONS.BAN)}
              disabled={isLoading}
              className={getActionButtonStyle("danger")}
            >
              <Ban className="w-4 h-4" />
              Ban
            </button>

            {/* Restore - Only for rejected/deleted companies */}
            {(company.status === ENTITY_STATUS.REJECTED ||
              company.status === ENTITY_STATUS.DELETED) && (
              <button
                onClick={() => handleAction(COMPANY_ACTIONS.RESTORE)}
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

export default CompanyActionsPanel;
