import { useState, useEffect } from "react";
import calculatorStyle from "./calculator.module.css";

const CalculatorWidget: React.FC = () => {
  const [expression, setExpression] = useState<string[]>([]);
  const [isScientific, setIsScientific] = useState(false);
  const [isDegree, setIsDegree] = useState(true);
  const [isVarMode, setIsVarMode] = useState(false);

  // Container query simulation using window size for scientific mode
  useEffect(() => {
    const handleResize = () => {
      setIsScientific(window.innerWidth >= 400);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Parse and calculate the result
  const calculateResult = () => {
    const exprString = expression.join("");
    try {
      // A simple parser for the expression
      const result = eval(
        exprString.replaceAll("sin", "Math.sin").replaceAll("cos", "Math.cos")
      );
      setExpression([result.toString()]);
    } catch (error) {
      setExpression(["Error"]);
    }
  };

  // Conditionally render scientific or basic buttons
  const renderButtons = () => {
    const basicButtons = [
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "÷", value: "/" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
      { label: "x", value: "*" },
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "-", value: "-" },
      { label: "0", value: "0" },
      { label: ".", value: "." },
      { label: "=", value: "=" },
      { label: "+", value: "+" },
    ];

    const scientificButtons = [
      { label: "sin", value: isVarMode ? "asin(" : "sin(" },
      { label: "cos", value: isVarMode ? "acos(" : "cos(" },
      { label: "tan", value: isVarMode ? "atan(" : "tan(" },
      { label: "x²", value: "**2" },
      { label: "x³", value: "**3" },
      { label: isDegree ? "Rad" : "Deg", value: "", onClick: toggleDegree },
      { label: "π", value: "Math.PI" },
      { label: "e", value: "Math.E" },
      { label: "ln", value: "Math.log(" },
      { label: "√", value: "Math.sqrt(" },
      { label: isVarMode ? "2^x" : "10^x", value: isVarMode ? "2**" : "10**" },
    ];

    return (
      <>
        {basicButtons.map((btn, idx) => (
          <button
            key={idx}
            className="btn"
            onClick={() =>
              btn.value === "="
                ? calculateResult()
                : handleButtonClick(btn.value)
            }
          >
            {btn.label}
          </button>
        ))}

        {isScientific &&
          scientificButtons.map((btn, idx) => (
            <button
              key={idx}
              className="btn"
              onClick={
                btn.onClick ? btn.onClick : () => handleButtonClick(btn.value)
              }
            >
              {btn.label}
            </button>
          ))}
      </>
    );
  };

  return (
    <div className={`w-full h-full p-4 ${calculatorStyle.container}`}>
      <div className="bg-pastel bg-opacity-40 rounded-xl shadow-lg p-4 text-xl flex items-end justify-end">
        <p className="text-end leading-none">
          {expression.length ? expression.join("") : "0"}
        </p>
      </div>
      <div
        className={`grid grid-rows-5 gap-2 ${
          isScientific ? "grid-cols-8" : "grid-cols-4"
        }`}
      >
        <button className="btn" onClick={handleClear}>
          AC
        </button>
        <button className="btn" onClick={handleBackspace}>
          ⌫
        </button>
        <button className="btn" onClick={toggleVarMode}>
          Var
        </button>
        <button className="btn" onClick={() => handleButtonClick("%")}>
          %
        </button>

        {renderButtons()}
      </div>
    </div>
  );
};

export default CalculatorWidget;
