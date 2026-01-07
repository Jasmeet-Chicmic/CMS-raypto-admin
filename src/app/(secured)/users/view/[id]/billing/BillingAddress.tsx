import { User } from "@/shared/types";
const BillingAddress = ({ data }: { data: User }) => {
  console.log(data, "data");
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Billing Address
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            Address:{" "}
            <span className="font-normal">{data.billingAddress?.address}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            City:{" "}
            <span className="font-normal">{data.billingAddress?.city}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            State:{" "}
            <span className="font-normal">{data.billingAddress?.state}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            Country:{" "}
            <span className="font-normal">{data.billingAddress?.country}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            Zipcode:{" "}
            <span className="font-normal">{data.billingAddress?.zipcode}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            Country Code:{" "}
            <span className="font-normal">
              {data.billingAddress?.countryCode}
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            Bank Name:{" "}
            <span className="font-normal">{data.bankDetails?.bankName}</span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            Account Number:{" "}
            <span className="font-normal">
              {data.bankDetails?.accountNumber}
            </span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            Account Holder Name:{" "}
            <span className="font-normal">
              {data.bankDetails?.accountHolderName}
            </span>
          </p>
          <p className="font-semibold text-gray-800 dark:text-white">
            IFSC Code:{" "}
            <span className="font-normal">{data.bankDetails?.ifscCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
