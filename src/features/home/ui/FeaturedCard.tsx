import Link from "next/link";
import Image from "next/image";
import { InlineMarks } from "../../document";
import { entryPath } from "../../entries";
import type { LoadedEntry } from "../../entries";
import { formatAbsolute } from "../../../lib/datetime";
const labels={album:"Album",blog:"Blog",projects:"Projects",management:"Management"};
export function FeaturedCard({entry,className=""}:{readonly entry:LoadedEntry;readonly className?:string}) {
 const asset=entry.cover??entry.images[0];
 return <Link href={entryPath(entry.section,entry.slug)}><div className={`rounded-2xl outline-1 outline-edge/15 shadow-lg bg-panel/65 h-28 md:h-32 ${className}`}><div className="flex gap-4 pt-2 pl-4 pr-2 pb-2 w-full h-full"><div className="grow flex flex-col pt-1 md:pt-1.5 gap-1"><h3 className="text-lg font-bold"><InlineMarks>{entry.title}</InlineMarks></h3>{entry.description?<p className="hidden md:block text-base opacity-90"><InlineMarks>{entry.description}</InlineMarks></p>:null}<div className="grow w-0 pointer-events-none select-none"/><div className="text-sm md:font-bold whitespace-nowrap">{formatAbsolute(entry.updatedAt??entry.publishedAt)} · {labels[entry.section]}</div></div>{asset===undefined?null:<div className="shrink-0 h-full aspect-square rounded-lg bg-fill/50 shadow-sm"><Image src={asset.src} alt={asset.alt} className="w-full h-full object-cover rounded-lg" width={asset.width} height={asset.height} loading="lazy" sizes="128px"/></div>}</div></div></Link>;
}
