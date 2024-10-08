import { useState } from "react";
import calculatorStyle from "./calculator.module.css";

interface CalculatorButton {
  label: string;
  value?: string;
  onClick?: () => void;
  willEvaluate?: () => boolean;
  tags?: ("bigFont" | "mainOperator" | "secondaryButton" | "scientific")[];
}

export default function CalculatorWidget() {
  const [expression, setExpression] = useState<string[]>([]);
  const [isDegree, setIsDegree] = useState(true);
  const [isVarMode, setIsVarMode] = useState(false);

  const handleButtonClick = (value: string) => {
    setExpression((prev) => [...prev, value]);
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

  const calculateResult = () => {
    const exprString = expression.join("");
    try {
      const result = eval(
        exprString.replaceAll("sin", "Math.sin").replaceAll("cos", "Math.cos")
      );
      setExpression([result.toString()]);
    } catch (error) {
      setExpression(["Error"]);
    }
  };

  const buttons: CalculatorButton[] = [
    { label: "(", value: "(", tags: ["scientific"] },
    { label: "x²", value: "**2", tags: ["scientific"] },
    { label: "e", value: "Math.E", tags: ["scientific"] },
    { label: "exp", value: "Math.exp(", tags: ["scientific"] },
    { label: "⌫", onClick: handleBackspace, tags: ["secondaryButton"] },
    { label: "AC", onClick: handleClear, tags: ["secondaryButton"] },
    { label: "%", value: "%", tags: ["secondaryButton"] },
    { label: "÷", value: "/", tags: ["mainOperator", "bigFont"] },
    { label: ")", value: ")", tags: ["scientific"] },
    { label: "x³", value: "**3", tags: ["scientific"] },
    { label: "ln", value: "Math.log(", tags: ["scientific"] },
    {
      label: isVarMode ? "2^x" : "10^x",
      value: isVarMode ? "2**" : "10**",
      tags: ["scientific"],
    },
    { label: "7", value: "7", tags: ["bigFont"] },
    { label: "8", value: "8", tags: ["bigFont"] },
    { label: "9", value: "9", tags: ["bigFont"] },
    { label: "×", value: "*", tags: ["mainOperator", "bigFont"] },
    { label: "1/x", value: "", tags: ["scientific"] },
    { label: "x^y", value: "", tags: ["scientific"] },
    { label: "π", value: "Math.PI", tags: ["scientific"] },
    { label: "log10", value: "Math.log(", tags: ["scientific"] },
    { label: "4", value: "4", tags: ["bigFont"] },
    { label: "5", value: "5", tags: ["bigFont"] },
    { label: "6", value: "6", tags: ["bigFont"] },
    { label: "–", value: "-", tags: ["mainOperator", "bigFont"] },
    { label: "x!", value: "", tags: ["scientific"] },
    { label: "√", value: "Math.sqrt(", tags: ["scientific"] },
    { label: "sin", value: isVarMode ? "asin(" : "sin(", tags: ["scientific"] },
    { label: "EE", value: "e", tags: ["scientific"] },
    { label: "1", value: "1", tags: ["bigFont"] },
    { label: "2", value: "2", tags: ["bigFont"] },
    { label: "3", value: "3", tags: ["bigFont"] },
    { label: "+", value: "+", tags: ["mainOperator", "bigFont"] },
    { label: "Var", onClick: toggleVarMode, tags: ["scientific"] },
    { label: "tan", value: isVarMode ? "atan(" : "tan(", tags: ["scientific"] },
    { label: "cos", value: isVarMode ? "acos(" : "cos(", tags: ["scientific"] },
    {
      label: isDegree ? "Rad" : "Deg",
      onClick: toggleDegree,
      tags: ["scientific"],
    },
    { label: "Rand", value: "0" },
    { label: "0", value: "0", tags: ["bigFont"] },
    { label: ".", value: "." },
    { label: "=", onClick: calculateResult, tags: ["mainOperator"] },
  ];

  return (
    <div className={`w-full h-full bg-widget-80 ${calculatorStyle.container}`}>
      <div className={`w-full h-full p-4 ${calculatorStyle.containerGrid}`}>
        <div className="bg-pastel bg-opacity-75 rounded-2xl p-4 text-2xl flex items-end justify-end">
          <p className="text-end leading-none">
            {expression.length ? expression.join("") : "0"}
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
                } h-12`}
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
