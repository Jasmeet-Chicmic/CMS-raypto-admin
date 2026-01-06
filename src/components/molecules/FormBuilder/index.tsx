"use client";

import { ReactNode } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import Button from "@/components/atoms/Button";

import RenderField from "./RenderField";
// Types
import { FormConfig } from "./types";

interface FormBuilderProps<T extends FieldValues> {
  formConfig: FormConfig<T>;
  onSubmit: SubmitHandler<T>;
  submitText?: string;
  className?: string;
  isLoading?: boolean;
  defaultValues?: DefaultValues<T>;
  scrollable?: boolean;
  secondaryAction?: ReactNode;
  onSecondaryAction?: () => void;
  additionalAction?: ReactNode;
  onAdditionalAction?: () => void;
  numberOfCols?: number;
}

function FormBuilder<T extends FieldValues>({
  formConfig,
  onSubmit,
  submitText = "Submit",
  className = "",
  isLoading = false,
  defaultValues,
  scrollable = false,
  secondaryAction,
  onSecondaryAction,
  additionalAction,
  onAdditionalAction,
}: Readonly<FormBuilderProps<T>>) {
  const methods = useForm<T>({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        <div className={scrollable ? "max-h-[60vh] overflow-y-auto pr-2" : ""}>
          <div className={`flex flex-wrap gap-x-2 justify-between`}>
            {(Array.isArray(formConfig)
              ? formConfig
              : formConfig(methods)
            )?.map((field) => {
              return <RenderField field={field} key={field.name} />;
            })}
          </div>
          <div className="flex items-center justify-between mb-4">
            {secondaryAction && (
              <button
                type="button"
                className="flex-auto text-left"
                onClick={onSecondaryAction}
              >
                {secondaryAction}
              </button>
            )}

            {additionalAction && (
              <button
                type="button"
                className="flex-auto justify-end text-left"
                onClick={onAdditionalAction}
              >
                {additionalAction}
              </button>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
        >
          {submitText}
        </Button>
      </form>
    </FormProvider>
  );
}

export default FormBuilder;
