export function hasCollision(state){
  const index=state.obstacles.findIndex(o=>o.z>500&&o.z<565&&o.lane===state.player.lane&&
    (o.type==="jump"?state.player.jump<42:state.player.slide<=0));
  if(index<0)return false;
  if(state.shield){state.shield=false;state.obstacles.splice(index,1);return false;}
  return true;
}
