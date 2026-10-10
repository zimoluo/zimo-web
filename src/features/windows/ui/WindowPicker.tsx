"use client";

import { openWindowDefinition } from "../open";
import { windowDefinitions, type KnownWindowId } from "../definitions";
import { ThemeMark } from "../../theme";
import BlogIcon from "../../../ui/icons/navigation/BlogIcon";
import PhotosIcon from "../../../ui/icons/navigation/PhotosIcon";
import ProjectsIcon from "../../../ui/icons/navigation/ProjectsIcon";
import ManagementIcon from "../../../ui/icons/navigation/ManagementIcon";
import CalculatorIcon from "../../../ui/icons/entries/CalculatorIcon";
import StickyNotesIcon from "../../../ui/icons/entries/StickyNotesIcon";
import CommandKeyIcon from "../../../ui/icons/entries/CommandKeyIcon";
import NotebookIcon from "../../../ui/icons/entries/NotebookIcon";
import SignalIcon from "../../../ui/icons/entries/SignalIcon";
import NavigatorIcon from "../../../ui/icons/entries/NavigatorIcon";
import DashSquircleIcon from "../../../ui/icons/entries/DashSquircleIcon";
import DebuggerIcon from "../../../ui/icons/entries/DebuggerIcon";
import WindowIcon from "../../../ui/icons/entries/WindowIcon";
import CogIcon from "../../../ui/icons/toast/CogIcon";
import WikipediaLogo from "../../../ui/icons/WikipediaLogo";
import styles from "./windows.module.css";

const readerProps = { "blog-reader": {section:"blog",slug:""}, "album-entry": {section:"album",slug:""}, "project-entry": {section:"projects",slug:""}, "management-reader": {section:"management",slug:""} };
const sections: readonly { readonly title: string; readonly entries: readonly Exclude<KnownWindowId, "window-picker">[] }[] = [
  { title: "Entries", entries: ["album-entry", "blog-reader", "project-entry", "management-reader"] },
  { title: "Widgets", entries: ["notebook", "studio", "calculator", "sticky-note", "signal-generator", "identity-mark", "navigator", "settings", "web-frame", "wikipedia", "blank", "debugger"] },
];
const icons = { "album-entry": PhotosIcon, "blog-reader": BlogIcon, "project-entry": ProjectsIcon, "management-reader": ManagementIcon, notebook: NotebookIcon, studio: CommandKeyIcon, calculator: CalculatorIcon, "sticky-note": StickyNotesIcon, "signal-generator": SignalIcon, "identity-mark": WindowIcon, navigator: NavigatorIcon, settings: CogIcon, "web-frame": WindowIcon, wikipedia: WikipediaLogo, blank: DashSquircleIcon, debugger: DebuggerIcon };

export default function WindowPicker() {
  return <div className={styles.picker}>{sections.map(({ title, entries }) => <section key={title}>
    <h2>{title}</h2>
    <div className={styles.pickerGrid}>{entries.map((id) => {
      const Icon = icons[id];
      return <button type="button" className={styles.pickerEntry} key={id} onClick={() => openWindowDefinition(id, id in readerProps ? readerProps[id as keyof typeof readerProps] : {})}>
        <span className={styles.pickerIcon} aria-hidden="true">{id === "identity-mark" ? <ThemeMark className="size-full"/> : <Icon className="size-full"/>}</span>
        <span>{windowDefinitions[id].title}</span>
      </button>;
    })}</div>
  </section>)}</div>;
}
