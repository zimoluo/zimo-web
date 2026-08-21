import type { ResolvedMark } from "../model/resolved-theme";
import {
  MARK_VIEWBOX,
  gradientId,
  gradientVector,
  gradientsFor,
  regionPaths,
  stopVariable,
} from "./geometry";

export type MarkProps = {
  readonly mark: ResolvedMark;
  readonly size?: number | string;
  readonly title?: string;
  readonly className?: string;
};

export function MarkDefs({ mark }: { readonly mark: ResolvedMark }) {
  const gradients = gradientsFor(mark);
  if (gradients.length === 0) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {gradients.map((gradient, region) => (
          <linearGradient key={gradientId(region)} id={gradientId(region)} {...gradientVector(gradient)}>
            {gradient.stops.map((stop, index) => (
              <stop
                key={`${region}-${index}`}
                offset={stop.offset}
                stopColor={`var(${stopVariable(region, index)})`}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

export function Mark({ mark, size = "1em", title, className }: MarkProps) {
  const gradients = gradientsFor(mark);
  const hasFill = gradients.length > 0 && mark.mode !== "outline";
  const strokeWidth = MARK_VIEWBOX * 0.08;

  const labeled = title !== undefined;

  return (
    <svg
      viewBox={`0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}`}
      width={size}
      height={size}
      className={className}
      role={labeled ? "img" : "presentation"}
      aria-hidden={labeled ? undefined : "true"}
      focusable="false"
    >
      {labeled && <title>{title}</title>}

      {mark.mode === "backdrop" ? (
        <foreignObject x="0" y="0" width={MARK_VIEWBOX} height={MARK_VIEWBOX}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundImage: "var(--zw-surface-page-image)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </foreignObject>
      ) : mark.mode === "split" ? (
        regionPaths(mark).map(({ region, d }) => (
          <path key={region} d={d} fill={`url(#${gradientId(region)})`} />
        ))
      ) : hasFill ? (
        <circle
          cx={MARK_VIEWBOX / 2}
          cy={MARK_VIEWBOX / 2}
          r={MARK_VIEWBOX / 2}
          fill={`url(#${gradientId(0)})`}
        />
      ) : null}

      {mark.mode === "outline" && (
        <circle
          cx={MARK_VIEWBOX / 2}
          cy={MARK_VIEWBOX / 2}
          r={MARK_VIEWBOX / 2 - strokeWidth / 2}
          fill="none"
          stroke="var(--zw-mark-stroke)"
          strokeWidth={strokeWidth}
        />
      )}
    </svg>
  );
}
