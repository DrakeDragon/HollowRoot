'use strict';
// ===== UI part 3: empire, chronicle, rebirth, trophies, settings, wiring =====
// ---------- empire ----------
function radarSVG(){
 const pl=pillarLevels(),cx=130,cy=125,R=88;
 let g='',poly=[];
 [.25,.5,.75,1].forEach(f=>{g+='<polygon points="'+PILLARS.map((p,i)=>{const a=-Math.PI/2+i*Math.PI/3;return (cx+R*f*Math.cos(a)).toFixed(1)+','+(cy+R*f*Math.sin(a)).toFixed(1);}).join(' ')+'" fill="none" stroke="#2a4a3a" stroke-width="1"/>';});
 PILLARS.forEach((p,i)=>{
  const a=-Math.PI/2+i*Math.PI/3,v=pl[p.id]/PIL_MAX;
  g+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+R*Math.cos(a)).toFixed(1)+'" y2="'+(cy+R*Math.sin(a)).toFixed(1)+'" stroke="#2a4a3a"/>';
  g+='<text x="'+(cx+(R+16)*Math.cos(a)).toFixed(1)+'" y="'+(cy+(R+16)*Math.sin(a)+5).toFixed(1)+'" font-size="15" text-anchor="middle">'+p.i+'</text>';
  poly.push((cx+R*Math.max(.04,v)*Math.cos(a)).toFixed(1)+','+(cy+R*Math.max(.04,v)*Math.sin(a)).toFixed(1));
 });
 g+='<polygon points="'+poly.join(' ')+'" fill="#6cc78866" stroke="#6cc788" stroke-width="2"/>';
 return '<svg viewBox="0 0 260 250" style="width:100%;max-height:260px">'+g+'</svg>';
}
function empireRender(){
 const s=G.s;
 let h='<div class="card" style="text-align:center"><div class="xs mt">Empire rank</div><b class="gd" style="font-size:19px">'+B(()=>RANKS[Math.min(RANKS.length-1,Math.floor(empireScore()/7))])+'</b><div class="xs mt">Chart score '+B(()=>empireScore())+' / '+(PILLARS.length*PIL_MAX)+'</div>'+radarSVG()+'</div>';
 h+='<h2>Pillars</h2>';
 PILLARS.forEach(p=>{
  h+='<div class="card sm"><div class="row"><div class="ico">'+p.i+'</div><div class="grow"><div class="row sb"><b>'+p.n+'</b><b class="gd">'+B(()=>'Lv '+pillarLevel(pillarPoints()[p.id]))+'</b></div><div class="xs mt">'+p.d+'</div>'
   +'<div class="bar" style="margin-top:4px"><i '+BW(()=>{const pt=pillarPoints()[p.id],l=pillarLevel(pt);if(l>=PIL_MAX)return 100;const lo=l===0?0:10*Math.pow(2.2,l-1),hi=10*Math.pow(2.2,l);return pct(pt-lo,hi-lo);})+'></i></div></div></div></div>';
 });
 h+='<h2>Edicts</h2><div class="card sm">Slots used: '+B(()=>G.s.edicts.length+'/'+G.S.edictSlots)+' · Edicts have trade-offs. Mix wisely.</div>';
 EDICTS.forEach(e=>{
  const reqs=Object.keys(e.req).map(k=>PMAP[k].n+' '+e.req[k]).join(', ');
  h+='<div class="card sm"><div class="row"><div class="ico">'+e.i+'</div><div class="grow"><b>'+e.n+'</b><div class="xs mt">'+e.d+'</div><div class="xs gd">'+e.eff.map(effText).join(', ')+'</div></div>'
   +'<button '+act('edict',e.id)+' '+BC('btn sm',()=>G.s.edicts.indexOf(e.id)>=0?'on':(edictAvail(e)?'':'dis'))+'>'+B(()=>G.s.edicts.indexOf(e.id)>=0?'Active':edictAvail(e)?'Enact':'🔒')+'</button></div>'
   +'<div class="xs mt">Requires: '+reqs+'</div></div>';
 });
 return h;
}
// ---------- chronicle ----------
function condText(c){
 switch(c.k){
  case 'tap':return 'Tap '+fmt(chapterGoal(c))+' times';
  case 'bld':return 'Own '+chapterGoal(c)+' × '+BMAP[c.id].n;
  case 'era':return 'Reach '+ERAS[c.n].n;
  case 'lvl':return 'Reach hero level '+c.n;
  case 'tot':return 'Produce '+fmt(c.n)+' '+RES[c.res].n+' (lifetime)';
  case 'reg':return 'Conquer '+c.n+' regions';
  case 'raid':return 'Repel '+c.n+' raid'+(c.n>1?'s':'');
  case 'army':return 'Command '+fmt(c.n)+' units';
  case 'pow':return 'Reach army power '+fmt(c.n);
  case 'cre':return 'Befriend '+c.n+' creatures';
  case 'bond':return 'Raise a creature bond to '+c.n;
  case 'evo':return 'Evolve '+c.n+' creature'+(c.n>1?'s':'');
  case 'tale':return 'Decide '+c.n+' tales';
  case 'asc':return 'Ascend '+c.n+' time'+(c.n>1?'s':'');
  case 'bount':return 'Complete '+c.n+' bounties';
  case 'pop':return 'Reach population '+fmt(c.n);
  case 'tech':return 'Complete '+c.n+' researches';
  case 'comp':return 'Recruit '+c.n+' companions';
  case 'wonder':return 'Build '+c.n+' wonders';
  case 'prest':return 'Rebirth '+c.n+' time';
 }
 return '';
}
function questRender(){
 const s=G.s;let h='';
 if(s.chap<CHAPTERS.length){
  const ch=CHAPTERS[s.chap];
  h+='<div class="card" style="border-color:var(--gold)"><div class="xs mt">Chapter '+(s.chap+1)+' of '+CHAPTERS.length+'</div><b class="gd" style="font-size:17px">'+ch.n+'</b><div style="margin:6px 0">'+condText(ch.c)+'</div>'
   +'<div class="bar g"><i '+BW(()=>pct(condVal(ch.c),chapterGoal(ch.c)))+'></i></div><div class="xs mt">'+B(()=>fmt(Math.min(condVal(ch.c),chapterGoal(ch.c)))+' / '+fmt(chapterGoal(ch.c)))+'</div></div>';
 }else h+='<div class="card gd">All chapters complete. The saga continues in your rebirths.</div>';
 h+='<h2>Story so far</h2>';
 for(let i=s.chap-1;i>=0;i--)h+='<div class="card sm"><b class="gd">'+(i+1)+'. '+CHAPTERS[i].n+'</b><div class="sm" style="margin-top:3px">'+CHAPTERS[i].txt+'</div></div>';
 if(!s.chap)h+='<div class="card sm mt">Your story begins with a tap.</div>';
 return h;
}
// ---------- rebirth ----------
function shopCard(sh){
 return '<div class="card sm"><div class="row"><div class="ico">'+sh.i+'</div><div class="grow"><div class="row sb"><b>'+sh.n+'</b><span class="badge">'+B(()=>shopLvl(sh.id)+'/'+sh.max)+'</span></div><div class="xs mt">'+sh.d+'</div></div>'
  +'<button '+act('shop',sh.id)+' '+BC('btn gold sm',()=>shopLvl(sh.id)<sh.max&&G.s.pres.heart>=shopCost(sh)?'':'dis')+'>'+B(()=>shopLvl(sh.id)>=sh.max?'MAX':'🌳 '+shopCost(sh))+'</button></div></div>';
}
function rebirthRender(){
 const s=G.s;
 let h='<div class="card"><b class="gd" style="font-size:17px">♻️ Rebirth: Sap of the World-Tree</b><div class="sm mt" style="margin:4px 0">Reset your realm (buildings, research, army, map) but keep your hero, party, relics and trophies. Earn Heartwood: it boosts all production permanently (with diminishing returns) and buys permanent upgrades.</div>'
  +'<div class="row sb"><div>Heartwood: <b class="gd">'+B(()=>fmt(G.s.pres.heart))+'</b> <span class="mt xs">(lifetime '+B(()=>fmt(G.s.pres.total))+')</span></div><div>Rebirths: <b>'+B(()=>G.s.pres.count)+'</b></div></div>'
  +'<div style="margin-top:6px">Gain now: <b class="'+'ok'+'">'+B(()=>'+'+fmt(heartGain())+' 🌳')+'</b></div><div class="xs mt">'+B(()=>G.s.era<3?'Reach the Town era to rebirth.':heartGain()<1?'Not enough progress yet.':'Ready.')+'</div>'
  +'<button '+act('rebirth')+' '+BC('btn gold',()=>canRebirth()?'':'dis')+' style="width:100%;margin-top:8px">Rebirth</button></div>';
 h+='<h2>Heartwood Shop</h2>'+SHOP.map(shopCard).join('');
 return h;
}
// ---------- trophies ----------
function trophyRender(){
 const s=G.s,sub=ui.sub.trophy;
 let h=subTabs('trophy',[['ach','Achievements'],['rel','Relics']]);
 if(sub==='ach'){
  h+='<div class="card sm">Earned '+B(()=>G.S.achCount)+' / '+ACH.length+' · +1% all production each</div><div class="card sm">';
  h+=ACH.map(a=>'<div class="ach '+(s.ach[a.id]?'':'no')+'"><div class="ico" style="font-size:20px">'+(s.ach[a.id]?'🏆':'🔒')+'</div><div class="grow"><b>'+a.n+'</b><div class="xs mt">'+a.d+'</div></div></div>').join('');
  h+='</div>';
 }else{
  h+='<div class="card sm">Relics are found on expeditions and survive rebirth. Found: '+Object.keys(s.relics).length+' / '+RELICS.length+'</div>';
  h+=RELICS.map(r=>s.relics[r.id]?'<div class="card sm"><div class="row"><div class="ico">'+r.i+'</div><div class="grow"><b>'+r.n+'</b><div class="xs gd">'+r.eff.map(effText).join(', ')+'</div></div></div></div>':'<div class="card sm" style="opacity:.4"><div class="row"><div class="ico">❔</div><div class="grow"><b>Undiscovered relic</b></div></div></div>').join('');
 }
 return h;
}
// ---------- settings ----------
function setRender(){
 const s=G.s;
 return '<div class="card"><b>Hero name</b><div class="row" style="margin-top:6px"><input type="text" id="nameIn" class="grow" maxlength="20" value="'+s.name.replace(/"/g,'')+'"><button class="btn sm" '+act('rename')+'>Save</button></div></div>'
  +'<div class="card"><div class="row sb"><span>Number style</span><button class="btn sm" '+act('notation')+'>'+(s.set.notation==='sci'?'Scientific':'Short (K, M, B)')+'</button></div>'
  +'<div class="row sb" style="margin-top:8px"><span>Vibration on tap</span><button class="btn sm" '+act('vibe')+'>'+(s.set.vibe?'On':'Off')+'</button></div>'
  +'<div class="row sb" style="margin-top:8px"><span>Tap animations</span><button class="btn sm" '+act('anim')+'>'+(s.set.anim?'On':'Off')+'</button></div></div>'
  +'<div class="card"><b>Save</b><div class="xs mt">Autosaves every 15s. Offline progress up to '+fmtTime(offlineCapSec())+' at '+Math.round(G.S.offEff*100)+'% speed.</div><div class="row" style="margin-top:6px"><button class="btn sm grow" '+act('save')+'>Save now</button><button class="btn sm grow" '+act('export')+'>Export</button></div>'
  +'<textarea id="saveBox" placeholder="Export text appears here. Paste a save here to import."></textarea><button class="btn sm" style="margin-top:6px;width:100%" '+act('import')+'>Import from box</button></div>'
  +'<div class="card"><button class="btn dng" style="width:100%" '+act('reset')+'>Hard reset (delete everything)</button></div>'
  +'<div class="card sm mt"><b>Hollowroot: Rise of the Elven Realm</b><div class="xs">An idle kingdom builder. Tap, build, level your hero, conquer the map, rebirth and grow the World-Tree again.</div></div>';
}
// ---------- tab registry ----------
const TABDEFS={
 realm:{render:realmRender,sig:()=>[G.s.era,G.s.raid.act?1:0,Object.keys(G.s.comp).length,SPELLS.filter(x=>x.era<=G.s.era).length].join()},
 build:{render:buildRender,sig:()=>[G.s.era,Object.keys(G.s.wonders).length].join()},
 hero:{render:heroRender,sig:()=>[ui.sub.hero,G.s.hero.lvl,G.s.hero.cls,Object.keys(G.s.comp).length,G.s.era].join()},
 army:{render:armyRender,sig:()=>G.s.era+''},
 map:{render:mapRender,sig:()=>[ui.sub.map,G.s.era,ui.sel,Object.keys(G.s.regions).length,G.s.exp.map(x=>x.id).join('')].join()+(ui.sub.map==='regions'?'|'+REG.map(r=>hexState(r)[0]+hexState(r)[1]).join(''):'')},
 lore:{render:loreRender,sig:()=>[G.s.era,Object.keys(G.s.techs).length,G.s.rq.map(q=>q.id).join('')].join()},
 empire:{render:empireRender,sig:()=>[G.S.edictSlots,G.s.edicts.join(''),Object.values(pillarLevels()).join('')].join()},
 quest:{render:questRender,sig:()=>G.s.chap+''},
 rebirth:{render:rebirthRender,sig:()=>G.s.era+''},
 trophy:{render:trophyRender,sig:()=>[ui.sub.trophy,Object.keys(G.s.ach).length,Object.keys(G.s.relics).length].join()},
 set:{render:setRender,sig:()=>[G.s.set.notation,G.s.set.vibe,G.s.set.anim,G.S.offCap].join()}
};
// ---------- modal / toast ----------
function showModal(html){const m=$('#modal');m.innerHTML='<div class="box">'+html+'</div>';m.classList.add('on');G.busy=true;}
function closeModal(){const m=$('#modal');m.classList.remove('on');m.innerHTML='';G.busy=false;}
function showToast(msg){
 const t=document.createElement('div');t.className='toast';t.innerHTML=msg;$('#toasts').appendChild(t);
 setTimeout(()=>t.remove(),2900);
 while($('#toasts').children.length>3)$('#toasts').firstChild.remove();
}
function showEvent(ev){
 const e=ev;
 showModal('<h3 style="color:var(--gold);margin-top:0">'+e.t+'</h3><div>'+e.tx+'</div>'+e.ch.map((c,i)=>'<button class="btn" data-ev="'+i+'">'+c.l+'</button>').join(''));
}
function showOffline(off){
 if(!off)return;
 const g=Object.keys(off.gain).map(r=>RES[r].i+' '+fmt(off.gain[r])).join('<br>');
 showModal('<h3 style="color:var(--gold);margin-top:0">Welcome back, '+G.s.name+'</h3><div class="sm mt">You were away '+fmtTime(off.sec)+'. The realm worked for '+fmtTime(off.use)+' at '+Math.round(G.S.offEff*100)+'% efficiency.</div><div style="margin:10px 0">'+g+''+(off.enc?'<br>🐾 '+off.enc+' creature'+(off.enc>1?'s':'')+' wandered in':'')+'</div><button class="btn pri" data-close="1">Continue</button>');
}
function tapFx(x,y,txt,crit){
 if(!G.s.set.anim)return;
 const f=document.createElement('div');f.className='fl'+(crit?' crit':'');f.textContent=txt;f.style.left=(x-20+Math.random()*30)+'px';f.style.top=(y-30)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900);
}
// ---------- actions ----------
function handle(a,p,n){
 const s=G.s;
 switch(a){
  case 'focus':s.focus=p;break;
  case 'era':advanceEra();break;
  case 'spell':castSpell(p);break;
  case 'mult':ui.mult=(p==='max'?'max':+p);break;
  case 'buy':{const b=BMAP[p];buyBuilding(p,nBuy(b));break;}
  case 'work':{if(n==='max')setWorkers(p,Math.max(0,idleWorkers()));else setWorkers(p,+n);break;}
  case 'balance':balanceWorkers();break;
  case 'clearw':clearWorkers();break;
  case 'wonder':buildWonder(p);break;
  case 'sub':ui.sub[p]=n;ui.need=true;break;
  case 'attr':addAttr(p,+n);break;
  case 'skill':learnSkill(p);break;
  case 'class':chooseClass(p);break;
  case 'respec':if(!respec())showToast('Need '+fmt(respecCost()[0][1])+' gold');break;
  case 'gear':upgradeGear(p);break;
  case 'comp':compLevelUp(p);break;
  case 'train':{const u=UMAP[p];const m=ui.mult;trainUnit(p,m==='max'?Math.max(1,uMaxN(u)):m);break;}
  case 'sel':ui.sel=p;ui.need=true;break;
  case 'conquer':conquer(p);break;
  case 'exp':startExp(p);break;
  case 'tech':startTech(p);break;
  case 'edict':toggleEdict(p);break;
  case 'shop':buyShop(p);break;
  case 'rebirth':
   if(!canRebirth())break;
   showModal('<h3 style="color:var(--gold);margin-top:0">Rebirth?</h3><div class="sm">Gain <b class="gd">'+fmt(heartGain())+' Heartwood</b>. Buildings, research, army and map reset. Hero, party, relics, trophies and Heartwood stay.</div><button class="btn gold" data-reb="1">Rebirth now</button><button class="btn" data-close="1">Cancel</button>');
   break;
  case 'rename':{const v=($('#nameIn').value||'Warden').trim().slice(0,20)||'Warden';s.name=v;showToast('Name saved');break;}
  case 'notation':s.set.notation=s.set.notation==='sci'?'short':'sci';break;
  case 'vibe':s.set.vibe=!s.set.vibe;break;
  case 'anim':s.set.anim=!s.set.anim;break;
  case 'save':save();showToast('Saved');break;
  case 'export':$('#saveBox').value=exportSave();break;
  case 'import':try{importSave($('#saveBox').value);showToast('Imported');}catch(e){showToast('Invalid save text');}break;
  default:handleExtra(a,p,n);break;
  case 'reset':showModal('<h3 style="color:var(--red);margin-top:0">Delete everything?</h3><div class="sm">This cannot be undone.</div><button class="btn dng" data-hard="1">Yes, delete my save</button><button class="btn" data-close="1">Cancel</button>');break;
 }
 G.dirty=true;
}
function wireEvents(){
 const view=$('#view');
 view.addEventListener('pointerdown',e=>{
  const t=e.target.closest('#tapBtn');
  if(t){
   e.preventDefault();
   t.classList.add('p');setTimeout(()=>t.classList.remove('p'),80);
   const r=tap();tapFx(e.clientX,e.clientY,'+'+fmt(r.v),r.crit);
   if(G.s.set.vibe&&navigator.vibrate)navigator.vibrate(r.crit?25:8);
  }
 });
 view.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;
  handle(el.dataset.a,el.dataset.p,el.dataset.n);
  uiFrame();
 });
 $('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){setTab(b.dataset.tab);uiFrame();}});
 $('#modal').addEventListener('click',e=>{
  const t=e.target;
  if(t.dataset.ev!==undefined&&G.pendingEvent){const c=G.pendingEvent.ch[+t.dataset.ev];if(c.f)resolveEvent(c.f);else{G.pendingEvent=null;}closeModal();uiFrame();}
  else if(t.dataset.close)closeModal();
  else if(t.dataset.reb){closeModal();rebirth();ui.need=true;uiFrame();}
  else if(t.dataset.hard){closeModal();hardReset();ui.need=true;uiFrame();}
  else if(t.dataset.asc){closeModal();ascend();ui.need=true;uiFrame();}
  else if(t.dataset.tale){const q=t.dataset.tale.split('|');chooseTale(q[0],+q[1]);closeModal();ui.need=true;uiFrame();}
 });
}
// ---------- main ----------
function startGame(){
 G.hooks.toast=showToast;
 G.hooks.event=showEvent;
 G.hooks.tale=showTale;
 G.hooks.struct=()=>{};
 G.hooks.log=()=>{};
 buildShell();
 const off=initGame();
 wireEvents();
 renderTab();uiFrame();
 if(off)showOffline(off);
 let last=Date.now();
 setInterval(()=>{
  const now=Date.now();let dt=(now-last)/1000;last=now;
  if(dt<=0)return;
  if(dt>30){const off=applyOffline(dt);showOffline(off);dt=.1;}
  tick(Math.min(dt,30));
 },100);
 setInterval(uiFrame,250);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 window.addEventListener('pagehide',save);
}
window.addEventListener('DOMContentLoaded',startGame);
