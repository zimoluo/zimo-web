"use client";

import { openWindowDefinition } from "../open";
import { windowDefinitions, WINDOW_DEFINITION_IDS } from "../definitions";
const readerProps = { "blog-reader": {section:"blog",slug:""}, "album-entry": {section:"album",slug:""}, "project-entry": {section:"projects",slug:""}, "management-reader": {section:"management",slug:""} };
export default function WindowPicker() {
  return <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">{WINDOW_DEFINITION_IDS.filter((id) => id !== "window-picker").map((id) => <button type="button" className="surface-widget min-h-20 rounded-2xl p-3 hover:bg-fill" key={id} onClick={() => openWindowDefinition(id, id in readerProps ? readerProps[id as keyof typeof readerProps] : {})}>{windowDefinitions[id].title}</button>)}</div>;
}
