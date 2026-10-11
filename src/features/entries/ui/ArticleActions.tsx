"use client";
import { SurfaceRim } from "../../../ui/SurfaceRim";

import { notify } from "../../notifications";
import { useEffect, useRef, useState } from "react";
import type { Entry } from "../model/types";
import { entryPath, apiEntryPath } from "../paths";
import GeneralSharingIcon from "../../../ui/icons/sharing/GeneralSharingIcon";
import CopyLinkIcon from "../../../ui/icons/sharing/copy/CopyLinkIcon";
import DownloadIcon from "../../../ui/icons/sharing/DownloadIcon";
import RSSIcon from "../../../ui/icons/entries/RSSIcon";
import BskyLogo from "../../../ui/icons/sharing/BskyLogo";
import TwitterLogo from "../../../ui/icons/sharing/TwitterLogo";
import FacebookLogo from "../../../ui/icons/sharing/FacebookLogo";
import RedditLogo from "../../../ui/icons/sharing/RedditLogo";
import LinkedinLogo from "../../../ui/icons/sharing/LinkedinLogo";
import styles from "./entries.module.css";

export function ArticleActions({ entry }: { readonly entry: Entry }) {
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url); setStatus("Link copied."); setCopied(true);
      notify({ title: "Link copied", icon: "link", duration: 2000 });
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setStatus("Could not copy this link."); }
  };
  const url = `https://www.zimoluo.me${entryPath(entry.section, entry.slug)}`, text = entry.title;
  const services = [
    { label: "Bluesky", icon: BskyLogo, href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text}\n${url}`)}` },
    { label: "X", icon: TwitterLogo, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { label: "Facebook", icon: FacebookLogo, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "Reddit", icon: RedditLogo, href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}` },
    { label: "LinkedIn", icon: LinkedinLogo, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];
  const links = <nav aria-label="Share this entry" className={styles.actionLinks}>
      <button aria-label="Share" title="Share" onClick={async () => { try { if (navigator.share) await navigator.share({ title: text, url }); else await copy(); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Sharing is unavailable."); } }}><GeneralSharingIcon size={23}/></button>
      <button aria-label="Copy link" title={copied ? "Link copied" : "Copy link"} data-copied={copied || undefined} onClick={copy}><CopyLinkIcon size={23}/><svg className={styles.copyCheck} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6" /></svg></button>
      {services.map(({ icon: Icon, ...service }) => <a key={service.label} href={service.href} target="_blank" rel="noopener noreferrer" aria-label={service.label} title={service.label}><Icon size={23}/></a>)}
      {entry.body.kind === "document" ? <a aria-label="Download Markdown" title="Download Markdown" href={`${apiEntryPath(entry.section, entry.slug)}/document`} download={`${entry.slug}.md`}><DownloadIcon size={23}/></a> : null}
      {entry.section === "blog" ? <a aria-label="RSS" title="RSS" href="/blog/feed.rss"><RSSIcon size={23}/></a> : null}
    </nav>;
  return <div className={styles.actions}>
    <div className={`${styles.actionRail} surface-raised surface-edge shadow-lg`}>{links}<SurfaceRim /></div>
    <details className={styles.actionDisclosure}>
      <summary className={`${styles.actionTrigger} surface-raised surface-edge`}><GeneralSharingIcon size={23}/><span className="sr-only">Share or download</span><SurfaceRim /></summary>
      <div className={`${styles.actionMenu} surface-raised shadow-lg`}>{links}</div>
    </details>
    <p role="status" className="sr-only">{status}</p>
  </div>;
}
