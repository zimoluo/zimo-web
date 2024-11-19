"use client";

import React from "react";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useInputParser } from "@/lib/helperHooks";
import { useWindow } from "@/components/contexts/WindowContext";
import debuggerStyle from "./debugger.module.css";

const useNumberInput = (
  key: keyof WindowData,
  required: boolean,
  windowData: WindowData,
  setDataAndSave: (data: Partial<WindowData>) => void
) => {
  const [value, handleChange] = useInputParser({
    value: windowData[key] as number | undefined,
    setValue: (newValue) => setDataAndSave({ [key]: newValue }),
    isValid: (value: string) => value === "" || !isNaN(Number(value)),
    formatValue: (value: string) => (value === "" ? undefined : Number(value)),
  });

  const handleClear = () => {
    if (!required) {
      setDataAndSave({ [key]: undefined });
    }
  };

  return {
    value,
    handleChange,
    handleClear,
    isSet: windowData[key] !== undefined,
  };
};

const useBooleanInput = (
  key: keyof WindowData,
  windowData: WindowData,
  setDataAndSave: (data: Partial<WindowData>) => void
) => {
  const [value, handleChange] = useInputParser({
    value: windowData[key] as boolean | undefined,
    setValue: (newValue) => setDataAndSave({ [key]: newValue }),
    isValid: (value: string) =>
      value === "true" || value === "false" || value === "",
    formatValue: (value: string) =>
      value === "" ? undefined : value === "true",
  });

  return { value, handleChange };
};

const useStateInput = (
  key: keyof WindowState,
  windowState: WindowState,
  setStateAndSave: (state: Partial<WindowState>) => void
) => {
  const [value, handleChange] = useInputParser({
    value: windowState[key],
    setValue: (newValue) => setStateAndSave({ [key]: newValue }),
    isValid: (value: string) => value === "" || !isNaN(Number(value)),
    formatValue: (value: string) => (value === "" ? undefined : Number(value)),
  });

  return { value, handleChange };
};

const NumberInput = ({
  label,
  value,
  onChange,
  onClear,
  required,
  isSet,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  required?: boolean;
  isSet?: boolean;
}) => (
  <div className="mb-2 relative">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={onChange}
        className={`w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
        placeholder={required ? "Required" : "Optional"}
      />
      {!required && isSet && onClear && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-opacity-50 hover:text-opacity-100"
        >
          ×
        </button>
      )}
    </div>
  </div>
);

const BooleanInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="mb-2">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <select
        value={value === undefined ? "" : String(value)}
        onChange={onChange}
        className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80"
      >
        <option value="">Not set</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
  </div>
);

const WindowDebugger = () => {
  const { windowData, windowState, setWindowData, setWindowState } =
    useWindowAction();
  const { saveWindows } = useWindow();

  const setDataAndSave = (newData: Partial<WindowData>) => {
    setWindowData(newData);
    saveWindows();
  };

  const setStateAndSave = (newState: Partial<WindowState>) => {
    setWindowState(newState);
    saveWindows();
  };

  const requiredInputs = {
    defaultHeight: useNumberInput(
      "defaultHeight",
      true,
      windowData,
      setDataAndSave
    ),
    defaultWidth: useNumberInput(
      "defaultWidth",
      true,
      windowData,
      setDataAndSave
    ),
  };

  const optionalInputs = {
    defaultCenterX: useNumberInput(
      "defaultCenterX",
      false,
      windowData,
      setDataAndSave
    ),
    defaultCenterY: useNumberInput(
      "defaultCenterY",
      false,
      windowData,
      setDataAndSave
    ),
    minHeight: useNumberInput("minHeight", false, windowData, setDataAndSave),
    minWidth: useNumberInput("minWidth", false, windowData, setDataAndSave),
    maxHeight: useNumberInput("maxHeight", false, windowData, setDataAndSave),
    maxWidth: useNumberInput("maxWidth", false, windowData, setDataAndSave),
    minAspectRatio: useNumberInput(
      "minAspectRatio",
      false,
      windowData,
      setDataAndSave
    ),
    maxAspectRatio: useNumberInput(
      "maxAspectRatio",
      false,
      windowData,
      setDataAndSave
    ),
    layer: useNumberInput("layer", false, windowData, setDataAndSave),
  };

  const booleanInputs = {
    disableWidthAdjustment: useBooleanInput(
      "disableWidthAdjustment",
      windowData,
      setDataAndSave
    ),
    disableHeightAdjustment: useBooleanInput(
      "disableHeightAdjustment",
      windowData,
      setDataAndSave
    ),
    disableExpandToScreen: useBooleanInput(
      "disableExpandToScreen",
      windowData,
      setDataAndSave
    ),
    allowOverflow: useBooleanInput("allowOverflow", windowData, setDataAndSave),
    disableBlur: useBooleanInput("disableBlur", windowData, setDataAndSave),
    disableShadow: useBooleanInput("disableShadow", windowData, setDataAndSave),
    countsToLimit: useBooleanInput("countsToLimit", windowData, setDataAndSave),
    reducedStartingAnimation: useBooleanInput(
      "reducedStartingAnimation",
      windowData,
      setDataAndSave
    ),
    removeStartingAnimation: useBooleanInput(
      "removeStartingAnimation",
      windowData,
      setDataAndSave
    ),
  };

  const stateInputs = {
    width: useStateInput("width", windowState, setStateAndSave),
    height: useStateInput("height", windowState, setStateAndSave),
    x: useStateInput("x", windowState, setStateAndSave),
    y: useStateInput("y", windowState, setStateAndSave),
  };

  return (
    <div className="w-full h-full bg-widget-80 grid grid-cols-2 gap-4 p-6 overflow-auto">
      <div>
        <h2 className="text-lg font-bold mb-4">Window Data</h2>
        <div className="space-y-4">
          {Object.entries(requiredInputs).map(
            ([key, { value, handleChange, handleClear, isSet }]) => (
              <NumberInput
                key={key}
                label={key}
                value={value}
                onChange={handleChange}
                onClear={handleClear}
                required
                isSet={isSet}
              />
            )
          )}

          {Object.entries(optionalInputs).map(
            ([key, { value, handleChange, handleClear, isSet }]) => (
              <NumberInput
                key={key}
                label={key}
                value={value}
                onChange={handleChange}
                onClear={handleClear}
                isSet={isSet}
              />
            )
          )}

          {Object.entries(booleanInputs).map(
            ([key, { value, handleChange }]) => (
              <BooleanInput
                key={key}
                label={key}
                value={value === undefined ? "" : String(value)}
                onChange={handleChange as any}
              />
            )
          )}

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              uniqueId (read-only)
            </label>
            <input
              type="text"
              value={windowData.uniqueId || "Not set"}
              disabled
              className={`w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 text-saturated ${debuggerStyle.input}`}
            />
          </div>

          {[
            { key: "contextKey" as const, label: "contextKey" },
            { key: "saveComponentKey" as const, label: "saveComponentKey" },
          ].map(({ key, label }) => (
            <div key={key} className="mb-2">
              <label className="block text-sm font-medium mb-1">{label}</label>
              <div className="relative">
                <input
                  type="text"
                  value={windowData[key] || ""}
                  onChange={(e) =>
                    setDataAndSave({ [key]: e.target.value || undefined })
                  }
                  className={`w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
                  placeholder="Optional"
                />
                {windowData[key] && (
                  <button
                    onClick={() => setDataAndSave({ [key]: undefined })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-opacity-50 hover:text-opacity-100"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              tags (comma-separated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={windowData.tags?.join(",") || ""}
                onChange={(e) =>
                  setDataAndSave({
                    tags: e.target.value
                      ? e.target.value.split(",").map((tag) => tag.trim())
                      : undefined,
                  })
                }
                className={`w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
                placeholder="Optional"
              />
              {windowData.tags?.length && (
                <button
                  onClick={() => setDataAndSave({ tags: undefined })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-opacity-50 hover:text-opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Window State</h2>
        <div className="space-y-4">
          {Object.entries(stateInputs).map(([key, { value, handleChange }]) => (
            <NumberInput
              key={key}
              label={key}
              value={value}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Raw Data</h3>
          <div className="p-4 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80">
            <pre className="whitespace-pre-wrap break-all font-mono">
              {JSON.stringify({ windowData, windowState }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowDebugger;
