import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import BlogIcon from "./navigation/BlogIcon";
import StarIcon from "./comment/likeButtons/StarIcon";
import LikeIcon from "./comment/LikeIcon";
import GoogleLogo from "./GoogleLogo";
import MenuIcon from "./entries/MenuIcon";

let root: Root | undefined;
let host: HTMLDivElement | undefined;
afterEach(async () => { if (root !== undefined) await act(async () => root?.unmount()); host?.remove(); root = undefined; host = undefined; });
async function render(element: React.ReactNode): Promise<HTMLDivElement> {
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
  await act(async () => root?.render(element)); return host;
}

describe("shared icon contract", () => {
  it("keeps authored geometry while exposing size, inherited paint and decorative accessibility", async () => {
    const node = await render(<BlogIcon size={22} className="brand-icon" />);
    const svg = node.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("22"); expect(svg?.getAttribute("height")).toBe("22");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 1024 1024"); expect(svg?.getAttribute("class")).toBe("brand-icon");
    expect(svg?.getAttribute("aria-hidden")).toBe("true"); expect(node.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
  });
  it("retains each authored default stroke and allows an explicit override", async () => {
    const node = await render(<StarIcon />);
    expect(node.querySelector("path")?.getAttribute("stroke-width")).toBe("1.4");
    await act(async () => root?.render(<StarIcon strokeWidth={2} />));
    expect(node.querySelector("path")?.getAttribute("stroke-width")).toBe("2");
    expect(node.querySelector("path")?.getAttribute("stroke")).toBe("currentColor");
  });
  it("forwards shared geometry settings through the reaction icon selector", async () => {
    const node = await render(<LikeIcon likeIconType="star" size={18} strokeWidth={2.5} />);
    expect(node.querySelector("svg")?.getAttribute("width")).toBe("18");
    expect(node.querySelector("path")?.getAttribute("stroke-width")).toBe("2.5");
  });
  it("retains recognizable multicolor identity artwork", async () => {
    const node = await render(<GoogleLogo size={28} />);
    expect(node.querySelector("svg")?.getAttribute("width")).toBe("28");
    const colors = new Set([...node.querySelectorAll("path[fill]")].map(path => path.getAttribute("fill")));
    expect(colors.size).toBeGreaterThan(3); expect(colors.has("currentColor")).toBe(false);
  });
  it("preserves the menu active-state geometry without introducing color props", async () => {
    const node = await render(<MenuIcon isActive={false} size={24} />);
    const before = node.innerHTML;
    await act(async () => root?.render(<MenuIcon isActive size={24} />));
    expect(node.innerHTML).not.toBe(before); expect(node.querySelector("svg")?.getAttribute("width")).toBe("24");
  });
});
