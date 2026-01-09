"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  Pencil,
  X,
  Gamepad2,
  Coins,
  Wallet,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";

import {
  updateGameConfigAction,
  uploadGameIcon,
  type AmountLimit,
  type GameConfig,
} from "@/api/gameConfig";
import {
  CURRENCY_TYPE_NAMES,
  GAME_TYPE_NAMES,
  FORM_FIELDS_TYPES,
} from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { formatDate, formatCurrency, getImageUrl } from "@/shared/utils";
import { InputField } from "@/components/molecules/FormBuilder/fields/InputField";
import { SwitchField } from "@/components/molecules/FormBuilder/fields/SwitchField";
import { ImageUpload, UPLOAD_FILE_TYPE } from "@/components/atoms/ImageUpload";

interface GameConfigEditFormProps {
  gameConfig: GameConfig;
}

interface FormValues {
  name: string;
  isEnabled: boolean;
  isMaintenance: boolean;
  amountLimit: AmountLimit[];
  icon: string;
}

const GameConfigEditForm = ({ gameConfig }: GameConfigEditFormProps) => {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form
  const methods = useForm<FormValues>({
    defaultValues: {
      name: gameConfig.name,
      isEnabled: gameConfig.isEnabled,
      isMaintenance: gameConfig.isMaintenance,
      amountLimit: gameConfig.amountLimit,
      icon: gameConfig.icon || "",
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const { fields } = useFieldArray({
    control: methods.control,
    name: "amountLimit",
  });

  // Reset form values when gameConfig prop changes (e.g., after update and router.refresh())
  useEffect(() => {
    reset({
      name: gameConfig.name,
      isEnabled: gameConfig.isEnabled,
      isMaintenance: gameConfig.isMaintenance,
      amountLimit: gameConfig.amountLimit,
      icon: gameConfig.icon || "",
    });
  }, [gameConfig, reset]);

  const watchedValues = watch();

  const handleCancelEdit = () => {
    reset({
      name: gameConfig.name,
      isEnabled: gameConfig.isEnabled,
      isMaintenance: gameConfig.isMaintenance,
      amountLimit: gameConfig.amountLimit,
      icon: gameConfig.icon || "",
    });
    setErrors({});
    setEditMode(false);
  };

  const validate = (data: FormValues): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Icon validation
    if (!data.icon || data.icon.trim() === "") {
      newErrors.icon = "Game icon is required";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) return;

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      // Show first error in toast
      const errorMessages = Object.values(validationErrors);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      }
      return;
    }

    try {
      const res = await updateGameConfigAction({
        gameConfigId: gameConfig._id,
        name: data.name,
        isEnabled: data.isEnabled,
        isMaintenance: data.isMaintenance,
        amountLimit: data.amountLimit,
        icon: data.icon,
      });

      if (res.status) {
        toast.success(res.message || "Game configuration updated successfully");
        setErrors({});
        setEditMode(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update game configuration");
      }
    } catch {
      toast.error("An error occurred while updating");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] shadow-[0_0_10px_0_rgba(0,0,0,0.025)] border border-gray-100 dark:border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full">
            <Link
              href={ROUTES.GAME_CONFIGS_LIST}
              className="p-3 bg-[#F4F7FE] dark:bg-gray-800 text-[#4F46E5] rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-full">
              <div className="flex items-center gap-3">
                <h1 className="text-[2rem] font-bold text-[#1B2559] dark:text-white leading-none">
                  {gameConfig.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    gameConfig.isEnabled
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {gameConfig.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400 mt-2">
                {GAME_TYPE_NAMES[gameConfig.type] || `Type ${gameConfig.type}`}{" "}
                • Created {formatDate(gameConfig.createdAt)} • ID:{" "}
                {gameConfig._id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm whitespace-nowrap font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  form="game-config-form"
                  disabled={isSubmitting || !isDirty}
                  className={`flex items-center gap-2 whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg ${
                    isDirty
                      ? "bg-[#4F46E5] text-white hover:bg-[#3311CC] shadow-indigo-200 dark:shadow-none"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                  }`}
                >
                  <Save size={18} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="flex items-center whitespace-nowrap gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#4F46E5] rounded-xl hover:bg-[#3311CC] transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                <Pencil size={18} />
                <span className="flex flex-nowrap">Edit Configuration</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form id="game-config-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-8">
              {/* Basic Info */}
              <div className="w-full xl:w-full p-6 bg-[#F4F7FE] dark:bg-gray-800/40 rounded-[20px] border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="p-2 bg-white dark:bg-[#4F46E5] rounded-lg shadow-sm">
                    <Gamepad2 className="w-5 h-5 text-[#4F46E5] dark:text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B2559] dark:text-white">
                    Basic Information
                  </h3>
                </div>

                <div className="flex w-full gap-4 flex-col md:flex-row">
                  {/* Game Icon */}
                  <div className="xl:max-w-[230px] items-center justify-center flex flex-col max-w-none w-full p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="block mb-3 text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest">
                      Game Icon
                    </div>
                    {editMode ? (
                      <div className="w-full items-center justify-center flex flex-col">
                        <ImageUpload
                          label=""
                          value={watchedValues.icon || ""}
                          onChange={(url) => {
                            methods.setValue("icon", url, {
                              shouldDirty: true,
                            });
                            // Clear error when user uploads an image
                            if (url && errors.icon) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.icon;
                                return newErrors;
                              });
                            }
                          }}
                          uploadFunction={uploadGameIcon}
                          fileType={UPLOAD_FILE_TYPE.GAME_ICON}
                          aspectRatio="70/93"
                          validateAspectRatio={true}
                          placeholder="Game Icon"
                          maxSize={5}
                          required={true}
                          className="relative aspect-[3/4] w-[126px] rounded-xl overflow-hidden "
                          previewClassName="relative aspect-[3/4] !w-[126px] !h-full !bg-white rounded-xl overflow-hidden "
                        />
                        {!watchedValues.icon && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center">
                            Upload image 280 × 372 px or same Ratio.
                          </p>
                        )}
                        {errors.icon && (
                          <p className="text-red-500 text-[0.875rem] mt-2 font-medium">
                            {errors.icon}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {watchedValues.icon ? (
                          <div className="relative aspect-[3/4] w-[120px] rounded-xl overflow-hidden ">
                            <img
                              src={getImageUrl(watchedValues.icon)}
                              alt="Game icon"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <Gamepad2 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-4 w-full lg:w-[calc(100%-160px)]">
                    {/* Game Name */}
                    {editMode ? (
                      <div className="w-full h-full p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 focus-within:border-[#4F46E5] transition-all">
                        <InputField<FormValues>
                          name="name"
                          label="Game Name"
                          type={FORM_FIELDS_TYPES.TEXT}
                          placeholder="Enter game name"
                          labelClassName="block mb-2 text-xs !font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest"
                          className="!mb-0"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="block mb-2 text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest">
                          Game Name
                        </div>
                        <p className="text-xl font-bold text-[#1B2559] dark:text-white">
                          {watchedValues.name}
                        </p>
                      </div>
                    )}

                    <div className="w-full xl:w-full flex flex-col xl:flex-row items-start gap-4">
                      {/* Enabled Toggle */}
                      <div className="w-full p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group/toggle">
                        <div>
                          <p className="block mb-2 text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest">
                            Public visibility
                          </p>
                          <h4 className="font-bold text-[#1B2559] text-xl dark:text-white">
                            Enabled
                          </h4>
                        </div>
                        {editMode ? (
                          <SwitchField<FormValues>
                            name="isEnabled"
                            label=""
                            type={FORM_FIELDS_TYPES.SWITCH}
                            className="!mb-0 !w-auto"
                          />
                        ) : (
                          <div
                            className={`p-2 rounded-lg transition-colors ${watchedValues.isEnabled ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}
                          >
                            <span className="text-sm font-bold uppercase">
                              {watchedValues.isEnabled ? "On" : "Off"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Maintenance Toggle */}
                      <div className="w-full p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group/toggle">
                        <div>
                          <p className="block mb-2 text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest">
                            System lockdowns
                          </p>
                          <h4 className="font-bold text-[#1B2559] text-xl dark:text-white">
                            Maintenance
                          </h4>
                        </div>
                        {editMode ? (
                          <SwitchField<FormValues>
                            name="isMaintenance"
                            label=""
                            type={FORM_FIELDS_TYPES.SWITCH}
                            className="!mb-0 !w-auto"
                          />
                        ) : (
                          <div
                            className={`p-2 rounded-lg transition-colors ${watchedValues.isMaintenance ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600" : "bg-gray-50 dark:bg-gray-800 text-gray-500"}`}
                          >
                            <span className="text-sm font-bold uppercase">
                              {watchedValues.isMaintenance ? "On" : "Off"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Limits */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#F4F7FE] dark:bg-[#4F46E5] rounded-lg">
                  <Coins className="w-5 h-5 text-[#4F46E5] dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1B2559] dark:text-white">
                  Bet Limits by Currency
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 bg-white dark:bg-gray-800 rounded-[20px] shadow-[0_0_15px_0_rgba(0,0,0,0.03)] border border-gray-100 dark:border-transparent transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f4f7fe] dark:bg-gray-700 flex items-center justify-center font-bold text-[#4F46E5] dark:text-white">
                          {CURRENCY_TYPE_NAMES[field.currency]?.charAt(0) ||
                            "$"}
                        </div>
                        <span className="text-lg font-bold text-[#1B2559] dark:text-white">
                          {CURRENCY_TYPE_NAMES[field.currency] ||
                            `Currency ${field.currency}`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Max Bet Amount */}
                      <div className="group/field">
                        {editMode ? (
                          <div className="p-4 bg-[#F4F7FE] dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 focus-within:border-[#4F46E5] transition-all">
                            <InputField<FormValues>
                              name={`amountLimit.${index}.maxBetAmount`}
                              label="Max Bet Amount"
                              type={FORM_FIELDS_TYPES.NUMBER}
                              className="!mb-0"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-[#F4F7FE] dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all">
                            <div className="block mb-2 text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest">
                              Max Bet Amount
                            </div>
                            <div className="flex items-center gap-3">
                              <Wallet className="w-5 h-5 text-[#4F46E5]" />
                              <span className="text-lg font-bold text-[#1B2559] dark:text-white">
                                {formatCurrency(
                                  watchedValues.amountLimit?.[index]
                                    ?.maxBetAmount || 0,
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Max Profit */}
                      <div className="group/field">
                        {editMode ? (
                          <div className="p-4 bg-[#F4F7FE] dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 focus-within:border-[#4F46E5] transition-all">
                            <InputField<FormValues>
                              name={`amountLimit.${index}.maxProfit`}
                              label="Max Profit"
                              type={FORM_FIELDS_TYPES.NUMBER}
                              className="!mb-0"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-[#F4F7FE] dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all">
                            <div className="block mb-2 text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase tracking-widest">
                              Max Profit
                            </div>
                            <div className="flex items-center gap-3">
                              <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
                              <span className="text-lg font-bold text-[#1B2559] dark:text-white">
                                {formatCurrency(
                                  watchedValues.amountLimit?.[index]
                                    ?.maxProfit || 0,
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default GameConfigEditForm;
