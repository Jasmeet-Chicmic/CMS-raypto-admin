"use client";

import { Bot, Flag, Save } from "lucide-react";
import { useState } from "react";

import { SECTION_TITLES } from "../../helpers/constants";
import { Event, QuickAction } from "../../helpers/types";

interface EventViewSidebarProps {
  event: Event;
  config?: {
    showRsvpStats?: boolean;
    showAbuseReports?: boolean;
    showModeratorNotes?: boolean;
    showQuickActions?: boolean;
  };
  moderatorNotes?: string;
  onModeratorNotesChange?: (notes: string) => void;
  customData?: {
    rsvps?: Array<{
      name: string;
      isVerified: boolean;
      joinedAt: string;
    }>;
    reports?: Array<{
      type: string;
      count: number;
      comments: string[];
    }>;
  };
  quickActions?: QuickAction[];
}

const EventViewSidebar = ({
  event,
  config = {},
  moderatorNotes = "",
  onModeratorNotesChange,
  customData,
  quickActions = [],
}: EventViewSidebarProps) => {
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Default data if no custom data provided
  const defaultReports = [
    {
      type: "Spam",
      count: 2,
      comments: ["Automated content", "Bot-generated"],
    },
    {
      type: "Offensive Content",
      count: 1,
      comments: ["Inappropriate language"],
    },
  ];

  const defaultRSVPs = [
    { name: "John Doe", isVerified: true, joinedAt: "2024-01-15" },
    { name: "Jane Smith", isVerified: true, joinedAt: "2024-01-16" },
    { name: "Mike Johnson", isVerified: false, joinedAt: "2024-01-17" },
    { name: "Sarah Wilson", isVerified: true, joinedAt: "2024-01-18" },
    { name: "Alex Brown", isVerified: false, joinedAt: "2024-01-19" },
  ];

  const reports = customData?.reports || defaultReports;
  const rsvps = customData?.rsvps || defaultRSVPs;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    // Simulate API call
    setTimeout(() => {
      setIsSavingNotes(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* RSVP Stats */}
      {config.showRsvpStats !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.RSVP_STATS}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Total RSVPs
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {event.rsvpCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Verified Users
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {rsvps.filter((r) => r.isVerified).length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Unverified Users
              </span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {rsvps.filter((r) => !r.isVerified).length}
              </span>
            </div>
          </div>

          {/* Recent RSVPs */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Recent RSVPs
            </h3>
            <div className="space-y-2">
              {rsvps.slice(0, 5).map((rsvp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {rsvp.name}
                    </span>
                    {rsvp.isVerified ? (
                      <span className="text-[0.875] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[0.875] bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                  <span className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                    {new Date(rsvp.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Abuse Reports */}
      {config.showAbuseReports !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.ABUSE_REPORTS}
          </h2>

          {event.reports > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-red-500" />
                <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {event.reports} reports
                </span>
              </div>

              <div className="space-y-3">
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className="border border-red-200 dark:border-red-800 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-700 dark:text-red-300">
                        {report.type}
                      </span>
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {report.count} reports
                      </span>
                    </div>
                    <div className="space-y-1">
                      {report.comments.map((comment, commentIndex) => (
                        <p
                          key={commentIndex}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          • {comment}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Flag className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 dark:text-green-400 font-medium">
                No reports
              </p>
              <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                This event has no abuse reports
              </p>
            </div>
          )}
        </div>
      )}

      {/* Moderator Notes */}
      {config.showModeratorNotes !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.MODERATOR_NOTES}
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={moderatorNotes}
                onChange={(e) => onModeratorNotesChange?.(e.target.value)}
                placeholder="Add internal notes about this event (e.g., 'Reviewed on 1st Aug by Sam, no issues found.')"
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
              />
              <div className="absolute bottom-2 right-2">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSavingNotes ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            <div className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
              <p>• Notes are only visible to moderators</p>
              <p>• Use for internal communication and review tracking</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {config.showQuickActions !== false && quickActions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.QUICK_ACTIONS}
          </h2>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.key}
                onClick={action.onClick}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {action.label}
                  </p>
                  <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventViewSidebar;
