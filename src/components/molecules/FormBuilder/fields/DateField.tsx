import React from "react";
import {
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface DateFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  validation?: RegisterOptions<T, Path<T>>;
  defaultValue?: string;
  className?: string;
  width?: string;
}

const DateField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  validation,
  className = "",
  width = "w-full",
}: Readonly<DateFieldProps<T>>) => {
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = errors[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(name, value as PathValue<T, Path<T>>);
  };

  return (
    <div className={`mb-4 ${width} ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 font-medium dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type="date"
        placeholder={placeholder}
        {...register(name, validation)}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      {fieldError && (
        <p className="text-red-500 text-[0.875] mt-1">
          {fieldError.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default DateField;
