"use server";

// src/api/dashboard.ts
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { ResponseType } from "@/shared/types";
import {
  transformAverageSalesData,
  transformSalesOverviewData,
  transformWebSiteAnalyticsData,
  transformEarningsReportData,
  transformSupportTicketsData,
  transformSalesByCountryData,
  transformTotalEarningsData,
  transformTopTransactionsData,
} from "@/shared/transformers/dashboard";

// Website Analytics
export const fetchDashboardAnalytics = async (
  params: { filterType?: string } = {},
) => {
  return await getRequest(API_END_POINTS.WEBSITE_ANALYTICS, params, {
    transformer: transformWebSiteAnalyticsData,
  });
};

// Daily Sales
export const fetchAverageDailySales = async (params = {}) => {
  return await getRequest(API_END_POINTS.AVERAGE_DAILY_SALES, params, {
    transformer: transformAverageSalesData,
  });
};

// Sales Overview
export const fetchSalesOverview = async (params = {}) => {
  return await getRequest(API_END_POINTS.SALES_OVERVIEW, params, {
    transformer: transformSalesOverviewData,
  });
};

// Earning Report
export const fetchEarningsReport = async (params = {}) => {
  return await getRequest(API_END_POINTS.EARNINGS_REPORT, params, {
    transformer: transformEarningsReportData,
  });
};

// Support Tracker
export const fetchSupportTickets = async (params = {}) => {
  return await getRequest(API_END_POINTS.SUPPORT_TICKETS, params, {
    transformer: transformSupportTicketsData,
  });
};

// Sales By Country
export const fetchSalesByCountry = async (params = {}) => {
  return await getRequest(API_END_POINTS.SALES_BY_COUNTRY, params, {
    transformer: transformSalesByCountryData,
  });
};

// Total Earning
export const fetchTotalEarnings = async (params = {}) => {
  return await getRequest(API_END_POINTS.TOTAL_EARNINGS, params, {
    transformer: transformTotalEarningsData,
  });
};

// Top Transactions
export const fetchTopTransactions = async (params = {}) => {
  return await getRequest(API_END_POINTS.TRANSACTIONS, params, {
    transformer: transformTopTransactionsData,
  });
};

export interface RevenuePerGameItem {
  gameType: number;
  grossGamingRevenue: number;
}

export interface RevenuePerGameData {
  revenuePerGame: RevenuePerGameItem[];
}

export const fetchRevenuePerGameAction = async (currency: number) => {
  return await getRequest<
    ResponseType & { data: RevenuePerGameData },
    { currency: number }
  >(API_END_POINTS.REVENUE_PER_GAME, { currency });
};
