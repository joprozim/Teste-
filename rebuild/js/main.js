import{createInitialState,startRun}from"./core/state.js";
import{updateGame,frameDelta}from"./core/loop.js";
import{attachInput}from"./systems/input.js";
import{loadProgress,saveRun}from"./systems/progress.js";
import{drawScene}from"./render/scene.js";
const canvas=document.querySelector("#game-canvas"),ctx=canvas.getContext("2d"),state=createInitialState();
const menu=document.querySelector("#menu"),over=document.querySelector("#game-over"),hud=document.querySelector("#hud"),count=document.querySelector("#countdown");
const distance=document.querySelector("#distance"),coins=document.querySelector("#coins"),level=document.querySelector("#level"),shieldLabel=document.querySelector("#shield-status");
const progress=loadProgress();let savedThisRun=false;
function showProgress(){document.querySelector("#menu-best").textContent=progress.bestScore;document.querySelector("#menu-wallet").textContent=progress.totalCoins;}
showProgress();
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(canvas.clientWidth*dpr);canvas.height=Math.floor(canvas.clientHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
window.addEventListener("resize",resize);resize();
function start(){startRun(state);savedThisRun=false;menu.style.display="none";over.hidden=true;hud.style.display="flex";}
function backToMenu(){over.hidden=true;menu.style.display="flex";hud.style.display="none";showProgress();}
document.querySelector("#start-button").addEventListener("click",start);
document.querySelector("#restart-button").addEventListener("click",start);
document.querySelector("#menu-button").addEventListener("click",backToMenu);
attachInput(canvas,state);
function tick(now){const dt=frameDelta(now,state.lastFrame||now);state.lastFrame=now;updateGame(state,dt);count.textContent=state.phase==="countdown"?String(Math.ceil(state.countdown)):"";if(state.phase==="over"){if(!savedThisRun){Object.assign(progress,saveRun(progress,state));savedThisRun=true;document.querySelector("#final-distance").textContent=Math.floor(state.distance);document.querySelector("#final-score").textContent=state.score;document.querySelector("#final-coins").textContent=state.runCoins;document.querySelector("#final-best").textContent=progress.bestScore;showProgress();}over.hidden=false;hud.style.display="none";}drawScene(canvas,ctx,state,now);distance.textContent=Math.floor(state.distance);coins.textContent=state.coins;level.textContent=state.level;shieldLabel.textContent=state.shield?"ESCUDO ATIVO":"SEM ESCUDO";requestAnimationFrame(tick);}
requestAnimationFrame(tick);
