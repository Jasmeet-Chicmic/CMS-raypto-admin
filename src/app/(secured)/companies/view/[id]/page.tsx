import { redirect } from "next/navigation";
import { COMPANY_TABS_CONFIG } from "@/components/molecules/company/CompanyTabs/constants";

interface CompanyViewPageProps {
  params: Promise<{ id: string }>;
}
const CompanyViewPage = async ({ params }: CompanyViewPageProps) => {
  const { id } = await params;
  // Redirect to the default tab (profile)
  redirect(`/companies/view/${id}/${COMPANY_TABS_CONFIG.DEFAULT_TAB}`);
};

export default CompanyViewPage;
