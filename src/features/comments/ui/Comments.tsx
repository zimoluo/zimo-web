"use client";
import { Composer } from "./Composer";
import { useEffect, useState, useTransition } from "react";
import type { CommentThread, ReactionSet } from "../../entries/model/comment";
import type { CommentId, ReplyId } from "../../entries/model/ids";
import { InlineMarks } from "../../document";
import { useAccount, fetchPublicUser, setUserState } from "../../account";
import { useCommentThread } from "../use-thread";
import { fetchThread, fetchReactions, setEntryReaction } from "../actions";
import { useSettings } from "../../settings";
import { formatAbsolute } from "../../../lib/datetime";

function UserName({ sub, admin }: { readonly sub: string; readonly admin: boolean }) {
  const [user, setUser] = useState<Awaited<ReturnType<typeof fetchPublicUser>> | null>(null);
  const [pending, startTransition] = useTransition();
  const [failed,setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    void fetchPublicUser(sub).then((next) => { if (active) setUser(next); }, () => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [sub]);
  return <span><strong>{user?.name ?? (failed ? "Account unavailable" : "Loading account…")}</strong>{user?.state === "admin" ? " · Admin" : null}{user?.state === "banned" ? " · Banned" : null}{admin && user !== null && user.state !== "admin" ? <button disabled={pending} className="ml-3 underline text-sm" onClick={() => startTransition(async () => { const state = user.state === "banned" ? "normal" : "banned"; await setUserState(sub, state); setUser({ ...user, state }); })}>{user.state === "banned" ? "Unban" : "Ban"}</button> : null}</span>;
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
  const active = user !== null && user.state !== "banned";
  const admin = user?.state === "admin";
  return <section aria-label="Comments"><div className="flex items-center gap-4"><h2 className="font-display text-2xl">Comments</h2><button className="underline" onClick={handle.refresh} disabled={handle.pending}>Refresh</button><button disabled={!active || pending} aria-pressed={user !== null && reaction.likedBy.includes(user.sub)} onClick={() => startTransition(async () => { if (user === null) return; try { setReaction(await setEntryReaction(section, slug, !reaction.likedBy.includes(user.sub))); setReactionError(null); } catch { setReactionError("Could not save your reaction. Try again."); } })}>♥ {reaction.likedBy.length}</button></div>
    {handle.error === null ? null : <p role="alert">{handle.error}</p>}{reactionError === null ? null : <p role="alert">{reactionError}</p>}
    {active ? <Composer label={`Comment as ${user.name}`} disabled={handle.pending} onSubmit={handle.post} /> : <p className="my-4">{user?.state === "banned" ? "Your account cannot post comments. Please contact the administrator." : "Sign in from the menu to comment or like."}</p>}
    <ol className="space-y-4">{handle.thread.comments.map((comment) => <li key={comment.id} className="surface-nested p-4 rounded-2xl"><UserName sub={comment.authorSub} admin={admin && user?.sub !== comment.authorSub} /><time dateTime={comment.createdAt} className="text-sm text-text-muted ml-3">{formatAbsolute(comment.createdAt)}</time>
      {editing === comment.id ? <form onSubmit={async (event) => { event.preventDefault(); if(await handle.edit(comment.id, editBody)) setEditing(null); }}><label>Edit comment<textarea className="w-full block surface-raised p-3" value={editBody} onChange={(event) => setEditBody(event.target.value)} maxLength={4000} /></label><button disabled={handle.pending}>Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></form> : <p className="my-3 whitespace-pre-wrap"><InlineMarks>{comment.body}</InlineMarks>{comment.editedAt === undefined ? null : <small className="ml-2">(edited)</small>}</p>}
      <div className="flex gap-4"><button disabled={!active || handle.pending} aria-pressed={user !== null && comment.likedBy.includes(user.sub)} onClick={() => handle.like(comment.id, user !== null && !comment.likedBy.includes(user.sub))}>♥ {comment.likedBy.length}</button><button disabled={!active} onClick={() => setReplyTarget({ commentId: comment.id })}>Reply</button>{active && (admin || user.sub === comment.authorSub) ? <>{user.sub === comment.authorSub ? <button onClick={() => { setEditing(comment.id); setEditBody(comment.body); }}>Edit</button> : null}<button disabled={handle.pending} onClick={() => handle.remove(comment.id)}>Delete</button></> : null}</div>
      <ol className="pl-4 mt-4 space-y-3">{comment.replies.map((reply) => <li key={reply.id}><UserName sub={reply.authorSub} admin={admin && user?.sub !== reply.authorSub} /><time className="text-sm text-text-muted ml-3" dateTime={reply.createdAt}>{formatAbsolute(reply.createdAt)}</time>{reply.toId === undefined ? null : <p className="text-sm text-text-muted">Replying to <UserName sub={comment.replies.find((candidate) => candidate.id === reply.toId)?.authorSub ?? comment.authorSub} admin={false} /></p>}<p className="whitespace-pre-wrap"><InlineMarks>{reply.body}</InlineMarks></p><button className="mr-4" disabled={!active} onClick={() => setReplyTarget({ commentId: comment.id, toId: reply.id })}>Reply</button>{active && (admin || user.sub === reply.authorSub) ? <button disabled={handle.pending} onClick={() => handle.removeReply(comment.id, reply.id)}>Delete</button> : null}</li>)}</ol>
      {replyTarget?.commentId === comment.id ? <><Composer label="Reply" disabled={!active || handle.pending} onSubmit={async (body) => { const saved=await handle.reply(comment.id, body, replyTarget.toId); if(saved) setReplyTarget(null); return saved; }} /><button onClick={() => setReplyTarget(null)}>Cancel reply</button></> : null}
    </li>)}</ol>{handle.thread.comments.length === 0 ? <p>No comments yet.</p> : null}
  </section>;
}

export function Comments({ section, slug }: { readonly section: string; readonly slug: string }) {
  const enabled = useSettings((settings) => settings.comments.enabled);
  const [initial, setInitial] = useState<{ key:string; thread: CommentThread; reactions: ReactionSet } | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void Promise.all([fetchThread(section, slug), fetchReactions(section, slug)]).then(([thread, reactions]) => { if (active) setInitial({ key:`${section}:${slug}`,thread, reactions }); }, () => { if (active) setErrorKey(`${section}:${slug}`); });
    return () => { active = false; };
  }, [section, slug]);
  if (!enabled || process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true") return null;
  const error=errorKey === `${section}:${slug}`;
  return initial === null || initial.key !== `${section}:${slug}` ? <p role={error ? "alert" : "status"}>{error ? "Could not load comments. Reload to try again." : "Loading comments…"}</p> : <Thread key={`${section}:${slug}`} section={section} slug={slug} initial={initial.thread} reactions={initial.reactions} />;
}
