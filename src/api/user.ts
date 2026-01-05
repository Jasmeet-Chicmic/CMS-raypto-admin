"use server";

import { AddUserFormValues } from "@/app/(secured)/users/list/AddUserSidebar";
import {
  BackendConnectedAccount,
  BackendSocialAccount,
} from "@/app/(secured)/users/view/[id]/connections/helpers/types";
import { Notification_Prefrences } from "@/app/(secured)/users/view/[id]/notifications/helpers/types";
import { API_END_POINTS } from "@/shared/api";
import { SUBSCRIPTION_PURCHASE_TYPE } from "@/shared/constants";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/fetcher";
import { GetParamsType, Replace, ResponseType, User } from "@/shared/types";
import { RevenuePerGameItem } from "./dashboard";

export async function suspendUserAction(payload: {
  userId: string;
  isSuspended: boolean;
}) {
  return await putRequest<
    ResponseType,
    {
      userId: string;
      isSuspended: boolean;
    }
  >(API_END_POINTS.USER, payload);
}
export async function updateUserAction(
  payload: Omit<User, "_id"> & {
    userId: string;
  },
) {
  return await putRequest<
    ResponseType,
    Omit<User, "_id"> & {
      userId: string;
    }
  >(API_END_POINTS.USER, payload);
}
export async function updateUserNotification(payload: {
  userId: string;
  notificationPreferences: Notification_Prefrences[];
}) {
  return await putRequest<
    ResponseType,
    {
      userId: string;
      notificationPreferences: Notification_Prefrences[];
    }
  >(API_END_POINTS.USER, payload);
}
export async function updateUserConnection(payload: {
  userId: string;
  socialAccounts?: BackendSocialAccount[];
  connectedAccounts?: BackendConnectedAccount[];
}) {
  return await putRequest<
    ResponseType,
    {
      userId: string;
      socialAccounts?: BackendSocialAccount[];
      connectedAccounts?: BackendConnectedAccount[];
    }
  >(API_END_POINTS.USER, payload);
}

export async function deleteUserAction(payload: { userIds: string[] }) {
  return await deleteRequest<
    ResponseType,
    {
      userIds: string[];
    }
  >(API_END_POINTS.USER, payload);
}

export async function deleteProjectAction(payload: {
  projectIds: string[];
  userId: string;
}) {
  return await deleteRequest<
    ResponseType,
    {
      projectIds: string[];
      userId: string;
    }
  >(API_END_POINTS.PROJECTS, payload);
}
export async function addUserAction(
  payload: Replace<AddUserFormValues, "contactNumber", string> & {
    phoneCode: string;
  },
) {
  return await postRequest<
    ResponseType,
    Replace<AddUserFormValues, "contactNumber", string> & {
      phoneCode: string;
    }
  >(API_END_POINTS.USER, payload);
}
export async function updateUserPasswordAction(payload: {
  userId: string;
  password: string;
}) {
  return await putRequest<
    ResponseType,
    {
      userId: string;
      password: string;
    }
  >(API_END_POINTS.USER, payload);
}
export async function getUsersAction(payload: GetParamsType) {
  return await getRequest<ResponseType, GetParamsType>(
    API_END_POINTS.USER,
    payload,
  );
}

export async function upgradeUserPlanAction(payload: {
  userId: string;
  subscriptionPlanId: string;
  subscriptionPurchaseType: SUBSCRIPTION_PURCHASE_TYPE;
}) {
  return await postRequest<
    ResponseType,
    {
      userId: string;
      subscriptionPlanId: string;
      subscriptionPurchaseType: SUBSCRIPTION_PURCHASE_TYPE;
    }
  >(API_END_POINTS.UPGRADE_USER_PLAN, payload);
}

export async function cancelUserSubscriptionAction(payload: {
  userId: string;
}) {
  return await putRequest<ResponseType, { userId: string }>(
    API_END_POINTS.CANCEL_USER_SUBSCRIPTION,
    payload,
  );
}

export async function logoutUserAction(payload: { userId: string }) {
  return await postRequest<ResponseType, { userId: string }>(
    API_END_POINTS.LOGOUT_USER,
    payload,
  );
}

export async function blockUserAction(payload: {
  userId: string;
  status: number;
}) {
  return await putRequest<
    ResponseType,
    {
      userId: string;
      status: number;
    }
  >(API_END_POINTS.USER_UPDATE, payload);
}

export async function fetchUserRevenuePerGameAction(params: {
  userId: string;
  currency: number;
  fromDate?: string;
  toDate?: string;
}) {
  console.log("params<><><><><><>", params);
  return await getRequest<
    ResponseType & { data: { revenuePerGame: RevenuePerGameItem[] } },
    {
      userId: string;
      currency: number;
      fromDate?: string;
      toDate?: string;
    }
  >(API_END_POINTS.REVENUE_PER_GAME, params);
}

export async function fetchUserGamesPlayedAction(params: {
  userId: string;
  // currency: number;
  fromDate?: string;
  toDate?: string;
}) {
  console.log("fetchUserGamesPlayedAction ::", params);
  return await getRequest<
    ResponseType & {
      data: { result: { date: string; activeUsers: number }[] };
    },
    {
      userId: string;
      fromDate?: string;
      toDate?: string;
    }
  >(API_END_POINTS.GAME_PLAYED, params);
}
