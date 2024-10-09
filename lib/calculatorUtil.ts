const tokenize = (expr: string) => {
  const regex =
    /\d+(\.\d+)?|[+\-*/^()]|sin|cos|tan|log|log10|sqrt|exp|pi|e|EE|%/g;
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

const processImplicitMultiplication = (tokens: string[]) => {
  const result: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    result.push(token);

    if (!isNaN(parseFloat(token)) || token === "pi" || token === "e") {
      if (
        i + 1 < tokens.length &&
        (tokens[i + 1] === "(" || isFunction(tokens[i + 1]))
      ) {
        result.push("*");
      }
    } else if (token === ")" || isFunction(token)) {
      if (
        i + 1 < tokens.length &&
        (!isNaN(parseFloat(tokens[i + 1])) ||
          tokens[i + 1] === "pi" ||
          tokens[i + 1] === "e")
      ) {
        result.push("*");
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
    firstToken === "%"
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

const fixUnmatchedParentheses = (tokens: string[]) => {
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
    ? [...tokens, ...Array(openParentheses).fill(")")]
    : tokens;
};

const shuntingYard = (tokens: string[]) => {
  const output: string[] = [];
  const operators: string[] = [];

  tokens.forEach((token) => {
    if (!isNaN(parseFloat(token)) || token === "pi" || token === "e") {
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
    if (!isNaN(parseFloat(token))) {
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
        case "log":
          stack.push(Math.log(a));
          break;
        case "log10":
          stack.push(Math.log10(a));
          break;
        case "sqrt":
          stack.push(Math.sqrt(a));
          break;
        case "exp":
          stack.push(Math.exp(a));
          break;
      }
    } else if (token === "pi") {
      stack.push(Math.PI);
    } else if (token === "e") {
      stack.push(Math.E);
    } else if (token === "%") {
      const value = stack.pop() as number;
      stack.push(value / 100);
    }
  });

  return stack.pop();
};

const isOperator = (token: string) => {
  return ["+", "-", "*", "/", "^", "EE"].includes(token);
};

const isFunction = (token: string) => {
  return ["sin", "cos", "tan", "log", "log10", "sqrt", "exp"].includes(token);
};

export const parseCalculatorExpression = (expr: string) => {
  let tokens: string[] = tokenize(expr);
  tokens = handleStartingToken(tokens);
  tokens = processUnaryOperators(tokens);
  tokens = processImplicitMultiplication(tokens);
  tokens = fixUnmatchedParentheses(tokens);

  const postfix = shuntingYard(tokens);

  const result = evaluatePostfix(postfix) ?? NaN;

  if (isNaN(result)) {
    return NaN;
  }

  return Math.round(result * 1e7) / 1e7;
};
