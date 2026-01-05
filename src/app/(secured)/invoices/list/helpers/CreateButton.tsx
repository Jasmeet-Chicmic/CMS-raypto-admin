"use client";
import { ROUTES } from "@/shared/routes";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default function RedirectButton() {
  return (
    <button
      className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700"
      onClick={() => redirect(`${ROUTES.INVOICES_ADD}`)}
    >
      <Plus size={18} />
      <span>Create Invoice</span>
    </button>
  );
}
