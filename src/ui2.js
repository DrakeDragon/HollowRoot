'use strict';
// ===== UI part 2: hero, army, map, lore =====
function subTabs(tab,list){
 return '<div class="tabs">'+list.map(x=>'<button class="btn sm '+(ui.sub[tab]===x[0]?'on':'')+'" '+act('sub',tab,x[0])+'>'+x[1]+'</button>').join('')+'</div>';
}
// ---------- hero ----------
function heroHeader(){
 const s=G.s,h=s.hero;
 return '<div class="card"><div class="row">'+heroSVG()+'<div class="grow"><div class="row sb"><b style="font-size:17px">'+s.name+'</b><span class="badge">'+B(()=>'Lv '+G.s.hero.lvl+(G.s.hero.lvl>=200?' MAX':''))+'</span></div>'
  +'<div class="xs mt">'+B(()=>{const c=G.s.hero.cls?CLASSES.find(x=>x.id===G.s.hero.cls):null;return c?c.i+' '+c.n:'Classless (choose at Lv 10)';})+'</div>'
  +'<div class="bar g" style="margin:4px 0"><i '+BW(()=>pct(G.s.hero.xp,xpNeed(G.s.hero.lvl)))+'></i></div>'
  +'<div class="xs mt">'+B(()=>'XP '+fmt(G.s.hero.xp)+' / '+fmt(xpNeed(G.s.hero.lvl))+' · +'+fmt(Math.max(.2,G.xps*.2))+'/tap')+'</div></div></div>'
  +'<div class="row" style="margin-top:6px"><span class="badge">Attribute pts: '+B(()=>G.s.hero.pts)+'</span><span class="badge">Skill pts: '+B(()=>G.s.hero.sp)+'</span></div></div>';
}
function heroStats(){
 const h=G.s.hero;let o='';
 if(!h.cls&&h.lvl>=10){
  o+='<div class="card" style="border-color:var(--gold)"><b class="gd">Choose your class</b><div class="xs mt">Unlocks 4 class skills.</div><div class="grid2" style="margin-top:6px">'+CLASSES.map(c=>'<button class="btn" '+act('class',c.id)+' style="text-align:left">'+c.i+' <b>'+c.n+'</b><div class="xs mt" style="font-weight:400">'+c.d+'</div></button>').join('')+'</div></div>';
 }
 o+=ATTR.map(a=>'<div class="card sm attr"><div class="row"><div class="ico">'+a.i+'</div><div class="grow"><div class="row sb"><b>'+a.n+'</b><b class="gd">'+B(()=>G.s.hero.attr[a.id])+'</b></div><div class="xs mt">'+a.d+'</div></div>'
  +'<button '+act('attr',a.id,1)+' '+BC('btn sm',()=>G.s.hero.pts>0?'':'dis')+'>+1</button><button '+act('attr',a.id,5)+' '+BC('btn sm',()=>G.s.hero.pts>0?'':'dis')+'>+5</button></div></div>').join('');
 o+='<div class="card sm"><div class="xs mt">Derived</div><div class="sm">'+B(()=>{const S=G.S;return 'Tap x'+fmt(S.click)+' · Production x'+fmt(S.mulAll)+' · Army x'+fmt(S.armyMul)+' · Defense x'+fmt(S.raidDef)+' · Crit '+Math.round(S.crit*100)+'% (x'+S.critMul.toFixed(1)+')';})+'</div></div>';
 if(h.cls||Object.keys(h.skills).length||h.pts<999)o+='<button class="btn dng sm" '+act('respec')+'>Respec — '+B(()=>costHtml(respecCost()))+'</button>';
 return o;
}
function skillCard(sk){
 const h=()=>G.s.hero,rank=()=>h().skills[sk.id]||0;
 const cls=sk.cls?CLASSES.find(c=>c.id===sk.cls):null;
 return '<div class="card sm"><div class="row"><div class="ico">'+sk.i+'</div><div class="grow"><div class="row sb"><b>'+sk.n+(cls?'<span class="tag">'+cls.n+'</span>':'')+'</b><span class="badge">'+B(()=>rank()+'/'+sk.max)+'</span></div>'
  +'<div class="xs gd">'+sk.eff.map(effText).join(', ')+' per rank</div><div class="xs mt">Req Lv '+sk.lvl+'</div></div>'
  +'<button '+act('skill',sk.id)+' '+BC('btn sm',()=>skillAvail(sk)&&h().sp>0&&rank()<sk.max?'':'dis')+'>Learn</button></div></div>';
}
function heroSkills(){
 const h=G.s.hero;
 const list=SKILLS.filter(s=>!s.cls||s.cls===h.cls||!h.cls);
 return list.map(skillCard).join('')+(h.cls?'':'<div class="card sm mt">Choose a class at Lv 10 to see its skills.</div>');
}
function heroGear(){
 return GEAR.map(g=>{
  const t=()=>G.s.hero.gear[g.id];
  return '<div class="card sm"><div class="row"><div class="ico">'+g.i+'</div><div class="grow"><b>'+g.n+'</b><div class="xs gd">'+B(()=>gearName(g,t()))+'</div><div class="xs mt">'+g.d+'</div></div>'
   +'<span class="badge">T'+B(()=>t())+'/'+B(()=>gearMaxTier())+'</span></div><div class="row sb" style="margin-top:6px"><div class="sm">'+B(()=>t()>=gearMaxTier()?'<span class="mt">'+(t()>=GEAR_MAX?'Maxed':'Advance era for more tiers')+'</span>':costHtml(gearUpCost(g.id)))+'</div><button '+act('gear',g.id)+' '+BC('btn pri sm',()=>t()<gearMaxTier()&&canPay(gearUpCost(g.id))?'':'dis')+'>Forge</button></div></div>';
 }).join('');
}
function heroParty(){
 const s=G.s;
 return COMP.map(c=>{
  const st=s.comp[c.id];
  if(!st)return '<div class="card sm" style="opacity:.5"><div class="row"><div class="ico">❔</div><div class="grow"><b>???</b><div class="xs mt">Joins at '+(c.join.lvl?'hero Lv '+c.join.lvl:ERAS[c.join.era].n)+'</div></div></div></div>';
  return '<div class="card sm"><div class="row"><div class="ico">'+c.i+'</div><div class="grow"><div class="row sb"><b>'+c.n+'</b><span class="badge">'+B(()=>'Lv '+G.s.comp[c.id].lvl+'/50')+'</span></div><div class="xs mt">'+c.role+'</div><div class="xs gd">'+c.eff.map(effText).join(', ')+' per level</div></div></div>'
   +'<div class="row sb" style="margin-top:6px"><div class="sm">'+B(()=>G.s.comp[c.id].lvl>=50?'<span class="mt">Max bond</span>':costHtml(compCost(c)))+'</div><button '+act('comp',c.id)+' '+BC('btn pri sm',()=>G.s.comp[c.id].lvl<50&&canPay(compCost(c))?'':'dis')+'>Bond</button></div></div>';
 }).join('');
}
function heroRender(){
 const sub=ui.sub.hero;
 return heroHeader()+subTabs('hero',[['stats','Stats'],['skills','Skills'],['gear','Gear'],['party','Party']])
  +(sub==='stats'?heroStats():sub==='skills'?heroSkills():sub==='gear'?heroGear():heroParty());
}
// ---------- army ----------
function unitCard(u){
 const own=()=>G.s.unit[u.id]||0;
 const n=()=>{const m=ui.mult;return m==='max'?Math.max(1,uMaxN(u)):m;};
 return '<div class="card sm"><div class="row"><div class="ico">'+u.i+'</div><div class="grow"><div class="row sb"><b>'+u.n+'</b><span class="badge">x'+B(()=>fmt(own()))+'</span></div><div class="xs mt">Power '+B(()=>fmt(u.p*G.S.armyMul))+' each</div></div></div>'
  +'<div class="row sb" style="margin-top:6px"><div class="sm">'+B(()=>costHtml(uCostN(u,n())))+'</div><button '+act('train',u.id)+' '+BC('btn pri sm',()=>canPay(uCostN(u,n()))?'':'dis')+'>'+B(()=>'Train '+n())+'</button></div></div>';
}
function armyRender(){
 const s=G.s;
 let h='<div class="card"><div class="row sb"><div><div class="xs mt">Army power</div><b class="gd" style="font-size:20px">'+B(()=>fmt(armyPower()))+'</b></div><div style="text-align:right"><div class="xs mt">Raid defense</div><b style="font-size:20px">'+B(()=>fmt(defensePower()))+'</b></div></div>'
  +'<div class="xs mt" style="margin-top:6px">'+B(()=>{const s=G.s;if(s.era<1)return 'Raids begin in the Hamlet era.';if(s.raid.act){const r=s.raid.act;return '<span class="bad">⚠️ '+r.name+' — need '+fmt(r.str)+', '+Math.ceil(Math.max(0,r.ends-Date.now())/1000)+'s left</span>';}return 'Next raid in '+fmtTime((s.raid.next-Date.now())/1000)+' · Next strength ≈ '+fmt(RAID_BASE[Math.min(7,s.era)]*(1+.04*s.st.raids));})+'</div>'
  +'<div class="xs mt">Repelled: '+B(()=>G.s.st.raids)+' · Lost: '+B(()=>G.s.st.lost)+'</div></div>';
 h+='<div class="row sb"><h2 style="margin:0">Units</h2><div class="row" style="gap:4px">'+[1,10,100,'max'].map(m=>'<button '+act('mult',m)+' '+BC('btn sm',()=>ui.mult===m?'on':'')+'>x'+(m==='max'?'Max':m)+'</button>').join('')+'</div></div><div style="height:8px"></div>';
 h+=UNITS.filter(unitAvail).map(unitCard).join('');
 if(s.era<1)h='<div class="card">Your army grows from the Hamlet era onward.</div>';
 return h;
}
// ---------- map ----------
const HEXR=34;
function hexPts(cx,cy){let p=[];for(let i=0;i<6;i++){const a=Math.PI/3*i;p.push((cx+HEXR*Math.cos(a)).toFixed(1)+','+(cy+HEXR*Math.sin(a)).toFixed(1));}return p.join(' ');}
function hexPos(i){const col=i%5,row=Math.floor(i/5);return [HEXR+4+col*1.5*HEXR,HEXR*.87+4+row*1.732*HEXR+(col%2?.866*HEXR:0)];}
function hexState(r){const s=G.s;if(s.regions[r.id])return 'own';if(r.era>s.era)return 'lock';return canConquer(r)?'can':'avail';}
function mapRegions(){
 let svg='<svg viewBox="0 0 300 400" style="width:100%;max-height:480px">';
 REG.forEach((r,i)=>{
  const p=hexPos(i),st=hexState(r);
  svg+='<g '+act('sel',r.id)+'><polygon class="hex '+st+(ui.sel===r.id?' sel':'')+'" points="'+hexPts(p[0],p[1])+'"/><text class="hexl" x="'+p[0]+'" y="'+(p[1]+5)+'">'+(st==='lock'?'🔒':r.i)+'</text></g>';
 });
 svg+='</svg>';
 let h='<div class="card" style="padding:4px">'+svg+'</div>';
 const r=REG.find(x=>x.id===ui.sel);
 if(r){
  h+='<div class="card"><div class="row"><div class="ico">'+r.i+'</div><div class="grow"><b>'+r.n+'</b><div class="xs mt">'+r.d+'</div></div></div>'
   +'<div class="xs gd" style="margin-top:4px">Reward: '+r.eff.map(effText).join(', ')+'</div>'
   +B(()=>{const s=G.s;if(s.regions[r.id])return '<div class="ok" style="margin-top:6px">✔ Conquered</div>';if(r.era>s.era)return '<div class="mt" style="margin-top:6px">Unlocks in '+ERAS[r.era].n+'</div>';
    return '<div class="sm" style="margin-top:6px"><span class="'+(armyPower()>=r.req?'ok':'bad')+'">Power '+fmt(armyPower())+' / '+fmt(r.req)+'</span> · '+costHtml(regCostArr(r))+'</div><button class="btn pri" style="margin-top:6px;width:100%" '+act('conquer',r.id)+'>Conquer</button>';},'','div')+'</div>';
 }else h+='<div class="card sm mt">Tap a region on the map. Conquered lands grant permanent bonuses.</div>';
 const n=Object.keys(G.s.regions).length;
 h+='<div class="xs mt">Conquered '+n+' / '+REG.length+'</div>';
 return h;
}
function expCard(e){
 const dur=e.dur/G.S.expSpeed;
 const running=()=>G.s.exp.find(x=>x.id===e.id);
 return '<div class="card sm"><div class="row sb"><b>'+e.n+'</b><span class="badge">'+fmtTime(dur)+'</span></div>'
  +'<div class="xs mt">'+e.res.filter(p=>RES[p[0]].era<=G.s.era).map(p=>RES[p[0]].i).join(' ')+' · XP · '+Math.round(e.relic*100)+'% relic chance</div>'
  +B(()=>{const x=running();if(!x)return '<button class="btn pri sm" style="margin-top:6px" '+act('exp',e.id)+'>Send party</button>';return '<div class="bar" style="margin-top:6px"><i style="width:'+pct(Date.now()-(x.end-x.dur),x.dur)+'%"></i></div><div class="xs mt">'+fmtTime((x.end-Date.now())/1000)+' left</div>';},'','div')+'</div>';
}
function mapExp(){
 const s=G.s;
 let h='<div class="card sm">Slots: '+B(()=>G.s.exp.length+'/'+G.S.expSlots)+' · Expeditions run in real time, even while you are away.</div>';
 const l=EXPS.filter(expAvail);
 h+=l.length?l.map(expCard).join(''):'<div class="card sm">Expeditions unlock in the Hamlet era.</div>';
 return h;
}
function mapRender(){
 return subTabs('map',[['regions','Regions'],['exp','Expeditions']])+(ui.sub.map==='regions'?mapRegions():mapExp());
}
// ---------- lore ----------
function techCard(t){
 const s=()=>G.s;
 return '<div class="card sm tech"><div class="row"><div class="ico">'+t.i+'</div><div class="grow"><div class="row sb"><b>'+t.n+'</b><span class="badge">T'+t.tier+'</span></div><div class="xs gd">'+t.d+'</div></div></div>'
  +B(()=>{
   const st=s();
   if(st.techs[t.id])return '<div class="ok xs" style="margin-top:4px">✔ Learned</div>';
   const q=st.rq.find(x=>x.id===t.id);
   if(q)return '<div class="bar" style="margin-top:6px"><i style="width:'+pct(Date.now()-(q.end-q.dur),q.dur)+'%"></i></div><div class="xs mt">'+fmtTime((q.end-Date.now())/1000)+' left</div>';
   if(t.era>st.era)return '<div class="xs mt" style="margin-top:4px">🔒 '+ERAS[t.era].n+'</div>';
   if(!t.req.every(r=>st.techs[r]))return '<div class="xs mt" style="margin-top:4px">🔒 Needs '+t.req.map(r=>TMAP[r].n).join(', ')+'</div>';
   return '<div class="row sb" style="margin-top:6px"><div class="sm">'+costHtml(techCostArr(t))+' · ⏱ '+fmtTime(t.time/G.S.rSpeed)+'</div><button class="btn pri sm" '+act('tech',t.id)+'>Research</button></div>';
  },'','div')+'</div>';
}
function loreRender(){
 const s=G.s;
 let h='<div class="card sm">Research slots: '+B(()=>G.s.rq.length+'/'+G.S.resSlots)+' · Speed x'+B(()=>fmt(G.S.rSpeed))+'</div>';
 BRANCHES.forEach(b=>{
  const list=TECH.filter(t=>t.br===b.id&&t.era<=s.era+1);
  if(!list.length)return;
  h+='<h2>'+b.i+' '+b.n+'</h2>'+list.map(techCard).join('');
 });
 return h;
}
