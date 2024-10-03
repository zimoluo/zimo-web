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
import ProjectsWindowFrame from "./projects/ProjectsWindowFrame";
import CommandKeyIcon from "../assets/entries/CommandKeyIcon";
import ThemeMakerWindowToolset from "./widget/ThemeMakerWindowToolset";
import CogIcon from "../assets/toast/CogIcon";
import MenuEntriesSettings from "../mainPage/menu/MenuEntriesSettings";
import NotebookIcon from "../assets/entries/NotebookIcon";
import WindowNotebook from "./widget/WindowNotebook";

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
    window: {
      content: <ProjectsWindowFrame />,
      defaultHeight: 460,
      defaultWidth: 768,
      minWidth: 760,
      minHeight: 370,
      maxWidth: 980,
      maxHeight: 536,
    },
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
      content: <WindowWidgetFavicon />,
      defaultHeight: 144,
      defaultWidth: 144,
      disableWidthAdjustment: true,
      disableHeightAdjustment: true,
      disableBlur: true,
      disableShadow: true,
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
  themeMakerToolset: {
    icon: ({ className }) => (
      <CommandKeyIcon className={className} strokeWidth={44} />
    ),
    title: "Theme Maker Toolset",
    window: {
      content: <ThemeMakerWindowToolset />,
      defaultHeight: 500,
      defaultWidth: 768,
      minWidth: 624,
      maxWidth: 1200,
      minHeight: 360,
      maxHeight: 900,
      contextKey: "theme-maker-toolset-window",
    },
  },
  settingsPanel: {
    icon: ({ className }) => <CogIcon className={className} strokeWidth={43} />,
    title: "Settings Panel",
    window: {
      content: (
        <div className="w-full h-full bg-widget-80 px-8 py-8 text-xl grid grid-cols-1 gap-4 overflow-y-auto">
          <MenuEntriesSettings />
        </div>
      ),
      defaultHeight: 500,
      defaultWidth: 592,
      minHeight: 300,
      maxHeight: 900,
      disableWidthAdjustment: true,
    },
  },
  notebook: {
    icon: NotebookIcon,
    title: "Notebook",
    window: {
      content: <WindowNotebook />,
      defaultHeight: 460,
      defaultWidth: 560,
      minWidth: 480,
      maxWidth: 1600,
      minHeight: 300,
      maxHeight: 1200,
    },
  },
};

export default function WindowPickerEntry({ entry }: Props) {
  const { appendWindow, windows, setActiveWindowByContextKey } = useWindow();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { icon: Icon, title, window } = entryMap[entry] || {};
  return Icon ? (
    <div className={`${windowPickerStyle.entry}`}>
      <div className="w-full h-full flex items-center justify-center">
        <button
          className="aspect-square h-10 w-auto transition-transform duration-300 ease-out hover:scale-110"
          ref={buttonRef}
          onClick={() => {
            if (!window) {
              return;
            }

            if (
              window.contextKey &&
              windows.some((w) => w.contextKey === window.contextKey)
            ) {
              setActiveWindowByContextKey(window.contextKey);
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
          <Icon className="h-full w-auto aspect-square" />
        </button>
      </div>
      <p>{title}</p>
    </div>
  ) : null;
}
