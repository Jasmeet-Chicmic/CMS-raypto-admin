"use client";

import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

import { CREATOR_TYPE } from "../../helpers/constants";
import { Event } from "../../helpers/types";
import { EventStatusBadge, TrustLevelBadge } from "../../helpers/components";

interface EventViewHeaderProps {
  event: Event;
}

const EventViewHeader = ({ event }: EventViewHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left side - Title and Status */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {event.title}
              </h1>
              <div className="flex items-center gap-3">
                <EventStatusBadge status={event.status} />
                <TrustLevelBadge level={event.trustLevel} />
              </div>
            </div>
          </div>

          {/* Event ID */}
          <div className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400 mb-4">
            Event ID: #{event._id}
          </div>
        </div>

        {/* Right side - Meta info */}
        <div className="flex flex-col gap-3 lg:items-end">
          {/* Created By */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Created by:
            </span>
            <Link
              href={
                event.createdBy.type === CREATOR_TYPE.USER
                  ? `/users/view/${event.createdBy._id}/account`
                  : `/companies/view/${event.createdBy._id}/jobs`
              }
              target="_blank"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {event.createdBy.name}
            </Link>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Created:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(event.createdAt).toLocaleDateString()} at{" "}
              {new Date(event.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Updated Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Updated:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(event.updatedAt).toLocaleDateString()} at{" "}
              {new Date(event.updatedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Event Date */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Event Date:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(event.eventDate).toLocaleDateString()} at{" "}
              {new Date(event.eventDate).toLocaleTimeString()}
            </span>
          </div>

          {/* Creator Email */}
          {event.createdBy.email && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {event.createdBy.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventViewHeader;
