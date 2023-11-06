import BackgroundAnimation from "./BackgroundAnimation";
import BackgroundImage from "./BackgroundImage";
import Footer from "./Footer";
import NavbarButton from "./NavbarButtonWrapper";
import NavbarContent from "./NavbarContent";
import NavbarWrapper from "./NavbarWrapper";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function MainPageElements({ children, className = "" }: Props) {
  return (
    <>
      <BackgroundImage />
      <BackgroundAnimation />
      <NavbarWrapper>
        <NavbarContent />
      </NavbarWrapper>

      <main className={className}>{children}</main>
      <div
        className="select-none pointer-events-none flex-grow"
        aria-hidden="true"
      />
      <Footer />
    </>
  );
}
