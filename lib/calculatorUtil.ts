import { factorial, toDegrees, toRadians } from "./calculatorMathHelper";
import { isStringNumber } from "./generalHelper";

export const tokenizeCalculatorExpression = (expr: string) => {
  const regex =
    /\d+(\.\d+)?|[+\-*/^()]|sin|cos|tan|asn|acs|atn|sdn|cds|tdn|ads|adc|adt|log|lg10|lg2|sqrt|recip|pwr10|pwr2|exp|pi|e|EE|%|!/g;
  return expr.match(regex) || [];
};

const precedence: { [key: string]: number } = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
  EE: 4,
};

const processConstantNumberMultiplication = (
  tokens: string[],
  highlight: boolean = false
) => {
  const result: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    result.push(token);

    if (token === "pi" || token === "e") {
      if (
        i + 1 < tokens.length &&
        (isStringNumber(tokens[i + 1]) ||
          tokens[i + 1] === "pi" ||
          tokens[i + 1] === "e")
      ) {
        result.push(highlight ? "{*}" : "*");
      }
    } else if (isStringNumber(token)) {
      if (
        i + 1 < tokens.length &&
        (tokens[i + 1] === "pi" || tokens[i + 1] === "e")
      ) {
        result.push(highlight ? "{*}" : "*");
      }
    }
  }
  return result;
};

const processImplicitMultiplication = (
  tokens: string[],
  highlight: boolean = false
) => {
  const result: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    result.push(token);

    if (isStringNumber(token) || token === "pi" || token === "e") {
      if (
        i + 1 < tokens.length &&
        (tokens[i + 1] === "(" || isFunction(tokens[i + 1]))
      ) {
        result.push(highlight ? "{*}" : "*");
      }
    } else if (token === ")") {
      if (
        i + 1 < tokens.length &&
        (isStringNumber(tokens[i + 1]) ||
          tokens[i + 1] === "pi" ||
          tokens[i + 1] === "e" ||
          tokens[i + 1] === "(")
      ) {
        result.push(highlight ? "{*}" : "*");
      }
    }
  }

  return result;
};

const handleStartingToken = (tokens: string[]) => {
  if (tokens.length === 0) return tokens;

  const firstToken = tokens[0];
  if (firstToken === "+" || firstToken === "-") {
    tokens.unshift("0");
  } else if (
    firstToken === "*" ||
    firstToken === "/" ||
    firstToken === "EE" ||
    firstToken === "%" ||
    firstToken === "^" ||
    firstToken === "!"
  ) {
    tokens.unshift("1");
  }

  return tokens;
};

const processUnaryOperators = (tokens: string[]) => {
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (
      (token === "+" || token === "-") &&
      (i === 0 || isOperator(tokens[i - 1]) || tokens[i - 1] === "(")
    ) {
      result.push("0");
    }

    result.push(token);
  }

  return result;
};

const fixUnmatchedParentheses = (
  tokens: string[],
  highlight: boolean = false
) => {
  let openParentheses = 0;

  for (const token of tokens) {
    if (token === "(") {
      openParentheses++;
    } else if (token === ")") {
      if (openParentheses > 0) {
        openParentheses--;
      }
    }
  }

  return openParentheses > 0
    ? [...tokens, ...Array(openParentheses).fill(highlight ? "{)}" : ")")]
    : tokens;
};

const shuntingYard = (tokens: string[]) => {
  const output: string[] = [];
  const operators: string[] = [];

  tokens.forEach((token) => {
    if (isStringNumber(token) || token === "pi" || token === "e") {
      output.push(token);
    } else if (token in precedence) {
      while (
        operators.length > 0 &&
        precedence[operators[operators.length - 1]] >= precedence[token] &&
        operators[operators.length - 1] !== "("
      ) {
        output.push(operators.pop() as string);
      }
      operators.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        output.push(operators.pop() as string);
      }
      operators.pop();

      if (operators.length > 0 && isFunction(operators[operators.length - 1])) {
        output.push(operators.pop() as string);
      }
    } else if (isFunction(token)) {
      operators.push(token);
    } else if (token === "%") {
      output.push("%");
    } else if (token === "!") {
      output.push("!");
    }
  });

  while (operators.length > 0) {
    output.push(operators.pop() as string);
  }

  return output;
};

const evaluatePostfix = (tokens: string[]) => {
  const stack: number[] = [];

  tokens.forEach((token) => {
    if (isStringNumber(token)) {
      stack.push(parseFloat(token));
    } else if (isOperator(token)) {
      const b = stack.pop() as number;
      const a = stack.pop() as number;
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        case "EE":
          stack.push(a * Math.pow(10, b));
          break;
      }
    } else if (isFunction(token)) {
      const a = stack.pop() as number;
      switch (token) {
        case "sin":
          stack.push(Math.sin(a));
          break;
        case "cos":
          stack.push(Math.cos(a));
          break;
        case "tan":
          stack.push(Math.tan(a));
          break;
        case "asn":
          stack.push(Math.asin(a));
          break;
        case "acs":
          stack.push(Math.acos(a));
          break;
        case "atn":
          stack.push(Math.atan(a));
          break;
        case "sdn":
          stack.push(Math.sin(toRadians(a)));
          break;
        case "cds":
          stack.push(Math.cos(toRadians(a)));
          break;
        case "tdn":
          stack.push(Math.tan(toRadians(a)));
          break;
        case "ads":
          stack.push(toDegrees(Math.asin(a)));
          break;
        case "adc":
          stack.push(toDegrees(Math.acos(a)));
          break;
        case "adt":
          stack.push(toDegrees(Math.atan(a)));
          break;
        case "log":
          stack.push(Math.log(a));
          break;
        case "lg10":
          stack.push(Math.log10(a));
          break;
        case "lg2":
          stack.push(Math.log2(a));
          break;
        case "sqrt":
          stack.push(Math.sqrt(a));
          break;
        case "exp":
          stack.push(Math.exp(a));
          break;
        case "recip":
          stack.push(Math.pow(a, -1));
          break;
        case "pwr10":
          stack.push(Math.pow(10, a));
          break;
        case "pwr2":
          stack.push(Math.pow(2, a));
          break;
      }
    } else if (token === "pi") {
      stack.push(Math.PI);
    } else if (token === "e") {
      stack.push(Math.E);
    } else if (token === "%") {
      const value = stack.pop() as number;
      stack.push(value / 100);
    } else if (token === "!") {
      const value = stack.pop() as number;
      stack.push(factorial(value));
    }
  });

  return stack.pop();
};

export const isOperator = (token: string) => {
  return ["+", "-", "*", "/", "^", "EE"].includes(token);
};

const isFunction = (token: string) => {
  return [
    "sin",
    "cos",
    "tan",
    "asn",
    "acs",
    "atn",
    "sdn",
    "cds",
    "tdn",
    "ads",
    "adc",
    "adt",
    "log",
    "lg10",
    "lg2",
    "sqrt",
    "exp",
    "recip",
    "pwr10",
    "pwr2",
  ].includes(token);
};

export const preprocessCalculatorTokens = (tokens: string[]) => {
  return fixUnmatchedParentheses(
    processImplicitMultiplication(
      processConstantNumberMultiplication(
        processUnaryOperators(handleStartingToken(tokens))
      )
    )
  );
};

export const getHighlightedDisplayExpression = (expr: string) => {
  const tokens: string[] = fixUnmatchedParentheses(
    processImplicitMultiplication(
      processConstantNumberMultiplication(
        tokenizeCalculatorExpression(expr),
        true
      ),
      true
    ),
    true
  );

  return tokens;
};

export const parseCalculatorExpression = (expr: string) => {
  const tokens: string[] = preprocessCalculatorTokens(
    tokenizeCalculatorExpression(expr)
  );

  const postfix = shuntingYard(tokens);

  const result = evaluatePostfix(postfix) ?? NaN;

  if (isNaN(result)) {
    return NaN;
  }

  return Math.round(result * 1e7) / 1e7;
};
