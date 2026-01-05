"use server";

import {
  Slide,
  SlideListItem,
  CreateSlidePayload,
} from "@/app/(secured)/bonus-slides/helpers/types";
import { API_END_POINTS } from "@/shared/api";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "@/shared/fetcher";
import { GetParamsType, ResponseType } from "@/shared/types";

// Get all slides
export async function getSlidesList(payload: GetParamsType) {
  try {
    const result = await getRequest<
      ResponseType & { data: { data: SlideListItem[]; count: number } },
      GetParamsType
    >(API_END_POINTS.BONUS_SLIDES, payload);
    return result;
  } catch (error) {
    console.error("Error fetching slides:", error);
    return {
      status: false,
      message: "Failed to fetch slides",
      data: { data: [], count: 0 },
    };
  }
}

// Get single slide by ID
export async function getSlideById(bonusSlideId: string) {
  try {
    const result = await getRequest<
      ResponseType & { data: Slide },
      { bonusSlideId: string }
    >(API_END_POINTS.BONUS_SLIDE_BY_ID, { bonusSlideId });
    return result;
  } catch (error) {
    console.error("Error fetching slide:", error);
    return {
      status: false,
      message: "Failed to fetch slide",
      data: null,
    };
  }
}

// Create new slide
export async function createSlide(payload: CreateSlidePayload) {
  try {
    const result = await postRequest<ResponseType, CreateSlidePayload>(
      API_END_POINTS.BONUS_SLIDES,
      payload,
    );
    return result;
  } catch (error) {
    console.error("Error creating slide:", error);
    return {
      status: false,
      message: "Failed to create slide",
    };
  }
}

// Update slide
export async function updateSlide(
  slideId: string,
  payload: CreateSlidePayload,
) {
  try {
    const result = await putRequest<
      ResponseType,
      CreateSlidePayload & { bonusSlideId: string }
    >(API_END_POINTS.BONUS_SLIDES, { ...payload, bonusSlideId: slideId });
    return result;
  } catch (error) {
    console.error("Error updating slide:", error);
    return {
      status: false,
      message: "Failed to update slide",
    };
  }
}

// Toggle slide active status
export async function toggleSlideStatus(slideId: string, isActive: boolean) {
  try {
    const result = await patchRequest<
      ResponseType,
      { bonusSlideId: string; isActive: boolean }
    >(API_END_POINTS.BONUS_SLIDE_IS_ACTIVE, {
      bonusSlideId: slideId,
      isActive,
    });
    return result;
  } catch (error) {
    console.error("Error toggling slide status:", error);
    return {
      status: false,
      message: "Failed to update status",
    };
  }
}

// Delete slide
export async function deleteSlide(slideId: string) {
  try {
    const result = await deleteRequest<
      ResponseType,
      { bonusSlideIds: string[] }
    >(API_END_POINTS.BONUS_SLIDES, { bonusSlideIds: [slideId] });
    return result;
  } catch (error) {
    console.error("Error deleting slide:", error);
    return {
      status: false,
      message: "Failed to delete slide",
    };
  }
}

// Upload image
export async function uploadSlideImage(formData: FormData) {
  try {
    const result = await postRequest<
      ResponseType & { data: { filePath: string } },
      FormData
    >(API_END_POINTS.FILE_UPLOAD, formData, {
      headers: {
        "Content-Type": undefined as unknown as string, // Remove Content-Type so axios auto-sets multipart boundary
      },
    });
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      status: false,
      message: "Failed to upload image",
      data: { filePath: "" },
    };
  }
}
