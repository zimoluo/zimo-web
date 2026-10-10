"use client";
import { useMemo } from "react";
import { getTheme, parseColorLiteral, ThemeMark } from "../../theme";
import type { ColorRef, ThemeSource, ThemeSourceController } from "../../theme";

function identityShades(sub: string): (index: number) => string {
  const hue = Math.abs(sub.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) * 137) % 360;
  const hsvChannel = (step: number) => { const k = (step + hue / 60) % 6; return Math.round(255 * (0.8 - 0.8 * 0.68 * Math.max(0, Math.min(k, 4 - k, 1)))); };
  const [red, green, blue] = [hsvChannel(5), hsvChannel(3), hsvChannel(1)].map((channel) => channel / 255) as [number, number, number];
  const maximum = Math.max(red, green, blue), minimum = Math.min(red, green, blue), delta = maximum - minimum;
  const lightness = (maximum + minimum) / 2;
  const saturation = Math.round(100 * delta / (1 - Math.abs(2 * lightness - 1)));
  const sector = maximum === red ? (green - blue) / delta : maximum === green ? 2 + (blue - red) / delta : 4 + (red - green) / delta;
  const h = Math.round((sector * 60 + 360) % 360);
  return (index) => {
    const l = (94 - index * 88 / 31) / 100;
    const s = Math.min(100, Math.max(0, saturation - 6 + 12 * index / 31)) / 100;
    const channel = (offset: number) => { const k = (offset + h / 30) % 12; const a = s * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, "0"); };
    return `#${channel(0)}${channel(8)}${channel(4)}`;
  };
}

export function identityAvatarSource(sub: string): ThemeSource {
  const shade = identityShades(sub);
  const color = (index: number): ColorRef => { const value = shade(index); parseColorLiteral(value); return { kind: "literal", value: value as Extract<ColorRef, { kind: "literal" }>["value"] }; };
  return { ...getTheme("home"), id: `identity-${sub}`, name: "Account avatar", mark: { mode: "split", stroke: color(25), gradients: [{ stops: [{ offset: 0, color: color(16) }, { offset: 1, color: color(3) }] }] } };
}

export function IdentityAvatar({ sub, className }: { readonly sub: string; readonly className: string }) {
  const controller = useMemo<ThemeSourceController>(() => { const source = identityAvatarSource(sub); return { read: () => ({ source, scheme: "light" }), subscribe: () => () => undefined }; }, [sub]);
  return <ThemeMark controller={controller} className={className} title="Account avatar" />;
}
