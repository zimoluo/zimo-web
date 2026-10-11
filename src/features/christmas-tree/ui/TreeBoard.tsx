"use client";
import controls from "../../../ui/controls.module.css";
import { SurfaceRim } from "../../../ui/SurfaceRim";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useDragGesture } from "../../../lib/gesture/use-drag-gesture";
import { presentOverlay } from "../../overlays";
import { notify } from "../../notifications";
import { SPRITES, SPRITE_BASE, availablePosition } from "../model";
import { useTree } from "../store";
import styles from "./tree.module.css";

function SpriteButton({sprite,board,select}:{readonly sprite:string;readonly board:RefObject<HTMLDivElement|null>;readonly select:(sprite:string)=>void}) {
  const ghost = useRef<HTMLImageElement>(null);
  const moved = useRef(false);
  const gesture = useDragGesture<{readonly bounds:DOMRect}>({
    onStart: (pointer) => {
      const bounds = board.current?.getBoundingClientRect();
      if (bounds === undefined) return null;
      moved.current = false;
      if (ghost.current !== null) { ghost.current.hidden = false; ghost.current.style.translate = `${pointer.clientX}px ${pointer.clientY}px`; }
      return {bounds};
    },
    onMove: (pointer) => { moved.current = true; if (ghost.current !== null) ghost.current.style.translate = `${pointer.clientX}px ${pointer.clientY}px`; },
    onEnd: (pointer,{bounds}) => {
      if (ghost.current !== null) ghost.current.hidden = true;
      if (!moved.current) return;
      const position = [(pointer.clientX-bounds.left)/bounds.width*1000,(pointer.clientY-bounds.top)/bounds.height*1000] as const;
      if (!availablePosition(position,useTree.getState().occupiedPositions)) { notify({title:"Christmas Tree",body:"Choose an open spot inside the tree."});return; }
      presentOverlay({kind:"tree-confirm",props:{position,sprite},singletonKey:"tree-confirm"});
    },
  });
  return <><button type="button" className={styles.spriteButton} aria-label={`Select or drag ${sprite}`} onPointerDown={gesture.onPointerDown} onClick={() => {if(!moved.current) select(sprite);}}>
    <img src={`${SPRITE_BASE}${sprite}.svg`} width={100} height={100} alt="" draggable={false} />
  </button>
    <img ref={ghost} hidden src={`${SPRITE_BASE}${sprite}.svg`} width={100} height={100} alt="" className={styles.ghost} />
  </>;
}
export function TreeBoard() {
  const board = useRef<HTMLDivElement>(null);
  const messages = useTree((state) => state.messages);
  const error = useTree((state) => state.error);
  const [selected,setSelected] = useState<string|null>(null);
  const [position,setPosition] = useState<readonly [number,number]>([500,400]);
  useEffect(() => {void useTree.getState().refresh();const timer = setInterval(() => {void useTree.getState().refresh();},8000);return () => clearInterval(timer);},[]);
  const place = (at:readonly [number,number]) => {
    if(selected === null)return;
    if(!availablePosition(at,useTree.getState().occupiedPositions)){notify({title:"Christmas Tree",body:"Choose an open spot inside the tree."});return;}
    presentOverlay({kind:"tree-confirm",props:{position:at,sprite:selected},singletonKey:"tree-confirm"});setSelected(null);
  };
  return <section className={`${styles.container} surface-widget surface-edge`} aria-label="Christmas tree">
    <div className={styles.tree} ref={board} onClick={(event) => {
      if(selected === null || event.target instanceof HTMLElement && event.target.closest("button") !== null)return;
      const rect=event.currentTarget.getBoundingClientRect();place([(event.clientX-rect.left)/rect.width*1000,(event.clientY-rect.top)/rect.height*1000]);
    }}>
      <img className={styles.treeImage} src="/special/christmas/tree.svg" width={800} height={1000} alt="Christmas tree" draggable={false}/>
      {messages.map((message) => <button key={message.id} type="button" aria-label={`Read the message from ${message.from}`} className={styles.decoration} style={{left:`${message.position[0]/10}%`,top:`${message.position[1]/10}%`}} onClick={() => presentOverlay({kind:"tree-message",props:{id:message.id},singletonKey:`tree-message-${message.id}`})}>
        <img src={`${SPRITE_BASE}${message.sprite}.svg`} width={100} height={100} alt="" draggable={false}/><span>{message.from}</span>
      </button>)}
      <button type="button" className={styles.info} aria-label="About the Christmas tree" onClick={() => presentOverlay({kind:"tree-info",singletonKey:"tree-info"})}>i</button>
      {selected !== null && <div className={styles.placement} style={{left:`${position[0]/10}%`,top:`${position[1]/10}%`}}><img src={`${SPRITE_BASE}${selected}.svg`} alt="Selected decoration" width={100} height={100}/></div>}
    </div>
    <div className={styles.selector}><h1 className="font-display text-2xl">Decorate the tree</h1><p>Drag an ornament to an open spot, or select one and choose a position.</p><div className={styles.sprites}>{SPRITES.map((sprite)=><SpriteButton key={sprite} sprite={sprite} board={board} select={setSelected}/>)}</div>
      {selected !== null && <fieldset className={styles.position}><legend>Position of {selected}</legend><label>Horizontal<input className={controls.range} type="range" min={0} max={1000} value={position[0]} onChange={(event)=>setPosition([Number(event.target.value),position[1]])}/></label><label>Vertical<input className={controls.range} type="range" min={130} max={850} value={position[1]} onChange={(event)=>setPosition([position[0],Number(event.target.value)])}/></label><button type="button" className="surface-raised rounded-xl p-3" onClick={()=>place(position)}>Place decoration</button><button type="button" className="p-3" onClick={()=>setSelected(null)}>Cancel</button></fieldset>}
      {error && <p role="alert">{error}</p>}
    </div>
  <SurfaceRim /></section>;
}
