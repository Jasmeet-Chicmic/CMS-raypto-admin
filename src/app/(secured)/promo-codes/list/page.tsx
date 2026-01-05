import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, PromoCode, SORT_DIRECTION } from "@/shared/types";

import PromoCodesTable from "./PromoCodesTable";

const PromoCodesListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
  }>;
}) => {
  const { searchString, skip, limit, sortKey, sortDirection } =
    await searchParams;
  const data = await getRequest<
    ResponseType & { data: { data: PromoCode[]; count: number } },
    GetParamsType
  >(API_END_POINTS.PROMO_CODES, {
    ...(searchString && { searchString }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
  });
  return (
    <div className="space-y-6 mt-[20px]">
      <div className="overflow-x-auto">
        <PromoCodesTable data={data.data} searchString={searchString ?? ""} />
      </div>
    </div>
  );
};

export default PromoCodesListPage;
