import { InvoiceForm } from "@/components/atoms/InvoiceForm";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";

export default async function AddInvoice() {
  const count = await getRequest<
    { data: { data: { invoiceCounter: number } } },
    object
  >(API_END_POINTS.INVOICE_COUNTER, {});
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-800 dark:text-white">
      <InvoiceForm currentInvoiceNumber={count.data.data.invoiceCounter} />
    </div>
  );
}
