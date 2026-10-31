import ColorBlock from "./ColorBlock";
import styles from "./palette.module.css";

export default function Palette() {
  return <section className={`${styles.page} flex flex-col mb-24`} aria-label="Current theme palette">
    <figure className={`h-3/5 md:h-1/2 ${styles.main}`} aria-label="Interface colors">
      <ColorBlock className="bg-text text-panel">Text</ColorBlock>
      <ColorBlock className="bg-accent text-panel">Accent</ColorBlock>
      <ColorBlock className="bg-fill text-text">Fill</ColorBlock>
      <ColorBlock className="bg-panel text-text">Panel</ColorBlock>
    </figure>
    <figure className={`h-2/5 md:h-1/2 ${styles.other}`} aria-label="Materials">
      <ColorBlock className="surface-widget surface-widget-100 text-text p-6">Widget</ColorBlock>
      <ColorBlock className="relative surface-page text-text p-6">Backdrop</ColorBlock>
    </figure>
  </section>;
}
