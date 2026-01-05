"use client";

import { usePathname, useRouter } from "next/navigation";

const UserTabs = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userTabs = [
    { name: "Transaction", path: `/users/view/${userId}/transaction` },
    // { name: "Account", path: `/users/view/${userId}/account` },
    // { name: "Security", path: `/users/view/${userId}/security` },
    // { name: "Billing & Plans", path: `/users/view/${userId}/billing` },
    // { name: "Notifications", path: `/users/view/${userId}/notifications` },
    // { name: "Connections", path: `/users/view/${userId}/connections` },
    // { name: "Promo Codes", path: `/users/view/${userId}/promo-codes` },
    // { name: "Badges", path: `/users/view/${userId}/badges` },
  ];

  return (
    <div className="flex px-0 border-b border-gray-200 dark:border-gray-800 overflow-x-auto mb-6">
      {userTabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => router.push(tab.path, { scroll: false })}
          className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            pathname.includes(tab.path)
              ? "text-[#4F46E5] dark:text-white"
              : "text-[#A3AED0] hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          }`}
        >
          <span className="relative z-10">{tab.name}</span>
          {pathname.includes(tab.path) && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4F46E5] rounded-t-full shadow-[0_-1px_10px_rgba(67,24,255,0.3)]" />
          )}
        </button>
      ))}
    </div>
  );
};

export default UserTabs;
