import { permanentRedirect } from "next/navigation";
export default async function Page({ params }: { readonly params: Promise<{ slug: string }> }) { permanentRedirect(`/album/${encodeURIComponent((await params).slug)}`); }
