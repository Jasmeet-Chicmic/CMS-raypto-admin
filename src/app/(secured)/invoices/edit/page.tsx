// "use client";
import { InvoiceForm } from "@/components/atoms/InvoiceForm";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { Invoice } from "@/shared/types";

export default async function EditInvoice({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id: invoiceId } = await searchParams;
  const isEdit = !!invoiceId;

  const data = await getRequest<
    { data: { data: Invoice } },
    { invoiceId: string }
  >(API_END_POINTS.INVOICES_DETAILS, {
    invoiceId: invoiceId,
  });

  console.log("datazzzzzz", data);
  console.log("invoiceId", invoiceId);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <InvoiceForm
        isEdit={isEdit}
        data={data?.data?.data}
        invoiceId={invoiceId}
      />
    </div>
  );
}
