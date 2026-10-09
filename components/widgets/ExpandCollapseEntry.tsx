import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import type { ReactNode } from "react";
import UpDownSwitchIcon from "@/src/ui/icons/entries/UpDownSwitchIcon";
interface Props { title: string; content: ReactNode; className?: string; }
export default function ExpandCollapseEntry({ title, content, className = "" }: Props) {
  return <details className={`group text-base ${className}`}><summary className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-2"><span>{enrichTextContent(title)}</span><UpDownSwitchIcon className="size-6 shrink-0 rotate-180 transition-transform group-open:rotate-0" /></summary><div className="my-4">{content}</div></details>;
}
