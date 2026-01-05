"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { Achievement } from "./helpers/types";
import { companyLogo } from "@/assets";

interface CompanyAchievementsFormData {
  achievements: Achievement[];
}

const CompanyAchievements = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>(
    {},
  );
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {},
  );

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanyAchievementsFormData = {
    achievements: [
      {
        id: "1",
        title: "Digital Transformation for Retail Chain",
        description:
          "Successfully transformed a 50-store retail chain's operations through comprehensive digital solutions, resulting in 40% increase in efficiency and 25% reduction in operational costs.",
        image: companyLogo.src,
        year: "2023",
        category: "Digital Transformation",
      },
      {
        id: "2",
        title: "AI-Powered Customer Service Platform",
        description:
          "Developed and deployed an intelligent customer service platform that handles 10,000+ daily inquiries with 95% accuracy, improving customer satisfaction by 60%.",
        image: companyLogo.src,
        year: "2023",
        category: "AI/ML",
      },
      {
        id: "3",
        title: "Cloud Migration for Financial Services",
        description:
          "Led the complete cloud migration of a financial services company, ensuring zero downtime and achieving 99.9% uptime while reducing infrastructure costs by 35%.",
        image: companyLogo.src,
        year: "2022",
        category: "Cloud Solutions",
      },
    ],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CompanyAchievementsFormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  const onSubmit = (data: CompanyAchievementsFormData) => {
    console.log("Company Achievements - Edited Data:", {
      section: "Company Achievements",
      data: data,
      imageFiles: imageFiles,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send data to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setImageFiles({});
    setImagePreviews({});
    setIsEditing(false);
  };

  const addAchievement = () => {
    const newId = Date.now().toString();
    append({
      id: newId,
      title: "",
      description: "",
      image: "",
      year: new Date().getFullYear().toString(),
      category: "",
    });
  };

  const handleImageUpload = (
    achievementId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFiles((prev) => ({
        ...prev,
        [achievementId]: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreviews((prev) => ({
          ...prev,
          [achievementId]: result,
        }));
        // Update form value with the preview URL
        setValue(`achievements.${currentIndex}.image` as const, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (achievementId: string) => {
    setImageFiles((prev) => ({
      ...prev,
      [achievementId]: null,
    }));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[achievementId];
      return newPreviews;
    });
    setValue(`achievements.${currentIndex}.image` as const, "");

    // Also clear the default image by setting it to empty
    const updatedFields = [...fields];
    if (updatedFields[currentIndex]) {
      updatedFields[currentIndex].image = "";
    }
  };

  const nextAchievement = () => {
    setCurrentIndex((prev) => (prev + 1) % fields.length);
  };

  const prevAchievement = () => {
    setCurrentIndex((prev) => (prev - 1 + fields.length) % fields.length);
  };

  const currentAchievement = fields[currentIndex];
  const currentImageFile = imageFiles[currentAchievement?.id || ""];
  const currentImagePreview = imagePreviews[currentAchievement?.id || ""];
  const hasImage = currentImagePreview || currentAchievement?.image;
  const displayImage = hasImage || "/images/placeholder.jpg";

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Achievements
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
              No achievements added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Carousel Navigation */}
            {fields.length > 1 && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={prevAchievement}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex space-x-1">
                  {fields.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextAchievement}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Achievement Display */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Image */}
                <div className="relative">
                  <Image
                    src={displayImage}
                    alt={currentAchievement?.title || "Achievement"}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </div>
                    <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                      {currentAchievement?.title}
                    </h4>
                  </div>

                  <div className="flex space-x-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentAchievement?.year}
                      </span>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[0.875] font-medium">
                        {currentAchievement?.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentAchievement?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Achievements
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={addAchievement}
            className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
          >
            Add Achievement
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
              No achievements added yet.
            </p>
            <button
              type="button"
              onClick={addAchievement}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Add Your First Achievement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Carousel Navigation */}
            {fields.length > 1 && (
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={prevAchievement}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex space-x-1">
                  {fields.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextAchievement}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Achievement Form */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={displayImage}
                      alt={currentAchievement?.title || "Achievement"}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {(currentImageFile || currentAchievement?.image) && (
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() =>
                            removeImage(currentAchievement?.id || "")
                          }
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {!hasImage && (
                    <div className="space-y-2">
                      <label
                        htmlFor="achievement-image-upload"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Achievement Image
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="achievement-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(currentAchievement?.id || "", e)
                          }
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark transition-colors"
                        />
                      </div>
                      <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="achievement-title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Title
                    </label>
                    <input
                      id="achievement-title"
                      type="text"
                      {...register(
                        `achievements.${currentIndex}.title` as const,
                        {
                          required: "Title is required",
                        },
                      )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.achievements?.[currentIndex]?.title && (
                      <p className="text-red-500 text-[0.875] mt-1">
                        {errors.achievements[currentIndex]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <div>
                      <label
                        htmlFor="achievement-year"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Year
                      </label>
                      <input
                        id="achievement-year"
                        type="text"
                        {...register(
                          `achievements.${currentIndex}.year` as const,
                          {
                            required: "Year is required",
                          },
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.achievements?.[currentIndex]?.year && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.achievements[currentIndex]?.year?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="achievement-category"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Category
                      </label>
                      <input
                        id="achievement-category"
                        type="text"
                        {...register(
                          `achievements.${currentIndex}.category` as const,
                          {
                            required: "Category is required",
                          },
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.achievements?.[currentIndex]?.category && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.achievements[currentIndex]?.category?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="achievement-description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Description (max 500 characters)
                    </label>
                    <textarea
                      id="achievement-description"
                      {...register(
                        `achievements.${currentIndex}.description` as const,
                        {
                          required: "Description is required",
                          maxLength: {
                            value: 500,
                            message:
                              "Description must be less than 500 characters",
                          },
                        },
                      )}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    />
                    {errors.achievements?.[currentIndex]?.description && (
                      <p className="text-red-500 text-[0.875] mt-1">
                        {
                          errors.achievements[currentIndex]?.description
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(currentIndex)}
                    className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Remove Achievement
                  </button>
                </div>
              </div>
            </div>
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

export default CompanyAchievements;
