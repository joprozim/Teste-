export function collectCoins(state){
  const remaining=[];
  for(const coin of state.coinsOnTrack){if(coin.z>=500&&coin.z<=565&&coin.lane===state.player.lane)state.coins+=1;else remaining.push(coin);}
  state.coinsOnTrack=remaining;return state.coins;
}
export function collectPowerups(state){
  const remaining=[];
  for(const item of state.powerupsOnTrack){if(item.z>=500&&item.z<=565&&item.lane===state.player.lane)state.shield=true;else remaining.push(item);}
  state.powerupsOnTrack=remaining;return state.shield;
}
