import { User } from "@/shared/types";
const BillingAddress = ({ data }: { data: User }) => {
  console.log(data, "data");
  return (
    <div className="bg-bgwhite rounded-lg shadow p-6 space-y-6 dark:bg-darkbgprimary dark:border-darkbordercolor1 dark:text-sidebartext">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-sidebartext">
          Billing Address
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Address:{" "}
            <span className="font-normal">{data.billingAddress?.address}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            City:{" "}
            <span className="font-normal">{data.billingAddress?.city}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            State:{" "}
            <span className="font-normal">{data.billingAddress?.state}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Country:{" "}
            <span className="font-normal">{data.billingAddress?.country}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Zipcode:{" "}
            <span className="font-normal">{data.billingAddress?.zipcode}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Country Code:{" "}
            <span className="font-normal">
              {data.billingAddress?.countryCode}
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Bank Name:{" "}
            <span className="font-normal">{data.bankDetails?.bankName}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Account Number:{" "}
            <span className="font-normal">
              {data.bankDetails?.accountNumber}
            </span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            Account Holder Name:{" "}
            <span className="font-normal">
              {data.bankDetails?.accountHolderName}
            </span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-sidebartext">
            IFSC Code:{" "}
            <span className="font-normal">{data.bankDetails?.ifscCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
