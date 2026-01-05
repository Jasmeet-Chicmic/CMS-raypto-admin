"use client";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import {
  addSubscriptionAction,
  deleteSubscriptionAction,
  updateSubscriptionAction,
} from "@/api/subscriptions";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { SubscriptionPlan } from "@/shared/types";

import PlanModal from "../../list/PlanModal";

const Actions = ({ plan }: { plan: SubscriptionPlan }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    data?: SubscriptionPlan;
  }>({ open: false });
  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionPlan | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isLoading, startTransition] = useTransition();
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
  return (
    <>
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => handleEditPlan(plan)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-600 dark:hover:text-blue-700"
        >
          <Edit size={16} />
          <span className="text-sm">Edit</span>
        </button>
        <button
          onClick={() => setModal({ open: true, data: plan })}
          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors dark:text-red-600 dark:hover:text-red-700"
        >
          <Trash2 size={16} />
          <span className="text-sm">Delete</span>
        </button>
      </div>
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
    </>
  );
};

export default Actions;
