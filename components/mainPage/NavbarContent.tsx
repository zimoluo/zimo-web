import DisplayFavicon from "../assets/DisplayFavicon";
import Link from "next/link";
import navbarStyle from "./navbar.module.css";
import { iconImageMap } from "@/lib/constants/iconMaps";
import WindowIcon from "../assets/entries/WindowIcon";

export default function NavbarContent() {
  return (
    <nav className="px-4 w-full flex pt-2.5">
      <Link
        href="/"
        className="mr-4 border-reflect rounded-full h-13 w-13 flex items-center justify-center shadow-lg bg-light/65 backdrop-blur-sm border-reflect-light shrink-0"
      >
        <DisplayFavicon className="h-7 w-7 transition-all duration-300 hover:scale-110" />
      </Link>
      <div className="border-reflect-light bg-light/65 shadow-lg rounded-full h-13 p-2.5 gap-4 flex items-center justify-center shrink-0">
        {["photos", "blog", "projects", "design", "about"].map((src, index) => {
          const IconImage = iconImageMap[src as NavigationKey];
          return (
            <div
              key={index}
              className="group flex items-center rounded-full shrink-0"
            >
              <IconImage className="w-7 h-7" />
              <div className="max-w-0 mr-0 group-hover:max-w-24 transition-[max-width,opacity,margin-right] opacity-0 group-hover:opacity-100 ease-out text-center font-bold text-xl pointer-events-none group-hover:pointer-events-auto duration-300">
                Gallery
              </div>
            </div>
          );
        })}
      </div>

      {/* the dynamic bar is postponed to phase 2. for now this part will be left empty */}
      <div
        className="flex-grow select-none pointer-events-none"
        aria-hidden="true"
      />

      <div className="h-13 w-13 flex items-center justify-center shadow-lg bg-light/65 backdrop-blur-sm rounded-full border-reflect-light mx-4 shrink-0">
        <WindowIcon className="h-7 w-7 transition-all duration-300 hover:scale-110" />
      </div>
      <div
        className="h-13 w-13 select-none pointer-events-none shrink-0"
        aria-hidden="true"
      />
    </nav>
  );
}
