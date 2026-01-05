import Image from "next/image";
import { BADGE_TYPE_NAMES, BadgesInterface } from "../../helpers/types";
import { BASE_URL } from "@/shared/constants";

interface BadgeViewProps {
  badge: BadgesInterface;
}

const BadgeView: React.FC<BadgeViewProps> = ({ badge }) => {
  const badgeTypeName = BADGE_TYPE_NAMES[badge.type] || "Unknown";

  const conditionEntries = badge.conditions
    ? Object.entries(badge.conditions)
    : [];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 relative rounded-full overflow-hidden border">
          <Image
            src={
              BASE_URL + "/" + badge.imageURL ||
              "https://via.placeholder.com/80x80.png?text=Badge"
            }
            alt={badge.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{badge.name}</h1>
          <p className="text-sm text-gray-600">{badgeTypeName}</p>
        </div>
      </div>

      {/* Conditions */}
      {conditionEntries.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">Conditions</h2>
          <div className="max-h-60 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {conditionEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md border"
                >
                  <span className="capitalize text-gray-700">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeView;
