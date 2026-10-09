import Link from "next/link";
import { ThemeMark } from "@/src/features/theme";
import footerStyle from "./footer.module.css";

const currentYear = new Date().getFullYear();
const displayYear = currentYear > 2023 ? `2023-${currentYear}` : "2023";

export default function Footer() {
  return (
    <div className="w-full flex justify-center">
      <footer className="pt-2 px-2 bg-fill/35 outline-1 outline outline-edge/15 w-[min(60rem,calc(100vw-1rem))] backdrop-blur-[6px] rounded-t-[2rem] shadow-xl">
        <div className="w-full rounded-t-3xl p-4 surface-widget surface-widget-60 outline outline-edge/15 outline-1">
          <div className="flex items-center mb-4 text-xl font-bold">
            <ThemeMark className="h-8 mr-3 w-auto aspect-square" />
            <div>Zimo Web</div>
          </div>
          <hr className="border-t border-text-muted mb-4"></hr>
          <div
            className={`grid gap-y-2 gap-x-1 justify-center underline-offset-2 text-center mb-4 ${footerStyle.footer}`}
          >
            <Link href="/">
              <div className="hover:underline cursor-pointer">Home</div>
            </Link>
            <Link href="/album">
              <div className="hover:underline">Album</div>
            </Link>
            <Link href="/blog">
              <div className="hover:underline">Blog</div>
            </Link>
            <Link href="/projects">
              <div className="hover:underline">Projects</div>
            </Link>
            <Link href="/about">
              <div className="hover:underline">About</div>
            </Link>
            <Link href="/design">
              <div className="hover:underline">Design</div>
            </Link>
            <Link href="/design/theme-maker">
              <div className="hover:underline">Theme Maker</div>
            </Link>
            <Link href="/notebook">
              <div className="hover:underline">Notebook</div>
            </Link>
            <Link href="/management">
              <div className="hover:underline">Management</div>
            </Link>
          </div>
          <div className="text-center text-sm">
            &copy; <span className="font-tabular">{displayYear}</span> Zimo Luo.
            Version <span className="font-tabular">{process.env.version}</span>.
            All rights reserved.{" "}
            <Link
              href="/management/terms-of-use"
              className="hover:underline underline-offset-2"
            >
              Terms&nbsp;of&nbsp;Use
            </Link>
            {" and "}
            <Link
              href="/management/privacy-policy"
              className="hover:underline underline-offset-2"
            >
              Privacy&nbsp;Policy
            </Link>
            {" apply."} Share feedback{" "}
            <Link
              href="https://forms.gle/hiowUpHKcd5qpx6v8"
              target="_blank"
              className="hover:underline underline-offset-2"
            >
              here
            </Link>
            .
          </div>
        </div>
      </footer>
    </div>
  );
}
