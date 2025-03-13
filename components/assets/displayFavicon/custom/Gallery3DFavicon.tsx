"id random";

"use client";

import { useEffect, useState } from "react";
import colorConvert from "color-convert";
import { randomUniform } from "@/lib/generalHelper";
import { v4 as uuidv4 } from "uuid";

const { hsl } = colorConvert;

export default function Gallery3DFavicon({
  className = "",
  innerColorPreset,
  outerColorPreset,
}: ImageIconProps & {
  innerColorPreset?: HexColor;
  outerColorPreset?: HexColor;
}) {
  const [innerColor, setInnerColor] = useState<HexColor>(
    innerColorPreset ?? "#b8b8b8"
  );
  const [outerColor, setOuterColor] = useState<HexColor>(
    outerColorPreset ?? "#ababab"
  );
  const [uniqueSuffix] = useState(uuidv4().slice(0, 13));

  useEffect(() => {
    const hue = randomUniform(0, 360);

    if (!innerColorPreset) {
      setInnerColor(`#${hsl.hex([hue, 12, 78])}`.toLowerCase() as HexColor);
    }

    if (!outerColorPreset) {
      setOuterColor(`#${hsl.hex([hue, 12, 74])}`.toLowerCase() as HexColor);
    }
  }, []);

  return (
    <div className={`relative aspect-square ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 1024 1024"
        aria-label="The website's favicon used for display purposes"
        className="relative"
      >
        <ellipse
          cx={511.552}
          cy={517.375}
          fill={innerColor}
          rx={473.891}
          ry={473.476}
        />
        <path
          fill={outerColor}
          fillRule="evenodd"
          d="M928.052 538.869C913.967 756.202 733.077 928.12 511.992 928.12c-35.391 0-69.752-4.405-102.564-12.697a414.4 414.4 0 0 1-90.995-34.858c13.912-136.27 91.993-253.742 203.862-321.601a48 48 0 0 0 2.113-1.359c63.609-38.066 137.965-60.084 217.493-60.431 66.718-.289 129.817 14.735 186.151 41.695m95.928-28.809C1023.18 228.225 794.263 0 511.992 0 229.227 0 0 229.026 0 511.544 0 768.45 189.547 981.119 436.538 1017.57a516 516 0 0 0 75.466 5.53C794.769 1023.1 1024 794.073 1024 511.555c0-.554-.01-1.065-.02-1.495m-102.388-76.756c-56.209-20.357-116.878-31.367-180.104-31.093h-.001c-88.324.385-171.421 22.634-244.188 61.592-73.122-38.32-156.422-59.864-244.653-59.479h-.001c-51.734.226-101.723 7.979-148.91 22.212C143.019 237.233 310.877 94.964 511.992 94.964c203.505 0 372.956 145.67 409.6 338.34m-516.259 93.174c-47.321-17.786-98.633-27.425-152.273-27.191-55.771.243-108.917 11.14-157.6 30.707 5.002 114.748 56.479 217.466 136.191 289.849 23.721-116.559 86.294-219.073 173.682-293.365"
          clipRule="evenodd"
        />
        <path
          fill={`url(#a_0e7d5d5b1e3c_${uniqueSuffix})`}
          fillRule="evenodd"
          d="M1024 512.446C1024 794.968 794.77 1024 512 1024S0 794.968 0 512.446 229.23.895 512 .895s512 229.029 512 511.551m-919.987-86.338C143.805 237.464 311.351 95.858 512 95.858c202.633 0 371.506 144.422 409.13 335.861 20.2 5.484 38.377 11.082 52.656 16.219 3.103 16.175 2.267 25.697 1.243 37.375v.001c-.59 6.722-1.243 14.16-1.243 23.992 0 5.198-1.604 16.666-3.069 27.139l-.001.002c-1.073 7.668-2.071 14.803-2.31 18.55-11.548-5.496-25.22-11.246-40.23-16.91C914.919 756.22 733.659 929.033 512 929.033c-70.76 0-137.403-17.611-195.778-48.685-3.057 14.945-5.365 29.728-6.87 44.202-35.536 0-55.867-21.636-75.402-42.426-5.604-5.963-11.142-11.857-16.955-17.151 3.101-15.106 7.067-30.774 11.813-46.766-78.701-72.8-129.243-175.556-133.473-290.131a442 442 0 0 0-10.6 4.076c-.073-1.727-3.445-.091-8.2 2.215-11.68 5.663-31.701 15.373-31.701-10.729 0-29.281.961-56.196 6.725-83.766 13.738-4.113 32.086-8.96 52.454-13.764"
          clipRule="evenodd"
        />
        <path
          fill={`url(#b_3c2c23270897_${uniqueSuffix})`}
          d="M95.723 530.514c-1.767-17.761-.578-50.293 9.76-103.878 46.678-13.9 96.077-21.47 147.178-21.694 70.432-.304 137.722 13.362 199.2 38.38a510 510 0 0 1 44.731 21.599l-33.445 27.094v3.136l-19.726 6.271-38.557 27.324-9.482 7.045a518 518 0 0 1 9.967-8.693c-47.321-17.785-98.633-27.426-152.272-27.192-55.677.245-108.739 11.105-157.354 30.608"
        />
        <path
          fill={`url(#c_7ab78daf78c7_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m326.678 885.673 36.874 24.596 10.918-4.46a415 415 0 0 1-47.792-20.136m414.81-482.566c63.225-.275 123.895 10.736 180.104 31.093a424 424 0 0 0-.771-3.95l12.566 49.098-5.585 58.186h-1.171l.027-.408c-56.334-26.96-119.433-41.985-186.151-41.695-79.528.347-153.884 22.365-217.493 60.43q-1.036.706-2.113 1.36c-111.869 67.859-189.95 185.331-203.862 321.6l.136.071-.038.417-88.348-58.932q.385-.74.699-1.616 1.078.993 2.163 1.978c23.721-116.559 86.294-219.073 173.682-293.366q-1.56-.585-3.125-1.16.575-.495 1.154-.987l23.405 17.73-4.035 12.542 95.047-62.264-20.634-28.617.154.081c72.767-38.958 155.864-61.206 244.188-61.591zm-339.96 120.73-2.753-2.085-.456.392-.43.369q1.824.654 3.639 1.324"
          clipRule="evenodd"
        />
        <path
          fill={`url(#d_c7b0f6e2b6f9_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m287.955 859.212 29.308 19.773-5.427 33.165c-17.631-2.613-31.034-16.663-30.887-33.481.063-7.278 2.655-13.994 7.006-19.457"
          clipRule="evenodd"
        />
        <path
          fill={`url(#e_4c6c745995fb_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m219.198 853.411.038-.078 8.966-32.7.449-2.688v2.24l20.175 13.438.219.813c-4.511 11.3-15.177 19.196-27.546 19.088a29 29 0 0 1-2.301-.113"
          clipRule="evenodd"
          opacity={0.8}
        />
        <path
          fill={`url(#f_489cb053e4fc_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m929.085 461.115-8.202-30.193.896.896 35.434 10.361c-4.678 11.237-15.402 19.048-27.816 18.94z"
          clipRule="evenodd"
          opacity={0.6}
        />
        <path
          fill={`url(#g_1e839454a423_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m101.292 449.796 4.521-25.593-1.344 1.792-35.666 8.804c5.082 9.108 15.979 15.352 28.547 15.242a37 37 0 0 0 3.942-.245"
          clipRule="evenodd"
          opacity={0.55}
        />
        <path
          fill={`url(#h_a31202a9a963_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m960.658 551.916-31.706-13.939-.242.162-.658-.336.209-5.247 2.925-28.247c17.024 1.196 31.106 13.237 32.948 29.385.736 6.458-.583 12.717-3.476 18.222"
          clipRule="evenodd"
          opacity={0.8}
        />
        <path
          fill={`url(#i_0396abeffb2d_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m94.6 514.242.896 13.887-10.76 4.031-.448-1.344-22.19 10.146a33.4 33.4 0 0 1-1.853-10.7c-.168-19.168 15.911-34.849 35.913-35.023l.11-.001z"
          clipRule="evenodd"
          opacity={0.7}
        />
        <path
          fill={`url(#j_af610a94949d_${uniqueSuffix})`}
          fillRule="evenodd"
          d="M429.889 544.789c9.706-4.133 16.188-11.496 16.262-19.945.062-7.064-4.368-13.446-11.45-17.864l-27.163 19.805h-2.69z"
          clipRule="evenodd"
          opacity={0.55}
        />
        <path
          fill={`url(#k_9bbcfb28b319_${uniqueSuffix})`}
          fillRule="evenodd"
          d="m475.802 481.85 20.4-16.582.892-.457 10.056 13.758c-4.094 4.576-10.404 7.514-17.488 7.526-5.23.009-10.044-1.578-13.86-4.245"
          clipRule="evenodd"
          opacity={0.7}
        />
        <defs>
          <radialGradient
            id={`a_0e7d5d5b1e3c_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="scale(512 511.551) rotate(90 0 1)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity={0} />
            <stop offset={0.805} stopColor="#373737" stopOpacity={0} />
            <stop offset={0.805} stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={0.88} stopColor="#4B4B4B" stopOpacity={0} />
            <stop offset={0.95} stopColor="#4B4B4B" stopOpacity={0} />
            <stop offset={1} stopColor="#4B4B4B" stopOpacity={0.16} />
          </radialGradient>
          <radialGradient
            id={`b_3c2c23270897_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="scale(511.999 511.553) rotate(90 -.648 1.14)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity={0} />
            <stop offset={0.805} stopColor="#373737" stopOpacity={0} />
            <stop offset={0.805} stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={0.88} stopColor="#4B4B4B" stopOpacity={0} />
            <stop offset={0.95} stopColor="#4B4B4B" stopOpacity={0} />
            <stop offset={1} stopColor="#4B4B4B" stopOpacity={0.16} />
          </radialGradient>
          <radialGradient
            id={`c_7ab78daf78c7_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(0 521.858 -522.312 0 738.809 917.883)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity={0} />
            <stop offset={0.805} stopColor="#373737" stopOpacity={0} />
            <stop offset={0.805} stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={0.88} stopColor="#4B4B4B" stopOpacity={0} />
            <stop offset={0.95} stopColor="#4B4B4B" stopOpacity={0} />
            <stop offset={1} stopColor="#4B4B4B" stopOpacity={0.16} />
          </radialGradient>
          <radialGradient
            id={`d_c7b0f6e2b6f9_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="rotate(90.5 -276.817 596.969) scale(33.5957 36.7638)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`e_4c6c745995fb_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(-.2714 31.10012 -29.56897 -.25804 221.772 822.421)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`f_489cb053e4fc_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="rotate(90.5 251.915 675.583) scale(31.5427 30.0434)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`g_1e839454a423_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(.26787 31.99358 -29.20948 .24456 97.787 427.384)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`h_a31202a9a963_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="rotate(-96.505 703.81 -144.998) scale(33.6002 36.7632)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`i_0396abeffb2d_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(.30314 34.70908 -36.21712 .31631 96.462 529.948)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`j_af610a94949d_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(-.20766 23.777 -34.62498 -.3024 411.526 524.543)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id={`k_9bbcfb28b319_${uniqueSuffix}`}
            cx={0}
            cy={0}
            r={1}
            gradientTransform="matrix(.03476 19.91377 -22.38537 .03907 489.628 466.183)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B4B4B" stopOpacity={0.22} />
            <stop offset={1} stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
