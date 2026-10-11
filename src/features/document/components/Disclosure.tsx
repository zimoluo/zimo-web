import { InlineMarks } from "./InlineMarks";
import type { ReactNode } from "react";
import UpDownSwitchIcon from "../../../ui/icons/entries/UpDownSwitchIcon";
interface Props { title: string; content: ReactNode; className?: string; }
export default function ExpandCollapseEntry({ title, content, className = "" }: Props) {
  return <details className={`zw-disclosure group text-base ${className}`}><summary className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-2"><span><InlineMarks>{title}</InlineMarks></span><UpDownSwitchIcon className="size-6 shrink-0 rotate-180 transition-transform duration-300 ease-out group-open:rotate-0" /></summary><div className="my-4">{content}</div></details>;
}
