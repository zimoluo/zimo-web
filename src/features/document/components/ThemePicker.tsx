"use client";
import { useTheme,listedThemeIds,getTheme } from "../../theme";
export function ThemePicker(){
 const active=useTheme((state)=>state.active);
 return <label className="zw-theme-picker block surface-nested rounded-2xl p-4 my-4">Choose a theme<select value={active.kind==="builtIn"?active.id:""} className="surface-raised rounded-lg p-2 ml-3" onChange={(event)=>useTheme.getState().selectBuiltIn(event.target.value)}>{active.kind==="profile"?<option value="">Custom theme</option>:null}{listedThemeIds.map((id)=><option key={id} value={id}>{getTheme(id)?.name??id}</option>)}</select></label>;
}
