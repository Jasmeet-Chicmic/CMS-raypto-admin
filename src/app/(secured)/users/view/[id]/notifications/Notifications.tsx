"use client";
import isEqual from "lodash.isequal";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateUserNotification } from "@/api/user";
import {
  NOTIFICATION_AVAILABILITY,
  NOTIFICATION_PREFERENCES,
} from "@/shared/constants";

import { NOTIFICATION_LABELS } from "./helpers/constants";
import { Notification_Prefrences } from "./helpers/types";

interface NotificationsProps {
  notificationsData: Notification_Prefrences[];
  id: string;
}

const allNotificationTypes = [
  NOTIFICATION_PREFERENCES.NEW_FOR_YOU,
  NOTIFICATION_PREFERENCES.NEW_DEVICE_LINKED,
  NOTIFICATION_PREFERENCES.ACCOUNT_ACTIVITY,
  NOTIFICATION_PREFERENCES.NEW_BROWSER_SIGN_IN,
];

const Notifications = ({ notificationsData, id }: NotificationsProps) => {
  const [data, setData] = useState<Notification_Prefrences[]>(
    allNotificationTypes.map((type) => {
      const notification = notificationsData.find((n) => n.type === type);
      return {
        type,
        availability: notification?.availability || [],
      };
    }),
  );
  const [isLoading, startTransition] = useTransition();

  const originalRef = useRef<Notification_Prefrences[]>(notificationsData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const hasChanged = !isEqual(data, originalRef.current);
    setIsDirty(hasChanged);
  }, [data]);

  const toggleAvailability = (
    prefType: NOTIFICATION_PREFERENCES,
    availability: NOTIFICATION_AVAILABILITY,
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item.type === prefType
          ? {
              ...item,
              availability: item.availability.includes(availability)
                ? item.availability.filter((a) => a !== availability)
                : [...item.availability, availability],
            }
          : item,
      ),
    );
  };

  const saveNotifications = async () => {
    startTransition(async () => {
      const res = await updateUserNotification({
        notificationPreferences: data,
        userId: id,
      });
      if (res.status) {
        toast.success(res.message);
        originalRef.current = data;
        setIsDirty(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  const renderCheckbox = (
    prefType: NOTIFICATION_PREFERENCES,
    availability: NOTIFICATION_AVAILABILITY,
  ) => {
    const item = data.find((d) => d.type === prefType);
    const isChecked = item?.availability.includes(availability);
    const notificationLabel = NOTIFICATION_LABELS[prefType];
    const availabilityStr = String(availability);
    const availabilityLabel =
      availabilityStr.charAt(0).toUpperCase() +
      availabilityStr.slice(1).toLowerCase();

    return (
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleAvailability(prefType, availability)}
        className="w-4 h-4 accent-purple-600"
        aria-label={`${notificationLabel} via ${availabilityLabel}`}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
          Notifications
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Change to notification settings, the user will get the update
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-white">
          <thead>
            <tr className="border-b border-gray-200 text-[0.875rem] text-[#A3AED0] uppercase dark:bg-gray-900 dark:border-gray-800">
              <th className="py-2">Type</th>
              <th className="py-2 text-center">Email</th>
              <th className="py-2 text-center">Browser</th>
              <th className="py-2 text-center">App</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.type}
                className="border-b last:border-none dark:bg-gray-900 dark:border-gray-800"
              >
                <td className="py-3">{NOTIFICATION_LABELS[item.type]}</td>
                <td className="text-center">
                  {renderCheckbox(item.type, NOTIFICATION_AVAILABILITY.EMAIL)}
                </td>
                <td className="text-center">
                  {renderCheckbox(item.type, NOTIFICATION_AVAILABILITY.BROWSER)}
                </td>
                <td className="text-center">
                  {renderCheckbox(item.type, NOTIFICATION_AVAILABILITY.APP)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3 dark:bg-gray-900 dark:border-gray-800">
        <button
          onClick={saveNotifications}
          className="bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!isDirty || isLoading}
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
        <button
          className="bg-white border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          onClick={() => {
            setData(originalRef.current);
            setIsDirty(false);
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default Notifications;
