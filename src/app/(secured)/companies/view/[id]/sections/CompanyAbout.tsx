"use client";

import { useState } from "react";
import { FIELD_NAMES, STRING, MESSAGES } from "@/shared/strings";
import { FORM_FIELDS_TYPES } from "@/shared/constants";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FieldConfig } from "@/components/molecules/FormBuilder/types";

interface CompanyAboutFormData {
  mission: string;
  vision: string;
  coreValues: string;
  companyBio: string;
}

const CompanyAbout = () => {
  const [isEditing, setIsEditing] = useState(false);

  const defaultValues: CompanyAboutFormData = {
    mission:
      "To empower businesses with innovative technology solutions that drive growth and efficiency.",
    vision:
      "To be the leading technology partner for companies worldwide, creating sustainable digital transformation.",
    coreValues:
      "Innovation, Integrity, Excellence, Collaboration, Customer Success",
    companyBio:
      "Founded in 2018, Synapse Tech Solutions has been at the forefront of digital innovation, helping businesses transform their operations through cutting-edge technology solutions. Our team of experts combines deep industry knowledge with technical excellence to deliver solutions that drive real business value.",
  };

  const onSubmit = (data: CompanyAboutFormData) => {
    console.log("Company About - Edited Data:", {
      section: "Company About",
      data: data,
      timestamp: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formConfig: FieldConfig<CompanyAboutFormData>[] = [
    {
      name: FIELD_NAMES.MISSION,
      label: STRING.MISSION,
      type: FORM_FIELDS_TYPES.TEXTAREA,
      placeholder: "Describe your company's mission...",
      validation: {
        required: MESSAGES.MISSION_REQUIRED,
        maxLength: {
          value: 250,
          message: MESSAGES.MISSION_MAX_LENGTH,
        },
      },
      width: "w-full",
    },
    {
      name: FIELD_NAMES.VISION,
      label: STRING.VISION,
      type: FORM_FIELDS_TYPES.TEXTAREA,
      placeholder: "Describe your company's vision...",
      validation: {
        required: MESSAGES.VISION_REQUIRED,
        maxLength: {
          value: 250,
          message: MESSAGES.VISION_MAX_LENGTH,
        },
      },
      width: "w-full",
    },
    {
      name: FIELD_NAMES.CORE_VALUES,
      label: STRING.CORE_VALUES,
      type: FORM_FIELDS_TYPES.TEXTAREA,
      placeholder: "List your company's core values...",
      validation: {
        required: MESSAGES.CORE_VALUES_REQUIRED,
        maxLength: {
          value: 250,
          message: MESSAGES.CORE_VALUES_MAX_LENGTH,
        },
      },
      width: "w-full",
    },
    {
      name: FIELD_NAMES.COMPANY_BIO,
      label: STRING.COMPANY_BIO,
      type: FORM_FIELDS_TYPES.TEXTAREA,
      placeholder: "Tell your company's story...",
      validation: {
        required: MESSAGES.COMPANY_BIO_REQUIRED,
        maxLength: {
          value: 500,
          message: MESSAGES.COMPANY_BIO_MAX_LENGTH,
        },
      },
      width: "w-full",
    },
  ];

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            About the Company
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="space-y-6">
          {/* Mission */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {STRING.MISSION}
            </div>
            <p className="text-gray-900 dark:text-white">
              {defaultValues.mission}
            </p>
          </div>

          {/* Vision */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {STRING.VISION}
            </div>
            <p className="text-gray-900 dark:text-white">
              {defaultValues.vision}
            </p>
          </div>

          {/* Core Values */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {STRING.CORE_VALUES}
            </div>
            <p className="text-gray-900 dark:text-white">
              {defaultValues.coreValues}
            </p>
          </div>

          {/* Company Bio */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {STRING.COMPANY_BIO}
            </div>
            <p className="text-gray-900 dark:text-white">
              {defaultValues.companyBio}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          About the Company
        </h3>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <FormBuilder
        formConfig={formConfig}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        submitText="Save Changes"
        className="space-y-6"
        secondaryAction={
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        }
        onSecondaryAction={handleCancel}
      />
    </div>
  );
};

export default CompanyAbout;
