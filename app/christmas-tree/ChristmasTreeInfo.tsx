"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import windowStyle from "./confirm-window.module.css";
import CrossIcon from "@/components/assets/CrossIcon";
import boxStyle from "./box.module.css";

export default function ChristmasTreeInfo() {
  const { appendPopUp, removePopUpByContextKey } = usePopUp();
  return (
    <button
      className="w-8 h-8 text-center font-serif font-bold rounded-full bg-light/65 border-reflect-light text-xl shadow-lg select-none group flex items-center justify-center"
      onClick={() => {
        appendPopUp({
          contextKey: "christmas-tree-info",
          hasUtilityButton: false,
          content: (
            <div className={`${windowStyle.sizing} relative`}>
              <div className="relative w-full h-full">
                <ChristmasTreeInfoWindow />
              </div>
              <div className="top-4 right-4 absolute z-10">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-light/65 border-reflect-light shadow-lg select-none group"
                  onClick={() => {
                    removePopUpByContextKey("christmas-tree-info");
                  }}
                >
                  <CrossIcon className="w-4 h-4 pointer-events-none group-hover:scale-110 transition-transform duration-300 ease-out" />
                </button>
              </div>
            </div>
          ),
        });
      }}
    >
      <p className="transition-transform duration-300 ease-out group-hover:scale-110 w-min h-min leading-none">
        i
      </p>
    </button>
  );
}

function ChristmasTreeInfoWindow() {
  return (
    <div className="rounded-[2rem] w-full h-full bg-widget-90 shadow-xl p-0 flex flex-col outline outline-1 outline-highlight-light/15 relative">
      <h1
        className={`font-fancy text-2xl h-14 absolute top-0 left-0 w-full px-6 pt-6 z-10 whitespace-nowrap ${boxStyle.infoTitleShadow}`}
      >
        Christmas Tree
      </h1>
      <div
        className={`overflow-y-auto flex-grow space-y-4 text-lg pb-6 pt-20 rounded-[2rem] px-6 ${boxStyle.infoFade}`}
      >
        <p>
          Christmas Tree is Zimo Web{"\u2019"}s holiday special where you can
          leave a message on this shared festive tree. You’re welcome to share
          something positive, funny, or meaningful. Just keep it kind and
          appropriate.
        </p>
        <p>
          To add a message, pick an icon, drag it to a spot on the tree, and
          drop it there. Then, enter your name and message. You can choose
          whether your message is public or private. Public messages can be
          viewed by anyone by clicking your icon; private ones will only be
          visible to me. If you’d like to save the surprise, you can wait until
          December 25th to read the public messages, but that’s completely up to
          you.
        </p>
        <p>
          Spread some holiday cheer and leave your mark on the Christmas Tree!
        </p>
      </div>
    </div>
  );
}
