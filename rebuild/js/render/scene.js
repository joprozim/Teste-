const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
function roundRect(c,x,y,w,h,r,fill,stroke){
  c.beginPath();c.roundRect(x,y,w,h,r);
  if(fill){c.fillStyle=fill;c.fill();}
  if(stroke){c.strokeStyle=stroke;c.stroke();}
}
function gradient(c,x1,y1,x2,y2,stops){
  const g=c.createLinearGradient(x1,y1,x2,y2);
  for(const [p,col] of stops)g.addColorStop(p,col);
  return g;
}
function project(lane,depth,w,h){
  const t=clamp(depth/720,0,1),p=Math.pow(t,1.48);
  const roadHalf=w*.49,center=w*.5;
  return {x:center+lane*roadHalf*(.12+.88*p),y:h*.245+(h*.755)*p,scale:.16+.84*p,p};
}
function polygon(c,pts,fill,stroke){
  c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();
  c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}
}
function drawSky(c,w,h,time){
  c.fillStyle=gradient(c,0,0,0,h*.72,[[0,"#53d8ff"],[.52,"#a7e8f3"],[1,"#f7d9a0"]]);c.fillRect(0,0,w,h);
  const sunX=w*.77,sunY=h*.16;
  const glow=c.createRadialGradient(sunX,sunY,2,sunX,sunY,w*.19);
  glow.addColorStop(0,"#fff6c8aa");glow.addColorStop(1,"#fff6c800");
  c.fillStyle=glow;c.fillRect(sunX-w*.2,sunY-w*.2,w*.4,w*.4);
  c.fillStyle="#fff0b5";c.beginPath();c.arc(sunX,sunY,Math.max(13,w*.035),0,Math.PI*2);c.fill();
  // distant hills and layered skyline
  for(let layer=0;layer<3;layer++){
    const y=h*(.29+layer*.045),amp=h*(.035+layer*.012);
    c.beginPath();c.moveTo(0,y+amp);
    for(let x=0;x<=w+20;x+=20)c.lineTo(x,y+Math.sin(x*.009+layer*2.2+time*.00012)*amp+Math.sin(x*.021+layer)*amp*.35);
    c.lineTo(w,h*.55);c.lineTo(0,h*.55);c.closePath();
    c.fillStyle=["#7bbd9d","#559d82","#397b70"][layer];c.fill();
  }
  // distant city blocks
  for(let i=0;i<18;i++){
    const bw=w*.025+(i%4)*w*.008,bh=h*(.06+(i*17%7)*.012),x=i*w/17;
    c.fillStyle=i%2?"#6d9d99":"#719a9a";
    c.fillRect(x,h*.39-bh,bw,bh);
    c.fillStyle="#d8f3d8aa";
    for(let yy=h*.4-bh+7;yy<h*.4-5;yy+=10)c.fillRect(x+4,yy,3,3);
  }
}
function drawSideScenery(c,w,h,time,offset){
  // green embankments
  polygon(c,[{x:0,y:h*.34},{x:w*.25,y:h*.34},{x:w*.12,y:h},{x:0,y:h}],"#388b48");
  polygon(c,[{x:w,y:h*.34},{x:w*.75,y:h*.34},{x:w*.9,y:h},{x:w,y:h}],"#347f46");
  // repeating trees scaled into distance
  for(let side of [-1,1])for(let i=0;i<13;i++){
    const d=((i*66+offset*.55)%720),p=project(side*1.48,d,w,h),s=7+p.scale*30;
    const x=p.x,y=p.y;
    c.fillStyle="#60452d";c.fillRect(x-s*.12,y-s*.85,s*.24,s*.9);
    c.fillStyle=i%2?"#147c4c":"#229b55";
    c.beginPath();c.arc(x,y-s*.95,s*.48,0,Math.PI*2);c.fill();
    c.fillStyle="#62c96c";c.beginPath();c.arc(x-s*.18,y-s*1.08,s*.22,0,Math.PI*2);c.fill();
  }
  // overhead cables and poles
  for(let i=0;i<7;i++){
    const d=((i*115+offset)%720),a=project(-1.55,d,w,h),b=project(1.55,d,w,h);
    const top=a.y-70*a.scale-10,btop=b.y-70*b.scale-10;
    c.strokeStyle="#43545a";c.lineWidth=Math.max(1,2*a.scale);
    c.beginPath();c.moveTo(a.x,top);c.lineTo(b.x,btop);c.stroke();
  }
}
function drawTrain(c,w,h){
  const nearY=h*1.12,farY=h*.32,left=w*.69,right=w*1.12;
  polygon(c,[{x:left,y:farY},{x:right,y:farY+h*.015},{x:right,y:nearY},{x:left-w*.1,y:nearY}],"#173e51","#9ad8dc");
  polygon(c,[{x:left,y:farY},{x:left+w*.1,y:farY-h*.035},{x:right+w*.03,y:farY-h*.02},{x:right,y:farY+h*.015}],"#2d7888","#b6f1e8");
  for(let i=0;i<6;i++){
    const t=i/6,yy=mix(farY,nearY,t),xx=mix(left,right,t*.48);
    const winW=mix(w*.06,w*.12,t),winH=mix(h*.045,h*.13,t);
    roundRect(c,xx+winW*.18,yy+winH*.12,winW,winH,Math.max(2,winW*.12),"#173c50","#8edce2");
    c.fillStyle="#b7f5f0";c.globalAlpha=.35;c.fillRect(xx+winW*.25,yy+winH*.2,winW*.18,winH*.6);c.globalAlpha=1;
  }
  c.strokeStyle="#d2ffff";c.lineWidth=3;c.beginPath();c.moveTo(left,farY);c.lineTo(left-w*.1,nearY);c.stroke();
}
function drawTrack(c,w,h,offset){
  const horizon=h*.245,near=h*1.08;
  polygon(c,[{x:w*.5-w*.12,y:horizon},{x:w*.5+w*.12,y:horizon},{x:w*.99,y:near},{x:w*.01,y:near}],"#79634b");
  polygon(c,[{x:w*.5-w*.105,y:horizon},{x:w*.5+w*.105,y:horizon},{x:w*.94,y:near},{x:w*.06,y:near}],"#92765a");
  // ballast texture
  for(let i=0;i<95;i++){
    const d=(i*37+offset*1.8)%720,p=project((i%7-3)*.18,d,w,h);
    c.fillStyle=i%2?"#b59a73":"#65513e";c.globalAlpha=.55;
    c.fillRect(p.x,p.y,2+p.scale*4,1+p.scale*2);c.globalAlpha=1;
  }
  // sleepers recede into horizon
  for(let i=0;i<24;i++){
    const d=(i*34+offset)%720,p=project(0,d,w,h),half=(w*.1)*(p.scale);
    c.fillStyle="#4b382e";c.fillRect(w*.5-half,p.y-2-p.scale*5,half*2,4+p.scale*10);
    c.fillStyle="#b28b61";c.fillRect(w*.5-half,p.y-2-p.scale*5,half*2,Math.max(1,p.scale*2));
  }
  // three pairs of rails, perspective converging
  for(const lane of [-1,0,1]){
    const top=project(lane*.62,0,w,h),bottom=project(lane*.62,720,w,h);
    const inner=project(lane*.62+.09,720,w,h);
    c.strokeStyle="#3a4146";c.lineWidth=7;c.beginPath();c.moveTo(top.x,top.y);c.lineTo(bottom.x,bottom.y);c.stroke();
    c.strokeStyle="#c6c8c4";c.lineWidth=3;c.beginPath();c.moveTo(top.x,top.y);c.lineTo(bottom.x,bottom.y);c.stroke();
    c.strokeStyle="#f1e6c9";c.lineWidth=1;c.beginPath();c.moveTo(top.x-1,top.y);c.lineTo(bottom.x-1,bottom.y);c.stroke();
  }
  // lane separators subtle
  c.strokeStyle="#f5dfb477";c.lineWidth=1.5;c.setLineDash([7,12]);
  for(const lane of [-.33,.33]){
    const a=project(lane,0,w,h),b=project(lane,720,w,h);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();
  }
  c.setLineDash([]);
}
function drawCoin(c,x,y,r,spin){
  c.save();c.translate(x,y);c.scale(Math.max(.22,Math.abs(Math.cos(spin))),1);
  c.shadowColor="#ffd42a";c.shadowBlur=r*.9;
  const g=c.createRadialGradient(-r*.3,-r*.35,1,0,0,r);
  g.addColorStop(0,"#fff7a8");g.addColorStop(.45,"#ffc928");g.addColorStop(1,"#d77a08");
  c.fillStyle=g;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();
  c.shadowBlur=0;c.strokeStyle="#fff0a0";c.lineWidth=Math.max(1,r*.12);c.stroke();
  c.fillStyle="#fff4bd";c.font="bold "+(r*1.05)+"px system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("$",0,1);
  c.restore();
}
function drawObstacle(c,o,w,h){
  const p=project(o.lane-1,o.z,w,h),s=18+p.scale*62,x=p.x,y=p.y;
  c.save();c.translate(x,y);c.shadowColor="#ff542e";c.shadowBlur=12*p.scale;
  if(o.type==="slide"){
    roundRect(c,-s*.7,-s*.52,s*1.4,s*.45,5*p.scale,"#e9a52e","#fff0a1");
    c.fillStyle="#3a3941";c.fillRect(-s*.54,-s*.52,s*.16,s*.45);c.fillRect(s*.38,-s*.52,s*.16,s*.45);
  }else{
    roundRect(c,-s*.52,-s*1.15,s*1.04,s*1.15,5*p.scale,"#e94d35","#ffcf9a");
    c.fillStyle="#ffd15a";c.fillRect(-s*.42,-s*.88,s*.84,s*.18);
    c.fillStyle="#9d302a";c.fillRect(-s*.35,-s*.55,s*.7,s*.12);
  }
  c.restore();
}
function drawRunner(c,x,y,scale,player,shield,time){
  c.save();c.translate(x,y);c.scale(scale,scale);
  const bob=Math.sin(time*.012)*2,lean=player.jump>0?-.12:0;c.rotate(lean);
  c.fillStyle="#0006";c.beginPath();c.ellipse(0,4,28,9,0,0,Math.PI*2);c.fill();
  if(shield){c.strokeStyle="#55f4ff";c.lineWidth=3;c.shadowColor="#55eaff";c.shadowBlur=18;c.beginPath();c.ellipse(0,-38,31,48,0,0,Math.PI*2);c.stroke();c.shadowBlur=0;}
  // legs and shoes
  c.strokeStyle="#273044";c.lineWidth=10;c.lineCap="round";
  c.beginPath();c.moveTo(-9,-25+bob);c.lineTo(-13,-5);c.moveTo(9,-25-bob);c.lineTo(14,-5);c.stroke();
  roundRect(c,-23,-9,17,8,4,"#f5f0df");roundRect(c,7,-9,18,8,4,"#f5f0df");
  // backpack
  roundRect(c,-23,-72,46,45,11,"#527d35","#b4d37a");
  roundRect(c,-18,-65,36,30,8,"#355d2c","#91bb5c");
  // torso / jacket
  roundRect(c,-19,-78+bob,38,49,10,"#e5e8d6","#fff3d4");
  roundRect(c,-17,-74+bob,34,30,7,"#6da64c");
  c.fillStyle="#f1c84b";c.fillRect(-3,-71+bob,6,24);
  // arms
  c.strokeStyle="#d7ad83";c.lineWidth=8;c.beginPath();c.moveTo(-18,-70+bob);c.lineTo(-27,-43);c.moveTo(18,-70+bob);c.lineTo(27,-43);c.stroke();
  // neck/head
  c.fillStyle="#dca77e";c.beginPath();c.arc(0,-88+bob,12,0,Math.PI*2);c.fill();
  c.fillStyle="#4a2e27";c.beginPath();c.arc(0,-94+bob,12,Math.PI,Math.PI*2);c.fill();
  // red cap
  roundRect(c,-14,-105+bob,28,12,5,"#e63e37","#ffb1a0");
  c.fillStyle="#bd292b";c.fillRect(3,-99+bob,17,4);
  c.restore();
}
export function drawScene(canvas,ctx,state,time){
  const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
  ctx.clearRect(0,0,w,h);
  drawSky(ctx,w,h,time);
  drawSideScenery(ctx,w,h,time,state.trackOffset);
  drawTrain(ctx,w,h);
  drawTrack(ctx,w,h,state.trackOffset);
  // far track lights and sparks
  for(let i=0;i<8;i++){
    const d=(i*96+state.trackOffset*1.25)%720,p=project(i%2?1.02:-1.02,d,w,h),r=2+p.scale*5;
    ctx.fillStyle="#ffe9a2";ctx.shadowColor="#ffe08a";ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(p.x,p.y-r*5,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  }
  // depth-sorted collectibles and obstacles
  const items=[
    ...state.coinsOnTrack.map(v=>({...v,kind:"coin"})),
    ...state.powerupsOnTrack.map(v=>({...v,kind:"power"})),
    ...state.obstacles.map(v=>({...v,kind:"obstacle"}))
  ].sort((a,b)=>a.z-b.z);
  for(const item of items){
    const p=project(item.lane-1,item.z,w,h);
    if(item.kind==="coin")drawCoin(ctx,p.x,p.y-13*p.scale,8+p.scale*11,time*.009+item.z);
    else if(item.kind==="power"){
      ctx.save();ctx.shadowColor="#45f5ff";ctx.shadowBlur=20*p.scale;
      ctx.fillStyle="#31d9e8";ctx.beginPath();ctx.arc(p.x,p.y-22*p.scale,10+p.scale*9,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#073b51";ctx.font="bold "+(12+p.scale*8)+"px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("S",p.x,p.y-22*p.scale);ctx.restore();
    }else drawObstacle(ctx,item,w,h);
  }
  const playerX=project(state.player.lane-1,720,w,h).x;
  const jumpY=state.player.jump*.22;
  const size=Math.min(w*.92,h*1.1)/390;
  drawRunner(ctx,playerX,h*.91-jumpY,size,state.player,state.shield,time);
  // cinematic edge shade and speed streaks
  const vignette=ctx.createRadialGradient(w*.5,h*.55,h*.12,w*.5,h*.55,h*.8);
  vignette.addColorStop(0,"#00000000");vignette.addColorStop(1,"#07111b55");
  ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
}
