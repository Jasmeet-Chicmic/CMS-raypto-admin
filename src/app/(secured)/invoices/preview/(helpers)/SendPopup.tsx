// src/app/(secured)/invoices/preview/(helpers)/SendPopup.tsx
import React from "react";

export default function SendPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  console.log("open: ", open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-black/30">
      <div className="bg-white w-full max-w-md h-full shadow-xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Send Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>
        <form className="flex flex-col gap-4 flex-1">
          <div>
            <label htmlFor="invoice-from" className="text-sm font-medium">
              From
            </label>
            <input
              id="invoice-from"
              className="w-full mt-1 border rounded px-3 py-2"
              defaultValue="shelbyComapny@email.com"
            />
          </div>
          <div>
            <label htmlFor="invoice-to" className="text-sm font-medium">
              To
            </label>
            <input
              id="invoice-to"
              className="w-full mt-1 border rounded px-3 py-2"
              defaultValue="qConsolidated@email.com"
            />
          </div>
          <div>
            <label htmlFor="invoice-subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="invoice-subject"
              className="w-full mt-1 border rounded px-3 py-2"
              defaultValue="Invoice of purchased Admin Templates"
            />
          </div>
          <div>
            <label htmlFor="invoice-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="invoice-message"
              className="w-full mt-1 border rounded px-3 py-2 h-28 resize-none"
            >
              Dear Queen Consolidated, Thank you for your business, always a
              pleasure to work with you! We have generated a new invoice in the
              amount of $95.59 We would appreciate payment of this invoice by
              05/11/2021
            </textarea>
          </div>
          <button
            type="button"
            className="text-indigo-600 text-sm underline flex items-center gap-1 hover:text-indigo-800 transition-colors"
            onClick={() => {
              console.log("View attached invoice");
            }}
          >
            <span>Invoice Attached</span>
          </button>
          <div className="flex gap-2 mt-auto">
            <button
              type="submit"
              className="bg-[#4F46E5] text-white px-6 py-2 rounded font-medium hover:bg-purple-700"
            >
              Send
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-600 px-6 py-2 rounded font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
