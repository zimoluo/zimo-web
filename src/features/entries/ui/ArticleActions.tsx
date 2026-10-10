"use client";
import { useState } from "react";
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
  const url = `https://www.zimoluo.me${entryPath(entry.section, entry.slug)}`, text = entry.title;
  const services = [
    { label: "Bluesky", icon: BskyLogo, href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text}\n${url}`)}` },
    { label: "X", icon: TwitterLogo, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { label: "Facebook", icon: FacebookLogo, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "Reddit", icon: RedditLogo, href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}` },
    { label: "LinkedIn", icon: LinkedinLogo, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];
  return <details className={styles.actions}>
    <summary className={`${styles.actionTrigger} surface-raised surface-edge`}><GeneralSharingIcon size={23}/><span className="sr-only">Share or download</span></summary>
    <div className={`${styles.actionMenu} surface-raised shadow-lg`}><nav aria-label="Share this entry" className={styles.actionLinks}>
      <button aria-label="Share" title="Share" onClick={async () => { try { if (navigator.share) await navigator.share({ title: text, url }); else { await navigator.clipboard.writeText(url); setStatus("Link copied."); } } catch { setStatus("Sharing was canceled or unavailable."); } }}><GeneralSharingIcon size={23}/></button>
      <button aria-label="Copy link" title="Copy link" onClick={async () => { try { await navigator.clipboard.writeText(url); setStatus("Link copied."); } catch { setStatus("Could not copy this link."); } }}><CopyLinkIcon size={23}/></button>
      {services.map(({ icon: Icon, ...service }) => <a key={service.label} href={service.href} target="_blank" rel="noopener noreferrer" aria-label={service.label} title={service.label}><Icon size={23}/></a>)}
      {entry.body.kind === "document" ? <a aria-label="Download Markdown" title="Download Markdown" href={`${apiEntryPath(entry.section, entry.slug)}/document`} download={`${entry.slug}.md`}><DownloadIcon size={23}/></a> : null}
      {entry.section === "blog" ? <a aria-label="RSS" title="RSS" href="/blog/feed.rss"><RSSIcon size={23}/></a> : null}
    </nav>{status ? <p role="status" className="text-sm p-2">{status}</p> : null}</div>
  </details>;
}
