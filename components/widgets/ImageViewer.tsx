"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
import DarkOverlay from "./DarkOverlay";
import { useSettings } from "../contexts/SettingsContext";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import ShowSubtitleIcon from "../assets/entries/imageViewer/ShowSubtitleIcon";
import GridViewIcon from "../assets/entries/imageViewer/GridViewIcon";
import MagnifyingGlassIcon from "../assets/entries/imageViewer/MagnifyingGlassIcon";
import ColoredArrowIcon from "../assets/entries/imageViewer/ColoredArrowIcon";
import imageViewerStyle from "./image-viewer.module.css";
import PopUpDisplay from "./PopUpDisplay";
import { shimmerDataURL } from "@/lib/imageUtil";
import { useSwipe } from "@/lib/helperHooks";

function imageViewerTextParser(input: ImagesData): ImagesData {
  const { url, text = [], aspectRatio, original = [] } = input;
  let outputText: string[] = [];

  const urlLength = url.length;
  const textLength = text.length;

  if (urlLength === textLength) {
    outputText = text;
  } else if (textLength > urlLength) {
    outputText = text.slice(0, urlLength);
  } else {
    outputText = [...text, ...new Array(urlLength - textLength).fill("")];
  }

  const safeOriginal: string[] = original
    ? original.length === url.length
      ? original
      : original.length < url.length
      ? [...original, ...new Array(url.length - original.length).fill("")]
      : original.slice(0, url.length)
    : new Array(url.length).fill("");

  return {
    url,
    text: outputText,
    aspectRatio,
    original: safeOriginal,
  };
}

const computeGridDimensions = (numImages: number) => {
  const dimension = Math.ceil(Math.sqrt(numImages));
  return dimension;
};

export default function ImageViewer({
  url,
  aspectRatio,
  text = [],
  original = [],
  useHFull = false,
  forceGridViewCenter = true,
  imageDisplayingMode = "cover",
}: ImagesData & {
  useHFull?: boolean;
  forceGridViewCenter?: boolean;
  imageDisplayingMode?: "cover" | "contain";
}) {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(0);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const [leftButtonVisible, setLeftButtonVisible] = useState(false);
  const [rightButtonVisible, setRightButtonVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [hideDescription, setHideDescription] = useState(false);
  const [pageFlipGridViewFlag, setPageFlipGridViewFlag] = useState(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isGridView, setGridView] = useState(false);
  const [horizontalTranslation, setHorizontalTranslation] = useState<number>(0);
  const [containerTransition, setContainerTransition] =
    useState<string>("none");
  const [wasPreviouslyScrolling, setWasPreviouslyScrolling] = useState(false);
  const [canPerformGestureFlip, setCanPerformGestureFlip] = useState(true);
  const [hasScrollingHitBoundary, setHasScrollingHitBoundary] = useState(false);
  const [touchInitialX, setTouchInitialX] = useState<null | number>(null);
  const [touchInitialShift, setTouchInitialShift] = useState<null | number>(
    null
  );

  const gridLength = computeGridDimensions(url.length);

  const { text: actualDescriptions, original: safeOriginal } = useMemo(() => {
    return imageViewerTextParser({
      url: url,
      aspectRatio: aspectRatio,
      text: text,
      original: original,
    }) as { text: string[]; original: string[] };
  }, [url, aspectRatio, text, original]);

  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);

  const calculateGridViewTransformStyle = (index: number) => {
    const gridPosition = index % gridLength;
    const rowCoordinate = Math.floor(index / gridLength);
    const maxRowNum = Math.ceil(url.length / gridLength);
    const adjustedRowCoordinate = forceGridViewCenter
      ? rowCoordinate + (gridLength - maxRowNum) / 2
      : rowCoordinate;

    const xTranslation =
      (gridPosition / gridLength - 0.5 + 0.5 / gridLength) * 100;
    const yTranslation =
      (adjustedRowCoordinate / gridLength - 0.5 + 0.5 / gridLength) * 100;
    const scale = 1 / gridLength - 0.008;

    return `translate(${xTranslation}%, ${yTranslation}%) scale(${scale})`;
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const setButtonVisibility = (page: number) => {
    if (page === 0) {
      setLeftButtonVisible(false);
    } else {
      setLeftButtonVisible(true);
    }

    if (page === url.length - 1) {
      setRightButtonVisible(false);
    } else {
      setRightButtonVisible(true);
    }
  };

  const goToPage = (page: number, duration: number = 0.2) => {
    if (isGridView) return;

    const onComplete = () => {
      setDescriptionVisible(true);
      setPageFlipGridViewFlag(true);
      setCurrentPage(page);
      setCanPerformGestureFlip(true);
    };

    if (horizontalTranslation === -page * 100) {
      onComplete();
      return;
    }

    setCanPerformGestureFlip(false);
    setDescriptionVisible(false);
    setPageFlipGridViewFlag(false);
    setButtonVisibility(page);

    if (imageContainerRef.current) {
      setHorizontalTranslation(-page * 100);
      setContainerTransition(`transform ${duration}s ease-out`);

      const onTransitionEnd = () => {
        setContainerTransition("none");
        imageContainerRef.current?.removeEventListener(
          "transitionend",
          onTransitionEnd
        );
        onComplete();
      };

      imageContainerRef.current.addEventListener(
        "transitionend",
        onTransitionEnd
      );
    }
  };

  const goToPreviousPage = (duration: number = 0.2) => {
    if (currentPage > 0) {
      goToPage(currentPage - 1, duration);
    } else {
      goToPage(0, duration);
    }
  };

  const goToNextPage = (duration: number = 0.2) => {
    if (currentPage < url.length - 1) {
      goToPage(currentPage + 1, duration);
    } else {
      goToPage(url.length - 1, duration);
    }
  };

  const enableGridView = () => {
    if (!pageFlipGridViewFlag) return;
    if (!(url.length > 1)) return;

    setGridView(true);
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const imageNodes = Array.from(container.childNodes);

      imageNodes.forEach((node, index) => {
        if (node instanceof HTMLElement) {
          if (index === currentPage) {
            node.style.zIndex = "50";
            setHorizontalTranslation(0);
            container.style.transform = "translateX(0%)"; // This line is kept since otherwise there will be one frame of the style not properly applied just by setting the state.
            node.style.transform = "translateX(0%)";
          }
        }
      });

      imageNodes.forEach((node, index) => {
        if (index === currentPage) return;

        if (node instanceof HTMLElement) {
          node.style.transition = "none 0s";
          node.style.transform = calculateGridViewTransformStyle(index);
          node.style.zIndex = "-1";
        }
      });

      // Browser hack to force update the set layout. Seems to be more robust than setTimeOut 0.
      container.offsetHeight;

      imageNodes.forEach((node, index) => {
        if (node instanceof HTMLElement) {
          if (index === currentPage) {
            node.style.transform = calculateGridViewTransformStyle(index);
            node.style.transition = "all 0.18s ease-out";

            const handleTransitionEnd = () => {
              node.style.zIndex = "-1";
              node.removeEventListener("transitionend", handleTransitionEnd);
            };

            node.addEventListener("transitionend", handleTransitionEnd);
          }
        }
      });
    }
  };

  const turnOffGridView = (chosenIndex: number) => {
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      const imageNodes = Array.from(container.childNodes);
      setCurrentPage(chosenIndex);

      imageNodes.forEach((node, index) => {
        if (node instanceof HTMLElement) {
          if (index === chosenIndex) {
            node.style.transform = "translate(0%, 0%) scale(1.0)";
            node.style.transition = "all 0.18s ease-out";
            node.style.zIndex = "50";

            const handleTransitionEnd = () => {
              setHorizontalTranslation(-index * 100);
              container.style.transform = `translateX(${-index * 100}%)`;
              container.offsetHeight;

              imageNodes.forEach((node, index) => {
                if (index === chosenIndex) return;

                if (node instanceof HTMLElement) {
                  node.style.transition = "none 0s";
                  node.style.transform = `translate(${
                    index * 100
                  }%, 0%) scale(1.0)`;
                  node.style.zIndex = "-1";
                }
              });

              imageNodes.forEach((node, index) => {
                if (node instanceof HTMLElement) {
                  if (index === chosenIndex) {
                    node.style.zIndex = "-1";
                    node.style.transition = "none 0s";
                    node.style.transform = `translate(${index * 100}%, 0%)`;
                  }
                }
              });
              setButtonVisibility(chosenIndex);
              setGridView(false);

              // Remove the event listener to avoid multiple calls
              node.removeEventListener("transitionend", handleTransitionEnd);
            };

            node.addEventListener("transitionend", handleTransitionEnd);
          }
        }
      });
    }
  };

  useSwipe({
    left: () => {
      goToPreviousPage(0.15);
    },
    right: () => {
      goToNextPage(0.15);
    },
  });

  useEffect(() => {
    if (isGridView) {
      return;
    }
    if (settings.disableGestures) {
      return;
    }

    let initialDeltaY: number | null = null;
    let initialDistance: number | null = null;

    function handleScroll(e: WheelEvent): void {
      // Check if the scrolling is still continued
      if (wasPreviouslyScrolling) {
        let timeoutId: NodeJS.Timeout;
        timeoutId = setTimeout(() => {
          goToPage(Math.round(-horizontalTranslation / 100));
          setWasPreviouslyScrolling(false);
          setHasScrollingHitBoundary(false);
        }, 160);

        const clearPageWindow = () => {
          if (hasScrollingHitBoundary) {
            return;
          }
          clearTimeout(timeoutId);
        };

        imageContainerRef.current?.addEventListener("wheel", clearPageWindow);
      }

      // Normal scrolling
      if (e.deltaX !== 0) {
        e.preventDefault();
        if (!canPerformGestureFlip) {
          return;
        }

        setWasPreviouslyScrolling(true);

        const deltaX = Math.round(-0.3 * e.deltaX);

        if (
          (horizontalTranslation === 0 && deltaX > 0) ||
          (horizontalTranslation === -100 * (url.length - 1) && deltaX < 0)
        ) {
          setHasScrollingHitBoundary(true);
        }

        if (
          (horizontalTranslation === 0 && deltaX >= 0) ||
          (horizontalTranslation === -100 * (url.length - 1) && deltaX <= 0)
        ) {
          return;
        }

        const newTranslateX = Math.max(
          0,
          Math.min(100 * (url.length - 1), -horizontalTranslation - deltaX)
        );
        setHorizontalTranslation(-newTranslateX);

        const passingPage = Math.round(newTranslateX / 100);

        setCurrentPage(passingPage);
        setButtonVisibility(passingPage);
        setDescriptionVisible(false);
        setPageFlipGridViewFlag(false);
      }

      // Pinch-to-zoom using trackpad
      if (e.ctrlKey) {
        e.preventDefault();
        if (initialDeltaY === null) {
          initialDeltaY = e.deltaY;
        } else {
          if (initialDeltaY - e.deltaY < 0 && initialDeltaY + e.deltaY > 0) {
            enableGridView();
            initialDeltaY = null; // Reset to stop continuous triggering
          }
        }
      }
    }

    function handleTouchStart(e: TouchEvent): void {
      if (e.touches.length === 2) {
        initialDistance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );
      } else if (e.touches.length === 1) {
        setTouchInitialX(e.touches[0].clientX);
        setTouchInitialShift(horizontalTranslation);
      }
    }

    function handleTouchMove(e: TouchEvent): void {
      if (e.touches.length === 2 && initialDistance !== null) {
        e.preventDefault();
        const currentDistance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );

        // If the distance between two fingers decreased by 30 or more
        if (initialDistance - currentDistance > 30) {
          enableGridView();
          initialDistance = null; // Reset to stop continuous triggering
        }
      } else if (
        e.touches.length === 1 &&
        touchInitialX !== null &&
        touchInitialShift !== null &&
        canPerformGestureFlip &&
        imageContainerRef.current
      ) {
        const deltaX =
          ((e.touches[0].clientX - touchInitialX) /
            imageContainerRef.current.clientWidth) *
          100;

        const newTranslateX = Math.max(
          0,
          Math.min(100 * (url.length - 1), -touchInitialShift - deltaX)
        );
        setHorizontalTranslation(-newTranslateX);

        const passingPage = Math.round(newTranslateX / 100);

        setButtonVisibility(passingPage);
        setDescriptionVisible(false);
        setPageFlipGridViewFlag(false);
      }
    }

    function handleTouchEnd(e: TouchEvent): void {
      setTouchInitialShift(null);
      setTouchInitialX(null);
      if (!isGridView) {
        goToPage(Math.round(-horizontalTranslation / 100), 0.15);
      }
    }

    function handleDoubleClick(): void {
      openPopup();
    }

    if (imageContainerRef.current) {
      imageContainerRef.current.addEventListener("wheel", handleScroll);
      imageContainerRef.current.addEventListener(
        "touchstart",
        handleTouchStart
      );
      imageContainerRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      imageContainerRef.current.addEventListener("touchend", handleTouchEnd);
      imageContainerRef.current.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      if (imageContainerRef.current) {
        imageContainerRef.current.removeEventListener("wheel", handleScroll);
        imageContainerRef.current.removeEventListener(
          "touchstart",
          handleTouchStart
        );
        imageContainerRef.current.removeEventListener(
          "touchmove",
          handleTouchMove
        );
        imageContainerRef.current.removeEventListener(
          "touchend",
          handleTouchEnd
        );
        imageContainerRef.current.removeEventListener(
          "dblclick",
          handleDoubleClick
        );
      }
    };
  }, [imageContainerRef, goToNextPage, goToPreviousPage, isGridView]);

  const currentDescription = actualDescriptions[currentPage].trim() as string;

  function flipSubtitleButton() {
    if (!currentDescription) {
      setHideDescription(false);
      return;
    }
    setHideDescription(!hideDescription);
  }

  useEffect(() => {
    if (!currentDescription || isGridView) {
      setHideDescription(false);
    }
  }, [currentDescription, isGridView]);

  return (
    <figure
      className={`${useHFull ? "h-full" : "w-full"} relative`}
      style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden z-0 touch-pan-y ${
          isGridView ? "" : "rounded-xl"
        }`}
      >
        <div
          ref={imageContainerRef}
          style={{
            transform: `translateX(${horizontalTranslation}%)`,
            transition: containerTransition,
          }}
          className="flex w-full h-full"
        >
          {url.map((src, index) => (
            <button
              key={index}
              className={`absolute inset-0 w-full h-full overflow-hidden ${
                isGridView ? "rounded-xl" : ""
              } bg-light`}
              style={{
                transform: `translateX(${index * 100}%)`,
              }}
              onClick={() => isGridView && turnOffGridView(index)}
              disabled={!isGridView}
              aria-disabled={!isGridView}
            >
              <Image
                src={src}
                alt={actualDescriptions[index] || `Image ${index}`}
                className={`w-full h-full ${
                  imageDisplayingMode === "cover"
                    ? "object-cover"
                    : "object-contain"
                } object-center`}
                height={Math.min(
                  1000,
                  Math.round((1000 / widthRatio) * heightRatio)
                )}
                width={Math.min(
                  1000,
                  Math.round((1000 / heightRatio) * widthRatio)
                )}
                priority={true}
              />
            </button>
          ))}
        </div>
      </div>

      {currentDescription && !isGridView && (
        <div
          className={`absolute pointer-events-none ${imageViewerStyle["text-position"]} flex items-end justify-center w-full`}
        >
          <p
            className={`z-10 tracking-wide ${
              imageViewerStyle["text-length"]
            } text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-sm px-3.5 py-1 rounded-3xl transition-opacity ease-out duration-300 overflow-hidden ${
              descriptionVisible && !hideDescription
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            {enrichTextContent(currentDescription)}
          </p>
        </div>
      )}

      {!isGridView && (
        <div className="absolute top-2 right-2 z-10 flex bg-neutral-600 bg-opacity-40 rounded-full py-1.5 px-3">
          {currentDescription && (
            <button className="mr-3" onClick={flipSubtitleButton}>
              <ShowSubtitleIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
            </button>
          )}

          {url.length > 1 && (
            <button className="mr-3" onClick={enableGridView}>
              <GridViewIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
            </button>
          )}
          <button className="" onClick={openPopup}>
            <MagnifyingGlassIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
          </button>
        </div>
      )}

      {currentPage > 0 && leftButtonVisible && !isGridView && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
          onClick={() => {
            goToPreviousPage();
          }}
        >
          <ColoredArrowIcon className="h-6 w-auto opacity-80 transition-transform duration-300 hover:scale-110" />
        </button>
      )}

      {currentPage < url.length - 1 && rightButtonVisible && !isGridView && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
          onClick={() => {
            goToNextPage();
          }}
        >
          <ColoredArrowIcon className="h-6 w-auto rotate-180 opacity-80 transition-transform duration-300 hover:scale-110" />
        </button>
      )}

      {!isGridView && url.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 max-w-full px-5">
          <ImagePageIndicator
            totalPages={url.length}
            currentPage={currentPage}
            onPageChange={goToPage}
          />
        </div>
      )}

      {showPopup && (
        <div className="pointer-events-none">
          <DarkOverlay />
        </div>
      )}

      {showPopup && (
        <PopUpDisplay onClose={closePopup}>
          <Image
            src={safeOriginal[currentPage] || url[currentPage]}
            alt={`${
              restoreDisplayText(currentDescription) || "Zoomed-In Image"
            }`}
            className={`${imageViewerStyle["popup-size"]} object-contain cursor-zoom-in`}
            height={4000}
            width={4000}
            quality={100}
            unoptimized={true}
            placeholder={`data:image/svg+xml;base64,${shimmerDataURL(
              100,
              100
            )}`}
            onClick={() => {
              window.open(
                safeOriginal[currentPage] || url[currentPage],
                "_blank"
              );
            }}
          />
        </PopUpDisplay>
      )}
    </figure>
  );
}
