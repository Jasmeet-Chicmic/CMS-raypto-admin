import { getSlidesList } from "@/api/bonusSlides";
import SlidesList from "./SlidesList";
import { SORT_DIRECTION } from "@/shared/types";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    isActive?: string;
  }>;
}) => {
  const { searchString, skip, limit, sortKey, sortDirection, isActive } =
    await searchParams;

  const slidesListData = await getSlidesList({
    ...(searchString && { searchString }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
    ...(isActive && { isActive: isActive === "true" }),
  });

  if (!slidesListData.status) {
    return <div>Error fetching slides list</div>;
  }

  return (
    <div>
      <SlidesList
        slidesListData={slidesListData}
        searchString={searchString || ""}
      />
    </div>
  );
};

export default page;
