"use client";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

import {
  addSubscriptionAction,
  deleteSubscriptionAction,
  updateSubscriptionAction,
} from "@/api/subscriptions";
import Pagination from "@/components/atoms/Pagination";
import SearchInput from "@/components/atoms/SearchInput";
import Table, { TableColumn } from "@/components/atoms/Table";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { ROUTES } from "@/shared/routes";
import { SORT_DIRECTION, SubscriptionPlan } from "@/shared/types";

import PlanModal from "./PlanModal";

const PlanManagement = ({
  data,
  total,
}: {
  data: SubscriptionPlan[];
  total: number;
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(-1);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    data?: SubscriptionPlan;
  }>({ open: false });
  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionPlan | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [search, setSearch] = useState("");
  const handleCreatePlan = () => {
    setSelectedPlan(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setModalMode("edit");
    setIsModalOpen(true);
  };
  const handleDeletePlan = async () => {
    if (modal?.data?._id) {
      const res = await deleteSubscriptionAction({
        subscriptionPlanIds: [modal.data._id],
      });
      console.log(res, "res");
      if (res.status) {
        toast.success("Plan deleted successfully");
        setModal({ open: false });
        router.refresh();
      }
    }
  };
  const handleSavePlan = (plan: SubscriptionPlan) => {
    startTransition(async () => {
      if (modalMode === "create") {
        const res = await addSubscriptionAction(plan);
        if (res.status) {
          toast.success("Plan created successfully");
          setIsModalOpen(false);
          router.refresh();
        }
      } else {
        const payload = { ...plan, subscriptionPlanId: plan._id || "" };
        delete payload._id;
        const res = await updateSubscriptionAction(payload);
        console.log(res, "res");
        if (res.status) {
          toast.success("Plan updated successfully");
          setIsModalOpen(false);
          router.refresh();
        }
      }
    });
  };
  const searchParams = useSearchParams();
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip"); // Optional: clean URL
    }
    if (sortKey) {
      newParams.set("sortKey", sortKey);
      newParams.set("sortDirection", sortDirection.toString());
    } else {
      newParams.delete("sortKey");
      newParams.delete("sortDirection");
    }
    if (search) {
      newParams.set("search", search);
    } else {
      newParams.delete("search");
    }
    router.push(`${ROUTES.SUBSCRIPTIONS_LIST}?${newParams.toString()}`);
  }, [
    currentPage,
    pageSize,
    searchParams,
    router,
    sortKey,
    sortDirection,
    search,
  ]);

  const columns: TableColumn<SubscriptionPlan>[] = [
    {
      field: "name",
      title: "Name",
      sortable: true,
      sortKey: "name",
    },
    {
      field: "monthlyPrice",
      title: "Monthly Price",
      render: (plan) => (
        <span className="text-sm text-gray-600 dark:text-white">
          ${plan.monthlyPrice}
        </span>
      ),
      sortable: true,
      sortKey: "monthlyPrice",
    },
    {
      field: "yearlyPrice",
      title: "Yearly Price",
      render: (plan) => (
        <span className="text-sm text-gray-600 dark:text-white">
          ${plan.yearlyPrice}
        </span>
      ),
      sortable: true,
      sortKey: "yearlyPrice",
    },
    {
      field: "isActive",
      title: "Status",
      render: (plan) => (
        <span
          className={`inline-flex px-2 py-1 text-[0.875] font-medium rounded-full ${
            plan.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {plan.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "",
      title: "Actions",
      render: (plan) => (
        <div className="flex items-center space-x-2">
          <Eye
            size={26}
            onClick={() =>
              router.push(`${ROUTES.SUBSCRIPTIONS_VIEW}/${plan._id}`)
            }
            className="cursor-pointer p-1 text-blue-500 bg-blue-100 rounded-md"
          />
          <Edit
            size={26}
            onClick={() => handleEditPlan(plan)}
            className="cursor-pointer p-1 text-yellow-500 bg-yellow-100 rounded-md"
          />
          <Trash2
            size={26}
            onClick={() => setModal({ open: true, data: plan })}
            className="cursor-pointer p-1 text-red-500 bg-red-100 rounded-md"
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            All Plans
          </h2>
          <p className="text-sm text-gray-600 dark:text-white">
            Manage your subscription plans
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SearchInput value={search} onChange={(e) => setSearch(e)} />
          <button
            onClick={handleCreatePlan}
            className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-purple-700 transition-colors dark:bg-[#4F46E5] dark:text-white"
          >
            <Plus size={18} />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        data={data}
        keyExtractor={(item) => item?._id || ""}
        handleSort={(sortKey, sortOrder) => {
          setSortKey(sortKey);
          setSortDirection(sortOrder);
        }}
      />
      <Pagination
        title="Subscription Plans"
        totalItems={total}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => setPageSize(size)}
      />

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        plan={selectedPlan}
        mode={modalMode}
        isLoading={isLoading}
      />
      <ConfirmationModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onConfirm={() => void handleDeletePlan()}
        title={"Delete Plan"}
        message={"Are you sure you want to delete this plan?"}
      />
    </div>
  );
};

export default PlanManagement;
