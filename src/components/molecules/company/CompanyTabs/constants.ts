export const COMPANY_TABS_CONFIG = {
  TABS: [
    {
      name: "Profile",
      path: "profile",
      icon: "🏢",
      description: "Company profile and information",
    },
    {
      name: "Jobs",
      path: "jobs",
      icon: "💼",
      description: "Job listings and opportunities",
    },
    {
      name: "Applications",
      path: "applications",
      icon: "📝",
      description: "Job applications and candidates",
    },
    {
      name: "Events",
      path: "events",
      icon: "📅",
      description: "Company events and activities",
    },
  ],
  DEFAULT_TAB: "profile",
} as const;

export const COMPANY_PROFILE_SECTIONS = {
  SECTIONS: [
    { id: "overview", name: "Company Overview", component: "CompanyOverview" },
    { id: "branding", name: "Branding", component: "CompanyBranding" },
    { id: "about", name: "About the Company", component: "CompanyAbout" },
    {
      id: "achievements",
      name: "Achievements",
      component: "CompanyAchievements",
    },
    { id: "videos", name: "Videos", component: "CompanyVideos" },
    { id: "skills", name: "Skills", component: "CompanySkills" },
    {
      id: "testimonials",
      name: "Testimonials",
      component: "CompanyTestimonials",
    },
    {
      id: "sentiment",
      name: "Sentiment Survey",
      component: "CompanySentimentSurvey",
    },
    { id: "team", name: "Team Profiles", component: "CompanyTeamProfiles" },
    { id: "awards", name: "Awards", component: "CompanyAwards" },
    { id: "groups", name: "Groups/Events", component: "CompanyGroupsEvents" },
    { id: "admins", name: "Admins & Roles", component: "CompanyAdminsRoles" },
    {
      id: "private",
      name: "Private Details",
      component: "CompanyPrivateDetails",
    },
  ],
  DEFAULT_SECTION: "overview",
} as const;

export const COMPANY_TAB_STRINGS = {
  PROFILE: {
    TITLE: "Company Profile",
    DESCRIPTION: "Manage company information and settings",
    OVERVIEW: "Company Overview",
    BRANDING: "Branding",
    ABOUT: "About the Company",
    ACHIEVEMENTS: "Achievements",
    VIDEOS: "Videos",
    SKILLS: "Skills",
    TESTIMONIALS: "Testimonials",
    SENTIMENT_SURVEY: "Sentiment Survey",
    TEAM_PROFILES: "Team Profiles",
    AWARDS: "Awards",
    GROUPS_EVENTS: "Groups/Events",
    ADMINS_ROLES: "Admins & Roles",
    PRIVATE_DETAILS: "Private Details",
  },
  JOBS: {
    TITLE: "Jobs",
    DESCRIPTION: "Manage job listings and opportunities",
  },
  APPLICATIONS: {
    TITLE: "Applications",
    DESCRIPTION: "View and manage job applications",
  },
  EVENTS: {
    TITLE: "Events",
    DESCRIPTION: "Manage company events and activities",
  },
} as const;
