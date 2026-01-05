"use server";

import { API_END_POINTS } from "@/shared/api";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/fetcher";
import {
  GetParamsType,
  PromoCode,
  Replace,
  ResponseType,
} from "@/shared/types";

export async function addPromoCodeAction(
  payload: Replace<PromoCode, "users", string[]>,
) {
  return await postRequest<ResponseType, Replace<PromoCode, "users", string[]>>(
    API_END_POINTS.PROMO_CODES,
    payload,
  );
}

export async function updatePromoCodeAction(
  payload: Replace<PromoCode, "users", string[]> & {
    promotionalCodeId: string;
  },
) {
  return await putRequest<
    ResponseType,
    Replace<PromoCode, "users", string[]> & {
      promotionalCodeId: string;
    }
  >(API_END_POINTS.PROMO_CODES, payload);
}

export async function deletePromoCodeAction(payload: {
  promotionalCodeIds: string[];
}) {
  return await deleteRequest<ResponseType, { promotionalCodeIds: string[] }>(
    API_END_POINTS.PROMO_CODES,
    payload,
  );
}

export async function getPromoCodeAction(
  payload: {
    promotionalCodeId?: string;
  } & GetParamsType,
) {
  return await getRequest<
    ResponseType & { data: { data: PromoCode[] } },
    { promotionalCodeId?: string } & GetParamsType
  >(API_END_POINTS.PROMO_CODES, payload);
}

export async function assignPromoCodeAction(payload: {
  promotionalCodeId: string;
  userId: string;
}) {
  return await postRequest<
    ResponseType,
    { promotionalCodeId: string; userId: string }
  >(API_END_POINTS.USER_PROMO_CODES, payload);
}

export async function unassignPromoCodeAction(payload: {
  userPromotionCodeIds: string[];
}) {
  return await deleteRequest<ResponseType, { userPromotionCodeIds: string[] }>(
    API_END_POINTS.USER_PROMO_CODES,
    payload,
  );
}
