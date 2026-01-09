"use client";

import React, { useCallback } from "react";
import { BonusBox } from "@/app/(secured)/bonus-slides/helpers/types";
import { ImageUpload, UPLOAD_FILE_TYPE } from "@/components/atoms/ImageUpload";
import { uploadSlideImage } from "@/api/bonusSlides";
import RewardForm from "./RewardForm";
import Select from "@/components/atoms/Select";
import Switch from "@/components/atoms/Switch/Switch";

interface BonusBoxFormProps {
  box: BonusBox;
  index: number;
  onChange: (index: number, box: BonusBox) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  isEdit?: boolean;
}

const POSITION_OPTIONS = [
  { label: "Top Left", value: 1 },
  { label: "Top Right", value: 2 },
  { label: "Bottom Left", value: 3 },
  { label: "Bottom Right", value: 4 },
];

const BonusBoxForm = ({
  box,
  index,
  onChange,
  onRemove,
  canRemove,
}: BonusBoxFormProps) => {
  const handleFieldChange = useCallback(
    <K extends keyof BonusBox>(field: K, value: BonusBox[K]) => {
      onChange(index, { ...box, [field]: value });
    },
    [onChange, index, box],
  );

  // Format expireAt for datetime-local input
  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  React.useEffect(() => {
    if (box.buttonText !== "Claim") {
      handleFieldChange("buttonText", "Claim");
    }
  }, [box.buttonText, handleFieldChange]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[24px] p-6 shadow-sm transition-all hover:shadow-lg hover:border-[#868CFF]/30">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-[1.125rem] font-bold text-[#1B2559] dark:text-white">
          Card {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-4 py-1.5 text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
          >
            Remove Card
          </button>
        )}
      </div>

      {/* Image Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Desktop Background Image */}
        <ImageUpload
          label="Desktop Background"
          value={box.backgroundImageUrl}
          onChange={(url) => handleFieldChange("backgroundImageUrl", url)}
          required={true}
          uploadFunction={uploadSlideImage}
          fileType={UPLOAD_FILE_TYPE.BONUS_BACKGROUND_IMAGE}
          aspectRatio="16/9"
          placeholder="Main desktop slide"
        />

        {/* Mobile Background Image */}
        <ImageUpload
          label="Mobile Background"
          value={box.mobileBackgroundImageUrl || ""}
          onChange={(url) => handleFieldChange("mobileBackgroundImageUrl", url)}
          required={true}
          uploadFunction={uploadSlideImage}
          fileType={UPLOAD_FILE_TYPE.BONUS_BACKGROUND_IMAGE}
          aspectRatio="16/9"
          placeholder="Optimized for mobile"
        />

        {/* Object Image */}
        <ImageUpload
          label="Object Image"
          value={box.objectImageUrl || ""}
          onChange={(url) => handleFieldChange("objectImageUrl", url)}
          uploadFunction={uploadSlideImage}
          fileType={UPLOAD_FILE_TYPE.BONUS_BACKGROUND_IMAGE}
          aspectRatio="16/9"
          placeholder="Logo or floating item"
        />
      </div>

      {/* Other Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Button Text */}
        <div>
          <label
            htmlFor={`button-text-${index}`}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Button Text
          </label>
          <input
            id={`button-text-${index}`}
            type="text"
            value="Claim"
            readOnly
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#4F46E5] transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-gray-50 cursor-not-allowed"
          />
          <div className="mt-4">
            <Switch
              enabled={box.enableButton ?? false}
              onToggle={() =>
                handleFieldChange("enableButton", !box.enableButton)
              }
              label="Enable"
            />
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label
            htmlFor={`expiry-date-${index}`}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Expiry Date & Time (Optional)
          </label>
          <input
            id={`expiry-date-${index}`}
            type="datetime-local"
            value={formatDateTimeLocal(box.expireAt || "")}
            onChange={(e) => {
              if (e.target.value) {
                const date = new Date(e.target.value);
                handleFieldChange("expireAt", date.toISOString());
              } else {
                handleFieldChange("expireAt", "");
              }
            }}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#4F46E5] transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Position */}
        <div>
          <label
            htmlFor={`position-${index}`}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Position
          </label>
          <Select
            inputId={`position-${index}`}
            options={POSITION_OPTIONS}
            value={POSITION_OPTIONS.find(
              (opt) => opt.value === box.buttonAndTimerPosition,
            )}
            onChange={(val) =>
              handleFieldChange("buttonAndTimerPosition", val?.value as number)
            }
            placeholder="Select Position"
            isSearchable={false}
          />
        </div>
      </div>

      {/* Rewards Section */}
      <RewardForm
        rewards={box.reward || []}
        onChange={(rewards) => handleFieldChange("reward", rewards)}
      />
    </div>
  );
};

export default BonusBoxForm;
