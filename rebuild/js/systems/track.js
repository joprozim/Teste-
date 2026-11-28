export function spawnObstacle(state){
  const lane=Math.floor(Math.random()*3),type=Math.random()<.5?"jump":"slide";
  state.obstacles.push({lane,z:0,type});
}
export function updateTrack(state,dt){
  state.distance+=state.speed*dt/10;
  state.level=1+Math.floor(state.distance/500);
  state.speed=Math.min(520,state.baseSpeed+(state.level-1)*12);
  state.trackOffset=(state.trackOffset+state.speed*dt)%80;
  state.spawnIn-=dt;
  if(state.spawnIn<=0){spawnObstacle(state);state.spawnIn=Math.max(.48,1.35-state.distance/1100);}
  for(const o of state.obstacles)o.z+=state.speed*dt;
  state.obstacles=state.obstacles.filter(o=>o.z<720);
  for(const c of state.coinsOnTrack)c.z+=state.speed*dt;
  state.coinsOnTrack=state.coinsOnTrack.filter(c=>c.z<720);
  state.coinSpawnIn-=dt;
  if(state.coinSpawnIn<=0){const lane=Math.floor(Math.random()*3);for(let i=0;i<4;i++)state.coinsOnTrack.push({lane,z:-i*34});state.coinSpawnIn=1.65;}
  for(const p of state.powerupsOnTrack)p.z+=state.speed*dt;
  state.powerupsOnTrack=state.powerupsOnTrack.filter(p=>p.z<720);
  state.powerupSpawnIn-=dt;
  if(state.powerupSpawnIn<=0){state.powerupsOnTrack.push({lane:Math.floor(Math.random()*3),z:0,type:"shield"});state.powerupSpawnIn=12+Math.random()*5;}
}
