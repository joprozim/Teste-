export function movePlayer(player,direction){player.lane=Math.max(0,Math.min(2,player.lane+Math.sign(direction)));return player;}
export function jumpPlayer(player){if(player.jump<=0&&player.slide<=0){player.vy=560;player.jump=1;}return player;}
export function slidePlayer(player){if(player.jump<=0){player.slide=.72;}return player;}
export function updatePlayer(player,dt){
  if(player.jump>0||player.vy!==0){player.jump+=player.vy*dt;player.vy-=1450*dt;if(player.jump<=0){player.jump=0;player.vy=0;}}
  if(player.slide>0)player.slide=Math.max(0,player.slide-dt);
  return player;
}
