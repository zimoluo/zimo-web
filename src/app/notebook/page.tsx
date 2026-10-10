import type { Metadata } from "next";
import { NotebookEditor } from "@/src/features/notebook";
export const metadata: Metadata = { title:"Notebook - Zimo Web" };
export default function Page(){return <div className="w-[min(72rem,calc(100%-2rem))] mx-auto mt-18 mb-8 min-h-[34rem] h-auto md:h-[calc(100dvh-9rem)]"><NotebookEditor/></div>;}
