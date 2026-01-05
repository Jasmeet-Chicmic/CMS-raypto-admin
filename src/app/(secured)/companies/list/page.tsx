import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import {
  Company,
  GetParamsType,
  ResponseType,
  SORT_DIRECTION,
} from "@/shared/types";
import { INDUSTRY_SECTORS } from "@/shared/constants";
import CompaniesTable from "./CompaniesTable";
const CompaniesManagment = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    sector?: INDUSTRY_SECTORS;
  }>;
}) => {
  const { searchString, sector, skip, limit, sortKey, sortDirection } =
    await searchParams;
  const data = await getRequest<
    ResponseType & { data: { companies: Company[]; count: number } },
    GetParamsType
  >(API_END_POINTS.COMPANY, {
    ...(searchString && { searchString }),
    ...(sector && { sector }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
  });
  console.log("Companies::Data", data);
  return (
    <div className="space-y-6 mt-[20px]">
      <div className="overflow-x-auto">
        <CompaniesTable data={data} searchString={searchString || ""} />
      </div>
    </div>
  );
};

export default CompaniesManagment;
