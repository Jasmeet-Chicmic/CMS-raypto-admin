"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { SKILLS_CONFIG } from "./helpers/constants";

interface SkillCategory {
  name: string;
  skills: string[];
}

interface CompanySkillsFormData {
  skillCategories: SkillCategory[];
}

const CompanySkills = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanySkillsFormData = {
    skillCategories: [
      {
        name: SKILLS_CONFIG.SKILLS_TYPE.TECHNOLOGY,
        skills: [
          SKILLS_CONFIG.SKILLS_OPTIONS.JAVASCRIPT,
          SKILLS_CONFIG.SKILLS_OPTIONS.REACT,
          SKILLS_CONFIG.SKILLS_OPTIONS.NODE_JS,
          SKILLS_CONFIG.SKILLS_OPTIONS.PYTHON,
          SKILLS_CONFIG.SKILLS_OPTIONS.AWS,
        ],
      },
      {
        name: SKILLS_CONFIG.SKILLS_TYPE.DESIGN,
        skills: [
          SKILLS_CONFIG.SKILLS_OPTIONS.UI_UX_DESIGN,
          SKILLS_CONFIG.SKILLS_OPTIONS.FIGMA,
          SKILLS_CONFIG.SKILLS_OPTIONS.ADOBE_CREATIVE_SUITE,
          SKILLS_CONFIG.SKILLS_OPTIONS.PROTOTYPING,
        ],
      },
      {
        name: SKILLS_CONFIG.SKILLS_TYPE.BUSINESS,
        skills: [
          SKILLS_CONFIG.SKILLS_OPTIONS.PROJECT_MANAGEMENT,
          SKILLS_CONFIG.SKILLS_OPTIONS.STRATEGIC_PLANNING,
          SKILLS_CONFIG.SKILLS_OPTIONS.MARKET_ANALYSIS,
        ],
      },
      {
        name: SKILLS_CONFIG.SKILLS_TYPE.COMMUNICATION,
        skills: [
          SKILLS_CONFIG.SKILLS_OPTIONS.PUBLIC_SPEAKING,
          SKILLS_CONFIG.SKILLS_OPTIONS.TECHNICAL_WRITING,
          SKILLS_CONFIG.SKILLS_OPTIONS.CLIENT_RELATIONS,
        ],
      },
    ],
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: {},
    reset,
  } = useForm<CompanySkillsFormData>({
    defaultValues,
  });

  const watchedCategories = watch("skillCategories");

  const onSubmit = (data: CompanySkillsFormData) => {
    console.log("Company Skills - Edited Data:", {
      section: "Company Skills",
      data: data,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send data to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Skills
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="space-y-6">
          {defaultValues.skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
            >
              <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white mb-4">
                {category.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Skills
        </h3>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {defaultValues.skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
            >
              <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white mb-4">
                {category.name}
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Skills
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.values(SKILLS_CONFIG.SKILLS_OPTIONS).map(
                      (skill, skillIndex) => (
                        <label
                          key={skillIndex}
                          className="flex items-center space-x-2 hover:cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={skill}
                            {...register(
                              `skillCategories.${categoryIndex}.skills` as const,
                            )}
                            className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {skill}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedCategories?.[categoryIndex]?.skills?.map(
                      (skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySkills;
