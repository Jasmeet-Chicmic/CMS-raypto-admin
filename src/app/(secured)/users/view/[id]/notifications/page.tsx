import { getRequest } from "@/shared/fetcher";
import Notifications from "./Notifications";
import { GetParamsType, User } from "@/shared/types";
import { API_END_POINTS } from "@/shared/api";

const NotificationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data = await getRequest<
    ResponseType & { data: { users: User[]; total: number } },
    GetParamsType
  >(API_END_POINTS.USER, {
    ...(id && { userId: id }),
  });

  const notificationData = data.data.users[0].notificationPreferences || [];
  return (
    <div>
      <Notifications notificationsData={notificationData} id={id} />
    </div>
  );
};

export default NotificationPage;
