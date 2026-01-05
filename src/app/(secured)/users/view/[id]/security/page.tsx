import { format } from "date-fns";

import { API_END_POINTS } from "@/shared/api";
import { BROWSER_TYPE_NAME } from "@/shared/constants";
import { getRequest } from "@/shared/fetcher";
import { DEVICE } from "@/shared/types";

import ChangePasswordForm from "./ChangePasswordForm";

const SecurityPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data = await getRequest<
    { data: { data: DEVICE[]; total: number } },
    { userId: string }
  >(API_END_POINTS.USER_LOGIN_TACKING, {
    userId: id,
  });
  console.log(data, "ds,fld");
  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        Change Password
        <ChangePasswordForm userId={id} />
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-900 dark:border-gray-800 dark:text-white">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Devices
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600 dark:text-white">
            <thead className="bg-white border-b text-[0.875rem] text-[#A3AED0] uppercase dark:bg-gray-900 dark:border-gray-800 dark:text-white">
              <tr>
                <th className="px-6 py-3">Browser</th>
                <th className="px-6 py-3">Device</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Recent Activities</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.data?.map((item) => (
                <tr
                  className="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 dark:text-white"
                  key={item?._id}
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span>{BROWSER_TYPE_NAME[item.browserType]}</span>
                  </td>
                  <td className="px-6 py-4">{item?.deviceName}</td>
                  <td className="px-6 py-4">{item?.location}</td>
                  <td className="px-6 py-4">
                    {format(item?.lastLoginDate, "dd, MMMM yyyy hh:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SecurityPage;
