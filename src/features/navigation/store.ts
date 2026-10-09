"use client";
import {create} from "zustand";
type NavigationUi={readonly sideMenuExpanded:boolean;readonly paletteOpen:boolean;readonly paletteContainer:HTMLDialogElement|null;readonly setSideMenuExpanded:(expanded:boolean)=>void;readonly openSideMenu:()=>void;readonly setPaletteOpen:(open:boolean)=>void;};
export const useNavigationUi=create<NavigationUi>()((set)=>({sideMenuExpanded:false,paletteOpen:false,paletteContainer:null,setSideMenuExpanded:(sideMenuExpanded)=>set({sideMenuExpanded}),openSideMenu:()=>set({sideMenuExpanded:true}),setPaletteOpen:(paletteOpen)=>set({paletteOpen,paletteContainer:paletteOpen&&typeof document!=="undefined"&&document.activeElement instanceof HTMLElement?document.activeElement.closest<HTMLDialogElement>("dialog:modal"):null})}));
