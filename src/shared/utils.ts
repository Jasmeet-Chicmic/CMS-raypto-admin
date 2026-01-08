// utils/sessionClient.ts

import clsx, { ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import Payment from "payment";
import { twMerge } from "tailwind-merge";

import {
  ENTITY_STATUS,
  STATUS_COLOR_MAP,
  TRANSACTION_SOURCE_TYPES,
} from "./constants";

// Set session cookie by sending token to server
export async function createSessionClient(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to create session:", data);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Error in createSessionClient:", err);
    return false;
  }
}

// Delete session cookie (logout)
export async function deleteSessionClient(): Promise<boolean> {
  try {
    const res = await fetch("/api/session", {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to delete session:", data);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Error in deleteSessionClient:", err);
    return false;
  }
}
// Delete session cookie (logout)
export async function getSessionClient() {
  try {
    const res = await fetch("/api/session", {
      method: "GET",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to get session:", data);
      return data;
    }

    return data;
  } catch (err) {
    console.error("❌ Error in getSessionClient:", err);
    return err;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function hexToRgb(hex: string): string {
  const sanitizedHex = hex.replace("#", "");
  const bigint = Number.parseInt(sanitizedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

export const toQueryParams = <T>(params: T): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params as object).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return `?${searchParams.toString()}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export const getRelativeTime = (date: Date | string): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export function formatMsToReadableDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days) parts.push(`${days} days`);
  if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

  return parts.join(" ");
}

export const calculateTotal = ({
  cost = 0,
  quantity = 0,
  discount = 0,
  tax1Percentage = 0,
  tax2Percentage = 0,
}) => {
  if (cost === 0 || quantity === 0) return 0;
  const price = cost * quantity;
  const discountedPrice = price - price * (discount / 100);
  const tax1Price = discountedPrice * (tax1Percentage / 100);
  const tax2Price = discountedPrice * (tax2Percentage / 100);
  return discountedPrice + tax1Price + tax2Price;
};

// Format card number based on issuer
export const formatCardNumber = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

// Format expiry date
export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

// Format CVV
export const formatCVV = (value: string, cardNumber: string): string => {
  const digits = value.replace(/\D/g, "");
  const cardType = Payment.fns.cardType(cardNumber);
  const maxLength = cardType === "amex" ? 4 : 3;
  return digits.slice(0, maxLength);
};

// Get card issuer
export const getCardIssuer = (cardNumber: string): string | null => {
  const digits = cardNumber.replace(/\D/g, "");
  return Payment.fns.cardType(digits) ?? null;
};

export const formatNumberValue = (value: number): string => {
  if (value === 0) return "0";
  if (value < 0) return `-${formatNumberValue(-value)}`;
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

export const getTransactionSourceDetails = (source: number): string => {
  switch (source) {
    case TRANSACTION_SOURCE_TYPES.WALLET:
      return "Wallet";
    case TRANSACTION_SOURCE_TYPES.BANK_TRANSFER:
      return "Bank Transfer";
    case TRANSACTION_SOURCE_TYPES.PAYPAL:
      return "PayPal";
    case TRANSACTION_SOURCE_TYPES.BANK_TRANSACTION:
      return "Bank Transaction";
    case TRANSACTION_SOURCE_TYPES.CARD:
      return "Card";
    default:
      return "";
  }
};

export const formatDate = (date: Date | string): string => {
  if (!date) return "";

  return format(date, "MMM d, yyyy h:mm a");
};

export async function updateLocale(locale: string): Promise<boolean> {
  try {
    const res = await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to update locale:", data);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Error in updateLocale:", err);
    return false;
  }
}

export async function getLocale(): Promise<string | null> {
  try {
    const res = await fetch("/api/locale", {
      method: "GET",
    });
    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to get locale:", data);
      return null;
    }

    const data = await res.json();
    console.log(data, "res in getLocale");
    return data.locale || "en";
  } catch (err) {
    console.error("❌ Error in getLocale:", err);
    return null;
  }
}

export const getStatusColor = (status: ENTITY_STATUS): string => {
  return (
    STATUS_COLOR_MAP[status as ENTITY_STATUS] || "bg-gray-100 text-gray-800"
  );
};
export const walletTruncate = (
  address: string,
  startLength = 6,
  endLength = 4,
) => {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Format a number into a compact currency format (K, M, B, T)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param showSign - Whether to show + for positive numbers (default: false)
 * @returns Formatted string like "1.5K", "2.3M", "1.2B", "3.4T"
 */
export const formatCurrency = (
  value: number,
  decimals: number = 2,
  showSign: boolean = false,
): string => {
  if (value === 0) return "0";

  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const suffixes = [
    { threshold: 1e12, suffix: "T" }, // Trillion
    { threshold: 1e9, suffix: "B" }, // Billion
    { threshold: 1e6, suffix: "M" }, // Million
    { threshold: 1e3, suffix: "K" }, // Thousand
  ];

  let formattedValue = "";

  for (const { threshold, suffix } of suffixes) {
    if (absValue >= threshold) {
      const scaled = absValue / threshold;
      formattedValue = scaled.toFixed(decimals).replace(/\.?0+$/, "") + suffix;
      break;
    }
  }

  // If no suffix applied, just format normally
  if (!formattedValue) {
    formattedValue = absValue.toFixed(decimals).replace(/\.?0+$/, "");
  }

  // Add sign
  if (isNegative) {
    return `-${formattedValue}`;
  } else if (showSign && value > 0) {
    return `+${formattedValue}`;
  }

  return formattedValue;
};

/**
 * Format currency with full precision for smaller values, compact for larger
 * @param value - The number to format
 * @param compactThreshold - Value above which to use compact format (default: 10000)
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatCurrencyAuto = (
  value: number,
  compactThreshold: number = 10000,
  decimals: number = 2,
): string => {
  const absValue = Math.abs(value);

  if (absValue >= compactThreshold) {
    return formatCurrency(value, decimals);
  }

  // For smaller values, show full number with locale formatting
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Helper function to create sortable table columns with consistent configuration
 * @param field - The field key from the data type
 * @param title - The column title to display
 * @param render - Function to render the cell content
 * @param sortKey - Optional custom sort key (defaults to field name)
 * @returns TableColumn configuration object
 */
export const createSortableColumn = <T>(
  field: keyof T,
  title: string,
  render: (item: T) => React.ReactNode,
  sortKey?: string,
): {
  field: keyof T;
  title: string;
  render: (item: T) => React.ReactNode;
  sortable: boolean;
  sortKey: string;
} => ({
  field,
  title,
  render,
  sortable: true,
  sortKey: sortKey || (field as string),
});
