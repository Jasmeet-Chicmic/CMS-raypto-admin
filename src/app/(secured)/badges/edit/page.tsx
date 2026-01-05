import { getBadgesList } from "@/api/badges";
import BadgeForm from "../../../../components/molecules/BadgeForm/BadgeForm";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const { id } = await searchParams;
  const data = await getBadgesList({ badgeId: id });
  console.log("get bedge", data.data);

  return (
    <div>
      <BadgeForm
        isEdit={true}
        badgeId={id}
        defaultValues={data?.data?.data[0]}
      ></BadgeForm>
    </div>
  );
};

export default page;
