"use client";

import { useState } from "react";
import { FIELD_NAMES, STRING, MESSAGES } from "@/shared/strings";
import { FORM_FIELDS_TYPES } from "@/shared/constants";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FieldConfig } from "@/components/molecules/FormBuilder/types";

interface CompanyPrivateDetailsFormData {
  revenue: string;
  turnover: string;
  contactEmail: string;
  contactPhone: string;
  lastUpdated: string;
  createdDate: string;
  notes: string;
}

const CompanyPrivateDetails = () => {
  const [isEditing, setIsEditing] = useState(false);

  const defaultValues: CompanyPrivateDetailsFormData = {
    revenue: "$5,000,000",
    turnover: "$2,500,000",
    contactEmail: "admin@synapsetech.com",
    contactPhone: "+1-555-123-4567",
    lastUpdated: "2024-01-15",
    createdDate: "2018-03-20",
    notes:
      "High-value client with premium support package. Requires special attention for enterprise features.",
  };

  const onSubmit = (data: CompanyPrivateDetailsFormData) => {
    console.log("Company Private Details - Edited Data:", {
      section: "Company Private Details",
      data: data,
      timestamp: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formConfig: FieldConfig<CompanyPrivateDetailsFormData>[] = [
    // Financial Information Section
    {
      name: FIELD_NAMES.REVENUE,
      label: STRING.REVENUE,
      type: FORM_FIELDS_TYPES.TEXT,
      placeholder: "$1,000,000",
      validation: {
        required: MESSAGES.REVENUE_REQUIRED,
      },
      width: "w-full",
    },
    {
      name: FIELD_NAMES.TURNOVER,
      label: STRING.TURNOVER,
      type: FORM_FIELDS_TYPES.TEXT,
      placeholder: "$500,000",
      validation: {
        required: MESSAGES.TURNOVER_REQUIRED,
      },
      width: "w-full",
    },
    // Contact Information Section
    {
      name: FIELD_NAMES.CONTACT_EMAIL,
      label: STRING.CONTACT_EMAIL,
      type: FORM_FIELDS_TYPES.EMAIL,
      placeholder: "admin@company.com",
      validation: {
        required: MESSAGES.CONTACT_EMAIL_REQUIRED,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: MESSAGES.INVALID_EMAIL,
        },
      },
      width: "w-full",
    },
    {
      name: FIELD_NAMES.CONTACT_PHONE,
      label: STRING.CONTACT_PHONE,
      type: FORM_FIELDS_TYPES.PHONE,
      placeholder: "+1-555-123-4567",
      validation: {
        required: MESSAGES.CONTACT_PHONE_REQUIRED,
      },
      width: "w-full",
    },
    // Dates Section
    {
      name: FIELD_NAMES.CREATED_DATE,
      label: STRING.CREATED_DATE,
      type: FORM_FIELDS_TYPES.DATE,
      validation: {
        required: MESSAGES.CREATED_DATE_REQUIRED,
      },
      width: "w-full",
    },
    {
      name: FIELD_NAMES.LAST_UPDATED,
      label: STRING.LAST_UPDATED,
      type: FORM_FIELDS_TYPES.DATE,
      validation: {
        required: MESSAGES.LAST_UPDATED_REQUIRED,
      },
      width: "w-full",
    },
    // Notes Section
    {
      name: FIELD_NAMES.NOTES,
      label: STRING.NOTES,
      type: FORM_FIELDS_TYPES.TEXTAREA,
      placeholder: "Enter any private notes about this company...",
      validation: {
        maxLength: {
          value: 1000,
          message: MESSAGES.NOTES_MAX_LENGTH,
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
            Private Details (Admin Only)
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              This information is only visible to administrators
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Financial Information
            </h4>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.REVENUE}
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {defaultValues.revenue}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.TURNOVER}
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {defaultValues.turnover}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Contact Information
            </h4>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.CONTACT_EMAIL}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.contactEmail}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.CONTACT_PHONE}
              </div>
              <p className="text-gray-900 dark:text-white">
                {defaultValues.contactPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Important Dates
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.CREATED_DATE}
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(defaultValues.createdDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {STRING.LAST_UPDATED}
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(defaultValues.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {STRING.NOTES}
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">
              {defaultValues.notes}
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
          Private Details (Admin Only)
        </h3>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            This information is only visible to administrators
          </span>
        </div>
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

export default CompanyPrivateDetails;
