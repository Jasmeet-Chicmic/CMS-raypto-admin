"use server";
import { InvoiceFormType } from "@/components/atoms/InvoiceForm/InvoiceForm";
import { API_END_POINTS } from "@/shared/api";
import { INVOICE_ITEM_TYPE } from "@/shared/constants";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/fetcher";
import { Invoice, ResponseType } from "@/shared/types";

type PayloadType = Omit<
  Omit<Omit<InvoiceFormType, "invoiceNumber">, "items">,
  "user"
> & {
  userId: string;
  items: {
    type?: INVOICE_ITEM_TYPE;
    description?: string;
    cost?: number;
    quantity?: number;
    price?: number;
    discountPercentage?: number;
    tax1Percentage?: number;
    tax2Percentage?: number;
  }[];
};

export async function createInvoicesAction(payload: PayloadType) {
  return await postRequest<ResponseType, PayloadType>(
    API_END_POINTS.INVOICES,
    payload,
  );
}

export async function updateInvoiceAction(
  payload: PayloadType & { invoiceId: string },
) {
  return await putRequest<ResponseType, PayloadType & { invoiceId: string }>(
    API_END_POINTS.INVOICES,
    payload,
  );
}
export async function deleteInvoiceAction(payload: { invoiceIds: string[] }) {
  return await deleteRequest<
    ResponseType,
    {
      invoiceIds: string[];
    }
  >(API_END_POINTS.INVOICES, payload);
}
export async function downloadInvoiceAction(payload: { invoiceId: string }) {
  return await getRequest<ResponseType, { invoiceId: string }>(
    API_END_POINTS.INVOICES_DOWNLOAD,
    payload,
  );
}

export const fetchInvoiceDetails = async (id: string) => {
  return getRequest(
    API_END_POINTS.INVOICES_DETAILS,
    { invoiceId: id },
    {
      transformer: (response: {
        data: {
          data: Invoice;
        };
      }) => response.data.data,
    },
  );
};
