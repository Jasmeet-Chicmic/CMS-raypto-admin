"use client";

import React, { useState, useEffect } from "react";
import { BonusBox } from "@/app/(secured)/bonus-slides/helpers/types";
import { BASE_URL } from "@/shared/constants";
import { ChevronLeft, ChevronRight, Monitor, Smartphone } from "lucide-react";
import "./SlidePreview.css";

interface SlidePreviewProps {
  title: string;
  boxes: BonusBox[];
  isProminent?: boolean;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Layout configurations matching frontend
const layoutConfigs: Record<
  number,
  { columns: string; rows: string; areas: string[] }
> = {
  0: {
    columns: "repeat(1, minmax(0, 1fr))",
    rows: "repeat(1, minmax(0, 1fr))",
    areas: ["card0"],
  },
  1: {
    columns: "repeat(1, minmax(0, 1fr))",
    rows: "repeat(1, minmax(0, 1fr))",
    areas: ["card0"],
  },
  2: {
    columns: "repeat(2, minmax(0, 1fr))",
    rows: "repeat(1, minmax(0, 1fr))",
    areas: ["card0 card1"],
  },
  3: {
    columns: "repeat(2, minmax(0, 1fr))",
    rows: "repeat(2, minmax(0, 1fr))",
    areas: ["card0 card1", "card0 card2"],
  },
  4: {
    columns: "45% 25% 28%",
    rows: "repeat(2, minmax(0, 1fr))",
    areas: ["card0 card1 card3", "card0 card2 card3"],
  },
};

const calculateCountdown = (expireAt: string): CountdownValues => {
  const now = new Date().getTime();
  const expiry = new Date(expireAt).getTime();
  const diff = Math.max(0, expiry - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("http")) return path;
  const baseUrl = BASE_URL?.replace(/\/$/, "") || "";
  const encodedPath = encodeURI(path);
  return `${baseUrl}/${encodedPath}`;
};

const formatNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

const SlidePreview = ({
  title,
  boxes,
  isProminent = false,
}: SlidePreviewProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [countdowns, setCountdowns] = useState<CountdownValues[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const updateCountdowns = () => {
      setCountdowns(boxes.map((box) => calculateCountdown(box.expireAt || "")));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [boxes]);

  // Reset current slide when boxes change or switching views
  useEffect(() => {
    setCurrentSlide(0);
  }, [boxes.length, isMobile]);

  const boxCount = boxes.length;
  const layout = layoutConfigs[boxCount] || layoutConfigs[1];
  const isSingleBox = boxCount === 1;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: layout.columns,
    gridTemplateRows: layout.rows,
    gridTemplateAreas: layout.areas.map((area) => `"${area}"`).join(" "),
    gap: "12px",
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? boxes.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === boxes.length - 1 ? 0 : prev + 1));
  };

  const getPositionStyles = (position?: number): React.CSSProperties => {
    switch (position) {
      case 1: // TOP_LEFT
        return { justifyContent: "flex-start", alignItems: "flex-start" };
      case 2: // TOP_RIGHT
        return { justifyContent: "flex-start", alignItems: "flex-end" };
      case 3: // BOTTOM_LEFT
        return { justifyContent: "flex-end", alignItems: "flex-start" };
      case 4: // BOTTOM_RIGHT
      default:
        return { justifyContent: "flex-end", alignItems: "flex-end" };
    }
  };

  const renderBoxContent = (box: BonusBox, index: number) => {
    const bgImage =
      isMobile && box.mobileBackgroundImageUrl
        ? box.mobileBackgroundImageUrl
        : box.backgroundImageUrl;
    const countdown = countdowns[index] || {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const positionStyles = getPositionStyles(box.buttonAndTimerPosition);

    return (
      <div className="preview-box-inner">
        {/* Background Image - Dynamic Height Base */}
        {bgImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getImageUrl(bgImage)}
            className="preview-box-img"
            alt="Slide background"
            loading="lazy"
          />
        ) : (
          <div className="preview-box-placeholder" />
        )}

        {/* Object Image */}
        {box.objectImageUrl && (
          <div
            className="preview-box-overlay"
            style={{
              backgroundImage: `url(${getImageUrl(box.objectImageUrl)})`,
            }}
          />
        )}

        {/* Content Layer */}
        <div
          className={`preview-box-content ${isSingleBox && !isMobile ? "single-box" : ""}`}
          style={positionStyles}
        >
          {/* Countdown */}
          {box.expireAt && (
            <div className="preview-countdown">
              <div className="countdown-item">
                <div className="countdown-value">
                  {formatNumber(countdown.days)}
                </div>
                <div className="countdown-label">Days</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">
                  {formatNumber(countdown.hours)}
                </div>
                <div className="countdown-label">Hrs</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">
                  {formatNumber(countdown.minutes)}
                </div>
                <div className="countdown-label">Min</div>
              </div>
            </div>
          )}

          {/* Button */}
          {box.buttonText && (
            <div className="preview-button">{box.buttonText}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="slide-preview">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-0 gap-4">
        {/* Title */}
        <div className="preview-title !mb-0 min-h-[1.2em]">
          {title || "Slide Preview"}
        </div>

        {/* Desktop/Mobile Segmented Toggle */}
        <div className="preview-toggle md:ml-auto">
          <button
            type="button"
            className={!isMobile ? "active" : ""}
            onClick={() => setIsMobile(false)}
          >
            <div className="flex items-center gap-2">
              <Monitor size={14} />
              Desktop
            </div>
          </button>
          <button
            type="button"
            className={isMobile ? "active" : ""}
            onClick={() => setIsMobile(true)}
          >
            <div className="flex items-center gap-2">
              <Smartphone size={14} />
              Mobile
            </div>
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-main-content">
        {boxes.length === 0 ? (
          <div className="preview-empty">
            <Smartphone className="w-12 h-12 mb-2 opacity-20" />
            <p>Add cards to the form to see your preview</p>
          </div>
        ) : isMobile ? (
          /* Mobile Carousel View */
          <div className="mobile-carousel">
            <div className="carousel-container">
              {/* Navigation Arrows */}
              {boxes.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="carousel-arrow left-0"
                  style={{ position: "absolute", left: "-20px" }}
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Cards Slider */}
              <div
                className={`carousel-slider ${isProminent ? "is-prominent" : ""}`}
              >
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {boxes.map((box, index) => (
                    <div key={index} className="carousel-slide">
                      <div
                        className={`preview-box mobile-box ${isProminent ? "is-prominent" : ""}`}
                      >
                        {renderBoxContent(box, index)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {boxes.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="carousel-arrow right-0"
                  style={{ position: "absolute", right: "-20px" }}
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Pagination Controls */}
            {boxes.length > 1 && (
              <div className="mt-6">
                <div className="carousel-dots">
                  {boxes.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`carousel-dot ${currentSlide === index ? "active" : ""}`}
                    />
                  ))}
                </div>
                <div className="carousel-counter">
                  Card {currentSlide + 1} of {boxes.length}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Desktop Grid View */
          <div className="grid-view-cards" style={gridStyle}>
            {boxes.map((box, index) => (
              <div
                key={index}
                className={`preview-box ${isProminent ? "is-prominent" : ""}`}
                style={{ gridArea: `card${index}` }}
              >
                {renderBoxContent(box, index)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidePreview;
