"use client";

import type { SceneComponentProps } from "../../contract";

import { useCallback, useEffect, useRef } from "react";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
import Image from "next/image";
const bigSource = { src: "/theme/animated-background/birthday20/big.svg", width: 3072, height: 3072 };
const smallSource = { src: "/theme/animated-background/birthday20/small.svg", width: 1024, height: 1024 };
import birthday20Style from "./birthday20.module.css";

const BIG_SIZE = 280;
const BIG_RADIUS = BIG_SIZE / 2;
const SMALL_SIZE = 200;
const SMALL_RADIUS = SMALL_SIZE / 2;
const INITIAL_BIG_SPEED = 4;
const DAMPENING = 1;


const MASS_BIG = BIG_RADIUS * BIG_RADIUS;
const MASS_SMALL = SMALL_RADIUS * SMALL_RADIUS;

const GLOW_START_RADIUS = 140;
const GLOW_SHRINK_SPEED = 1.5;
const GLOW_FADE_SPEED = 0.01;

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

function Simple() {
  return (
    <div
      aria-hidden="true"
      className="fixed  inset-0 flex items-center justify-center pointer-events-none select-none touch-none"
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

function resolveCollision(p1: PhysicsEntity, p2: PhysicsEntity) {
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
}


function Rich() {
  const runtime = useSceneRuntime();
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const entitiesRef = useRef<PhysicsEntity[]>([]);

  const pointerRef = useRef({ x: -1000, y: -1000 });
  const glowParticlesRef = useRef<GlowParticle[]>([]);


  const syncVisuals = () => {
    const host = containerRef.current;
    if (host === null) return;
    for (const entity of entitiesRef.current) {
      if (entity.element !== null) continue;
      const element = document.createElement("div");
      const size = entity.type === "big" ? BIG_SIZE : SMALL_SIZE;
      element.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;transform:translate3d(${entity.x-entity.radius}px,${entity.y-entity.radius}px,0);will-change:transform;`;
      const image = document.createElement("img");
      image.src = entity.type === "big" ? bigSource.src : smallSource.src;
      image.alt = ""; image.style.cssText = "width:100%;height:100%;object-fit:contain;";
      element.appendChild(image); host.appendChild(element); entity.element = element;
    }
  };

  const computeAllowedSmallCount = useCallback((width: number, height: number) => {
    const input = runtime.input;
    const DENSITY_FACTOR = Number(input.params.density ?? 3);
    const areaPerSmall = SMALL_SIZE * SMALL_SIZE * DENSITY_FACTOR;
    const maxByArea = Math.floor((width * height) / areaPerSmall);
    return Math.max(0, Math.min(10000, maxByArea));
  }, [runtime]);

  const addSmallEntities = (
    count: number,
    width: number,
    height: number,
    entities: PhysicsEntity[],
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
    const container = containerRef.current;
    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;


      const entities: PhysicsEntity[] = [];

      entities.push({
        id: "big-ball",
        type: "big",
        x: innerWidth / 2,
        y: innerHeight / 2,
        vx:
          Math.cos(Math.random() * Math.PI * 2) *
          INITIAL_BIG_SPEED *
          (0.8 + Math.random() * 0.2),
        vy:
          Math.sin(Math.random() * Math.PI * 2) *
          INITIAL_BIG_SPEED *
          (0.8 + Math.random() * 0.2),
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
      syncVisuals();
    }

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      container?.replaceChildren();
    };
  }, [computeAllowedSmallCount, runtime]);

  useEffect(() => {

    const TIME_STEP = 1000 / 90;
    const MAX_ACCUMULATED_STEPS = 10;

    let lastTime = performance.now();
    let accumulator = 0;

    const stepPhysics = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const entities = entitiesRef.current;

      entities.forEach((ent) => {
        const input = runtime.input;
        ent.x += ent.vx * Number(input.params.speed ?? 1);
        ent.y += ent.vy * Number(input.params.speed ?? 1);

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
          const first = entities[i]; const second = entities[j];
          if (first !== undefined && second !== undefined) resolveCollision(first, second);
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
      const input = runtime.input;
      const host = glowRef.current;
      if (host === null) return;
      if (pointerRef.current.x > -100) {
        glowParticlesRef.current.push({ x: pointerRef.current.x, y: pointerRef.current.y, radius: GLOW_START_RADIUS, alpha: Number(input.params.intensity ?? 0.3) });
      }
      for (const particle of glowParticlesRef.current) { particle.alpha -= GLOW_FADE_SPEED; particle.radius -= GLOW_SHRINK_SPEED; }
      glowParticlesRef.current = glowParticlesRef.current.filter((particle) => particle.alpha > 0 && particle.radius > 1);
      const particles = glowParticlesRef.current;
      while (host.children.length < particles.length) host.appendChild(document.createElement("span"));
      while (host.children.length > particles.length) host.lastElementChild?.remove();
      particles.forEach((particle, index) => {
        const element = host.children[index];
        if (!(element instanceof HTMLElement)) return;
        element.style.cssText = `position:absolute;left:${particle.x - particle.radius}px;top:${particle.y - particle.radius}px;width:${particle.radius*2}px;height:${particle.radius*2}px;opacity:${particle.alpha};background:radial-gradient(circle,var(--zw-role-accent),transparent 70%);border-radius:50%;`;
      });
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


      entitiesRef.current.forEach((ent) => {
        if (ent.x > width) ent.x = width - ent.radius;
        if (ent.y > height) ent.y = height - ent.radius;
      });

      const allowedSmall = computeAllowedSmallCount(width, height);
      const currentSmall = entitiesRef.current.filter(
        (e) => e.type === "small",
      ).length;

      if (allowedSmall < currentSmall) {
        let toRemove = currentSmall - allowedSmall;
        for (
          let i = entitiesRef.current.length - 1;
          i >= 0 && toRemove > 0;
          i--
        ) {
          const entity = entitiesRef.current[i];
          if (entity?.type === "small") {
            entity.element?.remove();
            entity.element = null;
            entitiesRef.current.splice(i, 1);
            toRemove--;
          }
        }
        syncVisuals();
      } else if (allowedSmall > currentSmall) {
        const toAdd = allowedSmall - currentSmall;
        const added = addSmallEntities(
          toAdd,
          width,
          height,
          entitiesRef.current,
        );
        if (added > 0) syncVisuals();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [computeAllowedSmallCount, runtime]);

  return <>
    <div ref={glowRef} aria-hidden="true" className="fixed inset-0 pointer-events-none select-none touch-none blur-[8px]" />
    <div ref={containerRef} aria-hidden="true" className="fixed inset-0 pointer-events-none select-none touch-none overflow-hidden" />
  </>;
}


export default function Birthday20AnimatedBackground({ quality }: SceneComponentProps) {
  if (quality !== "rich") {
    return <Simple />;
  } else {
    return <Rich />;
  }
}
