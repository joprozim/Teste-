export function createInitialState(){
  return {
    phase:"menu", distance:0, coins:0, speed:260, baseSpeed:260, elapsed:0, countdown:3,
    level:1, player:{lane:1,jump:0,vy:0,slide:0}, obstacles:[], coinsOnTrack:[],
    powerupsOnTrack:[], shield:false, spawnIn:0, coinSpawnIn:1.1,
    powerupSpawnIn:8, trackOffset:0, lastFrame:0, score:0, runCoins:0
  };
}
export function startRun(state){Object.assign(state,createInitialState(),{phase:"countdown"});return state;}
export function finishRun(state){state.phase="over";state.score=Math.floor(state.distance)+state.coins*10;return state;}
