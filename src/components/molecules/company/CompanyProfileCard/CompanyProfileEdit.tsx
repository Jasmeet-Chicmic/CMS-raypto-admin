"use client";
import { useState } from "react";

import AddCompanyModal from "@/app/(secured)/companies/list/AddCompanyModal";
import Button from "@/components/atoms/Button";
import { Company } from "@/shared/types";

const CompanyProfileEdit = ({ CompanyData }: { CompanyData: Company }) => {
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  return (
    <>
      <Button
        onClick={() => {
          setSelectedCompany(CompanyData);
          setOpen(true);
        }}
      >
        Edit
      </Button>
      <AddCompanyModal
        open={open}
        setOpen={setOpen}
        company={selectedCompany}
        setSelectedComany={setSelectedCompany}
      />
    </>
  );
};

export default CompanyProfileEdit;
