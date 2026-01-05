"use client";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { RayptoLogo } from "@/assets";
import { loginAction } from "@/api/auth";
import FormLayout from "@/components/layouts/FormLayout";
import { FormLayoutType } from "@/components/layouts/FormLayout/helpers/constants";
import FormBuilder from "@/components/molecules/FormBuilder";
import { getRequiredFieldMessage } from "@/components/molecules/FormBuilder/helpers/utils";
import { FormConfig } from "@/components/molecules/FormBuilder/types";
import { ROUTES } from "@/shared/routes";
import { FIELD_NAMES, REGEX, STRING } from "@/shared/strings";
import { createSessionClient } from "@/shared/utils";

export interface LoginFormValues {
  email: string;
  password: string;
}
const config: FormConfig<LoginFormValues> = [
  {
    name: FIELD_NAMES.EMAIL,
    label: STRING.EMAIL,
    type: FIELD_NAMES.EMAIL,
    placeholder: "john.doe@example.com",
    validation: {
      required: getRequiredFieldMessage(STRING.EMAIL),
      pattern: {
        value: REGEX.EMAIL,
        message: "Invalid email format",
      },
    },
  },
  {
    name: FIELD_NAMES.PASSWORD,
    label: STRING.PASSWORD,
    type: FIELD_NAMES.PASSWORD,
    placeholder: "••••••••",
    validation: {
      required: getRequiredFieldMessage(STRING.PASSWORD),
      pattern: {
        value: REGEX.STRONG_PASSWORD,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
  },
];
const Login = () => {
  const [isLoading, startTransition] = useTransition();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("unauthorized") === "true") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      toast.error("Session expired. Please login again.");
    }
  }, [searchParams]);

  const handleSubmit = async (data: LoginFormValues) => {
    const payload = { ...data /*registrationToken: registrationToken || "" */ };
    startTransition(async () => {
      const res = await loginAction(payload);
      if (res?.data?.token) {
        const success = await createSessionClient(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data?.admin?._id);
        if (success) {
          toast.success(res.message);
          redirect(ROUTES.DASHBOARD_ANALYTICS);
        } else {
          toast.error("Session creation failed.");
        }
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <FormLayout layout={FormLayoutType.Default}>
      <div className="brand-logo max-w-[250px] text-center mx-auto mb-6">
        <Image
          src={RayptoLogo.src}
          className="mx-auto"
          width={164}
          height={52}
          alt="logo"
        />
      </div>
      <h4 className="mb-1">Welcome to Raypto! 👋</h4>
      <p className="mb-6">
        Please sign-in to your account and start the adventure
      </p>
      <FormBuilder<LoginFormValues>
        formConfig={config}
        onSubmit={handleSubmit}
        submitText="Login"
        isLoading={isLoading}
        className="mb-6"
        secondaryAction={
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 ms-2">
              {/* <input
                type="checkbox"
                id="remember-me"
                className="form-checkbox h-4 w-4"
              /> */}
              {/* <label htmlFor="remember-me" className="!text-[15px]">
                Remember Me
              </label> */}
            </div>
          </div>
        }
        additionalAction={
          <p className="mb-0 text-end">
            {/* <Link href={ROUTES.FORGOT_PASSWORD} className="text-indigo-600">
              Forgot Password?
            </Link> */}
          </p>
        }
      />
    </FormLayout>
  );
};

export default Login;
