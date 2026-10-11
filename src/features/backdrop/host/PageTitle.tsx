import Image from "./PaletteImage";
import styles from "./page-title.module.css";
export function PageTitle({ variant }: { readonly variant: "home" | "whiteout" }) {
  if (variant === "home") return <div className={styles.home}>
    <div className={styles.desktop}><Image src={{ src: "/theme/animated-background/home/zimo-text.svg", width: 127.275, height: 60.984 }} alt="" style={{ width: "100%", height: "auto", aspectRatio: "127.275 / 60.984" }} /></div>
    <div className={styles.mobile}><Image src={{ src: "/theme/animated-background/home/zimo-text-mobile.svg", width: 84.258, height: 60.984 }} alt="" style={{ width: "100%", height: "auto" }} /></div>
  </div>;
  return <div className={styles.whiteout}><Image src={{ src: "/theme/animated-background/whiteout/zimo-text.svg", width: 313, height: 478 }} alt="" style={{ width: "clamp(16rem, 60svw, 32rem)", aspectRatio: "313 / 478", height: "auto" }} /></div>;
}
