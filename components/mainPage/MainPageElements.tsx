import BackgroundAnimation from "./BackgroundAnimation";
import BackgroundImage from "./BackgroundImage";
import Footer from "./Footer";
import NavbarContent from "./NavbarContent";
import NavbarWrapper from "./NavbarWrapper";
import ToastCard from "../widgets/ToastCard";
import ToastCardContainer from "../widgets/ToastCardContainer";
import MenuEntriesLayout from "./menu/MenuEntriesLayout";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function MainPageElements({ children, className = "" }: Props) {
  return (
    <>
      <BackgroundImage />
      <BackgroundAnimation />
      <div className="fixed z-50 top-5 left-1/2 -translate-x-1/2 ">
        <ToastCardContainer dismissDirection="up">
          <ToastCard
            icon={"generic"}
            title={"This is title"}
            description="This is description"
          />
        </ToastCardContainer>
      </div>
      <div className="fixed z-50 top-10 left-0 hidden md:block">
        <ToastCardContainer dismissDirection="left">
          <ToastCard
            icon={"generic"}
            title={"This is title"}
            description="This is description"
          />
        </ToastCardContainer>
      </div>
      <NavbarWrapper menuContent={<MenuEntriesLayout />}>
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
