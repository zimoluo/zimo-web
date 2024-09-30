"use client";

import BlogIcon from "../assets/navigation/BlogIcon";
import BlogWindowFrame from "./blog/BlogWindowFrame";
import ProjectsIcon from "../assets/navigation/ProjectsIcon";
import ManagementIcon from "../assets/navigation/ManagementIcon";
import windowPickerStyle from "./window-picker.module.css";
import ManagementWindowFrame from "./management/ManagementWindowFrame";
import PhotosIcon from "../assets/navigation/PhotosIcon";
import { useWindow } from "../contexts/WindowContext";
import { useRef } from "react";
import OutlineFavicon from "../assets/OutlineFavicon";
import WindowWidgetFavicon from "./widget/WindowWidgetFavicon";
import DisplayFavicon from "../assets/DisplayFavicon";
import penumbraConfig from "../theme/config/penumbra";
import WindowIFrame from "./widget/WindowIFrame";
import PhotosWindowFrame from "./photos/PhotosWindowFrame";

interface Props {
  entry: WindowPickerEntry;
}

const entryMap: Record<
  WindowPickerEntry,
  {
    icon: typeof BlogIcon;
    title: string;
    window?: PartialBy<WindowData, "uniqueId">;
  }
> = {
  blog: {
    icon: BlogIcon,
    title: "Blog Article",
    window: {
      content: <BlogWindowFrame />,
      defaultHeight: 580,
      defaultWidth: 440,
      minWidth: 416,
      minHeight: 420,
      maxWidth: 960,
      maxHeight: 760,
    },
  },
  projects: {
    icon: ProjectsIcon,
    title: "Projects Entry",
  },
  photos: {
    icon: PhotosIcon,
    title: "Album Post",
    window: {
      content: <PhotosWindowFrame />,
      defaultHeight: 460,
      defaultWidth: 710,
      minWidth: 670,
      minHeight: 370,
      maxWidth: 980,
      maxHeight: 510,
    },
  },
  management: {
    icon: ManagementIcon,
    title: "Management Article",
    window: {
      content: <ManagementWindowFrame />,
      defaultHeight: 580,
      defaultWidth: 440,
      minWidth: 416,
      minHeight: 420,
      maxWidth: 960,
      maxHeight: 760,
    },
  },
  faviconWidget: {
    icon: OutlineFavicon,
    title: "Favicon",
    window: {
      content: <WindowWidgetFavicon className="bg-widget-40" />,
      defaultHeight: 300,
      defaultWidth: 300,
      minWidth: 200,
      minHeight: 200,
      maxWidth: 600,
      maxHeight: 600,
    },
  },
  themeMakerSPAInWindow: {
    icon: ({ className }) => (
      <DisplayFavicon
        customThemeConfig={penumbraConfig}
        className={className}
      />
    ),
    title: "Theme Maker SPA",
    window: {
      content: (
        <WindowIFrame url="https://zimo-web-theme-maker-spa.s3.us-east-2.amazonaws.com/index.html" />
      ),
      defaultWidth: 768,
      defaultHeight: 520,
      minWidth: 420,
      minHeight: 480,
      maxWidth: 1200,
      maxHeight: 800,
      contextKey: "iframe-theme-maker-spa",
    },
  },
};

export default function WindowPickerEntry({ entry }: Props) {
  const { appendWindow } = useWindow();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { icon: Icon, title, window } = entryMap[entry] || {};
  return Icon ? (
    <div className={`${windowPickerStyle.entry}`}>
      <div className="w-full h-full flex items-center justify-center">
        <button
          className="aspect-square h-10 w-auto"
          ref={buttonRef}
          onClick={() => {
            if (!window) {
              return;
            }

            appendWindow({
              ...window,
              defaultCenterX:
                (buttonRef.current?.getBoundingClientRect().left ?? 0) +
                (buttonRef.current?.getBoundingClientRect().width ?? 0) / 2,
              defaultCenterY:
                (buttonRef.current?.getBoundingClientRect().top ?? 0) +
                (buttonRef.current?.getBoundingClientRect().height ?? 0) / 2,
              countsToLimit: true,
            });
          }}
        >
          <Icon className="h-full w-auto aspect-square transition-transform duration-150 ease-out hover:scale-110" />
        </button>
      </div>
      <p>{title}</p>
    </div>
  ) : null;
}
