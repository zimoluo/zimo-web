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

function imageViewerTextParser({
  url,
  text = [],
  aspectRatio,
  original = [],
}: ImagesData): ImagesData {
  const len = url.length;
  const outputText = Array.from({ length: len }, (_, i) => text[i] || "");
  const safeOriginal = Array.from({ length: len }, (_, i) => original[i] || "");

  return {
    url,
    text: outputText,
    aspectRatio,
    original: safeOriginal,
  };
}

const computeGridDimensions = (numImages: number) =>
  Math.ceil(Math.sqrt(numImages));

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
    null,
  );
  const [initialScrollDeltaY, setInitialScrollDeltaY] = useState<null | number>(
    null,
  );
  const [initialPinchDistance, setInitialPinchDistance] = useState<
    null | number
  >(null);
  const prevUrlRef = useRef<string[]>(url);

  const { disableGestures } = settings;
  const { appendPopUp } = usePopUp();

  const isSingleImage = url.length <= 1;
  const gridLength = useMemo(
    () => computeGridDimensions(url.length),
    [url.length],
  );
  const leftButtonVisible = currentPage > 0;
  const rightButtonVisible = currentPage < url.length - 1;

  const { text: actualDescriptions, original: safeOriginal } = useMemo(() => {
    return imageViewerTextParser({ url, aspectRatio, text, original }) as {
      text: string[];
      original: string[];
    };
  }, [url, aspectRatio, text, original]);

  const [widthRatio, heightRatio] = useMemo(
    () => aspectRatio.split(":").map(Number),
    [aspectRatio],
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
      const scale = Math.max(scale0 - 0.0025, 0.0001);
      const compensation = scale0 / scale;
      const xTranslation =
        (gridPosition / gridLength - 0.5 + 0.5 / gridLength) *
        100 *
        compensation;
      const yTranslation =
        (adjustedRowCoordinate / gridLength - 0.5 + 0.5 / gridLength) *
        100 *
        compensation;

      return `translate(${xTranslation}%, ${yTranslation}%) scale(${scale})`;
    },
    [gridLength, url.length, forceGridViewCenter],
  );

  const openPopUp = useCallback(() => {
    appendPopUp({
      content: (
        <ExpandedImagePopUp
          url={url.map((u, i) => safeOriginal[i] || u)}
          alt={url.map((_, i) => actualDescriptions[i] || "")}
          initialIndex={currentPage}
        />
      ),
    });
  }, [appendPopUp, url, safeOriginal, actualDescriptions, currentPage]);

  const goToPage = useCallback(
    (page: number, duration: number = 0.2) => {
      if (isGridView) return;

      const targetTranslation = -page * 100;
      const onComplete = () => {
        setDescriptionVisible(true);
        setPageFlipGridViewFlag(true);
        setCurrentPage(page);
        setCanPerformGestureFlip(true);
      };

      if (horizontalTranslation === targetTranslation) {
        onComplete();
        return;
      }

      setCanPerformGestureFlip(false);
      setDescriptionVisible(false);
      setPageFlipGridViewFlag(false);

      if (imageContainerRef.current) {
        setHorizontalTranslation(targetTranslation);
        setContainerTransition(`transform ${duration}s ease-out`);

        const onTransitionEnd = () => {
          setContainerTransition("none");
          imageContainerRef.current?.removeEventListener(
            "transitionend",
            onTransitionEnd,
          );
          onComplete();
        };

        imageContainerRef.current.addEventListener(
          "transitionend",
          onTransitionEnd,
        );
      }
    },
    [isGridView, horizontalTranslation],
  );

  const goToPreviousPage = useCallback(
    (duration: number = 0.2) => {
      goToPage(Math.max(currentPage - 1, 0), duration);
    },
    [currentPage, goToPage],
  );

  const goToNextPage = useCallback(
    (duration: number = 0.2) => {
      goToPage(Math.min(currentPage + 1, url.length - 1), duration);
    },
    [currentPage, url.length, goToPage],
  );

  const enableGridView = useCallback(() => {
    if (!pageFlipGridViewFlag || isSingleImage || !imageContainerRef.current)
      return;

    setGridView(true);
    const container = imageContainerRef.current;
    const imageNodes = Array.from(container.childNodes) as HTMLElement[];

    imageNodes.forEach((node, index) => {
      if (index === currentPage) {
        node.style.zIndex = "50";
        setHorizontalTranslation(0);
        container.style.transform = "translateX(0%)";
        node.style.transform = "translateX(0%)";
      } else {
        node.style.transition = "none 0s";
        node.style.transform = calculateGridViewTransformStyle(index);
        node.style.zIndex = "-1";
      }
    });

    container.offsetHeight;

    const currentNode = imageNodes[currentPage];
    if (currentNode) {
      currentNode.style.transform =
        calculateGridViewTransformStyle(currentPage);
      currentNode.style.transition = "all 0.18s ease-out";

      const handleTransitionEnd = () => {
        currentNode.style.zIndex = "-1";
        currentNode.removeEventListener("transitionend", handleTransitionEnd);
      };
      currentNode.addEventListener("transitionend", handleTransitionEnd);
    }
  }, [
    pageFlipGridViewFlag,
    isSingleImage,
    currentPage,
    calculateGridViewTransformStyle,
  ]);

  const turnOffGridView = useCallback((chosenIndex: number) => {
    if (!imageContainerRef.current) return;

    const container = imageContainerRef.current;
    const imageNodes = Array.from(container.childNodes) as HTMLElement[];
    setCurrentPage(chosenIndex);
    const targetNode = imageNodes[chosenIndex];

    if (targetNode) {
      targetNode.style.transform = "translate(0%, 0%) scale(1.0)";
      targetNode.style.transition = "all 0.18s ease-out";
      targetNode.style.zIndex = "50";

      const handleTransitionEnd = () => {
        const targetTranslate = -chosenIndex * 100;
        setHorizontalTranslation(targetTranslate);
        container.style.transform = `translateX(${targetTranslate}%)`;
        container.offsetHeight;

        imageNodes.forEach((node, index) => {
          node.style.transition = "none 0s";
          node.style.zIndex = "-1";
          node.style.transform = `translate(${index * 100}%, 0%) ${index !== chosenIndex ? "scale(1.0)" : ""}`;
        });

        setGridView(false);
        targetNode.removeEventListener("transitionend", handleTransitionEnd);
      };

      targetNode.addEventListener("transitionend", handleTransitionEnd);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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
            setHideDescription((prev) => !prev);
            break;
          case "g":
            enableGridView();
            break;
          case "p":
            openPopUp();
            break;
          default:
            if (!isSingleImage) {
              const pageNumber = parseInt(event.key, 10) - 1;
              const lastPageIndex = url.length - 1;
              if (event.key === "9" || pageNumber > lastPageIndex) {
                goToPage(lastPageIndex);
              } else if (pageNumber >= 0 && pageNumber <= lastPageIndex) {
                goToPage(pageNumber);
              }
            }
            break;
        }
      }
    },
    [
      isGridView,
      isSingleImage,
      url.length,
      goToPreviousPage,
      goToNextPage,
      enableGridView,
      openPopUp,
      goToPage,
    ],
  );

  useSwipe({
    left: () => goToPreviousPage(0.15),
    right: () => goToNextPage(0.15),
    subjectRef: imageContainerRef,
  });

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (isSingleImage) return;

      const isAtStart = horizontalTranslation === 0;
      const isAtEnd = horizontalTranslation === -100 * (url.length - 1);
      const deltaX = Math.round(-0.3 * e.deltaX);
      const isScrollingForward = deltaX > 0;
      const isScrollingBackward = deltaX < 0;

      if (wasPreviouslyScrolling) {
        const timeoutId = setTimeout(() => {
          goToPage(Math.round(-horizontalTranslation / 100));
          setWasPreviouslyScrolling(false);
          setHasScrollingHitBoundary(false);
        }, 150);

        const clearPageWindow = () => {
          if (!hasScrollingHitBoundary) clearTimeout(timeoutId);
        };

        imageContainerRef.current?.addEventListener("wheel", clearPageWindow, {
          once: true,
        });
      }

      if (e.deltaX !== 0) {
        e.preventDefault();
        if (!canPerformGestureFlip) return;

        setWasPreviouslyScrolling(true);

        if (
          (isAtStart && isScrollingForward) ||
          (isAtEnd && isScrollingBackward)
        ) {
          setHasScrollingHitBoundary(true);
        }

        if ((isAtStart && deltaX >= 0) || (isAtEnd && deltaX <= 0)) return;

        const newTranslateX = Math.max(
          0,
          Math.min(100 * (url.length - 1), -horizontalTranslation - deltaX),
        );
        setHorizontalTranslation(-newTranslateX);

        const passingPage = Math.round(newTranslateX / 100);
        setCurrentPage(passingPage);
        setDescriptionVisible(false);
        setPageFlipGridViewFlag(false);
      }

      if (e.ctrlKey) {
        e.preventDefault();
        if (initialScrollDeltaY === null) {
          setInitialScrollDeltaY(e.deltaY);
        } else if (
          initialScrollDeltaY - e.deltaY < 0 &&
          initialScrollDeltaY + e.deltaY > 0
        ) {
          enableGridView();
          setInitialScrollDeltaY(null);
        }
      }
    },
    [
      isSingleImage,
      horizontalTranslation,
      url.length,
      wasPreviouslyScrolling,
      hasScrollingHitBoundary,
      canPerformGestureFlip,
      initialScrollDeltaY,
      enableGridView,
      goToPage,
    ],
  );

  const handleFlipStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isSingleImage) return;

      if ("touches" in e) {
        if (e.touches.length === 1) {
          setTouchInitialX(e.touches[0].clientX);
          setTouchInitialShift(horizontalTranslation);
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          setInitialPinchDistance(Math.sqrt(dx * dx + dy * dy));
        }
      } else {
        setTouchInitialX(e.clientX);
        setTouchInitialShift(horizontalTranslation);
      }
    },
    [isSingleImage, horizontalTranslation],
  );

  const handleFlipMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (isSingleImage || !imageContainerRef.current) return;

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
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (initialPinchDistance - currentDistance > 30) {
          enableGridView();
          setInitialPinchDistance(null);
        }
      } else if (
        (isSingleTouch || isMouseEvent) &&
        isTouchInitialsSet &&
        canPerformGestureFlip
      ) {
        const clientX = isMouseEvent ? e.clientX : e.touches[0].clientX;
        const deltaX =
          ((clientX - touchInitialX) / imageContainerRef.current.clientWidth) *
          100;

        if ((isAtStart && deltaX >= 0) || (isAtEnd && deltaX <= 0)) return;

        const newTranslateX = Math.max(
          0,
          Math.min(100 * (url.length - 1), -touchInitialShift - deltaX),
        );
        setHorizontalTranslation(-newTranslateX);
        setCurrentPage(Math.round(newTranslateX / 100));
        setDescriptionVisible(false);
        setPageFlipGridViewFlag(false);
      }
    },
    [
      isSingleImage,
      touchInitialX,
      touchInitialShift,
      horizontalTranslation,
      url.length,
      initialPinchDistance,
      canPerformGestureFlip,
      enableGridView,
    ],
  );

  const handleFlipEnd = useCallback(() => {
    if (isSingleImage) return;
    setTouchInitialShift(null);
    setTouchInitialX(null);
    if (!isGridView) goToPage(Math.round(-horizontalTranslation / 100), 0.15);
  }, [isSingleImage, isGridView, horizontalTranslation, goToPage]);

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
    const container = imageContainerRef.current;
    if (!container || isGridView || disableGestures) return;

    container.addEventListener("wheel", handleScroll, { passive: false });
    container.addEventListener("dblclick", openPopUp, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleScroll);
      container.removeEventListener("dblclick", openPopUp);
    };
  }, [isGridView, disableGestures, handleScroll, openPopUp]);

  const currentDescription = (actualDescriptions?.[currentPage] || "").trim();

  useEffect(() => {
    if (!currentDescription || isGridView) {
      setHideDescription(false);
    }
  }, [currentDescription, isGridView]);

  useEffect(() => {
    if (!_.isEqual(prevUrlRef.current, url)) {
      prevUrlRef.current = url;
      if (isGridView) turnOffGridView(0);
      goToPage(0);
    }
  }, [url, isGridView, turnOffGridView, goToPage]);

  return (
    <figure
      className={`${defaultDimension ? "w-full" : ""} relative ${className}`}
      style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden z-0 ${
          !isSingleImage && !isGridView ? "touch-pan-y" : ""
        } ${isGridView ? "" : "rounded-3xl"} transition-[border-radius] duration-200 ease-out`}
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
              style={{ transform: `translateX(${index * 100}%)` }}
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
                  Math.round((2500 / widthRatio) * heightRatio),
                )}
                width={Math.min(
                  2500,
                  Math.round((2500 / heightRatio) * widthRatio),
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
            <button
              className="mr-3"
              onClick={() => setHideDescription((prev) => !prev)}
            >
              <ShowSubtitleIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
            </button>
          )}

          {!isSingleImage && (
            <button className="mr-3" onClick={enableGridView}>
              <GridViewIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
            </button>
          )}
          <button onClick={openPopUp}>
            <MagnifyingGlassIcon className="h-6 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
          </button>
        </div>
      )}

      {leftButtonVisible && !isGridView && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2"
          onClick={() => goToPreviousPage()}
        >
          <ColoredArrowIcon className="h-6 w-auto opacity-80 transition-transform duration-300 hover:scale-110" />
        </button>
      )}

      {rightButtonVisible && !isGridView && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => goToNextPage()}
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
