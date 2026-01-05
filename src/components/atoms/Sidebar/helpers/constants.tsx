import {
  // BookText,
  // CreditCard,
  LayoutDashboard,
  LucideProps,
  // Stars,
  // TicketPercent,
  UserCog,
  Gamepad2,
  History as HistoryIcon,
  Settings,
  MessageCircle,
  Gift,
  // Building,
  // Medal,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { ROUTES } from "@/shared/routes";

export type NavItem = {
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  path?: string;
  activePaths?: string[];
  children?: NavItem[];
  badge?: string;
};

export const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboards",
    path: ROUTES.DASHBOARD,
    activePaths: [ROUTES.DASHBOARD_ANALYTICS],
    badge: "5",
    children: [
      {
        label: "Analytics",
        path: ROUTES.DASHBOARD_ANALYTICS,
        activePaths: [ROUTES.DASHBOARD_ANALYTICS],
      },
      // {
      //   label: "CRM",
      //   path: ROUTES.DASHBOARD_CRM,
      //   activePaths: [ROUTES.DASHBOARD_CRM],
      // },
    ],
  },
  {
    icon: UserCog,
    label: "Users",
    path: ROUTES.USERS,
    activePaths: [ROUTES.USERS],
    children: [
      {
        label: "List",
        path: ROUTES.USERS_LIST,
        activePaths: [ROUTES.USERS_LIST],
      },
      // {
      //   label: "View",
      //   path: ROUTES.USERS_VIEW,
      //   activePaths: [ROUTES.USERS_VIEW],
      //   children: [
      //     {
      //       label: "Account",
      //       path: ROUTES.USERS_VIEW_ACCOUNT,
      //       activePaths: [ROUTES.USERS_VIEW_ACCOUNT],
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: Gamepad2,
    label: "Game Configs",
    path: ROUTES.GAME_CONFIGS,
    activePaths: [ROUTES.GAME_CONFIGS],
    children: [
      {
        label: "List",
        path: ROUTES.GAME_CONFIGS_LIST,
        activePaths: [ROUTES.GAME_CONFIGS_LIST],
      },
    ],
  },
  {
    icon: HistoryIcon,
    label: "Bets History",
    path: ROUTES.BETS_HISTORY,
    activePaths: [ROUTES.BETS_HISTORY],
    children: [
      {
        label: "List",
        path: ROUTES.BETS_HISTORY_LIST,
        activePaths: [ROUTES.BETS_HISTORY_LIST],
      },
    ],
  },
  {
    icon: Settings,
    label: "Configs",
    path: ROUTES.CONFIGS,
    activePaths: [ROUTES.CONFIGS],
    children: [
      {
        label: "List",
        path: ROUTES.CONFIGS_LIST,
        activePaths: [ROUTES.CONFIGS_LIST],
      },
    ],
  },
  {
    icon: MessageCircle,
    label: "Chat",
    path: ROUTES.CHAT,
    activePaths: [ROUTES.CHAT, ROUTES.CHAT_MESSAGES],
    children: [
      {
        label: "Rooms",
        path: ROUTES.CHAT_ROOMS_LIST,
        activePaths: [ROUTES.CHAT_ROOMS_LIST, ROUTES.CHAT_MESSAGES],
      },
      {
        label: "Live Chat",
        path: ROUTES.CHAT_LIVE,
        activePaths: [ROUTES.CHAT_LIVE],
      },
    ],
  },
  {
    icon: Gift,
    label: "Bonus Slides",
    path: ROUTES.BONUS_SLIDES,
    activePaths: [ROUTES.BONUS_SLIDES],
    children: [
      {
        label: "List",
        path: ROUTES.BONUS_SLIDES_LIST,
        activePaths: [
          ROUTES.BONUS_SLIDES_LIST,
          ROUTES.BONUS_SLIDES_ADD,
          ROUTES.BONUS_SLIDES_EDIT,
        ],
      },
    ],
  },
  // {
  //   icon: Building,
  //   label: "Companies",
  //   path: ROUTES.COMPANIES,
  //   activePaths: [ROUTES.COMPANIES],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.COMPANIES_LIST,
  //       activePaths: [ROUTES.COMPANIES_LIST],
  //     },
  //     // {
  //     //   label: "View",
  //     //   path: ROUTES.COMPANIES_VIEW,
  //     //   activePaths: [ROUTES.COMPANIES_VIEW],
  //     //   children: [
  //     //     {
  //     //       label: "Jobs",
  //     //       path: ROUTES.COMPANIES_VIEW_JOBS,
  //     //       activePaths: [ROUTES.COMPANIES_VIEW_JOBS],
  //     //     },
  //     //   ],
  //     // },
  //   ],
  // },
  // {
  //   icon: BookText,
  //   label: "Invoices",
  //   activePaths: [ROUTES.INVOICES_LIST],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.INVOICES_LIST,
  //       activePaths: [ROUTES.INVOICES_LIST],
  //     },
  //     {
  //       label: "Preview",
  //       path: ROUTES.INVOICES_PREVIEW,
  //       activePaths: [ROUTES.INVOICES_PREVIEW],
  //     },
  //     {
  //       label: "Add",
  //       path: ROUTES.INVOICES_ADD,
  //       activePaths: [ROUTES.INVOICES_ADD],
  //     },
  //     {
  //       label: "Edit",
  //       path: ROUTES.INVOICES_EDIT,
  //       activePaths: [ROUTES.INVOICES_EDIT],
  //     },
  //   ],
  // },
  // {
  //   icon: CreditCard,
  //   label: "Transactions",
  //   activePaths: [ROUTES.TRANSACTIONS_LIST],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.TRANSACTIONS_LIST,
  //       activePaths: [ROUTES.TRANSACTIONS_LIST],
  //     },
  //   ],
  // },
  // {
  //   icon: Stars,
  //   label: "Subscriptions",
  //   activePaths: [ROUTES.SUBSCRIPTIONS_LIST],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.SUBSCRIPTIONS_LIST,
  //       activePaths: [ROUTES.SUBSCRIPTIONS_LIST],
  //     },
  //   ],
  // },
  // {
  //   icon: Medal,
  //   label: "Badges",
  //   activePaths: [ROUTES.BADGES],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.BADGES_LIST,
  //       activePaths: [ROUTES.BADGES_LIST],
  //     },
  //     {
  //       label: "Add",
  //       path: ROUTES.BADGES_ADD,
  //       activePaths: [ROUTES.BADGES_ADD],
  //     },
  //     {
  //       label: "Edit",
  //       path: ROUTES.BADGES_EDIT,
  //       activePaths: [ROUTES.BADGES_EDIT],
  //     },
  //   ],
  // },
  // {
  //   icon: TicketPercent,
  //   label: "Promo Codes",
  //   activePaths: [ROUTES.PROMO_CODES_LIST],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.PROMO_CODES_LIST,
  //       activePaths: [ROUTES.PROMO_CODES_LIST],
  //     },
  //   ],
  // },
  // {
  //   icon: TicketPercent,
  //   label: "Events",
  //   activePaths: [ROUTES.EVENTS_LIST],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.EVENTS_LIST,
  //       activePaths: [ROUTES.EVENTS_LIST],
  //     },
  //   ],
  // },
  // {
  //   icon: TicketPercent,
  //   label: "Groups",
  //   activePaths: [ROUTES.GROUPS_LIST],
  //   children: [
  //     {
  //       label: "List",
  //       path: ROUTES.GROUPS_LIST,
  //       activePaths: [ROUTES.GROUPS_LIST],
  //     },
  //   ],
  // },
];
