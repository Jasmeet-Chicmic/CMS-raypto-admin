"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

import { addPromoCodeAction, updatePromoCodeAction } from "@/api/promoCodes";
import { getSubscriptionPlansAction } from "@/api/subscriptions";
import { getUsersAction } from "@/api/user";
import { AsyncSelectGetDataParams } from "@/components/atoms/AsyncSelect/AsyncSelect";
import CustomModal from "@/components/molecules/CustomModal";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FormConfig } from "@/components/molecules/FormBuilder/types";
import {
  GetParamsType,
  PromoCode,
  SubscriptionPlan,
  User,
} from "@/shared/types";

type PromoCodeForm = {
  title: string;
  description: string;
  code: string;
  users: User[];
  subscriptionPlanIds: SubscriptionPlan[];
  isActive: boolean;
};

const AddPromoCodeModal = ({
  open,
  setOpen,
  promoCode,
  setSelectedPromoCode,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  promoCode?: PromoCode;
  setSelectedPromoCode: (promoCode?: PromoCode) => void;
}) => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const getUsers = async (params: AsyncSelectGetDataParams) => {
    const payload: GetParamsType = {
      sortKey: params?.sortByKey,
      sortDirection: params?.sortDirection,
      skip: (params?.page - 1) * params?.limit,
      limit: params?.limit,
    };
    if (params.searchString) {
      payload.searchString = params.searchString;
    }
    const res = await getUsersAction(payload);
    console.log(payload, res, "dsfknsdkj");
    const resData = {
      count: res?.data?.total,
      data: res?.data?.users?.map?.((item: User) => ({
        ...item,
        value: item?._id,
        label: `${item?.firstName ?? ""} ${item?.lastName ?? ""}`,
      })),
    };
    return resData;
  };
  const getSubscriptionPlans = async (params: AsyncSelectGetDataParams) => {
    const payload: GetParamsType = {
      sortKey: params?.sortByKey,
      sortDirection: params?.sortDirection,
      skip: (params?.page - 1) * params?.limit,
      limit: params?.limit,
    };
    if (params.searchString) {
      payload.searchString = params.searchString;
    }
    const res = await getSubscriptionPlansAction(payload);
    console.log(payload, res, "dsfknsdkj");
    const resData = {
      count: res?.data?.count,
      data: res?.data?.data?.map?.((item: SubscriptionPlan) => ({
        ...item,
        value: item?._id,
        label: `${item?.name ?? ""}`,
      })),
    };
    return resData;
  };
  const formConfig: FormConfig<PromoCodeForm> = [
    {
      name: "title",
      label: "Title",
      type: "text",
      validation: {
        required: true,
      },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      validation: {
        required: true,
      },
    },
    {
      name: "code",
      label: "Code",
      type: "text",
      validation: {
        required: true,
      },
    },
    {
      name: "users",
      label: "Users",
      type: "async_select",
      getData: getUsers,
      isMutliOptions: true,
    },
    {
      name: "subscriptionPlanIds",
      label: "Subscription Plans",
      type: "async_select",
      getData: getSubscriptionPlans,
      isMutliOptions: true,
    },
    {
      name: "isActive",
      label: "Is Active",
      type: "switch",
    },
  ];
  const onSubmit = (data: PromoCodeForm) => {
    console.log(data);
    const payload = {
      title: data?.title,
      description: data?.description,
      code: data?.code,
      users: data?.users?.map((user) => user?._id) || [],
      isActive: data?.isActive,
      subscriptionPlanIds:
        data?.subscriptionPlanIds?.map(
          (subscriptionPlan: SubscriptionPlan) => subscriptionPlan?._id,
        ) ?? [],
    };
    startTransition(async () => {
      if (promoCode?._id) {
        const res = await updatePromoCodeAction({
          ...payload,
          promotionalCodeId: promoCode?._id,
        });
        if (res.status) {
          toast.success(res.message);
          setOpen(false);
          setSelectedPromoCode(res.data);
          router.refresh();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await addPromoCodeAction(payload);
        if (res.status) {
          toast.success(res.message);
          setOpen(false);
          setSelectedPromoCode(res.data);
          router.refresh();
        } else {
          toast.error(res.message);
        }
      }
    });
  };
  return (
    <CustomModal
      isOpen={open}
      onClose={() => {
        setOpen(false);
        setSelectedPromoCode(undefined);
      }}
      title="Add Promo Code"
    >
      <FormBuilder<PromoCodeForm>
        formConfig={formConfig}
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={{
          ...promoCode,
          subscriptionPlanIds:
            promoCode?.plans?.map((subscriptionPlan: SubscriptionPlan) => ({
              ...subscriptionPlan,
              value: subscriptionPlan?._id,
              label: `${subscriptionPlan?.name ?? ""}`,
            })) ?? [],
        }}
      />
    </CustomModal>
  );
};

export default AddPromoCodeModal;
