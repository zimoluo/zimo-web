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

const shuntingYard = (tokens: string[]) => {
  const output: string[] = [];
  const operators: string[] = [];

  tokens.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      output.push(token); // Token is a number
    } else if (token in precedence) {
      while (
        operators.length > 0 &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop() as string);
      }
      operators.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators[operators.length - 1] !== "(") {
        output.push(operators.pop() as string);
      }
      operators.pop(); // Remove '('
    } else if (isFunction(token)) {
      operators.push(token); // Push functions onto the stack
    } else if (token === "%") {
      // Handle % as a postfix operator by directly pushing it into the output
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
      stack.push(parseFloat(token)); // If it's a number, push onto the stack
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
    } else if (token === "EE") {
      // Pop the two numbers and apply EE operation (a * 10^b)
      const exponent = stack.pop() as number;
      const base = stack.pop() as number;
      stack.push(base * Math.pow(10, exponent));
    } else if (token === "%") {
      // Pop the last number and divide by 100
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
  const tokens = tokenize(expr);
  const postfix = shuntingYard(tokens);
  return evaluatePostfix(postfix);
};
