import { describe, expect, it } from "vitest";
import { parseCalculatorExpression } from "./expression";

describe("scientific calculator behavior", () => {
  it.each([
    ["2+3*4",14], ["(2+3)*4",20], ["2pi",6.2831853],
    ["sqrt(81",9], ["sdn(30)",0.5], ["sin(pi/2)",1],
    ["5!",120], ["3EE2",300], ["50%",0.5],
    ["lg2(8)",3], ["log(e)",1], ["recip(4)",0.25],
  ])("evaluates %s",(expression,result) => expect(parseCalculatorExpression(expression)).toBe(result));
  it("marks an incomplete expression invalid",() => expect(Number.isNaN(parseCalculatorExpression("2+"))).toBe(true));
});
