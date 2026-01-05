const API_VERSION = "v1";
const API_VERSION_V2 = "v2";

export const API_END_POINTS = {
  LOGIN: `${API_VERSION}/admin/login`,
  LOGIN_VERIFY: `${API_VERSION}/admin/loginVerify`,
  FORGOT_PASSWORD: `${API_VERSION}/admin/forgotPassword`,
  RESET_PASSWORD: `${API_VERSION}/admin/resetPassword`,
  LOGOUT: `${API_VERSION}/admin/logout`,
  USER: `${API_VERSION}/user/list-admin`,
  USER_UPDATE: `${API_VERSION}/user`,
  USER_STATS: `${API_VERSION}/user/stats`,
  LOGOUT_USER: `${API_VERSION}/user/logout-admin`,
  INVOICES: `${API_VERSION}/invoices`,
  INVOICES_STATS: `${API_VERSION}/invoices/stats`,
  INVOICES_DETAILS: `${API_VERSION}/invoices/details`,
  INVOICES_DOWNLOAD: `${API_VERSION}/invoices/downloadInvoice`,
  PROJECTS: `${API_VERSION}/projects`,
  CLIENTS: `${API_VERSION}/clients`,
  USER_ACTIVITY: `${API_VERSION}/userActivity`,
  USER_LOGIN_TACKING: `${API_VERSION}/user/loginTracking`,
  PRODUCT_POPULAR: `${API_VERSION}/product/popular`,

  // Dashboard Endpoints
  WEBSITE_ANALYTICS: `${API_VERSION}/dashboard/websiteAnalytics`,
  AVERAGE_DAILY_SALES: `${API_VERSION}/dashboard/averageDailySales`,
  SALES_OVERVIEW: `${API_VERSION}/dashboard/salesOverview`,
  EARNINGS_REPORT: `${API_VERSION_V2}/dashboard/earningsReport`,
  SUPPORT_TICKETS: `${API_VERSION}/dashboard/supportTickets`,
  SALES_BY_COUNTRY: `${API_VERSION}/dashboard/salesByCountry`,
  TOTAL_EARNINGS: `${API_VERSION}/dashboard/totalEarnings`,
  TOP_TRANSACTIONS: `${API_VERSION}/product/topTransaction`,
  TRANSACTIONS: `${API_VERSION}/transaction`,
  USER_TRANSACTIONS: `${API_VERSION}/transaction`,
  TRANSACTION_STATS: `${API_VERSION}/transaction/stats`,
  DASHBOARD_STATS: `${API_VERSION}/dashboard/stats`,
  DASHBOARD_ACTIVITY: `${API_VERSION}/dashboard/activity`,
  DASHBOARD_COUNTRY: `${API_VERSION}/dashboard/country`,

  PAYMENY_METHODS: `${API_VERSION}/paymentMethods`,
  INVOICE_COUNTER: `${API_VERSION}/counters`,

  SUBSCRIPTION_PLANS: `${API_VERSION}/subscriptionPlans`,
  SUBSCRIPTION_USERS: `${API_VERSION}/subscriptionPlans/purchaseHistory`,

  CURRENT_SUBSCRIPTION: `${API_VERSION}/user/currentSubscription`,
  UPGRADE_USER_PLAN: `${API_VERSION}/user/upgradeSubscription`,
  CANCEL_USER_SUBSCRIPTION: `${API_VERSION}/user/cancelSubscription`,
  BADGES: `${API_VERSION}/badges`,
  USER_BADGES: `${API_VERSION}/userBadges`,
  PAYMENT_METHODS: `${API_VERSION}/paymentMethods`,
  PROMO_CODES: `${API_VERSION}/promotionalCodes`,
  USER_PROMO_CODES: `${API_VERSION}/userPromotionCodes`,

  //Company Endpoints
  COMPANY: `${API_VERSION}/companies`,
  UPLOAD_BADGE_IMAGE: `${API_VERSION}/file/upload`,

  //Jobs
  JOBS: `${API_VERSION}/jobs`,
  APPLICATIONS: `${API_VERSION}/jobApplications`,

  // Game Configs
  GAME_CONFIGS: `${API_VERSION}/game-configs`,
  GAME_STATS: `${API_VERSION}/games/stats`,
  REVENUE_PER_GAME: `${API_VERSION}/games/revenue-per-game`,
  GAME_PLAYED: `${API_VERSION}/games/games-played`,

  // Bets History
  BETS_HISTORY: `${API_VERSION}/games/bets-history-admin`,
  BIG_BETS_HISTORY: `${API_VERSION}/games/big-bets-history`,

  // Config
  CONFIG: `${API_VERSION}/config`,

  // Chat
  CHAT_ROOMS: `${API_VERSION}/chat/rooms`,
  CHAT: `${API_VERSION}/chat`,

  // Bonus Slides
  BONUS_SLIDES: `${API_VERSION}/bonus/slide`,
  BONUS_SLIDE_BY_ID: `${API_VERSION}/bonus/slide/fetch-by-id`,
  BONUS_SLIDE_IS_ACTIVE: `${API_VERSION}/bonus/slide/is-active`,
  FILE_UPLOAD: `${API_VERSION}/file/upload`,
};
