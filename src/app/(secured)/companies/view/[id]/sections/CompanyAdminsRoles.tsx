"use client";

import { useState } from "react";
import Image from "next/image";
import { dummyProfile } from "@/assets";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "editor" | "viewer";
  status: "active" | "inactive";
  lastActive: string;
  profileImage?: string;
  permissions: string[];
}

const CompanyAdminsRoles = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@synapsetech.com",
      role: "super_admin",
      status: "active",
      lastActive: "2024-01-15T10:30:00Z",
      profileImage: dummyProfile.src,
      permissions: [
        "Full Access",
        "User Management",
        "Company Settings",
        "Data Export",
      ],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@synapsetech.com",
      role: "editor",
      status: "active",
      lastActive: "2024-01-15T09:15:00Z",
      profileImage: dummyProfile.src,
      permissions: [
        "Content Management",
        "User Management",
        "Limited Settings",
      ],
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.chen@synapsetech.com",
      role: "viewer",
      status: "active",
      lastActive: "2024-01-14T16:45:00Z",
      profileImage: dummyProfile.src,
      permissions: ["Read Only Access", "View Reports"],
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@synapsetech.com",
      role: "editor",
      status: "inactive",
      lastActive: "2024-01-10T14:20:00Z",
      profileImage: dummyProfile.src,
      permissions: ["Content Management", "Limited Settings"],
    },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Full access to all company settings and data";
      case "editor":
        return "Can edit content and manage users, limited settings access";
      case "viewer":
        return "Read-only access to company information";
      default:
        return "";
    }
  };

  const changeRole = (userId: string, newRole: AdminUser["role"]) => {
    setAdminUsers(
      adminUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );
  };

  const removeUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      setAdminUsers(adminUsers.filter((user) => user.id !== userId));
    }
  };

  const getPermissionsByRole = (role: string) => {
    switch (role) {
      case "super_admin":
        return [
          "Full Access",
          "User Management",
          "Company Settings",
          "Data Export",
          "System Configuration",
        ];
      case "editor":
        return [
          "Content Management",
          "User Management",
          "Limited Settings",
          "Reports Access",
        ];
      case "viewer":
        return ["Read Only Access", "View Reports", "Basic Information"];
      default:
        return [];
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Company Admins & Roles
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {adminUsers.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Admins
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {adminUsers.filter((u) => u.role === "super_admin").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Super Admins
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {adminUsers.filter((u) => u.role === "editor").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Editors
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-600">
            {adminUsers.filter((u) => u.role === "viewer").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Viewers
          </div>
        </div>
      </div>

      {/* Admin Users List */}
      <div className="space-y-4">
        {adminUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Image
                    src={user.profileImage || "/images/placeholder-avatar.jpg"}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor(user.role)}`}
                    >
                      {user.role
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getStatusColor(user.status)}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {user.email}
                  </p>
                  <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                    Last active: {new Date(user.lastActive).toLocaleString()}
                  </p>
                  <p className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400 mt-1">
                    {getRoleDescription(user.role)}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col space-y-2">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      changeRole(user.id, e.target.value as AdminUser["role"])
                    }
                    className="px-3 py-1 text-[0.875] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="px-3 py-1 text-[0.875] font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </h5>
              <div className="flex flex-wrap gap-2">
                {getPermissionsByRole(user.role).map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[0.875] dark:bg-gray-700 dark:text-gray-300"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {adminUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No admin users found.
            </p>
          </div>
        )}
      </div>

      {/* Role Definitions */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Role Definitions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor("super_admin")}`}
              >
                Super Admin
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Full access to all company settings, user management, and data
              export capabilities.
            </p>
            <ul className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400 space-y-1">
              <li>• Full system access</li>
              <li>• User management</li>
              <li>• Company settings</li>
              <li>• Data export</li>
              <li>• System configuration</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor("editor")}`}
              >
                Editor
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Can edit content, manage users, and access limited settings.
            </p>
            <ul className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400 space-y-1">
              <li>• Content management</li>
              <li>• User management</li>
              <li>• Limited settings</li>
              <li>• Reports access</li>
              <li>• No system config</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor("viewer")}`}
              >
                Viewer
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Read-only access to company information and reports.
            </p>
            <ul className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400 space-y-1">
              <li>• Read-only access</li>
              <li>• View reports</li>
              <li>• Basic information</li>
              <li>• No editing</li>
              <li>• No user management</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyAdminsRoles;
