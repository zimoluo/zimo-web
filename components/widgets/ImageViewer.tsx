"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
import { useSettings } from "../contexts/SettingsContext";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import ShowSubtitleIcon from "../assets/entries/imageViewer/ShowSubtitleIcon";
import GridViewIcon from "../assets/entries/imageViewer/GridViewIcon";
import MagnifyingGlassIcon from "../assets/entries/imageViewer/MagnifyingGlassIcon";
import ColoredArrowIcon from "../assets/entries/imageViewer/ColoredArrowIcon";
import imageViewerStyle from "./image-viewer.module.css";
import { useDragAndTouch, useSwipe } from "@/lib/helperHooks";
import { usePopUp } from "../contexts/PopUpContext";
import _ from "lodash";
import ExpandedImagePopUp from "./ExpandedImagePopUp";

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
  defaultDimension = true,
  className = "",
  forceGridViewCenter = true,
  imageDisplayingMode = "cover",
}: ImagesData & {
  defaultDimension?: boolean;
  className?: string;
  forceGridViewCenter?: boolean;
  imageDisplayingMode?: "cover" | "contain";
}) {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState(0);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const [leftButtonVisible, setLeftButtonVisible] = useState(false);
  const [rightButtonVisible, setRightButtonVisible] = useState(true);
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
  const [initialScrollDeltaY, setInitialScrollDeltaY] = useState<null | number>(
    null
  );
  const [initialPinchDistance, setInitialPinchDistance] = useState<
    null | number
  >(null);
  const [storedUrl, setStoredUrl] = useState<string[]>(url);
  const { disableGestures } = settings;
  const { appendPopUp } = usePopUp();

  const isSingleImage = url.length <= 1;

  const gridLength = useMemo(() => {
    return computeGridDimensions(url.length);
  }, [url.length]);

  const { text: actualDescriptions, original: safeOriginal } = useMemo(() => {
    return imageViewerTextParser({
      url: url,
      aspectRatio: aspectRatio,
      text: text,
      original: original,
    }) as { text: string[]; original: string[] };
  }, [url, aspectRatio, text, original]);

  const [widthRatio, heightRatio] = useMemo(
    () => aspectRatio.split(":").map(Number),
    [aspectRatio]
  );

  const calculateGridViewTransformStyle = useCallback(
    (index: number) => {
      const gridPosition = index % gridLength;
      const rowCoordinate = Math.floor(index / gridLength);
      const maxRowNum = Math.ceil(url.length / gridLength);
      const adjustedRowCoordinate = forceGridViewCenter
        ? rowCoordinate + (gridLength - maxRowNum) / 2
        : rowCoordinate;

      const scale0 = 1 / gridLength;

      const gap = 0.0025;
      const scale = Math.max(scale0 - gap, 0.0001);

      const baseX = (gridPosition / gridLength - 0.5 + 0.5 / gridLength) * 100;
      const baseY =
        (adjustedRowCoordinate / gridLength - 0.5 + 0.5 / gridLength) * 100;

      const compensation = scale0 / scale;

      const xTranslation = baseX * compensation;
      const yTranslation = baseY * compensation;

      return `translate(${xTranslation}%, ${yTranslation}%) scale(${scale})`;
    },
    [gridLength, url.length, forceGridViewCenter]
  );

  const openPopUp = () => {
    appendPopUp({
      content: (
        <ExpandedImagePopUp
          url={url.map((u, i) => safeOriginal[i] || u)}
          alt={url.map((_, i) => actualDescriptions[i] || "")}
          initialIndex={currentPage}
        />
      ),
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isGridView) return;

    const actionableKeys = ["ArrowLeft", "ArrowRight", "s", "g", "p"];

    if (
      (event.key >= "1" && event.key <= "9") ||
      actionableKeys.includes(event.key)
    ) {
      event.preventDefault();

      switch (event.key) {
        case "ArrowLeft":
          goToPreviousPage();
          break;
        case "ArrowRight":
          goToNextPage();
          break;
        case "s":
          flipSubtitleButton();
          break;
        case "g":
          enableGridView();
          break;
        case "p":
          openPopUp();
          break;
        default:
          handleNumericKey(event.key);
          break;
      }
    }

    function handleNumericKey(key: string) {
      if (isSingleImage) {
        return;
      }

      const pageNumber = parseInt(key, 10) - 1;
      const lastPageIndex = url.length - 1;
      if (key === "9" || pageNumber > lastPageIndex) {
        goToPage(lastPageIndex);
      } else if (pageNumber >= 0 && pageNumber <= lastPageIndex) {
        goToPage(pageNumber);
      }
    }
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

  const goToPage = useCallback(
    (page: number, duration: number = 0.2) => {
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
    },
    [isGridView, horizontalTranslation, imageContainerRef, url.length]
  );

  const goToPreviousPage = useCallback(
    (duration: number = 0.2) => {
      if (currentPage > 0) {
        goToPage(currentPage - 1, duration);
      } else {
        goToPage(0, duration);
      }
    },
    [currentPage, goToPage]
  );

  const goToNextPage = useCallback(
    (duration: number = 0.2) => {
      if (currentPage < url.length - 1) {
        goToPage(currentPage + 1, duration);
      } else {
        goToPage(url.length - 1, duration);
      }
    },
    [currentPage, goToPage, url.length]
  );

  const enableGridView = () => {
    if (!pageFlipGridViewFlag) return;
    if (isSingleImage) return;

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
    subjectRef: imageContainerRef,
  });

  function handleScroll(e: WheelEvent): void {
    if (isSingleImage) {
      return;
    }

    const isAtStart = horizontalTranslation === 0;
    const isAtEnd = horizontalTranslation === -100 * (url.length - 1);
    const deltaX = Math.round(-0.3 * e.deltaX);
    const isScrollingForward = deltaX > 0;
    const isScrollingBackward = deltaX < 0;

    // Check if the scrolling is still continued
    if (wasPreviouslyScrolling) {
      let timeoutId: NodeJS.Timeout;
      timeoutId = setTimeout(() => {
        goToPage(Math.round(-horizontalTranslation / 100));
        setWasPreviouslyScrolling(false);
        setHasScrollingHitBoundary(false);
      }, 150);

      const clearPageWindow = () => {
        if (!hasScrollingHitBoundary) {
          clearTimeout(timeoutId);
        }
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

      // Check if scrolling has hit boundary
      if (
        (isAtStart && isScrollingForward) ||
        (isAtEnd && isScrollingBackward)
      ) {
        setHasScrollingHitBoundary(true);
      }

      // Prevent scrolling beyond boundaries
      if ((isAtStart && deltaX >= 0) || (isAtEnd && deltaX <= 0)) {
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
      if (initialScrollDeltaY === null) {
        setInitialScrollDeltaY(e.deltaY);
      } else if (
        initialScrollDeltaY - e.deltaY < 0 &&
        initialScrollDeltaY + e.deltaY > 0
      ) {
        enableGridView();
        setInitialScrollDeltaY(null); // Reset to stop continuous triggering
      }
    }
  }

  function handleFlipStart(e: React.TouchEvent | React.MouseEvent): void {
    if (isSingleImage) {
      return;
    }

    if ("touches" in e) {
      const touchCount = e.touches.length;

      if (touchCount === 1) {
        setTouchInitialX(e.touches[0].clientX);
        setTouchInitialShift(horizontalTranslation);
      } else if (touchCount === 2) {
        const deltaX = e.touches[0].clientX - e.touches[1].clientX;
        const deltaY = e.touches[0].clientY - e.touches[1].clientY;
        const pinchDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        setInitialPinchDistance(pinchDistance);
      }
    } else {
      setTouchInitialX(e.clientX);
      setTouchInitialShift(horizontalTranslation);
    }
  }

  function handleFlipMove(e: TouchEvent | MouseEvent): void {
    if (isSingleImage) {
      return;
    }

    const isTouchEvent = "touches" in e;
    const isMouseEvent = "clientX" in e;
    const isSingleTouch = isTouchEvent && e.touches.length === 1;
    const isDoubleTouch = isTouchEvent && e.touches.length === 2;
    const isTouchInitialsSet =
      touchInitialX !== null && touchInitialShift !== null;
    const isAtStart = horizontalTranslation === 0;
    const isAtEnd = horizontalTranslation === -100 * (url.length - 1);

    if (isDoubleTouch && initialPinchDistance !== null) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - e.touches[1].clientX;
      const deltaY = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If the distance between two fingers decreased by 30 or more
      if (initialPinchDistance - currentDistance > 30) {
        enableGridView();
        setInitialPinchDistance(null); // Reset to stop continuous triggering
      }
    } else if (
      (isSingleTouch || isMouseEvent) &&
      isTouchInitialsSet &&
      canPerformGestureFlip &&
      imageContainerRef.current
    ) {
      const clientX = isMouseEvent ? e.clientX : e.touches[0].clientX;
      const deltaX =
        ((clientX - touchInitialX) / imageContainerRef.current.clientWidth) *
        100;

      // Prevent scrolling beyond boundaries
      if ((isAtStart && deltaX >= 0) || (isAtEnd && deltaX <= 0)) {
        return;
      }

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

  function handleFlipEnd(): void {
    if (isSingleImage) {
      return;
    }

    setTouchInitialShift(null);
    setTouchInitialX(null);
    if (!isGridView) {
      goToPage(Math.round(-horizontalTranslation / 100), 0.15);
    }
  }

  function handleDoubleClick(): void {
    openPopUp();
  }

  const { handleStartDragging, handleStartTouching } = useDragAndTouch({
    onMove: handleFlipMove,
    onStart: handleFlipStart,
    onFinish: handleFlipEnd,
    isDisabled: isGridView || disableGestures,
    dependencies: [
      handleFlipMove,
      handleFlipStart,
      handleFlipEnd,
      isGridView,
      disableGestures,
    ],
  });

  useEffect(() => {
    if (isGridView) {
      return;
    }
    if (disableGestures) {
      return;
    }

    if (imageContainerRef.current) {
      imageContainerRef.current.addEventListener("wheel", handleScroll);
      imageContainerRef.current.addEventListener(
        "dblclick",
        handleDoubleClick,
        { passive: true }
      );
    }

    return () => {
      if (imageContainerRef.current) {
        imageContainerRef.current.removeEventListener("wheel", handleScroll);
        imageContainerRef.current.removeEventListener(
          "dblclick",
          handleDoubleClick
        );
      }
    };
  }, [
    imageContainerRef,
    goToNextPage,
    goToPreviousPage,
    isGridView,
    disableGestures,
    handleScroll,
    handleDoubleClick,
  ]);

  const currentDescription = (
    actualDescriptions?.[currentPage] || ""
  ).trim() as string;

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

  useEffect(() => {
    if (!_.isEqual(storedUrl, url)) {
      setStoredUrl(url);
      if (isGridView) {
        turnOffGridView(0);
      }
      goToPage(0);
    }
  }, [url, storedUrl]);

  return (
    <figure
      className={`${defaultDimension ? "w-full" : ""} relative ${className}`}
      style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden z-0 ${
          !isSingleImage && !isGridView ? "touch-pan-y" : ""
        } ${isGridView ? "" : "rounded-3xl"}`}
      >
        <div
          ref={imageContainerRef}
          style={{
            transform: `translateX(${horizontalTranslation}%)`,
            transition: containerTransition,
          }}
          className="flex w-full h-full"
          onTouchStart={handleStartTouching}
          onMouseDown={handleStartDragging}
        >
          {url.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full overflow-hidden ${
                isGridView ? "rounded-md" : ""
              } bg-light`}
              style={{
                transform: `translateX(${index * 100}%)`,
              }}
            >
              <Image
                src={src}
                alt={actualDescriptions[index] || `Image ${index}`}
                className={`w-full h-full ${
                  imageDisplayingMode === "cover"
                    ? "object-cover"
                    : "object-contain"
                } object-center relative`}
                height={Math.min(
                  2500,
                  Math.round((2500 / widthRatio) * heightRatio)
                )}
                width={Math.min(
                  2500,
                  Math.round((2500 / heightRatio) * widthRatio)
                )}
                priority={true}
                draggable={false}
              />
              <button
                className={`absolute inset-0 w-full h-full ${
                  isGridView
                    ? ""
                    : "pointer-events-none select-none invisible hidden"
                }`}
                onClick={() => isGridView && turnOffGridView(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {currentDescription && !isGridView && (
        <div
          className={`absolute pointer-events-none ${imageViewerStyle.textPosition} flex items-end justify-center w-full`}
        >
          <p
            className={`tracking-wide ${
              imageViewerStyle.textLength
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
        <div className="absolute top-2 right-2 flex z-0 bg-neutral-600 bg-opacity-40 rounded-full py-2 px-3 outline outline-1 outline-neutral-500/30">
          {currentDescription && (
            <button className="mr-3" onClick={flipSubtitleButton}>
              <ShowSubtitleIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
            </button>
          )}

          {!isSingleImage && (
            <button className="mr-3" onClick={enableGridView}>
              <GridViewIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
            </button>
          )}
          <button className="" onClick={openPopUp}>
            <MagnifyingGlassIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
          </button>
        </div>
      )}

      {currentPage > 0 && leftButtonVisible && !isGridView && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2"
          onClick={() => {
            goToPreviousPage();
          }}
        >
          <ColoredArrowIcon className="h-6 w-auto opacity-80 transition-transform duration-300 hover:scale-110" />
        </button>
      )}

      {currentPage < url.length - 1 && rightButtonVisible && !isGridView && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => {
            goToNextPage();
          }}
        >
          <ColoredArrowIcon className="h-6 w-auto rotate-180 opacity-80 transition-transform duration-300 hover:scale-110" />
        </button>
      )}

      {!isGridView && !isSingleImage && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 max-w-full px-5">
          <ImagePageIndicator
            totalPages={url.length}
            currentPage={currentPage}
            onPageChange={goToPage}
          />
        </div>
      )}
    </figure>
  );
}
