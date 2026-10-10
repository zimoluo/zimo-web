"use client";

import { useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useStripContribution } from "../navigation/contributions";
import { useDragGesture } from "../../lib/gesture/use-drag-gesture";
import cardStyle from "./audio-player.module.css";
import PlaybackSpeedIcon from "../../ui/icons/entries/musicPlayerCard/PlaybackSpeedIcon";
import BackToStartIcon from "../../ui/icons/entries/musicPlayerCard/BackToStartIcon";
import AdjustSpeedIcon from "../../ui/icons/entries/musicPlayerCard/AdjustSpeedIcon";
import PauseTrackIcon from "../../ui/icons/entries/musicPlayerCard/PauseTrackIcon";
import PlayTrackIcon from "../../ui/icons/entries/musicPlayerCard/PlayTrackIcon";
import LoopTrackOffIcon from "../../ui/icons/entries/musicPlayerCard/LoopTrackOffIcon";
import LoopTrackIcon from "../../ui/icons/entries/musicPlayerCard/LoopTrackIcon";

interface Props {
  url: string;
  title?: string;
  author?: string;
  coverUrl?: string;
}

function formatTime(time: number, duration: number) {
  time = Math.floor(time);
  duration = Math.floor(duration);

  const partsTime = [
    Math.floor(time / 86400),
    Math.floor((time % 86400) / 3600),
    Math.floor((time % 3600) / 60),
    time % 60,
  ];

  const maxIdxDuration = [86400, 3600, 60, 1].findIndex(
    (t) => duration >= t
  );

  const sliceIndex = Math.max(2, maxIdxDuration);

  return partsTime
    .slice(sliceIndex)
    .map((t) => t.toString().padStart(2, "0"))
    .join(":");
}

const defaultCover = "/util/placeholder-audio-cover.svg";

export default function AudioPlayer({
  url,
  title,
  author,
  coverUrl,
}: Props) {
  const trackTitle = title || "Audio Track";
  const id = useId();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const seeking = useRef(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [error, setError] = useState("");
  const progressFill = useRef<HTMLDivElement>(null);
  const fraction = (clientX: number, rect: DOMRect) => Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const seekGesture = useDragGesture({
    axis: "x", enabled: isMetadataLoaded,
    onStart: (pointer, element) => { seeking.current = true; const rect = element.getBoundingClientRect(); if (progressFill.current) progressFill.current.style.width = `${fraction(pointer.clientX, rect) * 100}%`; return rect; },
    onMove: (pointer, rect) => { if (progressFill.current) progressFill.current.style.width = `${fraction(pointer.clientX, rect) * 100}%`; },
    onEnd: (pointer, rect) => { seeking.current = false; seek(fraction(pointer.clientX, rect) * duration); },
  });

  const seek = (timeInSeconds: number): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, timeInSeconds));
    }
  };

  const changeRate = (newRate: number): void => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      void audioRef.current?.play().catch(() => setError("This audio could not be played."));
    }
  };

  const toggleIsLooping = (): void => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const contribution = useMemo(() => isPlaying ? { id: `media:${id}`, priority: 80, label: `${trackTitle}${author ? ` — ${author}` : ""}`, detail: <button type="button" className="grid size-11 place-items-center" aria-label={`Pause ${trackTitle}`} onClick={() => audioRef.current?.pause()}><PauseTrackIcon className="size-5"/></button> } : null, [isPlaying, id, trackTitle, author]);
  useStripContribution(contribution);

  const progressBarPercentage = duration > 0 ? currentTime / duration * 100 : 0;

  return (
    <div className={`${cardStyle.container}`}>
      <audio ref={audioRef} src={url} loop={isLooping} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} onTimeUpdate={(event) => { if (!seeking.current) setCurrentTime(event.currentTarget.currentTime); }} onLoadStart={() => { setIsMetadataLoaded(false); setCurrentTime(0); setError(""); }} onLoadedMetadata={(event) => { setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0); setIsMetadataLoaded(true); }} onError={() => setError("This audio is unavailable.")} />
      {error && <p role="status" className="p-3 text-text-muted">{error}</p>}
      <section
        className={`surface-widget surface-widget-70 text-text p-4 shadow-lg w-full backdrop-blur-[6px] outline-1 outline-edge/15 rounded-[1.75rem] ${cardStyle.grid}`}
      >
        <div
          className={`self-center ${cardStyle.cover} aspect-square rounded-xl overflow-hidden bg-fill/90 shrink-0 ${cardStyle.item1}`}
        >
          <Image
            src={coverUrl || defaultCover}
            alt={`Cover of ${trackTitle}`}
            className="w-full h-auto object-cover rounded-xl"
            width={128}
            height={128}
          />
        </div>

        <div className={`${cardStyle.item2}  ${cardStyle.title}`}>
          <h2 className="font-bold">{trackTitle}</h2>
          {author && <h3 className="mt-0">{author}</h3>}
        </div>

        <div
          className={`${cardStyle.item3}  ${
            cardStyle.controlBar
          } transition-opacity duration-300 ease-in-out ${
            isMetadataLoaded
              ? "opacity-100"
              : "opacity-0 pointer-events-none select-none"
          }`}
        >
          <div className={`flex w-full relative ${cardStyle.buttonArray}`}>
            <div
              className={`${cardStyle.playbackSpeedButton} whitespace-nowrap left-0 absolute items-center`}
            >
              <button
                aria-label="Reset playback speed" className="flex size-11 shrink-0 items-center justify-center"
                onClick={() => {
                  changeRate(1);
                }}
              >
                <PlaybackSpeedIcon className="size-6" />
              </button>
              <div className="text-text-muted text-base font-tabular">{`${playbackRate}x`}</div>
            </div>

            <div
              className={`flex items-center justify-center grow ${cardStyle.buttonSpacing}`}
            >
              <button aria-label="Restart track" className="min-h-11 min-w-11"
                onClick={() => {
                  seek(0);
                  changeRate(1);
                }}
              >
                <BackToStartIcon
                  className={`${cardStyle.button} h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110`}
                />
              </button>
              <button aria-label="Slow down" className="min-h-11 min-w-11"
                onClick={() => changeRate(Math.max(0.25, playbackRate - 0.25))}
              >
                <AdjustSpeedIcon
                  className={`${cardStyle.button} h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110`}
                />
              </button>
              <button aria-label={isPlaying ? "Pause track" : "Play track"} className="min-h-11 min-w-11" onClick={handlePlayPause}>
                {isPlaying ? (
                  <PauseTrackIcon
                    className={`${cardStyle.button} h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110`}
                  />
                ) : (
                  <PlayTrackIcon
                    className={`${cardStyle.button} h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110`}
                  />
                )}
              </button>
              <button aria-label="Speed up" className="min-h-11 min-w-11"
                onClick={() => changeRate(Math.min(2, playbackRate + 0.25))}
              >
                <AdjustSpeedIcon
                  className={`${cardStyle.button} h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110 rotate-180`}
                />
              </button>
              <button aria-label="Loop track" aria-pressed={isLooping} className="relative group min-h-11 min-w-11" onClick={toggleIsLooping}>
                <LoopTrackOffIcon
                  className={`${cardStyle.button} h-auto aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110`}
                />
                <LoopTrackIcon
                  className={`${
                    cardStyle.button
                  } select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto aspect-square transition-all duration-300 ease-in-out group-hover:scale-110 ${
                    isLooping ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className={`flex items-center ${cardStyle.progressBar}`}>
            <span className="text-base font-tabular">
              {formatTime(Math.max(Math.floor(currentTime), 0), duration)}
            </span>
            <div
              ref={seekBarRef}
              className="mx-2 grow min-h-11 py-4 cursor-pointer"
              role="slider" tabIndex={0} aria-label="Track position" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={Math.min(duration, currentTime)} aria-valuetext={formatTime(currentTime, duration)}
              style={seekGesture.style} onPointerDown={seekGesture.onPointerDown} onLostPointerCapture={() => { seeking.current = false; if (progressFill.current) progressFill.current.style.width = `${duration > 0 ? (audioRef.current?.currentTime ?? currentTime) / duration * 100 : 0}%`; }}
              onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); seek(currentTime + (event.key === "ArrowRight" ? 5 : -5)); } else if (event.key === "Home" || event.key === "End") { event.preventDefault(); seek(event.key === "Home" ? 0 : duration); } }}
            >
              <div className="bg-fill/90 rounded-full h-full overflow-hidden">
                <div ref={progressFill}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, progressBarPercentage)
                    )}%`,
                  }}
                  className={`${cardStyle.bgMiddleColor} rounded-r-full h-2`}
                />
              </div>
            </div>
            <span className="text-base font-tabular">{`-${formatTime(
              Math.max(0, duration - Math.floor(currentTime)),
              duration
            )}`}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
