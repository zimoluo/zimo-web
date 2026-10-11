
import { SurfaceRim } from "../../../ui/SurfaceRim";
import styles from "./windows.module.css";
import Link from "next/link";
import {destinations} from "../../navigation/commands";
import {iconImageMap} from "../../navigation/icons";
import {routeKey} from "../../../lib/navigation";
export default function Navigator() { return <nav aria-label="Website" className={styles.navigator}>{destinations.map(([title,href])=>{const Icon=iconImageMap[routeKey(href)];return <Link className="surface-raised surface-edge flex min-h-11 items-center gap-3 rounded-full px-4 py-3 shadow-xs transition-transform duration-300 hover:scale-[1.02]" href={href} key={href}><Icon className="size-6 shrink-0"/><span>{title}</span><SurfaceRim /></Link>;})}</nav>; }
