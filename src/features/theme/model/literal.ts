import { AppError } from "../../../lib/errors";
import type { ColorLiteral } from "../color";
import { parseColorLiteral } from "../color";

export function literal(value: string): ColorLiteral {
  try {
    parseColorLiteral(value);
  } catch (cause) {
    throw new AppError("invalid-request", `Not a valid color literal: ${value}`, value, {
      cause,
    });
  }
  return value as ColorLiteral;
}
