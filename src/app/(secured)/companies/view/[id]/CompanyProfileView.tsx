"use client";

import { useState } from "react";
import CompanyOverview from "./sections/CompanyOverview";
import CompanyBranding from "./sections/CompanyBranding";
import CompanyAbout from "./sections/CompanyAbout";
import CompanyAchievements from "./sections/CompanyAchievements";
import CompanyVideos from "./sections/CompanyVideos";
import CompanySkills from "./sections/CompanySkills";
import CompanyTestimonials from "./sections/CompanyTestimonials";
import CompanySentimentSurvey from "./sections/CompanySentimentSurvey";
import CompanyTeamProfiles from "./sections/CompanyTeamProfiles";
import CompanyAwards from "./sections/CompanyAwards";
import CompanyAdminsRoles from "./sections/CompanyAdminsRoles";
import CompanyPrivateDetails from "./sections/CompanyPrivateDetails";
import {
  COMPANY_PROFILE_SECTIONS,
  COMPANY_TAB_STRINGS,
} from "@/components/molecules/company/CompanyTabs/constants";

const CompanyProfileView = () => {
  const [activeSection, setActiveSection] = useState<string>(
    COMPANY_PROFILE_SECTIONS.DEFAULT_SECTION,
  );

  const sections = [
    {
      id: "overview",
      name: COMPANY_TAB_STRINGS.PROFILE.OVERVIEW,
      component: CompanyOverview,
    },
    {
      id: "branding",
      name: COMPANY_TAB_STRINGS.PROFILE.BRANDING,
      component: CompanyBranding,
    },
    {
      id: "about",
      name: COMPANY_TAB_STRINGS.PROFILE.ABOUT,
      component: CompanyAbout,
    },
    {
      id: "achievements",
      name: COMPANY_TAB_STRINGS.PROFILE.ACHIEVEMENTS,
      component: CompanyAchievements,
    },
    {
      id: "videos",
      name: COMPANY_TAB_STRINGS.PROFILE.VIDEOS,
      component: CompanyVideos,
    },
    {
      id: "skills",
      name: COMPANY_TAB_STRINGS.PROFILE.SKILLS,
      component: CompanySkills,
    },
    {
      id: "testimonials",
      name: COMPANY_TAB_STRINGS.PROFILE.TESTIMONIALS,
      component: CompanyTestimonials,
    },
    {
      id: "sentiment",
      name: COMPANY_TAB_STRINGS.PROFILE.SENTIMENT_SURVEY,
      component: CompanySentimentSurvey,
    },
    {
      id: "team",
      name: COMPANY_TAB_STRINGS.PROFILE.TEAM_PROFILES,
      component: CompanyTeamProfiles,
    },
    {
      id: "awards",
      name: COMPANY_TAB_STRINGS.PROFILE.AWARDS,
      component: CompanyAwards,
    },
    // {
    //   id: "groups",
    //   name: COMPANY_TAB_STRINGS.PROFILE.GROUPS_EVENTS,
    //   component: CompanyGroupsEvents,
    // },
    {
      id: "admins",
      name: COMPANY_TAB_STRINGS.PROFILE.ADMINS_ROLES,
      component: CompanyAdminsRoles,
    },
    {
      id: "private",
      name: COMPANY_TAB_STRINGS.PROFILE.PRIVATE_DETAILS,
      component: CompanyPrivateDetails,
    },
  ];

  const ActiveComponent =
    sections.find((s) => s.id === activeSection)?.component || CompanyOverview;

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            {COMPANY_TAB_STRINGS.PROFILE.TITLE}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {COMPANY_TAB_STRINGS.PROFILE.DESCRIPTION}
          </p>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default CompanyProfileView;
