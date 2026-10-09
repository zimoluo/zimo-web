import type { Metadata } from "next";
import { NotebookEditor } from "@/src/features/notebook";
export const metadata: Metadata = { title:"Notebook - Zimo Web" };
export default function Page(){return <main className="w-[min(80rem,calc(100%-2rem))] mx-auto pt-24 pb-8"><NotebookEditor/></main>;}
