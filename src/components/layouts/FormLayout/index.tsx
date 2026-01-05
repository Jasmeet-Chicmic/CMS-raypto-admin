import Image from "next/image";
import React from "react";

import { authBg, authImg } from "@/assets";

import { FormLayoutType } from "./helpers/constants";

interface FormLayoutProps {
  layout?: FormLayoutType;
  children: React.ReactNode;
}

const FormLayout = ({
  layout = FormLayoutType.Default,
  children,
}: FormLayoutProps) => {
  if (layout === FormLayoutType.WithCover) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        <div className="hidden xl:flex w-full items-center justify-center bg-[#f8f7fa] relative xl:w-[66.66%] dark:bg-gray-800">
          <Image
            src={authImg}
            alt="Authentication illustration"
            width={700}
            height={550}
            priority
            className="max-h-[65%] w-auto"
          />
          <Image
            src={authBg}
            width={700}
            height={550}
            alt="Authentication Background"
            className="absolute bottom-0 left-0 w-full h-[35%]"
          />
        </div>

        <div className="flex w-full items-center justify-center p-[24px] sm:p-[48px] xl:w-[33.33%] dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          <div className="w-full max-w-[400px] mx-auto mt-[50px] dark:bg-gray-900 dark:border-gray-800 dark:text-white">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
