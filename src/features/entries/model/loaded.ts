import type { Entry } from "./types";
import type { ParsedDocument } from "../../document/model/types";
export type LoadedEntry = Entry & { readonly parsed: ParsedDocument | null };
