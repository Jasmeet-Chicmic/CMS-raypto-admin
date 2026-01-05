"use server";
import {
  BadgesInterface,
  UserBadgesInterface,
} from "@/app/(secured)/badges/helpers/types";
import { API_END_POINTS } from "@/shared/api";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/fetcher";
import { BadgePayload, GetParamsType, ResponseType } from "@/shared/types";

export async function getBadgesList(payload: GetParamsType) {
  return await getRequest<
    ResponseType & { data: { data: BadgesInterface[]; count: number } },
    GetParamsType
  >(API_END_POINTS.BADGES, payload);
}
export async function deleteBadgeAction(payload: { badgeIds: string[] }) {
  return await deleteRequest<
    ResponseType,
    {
      badgeIds: string[];
    }
  >(API_END_POINTS.BADGES, payload);
}
export async function addBadgeAction(payload: BadgePayload) {
  return await postRequest<ResponseType, BadgePayload>(
    API_END_POINTS.BADGES,
    payload,
  );
}
export async function updateBadgeAction(payload: BadgePayload) {
  return await putRequest<ResponseType, BadgePayload>(
    API_END_POINTS.BADGES,
    payload,
  );
}
export async function uploadBadgeImage(formData: FormData) {
  return await postRequest<ResponseType, FormData>(
    API_END_POINTS.UPLOAD_BADGE_IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "image/jpeg",
      },
    },
  );
}

//USER BADGES
export async function getUserBadges(payload: GetParamsType) {
  return await getRequest<
    ResponseType & { data: { data: UserBadgesInterface[]; count: number } },
    GetParamsType
  >(API_END_POINTS.USER_BADGES, payload);
}

export async function deleteUserBadgeAction(payload: {
  userBadgeIds: string[];
}) {
  return await deleteRequest<
    ResponseType,
    {
      userBadgeIds: string[];
    }
  >(API_END_POINTS.USER_BADGES, payload);
}

export async function assignUserBadgeAction(payload: {
  userId: string;
  badgeId: string;
}) {
  return await postRequest<
    ResponseType,
    {
      userId: string;
      badgeId: string;
    }
  >(API_END_POINTS.USER_BADGES, payload);
}
