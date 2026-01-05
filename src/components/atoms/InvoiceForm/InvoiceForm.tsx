"use client";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import { createInvoicesAction, updateInvoiceAction } from "@/api/invoices";
import { getUsersAction } from "@/api/user";
import { ROUTES } from "@/shared/routes";
import { GetParamsType, Invoice, User } from "@/shared/types";
import { calculateTotal } from "@/shared/utils";

import AsyncSelect, {
  AsyncSelectGetDataParams,
} from "../AsyncSelect/AsyncSelect";
import Button from "../Button";
import InvoiceItem from "./InvoicItem";

export interface InvoiceFormType {
  user: User;
  invoiceNumber: string;
  dateIssued: string;
  dateDue: string;
  items: {
    title?: string;
    description?: string;
    cost?: number;
    quantity?: number;
    discountPercentage?: number;
    tax1Percentage?: number;
    tax2Percentage?: number;
  }[];
  salesPerson: string;
  salesPersonDescription: string;
  notes: string;
}

const InvoiceForm = ({
  isEdit,
  data,
  invoiceId,
  currentInvoiceNumber,
}: {
  isEdit?: boolean;
  data?: Invoice;
  invoiceId?: string;
  currentInvoiceNumber?: number;
}) => {
  const [isLoading, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormType>({
    defaultValues: {
      items: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const user = useWatch({ control: control, name: "user" });
  console.log(user, "dsfmjksnd");
  const items = useWatch({ control: control, name: "items" });
  const total = Number(
    items
      ?.reduce((acc, curr) => {
        const price = calculateTotal({
          cost: curr?.cost,
          quantity: curr?.quantity,
          discount: curr?.discountPercentage,
          tax1Percentage: curr?.tax1Percentage,
          tax2Percentage: curr?.tax2Percentage,
        });
        return acc + price;
      }, 0)
      .toFixed(2),
  );
  console.log(watch());

  async function onSubmit(payload: InvoiceFormType) {
    const updatedPayload = {
      userId: payload.user._id,
      dateIssued: payload.dateIssued,
      dateDue: payload.dateDue,
      items: payload?.items?.map((i) => ({
        title: i.title,
        description: i?.description || "",
        cost: i?.cost || 0,
        quantity: i?.quantity || 0,
        tax1Percentage: i?.tax1Percentage || 0,
        tax2Percentage: i?.tax2Percentage || 0,
        discountPercentage: i?.discountPercentage || 0,
      })),
      salesPerson: payload.salesPerson,
      salesPersonDescription: payload?.salesPersonDescription || "",
      notes: payload?.notes || "",
    };
    if (isEdit && data && invoiceId) {
      startTransition(async () => {
        const res = await updateInvoiceAction({
          ...updatedPayload,
          invoiceId: invoiceId,
        });
        if (res.status) {
          console.log("update invoice payload>>>>>", res);
          toast.success("Invoice updated successfully");
          redirect(ROUTES.INVOICES_LIST);
        } else {
          toast.error(res.message);
        }
      });
    } else {
      startTransition(async () => {
        const res = await createInvoicesAction(updatedPayload);
        if (res.status) {
          toast.success("Invoice created successfully");
          console.log("create invoice payload>>>>>", res);
          redirect(ROUTES.INVOICES_LIST);
        } else {
          toast.error(res.message);
        }
      });
    }
  }

  useEffect(() => {
    if (isEdit && data) {
      const defaultValues = {
        user: data.user,
        invoiceNumber: data.invoiceNumber || "",
        dateIssued: new Date(data?.dateIssued)
          ?.toISOString?.()
          ?.split?.("T")?.[0],
        dateDue: new Date(data.dateDue)?.toISOString?.()?.split?.("T")?.[0],
        items: data?.items,
        salesPerson: data.salesPerson || "",
        salesPersonDescription: data.salesPersonDescription || "",
        notes: data.notes || "",
      };

      console.log("default VAluesssss", defaultValues);

      // Reset the whole form with data
      reset(defaultValues);
    }
  }, [isEdit, data, reset]);
  const getUsers = async (params: AsyncSelectGetDataParams) => {
    const payload: GetParamsType = {
      sortKey: params?.sortByKey,
      sortDirection: params?.sortDirection,
      skip: (params?.page - 1) * params?.limit,
      limit: params?.limit,
    };
    if (params.searchString) {
      payload.searchString = params.searchString;
    }
    const res = await getUsersAction(payload);
    console.log(payload, res, "dsfknsdkj");
    const resData = {
      count: res?.data?.total,
      data: res?.data?.users?.map?.((item: User) => ({
        ...item,
        value: item?._id,
        label: `${item?.firstName ?? ""} ${item?.lastName ?? ""}`,
      })),
    };
    return resData;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Vuexy</h1>
            <p className="text-gray-500 dark:text-white">
              Office 149, 450 South Brand Brooklyn
            </p>
            <p className="text-gray-500 dark:text-white">
              San Diego County, CA 91905, USA
            </p>
            <p className="text-gray-500 dark:text-white">
              +1 (123) 456 7891, +44 (876) 543 2198
            </p>
          </div>

          <div className="w-[300px] space-y-2 bg-gray-100 p-4 rounded dark:bg-gray-800 dark:border-gray-800 dark:text-white">
            <div>
              <label
                htmlFor="invoiceNumber"
                className="text-[0.875rem] text-[#A3AED0] dark:text-white"
              >
                Invoice
              </label>
              <input
                id="invoiceNumber"
                {...register("invoiceNumber")}
                className="w-full p-1 border rounded text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                disabled
                {...(currentInvoiceNumber && { value: currentInvoiceNumber })}
              />
            </div>
            <div>
              <label
                htmlFor="dateIssued"
                className="text-[0.875rem] text-[#A3AED0] dark:text-white"
              >
                Date Issued
              </label>
              <input
                id="dateIssued"
                type="date"
                {...register("dateIssued", {
                  required: true,
                  valueAsDate: true,
                })}
                className="w-full p-1 border rounded text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-white"
              />
              {errors.dateIssued && (
                <span className="text-red-500 text-[0.875] mt-1">Required</span>
              )}
            </div>
            <div>
              <label
                htmlFor="dateDue"
                className="text-[0.875rem] text-[#A3AED0] dark:text-white"
              >
                Due Date
              </label>
              <input
                id="dateDue"
                type="date"
                {...register("dateDue", { required: true, valueAsDate: true })}
                className="w-full p-1 border rounded text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-white"
              />
              {errors.dateDue && (
                <span className="text-red-500 text-[0.875] mt-1">Required</span>
              )}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="invoiceTo"
              className="block text-sm font-medium dark:text-white"
            >
              Invoice To
            </label>
            <Controller
              name="user"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  inputId="invoiceTo"
                  // @ts-expect-error - value is not a valid prop for AsyncSelect
                  value={field.value}
                  onChange={field.onChange}
                  getData={getUsers}
                  isClearable
                  placeholder="Select User"
                />
              )}
              rules={{ required: true }}
            />
            {errors.user && (
              <span className="text-red-500 text-[0.875] mt-1">Required</span>
            )}
            {user && (
              <div>
                <p>{user?.billingAddress?.address || ""}</p>
                {/* <p>{user.contactNumber}</p> */}
                <p>{user.email}</p>
              </div>
            )}
          </div>
          <div className="text-sm">
            <p>
              <strong>Total Due:</strong> ${total || "0.00"}
            </p>
            <p>
              <strong>Bank name:</strong> {user?.bankDetails?.bankName || ""}
            </p>
            <p>
              <strong>Country:</strong> {user?.billingAddress?.country || ""}
            </p>
            <p>
              <strong>IBAN:</strong> {user?.bankDetails?.accountNumber || ""}
            </p>
            <p>
              <strong>SWIFT code:</strong> {user?.bankDetails?.ifscCode || ""}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-left border-t border-b">
            <thead className="bg-white text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-white">
              <tr>
                <th className="p-2 text-gray-500 dark:text-white">Item</th>
                <th className="p-2 text-gray-500 dark:text-white">Cost</th>
                <th className="p-2 text-gray-500 dark:text-white">Qty</th>
                <th className="p-2 text-gray-500 dark:text-white">Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index, arr) => (
                <InvoiceItem
                  field={field}
                  key={field.id}
                  index={index}
                  control={control}
                  register={register}
                  items={items}
                  remove={remove}
                  arr={arr}
                  errors={errors}
                />
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={() =>
              append({
                description: "",
                cost: 0,
                quantity: 0,
              })
            }
            className="mt-2 flex items-center gap-2 text-indigo-600"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register("salesPerson", { required: true })}
              placeholder="Salesperson"
              className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
            />
            {errors.salesPerson && (
              <span className="text-red-500 text-[0.875] mt-1">Required</span>
            )}
            <input
              {...register("salesPersonDescription")}
              placeholder="Thanks for your business"
              className="w-full mt-2 p-2 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
            />
          </div>
          <div className="space-y-2 text-right text-sm">
            <p>
              Subtotal: $
              {items?.reduce((acc, curr) => {
                return acc + (curr?.cost ?? 0) * (curr?.quantity ?? 0);
              }, 0) || "0.00"}
            </p>
            <p>
              Discount: $
              {items.reduce((acc, curr) => {
                return (
                  acc +
                  ((curr?.cost ?? 0) *
                    (curr?.quantity ?? 0) *
                    (curr?.discountPercentage ?? 0)) /
                    100
                );
              }, 0)}
            </p>
            <p>
              Tax1 : $
              {items.reduce((acc, curr) => {
                return (
                  acc +
                  ((curr?.cost ?? 0) *
                    (curr?.quantity ?? 0) *
                    (curr?.tax1Percentage ?? 0)) /
                    100
                );
              }, 0)}
            </p>
            <p>
              Tax2 : $
              {items.reduce((acc, curr) => {
                return (
                  acc +
                  ((curr?.cost ?? 0) *
                    (curr?.quantity ?? 0) *
                    (curr?.tax2Percentage ?? 0)) /
                    100
                );
              }, 0)}
            </p>
            <p className="font-bold text-lg">Total: ${total || "0.00"}</p>
          </div>
        </div>
        <div>
          <label htmlFor="notes">Notes:-</label>
          <textarea
            id="notes"
            className="w-full mt-2 p-2 border rounded dark:bg-gray-900 dark:border-gray-800 dark:text-white"
            {...register("notes")}
          />
        </div>
      </div>
      {/* Submit button */}

      <div className=" w-[20%]">
        <div className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <Button variant="primary" type="submit" isLoading={isLoading}>
                UPDATE
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" isLoading={isLoading} type="button">
                Preview
              </Button>
              <Button variant="primary" type="submit" isLoading={isLoading}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
