"use client";

import { useState } from "react";
import Image from "next/image";
import { dummyProfile } from "@/assets";
import { ENTITY_STATUS, ENTITY_STATUS_LABELS } from "@/shared/constants";
import { getStatusColor } from "@/shared/utils";

interface Testimonial {
  id: string;
  author: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  status: ENTITY_STATUS;
  date: string;
  authorImage?: string;
}

const CompanyTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      position: "CTO",
      company: "TechCorp Inc.",
      content:
        "Synapse Tech Solutions transformed our entire digital infrastructure. Their expertise in cloud migration and AI implementation exceeded our expectations. The team was professional, responsive, and delivered results that significantly improved our operational efficiency.",
      rating: 5,
      status: ENTITY_STATUS.APPROVED,
      date: "2024-01-15",
      authorImage: dummyProfile.src,
    },
    {
      id: "2",
      author: "Michael Chen",
      position: "Operations Director",
      company: "Global Retail",
      content:
        "Working with Synapse was a game-changer for our business. Their innovative approach to digital transformation helped us streamline processes and improve customer experience. Highly recommended!",
      rating: 4,
      status: ENTITY_STATUS.PENDING,
      date: "2024-01-10",
      authorImage: dummyProfile.src,
    },
    {
      id: "3",
      author: "Emily Rodriguez",
      position: "CEO",
      company: "StartupXYZ",
      content:
        "The team at Synapse delivered exceptional results. Their technical expertise and business acumen helped us scale our operations efficiently. Great partnership!",
      rating: 5,
      status: ENTITY_STATUS.FLAGGED,
      date: "2024-01-05",
      authorImage: dummyProfile.src,
    },
  ]);

  const updateStatus = (id: string, status: ENTITY_STATUS) => {
    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Testimonials
        </h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={
                      testimonial.authorImage ||
                      "/images/placeholder-avatar.jpg"
                    }
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.position} at {testimonial.company}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-[0.875] font-medium ${getStatusColor(testimonial.status)}`}
                >
                  {ENTITY_STATUS_LABELS[testimonial.status]
                    .charAt(0)
                    .toUpperCase() +
                    ENTITY_STATUS_LABELS[testimonial.status].slice(1)}
                </span>
                <span className="text-[0.875rem] text-[#A3AED0] dark:text-gray-400">
                  {new Date(testimonial.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {`${testimonial.content}`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              {testimonial.status === ENTITY_STATUS.PENDING && (
                <>
                  <button
                    onClick={() =>
                      updateStatus(testimonial.id, ENTITY_STATUS.APPROVED)
                    }
                    className="px-3 py-1 text-[0.875] font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(testimonial.id, ENTITY_STATUS.REJECTED)
                    }
                    className="px-3 py-1 text-[0.875] font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(testimonial.id, ENTITY_STATUS.FLAGGED)
                    }
                    className="px-3 py-1 text-[0.875] font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    Flag
                  </button>
                </>
              )}
              {testimonial.status === ENTITY_STATUS.FLAGGED && (
                <>
                  <button
                    onClick={() =>
                      updateStatus(testimonial.id, ENTITY_STATUS.APPROVED)
                    }
                    className="px-3 py-1 text-[0.875] font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(testimonial.id, ENTITY_STATUS.REJECTED)
                    }
                    className="px-3 py-1 text-[0.875] font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              {(testimonial.status === ENTITY_STATUS.APPROVED ||
                testimonial.status === ENTITY_STATUS.REJECTED) && (
                <button
                  onClick={() =>
                    updateStatus(testimonial.id, ENTITY_STATUS.PENDING)
                  }
                  className="px-3 py-1 text-[0.875] font-medium text-gray-600 border border-gray-600 rounded-md hover:bg-gray-600 hover:text-white transition-colors"
                >
                  Reset to Pending
                </button>
              )}
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No testimonials found.
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {testimonials.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {
              testimonials.filter((t) => t.status === ENTITY_STATUS.APPROVED)
                .length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Approved
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">
            {
              testimonials.filter((t) => t.status === ENTITY_STATUS.PENDING)
                .length
            }
            s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Pending
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {
              testimonials.filter((t) => t.status === ENTITY_STATUS.REJECTED)
                .length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Rejected
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTestimonials;
