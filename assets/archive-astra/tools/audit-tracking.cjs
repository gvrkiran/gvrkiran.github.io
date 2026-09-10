// Run with Node from the repository root. Evaluates every prepared track at 101 frames.
const fs = require('node:fs');
const vm = require('node:vm');
const context = {window:{}};
vm.createContext(context);
for(const path of ['data.js','assets/archive-below/segmentation/artifact-regions-graph.js','assets/archive-astra/tracking.js'])vm.runInContext(fs.readFileSync(path,'utf8'),context);
const {ArchiveTracking:T,ARCHIVE_REGIONS, PUBLICATIONS}=context.window;
const results=[];
for(const [year,data] of Object.entries(ARCHIVE_REGIONS.years)){
  const count=PUBLICATIONS.filter(p=>Number(p.year)===Number(year)).length;
  const tracks=T.prepare(data.tracks,Number(year),count),seen=new Set();let frames=0;
  for(let i=0;i<=100;i++){
    const active=T.candidates(tracks,i/100,1440,900);frames+=active.length;
    if(new Set(active.map(a=>a.index)).size!==active.length)throw Error('Duplicate active paper '+year);
    for(const a of active){
      seen.add(a.index);
      if(a.polygon.some(p=>p.some(v=>!Number.isFinite(v))))throw Error('Invalid geometry '+year);
      const hit=T.pick(active,a.centerX,a.centerY,1);
      if(hit && hit.index!==a.index && T.contains([a.centerX,a.centerY],a.polygon))throw Error('Overlapping center target '+year+' '+a.index);
    }
  }
  results.push({year:Number(year),papers:count,tracks:tracks.length,sampledTargets:frames,sceneCoverage:seen.size,papersWithoutSceneTrack:[...Array(count).keys()].filter(i=>!seen.has(i)).map(i=>i+1)});
}
console.log(JSON.stringify(results,null,2));
