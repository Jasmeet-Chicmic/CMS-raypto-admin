import { format } from "date-fns";

import { fetchInvoiceDetails } from "@/api/invoices";
import { Invoice } from "@/shared/types";

import Actions from "./(helpers)/Actions";

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

function calculateInvoice(data: Invoice) {
  let discountPercentageTotal = 0;
  let subTotal = 0;
  let tax1PercentageTotal = 0;
  let tax2PercentageTotal = 0;

  const items = data.items.map((item) => {
    const price = item.cost * item.quantity;
    discountPercentageTotal += item.discountPercentage;
    subTotal += price;
    tax1PercentageTotal += item.tax1Percentage;
    tax2PercentageTotal += item.tax2Percentage;
    return {
      name: item.title,
      description: item.description,
      cost: item.cost,
      quantity: item.quantity,
      discount: item.discountPercentage,
      price,
    };
  });

  const totalDiscount = (subTotal * discountPercentageTotal) / 100;
  const total =
    subTotal -
    totalDiscount +
    ((subTotal - totalDiscount) * (tax1PercentageTotal + tax2PercentageTotal)) /
      100;

  return {
    items,
    subTotal,
    totalDiscount,
    tax1: tax1PercentageTotal,
    tax2: tax2PercentageTotal,
    total,
  };
}

const InvoicePreviewPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const { id } = await searchParams;

  if (!id) {
    return <div className="p-6 text-red-500">Invalid invoice ID.</div>;
  }

  let data;
  try {
    data = await fetchInvoiceDetails(id);
  } catch {
    return <div className="p-6 text-red-500">Failed to load invoice.</div>;
  }

  const calculatedData = calculateInvoice(data);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <main className="flex-1 p-6 bg-white rounded-lg shadow dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Raypto</h1>
            <p className="text-sm dark:text-white">
              Office 149, 450 South Brand Brooklyn
            </p>
            <p className="text-sm dark:text-white">
              San Diego County, CA 91905, USA
            </p>
            <p className="text-sm dark:text-white">
              +1 (123) 456 7891, +44 (876) 543 2198
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md text-sm space-y-1 dark:bg-gray-800 dark:border-gray-800 dark:text-white">
            <p className="font-medium dark:text-white">
              Invoice #{data.invoiceNumber}
            </p>
            <p className="dark:text-white">
              Date Issued: {format(data.dateIssued, "MMMM d, yyyy")}
            </p>
            <p className="dark:text-white">
              Date Due: {format(data.dateDue, "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Client & Bill Info */}
        <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
          <div>
            <p className="font-semibold mb-1 dark:text-white">Invoice To:</p>
            <p className="dark:text-white">{data.user.firstName}</p>
            <p className="dark:text-white">{data.user.lastName}</p>
            <p className="dark:text-white">
              {data?.user?.billingAddress?.address} <br />
              {data?.user?.billingAddress?.city},{" "}
              {data?.user?.billingAddress?.state} <br />
              {data?.user?.billingAddress?.zipcode}{" "}
              {data?.user?.billingAddress?.country}
            </p>
            <p className="dark:text-white">{data.user.email}</p>
          </div>
          <div>
            <p className="font-semibold mb-1 dark:text-white">Bill To:</p>
            <p className="dark:text-white">
              Total Due: {formatCurrency(calculatedData.total)}
            </p>
            <p className="dark:text-white">
              Bank name: {data?.user?.bankDetails?.bankName}
            </p>
            <p className="dark:text-white">
              Country: {data.user.billingAddress?.country}
            </p>
            <p className="dark:text-white">
              IBAN: {data?.user?.bankDetails?.accountNumber}
            </p>
            <p className="dark:text-white">
              SWIFT code: {data?.user?.bankDetails?.ifscCode}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mt-6 text-sm border">
          <thead className="bg-gray-100 dark:bg-gray-800 dark:border-gray-800 dark:text-white">
            <tr>
              <th className="text-left p-2 border dark:text-white">ITEM</th>
              <th className="text-left p-2 border dark:text-white">
                DESCRIPTION
              </th>
              <th className="text-left p-2 border dark:text-white">COST</th>
              <th className="text-left p-2 border dark:text-white">QTY</th>
              <th className="text-left p-2 border dark:text-white">DISC</th>
              <th className="text-left p-2 border dark:text-white">PRICE</th>
            </tr>
          </thead>
          <tbody>
            {calculatedData.items.map((item, idx) => (
              <tr
                key={idx}
                className="border-t dark:border-gray-800 dark:text-white"
              >
                <td className="p-2 border dark:text-white">{item.name}</td>
                <td className="p-2 border dark:text-white">
                  {item.description}
                </td>
                <td className="p-2 border dark:text-white">
                  {formatCurrency(item.cost)}
                </td>
                <td className="p-2 border dark:text-white">{item.quantity}</td>
                <td className="p-2 border dark:text-white">{item.discount}%</td>
                <td className="p-2 border dark:text-white">
                  {formatCurrency(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6 text-sm">
          <div>
            <p className="font-semibold dark:text-white">Salesperson:</p>
            <p className="dark:text-white">{data.salesPerson}</p>
            {data.salesPersonDescription && (
              <p className="mt-1 dark:text-white">
                {data.salesPersonDescription}
              </p>
            )}
            <p className="mt-2 dark:text-white">Thanks for your business</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="dark:text-white">
              Subtotal:{" "}
              <span className="font-semibold dark:text-white">
                {formatCurrency(calculatedData.subTotal)}
              </span>
            </p>
            <p className="dark:text-white">
              Discount:{" "}
              <span className="font-semibold dark:text-white">
                {formatCurrency(calculatedData.totalDiscount)}
              </span>
            </p>
            <p className="dark:text-white">
              Tax1:{" "}
              <span className="font-semibold dark:text-white">
                {calculatedData.tax1}%
              </span>
            </p>
            <p className="dark:text-white">
              Tax2:{" "}
              <span className="font-semibold dark:text-white">
                {calculatedData.tax2}%
              </span>
            </p>
            <p className="pt-2 border-t font-bold text-lg dark:text-white">
              Total: {formatCurrency(calculatedData.total)}
            </p>
          </div>
        </div>

        {/* Footer Notes */}
        <p className="mt-6 pt-4 border-t text-sm dark:text-white">
          <strong>Note:</strong> {data.notes}
        </p>
      </main>

      {/* Actions Section */}
      <Actions id={id} />
    </div>
  );
};

export default InvoicePreviewPage;
