"use client";
import React, { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import CheckClickOutside from "../CheckClickOutside";
import NextImage, { ImageProps } from "next/image";
import { BASE_URL } from "@/shared/constants";

const Image = ({
  src,
  alt,
  onClick = () => {},
  showModal = false,
  className = "",
  ...props
}: ImageProps & {
  showModal?: boolean;
}) => {
  const [isValid, setIsValid] = useState(true);
  const [modal, setModal] = useState(false);
  const handleImageLoad = () => {
    setIsValid(true);
  };

  const handleImageError = () => {
    setIsValid(false);
  };

  const imageSource = useMemo(() => {
    if (src) {
      setIsValid(true);
      // Check if the src has a valid image property
      const isFullUrl = /^(http|https):\/\//.test(src as string);
      return isFullUrl
        ? src
        : `${BASE_URL}${(src as string)?.startsWith("/") ? src : `/${src}`}`;
    } else {
      // If no valid URL is found, use a default image
      setIsValid(false);
    }
  }, [src]);
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      console.log("Escape key pressed");
      setModal(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);
  return isValid && imageSource ? (
    <>
      <NextImage
        src={imageSource}
        alt={alt || ""}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onClick={(e) => {
          if (showModal) {
            setModal(true);
          }
          onClick(e);
        }}
        className={`${showModal ? "cursor-pointer" : ""} ${className}`}
        {...props}
      />
      {modal && imageSource ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <CheckClickOutside onClick={() => setModal(false)}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mt-2 p-3">
              <div
                className="flex justify-end mb-2 cursor-pointer"
                onClick={() => setModal(false)}
              >
                <X />
              </div>
              <NextImage
                src={imageSource}
                alt={alt || ""}
                onLoad={handleImageLoad}
                onError={handleImageError}
                {...props}
              />
            </div>
          </CheckClickOutside>
        </div>
      ) : null}
    </>
  ) : null;
};

export default Image;
