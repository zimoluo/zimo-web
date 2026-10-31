import type { ReactNode } from "react";

import styles from "./palette.module.css";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function ColorBlock({ className = "", children }: Props) {
  return (
    <div
      className={`flex items-center justify-center text-2xl leading-10 font-bold text-center ${className} group`}
    >
      <p className={styles.colorLabel}>
        {children}
      </p>
    </div>
  );
}
