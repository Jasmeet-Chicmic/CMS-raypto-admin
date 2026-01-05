"use client";

import { useState } from "react";
import Image from "next/image";
import { dummyProfile } from "@/assets";
import { TEAM_PROFILE_CONFIG, TeamRole, TeamStatus } from "./helpers/constants";
import { MESSAGES } from "@/shared/strings";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  profileImage?: string;
  joinDate: string;
  status: TeamStatus;
  role: TeamRole;
}

const CompanyTeamProfiles = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Smith",
      position: TEAM_PROFILE_CONFIG.TEAM_POSITIONS.CEO_FOUNDER,
      email: "john.smith@synapsetech.com",
      profileImage: dummyProfile.src,
      joinDate: "2018-03-15",
      status: TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE,
      role: TEAM_PROFILE_CONFIG.TEAM_ROLES.ADMIN,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      position: TEAM_PROFILE_CONFIG.TEAM_POSITIONS.CTO,
      email: "sarah.johnson@synapsetech.com",
      profileImage: dummyProfile.src,
      joinDate: "2019-06-20",
      status: TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE,
      role: TEAM_PROFILE_CONFIG.TEAM_ROLES.ADMIN,
    },
    {
      id: "3",
      name: "Michael Chen",
      position: TEAM_PROFILE_CONFIG.TEAM_POSITIONS.SENIOR_DEVELOPER,
      email: "michael.chen@synapsetech.com",
      profileImage: dummyProfile.src,
      joinDate: "2020-01-10",
      status: TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE,
      role: TEAM_PROFILE_CONFIG.TEAM_ROLES.MEMBER,
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      position: TEAM_PROFILE_CONFIG.TEAM_POSITIONS.UI_UX_DESIGNER,
      email: "emily.rodriguez@synapsetech.com",
      profileImage: dummyProfile.src,
      joinDate: "2021-08-05",
      status: TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE,
      role: TEAM_PROFILE_CONFIG.TEAM_ROLES.MEMBER,
    },
    {
      id: "5",
      name: "David Wilson",
      position: TEAM_PROFILE_CONFIG.TEAM_POSITIONS.BUSINESS_ANALYST,
      email: "david.wilson@synapsetech.com",
      profileImage: dummyProfile.src,
      joinDate: "2022-03-12",
      status: TEAM_PROFILE_CONFIG.TEAM_STATUS.INACTIVE,
      role: TEAM_PROFILE_CONFIG.TEAM_ROLES.VIEWER,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  const removeMember = (id: string) => {
    if (confirm(MESSAGES.REMOVE_MEMBER)) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
    }
  };

  const getRoleColor = (role: TeamRole) => {
    switch (role) {
      case TEAM_PROFILE_CONFIG.TEAM_ROLES.ADMIN:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case TEAM_PROFILE_CONFIG.TEAM_ROLES.MEMBER:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case TEAM_PROFILE_CONFIG.TEAM_ROLES.VIEWER:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    return status === TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const filteredMembers = teamMembers.filter((member) => {
    const statusMatch =
      filterStatus === "all" || member.status === filterStatus;
    const roleMatch = filterRole === "all" || member.role === filterRole;
    return statusMatch && roleMatch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Team Profiles
        </h3>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamMembers.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Members
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {
              teamMembers.filter(
                (m) => m.status === TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE,
              ).length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {
              teamMembers.filter(
                (m) => m.role === TEAM_PROFILE_CONFIG.TEAM_ROLES.ADMIN,
              ).length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {
              teamMembers.filter(
                (m) => m.role === TEAM_PROFILE_CONFIG.TEAM_ROLES.MEMBER,
              ).length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Members
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={
                      member.profileImage || "/images/placeholder-avatar.jpg"
                    }
                    alt={member.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === TEAM_PROFILE_CONFIG.TEAM_STATUS.ACTIVE
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.position}
                  </p>
                  <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                    {member.email}
                  </p>
                  <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor(member.role)}`}
                >
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getStatusColor(member.status)}`}
                >
                  {member.status.charAt(0).toUpperCase() +
                    member.status.slice(1)}
                </span>
                <button
                  onClick={() => removeMember(member.id)}
                  className="px-3 py-1 text-[0.875] font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No team members found.
            </p>
          </div>
        )}
      </div>

      {/* Role Legend */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Role Definitions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[0.875]">
          <div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor("admin")} mb-1`}
            >
              Admin
            </span>
            <p className="text-gray-600 dark:text-gray-400">
              Full access to company settings and data
            </p>
          </div>
          <div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor("member")} mb-1`}
            >
              Member
            </span>
            <p className="text-gray-600 dark:text-gray-400">
              Can view and edit company information
            </p>
          </div>
          <div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor("viewer")} mb-1`}
            >
              Viewer
            </span>
            <p className="text-gray-600 dark:text-gray-400">
              Read-only access to company information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTeamProfiles;
