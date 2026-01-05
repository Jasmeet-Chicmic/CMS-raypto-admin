import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

import { createCompanyAction, updateCompanyAction } from "@/api/companies";
import CustomModal from "@/components/molecules/CustomModal";
import FormBuilder from "@/components/molecules/FormBuilder";
import { FormConfig } from "@/components/molecules/FormBuilder/types";
import {
  COUNTRIES_OPTIONS,
  INDUSTRY_SECTORS_OPTIONS,
} from "@/shared/constants";
import { Company } from "@/shared/types";

const AddCompanyModal = ({
  setOpen,
  open,
  company,
  setSelectedComany,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
  company: Company | null;
  setSelectedComany: (company: Company | null) => void;
}) => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const formConfig: FormConfig<Company> = [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      width: "w-[49%]",
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: "phone",
      width: "w-[49%]",
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      options: COUNTRIES_OPTIONS,
      width: "w-[49%]",
    },
    {
      name: "sector",
      label: "Sector",
      type: "select",
      options: INDUSTRY_SECTORS_OPTIONS,
      width: "w-[49%]",
    },
    {
      name: "isSuspended",
      label: "Suspended",
      type: "switch",
      width: "w-min",
    },
  ];
  const handleSubmit = (data: Company) => {
    startTransition(async () => {
      let res;
      if (company?._id) {
        res = await updateCompanyAction({
          companyId: company._id,
          companyName: data.companyName,
          email: data.email,
          contactNumber: data.contactNumber,
          country: data.country,
          sector: data.sector,
          isSuspended: data.isSuspended,
        });
      } else {
        res = await createCompanyAction(data);
      }
      if (res.status) {
        toast.success(res.message);
        setOpen(false);
        router.refresh();
        setSelectedComany(null);
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
    <CustomModal isOpen={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          {company?._id ? "Edit" : "Add"} Company
        </h1>
        <FormBuilder
          formConfig={formConfig}
          onSubmit={handleSubmit}
          defaultValues={company ? company : {}}
          isLoading={isLoading}
        />
      </div>
    </CustomModal>
  );
};

export default AddCompanyModal;
