import { getBadgesList } from "@/api/badges";
import BadgeView from "./BadgeView";

interface pageProps {
  params: Promise<{ id: string }>;
}
const page = async ({ params }: pageProps) => {
  const { id } = await params;
  const data = await getBadgesList({ badgeId: id });
  //   const dummyBadge: BadgesInterface = {
  //     _id: "badge001",
  //     name: "Event Master",
  //     type: BADGE_TYPES.CONDITIONAL,
  //     imageURL: "https://via.placeholder.com/80x80.png?text=EM",
  //     conditions: {
  //       eventsJoined: 5,
  //       pointsEarned: 300,
  //     },
  //   };
  return (
    <div>
      <BadgeView badge={data?.data?.data[0]}></BadgeView>
    </div>
  );
};

export default page;
