"use client";
import { AudioPlayer } from "../../media";
export function DocumentMusicPlayer({url,title,author}:{readonly url:string;readonly title:string;readonly author?:string}) {
 return <AudioPlayer url={url} title={title} {...(author === undefined ? {} : {author})}/>;
}
