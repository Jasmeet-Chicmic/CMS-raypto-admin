import { Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { TAX_PERCENTAGE_OPTIONS } from "@/app/(secured)/invoices/helpers/constant";
import { calculateTotal } from "@/shared/utils";

import CheckClickOutside from "../CheckClickOutside";
import Select from "../Select";
import { InvoiceFormType } from "./InvoiceForm";

const InvoiceItem = ({
  field,
  index,
  control,
  register,
  items,
  remove,
  arr,
  errors,
}: {
  field: FieldArrayWithId<InvoiceFormType, "items", "id">;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<InvoiceFormType, any, InvoiceFormType>;
  register: UseFormRegister<InvoiceFormType>;
  items: InvoiceFormType["items"];
  remove: UseFieldArrayRemove;
  arr: FieldArrayWithId<InvoiceFormType, "items", "id">[];
  errors: FieldErrors<InvoiceFormType>;
}) => {
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  return (
    <tr key={field.id} className="border-t">
      <td className="p-2">
        <input
          {...register(`items.${index}.title`, { required: true })}
          className="w-100 p-1 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
        />
        {errors?.items?.[index]?.type && (
          <span className="text-red-500 text-[0.875] mt-1">Required</span>
        )}
        <textarea
          {...register(`items.${index}.description`)}
          placeholder="Description"
          className="w-full mt-1 text-[0.875] p-1 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
        />
      </td>
      <td className="p-2 flex flex-col gap-5">
        <div>
          <input
            type="number"
            {...register(`items.${index}.cost`, { required: true })}
            className="w-16 p-1 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
          />
          {errors?.items?.[index]?.cost && (
            <span className="text-red-500 text-[0.875] mt-1">Required</span>
          )}
        </div>
        <div>
          <p>Discount:</p>
          <div className="flex gap-2">
            <p>{items?.[index]?.discountPercentage || 0}%</p>
            <p>{items?.[index]?.tax1Percentage || 0}%</p>
            <p>{items?.[index]?.tax2Percentage || 0}%</p>
          </div>
        </div>
      </td>
      <td className="p-2">
        <input
          type="number"
          {...register(`items.${index}.quantity`, { required: true })}
          className="w-12 p-1 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
        />
        {errors?.items?.[index]?.quantity && (
          <span className="text-red-500 text-[0.875] mt-1">Required</span>
        )}
      </td>
      <td className="p-2">
        {`$ ${Number(calculateTotal({ cost: items?.[index]?.cost, quantity: items?.[index]?.quantity, discount: items?.[index]?.discountPercentage, tax1Percentage: items?.[index]?.tax1Percentage, tax2Percentage: items?.[index]?.tax2Percentage }).toFixed(2))}`}
      </td>
      <td className="p-2">
        {arr.length > 1 && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500"
          >
            <Trash2 size={16} />
          </button>
        )}
        <CheckClickOutside onClick={() => setShowDiscountPopup(false)}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDiscountPopup((prev) => !prev)}
            >
              <Settings size={16} />
            </button>
            {showDiscountPopup && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                {/* <form> */}
                <div>
                  <label
                    htmlFor={`discount-${index}`}
                    className="text-[0.875rem] text-[#A3AED0] dark:text-white"
                  >
                    Discount(%)
                  </label>
                  <input
                    id={`discount-${index}`}
                    type="text"
                    {...register(`items.${index}.discountPercentage`)}
                    className="w-16 p-1 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <div>
                    <label
                      htmlFor={`tax1-${index}`}
                      className="text-[0.875rem] text-[#A3AED0] dark:text-white"
                    >
                      Tax 1
                    </label>
                    <Controller
                      name={`items.${index}.tax1Percentage`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          inputId={`tax1-${index}`}
                          value={TAX_PERCENTAGE_OPTIONS.find(
                            (i) => i.value == field.value,
                          )}
                          onChange={(val) => {
                            console.log(val);
                            field.onChange(val?.value);
                          }}
                          options={TAX_PERCENTAGE_OPTIONS}
                          isClearable
                          placeholder="Select Tax Percentage"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`tax2-${index}`}
                      className="text-[0.875rem] text-[#A3AED0] dark:text-white"
                    >
                      Tax 2
                    </label>
                    <Controller
                      name={`items.${index}.tax2Percentage`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          inputId={`tax2-${index}`}
                          value={TAX_PERCENTAGE_OPTIONS.find(
                            (i) => i.value == field.value,
                          )}
                          onChange={(val) => field.onChange(val?.value)}
                          options={TAX_PERCENTAGE_OPTIONS}
                          isClearable
                          placeholder="Select Tax Percentage"
                        />
                      )}
                    />
                  </div>
                </div>
                <hr />
              </div>
            )}
          </div>
        </CheckClickOutside>
      </td>
    </tr>
  );
};

export default InvoiceItem;
