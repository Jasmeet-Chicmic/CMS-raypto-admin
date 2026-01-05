import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, PaymentCard, User } from "@/shared/types";

import BillingAddress from "./BillingAddress";
import PaymentMethods from "./PaymentMethods";

const BillingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getRequest<
    {
      data: { data: PaymentCard[]; count: number };
    },
    { userId: string }
  >(API_END_POINTS.PAYMENY_METHODS, { userId: id });
  console.log(data, "datadata");
  const [userData] = await Promise.all([
    getRequest<
      ResponseType & { data: { users: User[]; total: number } },
      GetParamsType
    >(API_END_POINTS.USER, {
      ...(id && { userId: id }),
    }),
  ]);
  return (
    <div className="space-y-4">
      <PaymentMethods cards={data.data.data} id={id} />
      <BillingAddress data={userData?.data?.users?.[0]} />
    </div>
  );
};

export default BillingPage;
