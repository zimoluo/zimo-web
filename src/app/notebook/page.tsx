import type { Metadata } from "next";
import { NotebookEditor } from "@/src/features/notebook";
import pageStyles from "@/src/ui/utility-page.module.css";
export const metadata: Metadata = { title:"Notebook - Zimo Web" };
export default function Page(){return <div className={`${pageStyles.page} ${pageStyles.notebook} w-[min(72rem,calc(100%-2rem))] mx-auto mb-8 min-h-[34rem]`}><NotebookEditor/></div>;}
