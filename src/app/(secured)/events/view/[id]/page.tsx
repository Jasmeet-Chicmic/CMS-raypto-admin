"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { DUMMY_EVENTS } from "../../helpers/dummyData";
import { EventAction } from "../../helpers/types";
import EventView from "./EventView";

const EventViewPage = () => {
  const params = useParams();
  const eventId = params.id as string;

  // In real implementation, this would be an API call
  const event = DUMMY_EVENTS.find((e) => e._id === eventId);

  const [isLoading, setIsLoading] = useState(false);
  const [moderatorNotes, setModeratorNotes] = useState("");

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Event Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const handleAdminAction = async (action: EventAction) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`Event ${action} successfully`);
      setIsLoading(false);
    }, 1000);
  };

  const handleModeratorNotesChange = (notes: string) => {
    setModeratorNotes(notes);
    // In real implementation, you would save this to the backend
  };

  const config = {
    layout: {
      showHeader: true,
      showContent: true,
      showSidebar: true,
      showActions: true,
    },
    actions: {
      showApprove: true,
      showReject: true,
      showFeature: true,
      showDelete: true,
      showSpam: true,
      showBan: true,
      showRestore: true,
    },
    content: {
      showBanner: true,
      showDescription: true,
      showLocation: true,
      showDateTime: true,
      showTypePricing: true,
      showMediaGallery: true,
      showRsvpList: true,
    },
    sidebar: {
      showRsvpStats: true,
      showAbuseReports: true,
      showModeratorNotes: true,
      showQuickActions: true,
    },
  };

  // Example custom data - you can pass this from your API
  const customData = {
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop",
    ],
    rsvps: [
      { name: "John Doe", isVerified: true, joinedAt: "2024-01-15" },
      { name: "Jane Smith", isVerified: true, joinedAt: "2024-01-16" },
      { name: "Mike Johnson", isVerified: false, joinedAt: "2024-01-17" },
      { name: "Sarah Wilson", isVerified: true, joinedAt: "2024-01-18" },
      { name: "Alex Brown", isVerified: false, joinedAt: "2024-01-19" },
    ],
    reports: [
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
    ],
  };

  return (
    <>
      <EventView
        event={event}
        config={config}
        onAction={handleAdminAction}
        onModeratorNotesChange={handleModeratorNotesChange}
        moderatorNotes={moderatorNotes}
        isLoading={isLoading}
        customData={customData}
      />
    </>
  );
};

export default EventViewPage;
