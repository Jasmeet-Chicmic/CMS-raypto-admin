//Library
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  validation?: RegisterOptions<T, Path<T>>;
  className?: string;
  width?: string;
}

export function PasswordField<T extends FieldValues>({
  name,
  label,
  placeholder,
  validation,
  className = "",
  width = "w-full",
}: Readonly<InputFieldProps<T>>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = errors[name];
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`mb-4 ${width} ${className}`}>
      <label htmlFor={name} className="block mb-1 font-medium dark:text-white">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          placeholder={placeholder}
          {...register(name, validation)}
          className="w-full px-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-black dark:bg-gray-900 dark:border-gray-800 dark:text-white"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer select-none"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <Eye className="h-5 w-5 text-gray-400" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      {fieldError && (
        <span className="text-red-500 text-[0.875] mt-1">
          {fieldError.message?.toString()}
        </span>
      )}
    </div>
  );
}
