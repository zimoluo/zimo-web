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
import WindowIFrame from "./widget/WindowIFrame";
import PhotosWindowFrame from "./photos/PhotosWindowFrame";
import ProjectsWindowFrame from "./projects/ProjectsWindowFrame";
import CommandKeyIcon from "../assets/entries/CommandKeyIcon";
import ThemeMakerWindowToolset from "./widget/ThemeMakerWindowToolset";
import CogIcon from "../assets/toast/CogIcon";
import MenuEntriesSettings from "../mainPage/menu/MenuEntriesSettings";
import NotebookIcon from "../assets/entries/NotebookIcon";
import WindowNotebook from "./widget/WindowNotebook";
import NavigatorIcon from "../assets/entries/NavigatorIcon";
import MenuEntriesNavigation from "../mainPage/menu/MenuEntriesNavigation";
import { menuNavigationItems } from "../mainPage/menu/MenuEntriesLayout";
import aboutConfig from "../theme/config/about";
import WikipediaLogo from "../assets/WikipediaLogo";
import CalculatorWidget from "./widget/CalculatorWidget";
import CalculatorIcon from "../assets/entries/CalculatorIcon";
import DashSquircleIcon from "../assets/entries/DashSquircleIcon";
import SignalGeneratorWindow from "./widget/SignalGeneratorWindow";
import SignalIcon from "../assets/entries/SignalIcon";
import WindowDebugger from "./widget/WindowDebugger";
import DebuggerIcon from "../assets/entries/DebuggerIcon";
import StickyNotesIcon from "../assets/entries/StickyNotesIcon";
import StickyNotesWidget from "./widget/StickyNotesWidget";

interface Props {
  entry: WindowPickerEntry;
}

export const windowEntryMap: Record<
  WindowPickerEntry,
  {
    icon: typeof BlogIcon;
    title: string;
    window: PartialBy<WindowData, "uniqueId">;
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
      maxHeight: 920,
      tags: [
        "requireEntrySettings",
        "requireBlogSettings",
        "requireTableOfContentsSettings",
      ],
    },
  },
  projects: {
    icon: ProjectsIcon,
    title: "Projects Entry",
    window: {
      content: <ProjectsWindowFrame />,
      defaultHeight: 460,
      defaultWidth: 720,
      minWidth: 700,
      minHeight: 280,
      maxWidth: 1200,
      minAspectRatio: 1.45,
      tags: ["requireEntrySettings"],
    },
  },
  photos: {
    icon: PhotosIcon,
    title: "Album Post",
    window: {
      content: <PhotosWindowFrame />,
      defaultHeight: 420,
      defaultWidth: 630,
      minWidth: 580,
      minHeight: 410,
      maxWidth: 980,
      minAspectRatio: 1.4,
      tags: ["requireEntrySettings"],
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
      maxHeight: 920,
      tags: ["requireEntrySettings", "requireTableOfContentsSettings"],
    },
  },
  faviconWidget: {
    icon: OutlineFavicon,
    title: "Favicon",
    window: {
      content: <WindowWidgetFavicon />,
      defaultHeight: 128,
      defaultWidth: 128,
      minWidth: 128,
      maxWidth: 196,
      minAspectRatio: 1,
      maxAspectRatio: 1,
      disableBlur: true,
      cornerRadius: 9999,
      allowOverflow: true,
    },
  },
  zimoWebInWindow: {
    icon: ({ className }) => (
      <DisplayFavicon customThemeConfig={aboutConfig} className={className} />
    ),
    title: "Window Web",
    window: {
      content: <WindowIFrame url="https://www.zimoluo.me/" zoom={0.83} />,
      defaultWidth: 340,
      defaultHeight: 480,
      minWidth: 320,
      minHeight: 350,
      maxWidth: 635,
      maxHeight: 1200,
      contextKey: "iframe-zimo-web",
    },
  },
  themeMakerToolset: {
    icon: CommandKeyIcon,
    title: "Theme Maker",
    window: {
      content: <ThemeMakerWindowToolset />,
      defaultHeight: 500,
      defaultWidth: 952,
      minWidth: 636,
      maxWidth: 3200,
      minHeight: 368,
      maxHeight: 2000,
      contextKey: "theme-maker-toolset-window",
      tags: ["requireThemeMakerSettings"],
    },
  },
  settingsPanel: {
    icon: CogIcon,
    title: "Settings Panel",
    window: {
      content: (
        <div className="w-full h-full bg-widget-60 px-4 pt-4 overflow-y-auto">
          <MenuEntriesSettings />
        </div>
      ),
      defaultHeight: 500,
      defaultWidth: 500,
      minHeight: 300,
      maxHeight: 900,
      minWidth: 320,
      maxWidth: 800,
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
  navigator: {
    icon: NavigatorIcon,
    title: "Navigator",
    window: {
      content: (
        <div className="w-full h-full bg-widget-80 px-8 py-8 text-xl grid grid-cols-1 gap-4 overflow-y-auto">
          {menuNavigationItems.map((item, index) => (
            <MenuEntriesNavigation
              key={item}
              item={item as NavigationKey}
              hasBorder={index !== menuNavigationItems.length - 1}
            />
          ))}
        </div>
      ),
      defaultHeight: 500,
      defaultWidth: 400,
      minHeight: 300,
      maxHeight: 616,
      minWidth: 400,
      maxWidth: 592,
    },
  },
  wikipedia: {
    icon: WikipediaLogo,
    title: "Wikipedia",
    window: {
      content: (
        <WindowIFrame
          url="https://en.wikipedia.org/wiki/Main_Page"
          zoom={0.83}
        />
      ),
      defaultWidth: 640,
      defaultHeight: 432,
      minWidth: 350,
      minHeight: 400,
      maxWidth: 1350,
      maxHeight: 1024,
      contextKey: "iframe-wikipedia",
    },
  },
  calculator: {
    icon: CalculatorIcon,
    title: "Calculator",
    window: {
      content: <CalculatorWidget />,
      defaultHeight: 450,
      defaultWidth: 248,
      minWidth: 248,
      minHeight: 420,
      maxWidth: 1024,
      maxHeight: 480,
      tags: ["requireCalculatorSettings"],
    },
  },
  blank: {
    icon: DashSquircleIcon,
    title: "Blank",
    window: {
      content: <div className="w-full h-full bg-widget-80" />,
      defaultHeight: 360,
      defaultWidth: 360,
      minWidth: 128,
      minHeight: 128,
      maxWidth: 2400,
      maxHeight: 2400,
    },
  },
  signalGenerator: {
    icon: SignalIcon,
    title: "Signal Generator",
    window: {
      content: <SignalGeneratorWindow />,
      defaultHeight: 340,
      defaultWidth: 480,
      minWidth: 450,
      minHeight: 300,
      maxHeight: 460,
      maxWidth: 800,
    },
  },
  debugger: {
    icon: DebuggerIcon,
    title: "Debugger",
    window: {
      content: <WindowDebugger />,
      defaultHeight: 420,
      defaultWidth: 600,
      minWidth: 560,
      minHeight: 380,
      maxWidth: 1200,
      maxHeight: 1200,
      requireAllDataSaved: true,
    },
  },
  stickyNotes: {
    icon: StickyNotesIcon,
    title: "Sticky Notes",
    window: {
      content: <StickyNotesWidget />,
      defaultWidth: 280,
      defaultHeight: 280,
      minWidth: 200,
      minHeight: 200,
      maxWidth: 520,
      maxHeight: 520,
      cornerRadius: 0.25,
      layer: 1,
      countsToLimit: false,
      enableEdgeHighlight: true,
    },
  },
};

export default function WindowPickerEntry({ entry }: Props) {
  const { appendWindow, windows, setActiveWindowByContextKey } = useWindow();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { icon: Icon, title, window } = windowEntryMap[entry] || {};
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
              countsToLimit: window.countsToLimit ?? true,
              saveComponentKey: entry,
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
