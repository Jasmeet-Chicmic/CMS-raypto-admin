"use client"; // Required at top for client components

import { DollarSign, Send } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";

import { downloadInvoiceAction } from "@/api/invoices";
import { ROUTES } from "@/shared/routes";

import SendPopup from "./SendPopup";

function Actions({ id }: { id: string }) {
  const [sendPopup, setSendPopup] = useState(false);

  const [isDownloading, startDownloadTransition] = useTransition();

  const handleSend = () => {
    setSendPopup(true);
  };

  const handleDownload = () => {
    startDownloadTransition(async () => {
      const res = await downloadInvoiceAction({ invoiceId: id });
      console.log(res);
    });
  };

  const handlePrint = () => {
    console.log("Printing");
  };

  const handleEdit = () => {
    redirect(`${ROUTES.INVOICES_EDIT}?id=${id}`);
  };

  return (
    <>
      <SendPopup open={sendPopup} onClose={() => setSendPopup(false)} />

      {/* Actions Section */}
      <section className="w-full md:w-1/4">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 items-stretch dark:bg-gray-900 dark:border-gray-800 dark:text-white">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-[#4F46E5] text-white font-medium rounded-md py-2 px-4 text-base shadow hover:bg-purple-700 transition"
            onClick={() => handleSend()}
          >
            <Send className="w-4 h-4" />
            Send Invoice
          </button>
          <button
            type="button"
            className="bg-gray-100 text-gray-400 hover:bg-gray-200 font-medium rounded-md py-2 px-4 text-base dark:bg-gray-800 dark:border-gray-800 dark:text-white"
            disabled={isDownloading}
            onClick={() => handleDownload()}
          >
            Download
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 bg-gray-100 text-gray-400 hover:bg-gray-200 font-medium rounded-md py-2 px-4 text-base dark:bg-gray-800 dark:border-gray-800 dark:text-white"
              onClick={() => handlePrint()}
            >
              Print
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-100 text-gray-400 hover:bg-gray-200 font-medium rounded-md py-2 px-4 text-base dark:bg-gray-800 dark:border-gray-800 dark:text-white"
              onClick={() => handleEdit()}
            >
              Edit
            </button>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-green-500 text-white font-medium rounded-md py-2 px-4 text-base shadow hover:bg-green-600 transition mt-2 dark:bg-gray-800 dark:border-gray-800 dark:text-white"
            onClick={() => handleSend()}
          >
            <DollarSign className="w-4 h-4" />
            Add Payment
          </button>
        </div>
      </section>
    </>
  );
}
export default Actions;
