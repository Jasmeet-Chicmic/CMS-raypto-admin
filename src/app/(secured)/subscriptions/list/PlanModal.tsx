"use client";

import CustomModal from "@/components/molecules/CustomModal";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FieldConfig } from "@/components/molecules/FormBuilder/types";
import { SubscriptionPlan } from "@/shared/types";

const planFieldConfig: FieldConfig<SubscriptionPlan>[] = [
  {
    name: "name",
    label: "Plan Name",
    type: "text",
    validation: {
      required: "Plan name is required",
    },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    validation: {
      required: "Description is required",
    },
  },
  {
    name: "monthlyPrice",
    label: "Monthly Price",
    type: "number",
    validation: {
      required: "Monthly price is required",
    },
    width: "w-[49%]",
  },
  {
    name: "yearlyPrice",
    label: "Yearly Price",
    type: "number",
    validation: {
      required: "Yearly price is required",
    },
    width: "w-[49%]",
  },
  {
    name: "features",
    label: "Features",
    type: "array",
    items: {
      type: "text",
    },
    validation: {
      required: "Features are required",
    },
  },
  {
    name: "color",
    label: "Color",
    type: "color",
    validation: {
      required: "Color is required",
    },
    width: "w-[49%]",
  },
  {
    name: "isActive",
    label: "Active",
    type: "switch",
  },
];

const PlanModal = ({
  isOpen,
  onClose,
  onSave,
  plan,
  mode,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: SubscriptionPlan) => void;
  plan?: SubscriptionPlan;
  mode: "create" | "edit";
  isLoading: boolean;
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} size="2xl">
      {/* Heading and Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {mode === "create" ? "Create Plan" : "Edit Plan"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-white">
          {mode === "create"
            ? "Create a new subscription plan for your users"
            : "Edit the details of an existing plan"}
        </p>
      </div>
      {/* Form */}
      <FormBuilder<SubscriptionPlan>
        onSubmit={onSave}
        formConfig={planFieldConfig}
        defaultValues={mode === "edit" ? plan : undefined}
        isLoading={isLoading}
        scrollable
      />
    </CustomModal>
  );
};

export default PlanModal;
