"use client";

import { useState } from "react";
import {
  COUNTRIES,
  COUNTRY_NAMES,
  INDUSTRY_SECTOR_NAMES,
  INDUSTRY_SECTORS,
  FORM_FIELDS_TYPES,
} from "@/shared/constants";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FieldConfig } from "@/components/molecules/FormBuilder/types";
import { FIELD_NAMES, MESSAGES, REGEX, STRING } from "@/shared/strings";
import { CompanyOverviewFormData } from "./helpers/types";

export type StringKey = keyof typeof STRING;

const CompanyOverview = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanyOverviewFormData = {
    companyName: "Synapse Tech Solutions",
    sector: INDUSTRY_SECTORS.TECHNOLOGY.toString(),
    country: COUNTRIES.AUSTRALIA.toString(),
    email: "info@synapsetech.com",
    contactNumber: "+1-234-567-8901",
    employeeCount: "1-10",
    website: "https://synapsetech.com",
    headquarters: "Sydney, Australia",
    services: [
      "Software Development",
      "Cloud Solutions",
      "AI/ML",
      "Consulting",
      "Digital Transformation",
      "Cybersecurity",
    ],
  };

  const onSubmit = (data: CompanyOverviewFormData) => {
    console.log("Company Overview - Edited Data:", {
      section: "Company Overview",
      data: data,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send data to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const EMPLOYEE_COUNT_OPTIONS = [
    { label: "1-10 employees", value: "1-10" },
    { label: "11-50 employees", value: "11-50" },
    { label: "51-100 employees", value: "51-100" },
  ];
  // Form configuration for FormBuilder using standardized constants
  const formConfig: FieldConfig<CompanyOverviewFormData>[] = [
    {
      name: FIELD_NAMES.COMPANY_NAME,
      label: STRING.COMPANY_NAME,
      type: FORM_FIELDS_TYPES.TEXT,
      placeholder: "Enter company name",
      validation: {
        required: MESSAGES.COMPANY_NAME_REQUIRED,
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.SECTOR,
      label: STRING.SECTOR,
      type: FORM_FIELDS_TYPES.SELECT,
      options: Object.entries(INDUSTRY_SECTOR_NAMES).map(([key, value]) => ({
        label: value,
        value: key,
      })),
      validation: {
        required: MESSAGES.SECTOR_REQUIRED,
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.HEADQUARTERS,
      label: STRING.HEADQUARTERS,
      type: FORM_FIELDS_TYPES.TEXT,
      placeholder: "Enter headquarters location",
      validation: {
        required: MESSAGES.HEADQUARTERS_REQUIRED,
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.EMPLOYEE_COUNT,
      label: STRING.EMPLOYEE_COUNT,
      type: FORM_FIELDS_TYPES.SELECT,
      options: EMPLOYEE_COUNT_OPTIONS,
      validation: {
        required: MESSAGES.EMPLOYEE_COUNT_REQUIRED,
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.WEBSITE,
      label: STRING.WEBSITE,
      type: FORM_FIELDS_TYPES.TEXT,
      placeholder: "https://example.com",
      validation: {
        pattern: {
          value: REGEX.URL,
          message: MESSAGES.INVALID_URL,
        },
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.EMAIL,
      label: STRING.EMAIL,
      type: FORM_FIELDS_TYPES.EMAIL,
      placeholder: "Enter contact email",
      validation: {
        required: MESSAGES.EMAIL_REQUIRED,
        pattern: {
          value: REGEX.EMAIL,
          message: MESSAGES.INVALID_EMAIL,
        },
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.CONTACT,
      label: STRING.CONTACT,
      type: FORM_FIELDS_TYPES.PHONE,
      placeholder: "Enter contact number",
      validation: {
        required: MESSAGES.CONTACT_REQUIRED,
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.COUNTRY,
      label: STRING.COUNTRY,
      type: FORM_FIELDS_TYPES.SELECT,
      options: Object.entries(COUNTRY_NAMES).map(([key, value]) => ({
        label: value,
        value: key,
      })),
      validation: {
        required: MESSAGES.COUNTRY_REQUIRED,
      },
      width: "w-full md:w-1/2",
    },
    {
      name: FIELD_NAMES.SERVICES,
      label: STRING.SERVICES,
      type: FORM_FIELDS_TYPES.ARRAY,
      items: {
        type: FORM_FIELDS_TYPES.TEXT,
      },
      width: "w-full",
    },
  ];

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Company Overview
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.COMPANY_NAME}
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {defaultValues.companyName}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.SECTOR}
              </div>
              <p className="text-gray-900 dark:text-white">
                {
                  INDUSTRY_SECTOR_NAMES[
                    defaultValues.sector as unknown as keyof typeof INDUSTRY_SECTOR_NAMES
                  ]
                }
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.HEADQUARTERS}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.headquarters}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.EMPLOYEE_COUNT}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.employeeCount} employees
              </p>
            </div>
          </div>

          {/* Contact & Website */}
          <div className="space-y-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.WEBSITE}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.website ? (
                  <a
                    href={defaultValues.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {defaultValues.website}
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.EMAIL}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.email}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.CONTACT}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.contactNumber}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.COUNTRY}
              </div>
              <p className="text-gray-900 dark:text-white">
                {
                  COUNTRY_NAMES[
                    defaultValues.country as unknown as keyof typeof COUNTRY_NAMES
                  ]
                }
              </p>
            </div>
          </div>
        </div>

        {/* Services/Tags */}
        <div className="mt-6">
          <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {STRING.SERVICES}
          </div>
          <div className="flex flex-wrap gap-2">
            {defaultValues.services?.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Company Overview
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

export default CompanyOverview;
