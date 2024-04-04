"use client";

import masonryStyle from "./masonry.module.css";
import { ReactNode } from "react";
import Masonry from "react-masonry-css";

interface Props {
  children?: ReactNode;
}

const breakpoints = {
  default: 3,
  10974: 36,
  10678: 35,
  10382: 34,
  10086: 33,
  9790: 32,
  9494: 31,
  9198: 30,
  8902: 29,
  8606: 28,
  8310: 27,
  8014: 26,
  7718: 25,
  7422: 24,
  7126: 23,
  6830: 22,
  6534: 21,
  6238: 20,
  5942: 19,
  5646: 18,
  5350: 17,
  5054: 16,
  4758: 15,
  4462: 14,
  4166: 13,
  3870: 12,
  3574: 11,
  3278: 10,
  2982: 9,
  2686: 8,
  2390: 7,
  2094: 6,
  1798: 5,
  1502: 4,
  1206: 3,
  910: 2,
  767: 4,
  720: 3,
  546: 2,
  360: 1,
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
