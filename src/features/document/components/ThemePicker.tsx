"use client";
import { useTheme,listedThemeIds,getTheme } from "../../theme";
export function ThemePicker(){
 const active=useTheme((state)=>state.active);
 return <label className="zw-theme-picker block surface-nested rounded-2xl p-4 my-4">Choose a theme<span className="surface-raised inline-block rounded-lg ml-3"><select value={active.kind==="builtIn"?active.id:""} className="rounded-lg bg-transparent p-2" onChange={(event)=>useTheme.getState().selectBuiltIn(event.target.value)}>{active.kind==="profile"?<option value="">Custom theme</option>:null}{listedThemeIds.map((id)=><option key={id} value={id}>{getTheme(id)?.name??id}</option>)}</select></span></label>;
}
