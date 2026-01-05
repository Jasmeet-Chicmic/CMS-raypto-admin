"use client";

import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BADGE_TYPE_NAMES,
  BADGE_TYPES,
  BadgeConditions,
  BadgeTypes,
} from "../../../app/(secured)/badges/helpers/types";
import { InputField } from "@/components/molecules/FormBuilder/fields/InputField";
import { SelectField } from "@/components/molecules/FormBuilder/fields/SelectField";
import {
  addBadgeAction,
  updateBadgeAction,
  uploadBadgeImage,
} from "@/api/badges";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/routes";
import { BadgePayload } from "@/shared/types";
import { BASE_URL } from "@/shared/constants";

const initialConditions: BadgeConditions = {
  eventsJoined: 0,
  eventsAttended: 0,
  pointsEarned: 0,
  postsCreated: 0,
  usersReferred: 0,
  learningModulesCompleted: 0,
  completedGoals: 0,
  connectionScore: 0,
  engagementScore: 0,
  growthScore: 0,
  impactScore: 0,
  businessGrowthScore: 0,
};

type BadgeFormValues = {
  name: string;
  type: BadgeTypes;
};

interface BadgeFormProps {
  isEdit?: boolean;
  badgeId?: string;
  defaultValues?: {
    name: string;
    type: BadgeTypes;
    imageURL?: string;
    conditions?: BadgeConditions;
  };
}

const BadgeForm = ({
  isEdit = false,
  badgeId,
  defaultValues,
}: BadgeFormProps) => {
  console.log("defaultvalue", defaultValues);

  const methods = useForm<BadgeFormValues>({
    defaultValues: {
      name: defaultValues?.name || "",
      type: defaultValues?.type ?? BADGE_TYPES.CONDITIONAL,
    },
  });

  const { handleSubmit, watch } = methods;

  const name = watch("name");
  const type = watch("type");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [conditions, setConditions] =
    useState<BadgeConditions>(initialConditions);

  useEffect(() => {
    if (defaultValues?.imageURL) {
      setImagePreview(defaultValues.imageURL);
    }
    if (defaultValues?.conditions) {
      setConditions(defaultValues.conditions);
    }
  }, [defaultValues]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleConditionChange = (key: keyof BadgeConditions, value: number) => {
    setConditions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async (data: BadgeFormValues) => {
    let imageURL = defaultValues?.imageURL || "";

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      const imageData = await uploadBadgeImage(formData);
      if (!imageData.status) {
        toast.error(imageData.message);
        return;
      }
      imageURL = imageData.data.filePath;
    }

    const payload: BadgePayload = {
      ...data,
      imageURL,
    };

    if (data.type === BADGE_TYPES.CONDITIONAL) {
      payload.conditions = conditions;
    }
    if (isEdit) {
      payload.badgeId = badgeId;
    }
    console.log(payload);

    const res = isEdit
      ? await updateBadgeAction(payload)
      : await addBadgeAction(payload);

    if (res.status) {
      toast.success(res.message);
      redirect(ROUTES.BADGES_LIST);
    } else {
      toast.error(res.message);
    }
  };

  const isFormValid = !!name.trim() && (!!image || !!imagePreview);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Edit Badge" : "Add New Badge"}
      </h1>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Badge Name */}
          <InputField
            name="name"
            label="Badge Name"
            type="text"
            validation={{ required: "Badge name is required" }}
          />

          {/* Badge Type */}
          <SelectField
            name="type"
            label="Badge Type"
            options={Object.entries(BADGE_TYPE_NAMES).map(([key, label]) => ({
              label,
              value: Number.parseInt(key),
            }))}
          />

          {/* Image Upload */}
          <div>
            <label
              htmlFor="badge-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Badge Image
            </label>

            {!imagePreview ? (
              <input
                id="badge-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            ) : (
              <div className="relative w-24 h-24 border rounded mt-2">
                <Image
                  src={isEdit ? BASE_URL + "/" + imagePreview : imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-white text-gray-700 border rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white transition text-sm shadow"
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Conditions */}
          {type === BADGE_TYPES.CONDITIONAL && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Conditions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-1">
                {Object.entries(conditions).map(([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm text-gray-600 capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      id={key}
                      type="number"
                      min={0}
                      value={value || 0}
                      onChange={(e) =>
                        handleConditionChange(
                          key as keyof BadgeConditions,
                          Number(e.target.value),
                        )
                      }
                      className="w-full border rounded-md px-3 py-1 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-5 py-2 rounded transition text-white ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isEdit ? "Update Badge" : "Create Badge"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BadgeForm;
