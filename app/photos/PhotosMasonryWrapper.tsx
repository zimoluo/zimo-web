"use client";

import masonryStyle from "./masonry.module.css";
import { ReactNode } from "react";
import Masonry from "react-masonry-css";

interface Props {
  children?: ReactNode;
}

const breakpoints = {
  default: 3,
  2000: 6,
  1770: 5,
  1476: 4,
  1240: 3,
  910: 2,
  767: 4,
  720: 3,
  528: 2,
  360: 1,
};

export default function PhotosMasonryWrapper({ children }: Props) {
  return (
    <div className="w-full flex items-start justify-center">
      <Masonry
        className={`${masonryStyle["masonry-grid"]}`}
        columnClassName={`${masonryStyle["masonry-grid-column"]}`}
        breakpointCols={breakpoints}
      >
        {children}
      </Masonry>
    </div>
  );
}
