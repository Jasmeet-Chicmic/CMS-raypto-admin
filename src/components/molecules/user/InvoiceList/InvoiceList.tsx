import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, Invoice, ResponseType } from "@/shared/types";

import InvoiceTable from "./InvoiceTable";

const InvoiceList = async ({ userId }: { userId: string }) => {
  const data = await getRequest<
    ResponseType & { data: { data: Invoice[]; count: number } },
    GetParamsType
  >(API_END_POINTS.INVOICES, {
    userId,
  });
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
      <InvoiceTable data={data.data} />
    </div>
  );
};

export default InvoiceList;
