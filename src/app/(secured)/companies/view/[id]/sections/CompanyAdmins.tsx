"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Viewer";
  profileImage: string;
  status: "Active" | "Inactive";
}

interface CompanyAdminsFormData {
  admins: Admin[];
}

const CompanyAdmins = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanyAdminsFormData = {
    admins: [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@synapsetech.com",
        role: "Super Admin",
        profileImage: "/images/users/john-smith.jpg",
        status: "Active",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.johnson@synapsetech.com",
        role: "Editor",
        profileImage: "/images/users/sarah-johnson.jpg",
        status: "Active",
      },
      {
        id: "3",
        name: "Mike Davis",
        email: "mike.davis@synapsetech.com",
        role: "Viewer",
        profileImage: "/images/users/mike-davis.jpg",
        status: "Inactive",
      },
    ],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CompanyAdminsFormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "admins",
  });

  const onSubmit = (data: CompanyAdminsFormData) => {
    console.log("Company Admins - Edited Data:", {
      section: "Company Admins & Roles",
      data: data,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send data to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setIsEditing(false);
  };

  const addAdmin = () => {
    append({
      id: Date.now().toString(),
      name: "",
      email: "",
      role: "Viewer",
      profileImage: "",
      status: "Active",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Viewer":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Company Admins & Roles
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Edit
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No admins added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((admin) => (
              <div
                key={admin.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={admin.profileImage || "/images/users/default.jpg"}
                        alt={admin.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                        {admin.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getRoleColor(admin.role)}`}
                    >
                      {admin.role}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getStatusColor(admin.status)}`}
                    >
                      {admin.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin Summary */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Admin Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {fields.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Admins
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {fields.filter((a) => a.role === "Super Admin").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Super Admins
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {fields.filter((a) => a.role === "Editor").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Editors
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {fields.filter((a) => a.status === "Active").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Company Admins & Roles
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={addAdmin}
            className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
          >
            Add Admin
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No admins added yet.
            </p>
            <button
              type="button"
              onClick={addAdmin}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Add Your First Admin
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((admin, index) => (
              <div
                key={admin.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Admin Info */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`admin-name-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Name
                      </label>
                      <input
                        id={`admin-name-${index}`}
                        type="text"
                        {...register(`admins.${index}.name` as const, {
                          required: "Name is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.admins?.[index]?.name && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.admins[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`admin-email-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id={`admin-email-${index}`}
                        type="email"
                        {...register(`admins.${index}.email` as const, {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.admins?.[index]?.email && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.admins[index]?.email?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`admin-profile-image-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Profile Image URL
                      </label>
                      <input
                        id={`admin-profile-image-${index}`}
                        type="url"
                        {...register(`admins.${index}.profileImage` as const)}
                        placeholder="https://example.com/profile.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.admins?.[index]?.profileImage && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.admins[index]?.profileImage?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role and Status */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`admin-role-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Role
                      </label>
                      <select
                        id={`admin-role-${index}`}
                        {...register(`admins.${index}.role` as const, {
                          required: "Role is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      {errors.admins?.[index]?.role && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.admins[index]?.role?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`admin-status-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Status
                      </label>
                      <select
                        id={`admin-status-${index}`}
                        {...register(`admins.${index}.status` as const, {
                          required: "Status is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {errors.admins?.[index]?.status && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.admins[index]?.status?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Remove Admin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyAdmins;
