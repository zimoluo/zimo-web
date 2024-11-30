"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import windowStyle from "./confirm-window.module.css";

export default function ChristmasTreeInfo() {
  const { appendPopUp } = usePopUp();
  return (
    <button
      className="w-8 h-8 text-center font-serif font-bold rounded-full bg-light bg-opacity-80 text-xl shadow-md"
      onClick={() => {
        appendPopUp({
          contextKey: "christmas-tree-info",
          darkOpacity: 0.25,
          content: (
            <div className={`${windowStyle.sizing}`}>
              <ChristmasTreeInfoWindow />
            </div>
          ),
        });
      }}
    >
      i
    </button>
  );
}

function ChristmasTreeInfoWindow() {
  return (
    <div className="rounded-3xl w-full h-full bg-widget-90 shadow-xl p-6 flex flex-col">
      <h1 className="font-fancy text-2xl mb-6">Christmas Tree</h1>
      <div className="overflow-y-auto flex-grow space-y-4 text-lg">
        <p>
          Christmas Tree is Zimo Web{"\u2019"}s holiday special, where you can
          share a message on the festive tree. Your message can be about
          anything hopeful, cheerful or meaningful, but please avoid posting
          anything sensitive, harmful, political, inappropriate, etc.
        </p>
        <p>
          To add a message, choose your favorite icon, drag it to your desired
          spot on the tree, and drop it there. Then, enter your name and
          message. Your name will be visible on the tree. You can decide whether
          your message will be public or private. Public messages can be viewed
          by anyone by clicking the corresponding icon on the tree, while
          private messages will only be visible to me who has access to the
          database.
        </p>
        <p>Spread the joy and make your mark on the Christmas Tree!</p>
      </div>
    </div>
  );
}
