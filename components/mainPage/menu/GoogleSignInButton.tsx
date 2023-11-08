import GoogleLogo from "@/components/images/GoogleLogo";

export default function GoogleSignInButton() {
  return (
    <button className="flex items-center w-full rounded-full">
      <GoogleLogo className="my-1 h-10 md:h-14 w-auto aspect-square" />
      <div className="text-lg md:text-xl ml-4 font-bold transition-opacity duration-300 ease-in-out">
        Sign in with Google
      </div>
    </button>
  );
}

// Placeholder
