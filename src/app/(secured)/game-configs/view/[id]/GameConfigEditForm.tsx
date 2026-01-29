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
  Settings,
  Coins,
  Wallet,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";

import {
  updateGameConfigAction,
  type AmountLimit,
  type GameConfig,
} from "@/api/gameConfig";
import {
  CURRENCY_TYPE_NAMES,
  GAME_TYPE_NAMES,
  FORM_FIELDS_TYPES,
} from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { formatDate, formatCurrency } from "@/shared/utils";
import { InputField } from "@/components/molecules/FormBuilder/fields/InputField";
import { SwitchField } from "@/components/molecules/FormBuilder/fields/SwitchField";

interface GameConfigEditFormProps {
  gameConfig: GameConfig;
}

interface FormValues {
  name: string;
  isEnabled: boolean;
  isMaintenance: boolean;
  amountLimit: AmountLimit[];
}

const GameConfigEditForm = ({ gameConfig }: GameConfigEditFormProps) => {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  // Initialize form
  const methods = useForm<FormValues>({
    defaultValues: {
      name: gameConfig.name,
      isEnabled: gameConfig.isEnabled,
      isMaintenance: gameConfig.isMaintenance,
      amountLimit: gameConfig.amountLimit,
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
    });
  }, [gameConfig, reset]);

  const watchedValues = watch();

  const handleCancelEdit = () => {
    reset({
      name: gameConfig.name,
      isEnabled: gameConfig.isEnabled,
      isMaintenance: gameConfig.isMaintenance,
      amountLimit: gameConfig.amountLimit,
    });
    setEditMode(false);
  };

  const onSubmit = async (data: FormValues) => {
    if (!isDirty) return;

    try {
      const res = await updateGameConfigAction({
        gameConfigId: gameConfig._id,
        name: data.name,
        isEnabled: data.isEnabled,
        isMaintenance: data.isMaintenance,
        amountLimit: data.amountLimit,
      });

      if (res.status) {
        toast.success(res.message || "Game configuration updated successfully");
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
    <div className="bg-bgwhite dark:bg-darkbgprimary rounded-[20px] shadow-[0_0_10px_0_rgba(0,0,0,0.025)] border border-bordergray100 dark:border-darkbgprimary transition-all duration-300">
      {/* Header */}
      <div className="p-8 border-b border-bordergray200 bordergray100 dark:border-darkbgprimary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full">
            <Link
              href={ROUTES.GAME_CONFIGS_LIST}
              className="p-3 bg-bordercolor1 dark:bg-darkbgprimary text-bgpurple1 rounded-2xl hover:bg-gray-100 dark:hover:bg-labelprimary transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-full">
              <div className="flex items-center gap-3">
                <h1 className="text-[2rem] font-bold text-textprimary dark:text-sidebartext leading-none">
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
              <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight mt-2">
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
                  className="flex items-center gap-2 px-5 py-2.5 text-sm whitespace-nowrap font-bold text-labelprimary bg-bgwhite border bordergray200 rounded-xl hover:bg-gray-50 dark:bg-darkbgprimary dark:text-darklabelprimary dark:border-labelprimary dark:hover:bg-labelprimary transition-all"
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
                      ? "bg-primarycolor text-bgwhite hover:bg-[#3311CC] shadow-indigo-200 dark:shadow-none"
                      : "bg-darklabelprimary text-gray-500 cursor-not-allowed dark:bg-labelprimary"
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
                className="flex items-center whitespace-nowrap gap-2 px-6 py-2.5 text-sm font-bold text-bgwhite bg-primarycolor rounded-xl hover:bg-[#3311CC] transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
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
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="p-6 bg-bordercolor1 dark:bg-darkbgprimary/40 rounded-[20px] border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bordergray200/50 dark:border-labelprimary/50">
                  <div className="p-2 bg-bgwhite dark:bg-primarycolor rounded-lg shadow-sm">
                    <Gamepad2 className="w-5 h-5 text-bgpurple1 dark:text-sidebartext" />
                  </div>
                  <h3 className="text-lg font-bold text-textprimary dark:text-sidebartext">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-4">
                  {editMode ? (
                    <div className="p-4 bg-bgwhite dark:bg-darkbgprimary rounded-2xl border border-bordergray100 dark:border-darkbgprimary focus-within:border-b border-bordergray200gpurple1 transition-all">
                      <InputField<FormValues>
                        name="name"
                        label="Game Name"
                        type={FORM_FIELDS_TYPES.TEXT}
                        placeholder="Enter game name"
                        className="!mb-0"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-bgwhite dark:bg-darkbgprimary rounded-2xl border border-bordergray100 dark:border-darkbgprimary">
                      <div className="block mb-2 text-xs font-bold text-sidebartext dark:bordercolor1 uppercase tracking-widest">
                        Game Name
                      </div>
                      <p className="text-xl font-bold text-textprimary dark:text-sidebartext">
                        {watchedValues.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="p-6 bg-bordercolor1 dark:bg-darkbgprimary/40 rounded-[20px] border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bordergray200/50 dark:border-labelprimary/50">
                  <div className="p-2 bg-bgwhite dark:bg-primarycolor rounded-lg shadow-sm">
                    <Settings className="w-5 h-5 text-bgpurple1 dark:text-sidebartext" />
                  </div>
                  <h3 className="text-lg font-bold text-textprimary dark:text-sidebartext">
                    Status Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Enabled Toggle */}
                  <div className="p-5 bg-bgwhite dark:bg-darkbgprimary rounded-2xl border border-bordergray100 dark:border-darkbgprimary flex items-center justify-between group/toggle">
                    <div>
                      <p className="text-xs font-medium text-sidebartext dark:bordercolor1 mt-1">
                        Public visibility
                      </p>
                      <h4 className="font-bold text-textprimary text-xl dark:text-sidebartext">
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
                  <div className="p-5 bg-bgwhite dark:bg-darkbgprimary rounded-2xl border border-bordergray100 dark:border-darkbgprimary flex items-center justify-between group/toggle">
                    <div>
                      <p className="text-xs font-medium text-sidebartext dark:bordercolor1 mt-1">
                        System lockdowns
                      </p>
                      <h4 className="font-bold text-textprimary text-xl dark:text-sidebartext">
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
                        className={`p-2 rounded-lg transition-colors ${watchedValues.isMaintenance ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600" : "bg-gray-50 dark:bg-darkbgprimary text-gray-500"}`}
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

            {/* Amount Limits */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-bordercolor1 dark:bg-primarycolor rounded-lg">
                  <Coins className="w-5 h-5 text-bgpurple1 dark:text-sidebartext" />
                </div>
                <h3 className="text-xl font-bold text-textprimary dark:text-sidebartext">
                  Bet Limits by Currency
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 bg-bgwhite dark:bg-darkbgprimary rounded-[20px] shadow-[0_0_15px_0_rgba(0,0,0,0.03)] border border-bordergray100 dark:border-transparent transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-bordergray200 border-gray-50 dark:border-labelprimary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bordercolor1 dark:bg-labelprimary flex items-center justify-center font-bold text-bgpurple1 dark:text-sidebartext">
                          {CURRENCY_TYPE_NAMES[field.currency]?.charAt(0) ||
                            "$"}
                        </div>
                        <span className="text-lg font-bold text-textprimary dark:text-sidebartext">
                          {CURRENCY_TYPE_NAMES[field.currency] ||
                            `Currency ${field.currency}`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Max Bet Amount */}
                      <div className="group/field">
                        {editMode ? (
                          <div className="p-4 bg-bordercolor1 dark:bg-darkbgprimary/50 rounded-2xl border border-bordergray100 dark:border-darkbgprimary focus-within:border-b border-bordergray200gpurple1 transition-all">
                            <InputField<FormValues>
                              name={`amountLimit.${index}.maxBetAmount`}
                              label="Max Bet Amount"
                              type={FORM_FIELDS_TYPES.NUMBER}
                              className="!mb-0"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-bordercolor1 dark:bg-darkbgprimary/50 rounded-2xl border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all">
                            <div className="block mb-2 text-xs font-bold text-sidebartext dark:bordercolor1 uppercase tracking-widest">
                              Max Bet Amount
                            </div>
                            <div className="flex items-center gap-3">
                              <Wallet className="w-5 h-5 text-bgpurple1" />
                              <span className="text-lg font-bold text-textprimary dark:text-sidebartext">
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
                          <div className="p-4 bg-bordercolor1 dark:bg-darkbgprimary/50 rounded-2xl border border-bordergray100 dark:border-darkbgprimary focus-within:border-b border-bordergray200gpurple1 transition-all">
                            <InputField<FormValues>
                              name={`amountLimit.${index}.maxProfit`}
                              label="Max Profit"
                              type={FORM_FIELDS_TYPES.NUMBER}
                              className="!mb-0"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-bordercolor1 dark:bg-darkbgprimary/50 rounded-2xl border border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all">
                            <div className="block mb-2 text-xs font-bold text-sidebartext dark:bordercolor1 uppercase tracking-widest">
                              Max Profit
                            </div>
                            <div className="flex items-center gap-3">
                              <TrendingUp className="w-5 h-5 text-bgpurple1" />
                              <span className="text-lg font-bold text-textprimary dark:text-sidebartext">
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
