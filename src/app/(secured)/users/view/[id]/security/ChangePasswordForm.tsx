"use client";
import { X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateUserPasswordAction } from "@/api/user";
import FormBuilder from "@/components/molecules/FormBuilder";
import { REGEX } from "@/shared/strings";

const ChangePasswordForm = ({ userId }: { userId: string }) => {
  const [hint, showHint] = useState(true);
  const [isLoading, startTransition] = useTransition();
  const handleSubmit = (data: {
    password: string;
    confirmPassword: string;
  }) => {
    startTransition(async () => {
      const res = await updateUserPasswordAction({
        password: data.password,
        userId,
      });
      if (res.status) {
        toast.success("Password Updated Succesfully.");
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
    <>
      {hint && (
        <div className="bg-orange-100 rounded-lg shadow p-4">
          <X
            className="place-self-end cursor-pointer"
            onClick={() => showHint(false)}
          />
          <h2 className="text-orange-400">
            Ensure that these requirements are met
          </h2>
          <h3 className="text-orange-400">
            Minimum 8 characters long, uppercase & symbol
          </h3>
        </div>
      )}
      <FormBuilder
        formConfig={({ watch }) => [
          {
            type: "password",
            name: "password",
            label: "New Password",
            placeholder: "Enter New Password",
            validation: {
              required: true,
              pattern: {
                value: REGEX.STRONG_PASSWORD,
                message:
                  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            },
          },
          {
            type: "password",
            name: "confirmPassword",
            label: "Confirm New Password",
            placeholder: "Enter Confirm New Password",
            validation: {
              required: true,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            },
          },
        ]}
        onSubmit={handleSubmit}
        numberOfCols={2}
        isLoading={isLoading}
      />
    </>
  );
};
export default ChangePasswordForm;
