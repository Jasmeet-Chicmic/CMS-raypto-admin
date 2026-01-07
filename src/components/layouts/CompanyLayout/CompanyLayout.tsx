"use client";

import { ReactNode, useState } from "react";
import CompanyTabs from "@/components/molecules/company/CompanyTabs/CompanyTabs";
import CompanyActionsPanel from "@/app/(secured)/companies/view/[id]/CompanyActionsPanel";
import { Company } from "@/shared/types";

interface CompanyLayoutProps {
  children: ReactNode;
  data: Company;
}

const CompanyLayout = ({ children, data }: CompanyLayoutProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanyAction = async (action: string) => {
    setIsLoading(true);
    try {
      // Handle company actions here
      console.log(`Company action: ${action}`);

      // TODO: Implement actual API calls for company actions
      // Example:
      // await updateCompanyStatus(data._id, action);
    } catch (error) {
      console.error("Error performing company action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3">
        {/* Admin Actions Panel - Below Company Profile Card */}
        <div className="mt-6">
          <CompanyActionsPanel
            company={data}
            onAction={handleCompanyAction}
            isLoading={isLoading}
          />
        </div>
      </div>
      {/* Main Content */}
      <div className="w-full flex flex-col gap-4">
        <CompanyTabs companyId={data?._id || ""} />
        {children}
      </div>
    </div>
  );
};

export default CompanyLayout;
