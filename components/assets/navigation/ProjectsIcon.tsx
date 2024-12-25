"id random";

export default function ProjectsIcon({
  color = null,
  className = "",
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      aria-label="Navigate to projects page"
      className={className}
    >
      <circle
        cx={512}
        cy={512}
        r={480}
        className={color ? "" : "stroke-primary"}
        stroke={color || undefined}
        strokeWidth={64}
        fill="none"
      />
      <circle
        cx={512}
        cy={512}
        r={155}
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
      />
      <path
        className={color ? "" : "fill-primary"}
        fill={color || undefined}
        fillRule="evenodd"
        d="M413.399 337.92 233.553 233.247l104.606 179.731a200.988 200.988 0 0 1 75.24-75.058Zm-94.233 120.716L118 511.786l201.04 53.117c-4.61-16.851-7.071-34.59-7.071-52.903 0-18.48 2.506-36.375 7.197-53.364Zm18.754 151.966L233.247 790.448l179.731-104.607a201 201 0 0 1-75.058-75.239Zm120.713 94.231L511.784 906 564.9 704.961c-16.85 4.609-34.588 7.07-52.9 7.07-18.481 0-36.378-2.507-53.367-7.198Zm151.969-18.752 179.845 104.672-104.606-179.731a201.002 201.002 0 0 1-75.239 75.059Zm94.232-120.717L906 512.214l-201.04-53.117c4.61 16.851 7.071 34.59 7.071 52.903 0 18.48-2.506 36.375-7.197 53.364ZM686.08 413.398l104.673-179.846-179.731 104.607a201 201 0 0 1 75.058 75.239Zm-120.713-94.231L512.217 118 459.1 319.039c16.85-4.609 34.588-7.07 52.9-7.07 18.482 0 36.378 2.507 53.367 7.198Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
