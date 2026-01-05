"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { COMPANY_BRANDING } from "./helpers/constants";
import { companyCover, companyLogo } from "@/assets";

interface CompanyBrandingFormData {
  logo: string;
  coverImage: string;
  tagline: string;
}

const CompanyBranding = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanyBrandingFormData = {
    logo: companyLogo.src,
    coverImage: companyCover.src,
    tagline: "Innovating Tomorrow's Solutions Today",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CompanyBrandingFormData>({
    defaultValues,
  });

  const onSubmit = (data: CompanyBrandingFormData) => {
    console.log("Company Branding - Edited Data:", {
      section: "Company Branding",
      data: data,
      logoFile: logoFile,
      coverFile: coverFile,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send data to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setLogoFile(null);
    setCoverFile(null);
    setLogoPreview("");
    setCoverPreview("");
    setIsEditing(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setValue("logo", result); // Update form value with data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCoverPreview(result);
        setValue("coverImage", result); // Update form value with data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setValue("logo", defaultValues.logo);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setValue("coverImage", defaultValues.coverImage);
  };

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Branding
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="space-y-6">
          {/* Logo */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Logo
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={defaultValues.logo}
                  alt="Company Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Company logo image
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </div>
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <Image
                src={defaultValues.coverImage}
                alt="Cover Image"
                width={400}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Company cover image
            </p>
          </div>

          {/* Tagline */}
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline
            </div>
            <p className="text-gray-900 dark:text-white italic">
              {`${defaultValues.tagline}`}
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
          Branding
        </h3>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Section */}
        <div>
          <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Company Logo
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={logoPreview || defaultValues.logo}
                alt="Company Logo"
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              {logoFile && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[0.875] hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{logoFile ? "Change Logo" : "Upload Logo"}</span>
                  </div>
                </label>
                {logoFile && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {logoFile.name}
                  </span>
                )}
              </div>
              <p className="text-[0.875rem] text-[#A3AED0] mt-1">
                {COMPANY_BRANDING.IMAGES_GUIDELINES.COMPANY_LOGO}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Image Section */}
        <div>
          <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Cover Image
          </div>
          <div className="relative">
            <Image
              src={coverPreview || defaultValues.coverImage}
              alt="Company Cover"
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
            {coverFile && (
              <button
                type="button"
                onClick={removeCover}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[0.875] hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <div className="mt-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <div className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors inline-flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>{coverFile ? "Change Cover" : "Upload Cover"}</span>
                </div>
              </label>
              {coverFile && (
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {coverFile.name}
                </span>
              )}
            </div>
            <p className="text-[0.875rem] text-[#A3AED0] mt-1">
              {COMPANY_BRANDING.IMAGES_GUIDELINES.COVER_IMAGE}
            </p>
          </div>
        </div>

        {/* Tagline Section */}
        <div>
          <label
            htmlFor="company-tagline"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tagline
          </label>
          <textarea
            id="company-tagline"
            {...register("tagline", {
              required: "Tagline is required",
              maxLength: {
                value: 100,
                message: "Tagline must be less than 100 characters",
              },
            })}
            rows={3}
            placeholder="Enter your company tagline..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          />
          {errors.tagline && (
            <p className="text-red-500 text-[0.875] mt-1">
              {errors.tagline.message}
            </p>
          )}
          <p className="text-[0.875rem] text-[#A3AED0] mt-1">
            Max 100 characters
          </p>
        </div>

        {/* Brand Guidelines */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Guidelines
          </h4>
          <ul className="text-[0.875] text-gray-600 dark:text-gray-400 space-y-1">
            {COMPANY_BRANDING.BRAND_GUIDELINES.map((Guidelines, index) => (
              <li key={Guidelines + index}>
                {index + 1}. {Guidelines}
              </li>
            ))}
          </ul>
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

export default CompanyBranding;
