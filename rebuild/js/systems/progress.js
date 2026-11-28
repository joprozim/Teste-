const STORAGE_KEY="neon-runner-mega-progress-v1";
export function loadProgress(){
  const empty={bestScore:0,totalCoins:0,totalRuns:0,totalDistance:0};
  try{
    const raw=globalThis.localStorage?.getItem(STORAGE_KEY);
    if(!raw)return empty;
    const data=JSON.parse(raw);
    return {
      bestScore:Math.max(0,Number(data.bestScore)||0),
      totalCoins:Math.max(0,Number(data.totalCoins)||0),
      totalRuns:Math.max(0,Number(data.totalRuns)||0),
      totalDistance:Math.max(0,Number(data.totalDistance)||0)
    };
  }catch{return empty;}
}
export function saveRun(progress,state){
  const next={
    bestScore:Math.max(progress.bestScore,state.score),
    totalCoins:progress.totalCoins+state.runCoins,
    totalRuns:progress.totalRuns+1,
    totalDistance:progress.totalDistance+Math.floor(state.distance)
  };
  try{globalThis.localStorage?.setItem(STORAGE_KEY,JSON.stringify(next));}catch{}
  return next;
}
