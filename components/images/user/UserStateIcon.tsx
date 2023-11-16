"id random";

import { ReactNode } from "react";

interface Props {
  className?: string;
  state?: Exclude<UserState, "normal">;
}

export default function UserStateIcon({
  className = "",
  state = "banned",
}: Props) {
  const userStateMap: Record<Exclude<UserState, "normal">, ReactNode> = {
    admin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
          fillRule: "nonzero",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        viewBox="0 0 1024 1024"
        className={`${className} visible`}
        aria-label={`User's current state is ${state}`}
      >
        <defs>
          <linearGradient
            id="c_a4f40d12_3721aa7efb7bd531b425"
            x1={254.923}
            x2={799.163}
            y1={821.777}
            y2={230.397}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#85ec74" />
            <stop offset={1} stopColor="#4cce78" />
          </linearGradient>
          <linearGradient
            id="e_98a9165d_6e171a865b57d052c4e0"
            x1={130.8}
            x2={861.694}
            y1={905.926}
            y2={96.187}
            gradientTransform="translate(107.06 107.06) scale(.7909)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.003} stopColor="#00bc60" />
            <stop offset={1} stopColor="#1e74ff" />
          </linearGradient>
          <linearGradient
            id="f_bccd252f_e8bceef0907aadab7eeb"
            x1={389.483}
            x2={671.661}
            y1={664.985}
            y2={390.102}
            gradientTransform="translate(107.06 107.06) scale(.7909)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.003} stopColor="#00bc60" />
            <stop offset={1} stopColor="#1e74ff" />
          </linearGradient>
          <path
            id="b_a0262154_be5dcf681843ba3bb0de"
            d="M0 512C0 229.23 229.23 0 512 0s512 229.23 512 512-229.23 512-512 512S0 794.77 0 512Z"
          />
        </defs>
        <clipPath id="a_aa7d6010_1055622c47913d11151e">
          <path d="M0 0h1024v1024H0z" />
        </clipPath>
        <g clipPath="url(#a_aa7d6010_1055622c47913d11151e)">
          <use
            xlinkHref="#b_a0262154_be5dcf681843ba3bb0de"
            fill="url(#c_a4f40d12_3721aa7efb7bd531b425)"
          />
          <mask
            id="d_659a1f15_e3f9a899b27c2eb27dab"
            width={1024}
            height={1024}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
          >
            <path d="M0 0h1024v1024H0z" />
            <use
              xlinkHref="#b_a0262154_be5dcf681843ba3bb0de"
              fill="#fff"
              fillRule="evenodd"
            />
          </mask>
          <use
            xlinkHref="#b_a0262154_be5dcf681843ba3bb0de"
            fill="none"
            stroke="#2b7b46"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeWidth={72}
            mask="url(#d_659a1f15_e3f9a899b27c2eb27dab)"
          />
          <path
            fill="url(#e_98a9165d_6e171a865b57d052c4e0)"
            d="m512 107.06-52.07 191.86c16.694-4.065 34.124-6.278 52.07-6.278 17.946 0 35.376 2.213 52.07 6.278L512 107.06ZM225.659 225.659l98.856 172.429a220.483 220.483 0 0 1 73.573-73.573l-172.429-98.856Zm572.682 0-172.429 98.856a220.483 220.483 0 0 1 73.573 73.573l98.856-172.429ZM298.92 459.93 107.06 512l191.86 52.07c-4.065-16.694-6.278-34.124-6.278-52.07 0-17.946 2.213-35.376 6.278-52.07Zm426.16 0c4.065 16.694 6.278 34.124 6.278 52.07 0 17.946-2.213 35.376-6.278 52.07L916.94 512l-191.86-52.07ZM324.515 625.912l-98.856 172.429 172.429-98.856a220.483 220.483 0 0 1-73.573-73.573Zm374.97 0a220.483 220.483 0 0 1-73.573 73.573l172.429 98.856-98.856-172.429ZM459.93 725.08 512 916.94l52.07-191.86c-16.694 4.065-34.124 6.278-52.07 6.278-17.946 0-35.376-2.213-52.07-6.278Z"
          />
          <path
            fill="url(#f_bccd252f_e8bceef0907aadab7eeb)"
            d="M322.552 512c0-104.629 84.819-189.448 189.448-189.448S701.448 407.371 701.448 512 616.629 701.448 512 701.448 322.552 616.629 322.552 512Z"
          />
        </g>
      </svg>
    ),
    banned: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
          fillRule: "nonzero",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        viewBox="0 0 1024 1024"
        className={className}
      >
        <defs>
          <linearGradient
            id="c000_1e542adcdf5e75e79b69"
            x1={236.413}
            x2={810.18}
            y1={810.071}
            y2={224.431}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#eb493a" />
            <stop offset={1} stopColor="#ff7979" />
          </linearGradient>
          <path
            id="b000_7f614cfea3808767716d"
            d="M0 512C0 229.23 229.23 0 512 0s512 229.23 512 512-229.23 512-512 512S0 794.77 0 512Z"
          />
        </defs>
        <clipPath id="a000_883018fccdccc3eb4782">
          <path d="M0 0h1024v1024H0z" />
        </clipPath>
        <g clipPath="url(#a000_883018fccdccc3eb4782)">
          <use
            xlinkHref="#b000_7f614cfea3808767716d"
            fill="url(#c000_1e542adcdf5e75e79b69)"
          />
          <mask
            id="d_a2b415fcdf2d973883c2"
            width={1024}
            height={1024}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
          >
            <path d="M0 0h1024v1024H0z" />
            <use
              xlinkHref="#b000_7f614cfea3808767716d"
              fill="#fff"
              fillRule="evenodd"
            />
          </mask>
          <use
            xlinkHref="#b000_7f614cfea3808767716d"
            fill="none"
            stroke="#912311"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeWidth={72}
            mask="url(#d000)"
          />
        </g>
      </svg>
    ),
  };

  return userStateMap[state];
}
