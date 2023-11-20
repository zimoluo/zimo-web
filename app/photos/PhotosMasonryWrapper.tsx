"use client";

import masonryStyle from "./masonry.module.css";
import { ReactNode } from "react";
import Masonry from "react-masonry-css";

interface Props {
  children?: ReactNode;
}

const breakpoints = {
  default: 3,
  2094: 6,
  1798: 5,
  1490: 4,
  1216: 3,
  910: 2,
  767: 4,
  720: 3,
  528: 2,
  360: 1,
  2390: 7,
  2686: 8,
  2982: 9,
  3278: 10,
  3574: 11,
  3870: 12,
};

export default function PhotosMasonryWrapper({ children }: Props) {
  return (
    <div className="w-full flex items-start justify-center">
      <Masonry
        className={`${masonryStyle["masonry-grid"]} ${masonryStyle["masonry-width"]}`}
        columnClassName={`${masonryStyle["masonry-grid-column"]}`}
        breakpointCols={breakpoints}
      >
        {children}
      </Masonry>
    </div>
  );
}
