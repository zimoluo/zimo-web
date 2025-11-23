"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import bigSource from "@/public/theme/animated-background/birthday20/big.svg";
import smallSource from "@/public/theme/animated-background/birthday20/small.svg";
import birthday20Style from "./birthday20.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";

const BIG_SIZE = 280;
const BIG_RADIUS = BIG_SIZE / 2;
const SMALL_SIZE = 200;
const SMALL_RADIUS = SMALL_SIZE / 2;
const INITIAL_BIG_SPEED = 4;
const DAMPENING = 1; // perfectly elastic collisions

// mass proportional to area ie radius squared
const MASS_BIG = BIG_RADIUS * BIG_RADIUS;
const MASS_SMALL = SMALL_RADIUS * SMALL_RADIUS;

const GLOW_START_RADIUS = 80;
const GLOW_SHRINK_SPEED = 1.5;
const GLOW_FADE_SPEED = 0.01;
const HUE_CYCLE_SPEED = 0.25;

type PhysicsEntity = {
  id: string;
  type: "big" | "small";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  element: HTMLDivElement | null;
};

type GlowParticle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
};

export default function Birthday20AnimatedBackground() {
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const entitiesRef = useRef<PhysicsEntity[]>([]);

  const pointerRef = useRef({ x: -1000, y: -1000 });
  const glowParticlesRef = useRef<GlowParticle[]>([]);
  const hueRef = useRef(0);

  const [entityVersion, setEntityVersion] = useState(0);
  const [mounted, setMounted] = useState(false);

  const computeAllowedSmallCount = (width: number, height: number) => {
    const DENSITY_FACTOR = 3;
    const areaPerSmall = SMALL_SIZE * SMALL_SIZE * DENSITY_FACTOR;
    const maxByArea = Math.floor((width * height) / areaPerSmall);
    return Math.max(0, Math.min(10000, maxByArea));
  };

  const addSmallEntities = (
    count: number,
    width: number,
    height: number,
    entities: PhysicsEntity[]
  ) => {
    let added = 0;
    let attemptsTotal = 0;

    while (added < count && attemptsTotal < count * 200) {
      attemptsTotal++;
      let safePlaceFound = false;
      let attempts = 0;
      let x = 0,
        y = 0;

      while (!safePlaceFound && attempts < 100) {
        x = SMALL_RADIUS + Math.random() * (width - SMALL_SIZE);
        y = SMALL_RADIUS + Math.random() * (height - SMALL_SIZE);

        const hasOverlap = entities.some((ent) => {
          const dx = ent.x - x;
          const dy = ent.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < ent.radius + SMALL_RADIUS + 10;
        });

        if (!hasOverlap) {
          safePlaceFound = true;
        }
        attempts++;
      }

      if (safePlaceFound) {
        entities.push({
          id: `small-ball-1132168046-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          type: "small",
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          radius: SMALL_RADIUS,
          mass: MASS_SMALL,
          element: null,
        });
        added++;
      } else {
        break;
      }
    }
    return added;
  };

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;

      if (canvasRef.current) {
        canvasRef.current.width = innerWidth;
        canvasRef.current.height = innerHeight;
      }

      const entities: PhysicsEntity[] = [];

      entities.push({
        id: "big-ball",
        type: "big",
        x: innerWidth / 2,
        y: innerHeight / 2,
        vx: (Math.random() - 0.5) * INITIAL_BIG_SPEED * 2,
        vy: (Math.random() - 0.5) * INITIAL_BIG_SPEED * 2,
        radius: BIG_RADIUS,
        mass: MASS_BIG,
        element: null,
      });

      const allowedSmall = computeAllowedSmallCount(innerWidth, innerHeight);

      for (let i = 0; i < allowedSmall; i++) {
        let safePlaceFound = false;
        let attempts = 0;
        let x = 0,
          y = 0;

        while (!safePlaceFound && attempts < 100) {
          x = SMALL_RADIUS + Math.random() * (innerWidth - SMALL_SIZE);
          y = SMALL_RADIUS + Math.random() * (innerHeight - SMALL_SIZE);

          const hasOverlap = entities.some((ent) => {
            const dx = ent.x - x;
            const dy = ent.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < ent.radius + SMALL_RADIUS + 10;
          });

          if (!hasOverlap) {
            safePlaceFound = true;
          }
          attempts++;
        }

        if (safePlaceFound) {
          entities.push({
            id: `small-ball-1132168046-${i}`,
            type: "small",
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            radius: SMALL_RADIUS,
            mass: MASS_SMALL,
            element: null,
          });
        }
      }

      entitiesRef.current = entities;
      setEntityVersion((v) => v + 1);
    }

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (!mounted || settings.backgroundRichness === "reduced") return;

    const TIME_STEP = 1000 / 90;
    const MAX_ACCUMULATED_STEPS = 10;

    let lastTime = performance.now();
    let accumulator = 0;

    const stepPhysics = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const entities = entitiesRef.current;

      entities.forEach((ent) => {
        ent.x += ent.vx;
        ent.y += ent.vy;

        if (ent.x - ent.radius < 0) {
          ent.x = ent.radius;
          ent.vx = -ent.vx;
        } else if (ent.x + ent.radius > width) {
          ent.x = width - ent.radius;
          ent.vx = -ent.vx;
        }

        if (ent.y - ent.radius < 0) {
          ent.y = ent.radius;
          ent.vy = -ent.vy;
        } else if (ent.y + ent.radius > height) {
          ent.y = height - ent.radius;
          ent.vy = -ent.vy;
        }
      });

      for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          resolveCollision(entities[i], entities[j]);
        }
      }
    };

    const renderPositions = () => {
      entitiesRef.current.forEach((ent) => {
        if (ent.element) {
          ent.element.style.transform = `translate3d(${ent.x - ent.radius}px, ${
            ent.y - ent.radius
          }px, 0)`;
        }
      });
    };

    const renderGlow = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !canvasRef.current) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      ctx.clearRect(0, 0, width, height);

      hueRef.current = (hueRef.current + HUE_CYCLE_SPEED) % 360;
      const currentHslColor = `hsl(${hueRef.current}, 70%, 85%)`;

      if (pointerRef.current.x > -100) {
        glowParticlesRef.current.push({
          x: pointerRef.current.x,
          y: pointerRef.current.y,
          radius: GLOW_START_RADIUS,
          alpha: 0.3,
        });
      }

      for (let i = glowParticlesRef.current.length - 1; i >= 0; i--) {
        const p = glowParticlesRef.current[i];

        p.alpha -= GLOW_FADE_SPEED;
        p.radius -= GLOW_SHRINK_SPEED;

        if (p.alpha <= 0 || p.radius <= 1) {
          glowParticlesRef.current.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius
        );

        gradient.addColorStop(0, currentHslColor.replace(")", `, ${p.alpha})`));
        gradient.addColorStop(1, currentHslColor.replace(")", `, 0)`));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const clampedDelta = Math.min(delta, TIME_STEP * MAX_ACCUMULATED_STEPS);

      accumulator += clampedDelta;

      let steps = 0;
      while (accumulator >= TIME_STEP && steps < MAX_ACCUMULATED_STEPS) {
        stepPhysics();
        accumulator -= TIME_STEP;
        steps++;
      }

      renderPositions();
      renderGlow();

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }

      entitiesRef.current.forEach((ent) => {
        if (ent.x > width) ent.x = width - ent.radius;
        if (ent.y > height) ent.y = height - ent.radius;
      });

      const allowedSmall = computeAllowedSmallCount(width, height);
      const currentSmall = entitiesRef.current.filter(
        (e) => e.type === "small"
      ).length;

      if (allowedSmall < currentSmall) {
        let toRemove = currentSmall - allowedSmall;
        for (
          let i = entitiesRef.current.length - 1;
          i >= 0 && toRemove > 0;
          i--
        ) {
          if (entitiesRef.current[i].type === "small") {
            entitiesRef.current[i].element = null;
            entitiesRef.current.splice(i, 1);
            toRemove--;
          }
        }
        setEntityVersion((v) => v + 1);
      } else if (allowedSmall > currentSmall) {
        const toAdd = allowedSmall - currentSmall;
        const added = addSmallEntities(
          toAdd,
          width,
          height,
          entitiesRef.current
        );
        if (added > 0) setEntityVersion((v) => v + 1);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted, settings.backgroundRichness]);

  const resolveCollision = (p1: PhysicsEntity, p2: PhysicsEntity) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < p1.radius + p2.radius && distance > 0) {
      const overlap = (p1.radius + p2.radius - distance) / 2;
      const offsetX = (dx / distance) * overlap;
      const offsetY = (dy / distance) * overlap;

      p1.x += offsetX;
      p1.y += offsetY;
      p2.x -= offsetX;
      p2.y -= offsetY;

      const nx = dx / distance;
      const ny = dy / distance;

      const tx = -ny;
      const ty = nx;

      const dpTan1 = p1.vx * tx + p1.vy * ty;
      const dpTan2 = p2.vx * tx + p2.vy * ty;

      const dpNorm1 = p1.vx * nx + p1.vy * ny;
      const dpNorm2 = p2.vx * nx + p2.vy * ny;

      const m1 = p1.mass;
      const m2 = p2.mass;

      const newNorm1 = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
      const newNorm2 = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

      p1.vx = (tx * dpTan1 + nx * newNorm1) * DAMPENING;
      p1.vy = (ty * dpTan1 + ny * newNorm1) * DAMPENING;
      p2.vx = (tx * dpTan2 + nx * newNorm2) * DAMPENING;
      p2.vy = (ty * dpTan2 + ny * newNorm2) * DAMPENING;
    } else if (distance === 0) {
      const nudge = 0.5;
      p1.x += nudge;
      p1.y += nudge;
      p2.x -= nudge;
      p2.y -= nudge;
    }
  };

  if (settings.backgroundRichness === "reduced") {
    return (
      <div
        aria-hidden="true"
        className="fixed -z-20 inset-0 flex items-center justify-center pointer-events-none select-none touch-none"
      >
        <div className={`${birthday20Style.reducedSize}`}>
          <Image
            src={bigSource}
            alt="Big"
            aria-hidden="true"
            className={`object-contain object-center pointer-events-none select-none w-full h-full`}
            priority={true}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed -z-30 inset-0 pointer-events-none select-none touch-none"
      />
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed -z-20 inset-0 pointer-events-none select-none touch-none overflow-hidden"
      >
        {mounted &&
          entitiesRef.current.map((entity) => (
            <div
              key={entity.id}
              ref={(el) => {
                if (entity) entity.element = el;
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: entity.type === "big" ? BIG_SIZE : SMALL_SIZE,
                height: entity.type === "big" ? BIG_SIZE : SMALL_SIZE,
                transform: `translate3d(${entity.x - entity.radius}px, ${
                  entity.y - entity.radius
                }px, 0)`,
                willChange: "transform",
              }}
            >
              <Image
                src={entity.type === "big" ? bigSource : smallSource}
                alt="Glass disk"
                aria-hidden="true"
                className="w-full h-full object-contain rounded-full backdrop-blur-[8px]"
                priority={entity.type === "big"}
              />
            </div>
          ))}
      </div>
    </>
  );
}
