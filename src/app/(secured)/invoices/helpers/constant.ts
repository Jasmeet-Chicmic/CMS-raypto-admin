import { INVOICE_STATUS, INVOICE_STATUS_NAMES } from "@/shared/constants";

export const INVOICE_STATUS_OPTIONS = [
  {
    label: INVOICE_STATUS_NAMES[INVOICE_STATUS.PENDING],
    value: INVOICE_STATUS.PENDING,
  },
  {
    label: INVOICE_STATUS_NAMES[INVOICE_STATUS.PAID],
    value: INVOICE_STATUS.PAID,
  },
  {
    label: INVOICE_STATUS_NAMES[INVOICE_STATUS.DECLINED],
    value: INVOICE_STATUS.DECLINED,
  },
];

export const TAX_PERCENTAGE_OPTIONS = [
  { label: "0%", value: 0 },
  { label: "1%", value: 1 },
  { label: "10%", value: 10 },
  { label: "18%", value: 18 },
  { label: "40%", value: 40 },
];
