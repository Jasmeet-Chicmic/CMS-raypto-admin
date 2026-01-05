import {
  CREATOR_TYPE,
  EVENT_STATUS,
  EVENT_TYPE,
  TRUST_LEVEL,
} from "./constants";

// Event interface
export interface Event {
  _id: string;
  title: string;
  createdBy: {
    _id: string;
    name: string;
    type: CREATOR_TYPE;
    email?: string;
    avatar?: string;
  };
  type: EVENT_TYPE;
  eventDate: string;
  status: EVENT_STATUS;
  trustLevel: TRUST_LEVEL;
  rsvpCount: number;
  reports: number;
  description?: string;
  location?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
  media?: {
    banner?: string;
    gallery?: string[];
  };
  tags?: string[];
  category?: string;
  maxAttendees?: number;
  isOnline?: boolean;
  meetingUrl?: string;
  timezone?: string;
}

// Modal state interface
export interface ModalState {
  open: boolean;
  data?: Event;
  action?: string;
}

// Action types
export type EventAction =
  | "approve"
  | "reject"
  | "feature"
  | "delete"
  | "spam"
  | "ban"
  | "restore";

// Filter option interface
export interface FilterOption<T> {
  label: string;
  value: T;
}

// Menu item interface
export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// Event View Configuration Interfaces
export interface EventViewConfig {
  layout?: {
    showHeader?: boolean;
    showContent?: boolean;
    showSidebar?: boolean;
    showActions?: boolean;
  };
  actions?: {
    showApprove?: boolean;
    showReject?: boolean;
    showFeature?: boolean;
    showDelete?: boolean;
    showSpam?: boolean;
    showBan?: boolean;
    showRestore?: boolean;
  };
  content?: {
    showBanner?: boolean;
    showDescription?: boolean;
    showLocation?: boolean;
    showDateTime?: boolean;
    showTypePricing?: boolean;
    showMediaGallery?: boolean;
    showRsvpList?: boolean;
  };
  sidebar?: {
    showRsvpStats?: boolean;
    showAbuseReports?: boolean;
    showModeratorNotes?: boolean;
    showQuickActions?: boolean;
  };
}

// Event View Props Interface
export interface EventViewProps {
  event: Event;
  config?: EventViewConfig;
  onAction?: (action: EventAction, event: Event) => void;
  onModeratorNotesChange?: (notes: string) => void;
  moderatorNotes?: string;
  isLoading?: boolean;
  customData?: {
    images?: string[];
    rsvps?: Array<{
      name: string;
      isVerified: boolean;
      joinedAt: string;
    }>;
    reports?: Array<{
      type: string;
      count: number;
      comments: string[];
    }>;
  };
}

// Action Button Interface
export interface ActionButton {
  key: EventAction;
  label: string;
  icon: string;
  variant: "primary" | "danger" | "warning" | "success";
  disabled?: boolean;
  onClick: () => void;
}

// Quick Action Interface
export interface QuickAction {
  key: string;
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
}
