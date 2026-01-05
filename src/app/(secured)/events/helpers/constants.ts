// Event status enum
export enum EVENT_STATUS {
  PENDING_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3,
  DELETED = 4,
  FLAGGED = 5,
}

export const EVENT_STATUS_NAMES = {
  [EVENT_STATUS.PENDING_REVIEW]: "Pending",
  [EVENT_STATUS.APPROVED]: "Approved",
  [EVENT_STATUS.REJECTED]: "Rejected",
  [EVENT_STATUS.DELETED]: "Deleted",
  [EVENT_STATUS.FLAGGED]: "Flagged",
};

// Event type enum
export enum EVENT_TYPE {
  FREE = 1,
  PAID = 2,
}

export const EVENT_TYPE_NAMES = {
  [EVENT_TYPE.FREE]: "Free",
  [EVENT_TYPE.PAID]: "Paid",
};

// Creator type enum
export enum CREATOR_TYPE {
  USER = 1,
  COMPANY = 2,
}

export const CREATOR_TYPE_NAMES = {
  [CREATOR_TYPE.USER]: "User",
  [CREATOR_TYPE.COMPANY]: "Company",
};

// Trust level enum
export enum TRUST_LEVEL {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export const TRUST_LEVEL_NAMES = {
  [TRUST_LEVEL.LOW]: "Low",
  [TRUST_LEVEL.MEDIUM]: "Medium",
  [TRUST_LEVEL.HIGH]: "High",
};

// Union types for filter options
export type EventStatusFilter = EVENT_STATUS | "";
export type EventTypeFilter = EVENT_TYPE | "";
export type CreatorTypeFilter = CREATOR_TYPE | "";
export type TrustLevelFilter = TRUST_LEVEL | "";

// Filter options
export const EVENT_STATUS_OPTIONS = [
  { label: "All Status", value: "" as EventStatusFilter },
  {
    label: EVENT_STATUS_NAMES[EVENT_STATUS.PENDING_REVIEW],
    value: EVENT_STATUS.PENDING_REVIEW,
  },
  {
    label: EVENT_STATUS_NAMES[EVENT_STATUS.APPROVED],
    value: EVENT_STATUS.APPROVED,
  },
  {
    label: EVENT_STATUS_NAMES[EVENT_STATUS.REJECTED],
    value: EVENT_STATUS.REJECTED,
  },
  {
    label: EVENT_STATUS_NAMES[EVENT_STATUS.DELETED],
    value: EVENT_STATUS.DELETED,
  },
  {
    label: EVENT_STATUS_NAMES[EVENT_STATUS.FLAGGED],
    value: EVENT_STATUS.FLAGGED,
  },
];

export const EVENT_TYPE_OPTIONS = [
  { label: "All Types", value: "" as EventTypeFilter },
  { label: EVENT_TYPE_NAMES[EVENT_TYPE.FREE], value: EVENT_TYPE.FREE },
  { label: EVENT_TYPE_NAMES[EVENT_TYPE.PAID], value: EVENT_TYPE.PAID },
];

export const CREATOR_TYPE_OPTIONS = [
  { label: "All Creators", value: "" as CreatorTypeFilter },
  { label: CREATOR_TYPE_NAMES[CREATOR_TYPE.USER], value: CREATOR_TYPE.USER },
  {
    label: CREATOR_TYPE_NAMES[CREATOR_TYPE.COMPANY],
    value: CREATOR_TYPE.COMPANY,
  },
];

export const TRUST_LEVEL_OPTIONS = [
  { label: "All Trust Levels", value: "" as TrustLevelFilter },
  { label: TRUST_LEVEL_NAMES[TRUST_LEVEL.LOW], value: TRUST_LEVEL.LOW },
  { label: TRUST_LEVEL_NAMES[TRUST_LEVEL.MEDIUM], value: TRUST_LEVEL.MEDIUM },
  { label: TRUST_LEVEL_NAMES[TRUST_LEVEL.HIGH], value: TRUST_LEVEL.HIGH },
];

// Action messages
export const ACTION_MESSAGES = {
  approve: "Event approved successfully",
  reject: "Event rejected successfully",
  feature: "Event featured successfully",
  delete: "Event deleted successfully",
  spam: "Event marked as spam",
  ban: "Creator banned successfully",
  restore: "Event restored successfully",
} as const;

// Modal content messages
export const MODAL_CONTENT = {
  approve: {
    title: "Approve Event",
    message: "Are you sure you want to approve",
  },
  reject: {
    title: "Reject Event",
    message: "Are you sure you want to reject",
  },
  feature: {
    title: "Feature Event",
    message: "Are you sure you want to feature",
  },
  delete: {
    title: "Delete Event",
    message: "Are you sure you want to delete",
  },
  spam: {
    title: "Mark as Spam",
    message: "Are you sure you want to mark",
  },
  ban: {
    title: "Ban Creator",
    message: "Are you sure you want to ban the creator of",
  },
  restore: {
    title: "Restore Event",
    message: "Are you sure you want to restore",
  },
} as const;

// Placeholder text
export const PLACEHOLDERS = {
  SEARCH_EVENTS: "Search Events",
  FILTER_BY_STATUS: "Filter by Status",
  FILTER_BY_TYPE: "Filter by Type",
  FILTER_BY_CREATOR: "Filter by Creator",
  FILTER_BY_TRUST: "Filter by Trust",
} as const;

// Button text
export const BUTTON_TEXT = {
  EXPORT: "Export",
  ADD_EVENT: "Add Event",
  FILTERS: "Filters",
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  ADD_EVENT_COMING_SOON: "Add Event functionality coming soon",
} as const;

// Action button styles
export const BUTTON_STYLES = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
} as const;

// Action button labels
export const BUTTON_LABELS = {
  approve: "Approve",
  reject: "Reject",
  feature: "Feature",
  delete: "Delete",
  spam: "Mark as Spam",
  ban: "Ban Creator",
  restore: "Restore",
} as const;

// Event View Page Configuration
export const EVENT_VIEW_CONFIG = {
  // Layout options
  LAYOUT: {
    SHOW_HEADER: true,
    SHOW_CONTENT: true,
    SHOW_SIDEBAR: true,
    SHOW_ACTIONS: true,
  },

  // Action button configuration
  ACTIONS: {
    SHOW_APPROVE: true,
    SHOW_REJECT: true,
    SHOW_FEATURE: true,
    SHOW_DELETE: true,
    SHOW_SPAM: true,
    SHOW_BAN: true,
    SHOW_RESTORE: true,
  },

  // Content sections configuration
  CONTENT: {
    SHOW_BANNER: true,
    SHOW_DESCRIPTION: true,
    SHOW_LOCATION: true,
    SHOW_DATE_TIME: true,
    SHOW_TYPE_PRICING: true,
    SHOW_MEDIA_GALLERY: true,
    SHOW_RSVP_LIST: true,
  },

  // Sidebar sections configuration
  SIDEBAR: {
    SHOW_RSVP_STATS: true,
    SHOW_ABUSE_REPORTS: true,
    SHOW_MODERATOR_NOTES: true,
    SHOW_QUICK_ACTIONS: true,
  },

  // Action button icons
  BUTTON_ICONS: {
    approve: "CheckCircle",
    reject: "XCircle",
    feature: "Star",
    delete: "Trash2",
    spam: "Flag",
    ban: "Ban",
    restore: "RotateCcw",
  },
} as const;

// Section titles
export const SECTION_TITLES = {
  DESCRIPTION: "Description",
  LOCATION: "Location",
  DATE_TIME: "Date & Time",
  TYPE_PRICING: "Event Type & Pricing",
  MEDIA_GALLERY: "Media Gallery",
  RSVP_LIST: "RSVP List",
  RSVP_STATS: "RSVP Statistics",
  ABUSE_REPORTS: "Abuse Reports",
  MODERATOR_NOTES: "Moderator Notes",
  QUICK_ACTIONS: "Quick Actions",
} as const;

// Quick action labels
export const QUICK_ACTION_LABELS = {
  VIEW_ALL_RSVPS: "View All RSVPs",
  EXPORT_DATA: "Export Data",
  CONTACT_CREATOR: "Contact Creator",
} as const;

// Quick action descriptions
export const QUICK_ACTION_DESCRIPTIONS = {
  VIEW_ALL_RSVPS: "See complete list of attendees",
  EXPORT_DATA: "Download event details and RSVPs",
  CONTACT_CREATOR: "Send message to event organizer",
} as const;
