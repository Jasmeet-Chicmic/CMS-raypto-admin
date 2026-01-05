"use client";

import {
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";

import {
  EVENT_TYPE,
  EVENT_TYPE_NAMES,
  SECTION_TITLES,
} from "../../helpers/constants";
import { Event } from "../../helpers/types";

interface EventViewContentProps {
  event: Event;
  config?: {
    showBanner?: boolean;
    showDescription?: boolean;
    showLocation?: boolean;
    showDateTime?: boolean;
    showTypePricing?: boolean;
    showMediaGallery?: boolean;
    showRsvpList?: boolean;
  };
  customData?: {
    images?: string[];
    rsvps?: Array<{
      name: string;
      isVerified: boolean;
      joinedAt: string;
    }>;
  };
}

const EventViewContent = ({
  event,
  config = {},
  customData,
}: EventViewContentProps) => {
  // Use event media if available, otherwise fall back to custom data or defaults
  const bannerImage =
    event.media?.banner ||
    customData?.images?.[0] ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop";
  const galleryImages = event.media?.gallery ||
    customData?.images || [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop",
    ];

  const rsvps = customData?.rsvps || [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "Alex Brown",
    "Emily Davis",
    "Chris Lee",
    "Lisa Anderson",
    "Tom Wilson",
    "Amy Garcia",
  ];

  return (
    <div className="space-y-6">
      {/* Event Banner/Image */}
      {config.showBanner !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <Image
              src={bannerImage}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 p-2 rounded-lg shadow-sm transition-colors">
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 p-2 rounded-lg shadow-sm transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {config.showDescription !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.DESCRIPTION}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {event.description || "No description provided for this event."}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {config.showLocation !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.LOCATION}
          </h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {event.location || "Location not specified"}
              </p>
              {event.isOnline && event.meetingUrl && (
                <div className="mt-2">
                  <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400 mb-1">
                    Online Event
                  </p>
                  <a
                    href={event.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
              {event.location && !event.isOnline && (
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-1">
                  View on Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date & Time */}
      {config.showDateTime !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.DATE_TIME}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                  {new Date(event.eventDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {event.timezone && (
                    <span className="ml-1">({event.timezone})</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Type & Pricing */}
      {config.showTypePricing !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.TYPE_PRICING}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.type === EVENT_TYPE.FREE
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {EVENT_TYPE_NAMES[event.type]}
              </span>
              {event.type === EVENT_TYPE.PAID && event.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ${event.price}
                  </span>
                </div>
              )}
            </div>
            {event.type === EVENT_TYPE.PAID && (
              <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                Ticketing platform: Eventbrite
              </p>
            )}
          </div>
        </div>
      )}

      {/* Media Gallery */}
      {config.showMediaGallery !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.MEDIA_GALLERY}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Event image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RSVP List */}
      {config.showRsvpList !== false && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {SECTION_TITLES.RSVP_LIST}
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {event.rsvpCount} people registered
            </span>
          </div>
          <div className="space-y-2">
            {rsvps.slice(0, 10).map((rsvp, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {typeof rsvp === "string" ? rsvp : rsvp.name}
                </span>
                <span className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                  {index + 1} day{index !== 0 ? "s" : ""} ago
                </span>
              </div>
            ))}
            {event.rsvpCount > 10 && (
              <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400 mt-2">
                +{event.rsvpCount - 10} more RSVPs
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventViewContent;
