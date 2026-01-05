"use client";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import { assignPromoCodeAction, getPromoCodeAction } from "@/api/promoCodes";
import Button from "@/components/atoms/Button";
import { PageLabel } from "@/components/atoms/Pagination";
import SearchInput from "@/components/atoms/SearchInput";
import CustomModal from "@/components/molecules/CustomModal";
import { PromoCode } from "@/shared/types";

const AssignPromoCodeModal = ({
  userId,
  assignedPromoCodes,
}: {
  userId: string;
  assignedPromoCodes: string[];
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    getPromoCodeAction({
      ...(search && { searchString: search }),
      skip: currentPage * pageSize,
      limit: pageSize,
    }).then((res) => {
      setPromoCodes(res.data.data);
      setTotal(res.data.count);
    });
  }, [search, currentPage, pageSize]);
  const handleAssignPromoCode = async (promoCodeId: string) => {
    const res = await assignPromoCodeAction({
      promotionalCodeId: promoCodeId,
      userId: userId,
    });
    if (res.status) {
      toast.success("Promo code assigned successfully");
      setIsOpen(false);
      router.refresh();
    } else {
      toast.error("Failed to assign promo code");
    }
  };
  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
        <PlusIcon className="w-4 h-4" />
        Assign Promo Code
      </Button>
      <CustomModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Assign Promo Code
          </h2>
          <SearchInput value={search} onChange={setSearch} />
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Code
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {promoCodes.map((promoCode) => (
                <tr key={promoCode._id}>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white">
                    {promoCode.title}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white">
                    {promoCode.code}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        promoCode?._id && handleAssignPromoCode(promoCode._id)
                      }
                      disabled={assignedPromoCodes.includes(promoCode.code)}
                    >
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {Math.ceil(total / pageSize) > 1 && (
            <div className="flex justify-center mt-4">
              <ReactPaginate
                pageCount={Math.ceil(total / pageSize)}
                forcePage={currentPage}
                onPageChange={(selected) => {
                  console.log(selected);
                  setCurrentPage(selected.selected);
                }}
                containerClassName="flex space-x-2 items-center paginationWrapper"
                pageClassName="rounded"
                activeClassName="text-black font-bold dark:text-white"
                previousLabel={
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                }
                nextLabel={
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                }
                pageLabelBuilder={(page) => (
                  <PageLabel page={page} currentPage={currentPage + 1} />
                )}
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};

export default AssignPromoCodeModal;
