(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const engine = window.__ARCHIVE_DEBUG__;
  const all = window.PUBLICATIONS || [];
  const eras = [[2027,2026,2025,2024],[2023,2022,2021,2020],[2019,2018,2017,2016],[2015,2014,2013,2012],[2011,2010]];
  const years = eras.flat();
  const papers = year => all.filter(p => Number(p.year) === Number(year));
  const junctionLabel = i => `Junction ${i+1}`;
  const yearRange = i => `${eras[i].at(-1)}–${eras[i][0]}`;
  const roman = ['I','II','III','IV','V'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const href = p => (p.links?.find(l => /paper|preprint/i.test(l.label)) || p.links?.[0])?.href || 'publications-field-guide.html';
  let stopAtDiscovery = true;
  let guide = false, destination = null, autoBusy = false, atlasSelection = {type:'year', year:2024, era:0};
  let lastMode = '', lastEra = null, lastYear = null, noteTimer = null, overlayFocus = null;
  const seen = new Set();
  let shelfOpen = false;
  $('totalPapers').textContent = all.length;
  $('totalYears').textContent = years.filter(y => papers(y).length).length;
  $('depthRail').innerHTML = '<span class="rail-heading">Junctions</span>' + eras.map((ys,i) => `<button type="button" data-era="${i}" aria-label="Navigate to junction ${i+1}, ${yearRange(i)}"><b>${String(i+1).padStart(2,'0')}</b><span>${yearRange(i)}</span><i aria-hidden="true"></i></button>`).join('') + '<button type="button" id="railMap">Open map ↗</button>';
  $('depthRail').addEventListener('click', e => { const b=e.target.closest('button'); if(b?.dataset.era) openAtlasJunction(Number(b.dataset.era)); else if(b)openAtlas(); });
  $('junctionShortcuts').innerHTML=eras.map((ys,i)=>`<button type="button" data-junction="${i}"><b>${junctionLabel(i)}</b><span>${yearRange(i)}</span></button>`).join('');
  $('junctionShortcuts').addEventListener('click',e=>{const b=e.target.closest('button');if(b)selectAtlasJunction(Number(b.dataset.junction));});
  $('landingMap').addEventListener('click',()=>openAtlas());
  addEventListener('keydown',e=>{
    if(e.code!=='KeyM'||e.metaKey||e.ctrlKey||e.altKey||e.target.closest('input,textarea')||engine.state.mode==='artifact')return;
    e.preventDefault(); if($('atlas').open)closeDialog($('atlas'));else if(!document.querySelector('dialog[open]'))openAtlas();
  });

  function note(text) {
    clearTimeout(noteTimer); $('arrivalNote').textContent=text; $('arrivalNote').classList.add('is-visible');
    noteTimer=setTimeout(()=>$('arrivalNote').classList.remove('is-visible'),3300);
  }
  function setGuide(value, target=null) {
    guide=value; destination=target;
    if (!value) engine.pausePlayback();
    $('guideButton').setAttribute('aria-pressed', String(value));
    $('guideButton').innerHTML=value ? '<span aria-hidden="true">Ⅱ</span> Pause' : '<span aria-hidden="true">▷</span> Play';
    if(!value && engine.state.mode==='chamber') $('guideButton').innerHTML='<span aria-hidden="true">▷</span> Play';
  }
  function stopOnInput(e) {
    if(document.querySelector('dialog[open]')) return;
    if(e.type==='wheel' && e.target.closest('.paper-shelf')) return;
    if(e.type==='keydown' && !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyS','Escape'].includes(e.code)) return;
    if(guide) setGuide(false);
  }
  addEventListener('wheel',stopOnInput,{capture:true,passive:true});
  addEventListener('keydown',stopOnInput,true);
  $('game').addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse'&&!e.target.closest('button,a')) stopOnInput(e); },{passive:true});
  $('guideButton').addEventListener('click',()=>{stopAtDiscovery=false;setGuide(!guide);});
  addEventListener('archive:playback-blocked',()=>{setGuide(false);note('Scroll to move through the cave.');});
  $('enterButton').addEventListener('click',()=>{
    if(reduced) return;
    engine.beginDescent().then(()=>{if(engine.state.mode==='spine'){stopAtDiscovery=true;setGuide(true);}});
  });
  if(reduced) {
    $('enterButton').querySelector('span').textContent='Publications';
    document.querySelector('.landing__controls').textContent='Reduced motion · browse the map or publication list';
    $('enterButton').addEventListener('click',e=>{e.stopImmediatePropagation();openIndex();},true);
    $('atlasTravel').innerHTML='View publications <span>↗</span>';
  }
  $('mainPathButton').addEventListener('click',()=>{if(!reduced)setGuide(true);});
  $('yearConstellation').addEventListener('click',e=>{if(e.target.closest('.portal')&&!reduced){stopAtDiscovery=true;setGuide(true);}});
  $('yearConstellation').addEventListener('click',e=>{const b=e.target.closest('.portal');if(reduced&&b){e.stopImmediatePropagation();openIndex(b.dataset.year);}},true);
  [$('pathReturnButton'),$('returnButton')].forEach(b=>b.addEventListener('click',()=>setGuide(false),true));

  function syncMode() {
    const s=engine.state;
    const changed=s.mode!==lastMode || s.year!==lastYear || s.era!==lastEra;
    if(!changed) return;
    const previous=lastMode;
    lastMode=s.mode; lastYear=s.year; lastEra=s.era;
    $('transport').hidden=reduced || !['spine','route','chamber'].includes(s.mode);
    $('paperShelf').hidden=s.mode!=='chamber';
    $('depthRail').querySelectorAll('button[data-era]').forEach((b,i)=>{
      b.classList.toggle('is-current',i===s.era);
      if(i===s.era)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');
    });
    if(s.mode==='hub' && !s.year && !destination){setGuide(false);if(previous!=='hub')note('Choose a year or another junction.');}
    if(s.mode==='artifact'){setGuide(false);$('game').querySelectorAll(':scope > :not(#artifactView)').forEach(el=>el.inert=true);}
    else if(previous==='artifact') $('game').querySelectorAll(':scope > *').forEach(el=>el.inert=false);
    if(s.mode==='chamber') {
      if ($('shelfPapers').dataset.year !== String(s.year)) renderShelf(s.year);
      if(!seen.has(s.year)){seen.add(s.year);note(`${papers(s.year).length} papers. Select a numbered button to open one.`);}
    }
  }
  function renderShelf(year) {
    const list=papers(year);
    $('shelfPapers').dataset.year=String(year);
    $('shelfLabel').textContent=`${year} papers`;
    $('shelfCount').textContent=`${list.length} papers`;
    $('shelfPapers').innerHTML=list.map((p,i)=>`<button class="shelf-paper" type="button" data-index="${i}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${escape(p.title)}</strong><small>${escape(p.venue)}</small></span></button>`).join('');
    $('shelfPapers').hidden=!shelfOpen;
    $('paperNumbers').innerHTML=list.map((p,i)=>`<button type="button" data-index="${i}" aria-label="Open paper ${i+1}: ${escape(p.title)}" title="${escape(p.title)}">${String(i+1).padStart(2,'0')}</button>`).join('');
  }
  $('shelfToggle').addEventListener('click',()=>{
    shelfOpen=!shelfOpen;setGuide(false);
    $('shelfPapers').hidden=!shelfOpen;
    $('shelfToggle').setAttribute('aria-expanded',String(shelfOpen));
    $('shelfToggle').querySelector('i').textContent=shelfOpen?'↓':'↑';
    dispatchEvent(new Event('archive:layout'));
  });
  $('paperNumbers').addEventListener('click',e=>{const b=e.target.closest('button');if(b)engine.inspectArtifact(Number(b.dataset.index));});
  addEventListener('archive:visible',e=>{$('paperNumbers').querySelectorAll('button').forEach(b=>b.classList.toggle('is-visible',e.detail.includes(Number(b.dataset.index))));});
  $('paperMarkers').addEventListener('pointerdown',()=>setGuide(false));
  $('shelfPapers').addEventListener('click',e=>{const b=e.target.closest('button');if(b)engine.inspectArtifact(Number(b.dataset.index));});
  addEventListener('archive:paper',e=>{
    const {paper,index}=e.detail;
    $('artifactTopics').innerHTML=(paper.topics||[]).map(t=>`<span>${escape(t)}</span>`).join('');
    $('artifactView').dataset.number=String(index+1).padStart(2,'0');
  });
  // Engine changes are observed after a transition has established its full state.
  addEventListener('archive:mode',()=>queueMicrotask(syncMode));
  $('artifactView').addEventListener('click',e=>{if(e.target===$('artifactView'))engine.closeArtifact();});

  function openDialog(dialog) {
    setGuide(false);overlayFocus=document.activeElement;
    if(!dialog.open)dialog.showModal();
  }
  function closeDialog(dialog) {dialog.close();overlayFocus?.focus({preventScroll:true});}
  function openAtlas(year) {if(year||engine.state.year)selectAtlasYear(year||engine.state.year);else selectAtlasJunction(Math.max(0,engine.state.era));openDialog($('atlas'));}
  function openAtlasJunction(era) {selectAtlasJunction(era);openDialog($('atlas'));}
  $('atlasButton').addEventListener('click',()=>openAtlas());
  $('atlasClose').addEventListener('click',()=>closeDialog($('atlas')));
  $('indexButton').addEventListener('click',()=>openIndex());
  $('indexClose').addEventListener('click',()=>closeDialog($('publicationIndex')));
  [$('atlas'),$('publicationIndex')].forEach(d=>d.addEventListener('close',()=>overlayFocus?.focus({preventScroll:true})));

  // The cartography is procedural, but its branches correspond exactly to the media graph.
  let map='<svg viewBox="0 0 620 560" role="group" aria-label="Map of five cave depths, with publication years from 2027 to 2010">';
  for(let ring=0;ring<16;ring++){
    let path='';
    for(let step=0;step<=120;step++){
      const a=step/120*Math.PI*2;
      const rx=54+ring*15,ry=90+ring*14;
      const wav=1+.06*Math.sin(a*7+ring*.28)+.035*Math.cos(a*11-ring*.19);
      const x=310+Math.cos(a)*rx*wav,y=282+Math.sin(a)*ry*wav;
      path+=`${step?'L':'M'}${x.toFixed(1)},${y.toFixed(1)} `;
    }
    map+=`<path class="map-contour" d="${path}Z"/>`;
  }
  const route='M310 24 C290 62 340 74 310 112 S278 170 310 205 S340 260 310 298 S280 350 310 391 S340 448 310 484 L310 530';
  map+=`<path class="map-main" d="${route}"/><path class="map-current" d="${route}"/><text class="map-caption" x="328" y="30">SURFACE</text>`;
  eras.forEach((ys,i)=>{
    const y=112+i*93;
    map+=`<g class="map-junction" role="button" tabindex="0" data-junction="${i}" aria-label="Preview junction ${i+1}, ${yearRange(i)}"><circle class="map-hit" cx="310" cy="${y}" r="28"/><circle class="map-node" cx="310" cy="${y}" r="12"/><text x="310" y="${y+4}" text-anchor="middle">${i+1}</text></g>`;
    ys.forEach((year,j)=>{
      const x=[79,190,430,541][j],yy=y+[-23,26,26,-23][j];
      map+=`<path class="map-branch" d="M310 ${y} C${(310+x)/2} ${y-25} ${x+ (x<310?45:-45)} ${yy+20} ${x} ${yy}"/><g class="map-year" role="button" tabindex="0" data-year="${year}" aria-label="Preview ${year}, ${papers(year).length} publications"><circle class="map-hit" cx="${x}" cy="${yy}" r="36"/><circle cx="${x}" cy="${yy}" r="7"/><text x="${x}" y="${yy-19}" text-anchor="middle">${year}</text><text class="map-count" x="${x}" y="${yy+25}" text-anchor="middle">${papers(year).length} ${papers(year).length===1?'PAPER':'PAPERS'}</text></g>`;
    });
  });
  map+='<text class="map-caption" x="328" y="534">2010–2011</text></svg>';
  $('atlasMap').innerHTML=map;
  function selectAtlasYear(year) {
    atlasSelection={type:'year',year,era:eras.findIndex(e=>e.includes(year))};const list=papers(year),depth=eras.findIndex(e=>e.includes(year));
    $('atlasYear').textContent=year;
    $('atlasDepth').textContent=`${junctionLabel(depth)} / ${yearRange(depth)}`;
    $('atlasTravel').innerHTML='Go to year <span>↗</span>';
    $('atlasYears').innerHTML='';
    $('junctionShortcuts').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));
    $('atlasMap').querySelectorAll('.map-junction').forEach(n=>n.classList.remove('is-selected'));
    $('atlasCount').textContent=`${list.length} publication${list.length===1?'':'s'}`;
    $('atlasSample').textContent=list[0]?.title || 'Explore the archive from this year.';
    $('atlasImage').src=`assets/archive-below/stills/graph/year-${year}-gallery-rest.png`;
    $('atlasImage').alt=`The ${year} publication chamber`;
    $('atlasMap').querySelectorAll('.map-year').forEach(n=>{
      const selected=Number(n.dataset.year)===year;n.classList.toggle('is-selected',selected);n.setAttribute('aria-pressed',String(selected));
    });
  }
  function selectAtlasJunction(era) {
    atlasSelection={type:'junction',era};
    $('atlasYear').textContent=junctionLabel(era);
    $('atlasDepth').textContent='Main path';
    $('atlasCount').textContent=yearRange(era);
    $('atlasSample').textContent='Choose a year when you arrive, or select one below.';
    $('atlasImage').src=`assets/archive-below/stills/graph/hub-depth-${String(era+1).padStart(2,'0')}.png`;
    $('atlasImage').alt=`Junction ${era+1}`;
    $('atlasTravel').innerHTML='Go to junction <span>↗</span>';
    $('atlasYears').innerHTML=eras[era].map(year=>`<button type="button" data-year="${year}">${year}<small>${papers(year).length} papers</small></button>`).join('');
    $('atlasMap').querySelectorAll('.map-year').forEach(n=>{n.classList.remove('is-selected');n.setAttribute('aria-pressed','false');});
    $('atlasMap').querySelectorAll('.map-junction').forEach(n=>{const current=Number(n.dataset.junction)===era;n.classList.toggle('is-selected',current);n.setAttribute('aria-pressed',String(current));});
    $('junctionShortcuts').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.junction)===era)));
  }
  function selectMapNode(node) {if(node?.dataset.year)selectAtlasYear(Number(node.dataset.year));else if(node?.dataset.junction!==undefined)selectAtlasJunction(Number(node.dataset.junction));}
  $('atlasMap').addEventListener('click',e=>selectMapNode(e.target.closest('.map-year,.map-junction')));
  $('atlasMap').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();selectMapNode(e.target.closest('.map-year,.map-junction'));}});
  $('atlasYears').addEventListener('click',e=>{const b=e.target.closest('button');if(b)selectAtlasYear(Number(b.dataset.year));});
  $('atlasTravel').addEventListener('click',async()=>{
    const target={...atlasSelection};
    closeDialog($('atlas'));
    if(reduced){if(target.type==='year')openIndex(String(target.year));else await engine.showJunctionStill(target.era);return;}
    if(engine.state.mode==='artifact')engine.closeArtifact();
    if(engine.state.mode==='landing')await engine.beginDescent();
    // A route may still be completing when the map opens. Finish that handoff first.
    while(engine.busy)await new Promise(resolve=>setTimeout(resolve,50));
    if(engine.state.year && (target.type==='junction'||engine.state.year!==target.year))await engine.returnToHub();
    if(target.type==='year' && engine.state.year===target.year && engine.state.mode==='chamber'){note(`${target.year} papers`);return;}
    if(target.type==='junction' && engine.state.mode==='hub' && engine.state.era===target.era){note(`${junctionLabel(target.era)} · ${yearRange(target.era)}`);return;}
    stopAtDiscovery=true;setGuide(true,target);note(`Going to ${target.type==='junction'?junctionLabel(target.era):target.year} · scroll to take control`);
  });
  function openIndex(query='') {
    $('paperSearch').value=query;renderIndex(query);openDialog($('publicationIndex'));$('paperSearch').focus();
  }
  function renderIndex(query='') {
    const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const found=all.filter(p=>{
      const text=[p.title,p.year,p.venue,...(p.authors||[]),...(p.topics||[])].join(' ').toLowerCase();
      return terms.every(t=>text.includes(t));
    });
    $('searchCount').textContent=`${found.length} papers`;
    $('indexResults').innerHTML=found.length?found.map(p=>`<a class="index-paper" href="${escape(href(p))}" target="_blank" rel="noopener"><span>${escape(p.year==='Unpublished'?'In review':p.year)}</span><div><h3>${escape(p.title)}</h3><p>${escape((p.authors||[]).join(' · '))}</p><small>${escape(p.venue)}</small></div><span aria-hidden="true">↗</span></a>`).join(''):'<p class="empty-results">No papers match this search. Try another word or year.</p>';
    $('indexResults').scrollTop=0;
  }
  $('paperSearch').addEventListener('input',e=>renderIndex(e.target.value));

  document.addEventListener('visibilitychange',()=>{if(document.hidden)setGuide(false);});

  const canvas=$('motes'),ctx=canvas.getContext('2d');
  let w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),mouseX=.5,mouseY=.5;
  const motes=Array.from({length:innerWidth<700?20:65},()=>({x:Math.random(),y:Math.random(),z:.2+Math.random()*.8,r:.4+Math.random()*1.2,phase:Math.random()*Math.PI*2}));
  function resize(){w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);}
  resize();addEventListener('resize',resize);
  addEventListener('pointermove',e=>{mouseX=e.clientX/w;mouseY=e.clientY/h;$('game').style.setProperty('--mouse-x',`${mouseX*100}%`);$('game').style.setProperty('--mouse-y',`${mouseY*100}%`);},{passive:true});
  let before=performance.now(),previousTime=0,frame=0;
  async function guideStep(dt) {
    if(!guide || autoBusy || engine.busy || document.querySelector('dialog[open]'))return;
    const s=engine.state;
    if($('loading').classList.contains('is-error')){setGuide(false);return;}
    if(s.mode==='hub'){
      if(!destination){setGuide(false);return;}
      const targetEra=destination.era;
      autoBusy=true;
      try{if(s.era===targetEra){if(destination.type==='junction'){setGuide(false);note(`${junctionLabel(targetEra)} · ${yearRange(targetEra)}`);}else await engine.enterYear(destination.year);}else await engine.leaveHub(s.era<targetEra?1:-1);}
      finally{autoBusy=false;}
      return;
    }
    if(s.mode==='chamber' && ((stopAtDiscovery && s.discoverableRegions>0 && s.desiredTime>.85) || s.desiredTime>=s.duration-.12)){setGuide(false);return;}
    if(['spine','route','chamber'].includes(s.mode)){
      const targetEra=destination?.era ?? null;
      const reverse=s.mode==='spine' && destination && s.key?.startsWith('trunk-') && Number(s.key.split('-')[1])>targetEra;
      if(reverse)engine.moveBy(-dt*2.8);
      else engine.playForward(destination?2.2:s.mode==='chamber'?.8:1.0);
    }
  }
  function tick(now){
    const dt=Math.min(.05,(now-before)/1000);before=now;
    if(!document.hidden){
      guideStep(dt);if(frame++%6===0)syncMode();
      if(!reduced&&ctx){
        const s=engine.state;let velocity=Math.abs(s.desiredTime-previousTime);if(velocity>1)velocity=0;previousTime=s.desiredTime;
        ctx.clearRect(0,0,w,h);
        for(const p of motes){
          p.y-=dt*.008*p.z;p.x+=dt*.003*Math.sin(now*.0001+p.phase);
          if(velocity){p.x+=(p.x-.5)*velocity*.025*p.z;p.y+=(p.y-.48)*velocity*.025*p.z;}
          if(p.y<-.03)p.y=1.03;if(p.x<-.05)p.x=1.02;if(p.x>1.05)p.x=-.02;
          const x=p.x*w+(mouseX-.5)*10*p.z,y=p.y*h+(mouseY-.5)*8*p.z;
          const opacity=(.12+.28*(.5+.5*Math.sin(now*.0005+p.phase)))*p.z;
          ctx.beginPath();ctx.fillStyle=`rgba(237,214,170,${opacity})`;ctx.arc(x,y,p.r*p.z,0,Math.PI*2);ctx.fill();
          if(p.z>.8){const glow=ctx.createRadialGradient(x,y,0,x,y,7);glow.addColorStop(0,`rgba(236,199,130,${opacity*.25})`);glow.addColorStop(1,'rgba(236,199,130,0)');ctx.fillStyle=glow;ctx.fillRect(x-7,y-7,14,14);}
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  syncMode();
  window.__ASTRA__={get state(){return {guide,destination,seen:[...seen],shelfOpen};}};
})();
