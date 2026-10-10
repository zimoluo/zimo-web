import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Comments } from "./Comments";
const fixtures = vi.hoisted(() => ({
  user: { sub: "viewer", name: "Reader", state: "normal", profilePic: null },
  thread: { comments: [{ id: "comment-1", authorSub: "author", body: "An authored comment", createdAt: "2026-01-01T10:00:00Z", likedBy: ["viewer"], replies: [{ id: "reply-1", authorSub: "reader", body: "First reply", createdAt: "2026-01-01T11:00:00Z" }, { id: "reply-2", authorSub: "author", toId: "reply-1", body: "A targeted reply", createdAt: "2026-01-01T12:00:00Z" }] }] },
  like: vi.fn(), reply: vi.fn().mockResolvedValue(true),
}));
vi.mock("../../account", () => ({ useAccount: (select: (state: unknown) => unknown) => select({ user: fixtures.user }), fetchPublicUser: async (sub: string) => ({ sub, name: sub === "author" ? "Author" : "Reader", state: sub === "author" ? "admin" : "normal", profilePic: sub === "author" ? "https://example.com/avatar.png" : null }), setUserState: vi.fn() }));
vi.mock("../../settings", () => ({ useSettings: (select: (state: unknown) => unknown) => select({ comments: { enabled: true } }) }));
vi.mock("../../navigation", () => ({ useNavigationUi: { getState: () => ({ openSideMenu: vi.fn() }) } }));
vi.mock("../../document", () => ({ InlineMarks: ({ children }: { children: string }) => children }));
vi.mock("../actions", () => ({ fetchThread: async () => fixtures.thread, fetchReactions: async () => ({ likedBy: [] }), setEntryReaction: async () => ({ likedBy: ["viewer"] }) }));
vi.mock("../use-thread", () => ({ useCommentThread: () => ({ thread: fixtures.thread, pending: false, error: null, refresh: vi.fn(), post: vi.fn(), like: fixtures.like, reply: fixtures.reply, edit: vi.fn(), remove: vi.fn(), removeReply: vi.fn() }) }));
vi.mock("next/image", () => ({ default: ({ src, alt, ...props }: { src: string; alt: string }) => createElement("img", { ...props, src, alt }) }));
afterEach(() => { vi.clearAllMocks(); vi.unstubAllGlobals(); });
describe("authored comment presentation", () => {
  it("retains profile identity and exposes a nested reply target with accessible reaction controls", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    try {
      await act(async () => root.render(<Comments section="home" slug="messages" />));
      await act(async () => { await vi.waitFor(() => expect(container.textContent).toContain("An authored comment")); });
      expect(container.querySelector('img[src="https://example.com/avatar.png"]')).not.toBeNull();
      expect(container.querySelector('img[alt="User is admin"]')).not.toBeNull();
      expect(container.querySelector('time[datetime="2026-01-01T10:00:00Z"]')).not.toBeNull();
      const like = container.querySelector<HTMLButtonElement>('button[aria-label="Like comment, 1 likes"]')!;
      expect(like.getAttribute("aria-pressed")).toBe("true");
      await act(async () => like.click());
      expect(fixtures.like).toHaveBeenCalledWith("comment-1", false);
      const show = container.querySelector<HTMLButtonElement>('button[aria-label="Show replies"]')!;
      const replies = container.querySelector<HTMLOListElement>(`[id="${show.getAttribute("aria-controls")}"]`)!;
      expect(replies.hidden).toBe(true);
      await act(async () => show.click());
      expect(replies.hidden).toBe(false);
      expect(replies.textContent).toContain("A targeted reply");
      expect(replies.querySelectorAll('time')).toHaveLength(2);
      expect(replies.querySelector('svg')).not.toBeNull();
      expect(container.querySelector('button[aria-label="Hide replies"]')?.getAttribute("aria-expanded")).toBe("true");
    } finally { await act(async () => root.unmount()); container.remove(); }
  });
});
