import { ReactNode } from "react";
import readingLayoutStyle from "./reading-layout.module.css";

interface Props {
  children?: ReactNode;
}

export default function ReadingLayout({ children }: Props) {
  return (
    <div className="flex justify-center items-center">
      <article
        className={`relative mt-[68px] sm:mt-[72px] md:mt-[78px] mb-4 md:mb-20 md:mx-8 px-6 bg-widget-90 ${readingLayoutStyle.sizing} md:px-14 pb-12 pt-16 rounded-b-[2rem] md:rounded-[2rem] md:shadow-xl`}
      >
        {children}
      </article>
    </div>
  );
}
