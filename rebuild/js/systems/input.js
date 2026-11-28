import{movePlayer,jumpPlayer,slidePlayer}from"../entities/player.js";
export function attachInput(canvas,state){
  let start=null;
  const onKey=e=>{
    if(state.phase!=="run")return;
    if(["ArrowLeft","a","A"].includes(e.key)){e.preventDefault();movePlayer(state.player,-1);}
    else if(["ArrowRight","d","D"].includes(e.key)){e.preventDefault();movePlayer(state.player,1);}
    else if(["ArrowUp"," ","w","W"].includes(e.key)){e.preventDefault();jumpPlayer(state.player);}
    else if(["ArrowDown","s","S"].includes(e.key)){e.preventDefault();slidePlayer(state.player);}
  };
  const onDown=e=>{if(state.phase==="run")start={x:e.clientX,y:e.clientY};};
  const onUp=e=>{
    if(state.phase!=="run"||!start)return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;
    if(Math.max(Math.abs(dx),Math.abs(dy))>24){
      if(Math.abs(dx)>Math.abs(dy))movePlayer(state.player,dx<0?-1:1);
      else if(dy<0)jumpPlayer(state.player);else slidePlayer(state.player);
      return;
    }
    const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
    if(x<.34)movePlayer(state.player,-1);else if(x>.66)movePlayer(state.player,1);else jumpPlayer(state.player);
  };
  window.addEventListener("keydown",onKey);canvas.addEventListener("pointerdown",onDown);canvas.addEventListener("pointerup",onUp);
  return()=>{window.removeEventListener("keydown",onKey);canvas.removeEventListener("pointerdown",onDown);canvas.removeEventListener("pointerup",onUp);};
}
