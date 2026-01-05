import { CONNECTED_ACCOUNTS, SOCIAL_ACCOUNTS } from "@/shared/constants";

export interface BackendConnectedAccount {
  type: CONNECTED_ACCOUNTS;
  isConnected: boolean;
}
export interface BackendSocialAccount {
  type: SOCIAL_ACCOUNTS;
  link: string;
}

export type SocialInfo = {
  name: string;
  iconText: string;
  description: string;
  color: string;
};
