"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
}

interface CompanyVideosFormData {
  videos: Video[];
}

const CompanyVideos = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from props or API
  const defaultValues: CompanyVideosFormData = {
    videos: [
      {
        id: "1",
        title: "Company Overview Video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "2:30",
      },
      {
        id: "2",
        title: "Product Demo",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "1:45",
      },
      {
        id: "3",
        title: "Customer Testimonial",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "3:15",
      },
    ],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CompanyVideosFormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "videos",
  });

  const onSubmit = (data: CompanyVideosFormData) => {
    console.log("Company Videos - Edited Data:", {
      section: "Company Videos",
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

  const addVideo = () => {
    if (fields.length >= 3) {
      alert("Maximum 3 videos allowed");
      return;
    }
    append({
      id: Date.now().toString(),
      title: "",
      url: "",
      duration: "",
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert YouTube URL to embed format
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Videos
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
              No videos added yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((video) => (
              <div
                key={video.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="aspect-video mb-4">
                  <iframe
                    src={getYouTubeEmbedUrl(video.url)}
                    title={video.title}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
                <h4 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white mb-2">
                  {video.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {video.duration}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Videos
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={addVideo}
            className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
          >
            Add Video
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
              No videos added yet.
            </p>
            <button
              type="button"
              onClick={addVideo}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Add Your First Video
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((video, index) => (
              <div
                key={video.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Video Preview */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video Preview
                    </div>
                    <div className="aspect-video mb-4">
                      <iframe
                        src={getYouTubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`video-title-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Title
                      </label>
                      <input
                        id={`video-title-${index}`}
                        type="text"
                        {...register(`videos.${index}.title` as const, {
                          required: "Title is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.videos?.[index]?.title && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.videos[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`video-url-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Video URL
                      </label>
                      <input
                        id={`video-url-${index}`}
                        type="url"
                        {...register(`videos.${index}.url` as const, {
                          required: "Video URL is required",
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Please enter a valid URL",
                          },
                        })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.videos?.[index]?.url && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.videos[index]?.url?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`video-duration-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Duration
                      </label>
                      <input
                        id={`video-duration-${index}`}
                        type="text"
                        {...register(`videos.${index}.duration` as const, {
                          required: "Duration is required",
                          pattern: {
                            value: /^\d+:\d{2}$/,
                            message: "Please enter duration in format MM:SS",
                          },
                        })}
                        placeholder="2:30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {errors.videos?.[index]?.duration && (
                        <p className="text-red-500 text-[0.875] mt-1">
                          {errors.videos[index]?.duration?.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Remove Video
                    </button>
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

export default CompanyVideos;
