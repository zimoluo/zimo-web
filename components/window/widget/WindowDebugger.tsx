"use client";

import React from "react";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useInputParser } from "@/lib/helperHooks";
import { useWindow } from "@/components/contexts/WindowContext";
import debuggerStyle from "./debugger.module.css";

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

  const isNumber = (value: string) => value === "" || !isNaN(Number(value));
  const isBoolean = (value: string) =>
    value === "true" || value === "false" || value === "";
  const formatNumber = (value: string) =>
    value === "" ? undefined : Number(value);
  const formatBoolean = (value: string) =>
    value === "" ? undefined : value === "true";

  const createNumberInput = (
    key: keyof typeof windowData,
    required = false
  ) => {
    const [value, handleChange] = useInputParser({
      value: windowData[key] as number | undefined,
      setValue: (newValue) => setDataAndSave({ [key]: newValue }),
      isValid: isNumber,
      formatValue: formatNumber,
    });

    const handleClear = () => {
      if (!required) {
        setDataAndSave({ [key]: undefined });
      }
    };

    return (
      <div className="mb-2 relative">
        <label className="block text-sm font-medium mb-1">{key}</label>
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            className={`w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
            placeholder={required ? "Required" : "Optional"}
          />
          {!required && windowData[key] !== undefined && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-saturated text-opacity-50 hover:text-opacity-100"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  };

  const createBooleanInput = (key: keyof typeof windowData) => {
    const [value, handleChange] = useInputParser({
      value: windowData[key] as boolean | undefined,
      setValue: (newValue) => setDataAndSave({ [key]: newValue }),
      isValid: isBoolean,
      formatValue: formatBoolean,
    });

    const handleClear = () => {
      setDataAndSave({ [key]: undefined });
    };

    return (
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">{key}</label>
        <div className="relative">
          <select
            value={value === undefined ? "" : String(value)}
            onChange={handleChange as any}
            className="w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80"
          >
            <option value="">Not set</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
    );
  };

  const createStateInput = (key: keyof typeof windowState) => {
    const [value, handleChange] = useInputParser({
      value: windowState[key],
      setValue: (newValue) => setStateAndSave({ [key]: newValue }),
      isValid: isNumber,
      formatValue: formatNumber,
    });

    return (
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">{key}</label>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className={`w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 ${debuggerStyle.input}`}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-widget-80 grid grid-cols-2 gap-4 p-6 overflow-auto">
      <div>
        <h2 className="text-lg font-bold mb-4">Window Data</h2>
        <div className="space-y-4">
          {createNumberInput("defaultHeight", true)}
          {createNumberInput("defaultWidth", true)}

          {createNumberInput("defaultCenterX")}
          {createNumberInput("defaultCenterY")}
          {createNumberInput("minHeight")}
          {createNumberInput("minWidth")}
          {createNumberInput("maxHeight")}
          {createNumberInput("maxWidth")}
          {createNumberInput("minAspectRatio")}
          {createNumberInput("maxAspectRatio")}
          {createNumberInput("layer")}

          {createBooleanInput("disableWidthAdjustment")}
          {createBooleanInput("disableHeightAdjustment")}
          {createBooleanInput("disableExpandToScreen")}
          {createBooleanInput("allowOverflow")}
          {createBooleanInput("disableBlur")}
          {createBooleanInput("disableShadow")}
          {createBooleanInput("countsToLimit")}
          {createBooleanInput("reducedStartingAnimation")}
          {createBooleanInput("removeStartingAnimation")}

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              uniqueId (read-only)
            </label>
            <input
              type="text"
              value={windowData.uniqueId || "Not set"}
              disabled
              className={`w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 text-saturated ${debuggerStyle.input}`}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">contextKey</label>
            <div className="relative">
              <input
                type="text"
                value={windowData.contextKey || ""}
                onChange={(e) =>
                  setDataAndSave({ contextKey: e.target.value || undefined })
                }
                className={`w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
                placeholder="Optional"
              />
              {windowData.contextKey && (
                <button
                  onClick={() => setDataAndSave({ contextKey: undefined })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-saturated text-opacity-50 hover:text-opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              saveComponentKey
            </label>
            <div className="relative">
              <input
                type="text"
                value={windowData.saveComponentKey || ""}
                onChange={(e) =>
                  setDataAndSave({
                    saveComponentKey: e.target.value || undefined,
                  })
                }
                className={`w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
                placeholder="Optional"
              />
              {windowData.saveComponentKey && (
                <button
                  onClick={() =>
                    setDataAndSave({ saveComponentKey: undefined })
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-saturated text-opacity-50 hover:text-opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          </div>

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
                className={`w-full p-2 appearance-none border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50 ${debuggerStyle.input}`}
                placeholder="Optional"
              />
              {windowData.tags?.length && (
                <button
                  onClick={() => setDataAndSave({ tags: undefined })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-saturated text-opacity-50 hover:text-opacity-100"
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
          {createStateInput("width")}
          {createStateInput("height")}
          {createStateInput("x")}
          {createStateInput("y")}
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
