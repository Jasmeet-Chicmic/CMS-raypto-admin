"use client";

import { ArrowLeft, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BonusBox,
  SlideFormValues,
} from "@/app/(secured)/bonus-slides/helpers/types";
import { createSlide, updateSlide } from "@/api/bonusSlides";
import { ROUTES } from "@/shared/routes";
import { toast } from "react-toastify";
import Switch from "@/components/atoms/Switch/Switch";
import BonusBoxForm from "./BonusBoxForm";
import SlidePreview from "../SlidePreview/SlidePreview";

const getDefaultBox = (): BonusBox => ({
  backgroundImageUrl: "",
  mobileBackgroundImageUrl: "",
  objectImageUrl: "",
  buttonText: "Claim", // Default button text
  enableButton: false,
  expireAt: "", // Optional - empty by default
  reward: [],
  buttonAndTimerPosition: 1,
});

interface SlideFormProps {
  isEdit?: boolean;
  slideId?: string;
  defaultValues?: SlideFormValues;
}

const SlideForm = ({
  isEdit = false,
  slideId,
  defaultValues,
}: SlideFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true);
  const [boxes, setBoxes] = useState<BonusBox[]>(
    defaultValues?.bonuses?.length ? defaultValues.bonuses : [getDefaultBox()],
  );

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when defaultValues change (for edit mode)
  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title || "");
      setIsActive(defaultValues.isActive ?? true);
      setBoxes(
        defaultValues.bonuses?.length
          ? defaultValues.bonuses
          : [getDefaultBox()],
      );
    }
  }, [defaultValues]);

  const handleAddBox = () => {
    if (boxes.length >= 4) return;
    setBoxes([...boxes, getDefaultBox()]);
  };

  const handleRemoveBox = (index: number) => {
    if (boxes.length <= 1) return;
    setBoxes(boxes.filter((_, i) => i !== index));
  };

  const handleBoxChange = (index: number, updatedBox: BonusBox) => {
    const updated = [...boxes];
    updated[index] = updatedBox;
    setBoxes(updated);
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    // Boxes validation - desktop and mobile backgrounds are required
    boxes.forEach((box, index) => {
      if (!box.backgroundImageUrl) {
        newErrors[`box_${index}_bg`] =
          `Card ${index + 1}: Desktop background is required`;
      }
      if (!box.mobileBackgroundImageUrl) {
        newErrors[`box_${index}_mobile_bg`] =
          `Card ${index + 1}: Mobile background is required`;
      }
      // At least one reward is required
      if (!box.reward || box.reward.length === 0) {
        newErrors[`box_${index}_reward`] =
          `Card ${index + 1}: At least one reward is required`;
      }
      // Expiry date is optional - no validation needed
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // Get all error messages and show in toast
      const errorMessages = Object.values(validationErrors);
      if (errorMessages.length === 1) {
        toast.error(errorMessages[0]);
      } else if (errorMessages.length > 1) {
        // Show first error in toast
        toast.error(errorMessages[0]);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        isActive,
        bonuses: boxes.map((box) => ({
          backgroundImageUrl: box.backgroundImageUrl,
          mobileBackgroundImageUrl: box.mobileBackgroundImageUrl || undefined,
          objectImageUrl: box.objectImageUrl || undefined,
          buttonText: box.buttonText.trim() || "Claim", // Default to Claim
          enableButton: box.enableButton ?? false,
          expireAt: box.expireAt || undefined, // Optional
          reward:
            box.reward && box.reward.length > 0
              ? box.reward.map((r) => ({
                  currency: r.currency,
                  amount: String(r.amount), // Convert amount to string
                  isAmountWithdrawable: r.isAmountWithdrawable,
                }))
              : undefined, // Optional
          buttonAndTimerPosition: box.buttonAndTimerPosition || 1,
        })),
      };

      const result =
        isEdit && slideId
          ? await updateSlide(slideId, payload)
          : await createSlide(payload);

      if (result.status) {
        toast.success(
          isEdit ? "Slide updated successfully" : "Slide created successfully",
        );
        router.push(ROUTES.BONUS_SLIDES_LIST);
      } else {
        toast.error(result.message || "Failed to save slide");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.BONUS_SLIDES_LIST);
  };

  return (
    <>
      <div className="space-y-6 mt-0 w-full">
        {/* Header Section */}
        <div className="bg-bgwhite dark:bg-darkbgprimary">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-sidebartext">
                {isEdit ? "Edit Slide" : "Create New Slide"}
              </h1>
              <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight">
                {isEdit
                  ? "Modify existing slide content"
                  : "Add a new promotional slide"}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 bg-bgwhite dark:bg-darkbgprimary border bordergray200 dark:border-labelprimary rounded-xl hover:bg-gray-50 dark:hover:bg-labelprimary transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List</span>
            </button>
          </div>
        </div>

        {/* Preview Section - Full width on top */}
        <SlidePreview title={title} boxes={boxes} isProminent={!isEdit} />

        {/* Form Section - Below */}
        <div className="bg-bgwhite dark:bg-darkbgprimary rounded-[24px] shadow-sm p-6 border bordergray200 dark:border-darkbgprimary">
          <form onSubmit={handleSubmit}>
            {/* Title and Active Toggle - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <label
                  htmlFor="slide-title"
                  className="block text-sm font-semibold text-labelprimary dark:text-darklabelprimary mb-2"
                >
                  Slide Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="slide-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  placeholder="Enter slide title"
                  className="w-full px-4 py-3 border bordergray200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-b border-bordergray200gpurple1 transition-all dark:bg-darkbgprimary dark:border-labelprimary dark:text-sidebartext"
                />
                {errors.title && (
                  <p className="text-red-500 text-[0.875rem] mt-2 font-medium">
                    {errors.title}
                  </p>
                )}
                <div className="flex justify-end mt-1">
                  <p className="bordercolor1 text-[0.75rem] font-medium">
                    {title.length}/100 characters
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-bordercolor1 dark:bg-darkbgprimary/50 border border-transparent dark:border-labelprimary rounded-xl p-5 w-full transition-all hover:shadow-md">
                  <Switch
                    enabled={isActive}
                    onToggle={() => setIsActive(!isActive)}
                    label="Active Status"
                  />
                </div>
              </div>
            </div>

            {/* Cards Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-bordergray200 dark:border-darkbgprimary">
                <div>
                  <h2 className="text-lg font-bold text-textprimary dark:text-sidebartext">
                    Slider Cards
                  </h2>
                  <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight">
                    {boxes.length} of 4 cards added
                  </p>
                </div>
                {boxes.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddBox}
                    className="px-4 py-2 bg-primarycolor dark:bg-secondarycolor text-bgwhite dark:text-textprimary rounded-lg hover:bg-primaryhover dark:hover:bg-secondaryhover transition flex items-center gap-2 font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Card
                  </button>
                )}
              </div>

              {/* Cards List - Each card visually separated */}
              <div className="space-y-6">
                {boxes.map((box, index) => (
                  <BonusBoxForm
                    key={index}
                    box={box}
                    index={index}
                    onChange={handleBoxChange}
                    onRemove={handleRemoveBox}
                    canRemove={boxes.length > 1}
                    isEdit={isEdit}
                  />
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-0 dark:border-darkbgprimary">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 text-gray-500 font-semibold bg-gray-50 rounded-xl hover:bg-gray-100 dark:bg-darkbgprimary dark:hover:bg-labelprimary transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primarycolor dark:bg-secondarycolor text-bgwhite dark:text-textprimary rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold hover:bg-primaryhover dark:hover:bg-secondaryhover"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Slide"
                    : "Create Slide"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SlideForm;
