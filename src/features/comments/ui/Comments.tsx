"use client";
import Image from "next/image";
import { Composer } from "./Composer";
import { IdentityAvatar } from "./IdentityAvatar";
import { useEffect, useId, useState, useTransition } from "react";
import type { CommentThread, ReactionSet } from "../../entries/model/comment";
import type { CommentId, ReplyId } from "../../entries/model/ids";
import { InlineMarks } from "../../document";
import { useAccount, fetchPublicUser, setUserState } from "../../account";
import { useCommentThread } from "../use-thread";
import { fetchThread, fetchReactions, setEntryReaction } from "../actions";
import { useSettings } from "../../settings";
import { useNavigationUi } from "../../navigation";
import { formatAbsolute } from "../../../lib/datetime";
import LikeIcon from "../../../ui/icons/comment/LikeIcon";
import ReplyIcon from "../../../ui/icons/comment/ReplyIcon";
import ReplyToIcon from "../../../ui/icons/comment/ReplyToIcon";
import DeleteCommentIcon from "../../../ui/icons/comment/DeleteCommentIcon";
import BanUserIcon from "../../../ui/icons/comment/BanUserIcon";
import UnbanUserIcon from "../../../ui/icons/comment/UnbanUserIcon";
import UpDownSwitchIcon from "../../../ui/icons/entries/UpDownSwitchIcon";
import styles from "./comments.module.css";

type PublicUser = Awaited<ReturnType<typeof fetchPublicUser>>;
function UserName({ sub, admin = false, date, reply = false, target, revision = 0, onModerate }: { readonly sub: string; readonly admin?: boolean; readonly date?: string; readonly reply?: boolean; readonly target?: string | undefined; readonly revision?: number; readonly onModerate?: (() => void) | undefined }) {
  const [record, setRecord] = useState<{ readonly sub: string; readonly user: PublicUser } | null>(null);
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<string | null>(null);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const user = record?.sub === sub ? record.user : null;
  useEffect(() => {
    let active = true;
    void fetchPublicUser(sub).then((next) => { if (active) setRecord({ sub, user: next }); }, () => { if (active) setFailed(sub); });
    return () => { active = false; };
  }, [sub, revision]);
  const name = user?.name ?? (failed === sub ? "Account unavailable" : "Loading account…");
  const identity = <span className={styles.name}>{name}{user !== null && user.state !== "normal" ? <Image src={`/util/user-state/${user.state}.svg`} width={16} height={16} alt={`User is ${user.state}`} className={styles.badge} /> : null}</span>;
  const BanIcon = user?.state === "banned" ? UnbanUserIcon : BanUserIcon;
  if (date === undefined) return admin ? <>{user !== null && user.state !== "admin" ? <button disabled={pending} aria-label={user.state === "banned" ? `Unban ${name}` : `Ban ${name}`} onClick={() => startTransition(async () => { try { const state = user.state === "banned" ? "normal" : "banned"; await setUserState(sub, state); setRecord({ sub, user: { ...user, state } }); setModerationError(null); onModerate?.(); } catch { setModerationError("Could not update this account. Try again."); } })}><BanIcon className={styles.icon ?? ""} /></button> : null}{moderationError === null ? null : <p role="alert">{moderationError}</p>}</> : identity;
  return <div className={`${styles.identity} ${reply ? styles.replyIdentity : ""}`}>
    {user?.profilePic ? <Image src={imageFailed === user.profilePic ? "/util/profile-fallback.svg" : user.profilePic} alt="" width={reply ? 32 : 40} height={reply ? 32 : 40} className={styles.avatar} onError={() => setImageFailed(user.profilePic)} /> : <IdentityAvatar sub={sub} className={styles.avatar ?? ""} />}
    <div className={styles.identityText}><div className={styles.identityLine}>{identity}{target === undefined ? null : <><ReplyToIcon className={styles.targetIcon} /><UserName sub={target} revision={revision} /></>}</div><time dateTime={date}>{formatAbsolute(date)}</time></div>

  </div>;
}

function Thread({ section, slug, initial, reactions }: { readonly section: string; readonly slug: string; readonly initial: CommentThread; readonly reactions: ReactionSet }) {
  const user = useAccount((state) => state.user);
  const handle = useCommentThread({ section, slug, initial, viewerSub: user?.sub ?? null });
  const [reaction, setReaction] = useState(reactions);
  const [pending, startTransition] = useTransition();
  const [reactionError, setReactionError] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ commentId: CommentId; toId?: ReplyId } | null>(null);
  const [editing, setEditing] = useState<CommentId | null>(null);
  const [editBody, setEditBody] = useState("");
  const [expanded, setExpanded] = useState<ReadonlySet<CommentId>>(new Set());
  const replyPrefix = useId();
  const [identityRevision, setIdentityRevision] = useState(0);
  const refreshIdentity = () => setIdentityRevision((previous) => previous + 1);
  const active = user !== null && user.state !== "banned";
  const admin = user?.state === "admin";
  const iconType = (section === "album" || section === "photos") ? "heart" : section === "projects" ? "star" : "generic";
  const entryLiked = user !== null && reaction.likedBy.includes(user.sub);
  return <section aria-label="Comments" className={styles.comments}>
    <div className={styles.heading}><h2 className="sr-only">Comments</h2><button className={styles.refresh} onClick={handle.refresh} disabled={handle.pending}>Refresh</button><button className={styles.entryReaction} disabled={!active || pending} aria-label={`Like entry, ${reaction.likedBy.length} likes`} aria-pressed={entryLiked} onClick={() => startTransition(async () => { if (user === null) return; try { setReaction(await setEntryReaction(section, slug, !reaction.likedBy.includes(user.sub))); setReactionError(null); } catch { setReactionError("Could not save your reaction. Try again."); } })}><LikeIcon likeIconType={iconType} filled={entryLiked} className={styles.entryIcon ?? ""} /><span>{reaction.likedBy.length}</span></button></div>
    {handle.error === null ? null : <p role="alert">{handle.error}</p>}{reactionError === null ? null : <p role="alert">{reactionError}</p>}
    {active ? <Composer label={`Comment as ${user.name}`} disabled={handle.pending} onSubmit={handle.post} /> : <><Composer label="Sign in to comment" disabled onSubmit={async () => false} onSignIn={user === null ? () => useNavigationUi.getState().openSideMenu() : undefined} /><p className={user?.state === "banned" ? styles.signIn : "sr-only"}>{user?.state === "banned" ? "Your account cannot post comments. Please contact the administrator." : "Sign in from the menu to comment or like."}</p></>}
    <ol className={styles.thread}>{handle.thread.comments.map((comment) => {
      const open = expanded.has(comment.id);
      const repliesId = `${replyPrefix}-${comment.id}`;
      const liked = user !== null && comment.likedBy.includes(user.sub);
      return <li key={comment.id} className={styles.comment}>
        <UserName sub={comment.authorSub} date={comment.createdAt} revision={identityRevision} />
        {editing === comment.id ? <form className={styles.edit} onSubmit={async (event) => { event.preventDefault(); if (await handle.edit(comment.id, editBody)) setEditing(null); }}><label>Edit comment<textarea value={editBody} onChange={(event) => setEditBody(event.target.value)} maxLength={4000} /></label><button disabled={handle.pending}>Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></form> : <p className={styles.body}><InlineMarks>{comment.body}</InlineMarks>{comment.editedAt === undefined ? null : <small className={styles.edited}>(edited)</small>}</p>}
        <div className={styles.actions}>{admin && user?.sub !== comment.authorSub ? <UserName sub={comment.authorSub} admin revision={identityRevision} onModerate={refreshIdentity} /> : null}{active && (admin || user.sub === comment.authorSub) ? <>{user.sub === comment.authorSub ? <button onClick={() => { setEditing(comment.id); setEditBody(comment.body); }}>Edit</button> : null}<button disabled={handle.pending} aria-label="Delete comment" onClick={() => handle.remove(comment.id)}><DeleteCommentIcon className={styles.icon ?? ""} /></button></> : null}
          <button disabled={!active || handle.pending} aria-label={`Like comment, ${comment.likedBy.length} likes`} aria-pressed={liked} onClick={() => handle.like(comment.id, user !== null && !comment.likedBy.includes(user.sub))}><LikeIcon likeIconType={iconType} filled={liked} className={styles.icon ?? ""} /><span>{comment.likedBy.length}</span></button>
          <button disabled={!active} aria-label={`Reply to comment, ${comment.replies.length} replies`} onClick={() => setReplyTarget({ commentId: comment.id })}><ReplyIcon className={styles.icon ?? ""} /><span>{comment.replies.length}</span></button>
          {comment.replies.length > 0 ? <button aria-label={open ? "Hide replies" : "Show replies"} aria-expanded={open} aria-controls={repliesId} onClick={() => setExpanded((previous) => { const next = new Set(previous); if (open) next.delete(comment.id); else next.add(comment.id); return next; })}><UpDownSwitchIcon className={`${styles.icon} ${open ? "" : styles.collapsed}`} /></button> : null}
        </div>
        <ol id={repliesId} hidden={!open} className={styles.replies}>{comment.replies.map((reply) => <li key={reply.id} className={styles.reply}>
          <UserName sub={reply.authorSub} date={reply.createdAt} reply revision={identityRevision} target={reply.toId === undefined ? undefined : comment.replies.find((candidate) => candidate.id === reply.toId)?.authorSub ?? comment.authorSub} />
          <p className={styles.replyBody}><InlineMarks>{reply.body}</InlineMarks></p>
          <div className={styles.actions}>{admin && user?.sub !== reply.authorSub ? <UserName sub={reply.authorSub} admin revision={identityRevision} onModerate={refreshIdentity} /> : null}<button disabled={!active} aria-label="Reply to reply" onClick={() => setReplyTarget({ commentId: comment.id, toId: reply.id })}><ReplyIcon className={styles.icon ?? ""} /></button>{active && (admin || user.sub === reply.authorSub) ? <button disabled={handle.pending} aria-label="Delete reply" onClick={() => handle.removeReply(comment.id, reply.id)}><DeleteCommentIcon className={styles.icon ?? ""} /></button> : null}</div>
        </li>)}</ol>
        {replyTarget?.commentId === comment.id ? <div className={styles.replyComposer}><Composer label="Reply" disabled={!active || handle.pending} onSubmit={async (body) => { const saved = await handle.reply(comment.id, body, replyTarget.toId); if (saved) { setReplyTarget(null); setExpanded((previous) => new Set([...previous, comment.id])); } return saved; }} /><button className={styles.cancel} onClick={() => setReplyTarget(null)}>Cancel reply</button></div> : null}
      </li>;
    })}</ol>{handle.thread.comments.length === 0 ? <p>No comments yet.</p> : null}
  </section>;
}

export function Comments({ section, slug }: { readonly section: string; readonly slug: string }) {
  const enabled = useSettings((settings) => settings.comments.enabled);
  const [initial, setInitial] = useState<{ key: string; thread: CommentThread; reactions: ReactionSet } | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void Promise.all([fetchThread(section, slug), fetchReactions(section, slug)]).then(([thread, reactions]) => { if (active) setInitial({ key: `${section}:${slug}`, thread, reactions }); }, () => { if (active) setErrorKey(`${section}:${slug}`); });
    return () => { active = false; };
  }, [section, slug]);
  if (!enabled || process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") return null;
  const error = errorKey === `${section}:${slug}`;
  return initial === null || initial.key !== `${section}:${slug}` ? <p role={error ? "alert" : "status"}>{error ? "Could not load comments. Reload to try again." : "Loading comments…"}</p> : <Thread key={`${section}:${slug}`} section={section} slug={slug} initial={initial.thread} reactions={initial.reactions} />;
}
