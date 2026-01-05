import {
  EVENT_STATUS,
  EVENT_STATUS_NAMES,
  TRUST_LEVEL,
  TRUST_LEVEL_NAMES,
} from "./constants";

// Status badge component
export const EventStatusBadge = ({ status }: { status: EVENT_STATUS }) => {
  const getStatusStyles = (status: EVENT_STATUS) => {
    switch (status) {
      case EVENT_STATUS.APPROVED:
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case EVENT_STATUS.PENDING_REVIEW:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case EVENT_STATUS.REJECTED:
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case EVENT_STATUS.DELETED:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      case EVENT_STATUS.FLAGGED:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(status)}`}
    >
      {EVENT_STATUS_NAMES[status]}
    </span>
  );
};

// Trust level badge component
export const TrustLevelBadge = ({ level }: { level: TRUST_LEVEL }) => {
  const getTrustStyles = (level: TRUST_LEVEL) => {
    switch (level) {
      case TRUST_LEVEL.HIGH:
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case TRUST_LEVEL.MEDIUM:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case TRUST_LEVEL.LOW:
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded text-[0.875] font-medium ${getTrustStyles(level)}`}
    >
      {TRUST_LEVEL_NAMES[level]}
    </span>
  );
};
