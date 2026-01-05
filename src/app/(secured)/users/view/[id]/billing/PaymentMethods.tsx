"use client";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { addPaymentMethod, deletePaymentMethod } from "@/api/paymentMethods";
import Button from "@/components/atoms/Button";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import CustomModal from "@/components/molecules/CustomModal";
import FormBuilder from "@/components/molecules/FormBuilder";
import { PaymentCard } from "@/shared/types";
import { formatCardNumber, formatCVV, formatExpiry } from "@/shared/utils";

type Props = {
  cards: PaymentCard[];
  id: string;
};

enum MODAL_TYPE {
  ADD,
  EDIT,
}
export default function PaymentMethods({ cards, id }: Props) {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [modal, setModal] = useState<{ open: boolean; type?: MODAL_TYPE }>({
    open: false,
  });
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const onDelete = () => {
    startTransition(async () => {
      const res = await deletePaymentMethod({
        paymentMethodIds: [confirmationModal.id || ""],
        userId: id,
      });
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setConfirmationModal({ open: false });
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };
  const onSubmit = (data: PaymentCard) => {
    startTransition(async () => {
      const res = await addPaymentMethod({
        cardNumber: data.cardNumber?.trim()?.split(" ")?.join(""),
        cardHolderName: data.cardHolderName,
        cardExpiryMonth: Number(data.cardExpiry?.split("/")[0]) - 1,
        cardExpiryYear: 2000 + Number(data.cardExpiry?.split("/")[1]),
        cvv: data.cvv,
        userId: id,
      });
      if (res.status) {
        toast.success(res.message);
        setModal({ open: false });
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6  space-y-6 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Payment Methods
          </h2>
          <Button
            onClick={() => setModal({ open: true, type: MODAL_TYPE.ADD })}
          >
            + Add Card
          </Button>
        </div>

        {/* Card List */}
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card._id}
              className="flex items-center justify-between border rounded px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {card.cardHolderName}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm tracking-widest dark:text-white">
                    **** **** **** {card.cardNumberLast4Digits}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() =>
                      setConfirmationModal({ open: true, id: card._id })
                    }
                    className="text-[0.875] bg-red-100 text-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-[0.875rem] text-[#A3AED0] dark:text-white">
                  Card expires at {Number(card.cardExpiryMonth) + 1}/
                  {Number(card.cardExpiryYear) - 2000}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CustomModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Card
          </h2>
          <p className="text-sm text-gray-500 dark:text-white">
            Add new card to complete payment
          </p>
        </div>
        <FormBuilder<PaymentCard>
          onSubmit={onSubmit}
          formConfig={({ watch }) => [
            {
              label: "Card Number",
              type: "text",
              name: "cardNumber",
              interceptor: (val) => formatCardNumber(val),
            },
            {
              label: "Name",
              type: "text",
              name: "cardHolderName",
            },
            {
              label: "Exp. Date",
              type: "text",
              name: "cardExpiry",
              interceptor: (val) => formatExpiry(val),
            },
            {
              label: "CVV Code",
              type: "text",
              name: "cvv",
              interceptor: (val) => formatCVV(val, watch("cardNumber") || ""),
            },
          ]}
          scrollable={true}
          isLoading={isLoading}
        />
      </CustomModal>
      <ConfirmationModal
        isOpen={confirmationModal.open}
        onClose={() => setConfirmationModal({ open: false })}
        onConfirm={onDelete}
        title="Delete Card"
        message="Are you sure you want to delete this card?"
      />
    </>
  );
}
