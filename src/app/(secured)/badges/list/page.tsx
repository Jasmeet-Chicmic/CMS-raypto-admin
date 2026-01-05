import { getBadgesList } from "@/api/badges";
import { BadgeTypes } from "../helpers/types";
import BadgesList from "./BadgesList";
import { SORT_DIRECTION } from "@/shared/types";

// const badgesDummyData: BadgesInterface[] = [
//   {
//     _id: "badge000001",
//     name: "Event Champion",
//     imageURL: "https://via.placeholder.com/64x64.png?text=EC",
//     type: BADGE_TYPES.CONDITIONAL,
//   },
//   {
//     _id: "badge000002",
//     name: "Top Contributor",
//     imageURL: "https://via.placeholder.com/64x64.png?text=TC",
//     type: BADGE_TYPES.CONDITIONAL,
//   },
//   {
//     _id: "badge000003",
//     name: "Learning Master",
//     imageURL: "https://via.placeholder.com/64x64.png?text=LM",
//     type: BADGE_TYPES.CONDITIONAL,
//   },
//   {
//     _id: "badge000004",
//     name: "Growth Guru",
//     imageURL: "https://via.placeholder.com/64x64.png?text=GG",
//     type: BADGE_TYPES.EXPERT,
//   },
//   {
//     _id: "badge000005",
//     name: "Networking Pro",
//     imageURL: "https://via.placeholder.com/64x64.png?text=NP",
//     type: BADGE_TYPES.EXPERT,
//   },
//   {
//     _id: "badge000006",
//     name: "Referral Star",
//     imageURL: "https://via.placeholder.com/64x64.png?text=RS",
//     type: BADGE_TYPES.EXPERT,
//   },
//   {
//     _id: "badge000007",
//     name: "Ally Advocate",
//     imageURL: "https://via.placeholder.com/64x64.png?text=AA",
//     type: BADGE_TYPES.EXPERT,
//   },
//   {
//     _id: "badge000008",
//     name: "Leadership Legend",
//     imageURL: "https://via.placeholder.com/64x64.png?text=LL",
//     type: BADGE_TYPES.EXPERT,
//   },
//   {
//     _id: "badge000009",
//     name: "Community Builder",
//     imageURL: "https://via.placeholder.com/64x64.png?text=CB",
//     type: BADGE_TYPES.CONDITIONAL,
//   },
//   {
//     _id: "badge000010",
//     name: "Innovation Spark",
//     imageURL: "https://via.placeholder.com/64x64.png?text=IS",
//     type: BADGE_TYPES.CONDITIONAL,
//   },
// ];
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    badgeType?: BadgeTypes;
  }>;
}) => {
  const { searchString, badgeType, skip, limit, sortKey, sortDirection } =
    await searchParams;

  const badgesListData = await getBadgesList({
    ...(searchString && { searchString }),
    ...(badgeType && { type: badgeType }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
  });
  if (!badgesListData.status) {
    return <div>Error fetching badges list</div>;
  }

  return (
    <div>
      <BadgesList
        badgesListData={badgesListData || []}
        searchString={searchString || ""}
      />
    </div>
  );
};

export default page;
