import { BadgeConditions } from "@/app/(secured)/badges/helpers/types";
import {
  BackendConnectedAccount,
  BackendSocialAccount,
} from "@/app/(secured)/users/view/[id]/connections/helpers/types";
import { Notification_Prefrences } from "@/app/(secured)/users/view/[id]/notifications/helpers/types";
import {
  BROWSER_TYPE,
  COUNTRIES,
  ENTITY_STATUS,
  INDUSTRY_SECTORS,
  INVOICE_STATUS,
  JOB_LOCATION,
  JOB_SALARY_CATEGORY,
  JOB_STATUS,
  JOB_TYPE,
  JOB_VISIBILITY,
  SUBSCRIPTION_PURCHASE_TYPE,
  SUBSCRIPTION_STATUS,
  USER_ACTIVITY_TYPE,
  USER_ROLES,
  USER_STATUS,
} from "@/shared/constants";

import { STATUS_CODE, STATUS_TYPE } from "./constants";

export interface ResponseType {
  status: boolean;
  message: string;
  type: STATUS_TYPE;
  statusCode: STATUS_CODE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface User {
  _id: string;
  createdAt: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  isEmailVerified?: boolean;
  profilePicture?: string;
  password?: string;
  companyName?: string;
  phoneNumber?: string;
  country?: COUNTRIES;
  role?: USER_ROLES;
  status?: USER_STATUS;
  billingAddress?: Address;
  bankDetails?: BankDetails;
  connectedAccounts?: BackendConnectedAccount[];
  socialAccounts?: BackendSocialAccount[];
  notificationPreferences?: Notification_Prefrences[];
  isSuspended?: boolean;
  wallet: string;
  betAmount?: number;
  profit?: number;
  rtp?: number;
  joinedAt: Date;
  isSuspicious?: boolean;
  currency: number;
}
export interface Address {
  address: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  zipcode: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
}
export type SORT_DIRECTION = -1 | 1;
export const CHART_TYPES = {
  LINE: "line",
  AREA: "area",
  BAR: "bar",
  SCATTER: "scatter",
  HEATMAP: "heatmap",
} as const;

export type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];
export interface GetParamsType {
  skip?: number;
  page?: number;
  limit?: number;
  sortKey?: string;
  sortDirection?: SORT_DIRECTION;
  searchString?: string;
  userId?: string;
  projectIds?: string[];
  filterType?: number;
  type?: number;
  badgeId?: string;
  companyId?: string;
  status?: number;
  isSuspicious?: boolean;
  joinedAt?: string;
  fromDate?: string;
  toDate?: string;
  currency?: number;
  isActive?: boolean;
}

export interface UserActivity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  type: USER_ACTIVITY_TYPE;
  projectId: string;
  invoiceId?: string;
  teamMembers?: ProjectType["teamMembers"];
  client?: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
}

export interface ProjectType {
  _id: string;
  name: string;
  imageURL: string;
  progress: number;
  leader: {
    _id: string;
    name: string;
  };
  teamMembers: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
}

export interface DEVICE {
  _id: string;
  userId: string;
  browserType: BROWSER_TYPE;
  deviceName: string;
  location: string;
  lastLoginDate: Date;
}

export type Replace<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>;

export interface InvoiceItem {
  title: string;
  description: string;
  cost: number;
  quantity: number;
  tax1Percentage: number;
  tax2Percentage: number;
  discountPercentage: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  dateIssued: string; // ISO date string
  dateDue: string; // ISO date string
  items: InvoiceItem[];
  salesPerson: string;
  salesPersonDescription: string;
  notes: string;
  user: User;
  invoiceAmount?: number;
  status?: INVOICE_STATUS;
}

export interface SubscriptionPlan {
  _id?: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isActive: boolean;
  color: string;
}

export interface UserSubscription {
  endDate: string;
  isAutoRenew: boolean;
  startDate: string;
  status: SUBSCRIPTION_STATUS;
  subscriptionPlan: SubscriptionPlan;
  subscriptionPlanId: string;
  userId: string;
  subscriptionPurchaseType: SUBSCRIPTION_PURCHASE_TYPE;
  _id: string;
}

export interface PaymentCard {
  userId?: string;
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiry?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  cvv?: string;
  isPrimary?: boolean;
  _id?: string;
  cardNumberLast4Digits?: string;
}

export type BadgePayload = {
  badgeId?: string;
  name: string;
  type: number;
  imageURL: string;
  conditions?: BadgeConditions;
};

export interface PromoCode {
  _id?: string;
  code: string;
  title: string;
  description: string;
  isActive: boolean;
  users?: User[];
  createdAt?: Date;
  updatedAt?: Date;
  plans?: SubscriptionPlan[];
}

// Companies

export interface Company {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  companyName?: string;
  email?: string;
  companyProfilePicture?: string;
  contactNumber?: string;
  country?: COUNTRIES;
  sector?: INDUSTRY_SECTORS;
  isSuspended?: boolean;
  isVerified?: boolean;
  status?: ENTITY_STATUS;
  flagsCount?: number;
  employeeCount?: string;
  website?: string;
  headquarters?: string;
  services?: string[];
}

//Jobs
export interface Job {
  _id: string;
  title: string;
  description: string;
  companyId: string;
  jobType: JOB_TYPE;
  location: JOB_LOCATION;
  inPersonLocation?: string;
  salaryCategory: JOB_SALARY_CATEGORY;
  customSalaryAmount?: number;
  applicationOpenDate: Date;
  applicationCloseDate: Date;
  keyResponsibilities: string;
  skills: string[];
  preferredExperience: string;
  sector: INDUSTRY_SECTORS;
  customSector?: string;
  status: JOB_STATUS;
  visibility: JOB_VISIBILITY;
  isDeleted: boolean;
  requirement: string;
  companyName: string;
  companyLocation: COUNTRIES;
  schedule: string;
  isExpanded: boolean;
  companyProfilePicture: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Application {
  _id: string;
  job: Job;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  coverLetter: string;
  resume: string;
  rating: number;
}
