"id random";

export default function VisibleIcon({
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
      viewBox="0 0 640 640"
      aria-label="Visible"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <clipPath id="a_63ac468af46aa28c3f6c">
        <path d="M0 0h640v640H0z" />
      </clipPath>
      <g clipPath="url(#a_63ac468af46aa28c3f6c)">
        <path
          className={color ? "" : "fill-primary"}
          fill={color || undefined}
          d="M631.708 297.566c-5.622-6.629-139.965-162.112-311.702-162.112-171.743 0-306.08 155.483-311.714 162.119C-2.762 310.57-2.762 329.43 8.3 342.44c5.628 6.629 139.964 162.106 311.707 162.106 171.737 0 306.08-155.49 311.708-162.119 11.054-12.997 11.054-31.857-.006-44.861m-259.243-68.711c11.548-6.304 27.652.929 35.964 16.149 8.312 15.227 5.686 32.682-5.862 38.986-11.542 6.311-27.652-.929-35.971-16.149-8.305-15.227-5.686-32.683 5.869-38.986m-52.459 219.359c-119.967 0-220.926-92.133-255.87-128.214 23.598-24.37 77.323-74.275 146.658-104.117-13.523 20.575-21.452 45.16-21.452 71.623 0 72.163 58.496 130.658 130.658 130.658s130.665-58.495 130.665-130.658c0-26.463-7.923-51.048-21.446-71.623C498.554 245.732 552.273 295.63 575.87 320c-34.944 36.101-135.902 128.214-255.864 128.214"
        />
      </g>
    </svg>
  );
}
