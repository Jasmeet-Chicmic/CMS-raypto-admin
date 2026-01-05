"use server";

import { API_END_POINTS } from "@/shared/api";
import { postRequest } from "@/shared/fetcher";
import { ResponseType } from "@/shared/types";

export async function loginAction(payload: {
  email: string;
  password: string;
}) {
  return await postRequest<
    Omit<ResponseType, "data"> & {
      data: {
        token: string;
        admin: {
          email: string;
          name: string;
          _id: string;
        };
      };
    },
    { email: string; password: string }
  >(API_END_POINTS.LOGIN, payload);
}

export async function forgotPassowrdAction(payload: { email: string }) {
  return await postRequest<ResponseType, { email: string }>(
    API_END_POINTS.FORGOT_PASSWORD,
    payload,
  );
}

export async function resetPassowordAction({
  resetPasswordToken,
  password,
}: {
  resetPasswordToken: string;
  password: string;
}) {
  return await postRequest<ResponseType, { password: string }>(
    API_END_POINTS.RESET_PASSWORD,
    { password },
    {
      headers: {
        Authorization: resetPasswordToken,
      },
    },
  );
}

export async function logoutAction() {
  return await postRequest<ResponseType, object>(API_END_POINTS.LOGOUT, {});
}
