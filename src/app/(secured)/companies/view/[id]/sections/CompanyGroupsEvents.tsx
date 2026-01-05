"use client";

import { useState } from "react";

interface GroupEvent {
  id: string;
  name: string;
  type: "group" | "event" | "initiative";
  status: "active" | "inactive" | "upcoming" | "completed";
  date: string;
  description: string;
  participants: number;
  category: string;
}

const CompanyGroupsEvents = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [groupsEvents] = useState<GroupEvent[]>([
    {
      id: "1",
      name: "Tech Innovation Forum",
      type: "event",
      status: "upcoming",
      date: "2024-02-15",
      description:
        "Annual technology innovation forum bringing together industry leaders and innovators.",
      participants: 150,
      category: "Technology",
    },
    {
      id: "2",
      name: "Women in Tech Network",
      type: "group",
      status: "active",
      date: "2023-09-01",
      description:
        "Supporting and empowering women in technology through networking and mentorship.",
      participants: 85,
      category: "Networking",
    },
    {
      id: "3",
      name: "Green Tech Initiative",
      type: "initiative",
      status: "active",
      date: "2023-06-15",
      description:
        "Sustainable technology solutions for environmental impact reduction.",
      participants: 45,
      category: "Sustainability",
    },
    {
      id: "4",
      name: "Startup Mentorship Program",
      type: "initiative",
      status: "active",
      date: "2023-03-20",
      description:
        "Mentoring early-stage startups with technical and business guidance.",
      participants: 30,
      category: "Mentorship",
    },
    {
      id: "5",
      name: "Cloud Computing Workshop",
      type: "event",
      status: "completed",
      date: "2023-11-10",
      description:
        "Hands-on workshop on cloud computing best practices and implementation.",
      participants: 75,
      category: "Education",
    },
    {
      id: "6",
      name: "AI Ethics Discussion Group",
      type: "group",
      status: "inactive",
      date: "2023-01-15",
      description:
        "Monthly discussions on AI ethics and responsible technology development.",
      participants: 25,
      category: "Ethics",
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "group":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "initiative":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return "🎪";
      case "group":
        return "👥";
      case "initiative":
        return "🚀";
      default:
        return "📋";
    }
  };

  const filteredItems = groupsEvents.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const statusMatch = filterStatus === "all" || item.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Groups / Events / Initiatives
        </h3>
        <div className="flex space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="event">Events</option>
            <option value="group">Groups</option>
            <option value="initiative">Initiatives</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {groupsEvents.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Items
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {groupsEvents.filter((item) => item.type === "event").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {groupsEvents.filter((item) => item.type === "group").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Groups</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600">
            {groupsEvents.filter((item) => item.type === "initiative").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Initiatives
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{getTypeIcon(item.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                      {item.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getTypeColor(item.type)}`}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getStatusColor(item.status)}`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                    <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                    <span>👥 {item.participants} participants</span>
                    <span>🏷️ {item.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-[0.875] font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                  View Details
                </button>
                <button className="px-3 py-1 text-[0.875] font-medium text-gray-600 border border-gray-600 rounded-md hover:bg-gray-600 hover:text-white transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No items found.</p>
          </div>
        )}
      </div>

      {/* Summary by Type */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Summary by Type
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Events
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "event" && item.status === "active",
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Upcoming:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "event" && item.status === "upcoming",
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "event" && item.status === "completed",
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Groups
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "group" && item.status === "active",
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inactive:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "group" && item.status === "inactive",
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initiatives
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "initiative" && item.status === "active",
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed:</span>
                <span className="font-medium">
                  {
                    groupsEvents.filter(
                      (item) =>
                        item.type === "initiative" &&
                        item.status === "completed",
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyGroupsEvents;
