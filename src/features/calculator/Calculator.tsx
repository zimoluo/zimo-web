"use client";

import { useEffect, useEffectEvent, useState } from "react";
import type { ReactNode } from "react";
import calculatorStyle from "./calculator.module.css";
import {
  getHighlightedDisplayExpression,
  isOperator,
  parseCalculatorExpression,
  preprocessCalculatorTokens,
  tokenizeCalculatorExpression,
} from "./expression";
import { useSettings } from "../settings";
import { useWindowInstance } from "../windows";
import { isStringNumber } from "./expression";


interface CalculatorButton {
  label: ReactNode;
  value?: string;
  onClick?: () => void;
  tags?: (
    | "bigFont"
    | "mainOperator"
    | "secondaryButton"
    | "scientific"
    | "varToggle"
  )[];
}

const tokenDisplayMap: Record<string, string> = {
  "*": "×",
  "-": "−",
  "/": "÷",
  sqrt: "√",
  log: "ln",
  lg10: "log10",
  lg2: "log2",
  exp: "e^",
  asn: "arcsin",
  acs: "arccos",
  atn: "arctan",
  sdn: "sind",
  cds: "cosd",
  tdn: "tand",
  ads: "arcsind",
  adc: "arccosd",
  adt: "arctand",
  pi: "π",
  EE: "E",
  pwr10: "10^",
  pwr2: "2^",
};

interface Props {
  presetHistory?: string;
  presetExpression?: string[];
}

export default function Calculator({
  presetHistory = "",
  presetExpression = [],
}: Props) {
  const [expression, setExpression] = useState<string[]>(presetExpression);
  const [history, setHistory] = useState<string>(presetHistory);
  const [isDegree, setIsDegree] = useState(true);
  const [isVarMode, setIsVarMode] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const appearance = useSettings((state) => state.experiments["calculator-contrast"] ? "contrast" : state.experiments["calculator-border"] ? "border" : "normal");
  const { active, updateProps } = useWindowInstance();


  const validateAndSuggestExpression = (newToken: string): string | null => {
    const currentLastChar = expression[expression.length - 1];

    if (isOperator(newToken) && isOperator(currentLastChar)) {
      return null;
    }

    if (
      newToken === ")" &&
      (expression.length === 0 || (currentLastChar ?? "").endsWith("("))
    ) {
      return null;
    }

    if (
      ["*", "/", "EE", "%"].includes(newToken) &&
      expression.length > 0 &&
      (currentLastChar ?? "").endsWith("(")
    ) {
      return null;
    }

    if (newToken === ".") {
      const lastNonNumber = expression
        .slice()
        .reverse()
        .find((char) => !isStringNumber(char));

      if (lastNonNumber === ".") {
        return null;
      }

      if (!isStringNumber(currentLastChar)) {
        return "0.";
      }
    }

    return newToken;
  };

  const evaluateExpression = () => {
    const exprString = expression.join("") || "0";
    const lastChar = exprString[exprString.length - 1];

    if (isOperator(lastChar)) {
      return;
    }

    if (exprString.endsWith("EE")) {
      return;
    }

    if (lastChar === "(") {
      return;
    }

    const result = parseCalculatorExpression(exprString);

    if (isNaN(result)) {
      setErrorText("Invalid expression");
      return;
    }

    if (!isFinite(result)) {
      setHistory(exprString);
      setErrorText("Infinity");
      return;
    }

    let stringResult = `${result}`;

    if (stringResult.includes("e-")) {
      const [coefficient, exponent] = stringResult.split("e-");
      stringResult = `${coefficient}e+(-${exponent})`;
    }

    const formattedExpression =
      stringResult.replace("e+", "EE").match(/EE|./g) || [];

    updateProps({
      presetExpression: formattedExpression,
      presetHistory: exprString,
    });


    setExpression(formattedExpression);
    setHistory(exprString);
    setErrorText(null);
  };

  const renderDisplayExpression = (): ReactNode[] => {
    if (errorText) {
      return [<span key={"error-text"}>{errorText}</span>];
    }

    const exprString = expression.join("");

    let tokens = getHighlightedDisplayExpression(exprString);
    const isLastCharDot = (expression.at(-1) ?? "").endsWith(".");

    if (isLastCharDot) {
      if ((tokens.at(-1) ?? "").startsWith("{")) {
        let curlyChainIndex = tokens.length - 1;
        for (let i = tokens.length - 1; i >= 0; i--) {
          if ((tokens[i] ?? "").startsWith("{")) {
            curlyChainIndex = i;
          } else {
            break;
          }
        }

        tokens = [
          ...tokens.slice(0, curlyChainIndex),
          ".",
          ...tokens.slice(curlyChainIndex),
        ];
      } else {
        tokens.push(".");
      }
    }

    return tokens.map((token: string, index: number) => {
      const content =
        token.startsWith("{") && token.endsWith("}")
          ? token.slice(1, -1)
          : token;
      return (
        <span
          key={index}
          className={
            token.startsWith("{") ? "text-text/50" : ""
          }
        >
          {tokenDisplayMap[content] || content}
        </span>
      );
    });
  };

  const handleButtonClick = (value: string) => {
    if (errorText) {
      setExpression([value]);
      setErrorText(null);
      return;
    }

    const testExp = validateAndSuggestExpression(value);
    if (testExp !== null) {
      setExpression((prev) => [...prev, testExp]);
    }
  };

  const handleClear = () => {
    setExpression([]);
    setHistory("");
    setErrorText(null);
  };

  const handleBackspace = () => {
    if (errorText) {
      setExpression([]);
      setErrorText(null);
    } else {
      setExpression((prev) => prev.slice(0, -1));
    }
  };

  const toggleVarMode = () => {
    setIsVarMode(!isVarMode);
  };

  const toggleDegree = () => {
    setIsDegree(!isDegree);
  };

  const handleRandClick = () => {
    if (
      expression.length > 0 &&
      (expression.at(-1) ?? "").endsWith(".")
    ) {
      handleButtonClick("0");
      handleButtonClick("*");
    }

    if (isStringNumber(expression[expression.length - 1])) {
      handleButtonClick("*");
    }

    const random = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
    handleButtonClick((random / 4294967296).toFixed(3));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!active) {
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const key = event.key;
    const keyMappings: Record<string, string | (() => void)> = {
      "+": "+",
      "-": "-",
      "*": "*",
      "/": "/",
      "=": evaluateExpression,
      Enter: evaluateExpression,
      "0": "0",
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      Backspace: handleBackspace,

      l: "log(",
      "(": "(",
      ")": ")",
      e: "EE",
      p: "pi",
      "!": "!",
      s: "sqrt(",
      x: "exp(",
      ".": ".",
      "%": "%",
      "^": "^",
      v: toggleVarMode,
    };

    if (key in keyMappings) {
      event.preventDefault();
      const action = keyMappings[key];
      if (typeof action === "string") {
        handleButtonClick(action);
      } else if (typeof action === "function") {
        action();
      }
    }
  };

  const onKeyboard = useEffectEvent(handleKeyDown);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => onKeyboard(event);
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  const buttons: CalculatorButton[] = [
    { label: "(", value: "(", tags: ["scientific"] },
    {
      label: (
        <>
          x<sup>2</sup>
        </>
      ),
      value: "^2",
      tags: ["scientific"],
    },
    { label: "e", value: "e", tags: ["scientific"] },
    {
      label: (
        <>
          e<sup>x</sup>
        </>
      ),
      value: "exp(",
      tags: ["scientific"],
    },
    { label: "⌫", onClick: handleBackspace, tags: ["secondaryButton"] },
    { label: "AC", onClick: handleClear, tags: ["secondaryButton"] },
    { label: "%", value: "%", tags: ["secondaryButton"] },
    { label: "÷", value: "/", tags: ["mainOperator", "bigFont"] },
    { label: ")", value: ")", tags: ["scientific"] },
    {
      label: (
        <>
          x<sup>3</sup>
        </>
      ),
      value: "^3",
      tags: ["scientific"],
    },
    { label: "ln", value: "log(", tags: ["scientific"] },
    {
      label: isVarMode ? (
        <>
          2<sup>x</sup>
        </>
      ) : (
        <>
          10<sup>x</sup>
        </>
      ),
      value: isVarMode ? "pwr2(" : "pwr10(",
      tags: ["scientific"],
    },
    { label: "7", value: "7", tags: ["bigFont"] },
    { label: "8", value: "8", tags: ["bigFont"] },
    { label: "9", value: "9", tags: ["bigFont"] },
    { label: "×", value: "*", tags: ["mainOperator", "bigFont"] },
    { label: "1/x", value: "recip(", tags: ["scientific"] },
    {
      label: (
        <>
          x<sup>y</sup>
        </>
      ),
      value: "^",
      tags: ["scientific"],
    },
    { label: "π", value: "pi", tags: ["scientific"] },
    {
      label: isVarMode ? (
        <>
          log<sub>2</sub>
        </>
      ) : (
        <>
          log<sub>10</sub>
        </>
      ),
      value: isVarMode ? "lg2(" : "lg10(",
      tags: ["scientific"],
    },
    { label: "4", value: "4", tags: ["bigFont"] },
    { label: "5", value: "5", tags: ["bigFont"] },
    { label: "6", value: "6", tags: ["bigFont"] },
    { label: "−", value: "-", tags: ["mainOperator", "bigFont"] },
    { label: "x!", value: "!", tags: ["scientific"] },
    { label: "sqrt", value: "sqrt(", tags: ["scientific"] },
    {
      label: isVarMode ? (
        <>
          sin<sup>-1</sup>
        </>
      ) : (
        "sin"
      ),
      value: isVarMode
        ? isDegree
          ? "ads("
          : "asn("
        : isDegree
        ? "sdn("
        : "sin(",
      tags: ["scientific"],
    },
    { label: "Rand", onClick: handleRandClick, tags: ["scientific"] },
    { label: "1", value: "1", tags: ["bigFont"] },
    { label: "2", value: "2", tags: ["bigFont"] },
    { label: "3", value: "3", tags: ["bigFont"] },
    { label: "+", value: "+", tags: ["mainOperator", "bigFont"] },
    { label: "Alt", onClick: toggleVarMode, tags: ["scientific", "varToggle"] },
    {
      label: isVarMode ? (
        <>
          tan<sup>-1</sup>
        </>
      ) : (
        "tan"
      ),
      value: isVarMode
        ? isDegree
          ? "adt("
          : "atn("
        : isDegree
        ? "tdn("
        : "tan(",
      tags: ["scientific"],
    },
    {
      label: isVarMode ? (
        <>
          cos<sup>-1</sup>
        </>
      ) : (
        "cos"
      ),
      value: isVarMode
        ? isDegree
          ? "adc("
          : "acs("
        : isDegree
        ? "cds("
        : "cos(",
      tags: ["scientific"],
    },
    {
      label: isDegree ? "Rad" : "Deg",
      onClick: toggleDegree,
      tags: ["scientific"],
    },
    { label: "EE", value: "EE" },
    { label: "0", value: "0", tags: ["bigFont"] },
    { label: ".", value: ".", tags: ["bigFont"] },
    {
      label: "=",
      onClick: evaluateExpression,
      tags: ["mainOperator", "bigFont"],
    },
  ];

  return (
    <div
      className={`w-full h-full ${
        appearance === "contrast"
          ? "bg-text/80"
          : "surface-widget surface-widget-80"
      }  ${calculatorStyle.container}`}
    >
      <div
        className={`w-full h-full p-4 ${calculatorStyle.containerGrid} font-tabular`}
      >
        <div
          className={`bg-fill ${
            appearance === "contrast"
              ? ""
              : ""
          } rounded-2xl px-3 pt-1 pb-1 ${
            calculatorStyle.displayGrid
          } items-end justify-end w-full overflow-hidden surface-edge`}
        >
          <div
            className="pointer-events-none select-none w-0 h-0 touch-none"
            aria-hidden="true"
          />
          {history && (
            <p className="text-end/75 overflow-x-auto overflow-y-hidden text-2xl/75 mb-0 text-text-muted/75 whitespace-nowrap">
              {preprocessCalculatorTokens(tokenizeCalculatorExpression(history))
                .map((token) => tokenDisplayMap[token] || token)
                .join("")}
            </p>
          )}
          <p className="text-end text-3xl leading-normal whitespace-nowrap overflow-x-auto overflow-y-hidden">
            {expression.length ? renderDisplayExpression() : "0"}
          </p>
        </div>
        <div className={`${calculatorStyle.buttonGrid} w-full text-base`}>
          {buttons.map((btn, idx) => {
            const tags = btn.tags ?? [];
            return (
              <button
                key={`${String(btn.label)}-${idx}`}
                className={`${calculatorStyle.button}  ${
                  tags.includes("scientific")
                    ? calculatorStyle.scientificButton
                    : ""
                }  ${tags.includes("bigFont") ? "text-xl" : ""}  ${
                  tags.includes("mainOperator")
                    ? calculatorStyle.mainOperator
                    : ""
                }  ${
                  tags.includes("secondaryButton")
                    ? calculatorStyle.secondaryButton
                    : ""
                }  ${
                  tags.includes("varToggle") && isVarMode
                    ? calculatorStyle.varOn
                    : ""
                } h-12 select-none ${calculatorStyle.borderColor}  ${
                  appearance === "border"
                    ? "border-2"
                    : "border-0"
                }  ${
                  appearance === "normal"
                    ? "surface-edge"
                    : ""
                }`}
                onClick={
                  btn.onClick || (() => handleButtonClick(btn.value || ""))
                }
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
