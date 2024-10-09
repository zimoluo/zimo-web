import { ReactNode, useState } from "react";
import calculatorStyle from "./calculator.module.css";
import {
  getHighlightedDisplayExpression,
  isOperator,
  parseCalculatorExpression,
  preprocessCalculatorTokens,
  tokenizeCalculatorExpression,
} from "@/lib/calculatorUtil";

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
};

export default function CalculatorWidget() {
  const [expression, setExpression] = useState<string[]>([]);
  const [history, setHistory] = useState<string>("");
  const [isDegree, setIsDegree] = useState(true);
  const [isVarMode, setIsVarMode] = useState(false);

  const handleButtonClick = (value: string) => {
    if (expression.length === 1 && expression[0] === "Invalid expression") {
      setExpression([value]);
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
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const toggleVarMode = () => {
    setIsVarMode(!isVarMode);
  };

  const toggleDegree = () => {
    setIsDegree(!isDegree);
  };

  const evaluateExpression = () => {
    const exprString = expression.join("") || "0";
    const result = parseCalculatorExpression(exprString);

    if (isNaN(result)) {
      setExpression(["Invalid expression"]);
      return;
    }

    setExpression((result.toString() as string).split(""));

    if (result === Infinity) {
      setExpression(["Infinity"]);
    }
    setHistory(exprString);
  };

  const validateAndSuggestExpression = (newToken: string) => {
    const secondLastChar = expression[expression.length - 1];

    if (isOperator(newToken) && isOperator(secondLastChar)) {
      return null;
    }

    if (newToken === ".") {
      const lastNumber = expression
        .slice()
        .reverse()
        .find((char) => isNaN(parseFloat(char)));
      if (lastNumber === ".") {
        return null;
      }
      if (isNaN(parseFloat(secondLastChar))) {
        return "0.";
      }
    }

    return newToken;
  };

  const renderDisplayExpression = (): ReactNode[] => {
    const exprString = expression.join("");

    if (exprString.includes("Infinity")) {
      return ["Infinity"];
    }

    if (exprString.includes("Invalid expression")) {
      return ["Invalid expression"];
    }

    let tokens = getHighlightedDisplayExpression(exprString);
    const isLastCharDot = [".", "0."].includes(
      expression[expression.length - 1]
    );

    if (isLastCharDot) {
      const indexOfLastCurly = tokens.findIndex(
        (token, index) => token.startsWith("{") && index === tokens.length - 1
      );
      if (indexOfLastCurly !== -1) {
        tokens = [
          ...tokens.slice(0, indexOfLastCurly),
          ".",
          ...tokens.slice(indexOfLastCurly),
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
        <span key={index} className={token.startsWith("{") ? "opacity-60" : ""}>
          {tokenDisplayMap[content] || content}
        </span>
      );
    });
  };

  const handleRandClick = () => {
    if (!isNaN(parseFloat(expression[expression.length - 1]))) {
      handleButtonClick("*");
    }
    handleButtonClick(Math.random().toFixed(3));
  };

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
      value: isVarMode ? "2^" : "10^",
      tags: ["scientific"],
    },
    { label: "7", value: "7", tags: ["bigFont"] },
    { label: "8", value: "8", tags: ["bigFont"] },
    { label: "9", value: "9", tags: ["bigFont"] },
    { label: "×", value: "*", tags: ["mainOperator", "bigFont"] },
    { label: "1/x", value: "1/(", tags: ["scientific"] },
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
    { label: "–", value: "-", tags: ["mainOperator", "bigFont"] },
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
    { label: "EE", value: "EE", tags: ["scientific"] },
    { label: "1", value: "1", tags: ["bigFont"] },
    { label: "2", value: "2", tags: ["bigFont"] },
    { label: "3", value: "3", tags: ["bigFont"] },
    { label: "+", value: "+", tags: ["mainOperator", "bigFont"] },
    { label: "Var", onClick: toggleVarMode, tags: ["scientific", "varToggle"] },
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
    { label: "Rand", onClick: handleRandClick },
    { label: "0", value: "0", tags: ["bigFont"] },
    { label: ".", value: "." },
    { label: "=", onClick: evaluateExpression, tags: ["mainOperator"] },
  ];

  return (
    <div className={`w-full h-full bg-widget-80 ${calculatorStyle.container}`}>
      <div
        className={`w-full h-full p-4 ${calculatorStyle.containerGrid} font-tabular`}
      >
        <div
          className={`bg-pastel bg-opacity-75 rounded-2xl px-3 pt-1 pb-1 ${calculatorStyle.displayGrid} items-end justify-end w-full overflow-hidden`}
        >
          <div
            className="pointer-events-none select-none w-0 h-0 touch-none"
            aria-hidden="true"
          />
          {history && (
            <p className="text-end overflow-x-auto overflow-y-hidden text-2xl mb-0 opacity-75 text-saturated">
              {preprocessCalculatorTokens(tokenizeCalculatorExpression(history))
                .map((token) => tokenDisplayMap[token] || token)
                .join("")}
            </p>
          )}
          <p className="text-end text-3xl leading-normal overflow-x-auto overflow-y-hidden">
            {expression.length ? renderDisplayExpression() : "0"}
          </p>
        </div>
        <div className={`${calculatorStyle.buttonGrid} w-full text-base`}>
          {buttons.map((btn, idx) => {
            const tags = btn.tags ?? [];
            return (
              <button
                key={idx}
                className={`${calculatorStyle.button} ${
                  tags.includes("scientific")
                    ? calculatorStyle.scientificButton
                    : ""
                } ${tags.includes("bigFont") ? "text-xl" : ""} ${
                  tags.includes("mainOperator")
                    ? calculatorStyle.mainOperator
                    : ""
                } ${
                  tags.includes("secondaryButton")
                    ? calculatorStyle.secondaryButton
                    : ""
                } ${
                  tags.includes("varToggle") && isVarMode
                    ? calculatorStyle.varOn
                    : ""
                } h-12 select-none`}
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
