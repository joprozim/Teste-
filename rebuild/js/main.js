import{createInitialState,startRun}from"./core/state.js";
import{updateGame,frameDelta}from"./core/loop.js";
import{attachInput}from"./systems/input.js";
const canvas=document.querySelector("#game-canvas"),ctx=canvas.getContext("2d"),state=createInitialState();
const menu=document.querySelector("#menu"),over=document.querySelector("#game-over"),hud=document.querySelector("#hud"),count=document.querySelector("#countdown");
const distance=document.querySelector("#distance"),coins=document.querySelector("#coins"),shieldLabel=document.querySelector("#shield-status");
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(canvas.clientWidth*dpr);canvas.height=Math.floor(canvas.clientHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
window.addEventListener("resize",resize);resize();
function start(){startRun(state);menu.style.display="none";over.hidden=true;hud.style.display="flex";}
document.querySelector("#start-button").addEventListener("click",start);
document.querySelector("#restart-button").addEventListener("click",start);
attachInput(canvas,state);
function draw(){
 const w=canvas.clientWidth,h=canvas.clientHeight,horizon=h*.25,roadW=Math.min(w*.78,520),left=(w-roadW)/2,laneW=roadW/3;
 ctx.clearRect(0,0,w,h);const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,"#101b3a");grad.addColorStop(1,"#080d1c");ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
 ctx.fillStyle="#172448";ctx.fillRect(left,horizon,roadW,h-horizon);ctx.strokeStyle="#4cecff";ctx.lineWidth=3;ctx.strokeRect(left,horizon,roadW,h-horizon);
 ctx.setLineDash([18,18]);ctx.lineWidth=2;for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(left+i*laneW,horizon);ctx.lineTo(left+i*laneW,h);ctx.stroke();}ctx.setLineDash([]);
 for(const c of state.coinsOnTrack){const y=horizon+(c.z/720)*(h-horizon),r=5+(c.z/720)*7,x=left+c.lane*laneW+laneW/2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle="#ffd84a";ctx.shadowColor="#ffd84a";ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="#fff2a6";ctx.lineWidth=2;ctx.stroke();}
 for(const p of state.powerupsOnTrack){const y=horizon+(p.z/720)*(h-horizon),x=left+p.lane*laneW+laneW/2,r=9+(p.z/720)*8;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle="#4cecff";ctx.shadowColor="#4cecff";ctx.shadowBlur=20;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle="#09213a";ctx.font="bold 14px system-ui";ctx.textAlign="center";ctx.fillText("S",x,y+5);}
 for(const o of state.obstacles){const y=horizon+(o.z/720)*(h-horizon),size=24+(o.z/720)*34,x=left+o.lane*laneW+laneW/2;ctx.fillStyle=o.type==="slide"?"#a66bff":"#ff3d83";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=18;if(o.type==="slide"){ctx.fillRect(x-size/2,y-size/2,size,size*.45);}else{ctx.fillRect(x-size/2,y-size/2,size,size);}ctx.shadowBlur=0;}
 const px=left+state.player.lane*laneW+laneW/2,py=h-72-state.player.jump;
 ctx.fillStyle=state.shield?"#4cecff":"#ffcf33";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=state.shield?28:20;
 const ph=state.player.slide>0?28:56,pw=state.player.slide>0?48:34;
 if(ctx.fillRoundRect)ctx.fillRoundRect(px-pw/2,py-ph/2,pw,ph,10);else ctx.fillRect(px-pw/2,py-ph/2,pw,ph);
 ctx.shadowBlur=0;distance.textContent=Math.floor(state.distance);coins.textContent=state.coins;shieldLabel.textContent=state.shield?"ESCUDO ATIVO":"SEM ESCUDO";
}
function tick(now){const dt=frameDelta(now,state.lastFrame||now);state.lastFrame=now;updateGame(state,dt);count.textContent=state.phase==="countdown"?String(Math.ceil(state.countdown)):"";if(state.phase==="over"){over.hidden=false;document.querySelector("#final-distance").textContent=Math.floor(state.distance);hud.style.display="none";}draw();requestAnimationFrame(tick);}
requestAnimationFrame(tick);
