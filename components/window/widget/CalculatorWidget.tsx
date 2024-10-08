import { ReactNode, useState } from "react";
import calculatorStyle from "./calculator.module.css";

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

export default function CalculatorWidget() {
  const [expression, setExpression] = useState<string[]>([]);
  const [isDegree, setIsDegree] = useState(true);
  const [isVarMode, setIsVarMode] = useState(false);

  const displayMap: { [key: string]: string } = {
    "*": "×",
    "/": "÷",
    "Math.sqrt(": "√(",
    "Math.sin(": "sin(",
    "Math.cos(": "cos(",
    "Math.log(": "ln(",
    "Math.exp(": "exp(",
    "Math.PI": "π",
    "Math.E": "e",
  };

  const handleButtonClick = (value: string) => {
    if (validateExpression([...expression, value])) {
      setExpression((prev) => [...prev, value]);
    }
  };

  const handleClear = () => {
    setExpression([]);
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
    const exprString = expression.join("");
    try {
      const result = parseExpression(exprString);
      setExpression([result.toString()]);
    } catch (error) {
      setExpression(["Error"]);
    }
  };

  const validateExpression = (newExpr: string[]) => {
    const lastChar = newExpr[newExpr.length - 1];
    const secondLastChar = newExpr[newExpr.length - 2];

    if (isOperator(lastChar) && isOperator(secondLastChar)) {
      return false;
    }

    if (lastChar === "." && secondLastChar?.includes(".")) {
      return false;
    }

    return true;
  };

  const parseExpression = (expr: string) => {
    return Function(`'use strict'; return (${expr})`)();
  };

  const isOperator = (char: string) => ["+", "-", "*", "/"].includes(char);

  const getDisplayExpression = () => {
    return expression
      .map((token) => displayMap[token] || token)
      .join("")
      .replace(/\*\*/g, "^");
  };

  const buttons: CalculatorButton[] = [
    { label: "(", value: "(", tags: ["scientific"] },
    {
      label: (
        <>
          x<sup>2</sup>
        </>
      ),
      value: "**2",
      tags: ["scientific"],
    },
    { label: "e", value: "Math.E", tags: ["scientific"] },
    { label: "exp", value: "Math.exp(", tags: ["scientific"] },
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
      value: "**3",
      tags: ["scientific"],
    },
    { label: "ln", value: "Math.log(", tags: ["scientific"] },
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
      value: isVarMode ? "2**" : "10**",
      tags: ["scientific"],
    },
    { label: "7", value: "7", tags: ["bigFont"] },
    { label: "8", value: "8", tags: ["bigFont"] },
    { label: "9", value: "9", tags: ["bigFont"] },
    { label: "×", value: "*", tags: ["mainOperator", "bigFont"] },
    { label: "1/x", value: "1/", tags: ["scientific"] },
    {
      label: (
        <>
          x<sup>y</sup>
        </>
      ),
      value: "**",
      tags: ["scientific"],
    },
    { label: "π", value: "Math.PI", tags: ["scientific"] },
    {
      label: (
        <>
          log<sub>10</sub>
        </>
      ),
      value: "Math.log(",
      tags: ["scientific"],
    },
    { label: "4", value: "4", tags: ["bigFont"] },
    { label: "5", value: "5", tags: ["bigFont"] },
    { label: "6", value: "6", tags: ["bigFont"] },
    { label: "–", value: "-", tags: ["mainOperator", "bigFont"] },
    { label: "x!", value: "!", tags: ["scientific"] },
    { label: "√", value: "Math.sqrt(", tags: ["scientific"] },
    {
      label: "sin",
      value: isVarMode ? "asin(" : "Math.sin(",
      tags: ["scientific"],
    },
    { label: "EE", value: "e", tags: ["scientific"] },
    { label: "1", value: "1", tags: ["bigFont"] },
    { label: "2", value: "2", tags: ["bigFont"] },
    { label: "3", value: "3", tags: ["bigFont"] },
    { label: "+", value: "+", tags: ["mainOperator", "bigFont"] },
    { label: "Var", onClick: toggleVarMode, tags: ["scientific", "varToggle"] },
    {
      label: "tan",
      value: isVarMode ? "atan(" : "Math.tan(",
      tags: ["scientific"],
    },
    {
      label: "cos",
      value: isVarMode ? "acos(" : "Math.cos(",
      tags: ["scientific"],
    },
    {
      label: isDegree ? "Rad" : "Deg",
      onClick: toggleDegree,
      tags: ["scientific"],
    },
    { label: "Rand", value: "0" },
    { label: "0", value: "0", tags: ["bigFont"] },
    { label: ".", value: "." },
    { label: "=", onClick: evaluateExpression, tags: ["mainOperator"] },
  ];

  return (
    <div className={`w-full h-full bg-widget-80 ${calculatorStyle.container}`}>
      <div className={`w-full h-full p-4 ${calculatorStyle.containerGrid}`}>
        <div className="bg-pastel bg-opacity-75 rounded-2xl p-3 text-3xl flex items-end justify-end w-full overflow-hidden">
          <p className="text-end leading-none overflow-x-auto">
            {expression.length ? getDisplayExpression() : "0"}
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
                  btn.onClick
                    ? btn.onClick
                    : () => handleButtonClick(btn.value || "")
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
