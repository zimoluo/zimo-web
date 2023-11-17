import { shimmerDataURL } from "@/lib/imageUtil";
import {
  addActivePopup,
  isActivePopup,
  removeActivePopup,
} from "@/lib/popUpUtil";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import PopUpCrossIcon from "../images/popUp/PopUpCrossIcon";

interface Props {
  src: string;
  onClose: () => void;
  altText?: string;
}

export default function ImagePopUp({ src, onClose, altText = "" }: Props) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleImageClick = () => {
    window.open(src, "_blank");
  };

  const instanceRef = useRef({});

  useEffect(() => {
    addActivePopup(instanceRef.current);

    const currentRef = instanceRef.current;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        if (isActivePopup(currentRef)) {
          removeActivePopup(currentRef);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup
      window.removeEventListener("keydown", handleEscape);
      removeActivePopup(currentRef);
    };
  }, [onClose]);

  useEffect(() => {
    setStyle({
      opacity: 0,
      transform: "scale(1.25)",
    });

    setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: "scale(1)",
        transition: "opacity 200ms, transform 200ms",
      });
    }, 100);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-80 px-12 py-12">
      <Image
        src={src}
        alt={`${altText ? altText : "Zoomed-In Image"}`}
        className="image-popup-size object-contain opacity-0 cursor-zoom-in"
        style={style}
        height={4000}
        width={4000}
        quality={90}
        placeholder={`data:image/svg+xml;base64,${shimmerDataURL(100, 100)}`}
        onClick={handleImageClick}
      />
      <button className="absolute top-3 right-3 z-50" onClick={onClose}>
        <PopUpCrossIcon className="h-4 w-auto opacity-80 mix-blend-plus-lighter transition-transform duration-300 hover:scale-110" />
      </button>
    </div>
  );
}
