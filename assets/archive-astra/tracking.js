/* Geometry and hit testing shared by the browser and the offline click audit. */
(function (root) {
  'use strict';
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const bounds = points => [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
  const area = b => Math.max(0,b[2]-b[0])*Math.max(0,b[3]-b[1]);
  function resample(points,n=24) {
    const lengths=points.map((p,i)=>Math.hypot(p[0]-points[(i+1)%points.length][0],p[1]-points[(i+1)%points.length][1]));
    const total=lengths.reduce((a,b)=>a+b,0);
    return Array.from({length:n},(_,i)=>{let d=i/n*total,j=0;while(j<lengths.length-1&&d>lengths[j])d-=lengths[j++];const a=points[j],b=points[(j+1)%points.length],t=d/(lengths[j]||1);return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];});
  }
  function corrected(year,track,key) {
    let polygon=key.polygon;
    // Reviewed against decoded 6.1s/7s frames: the detector included the skylight.
    if(year===2022&&track.id===4&&key.progress<.68){
      const t=clamp((key.progress-.6)/.083333,0,1),b=[639,291-8*t,710+t,382-2*t];
      polygon=[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]];
    }
    // The previous terminal keyframes stretched the front tablets across the floor.
    if(year===2014&&track.id===5&&key.progress>.99)polygon=[[80,280],[347,309],[431,624],[160,686]];
    if(year===2014&&track.id===7&&key.progress>.99)polygon=[[1006,340],[1260,313],[1196,696],[913,652]];
    if(year===2014&&track.id===1&&key.progress>=.65){
      const t=clamp((key.progress-.65)/.35,0,1);
      polygon=[[629-4*t,239-9*t],[725+2*t,239-9*t],[730,379-2*t],[628,379-2*t]];
    }
    if(year===2012&&track.id===8&&key.progress>.99)polygon=[[119,102],[389,157],[419,512],[148,538]];
    return {...key,polygon:resample(polygon),bbox:bounds(polygon)};
  }
  function prepare(tracks,year,paperCount) {
    return tracks.filter(t=>t.paper<paperCount).flatMap(track=>{
      const reviewed=track.keyframes.every(k=>(k.confidence||0)>=.97);
      const keys=track.keyframes.filter(k=>reviewed||(k.confidence??1)>=.72).map(k=>corrected(year,track,k)).sort((a,b)=>a.progress-b.progress);
      if(!keys.length)return [];
      const groups=[];
      for(const key of keys){
        const last=groups.at(-1),prev=last?.at(-1);
        // Never interpolate through long detector dropouts or across different objects.
        // Reviewed sparse landmark tracks are intentionally authored for interpolation.
        if(!last||(!reviewed && key.progress-prev.progress>.075 && key.progress<.99))groups.push([key]);else last.push(key);
      }
      return groups.map((keyframes,i)=>({id:`${year}-${track.id}-${i}`,paper:track.paper,reviewed,
        start:Math.max(0,Math.max(track.start,keyframes[0].progress-.018)),
        end:Math.min(1,Math.min(track.end,keyframes.at(-1).progress+.018)),anchor:track.anchor,keyframes}));
    });
  }
  function geometry(track,p) {
    const ks=track.keyframes;let i=ks.findIndex(k=>k.progress>=p);if(i<0)return ks.at(-1);if(i===0)return ks[0];
    const a=ks[i-1],b=ks[i],t=clamp((p-a.progress)/(b.progress-a.progress),0,1);
    const polygon=a.polygon.map((v,j)=>v.map((x,k)=>x+(b.polygon[j][k]-x)*t));
    return {polygon,bbox:bounds(polygon),confidence:(a.confidence??1)*(1-t)+(b.confidence??1)*t};
  }
  function filmRect(w,h) {const s=Math.max(w/1344,h/768);return [(1344-w/s)/2,(768-h/s)/2,(1344+w/s)/2,(768+h/s)/2];}
  function intersection(a,b) {return Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0]))*Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]));}
  function candidates(tracks,p,w,h) {
    const rect=filmRect(w,h),best=new Map();
    for(const track of tracks){
      if(p<track.start||p>track.end)continue;
      const g=geometry(track,p),visible=intersection(g.bbox,rect);if(visible<20)continue;
      const candidate={track,...g,index:track.paper,centerX:(g.bbox[0]+g.bbox[2])/2,centerY:(g.bbox[1]+g.bbox[3])/2,
        score:(track.reviewed?3:0)+(g.confidence??.8)+Math.min(.25,Math.sqrt(visible)/1000)};
      if(!best.has(track.paper)||candidate.score>best.get(track.paper).score)best.set(track.paper,candidate);
    }
    const chosen=[];
    for(const c of [...best.values()].sort((a,b)=>b.score-a.score)){
      // The same stone occasionally has two detector IDs with different paper IDs.
      if(chosen.some(o=>intersection(c.bbox,o.bbox)/Math.min(area(c.bbox),area(o.bbox))>.72 || contains([c.centerX,c.centerY],o.polygon) || contains([o.centerX,o.centerY],c.polygon)))continue;
      chosen.push(c);
    }
    return chosen.sort((a,b)=>a.index-b.index);
  }
  function contains(point,poly) {
    let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const a=poly[i],b=poly[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
    }return inside;
  }
  function distance(point,poly){return Math.min(...poly.map((a,i)=>{const b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((point[0]-a[0])*dx+(point[1]-a[1])*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(point[0]-a[0]-dx*t,point[1]-a[1]-dy*t);}));}
  function pick(list,x,y,scale) {
    const contained=list.filter(c=>contains([x,y],c.polygon));
    if(contained.length)return contained.sort((a,b)=>area(a.bbox)-area(b.bbox))[0];
    return list.map(c=>({c,d:distance([x,y],c.polygon)*scale})).filter(v=>v.d<14).sort((a,b)=>a.d-b.d)[0]?.c || null;
  }
  root.ArchiveTracking={prepare,geometry,candidates,contains,pick,filmRect};
})(typeof window==='undefined'?globalThis:window);
