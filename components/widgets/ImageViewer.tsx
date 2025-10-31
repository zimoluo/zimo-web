"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import ImagePageIndicator from "./ImagePageIndicator";
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
import { shimmerDataURL } from "@/lib/imageUtil";
import { useDragAndTouch, useSwipe } from "@/lib/helperHooks";
import Link from "next/link";
import { usePopUp } from "../contexts/PopUpContext";
import _ from "lodash";

function imageViewerTextParser(input: ImagesData): ImagesData {
  const { url, text = [], aspectRatio, original = [] } = input;
  const n = url.length;
  const outputText =
    text.length === n
      ? text
      : text.length > n
      ? text.slice(0, n)
      : [...text, ...new Array(n - text.length).fill("")];

  const safeOriginal =
    original && original.length === n
      ? original
      : original && original.length < n
      ? [...original, ...new Array(n - original.length).fill("")]
      : original && original.length > n
      ? original.slice(0, n)
      : new Array(n).fill("");

  return {
    url,
    text: outputText,
    aspectRatio,
    original: safeOriginal,
  };
}

const computeGridDimensions = (numImages: number) => {
  return Math.ceil(Math.sqrt(numImages));
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
  const [hideDescription, setHideDescription] = useState(false);
  const [pageFlipGridViewFlag, setPageFlipGridViewFlag] = useState(true);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
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
  const storedUrlRef = useRef<string[]>(url);

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

  const pendingTranslationRef = useRef<number | null>(null);
  const latestTranslationRef = useRef<number>(horizontalTranslation);

  const updateTranslation = useCallback((val: number) => {
    latestTranslationRef.current = val;
    if (pendingTranslationRef.current !== null) return;
    pendingTranslationRef.current = requestAnimationFrame(() => {
      setHorizontalTranslation(latestTranslationRef.current);
      pendingTranslationRef.current = null;
    });
  }, []);

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

  const openPopUp = useCallback(() => {
    appendPopUp({
      content: (
        <Link
          href={safeOriginal[currentPage] || url[currentPage]}
          target="_blank"
        >
          <Image
            src={safeOriginal[currentPage] || url[currentPage]}
            alt={`${
              restoreDisplayText(currentDescription) || "Zoomed-In Image"
            }`}
            className={`${imageViewerStyle.popupSize} object-contain cursor-zoom-in`}
            height={4000}
            width={4000}
            quality={100}
            unoptimized={true}
            placeholder={`data:image/svg+xml;base64,${shimmerDataURL(
              100,
              100
            )}`}
          />
        </Link>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appendPopUp, currentPage, safeOriginal, url]); // currentDescription referenced below in markup; keep deps conservative

  const leftButtonVisible = currentPage > 0;
  const rightButtonVisible = currentPage < url.length - 1;

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

      if (imageContainerRef.current) {
        updateTranslation(-page * 100);
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
    [isGridView, horizontalTranslation, updateTranslation]
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

  const enableGridView = useCallback(() => {
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
            updateTranslation(0);
            container.style.transform = "translateX(0%)";
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

      // force layout
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
  }, [
    pageFlipGridViewFlag,
    isSingleImage,
    currentPage,
    calculateGridViewTransformStyle,
    updateTranslation,
  ]);

  const turnOffGridView = useCallback(
    (chosenIndex: number) => {
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
                updateTranslation(-index * 100);
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
                setGridView(false);

                node.removeEventListener("transitionend", handleTransitionEnd);
              };

              node.addEventListener("transitionend", handleTransitionEnd);
            }
          }
        });
      }
    },
    [updateTranslation]
  );

  useSwipe({
    left: () => {
      goToPreviousPage(0.15);
    },
    right: () => {
      goToNextPage(0.15);
    },
    subjectRef: imageContainerRef,
  });

  const handleScroll = useCallback(
    (e: WheelEvent): void => {
      if (isSingleImage) {
        return;
      }

      const isAtStart = horizontalTranslation === 0;
      const isAtEnd = horizontalTranslation === -100 * (url.length - 1);
      const deltaX = Math.round(-0.3 * e.deltaX);
      const isScrollingForward = deltaX > 0;
      const isScrollingBackward = deltaX < 0;

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

      if (e.deltaX !== 0) {
        // we need to be able to preventDefault
        e.preventDefault();
        if (!canPerformGestureFlip) {
          return;
        }

        setWasPreviouslyScrolling(true);

        if (
          (isAtStart && isScrollingForward) ||
          (isAtEnd && isScrollingBackward)
        ) {
          setHasScrollingHitBoundary(true);
        }

        if ((isAtStart && deltaX >= 0) || (isAtEnd && deltaX <= 0)) {
          return;
        }

        const newTranslateX = Math.max(
          0,
          Math.min(100 * (url.length - 1), -horizontalTranslation - deltaX)
        );

        // throttle with rAF
        updateTranslation(-newTranslateX);

        const passingPage = Math.round(newTranslateX / 100);

        setCurrentPage(passingPage);
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
      enableGridView,
      goToPage,
      updateTranslation,
      initialScrollDeltaY,
    ]
  );

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
      setTouchInitialX((e as React.MouseEvent).clientX);
      setTouchInitialShift(horizontalTranslation);
    }
  }

  // handleFlipMove can be frequent; keep light and use updateTranslation
  function handleFlipMove(e: TouchEvent | MouseEvent): void {
    if (isSingleImage) {
      return;
    }

    const isTouchEvent = "touches" in e;
    const isMouseEvent = "clientX" in e;
    const isSingleTouch =
      isTouchEvent && (e as TouchEvent).touches.length === 1;
    const isDoubleTouch =
      isTouchEvent && (e as TouchEvent).touches.length === 2;
    const isTouchInitialsSet =
      touchInitialX !== null && touchInitialShift !== null;
    const isAtStart = horizontalTranslation === 0;
    const isAtEnd = horizontalTranslation === -100 * (url.length - 1);

    if (isDoubleTouch && initialPinchDistance !== null) {
      e.preventDefault();
      const t = e as TouchEvent;
      const deltaX = t.touches[0].clientX - t.touches[1].clientX;
      const deltaY = t.touches[0].clientY - t.touches[1].clientY;
      const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (initialPinchDistance - currentDistance > 30) {
        enableGridView();
        setInitialPinchDistance(null);
      }
    } else if (
      (isSingleTouch || isMouseEvent) &&
      isTouchInitialsSet &&
      canPerformGestureFlip &&
      imageContainerRef.current
    ) {
      const clientX = isMouseEvent
        ? (e as MouseEvent).clientX
        : (e as TouchEvent).touches[0].clientX;
      const deltaX =
        ((clientX - (touchInitialX as number)) /
          imageContainerRef.current.clientWidth) *
        100;

      if ((isAtStart && deltaX >= 0) || (isAtEnd && deltaX <= 0)) {
        return;
      }

      const newTranslateX = Math.max(
        0,
        Math.min(
          100 * (url.length - 1),
          -(touchInitialShift as number) - deltaX
        )
      );
      updateTranslation(-newTranslateX);

      const passingPage = Math.round(newTranslateX / 100);

      setDescriptionVisible(false);
      setPageFlipGridViewFlag(false);
      setCurrentPage(passingPage);
    }
  }

  function handleFlipEnd(): void {
    if (isSingleImage) {
      return;
    }

    setTouchInitialShift(null);
    setTouchInitialX(null);
    if (!isGridView) {
      // snap to nearest page
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
    dependencies: [],
  });

  useEffect(() => {
    if (isGridView) {
      return;
    }
    if (disableGestures) {
      return;
    }

    const el = imageContainerRef.current;
    if (el) {
      el.addEventListener("wheel", handleScroll, { passive: false });
      el.addEventListener("dblclick", handleDoubleClick, { passive: true });
    }

    return () => {
      if (el) {
        el.removeEventListener("wheel", handleScroll);
        el.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, [isGridView, disableGestures, handleScroll]); // handleDoubleClick stable via useCallback

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

  // watch url changes - use ref to avoid re-renders
  useEffect(() => {
    if (!_.isEqual(storedUrlRef.current, url)) {
      storedUrlRef.current = url;
      if (isGridView) {
        turnOffGridView(0);
      }
      goToPage(0);
    }
  }, [url, isGridView, goToPage, turnOffGridView]);

  return (
    <figure
      className={`${defaultDimension ? "w-full" : ""} relative ${className}`}
      style={{ aspectRatio: `${widthRatio}/${heightRatio}` }}
      tabIndex={0}
      onKeyDown={(e) => {
        // convert to React.KeyboardEvent shape by dispatching to original handler
        handleKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
      }}
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

  // NOTE: keep original handleKeyDown below to avoid accidental logic change.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
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
  }
}
