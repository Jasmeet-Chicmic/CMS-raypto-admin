"use client";

import { usePathname, useRouter } from "next/navigation";
import { COMPANY_TABS_CONFIG } from "./constants";

const CompanyTabs = ({ companyId }: { companyId: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const userTabs = COMPANY_TABS_CONFIG.TABS.map((tab) => ({
    name: tab.name,
    path: `/companies/view/${companyId}/${tab.path}`,
    icon: tab.icon,
    description: tab.description,
  }));

  const isActiveTab = (tabPath: string) => {
    if (tabPath.includes("/profile")) {
      return (
        pathname.includes("/profile") ||
        pathname === `/companies/view/${companyId}`
      );
    }
    return pathname.includes(tabPath);
  };

  return (
    <div className="flex gap-4 border-b overflow-x-auto">
      {userTabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => router.push(tab.path)}
          className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer flex items-center space-x-2 ${
            isActiveTab(tab.path)
              ? "text-primary border-primary"
              : "text-gray-500 border-transparent hover:text-primary"
          }`}
          title={tab.description}
        >
          <span className="text-base">{tab.icon}</span>
          <span className="dark:text-gray-300">{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CompanyTabs;
