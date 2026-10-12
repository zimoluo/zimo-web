import { StudioRoot } from "@/src/features/theme/studio";
import pageStyles from "@/src/ui/utility-page.module.css";
export default function ThemeMakerPage() { return <div className={`${pageStyles.page} ${pageStyles.studio} mx-auto mb-8 w-[calc(100%-2rem)] max-w-[90rem] overflow-hidden rounded-[2rem] shadow-xl`}><StudioRoot /></div>; }
