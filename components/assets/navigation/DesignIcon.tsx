export default function DesignIcon({
  color = null,
  className = "",
  height,
  width,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      strokeMiterlimit={10}
      style={{
        fillRule: "nonzero",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      viewBox="0 0 657.36 657.36"
      aria-label="Navigate to design page"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={25}
        d="M17.392 142.896c0-69.314 56.19-125.504 125.504-125.504h371.568c69.314 0 125.504 56.19 125.504 125.504v371.568c0 69.314-56.19 125.504-125.504 125.504H142.896c-69.314 0-125.504-56.19-125.504-125.504z"
      />
      <path
        fill="none"
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth={30}
        d="M278.19 278.19h100.98m-100.98 0v100.98m0-100.98V227.7c0-27.885-22.605-50.491-50.49-50.491s-50.491 22.606-50.491 50.491 22.606 50.49 50.491 50.49zm100.98 0v100.98m0-100.98h50.49c27.886 0 50.491-22.605 50.491-50.49s-22.605-50.491-50.491-50.491-50.49 22.606-50.49 50.491zm0 100.98H278.19m100.98 0v50.49c0 27.886 22.605 50.491 50.49 50.491s50.491-22.605 50.491-50.491-22.605-50.49-50.491-50.49zm-100.98 0H227.7c-27.885 0-50.491 22.605-50.491 50.49s22.606 50.491 50.491 50.491 50.49-22.605 50.49-50.491z"
      />
    </svg>
  );
}
