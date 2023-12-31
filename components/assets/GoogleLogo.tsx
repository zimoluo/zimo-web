"id random";

interface Props {
  className?: string;
}

export default function GoogleLogo({ className = "" }: Props) {
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
      viewBox="0 0 1024 1024"
      className={className}
      aria-label="Google logo"
    >
      <path
        fill="#fff"
        d="M0 512C0 229.23 229.23 0 512 0s512 229.23 512 512-229.23 512-512 512S0 794.77 0 512Z"
      />
      <path
        fill="#4285f4"
        d="M853.375 520.118c0-25.328-2.273-49.682-6.494-73.062H510.473v138.33h192.233c-8.443 44.486-33.77 82.154-71.763 107.481v89.947h115.925c67.541-62.345 106.507-153.916 106.507-262.696Z"
      />
      <path
        fill="#34a853"
        d="M510.473 869.189c96.442 0 177.296-31.822 236.395-86.375l-115.925-89.947c-31.822 21.432-72.411 34.42-120.47 34.42-92.869 0-171.775-62.669-200.026-147.096H191.601v92.219c58.774 116.574 179.244 196.779 318.872 196.779Z"
      />
      <path
        fill="#fbbc05"
        d="M310.447 579.866c-7.144-21.432-11.365-44.162-11.365-67.866s4.221-46.434 11.365-67.866v-92.22H191.601C167.247 399.973 153.284 454.2 153.284 512c0 57.799 13.963 112.027 38.317 160.086l92.544-72.087 26.302-20.133Z"
      />
      <path
        fill="#ea4335"
        d="M510.473 297.037c52.604 0 99.364 18.184 136.706 53.253l102.287-102.286c-62.022-57.799-142.551-93.193-238.993-93.193-139.628 0-260.098 80.205-318.872 197.103l118.846 92.22c28.251-84.426 107.157-147.097 200.026-147.097Z"
      />
    </svg>
  );
}
