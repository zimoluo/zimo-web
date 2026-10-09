import type { Section } from "../../entries";
import { loadEntry } from "../../../server/entries/load";
import { FeaturedCard } from "./FeaturedCard";
export async function FeaturedCardFetcher({section,slug,className=""}:{readonly section:Section;readonly slug:string;readonly className?:string}) {
 return <FeaturedCard entry={await loadEntry(section,slug)} className={className}/>;
}
