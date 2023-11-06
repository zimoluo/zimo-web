import BackgroundAnimation from "./BackgroundAnimation";
import BackgroundImage from "./BackgroundImage";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function MainPageElements({ children, className = "" }: Props) {
  return (
    <>
      <BackgroundImage />
      <BackgroundAnimation />

      <main className={className}>{children}</main>
      <div
        className="select-none pointer-events-none flex-grow"
        aria-hidden="true"
      />
    </>
  );
}
