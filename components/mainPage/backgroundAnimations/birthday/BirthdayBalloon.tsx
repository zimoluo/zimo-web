"use client";

import { useEffect } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import { randomIntFromRange, randomUniform } from "@/lib/generalHelper";

export default function BirthdayBalloon() {
  const { settings } = useSettings();

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const setDynamicInterval = () => {
      clearInterval(intervalId);
      clearExistingSVGs();

      const newIntervalDuration = settings.flyingBalloonRate;

      for (let i = 0; i < 5; i++) {
        addSVG();
      }

      intervalId = setInterval(addSVG, newIntervalDuration);
    };

    setDynamicInterval();
    window.addEventListener("resize", setDynamicInterval);

    function clearExistingSVGs() {
      const floatingSVGs = document.querySelectorAll(".flying-balloon");
      floatingSVGs.forEach((el) => el.remove());
    }

    function addSVG() {
      const leftPosition = randomUniform(5, 95);
      let newSpeed = randomUniform(10, 16);

      const svgElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgElement.innerHTML = `<path fill="${getRandomColor()}" d="M30.68 0c16.92 0 30.6 16.34 30.6 36.51 0 18.62-11.67 39.94-26.77 42.22l2.94 5.1c1.85 3.21.81 4.09-2.36 4.09h-1.93c6.04 15.27 6.56 18.68.65 33.95 0 .54-.46 1-1 1h-2.97c-.54 0-1-.46-1-1 5.99-15.27 5.32-18.68-.65-33.95h-3.32c-2.4.04-2.24-2.28-1.24-3.9l3.28-5.29C11.74 76.52 0 55.17 0 36.51 0 16.34 13.71 0 30.6 0h.08zm5.51 12.16a1.749 1.749 0 1 1 1.66-3.08c2.93 1.58 5.86 3.92 8.42 6.57 2.64 2.73 4.89 5.8 6.32 8.7a1.747 1.747 0 0 1-3.13 1.55c-1.28-2.58-3.31-5.34-5.71-7.83-2.31-2.4-4.95-4.51-7.56-5.91z" style="fill-rule:evenodd;clip-rule:evenodd"/>`;
      svgElement.setAttribute("viewBox", "0 0 61.27 122.88");
      svgElement.classList.add(
        "fixed",
        "transform",
        "-translate-x-1/2",
        "-z-20",
        "flying-balloon",
        "pointer-events-none",
        "select-none"
      );
      svgElement.style.cssText = `
        left: ${leftPosition}%;
        bottom: ${-randomIntFromRange(40, 60)}vh;
        transition: bottom ${newSpeed}s linear;
        width: ${randomUniform(8, 12)}vh;
        height: auto;
      `;

      svgElement.ariaHidden = "true";

      document.body.appendChild(svgElement);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          svgElement.style.bottom = "120vh";
        });
      });

      setTimeout(() => {
        svgElement.remove();
      }, (newSpeed + 1) * 1000);
    }

    return () => {
      clearInterval(intervalId);
      clearExistingSVGs();
      window.removeEventListener("resize", setDynamicInterval);
    };
  }, [settings.flyingBalloonRate]);

  return null;
}

function getRandomColor(): string {
  const color1HSL = { h: 327.92, s: 100.0, l: 80.2 };
  const color2HSL = { h: 112.28, s: 100.0, l: 80.2 };

  let firstHue: number = Math.min(color1HSL.h, color2HSL.h);
  let secondHue: number = Math.max(color1HSL.h, color2HSL.h);

  const hue: number = randomUniform(secondHue, firstHue + 360);

  const saturation: number = (color1HSL.s + color2HSL.s) / 2;
  const lightness: number = (color1HSL.l + color2HSL.l) / 2;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
