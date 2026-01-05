"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { companyLogo } from "@/assets";

interface Award {
  id: string;
  title: string;
  year: string;
  awardingOrganization: string;
  description: string;
  badgeImage?: string;
  category: string;
}

interface CompanyAwardsFormData {
  awards: Award[];
}

const CompanyAwards = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanyAwardsFormData = {
    awards: [
      {
        id: "1",
        title: "Best Technology Innovation Award",
        year: "2023",
        awardingOrganization: "Tech Excellence Awards",
        description:
          "Recognized for outstanding innovation in cloud computing solutions and AI implementation.",
        badgeImage: companyLogo.src,
        category: "Technology",
      },
      {
        id: "2",
        title: "Excellence in Customer Service",
        year: "2023",
        awardingOrganization: "Customer Success Association",
        description:
          "Awarded for exceptional customer service and support excellence across all client projects.",
        badgeImage: companyLogo.src,
        category: "Customer Service",
      },
      {
        id: "3",
        title: "Fastest Growing Company",
        year: "2022",
        awardingOrganization: "Business Growth Awards",
        description:
          "Recognized as one of the fastest-growing technology companies in the region.",
        badgeImage: companyLogo.src,
        category: "Business Growth",
      },
      {
        id: "4",
        title: "Best Workplace Culture",
        year: "2022",
        awardingOrganization: "HR Excellence Awards",
        description:
          "Awarded for outstanding workplace culture and employee satisfaction initiatives.",
        badgeImage: companyLogo.src,
        category: "Workplace",
      },
    ],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CompanyAwardsFormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  const onSubmit = (data: CompanyAwardsFormData) => {
    console.log("Company Awards - Edited Data:", {
      section: "Company Awards",
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

  const addAward = () => {
    append({
      id: Date.now().toString(),
      title: "",
      year: new Date().getFullYear().toString(),
      awardingOrganization: "",
      description: "",
      badgeImage: "",
      category: "",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "customer service":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "business growth":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "workplace":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Achievements Section
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No awards added yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((award) => (
              <div
                key={award.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                          {award.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getCategoryColor(award.category)}`}
                        >
                          {award.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {award.awardingOrganization} • {award.year}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {award.description}
                      </p>
                    </div>
                  </div>

                  {/* Badge Image */}
                  {award.badgeImage && (
                    <div className="ml-4">
                      <Image
                        src={award.badgeImage}
                        alt={award.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Awards Summary */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Awards Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {fields.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Awards
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  fields.filter(
                    (a) => a.year === new Date().getFullYear().toString(),
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This Year
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(fields.map((a) => a.awardingOrganization)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Organizations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(fields.map((a) => a.category)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Achievements Section
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={addAward}
            className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
          >
            Add Award
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No awards added yet.
            </p>
            <button
              type="button"
              onClick={addAward}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Add Your First Award
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((award, index) => (
              <div
                key={award.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor={`award-title-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Award Title
                        </label>
                        <input
                          id={`award-title-${index}`}
                          type="text"
                          {...register(`awards.${index}.title` as const, {
                            required: "Award title is required",
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                        {errors.awards?.[index]?.title && (
                          <p className="text-red-500 text-[0.875] mt-1">
                            {errors.awards[index]?.title?.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor={`award-year-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Year
                          </label>
                          <input
                            id={`award-year-${index}`}
                            type="text"
                            {...register(`awards.${index}.year` as const, {
                              required: "Year is required",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          />
                          {errors.awards?.[index]?.year && (
                            <p className="text-red-500 text-[0.875] mt-1">
                              {errors.awards[index]?.year?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor={`award-category-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Category
                          </label>
                          <input
                            id={`award-category-${index}`}
                            type="text"
                            {...register(`awards.${index}.category` as const, {
                              required: "Category is required",
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          />
                          {errors.awards?.[index]?.category && (
                            <p className="text-red-500 text-[0.875] mt-1">
                              {errors.awards[index]?.category?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`award-organization-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Awarding Organization
                        </label>
                        <input
                          id={`award-organization-${index}`}
                          type="text"
                          {...register(
                            `awards.${index}.awardingOrganization` as const,
                            {
                              required: "Awarding organization is required",
                            },
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                        {errors.awards?.[index]?.awardingOrganization && (
                          <p className="text-red-500 text-[0.875] mt-1">
                            {
                              errors.awards[index]?.awardingOrganization
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor={`award-description-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id={`award-description-${index}`}
                          {...register(`awards.${index}.description` as const, {
                            required: "Description is required",
                            maxLength: {
                              value: 500,
                              message:
                                "Description must be less than 500 characters",
                            },
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm resize-none"
                        />
                        {errors.awards?.[index]?.description && (
                          <p className="text-red-500 text-[0.875] mt-1">
                            {errors.awards[index]?.description?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor={`award-badge-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Badge/Image URL
                        </label>
                        <input
                          id={`award-badge-${index}`}
                          type="url"
                          {...register(`awards.${index}.badgeImage` as const)}
                          placeholder="https://example.com/badge.png"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                        {errors.awards?.[index]?.badgeImage && (
                          <p className="text-red-500 text-[0.875] mt-1">
                            {errors.awards[index]?.badgeImage?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badge Image Preview */}
                  {award.badgeImage && (
                    <div className="ml-4">
                      <Image
                        src={award.badgeImage}
                        alt={award.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-3 py-1 text-[0.875] font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Remove Award
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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

export default CompanyAwards;
