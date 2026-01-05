"use client";

import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
// import { toast } from "react-toastify";

// import { updateUserAction } from "@/api/user";
import Button from "@/components/atoms/Button";
import CustomModal from "@/components/molecules/CustomModal";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FormConfig } from "@/components/molecules/FormBuilder/types";
import { User } from "@/shared/types";

const BillingAddressForm = ({ data }: { data: User }) => {
  // const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const formConfig: FormConfig<User> = [
    {
      name: "billingAddress.address",
      label: "Address",
      type: "text",
    },
    {
      name: "billingAddress.city",
      label: "City",
      type: "text",
    },
    {
      name: "billingAddress.state",
      label: "State",
      type: "text",
    },
    {
      name: "billingAddress.country",
      label: "Country",
      type: "text",
    },
    {
      name: "billingAddress.zipcode",
      label: "Zipcode",
      type: "text",
    },
    {
      name: "billingAddress.countryCode",
      label: "Country Code",
      type: "text",
    },
    {
      name: "bankDetails.bankName",
      label: "Bank Name",
      type: "text",
    },
    {
      name: "bankDetails.accountNumber",
      label: "Account Number",
      type: "text",
    },
    {
      name: "bankDetails.accountHolderName",
      label: "Account Holder Name",
      type: "text",
    },
    {
      name: "bankDetails.ifscCode",
      label: "IFSC Code",
      type: "text",
    },
  ];
  const handleSubmit = () => {
    startTransition(async () => {
      // const response = await updateUserAction({
      //   billingAddress: data.billingAddress,
      //   bankDetails: data.bankDetails,
      //   userId: data._id,
      // });
      // console.log(response, "response");
      // if (response.status) {
      //   toast.success("Billing address updated successfully");
      //   setOpen(false);
      //   router.refresh();
      // } else {
      //   toast.error(response.message);
      // }
    });
  };
  return (
    <>
      <Button onClick={() => setOpen(true)} type="button" variant="outline">
        <Plus />
        Edit Address
      </Button>
      <CustomModal isOpen={open} onClose={() => setOpen(false)}>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Billing Address
          </h2>
          <FormBuilder
            formConfig={formConfig}
            onSubmit={handleSubmit}
            defaultValues={data}
            numberOfCols={2}
            isLoading={isLoading}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default BillingAddressForm;
