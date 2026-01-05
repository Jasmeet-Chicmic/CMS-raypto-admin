import { CONNECTED_ACCOUNTS, SOCIAL_ACCOUNTS } from "@/shared/constants";

import { SocialInfo } from "./types";

export const CONNECTED_ACCOUNT_UI_MAP = {
  [CONNECTED_ACCOUNTS.GOOGLE]: {
    name: "Google",
    description: "Calendar and contacts",
    iconText: "G",
    color: "bg-blue-500",
  },
  [CONNECTED_ACCOUNTS.SLACK]: {
    name: "Slack",
    description: "Communication",
    iconText: "#",
    color: "bg-purple-700",
  },
  [CONNECTED_ACCOUNTS.GITHUB]: {
    name: "Github",
    description: "Manage your Git repositories",
    iconText: "#",
    color: "bg-black",
  },
  [CONNECTED_ACCOUNTS.MAILCHIMP]: {
    name: "Mailchimp",
    description: "Email marketing service",
    iconText: "M",
    color: "bg-yellow-400 text-black",
  },
  [CONNECTED_ACCOUNTS.ASANA]: {
    name: "Asana",
    description: "Communication",
    iconText: "A",
    color: "bg-red-400",
  },
} as const;

export const SOCIAL_TYPE_MAP: Record<SOCIAL_ACCOUNTS, SocialInfo> = {
  [SOCIAL_ACCOUNTS.FACEBOOK]: {
    name: "Facebook",
    description: "Connect your Facebook page",
    color: "bg-blue-600",
    iconText: "f",
  },
  [SOCIAL_ACCOUNTS.TWITTER]: {
    name: "Twitter",
    description: "Connect your Twitter (X) account",
    color: "bg-black",
    iconText: "𝕏",
  },
  [SOCIAL_ACCOUNTS.LINKEDIN]: {
    name: "LinkedIn",
    description: "Connect your LinkedIn profile",
    color: "bg-blue-700",
    iconText: "in",
  },
  [SOCIAL_ACCOUNTS.DRIBBLE]: {
    name: "Dribbble",
    description: "Showcase your creative work",
    color: "bg-pink-500",
    iconText: "●",
  },
  [SOCIAL_ACCOUNTS.BEHANCE]: {
    name: "Behance",
    description: "Connect your Behance portfolio",
    color: "bg-blue-500",
    iconText: "Be",
  },
};
