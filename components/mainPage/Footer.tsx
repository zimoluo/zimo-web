import Link from "next/link";
import DisplayFavicon from "../assets/DisplayFavicon";
import footerStyle from "./footer.module.css";

const currentYear = new Date().getFullYear();
const displayYear = currentYear > 2023 ? `2023-${currentYear}` : "2023";

export default function Footer() {
  return (
    <footer className="p-6 bg-widget-40 w-full backdrop-blur-2xl">
      <div className="flex items-center mb-4 text-xl font-bold">
        <DisplayFavicon className="h-8 mr-3 w-auto aspect-square" />
        <div>Zimo Web</div>
      </div>
      <div className={`border-t border-saturated my-4`}></div>
      <div
        className={`grid gap-y-2 gap-x-1 justify-center underline-offset-2 text-center mb-4 ${footerStyle.footer}`}
      >
        <Link href="/">
          <div className="hover:underline cursor-pointer">Home</div>
        </Link>
        <Link href="/photos">
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
        <Link href="/management">
          <div className="hover:underline">Management</div>
        </Link>
      </div>
      <div className="text-center text-sm">
        &copy; {displayYear} Zimo Luo. All Rights Reserved.{" "}
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
    </footer>
  );
}
