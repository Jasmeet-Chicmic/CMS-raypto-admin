"use client";

import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/SearchInput";
import CustomModal from "@/components/molecules/CustomModal";
import {
  BADGE_TYPES,
  BadgesInterface,
} from "@/app/(secured)/badges/helpers/types";
import { assignUserBadgeAction, getBadgesList } from "@/api/badges";
import ReactPaginate from "react-paginate";
import { PageLabel } from "@/components/atoms/Pagination";
import { BASE_URL } from "@/shared/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AssignBadgeModal = ({
  userId,
  assignedBadges,
}: {
  userId: string;
  assignedBadges: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [badges, setBadges] = useState<BadgesInterface[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  useEffect(() => {
    getBadgesList({
      ...(search && { searchString: search }),
      skip: currentPage * pageSize,
      limit: pageSize,
      type: BADGE_TYPES.EXPERT,
    }).then((res) => {
      setBadges(res.data.data);
      setTotal(res.data.count);
    });
  }, [search, currentPage, pageSize]);

  const handleAssignBadge = async (badgeId: string) => {
    const data = await assignUserBadgeAction({
      userId: userId,
      badgeId: badgeId,
    });
    if (data.status) {
      toast.success(data.message);
      setIsOpen(false);
      router.refresh();
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
        <PlusIcon className="w-4 h-4" />
        Assign Badge
      </Button>
      <CustomModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Assign Badge
          </h2>
          <SearchInput value={search} onChange={setSearch} />
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Action
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {badges.map((badge) => (
                <tr key={badge._id}>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white">
                    {badge.name}
                  </td>
                  <td className="px-4 py-2">
                    {badge.imageURL && (
                      <Image
                        src={BASE_URL + "/" + badge.imageURL}
                        alt={badge.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white">
                    {badge.type}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAssignBadge(badge._id)}
                      disabled={assignedBadges.includes(badge._id)}
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
                onPageChange={(selected) => setCurrentPage(selected.selected)}
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

export default AssignBadgeModal;
