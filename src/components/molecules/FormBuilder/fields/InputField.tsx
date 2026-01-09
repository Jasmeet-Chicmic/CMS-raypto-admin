// Library
import {
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

import { FormFieldType } from "../types";

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  validation?: RegisterOptions<T, Path<T>>;
  defaultValue?: string;
  className?: string;
  labelClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interceptor?: (val: string) => any;
  width?: string;
}

export function InputField<T extends FieldValues>({
  name,
  label,
  type,
  placeholder,
  validation,
  className = "",
  width = "w-full",
  labelClassName = "",
  interceptor = (val: string) => val,
}: Readonly<InputFieldProps<T>>) {
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = errors[name];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(name, interceptor(value), { shouldDirty: true });
  };

  return (
    <div className={`mb-4 ${width} ${className}`}>
      <label
        htmlFor={name}
        className={`block mb-1 font-medium dark:text-white ${labelClassName}`}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-black dark:bg-gray-900 dark:border-gray-800 dark:text-white"
      />
      {fieldError && (
        <span className="text-red-500 text-[0.875] mt-1">
          {fieldError.message?.toString()}
        </span>
      )}
    </div>
  );
}
