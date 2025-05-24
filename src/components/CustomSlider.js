import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const slides = [
  {
    title: "Knowledge Hub",
    description:
      "Access a centralized platform for sharing insights, best practices, and resources to drive innovation and growth.",
  },
  {
    title: "Business Development",
    description:
      "Unlock new growth through co-bidding opportunities, a client referral system, and collaborative access to multinational campaigns.",
  },
  {
    title: "Capacity Building",
    description:
      "Participate in training programs, workshops, and mentorship to enhance skills and operational excellence.",
  },
  {
    title: "Advocacy & Visibility",
    description:
      "Gain increased visibility through collective advocacy efforts and representation on a global stage.",
  },
];

const CustomSlider = () => {
  const [current, setCurrent] = useState(1); // Start at first real slide
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true); // Control transitions
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const [isPageVisible, setIsPageVisible] = useState(true); // Track page visibility
  const startXRef = useRef(null);
  const startTimeRef = useRef(null); // Track touch start time for velocity
  const containerRef = useRef(null);
  const slidesRef = useRef(null); // Reference to slides container
  const timerRef = useRef(null);
  const slideWidth = useRef(300); // Default slide width
  const VELOCITY_THRESHOLD = 0.5; // Pixels per ms for quick swipe

  // Extended slides: [last, ...original slides, first]
  const extendedSlides = [
    slides[slides.length - 1], // Clone of last slide
    ...slides, // Original slides
    slides[0], // Clone of first slide
  ];

  // Auto slide with pause on hover and page visibility
  useEffect(() => {
    if (!dragging && !isHovering && isPageVisible) {
      timerRef.current = setInterval(() => {
        setEnableTransition(true);
        setCurrent((prev) => {
          // Ensure current stays within valid bounds
          if (prev >= extendedSlides.length - 1) return 1;
          if (prev <= 0) return extendedSlides.length - 2;
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [dragging, isHovering, isPageVisible]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      if (
        !document.hidden &&
        (current < 0 || current >= extendedSlides.length)
      ) {
        // Reset to first real slide if index is invalid
        setEnableTransition(false);
        setCurrent(1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [current]);

  // Handle seamless loop at boundaries using transitionend
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (current === extendedSlides.length - 1) {
        // Reached cloned first slide, reset to real first slide
        setEnableTransition(false);
        setCurrent(1);
      } else if (current === 0) {
        // Reached cloned last slide, reset to real last slide
        setEnableTransition(false);
        setCurrent(extendedSlides.length - 2);
      }
    };

    const slidesContainer = slidesRef.current;
    if (slidesContainer) {
      slidesContainer.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (slidesContainer) {
        slidesContainer.removeEventListener(
          "transitionend",
          handleTransitionEnd
        );
      }
    };
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setEnableTransition(true);
        setCurrent((prev) => prev - 1); // Previous slide
      } else if (e.key === "ArrowRight") {
        setEnableTransition(true);
        setCurrent((prev) => prev + 1); // Next slide
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  // Update slide width on mount and resize
  useEffect(() => {
    const updateSlideWidth = () => {
      if (containerRef.current) {
        slideWidth.current = Math.min(
          containerRef.current.clientWidth * 0.8,
          500
        );
      }
    };

    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    return () => window.removeEventListener("resize", updateSlideWidth);
  }, []);

  const handleStart = (e) => {
    setDragging(true);
    clearInterval(timerRef.current);
    startXRef.current =
      e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    startTimeRef.current = Date.now(); // Record start time for velocity
  };

  const handleMove = (e) => {
    if (!dragging || !startXRef.current) return;

    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const delta = currentX - startXRef.current;
    setDragOffset(delta);
  };

  const handleEnd = () => {
    if (!dragging) return;

    const endTime = Date.now();
    const timeElapsed = endTime - startTimeRef.current; // Time in ms
    const distance = dragOffset; // Distance in pixels
    const velocity = timeElapsed > 0 ? Math.abs(distance / timeElapsed) : 0; // Pixels per ms
    const threshold = slideWidth.current / 3;

    // Determine slide change based on distance or velocity
    let shouldChangeSlide = false;
    let direction = 0;

    if (Math.abs(distance) > threshold || velocity > VELOCITY_THRESHOLD) {
      shouldChangeSlide = true;
      direction = distance > 0 ? -1 : 1; // -1 for left, 1 for right
    }

    if (shouldChangeSlide) {
      setEnableTransition(true);
      setCurrent((prev) => prev + direction);
    }

    setDragging(false);
    setDragOffset(0);
    startXRef.current = null;
    startTimeRef.current = null;
  };

  // Calculate slide styles
  const getSlideStyle = (index) => {
    const position = index - current;
    const zIndex = position === 0 ? 1 : 0;

    // Calculate translateX as a percentage
    let translateX = position * 100;
    if (dragging) {
      translateX += (dragOffset / slideWidth.current) * 100;
    }

    return {
      transform: `translateX(${translateX}%)`,
      zIndex,
      opacity: Math.abs(position) <= 1 ? 1 : 0,
      transition:
        enableTransition && !dragging ? `transform 500ms ease-out` : "none",
      width: "100%",
      willChange: "transform", // Optimize performance
    };
  };

  // Handle pagination click
  const handlePaginationClick = (index) => {
    setEnableTransition(true);
    setCurrent(index + 1); // Adjust for cloned slide at start
    setDragOffset(0);
  };

  return (
    <div
      className="w-full relative overflow-hidden flex  h-screen active:cursor-grabbing"
      ref={containerRef}
      tabIndex={0} // Make focusable for keyboard navigation
      role="region"
      aria-label="Image carousel"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseEnter={() => setIsHovering(false)}
      onMouseLeave={(e) => {
        setIsHovering(false);
        if (dragging) handleEnd(e);
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/10 z-10"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-start justify-end px-10 w-3/4">
        <div className="relative w-2/3 overflow-hidden ">
          <div
            className="flex relative bg-[#84C1D9] rounded-lg mb-10"
            style={{ height: "170px" }}
            ref={slidesRef}
          >
            {extendedSlides.map((slide, index) => (
              <div
                key={index}
                className="absolute top-0 left-0 flex flex-col p-8"
                style={getSlideStyle(index)}
              >
                  <h2 className="text-2xl font-bold paan-text-color">
                    {slide.title}
                  </h2>
                  <p className="paan-text-color">{slide.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Bullets */}
        {/* <div className="mt-4 z-20">
          <div className="flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePaginationClick(idx)}
                className={`w-3 h-3 rounded-full ${
                  current === idx + 1 ? "bg-[#ed751e]" : "bg-gray-300"
                } transition-all`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={current === idx + 1 ? "true" : "false"}
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CustomSlider;
