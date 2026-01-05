export const SECTION_CONFIG = {
  OVERVIEW: {
    TITLE: "Company Overview",
    DESCRIPTION: "Basic company information and details",
    FIELDS: {
      COMPANY_NAME: "Company Name",
      INDUSTRY_SECTOR: "Industry & Sector",
      HEADQUARTERS: "Headquarters Location",
      COMPANY_SIZE: "Company Size (Employees)",
      WEBSITE_URL: "Website URL",
      SERVICES_TAGS: "Services/Tags (max 6)",
    },
  },
  BRANDING: {
    TITLE: "Branding",
    DESCRIPTION: "Company logo, cover image, and tagline",
    FIELDS: {
      LOGO: "Company Logo",
      COVER_IMAGE: "Cover Image",
      TAGLINE: "Tagline",
    },
  },
  ABOUT: {
    TITLE: "About the Company",
    DESCRIPTION: "Mission, vision, and company information",
    FIELDS: {
      MISSION: "Mission (max 250 characters)",
      VISION: "Vision (max 250 characters)",
      CORE_VALUES: "Core Values (max 250 characters)",
      COMPANY_BIO: "Company Bio (max 500 characters)",
    },
  },
  ACHIEVEMENTS: {
    TITLE: "Achievements",
    DESCRIPTION: "Projects, case studies, and accomplishments",
    FIELDS: {
      TITLE: "Title",
      DESCRIPTION: "Description (max 500 characters)",
      YEAR: "Year",
      CATEGORY: "Category",
    },
  },
  VIDEOS: {
    TITLE: "Videos (Show Your Expertise)",
    DESCRIPTION: "Company videos and presentations",
    LIMITS: {
      MAX_VIDEOS: 3,
      MAX_DURATION: "3 minutes",
    },
  },
  SKILLS: {
    TITLE: "Skills",
    DESCRIPTION: "Company skills and expertise areas",
    CATEGORIES: {
      TECHNOLOGY: "Technology",
      BUSINESS: "Business",
      DESIGN: "Design",
      INDUSTRY: "Industry",
    },
  },
  TESTIMONIALS: {
    TITLE: "Testimonials",
    DESCRIPTION: "Customer and client testimonials",
    ACTIONS: {
      APPROVE: "Approve",
      REJECT: "Reject",
      FLAG: "Flag",
    },
  },
  SENTIMENT_SURVEY: {
    TITLE: "Sentiment Survey Results",
    DESCRIPTION: "Customer satisfaction and feedback analytics",
    RESPONSES: {
      LIKELY: "Likely",
      UNLIKELY: "Unlikely",
      NEUTRAL: "Neutral",
    },
  },
  TEAM_PROFILES: {
    TITLE: "Team Profiles",
    DESCRIPTION: "Company team members and staff",
    ROLES: {
      ADMIN: "Admin",
      MEMBER: "Member",
      VIEWER: "Viewer",
    },
  },
  AWARDS: {
    TITLE: "Achievements Section",
    DESCRIPTION: "Awards, recognitions, and achievements",
    FIELDS: {
      TITLE: "Title",
      YEAR: "Year",
      ORGANIZATION: "Awarding Organization",
      BADGE_IMAGE: "Badge/Image",
    },
  },
  GROUPS_EVENTS: {
    TITLE: "Groups / Events / Initiatives",
    DESCRIPTION: "Company groups, events, and initiatives",
    TYPES: {
      EVENT: "Event",
      GROUP: "Group",
      INITIATIVE: "Initiative",
    },
  },
  ADMINS_ROLES: {
    TITLE: "Company Admins & Roles",
    DESCRIPTION: "Administrative users and permissions",
    ROLES: {
      SUPER_ADMIN: "Super Admin",
      EDITOR: "Editor",
      VIEWER: "Viewer",
    },
  },
  PRIVATE_DETAILS: {
    TITLE: "Private Details",
    DESCRIPTION: "Administrative information (Admin only)",
    FIELDS: {
      REVENUE: "Revenue/Turnover",
      CONTACT_EMAIL: "Contact Email",
      CONTACT_PHONE: "Contact Phone",
      LAST_UPDATED: "Last Updated",
      CREATED_DATE: "Created Date",
    },
  },
} as const;

export const SECTION_STRINGS = {
  EDIT: "Edit",
  CANCEL: "Cancel",
  SAVE_CHANGES: "Save Changes",
  ADD: "Add",
  REMOVE: "Remove",
  VIEW_DETAILS: "View Details",
  NO_DATA: "No data available",
  LOADING: "Loading...",
  ERROR: "Error loading data",
} as const;
export const COMPANY_BRANDING = {
  BRAND_GUIDELINES: [
    "Logo should be high resolution and scalable",
    "Cover image should represent your company culture",
    "Tagline should be concise and memorable",
    "All images should be professional and on-brand",
    "Supported formats: PNG, JPG, JPEG",
    "Logo max size: 2MB, Cover max size: 5MB",
  ],
  IMAGES_GUIDELINES: {
    COMPANY_LOGO: "Recommended: 200x200px, PNG or JPG (max 2MB)",
    COVER_IMAGE: "Recommended: 1200x600px, PNG or JPG (max 5MB)",
  },
};

export const SKILLS_CONFIG = {
  SKILLS_OPTIONS: {
    JAVASCRIPT: "JavaScript",
    REACT: "React",
    NODE_JS: "Node.js",
    PYTHON: "Python",
    JAVA: "Java",
    CPP: "C++",
    CSHARP: "C#",
    PHP: "PHP",
    RUBY: "Ruby",
    GO: "Go",
    RUST: "Rust",
    SWIFT: "Swift",
    KOTLIN: "Kotlin",
    TYPESCRIPT: "TypeScript",
    ANGULAR: "Angular",
    VUE_JS: "Vue.js",
    NEXT_JS: "Next.js",
    EXPRESS_JS: "Express.js",
    DJANGO: "Django",
    FLASK: "Flask",
    SPRING_BOOT: "Spring Boot",
    LARAVEL: "Laravel",
    AWS: "AWS",
    AZURE: "Azure",
    GOOGLE_CLOUD: "Google Cloud",
    DOCKER: "Docker",
    KUBERNETES: "Kubernetes",
    JENKINS: "Jenkins",
    GIT: "Git",
    MONGODB: "MongoDB",
    POSTGRESQL: "PostgreSQL",
    MYSQL: "MySQL",
    REDIS: "Redis",
    ELASTICSEARCH: "Elasticsearch",
    UI_UX_DESIGN: "UI/UX Design",
    FIGMA: "Figma",
    ADOBE_CREATIVE_SUITE: "Adobe Creative Suite",
    SKETCH: "Sketch",
    INVISION: "InVision",
    PROTOTYPING: "Prototyping",
    WIREFRAMING: "Wireframing",
    USER_RESEARCH: "User Research",
    DESIGN_SYSTEMS: "Design Systems",
    PROJECT_MANAGEMENT: "Project Management",
    AGILE: "Agile",
    SCRUM: "Scrum",
    KANBAN: "Kanban",
    JIRA: "JIRA",
    TRELLO: "Trello",
    STRATEGIC_PLANNING: "Strategic Planning",
    MARKET_ANALYSIS: "Market Analysis",
    BUSINESS_DEVELOPMENT: "Business Development",
    SALES: "Sales",
    MARKETING: "Marketing",
    CUSTOMER_SUCCESS: "Customer Success",
    PRODUCT_MANAGEMENT: "Product Management",
    PUBLIC_SPEAKING: "Public Speaking",
    TECHNICAL_WRITING: "Technical Writing",
    CLIENT_RELATIONS: "Client Relations",
    NEGOTIATION: "Negotiation",
    LEADERSHIP: "Leadership",
    TEAM_BUILDING: "Team Building",
    MENTORING: "Mentoring",
    TRAINING: "Training",
    CONSULTING: "Consulting",
  },
  SKILLS_TYPE: {
    TECHNOLOGY: "Technology",
    DESIGN: "Design",
    BUSINESS: "Business",
    COMMUNICATION: "Communication",
  },
};

export const TEAM_PROFILE_CONFIG = {
  TEAM_POSITIONS: {
    CEO_FOUNDER: "CEO & Founder",
    CTO: "CTO",
    SENIOR_DEVELOPER: "Senior Developer",
    UI_UX_DESIGNER: "UI/UX Designer",
    BUSINESS_ANALYST: "Business Analyst",
  } as const,
  TEAM_STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  } as const,

  TEAM_ROLES: {
    ADMIN: "admin",
    MEMBER: "member",
    VIEWER: "viewer",
  } as const,
};

export type TeamStatus =
  (typeof TEAM_PROFILE_CONFIG.TEAM_STATUS)[keyof typeof TEAM_PROFILE_CONFIG.TEAM_STATUS];
export type TeamRole =
  (typeof TEAM_PROFILE_CONFIG.TEAM_ROLES)[keyof typeof TEAM_PROFILE_CONFIG.TEAM_ROLES];
