"id random";

export default function PixellandFavicon({
  className = "",
  height,
  width,
}: ImageIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      viewBox="0 0 1060.54 1060.54"
      aria-label="The website's favicon used for display purposes"
      height={height ? height : undefined}
      width={width ? width : undefined}
      className={className}
    >
      <path
        fill="url(#a_862b011aa3febef7975a)"
        fillRule="evenodd"
        d="M28 606.825V453.714C64.916 209.476 275.73 22.27 530.27 22.27c274.969 0 498.91 218.463 507.73 491.289v33.421c-6.94 214.586-146.953 395.541-340.209 463.02H362.748C187.749 948.896 56.403 794.741 28 606.825"
        clipRule="evenodd"
      />
      <path
        stroke="#F7FDFF"
        strokeMiterlimit={10}
        strokeWidth={40}
        d="M264.494 963.215C119.2 873.821 22.276 713.384 22.276 530.278c0-4.546.225-9.045.343-13.563 67.8-32.878 143.834-51.493 224.219-51.844 97.807-.426 189.396 26.231 267.719 72.875C369.474 625.83 270.99 782.854 264.494 963.215Zm0 0c9.984-277.187 237.116-499.435 517-500.656 93.288-.406 180.878 23.888 256.746 66.594.01.377.04.748.04 1.125 0 280.56-227.444 508.002-508.004 508.002-97.44 0-188.459-27.5-265.782-75.065ZM22.264 530.266c0-280.56 227.44-508 508-508s507.996 227.44 507.996 508-227.435 507.994-507.996 507.994-508-227.433-508-507.994Z"
      />
      <defs>
        <pattern
          id="a_862b011aa3febef7975a"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <use
            xlinkHref="#b_df44a57b87d21159c4b4"
            transform="matrix(.03125 0 0 .03195 0 -.011)"
          />
        </pattern>
        <image
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAk1BMVEUdNDRosP9lr/5WmmYvWU46dFlpsf9nr//N6f+ay/v///9mr/9rsv//3VT/pxP/vif/rQ3/4U7/zi//4VH/yyP/4lr/3FH/30z/yClfpbcpT0T/2UL/wBb/txL/rApEdJ5KimD/3Uj/zSn/xh7/sh3/oRv/nhr4/P/G5f9FdJ45Y4I6aE//2Un/ryz/uCX/qBz+uRkIWotSAAAB7ElEQVQ4y2SQCW6DMBBF7SFgD5vNTsSiNmnSSl3vf7r+MVBVygMjm3kef1BExMy0k+fMOf1HZRTI5Dqmx8ymaSodHmmInvFka62CBDFsxHLvkKbV0tAnJFLWisDGmMxkASxBWZbfE1aKA0bYBDSWTcvib1PXZspsaCG00fD9OLaX0bOEPOpGBFB11bCOfVEU/dvrn0CbRoS01cX/1MVUSzYrgmQyO8REZvCu72oIqQXKcJhtEhENVb26j44tsiKNVZbFwI0URmjneb0WzH3B7sYcBCu6Dkivxn+1CNm68l5XKsHbGOOoP20HOudeyvmutUoSHZ+UFg+9OD7J0Rj4kyrSm3COpB4MjqKIhaH01/ezfGYCflsek9zIgSAGxpikMEt/YPpiH3yx//9AV0BdgKRCZnBRe3kOlYT79vmbVWDXFfL31RHKXm4Bf/Ps2/y5ge/nnu3NbuTt19sBvj721NZpILmB9//r+/HMxYjB+m4NL2JZDH1QOJyHrhDpcz/nX3g8Bu0NlG3cdqFbgK1F8Nq1jHU2p4UZn86IA1xEyaJZsuGqSyJ8cTlyltget+DLp8dA227F8g1xvRqnL2QIx12FWSipYSWSqxILCKqYqlhNUJ0y69rYEWKpslRcY+3EEuhiTYFlsQ9+4oj9ANDaGlWLrGFOAAAAAElFTkSuQmCC"
          id="b_df44a57b87d21159c4b4"
          width={32}
          height={32}
          style={{
            imageRendering: "pixelated",
          }}
        />
      </defs>
    </svg>
  );
}
