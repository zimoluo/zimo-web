"use client";
import {useId,useMemo,useRef,useState} from "react";
import {useStripContribution} from "../../navigation";
export function DocumentMusicPlayer({url,title,author}:{readonly url:string;readonly title:string;readonly author?:string}){
 const id=useId(),audio=useRef<HTMLAudioElement>(null),[playing,setPlaying]=useState(false);
 const contribution=useMemo(()=>playing?{id:`media:${id}`,priority:80,label:`${title}${author?` — ${author}`:""}`,detail:<button type="button" className="min-h-11 px-2" aria-label={`Pause ${title}`} onClick={()=>audio.current?.pause()}>Ⅱ</button>}:null,[playing,id,title,author]);
 useStripContribution(contribution);
 return <figure className="zw-music-player surface-nested"><figcaption>{title}{author===undefined?"":` — ${author}`}</figcaption><audio ref={audio} controls src={url} preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}/></figure>;
}
