export const COMPANY_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FLAGGED: "Flagged",
  DELETED: "Deleted",
} as const;

export const COMPANY_ACTIONS = {
  VERIFY: "verify",
  APPROVE: "approve",
  REJECT: "reject",
  FEATURE: "feature",
  FLAG: "flag",
  SPAM: "spam",
  DELETE: "delete",
  BAN: "ban",
  RESTORE: "restore",
} as const;

export const COMPANY_ACTION_MESSAGES = {
  [COMPANY_ACTIONS.VERIFY]: "Company verified successfully",
  [COMPANY_ACTIONS.APPROVE]: "Company approved successfully",
  [COMPANY_ACTIONS.REJECT]: "Company rejected successfully",
  [COMPANY_ACTIONS.FEATURE]: "Company featured successfully",
  [COMPANY_ACTIONS.FLAG]: "Company flagged for review",
  [COMPANY_ACTIONS.SPAM]: "Company marked as spam",
  [COMPANY_ACTIONS.DELETE]: "Company deleted successfully",
  [COMPANY_ACTIONS.BAN]: "Company banned successfully",
  [COMPANY_ACTIONS.RESTORE]: "Company restored successfully",
} as const;

export const COMPANY_ACTION_CONFIG = {
  [COMPANY_ACTIONS.VERIFY]: {
    title: "Verify Company",
    message:
      "Are you sure you want to verify this company? This will mark the company as verified and increase their trust score.",
    variant: "success" as const,
  },
  [COMPANY_ACTIONS.APPROVE]: {
    title: "Approve Company",
    message:
      "Are you sure you want to approve this company? This will make it visible to the public.",
    variant: "success" as const,
  },
  [COMPANY_ACTIONS.REJECT]: {
    title: "Reject Company",
    message:
      "Are you sure you want to reject this company? This will hide it from the public.",
    variant: "danger" as const,
  },
  [COMPANY_ACTIONS.FEATURE]: {
    title: "Feature Company",
    message:
      "Are you sure you want to feature this company? This will promote it on the homepage.",
    variant: "primary" as const,
  },
  [COMPANY_ACTIONS.FLAG]: {
    title: "Flag Company",
    message:
      "Are you sure you want to flag this company for review? This will mark it for admin attention.",
    variant: "warning" as const,
  },
  [COMPANY_ACTIONS.SPAM]: {
    title: "Mark as Spam",
    message:
      "Are you sure you want to mark this company as spam? This will affect the company's trust score.",
    variant: "warning" as const,
  },
  [COMPANY_ACTIONS.DELETE]: {
    title: "Delete Company",
    message:
      "Are you sure you want to permanently delete this company? This action cannot be undone.",
    variant: "danger" as const,
  },
  [COMPANY_ACTIONS.BAN]: {
    title: "Ban Company",
    message:
      "Are you sure you want to ban this company? This will prevent them from accessing the platform.",
    variant: "danger" as const,
  },
  [COMPANY_ACTIONS.RESTORE]: {
    title: "Restore Company",
    message:
      "Are you sure you want to restore this company? This will make it visible again.",
    variant: "success" as const,
  },
} as const;
