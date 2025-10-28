"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import windowStyle from "./confirm-window.module.css";
import CrossIcon from "@/components/assets/CrossIcon";

export default function ChristmasTreeInfo() {
  const { appendPopUp, removePopUpByContextKey } = usePopUp();
  return (
    <button
      className="w-8 h-8 text-center font-serif font-bold rounded-full bg-light/65 border-reflect-light text-xl shadow-lg select-none group flex items-center justify-center"
      onClick={() => {
        appendPopUp({
          contextKey: "christmas-tree-info",
          darkOpacity: 0.25,
          hasUtilityButton: false,
          content: (
            <div className={`${windowStyle.sizing} relative`}>
              <div className="relative w-full h-full">
                <ChristmasTreeInfoWindow />
              </div>
              <div className="top-4 right-4 absolute">
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
    <div className="rounded-[2rem] w-full h-full bg-widget-90 shadow-xl p-6 flex flex-col outline outline-1 outline-highlight-light/15">
      <h1 className="font-fancy text-2xl mb-6">Christmas Tree</h1>
      <div className="overflow-y-auto flex-grow space-y-4 text-lg">
        <p>
          Christmas Tree is Zimo Web{"\u2019"}s holiday special, where you can
          share a message on the festive tree. Your message can be about
          anything hopeful, cheerful, or meaningful, but please avoid posting
          anything sensitive, harmful, political, inappropriate, etc.
        </p>
        <p>
          To add a message, choose your favorite icon, drag it to your desired
          spot on the tree, and drop it there. Then, enter your name and
          message. Your name will appear on the tree alongside the icon. You can
          decide whether your message will be public or private. Public messages
          can be viewed by anyone by clicking the corresponding icon on the
          tree, while private messages will only be visible to me. For an extra
          touch of holiday magic, I recommend waiting until December 25th to
          read the public messages to keep the surprise and Christmas spirit
          alive. Of course, the choice is yours!
        </p>
        <p>Spread the joy and make your mark on the Christmas Tree!</p>
      </div>
    </div>
  );
}
