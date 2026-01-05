import CompanyLayout from "@/components/layouts/CompanyLayout";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { Company, GetParamsType, ResponseType } from "@/shared/types";

const Layout = async ({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [data] = await Promise.all([
    getRequest<
      ResponseType & { data: { companies: Company[]; total: number } },
      GetParamsType
    >(API_END_POINTS.COMPANY, {
      ...(id && { companyId: id }),
    }),
  ]);
  console.log(data);

  const companyData = data.data.companies[0] || {
    _id: id,
    companyName: "Loading...",
    email: "",
    contactNumber: "",
    country: "US",
    sector: "AGRICULTURE_FOOD",
    isSuspended: false,
    isVerified: false,
    status: "Pending",
    flagsCount: 0,
  };

  return <CompanyLayout data={companyData}>{children}</CompanyLayout>;
};

export default Layout;
