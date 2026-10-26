'use strict';
// ===== engine part 2: actions and tick =====
function addRes(r,amt){
 const s=G.s;s.res[r]+=amt;s.tot[r]+=amt;s.life[r]+=amt;
}
function runScore(){let t=0;RES_ORDER.forEach(r=>t+=G.s.tot[r]*RES[r].v);return t;}
function addXp(x){
 const h=G.s.hero;if(h.lvl>=200)return;
 h.xp+=x;
 let up=0;
 while(h.lvl<200&&h.xp>=xpNeed(h.lvl)){
  h.xp-=xpNeed(h.lvl);h.lvl++;h.pts+=3+(h.lvl%10===0?2:0);h.sp+=1;up++;
 }
 if(h.lvl>=200)h.xp=0;
 if(up){
  G.dirty=true;
  const q=['Stats increased. Confidence unchanged.','You feel stronger. Your back disagrees.','Reality nods approvingly.','The System applauds. Slowly.'];
  sys('Level '+h.lvl+'! +'+(3*up)+' attribute points and '+up+' skill point'+(up>1?'s':'')+'. '+q[h.lvl%q.length]);
  toast('⭐ Level '+h.lvl+'!');
  emit('struct');
 }
}
function xpReward(frac){return xpNeed(G.s.hero.lvl)*frac;}
function tap(){
 const s=G.s;
 let v=tapValue(),crit=false;
 if(Math.random()<G.S.crit){v*=G.S.critMul;crit=true;}
 addRes(s.focus,v);s.st.taps++;
 addXp(Math.max(.2,G.xps*.2));
 return {v,crit};
}
// ---- buildings ----
function bAvailable(b){return b.era<=G.s.era;}
function buyBuilding(id,n){
 const b=BMAP[id];if(!b||!bAvailable(b))return 0;
 n=Math.min(n,bMaxN(b));if(n<1)return 0;
 const cost=bCostN(b,n);if(!canPay(cost))return 0;
 pay(cost);G.s.bld[id]=(G.s.bld[id]||0)+n;G.s.st.builds+=n;G.dirty=true;
 const c=G.s.bld[id];
 if(MIL.indexOf(c)>=0||(n>1&&MIL.some(m=>c>=m&&c-n<m)))sys(b.n+' milestone! Output doubled.');
 emit('struct');return n;
}
function bestBuy(){
 // cheapest payback among affordable producers
 let best=null,bs=Infinity;
 BLD.forEach(b=>{
  if(!bAvailable(b))return;
  const c=bCostN(b,1);if(!canPay(c))return;
  let val=0;c.forEach(x=>val+=x[1]*RES[x[0]].v);
  const gain=b.type==='prod'?b.rate*RES[b.res].v:b.type==='house'?b.pop*.4:.5*Math.pow(5,b.era);
  const sc=val/gain;if(sc<bs){bs=sc;best=b;}
 });
 return best;
}
// ---- workers ----
function idleWorkers(){return Math.floor(G.s.pop)-totalWorkers();}
function setWorkers(res,n){
 const s=G.s;if(RES[res].era>s.era)return;
 const cur=s.work[res]||0;
 let tgt=Math.max(0,cur+n);
 const free=idleWorkers();
 if(tgt-cur>free)tgt=cur+Math.max(0,free);
 if(tgt!==cur){s.work[res]=tgt;G.dirty=true;}
}
function balanceWorkers(){
 const s=G.s,rs=unlockedRes();
 RES_ORDER.forEach(r=>s.work[r]=0);
 const n=Math.floor(s.pop),k=rs.length,q=Math.floor(n/k),rem=n%k;
 rs.forEach((r,i)=>{s.work[r]=q+(i<rem?1:0);});
 G.dirty=true;
}
function clearWorkers(){RES_ORDER.forEach(r=>G.s.work[r]=0);G.dirty=true;}
// ---- era ----
function canEra(){
 const s=G.s,e=s.era+1;if(e>=ERAS.length)return {ok:false,max:true};
 const c=eraCost(e),costArr=Object.keys(c).map(k=>[k,c[k]]);
 return {ok:s.hero.lvl>=ERAS[e].lvl&&canPay(costArr),lvlOk:s.hero.lvl>=ERAS[e].lvl,cost:costArr,e};
}
function advanceEra(){
 const r=canEra();if(!r.ok)return false;
 pay(r.cost);G.s.era=r.e;G.dirty=true;
 sys('<b>'+ERAS[r.e].n+'</b> reached! '+ERAS[r.e].tag);toast('🏰 '+ERAS[r.e].n);
 if(r.e===1)G.s.raid.next=Date.now()+150000;
 emit('struct');return true;
}
// ---- research ----
function techAvail(t){
 const s=G.s;if(s.techs[t.id]||t.era>s.era)return false;
 return t.req.every(r=>s.techs[r]);
}
function techCostArr(t){return Object.keys(t.cost).map(k=>[k,t.cost[k]]);}
function startTech(id){
 const s=G.s,t=TMAP[id];if(!t||!techAvail(t))return false;
 if(s.rq.length>=G.S.resSlots||s.rq.some(q=>q.id===id))return false;
 const c=techCostArr(t);if(!canPay(c))return false;
 pay(c);const dur=t.time/G.S.rSpeed*1000;
 s.rq.push({id,end:Date.now()+dur,dur});emit('struct');return true;
}
function finishTech(q){
 const s=G.s;s.techs[q.id]=true;G.dirty=true;
 sys('Research complete: <b>'+TMAP[q.id].n+'</b>.');toast('🔬 '+TMAP[q.id].n);
 addXp(xpReward(.02));emit('struct');
}
// ---- hero ----
function addAttr(id,n){
 const h=G.s.hero;n=Math.min(n,h.pts);if(n<1)return;
 h.attr[id]+=n;h.pts-=n;G.dirty=true;emit('struct');
}
function skillAvail(sk){const h=G.s.hero;return h.lvl>=sk.lvl&&(!sk.cls||h.cls===sk.cls);}
function learnSkill(id){
 const h=G.s.hero,sk=SMAP[id];if(!sk||!skillAvail(sk)||h.sp<1)return;
 const r=h.skills[id]||0;if(r>=sk.max)return;
 h.skills[id]=r+1;h.sp--;G.dirty=true;emit('struct');
}
function chooseClass(id){
 const h=G.s.hero;if(h.cls||h.lvl<10)return;
 h.cls=id;G.dirty=true;
 sys('Class chosen: <b>'+CLASSES.find(c=>c.id===id).n+'</b>.');emit('struct');
}
function respecCost(){return [['gold',1000*Math.pow(2.2,G.s.era)*(1+G.s.hero.lvl/10)]];}
function respec(){
 const h=G.s.hero,c=respecCost();if(!canPay(c))return false;
 pay(c);
 let pts=0;for(const k in h.attr){pts+=h.attr[k];h.attr[k]=0;}
 let sp=0;for(const k in h.skills)sp+=h.skills[k];
 h.pts+=pts;h.sp+=sp;h.skills={};h.cls=null;G.dirty=true;emit('struct');return true;
}
function gearUpCost(slot){
 const t=G.s.hero.gear[slot],c=gearCost(t);
 return Object.keys(c).map(k=>[k,c[k]]);
}
function gearMaxTier(){return Math.min(GEAR_MAX,3*G.s.era+3);}
function upgradeGear(slot){
 const g=G.s.hero.gear;if(g[slot]>=gearMaxTier())return false;
 const c=gearUpCost(slot);if(!canPay(c))return false;
 pay(c);g[slot]++;G.dirty=true;emit('struct');return true;
}
// ---- companions ----
function compCost(c){
 const lvl=G.s.comp[c.id].lvl;
 return [[c.res,c.bc*Math.pow(1.55,lvl)/G.S.bond]];
}
function compLevelUp(id){
 const c=CMAP[id],st=G.s.comp[id];if(!st||st.lvl>=50)return false;
 const cost=compCost(c);if(!canPay(cost))return false;
 pay(cost);st.lvl++;G.dirty=true;
 if(c.beats[st.lvl])say('<b>'+c.n+':</b> '+c.beats[st.lvl],'story');
 emit('struct');return true;
}
function checkCompanions(){
 COMP.forEach(c=>{
  if(G.s.comp[c.id])return;
  const j=c.join;
  if((j.lvl&&G.s.hero.lvl>=j.lvl)||(j.era&&G.s.era>=j.era)){
   G.s.comp[c.id]={lvl:1};G.dirty=true;
   say('<b>'+c.n+'</b> ('+c.role+') joins. '+c.intro,'story');toast(c.i+' '+c.n+' joined!');emit('struct');
  }
 });
}
// ---- army / map ----
function unitAvail(u){return u.era<=G.s.era;}
function trainUnit(id,n){
 const u=UMAP[id];if(!u||!unitAvail(u))return 0;
 n=Math.min(n,uMaxN(u));if(n<1)return 0;
 const c=uCostN(u,n);if(!canPay(c))return 0;
 pay(c);G.s.unit[id]=(G.s.unit[id]||0)+n;G.dirty=true;emit('struct');return n;
}
function regCostArr(r){const c=regCost(r);return Object.keys(c).map(k=>[k,c[k]]);}
function canConquer(r){
 const s=G.s;if(s.regions[r.id]||r.era>s.era)return false;
 return armyPower()>=r.req&&canPay(regCostArr(r));
}
function conquer(id){
 const r=REG.find(x=>x.id===id);if(!r||!canConquer(r))return false;
 pay(regCostArr(r));G.s.regions[id]=true;G.s.st.conq++;G.dirty=true;
 sys('<b>'+r.n+'</b> conquered! '+r.d);toast(r.i+' '+r.n+' is yours');
 addXp(xpReward(.05));emit('struct');return true;
}
// ---- wonders / edicts ----
function wonderCostArr(w){const c=wonderCost(w);return Object.keys(c).map(k=>[k,c[k]]);}
function buildWonder(id){
 const w=WMAP[id],s=G.s;if(!w||s.wonders[id]||w.era>s.era)return false;
 const c=wonderCostArr(w);if(!canPay(c))return false;
 pay(c);s.wonders[id]=true;G.dirty=true;
 sys('<b>'+w.n+'</b> completed! '+w.d);toast(w.i+' '+w.n);addXp(xpReward(.15));emit('struct');return true;
}
function edictAvail(e){
 const pl=G.S.pl;for(const k in e.req)if(pl[k]<e.req[k])return false;return true;
}
function toggleEdict(id){
 const s=G.s,e=EMAP[id],i=s.edicts.indexOf(id);
 if(i>=0)s.edicts.splice(i,1);
 else{if(!edictAvail(e)||s.edicts.length>=G.S.edictSlots)return false;s.edicts.push(id);}
 G.dirty=true;emit('struct');return true;
}
// ---- spells ----
function spellCost(sp){
 return Math.max(sp.m0,(G.rates.mana||0)*sp.sec)*G.S.spellCost;
}
function spellReady(sp){return (G.s.spells[sp.id]||0)<=Date.now();}
function castSpell(id){
 const s=G.s,sp=SPMAP[id];if(!sp||sp.era>s.era||!spellReady(sp))return false;
 if(RES.mana.era>s.era)return false;
 const cost=spellCost(sp);if(s.res.mana<cost)return false;
 s.res.mana-=cost;
 s.spells[id]=Date.now()+sp.cd*G.S.spellCd*1000;
 s.st.spells++;
 if(sp.dur)s.buffs[id]=Date.now()+sp.dur*G.S.spellDur*1000;
 if(id==='rain')addRes('gold',Math.max(100,G.rates.gold*300));
 if(id==='lapse'){const f=600;RES_ORDER.forEach(r=>{if(RES[r].era<=s.era)addRes(r,G.rates[r]*f);});}
 if(id==='fall'&&s.raid.act){resolveRaid(true);}
 G.dirty=true;sys(sp.n+' cast!');emit('struct');return true;
}
// ---- raids ----
function raidStr(){
 const s=G.s,base=RAID_BASE[Math.min(7,s.era)];
 return base*(1+.04*s.st.raids)*(1+.3*s.asc.count)*(.9+Math.random()*.25);
}
function spawnRaid(){
 const s=G.s,str=raidStr(),dur=45000+10000*(G.s.bld.watchtower?Math.min(6,Math.log2(1+G.s.bld.watchtower)):0);
 s.raid.act={str,ends:Date.now()+dur,name:FOES[Math.min(7,s.era)]};
 sys('⚠️ '+s.raid.act.name+' approaches! Strength '+fmt(str)+'. Reach '+fmt(str)+' defense power.');
 toast('⚠️ Raid incoming!');emit('struct');
}
function defensePower(){return armyPower()*G.S.raidDef;}
function resolveRaid(force){
 const s=G.s,r=s.raid.act;if(!r)return;
 const win=force||defensePower()>=r.str;
 if(win){
  s.st.raids++;
  const lootSecs=300*G.S.raidLoot;
  RES_ORDER.forEach(x=>{if(RES[x].era<=s.era&&x!=='crystal')addRes(x,Math.max(10,G.rates[x]*lootSecs*.25));});
  addXp(xpReward(.04*G.S.raidLoot));
  sys('Raid repelled! The '+r.name+' flees, leaving loot and one sock.');toast('🛡️ Raid repelled!');
  if(Math.random()<.08*(1+G.S.crLuck))spawnEncounter();
 }else{
  const lose=.1;
  RES_ORDER.forEach(x=>{s.res[x]*=1-lose;});
  s.pop*=.97;s.st.lost++;
  sys('The '+r.name+' raided you! Lost 10% of your stockpiles. Build more defense.');toast('💥 Raided!');
 }
 s.raid.act=null;s.raid.next=Date.now()+(240000+Math.random()*120000);G.dirty=true;emit('struct');
}
// ---- expeditions ----
function expAvail(e){return e.era<=G.s.era;}
function startExp(id){
 const s=G.s,e=EXMAP[id];if(!e||!expAvail(e)||s.exp.length>=G.S.expSlots||s.exp.some(x=>x.id===id))return false;
 const dur=e.dur/G.S.expSpeed*1000;
 s.exp.push({id,end:Date.now()+dur,dur});emit('struct');return true;
}
function finishExp(x){
 const s=G.s,e=EXMAP[x.id];s.st.exps++;
 const parts=[];
 e.res.forEach(p=>{
  if(RES[p[0]].era>s.era)return;
  const amt=Math.max(p[1],G.rates[p[0]]*e.dur*.6)*(.9+Math.random()*.2);
  addRes(p[0],amt);parts.push(fmt(amt)+' '+RES[p[0]].i);
 });
 addXp(xpReward(e.xp));
 sys('Expedition complete: <b>'+e.n+'</b>. Gained '+parts.join(', ')+'.');toast('🧭 '+e.n+' done');
 if(Math.random()<.3*(1+G.S.crLuck))spawnEncounter();
 if(Math.random()<e.relic){
  const left=RELICS.filter(r=>!s.relics[r.id]);
  if(left.length){const r=left[Math.floor(Math.random()*left.length)];s.relics[r.id]=true;s.st.relics++;G.dirty=true;sys('Relic found: '+r.i+' <b>'+r.n+'</b>! ('+r.eff.map(effText).join(', ')+')');toast(r.i+' Relic: '+r.n);}
  else addXp(xpReward(.1));
 }
 emit('struct');
}
// ---- events ----
function maybeEvent(now){
 const s=G.s;
 if(now<s.evt.next||G.pendingEvent||G.pendingTale||G.busy||s.era<1)return;
 s.evt.next=now+(240000+Math.random()*240000);
 G.pendingEvent=EVENTS[Math.floor(Math.random()*EVENTS.length)];emit('event',G.pendingEvent);
}
function resolveEvent(fn){
 const s=G.s,r=G.rates;let m='';
 const add=(res,secs)=>{if(RES[res].era<=s.era){const a=Math.max(20,r[res]*secs);addRes(res,a);return fmt(a)+' '+RES[res].i;}return '';};
 switch(fn){
  case 'trade':{const g=s.res.gold*.1;s.res.gold-=g;const a=add('wood',g/Math.max(1,r.wood+1)*8)||'';RES_ORDER.forEach(x=>{if(x!=='gold'&&x!=='crystal'&&RES[x].era<=s.era)addRes(x,Math.max(20,r[x]*60));});m='Bought a bale of everything for '+fmt(g)+' gold. The merchant vanishes.';break;}
  case 'haggle':{if(Math.random()<.5){m='You haggled and won: '+add('gold',90);}else m='The merchant out-haggles you and leaves you a pamphlet on negotiation.';break;}
  case 'feygift':m='The fey gift: '+add('mana',120)+'. The bill is a thank-you note.';break;
  case 'dig':{if(Math.random()<.6)m='A chest! '+add('gold',90)+' and '+add('iron',45);else m='You found a boot. A heavy boot, but a boot.';break;}
  case 'party':addXp(xpReward(.04));m='The festival is a smash. Everyone is oddly proud of you.';break;
  case 'work':m='Everyone works. Output +'+add('food',60)+' extra. Morale -1.';break;
  case 'shelter':addXp(xpReward(.02));m='The storm passes. Smolder emerges, dignified.';break;
  case 'rain':m='Rain barrels fill: '+add('food',90)+' '+add('wood',60)+'.';break;
  case 'scholar':addXp(xpReward(.06));m='The scholar teaches your people an odd trick. XP gained.';break;
  case 'scholar2':m='The scholar sighs and teaches half a trick. '+add('mana',45);break;
  case 'toll':{const g=Math.min(s.res.gold,Math.max(1,r.gold*30));s.res.gold-=g;m='You pay '+fmt(g)+' gold. They give you a receipt. You are not sure why that helps.';break;}
  case 'fightb':{if(defensePower()>=RAID_BASE[Math.min(7,s.era)]*.2){m='Bandits flee. Loot: '+add('gold',120);addXp(xpReward(.03));}else{m='The bandits win this round and take your lunch.';}break;}
  case 'omen':{const c=Math.min(s.res.mana,Math.max(10,r.mana*60));s.res.mana-=c;addXp(xpReward(.08));m='The Hollowroot hums, pleased. XP gained.';break;}
 }
 if(m)sys(m);
 G.pendingEvent=null;G.dirty=true;emit('struct');
}
// ---- story and achievements ----
function condVal(c){
 const s=G.s;
 switch(c.k){
  case 'tap':return s.st.taps;
  case 'bld':return bCount(c.id);
  case 'bldn':return totalBuildings();
  case 'era':return s.era;
  case 'lvl':return s.hero.lvl;
  case 'tot':return s.life[c.rn||c.res];
  case 'reg':return Object.keys(s.regions).length;
  case 'raid':return s.st.raids;
  case 'army':return totalUnits();
  case 'pop':return Math.floor(s.pop);
  case 'tech':return Object.keys(s.techs).length;
  case 'comp':return Object.keys(s.comp).length;
  case 'wonder':return Object.keys(s.wonders).length;
  case 'exp':return s.st.exps;
  case 'prest':return s.pres.count;
  case 'spell':return s.st.spells;
  case 'chap':return s.chap;
  case 'pow':return armyPower();
  case 'cre':return crCount();
  case 'bond':return crMaxBond();
  case 'evo':return crEvoCount();
  case 'tale':return talesDone();
  case 'asc':return s.asc.count;
  case 'bount':return s.bounty.done;
  case 'feed':return s.st.feeds;
  case 'relic':return s.st.relics;
 }
 return 0;
}
function chapterGoal(c){return c.n!==undefined?c.n:c.v;}
function checkStory(){
 const s=G.s;
 while(s.chap<CHAPTERS.length){
  const ch=CHAPTERS[s.chap];
  if(condVal(ch.c)<chapterGoal(ch.c))break;
  s.chap++;
  say('<b>Chapter '+s.chap+': '+ch.n+'</b><br>'+ch.txt,'story');
  addXp(xpReward(.05));
  const secs=40*Math.min(s.chap,40);
  RES_ORDER.forEach(r=>{if(RES[r].era<=s.era&&r!=='crystal')addRes(r,Math.max(10,G.rates[r]*secs*.25));});
  toast('📖 Chapter '+s.chap+': '+ch.n);emit('struct');
 }
 let got=false;
 ACH.forEach(a=>{
  if(s.ach[a.id])return;
  if(condVal({k:a.k,rn:a.rn})>=a.v){s.ach[a.id]=true;got=true;sys('🏆 Achievement: <b>'+a.n+'</b> (+1% all production)');toast('🏆 '+a.n);}
 });
 if(got){G.dirty=true;emit('struct');}
}
// ---- prestige ----
function heartGain(){
 const s=G.s;if(s.era<3)return 0;
 const sc=runScore();
 return Math.floor(Math.pow(sc/1e12,.25)*G.S.gain);
}
function canRebirth(){return heartGain()>=1;}
function startStash(){
 const l=shopLvl('stash');if(!l)return 0;return 400*Math.pow(5,l-1);
}
function rebirth(){
 if(!canRebirth())return false;
 const old=G.s,gain=heartGain();
 const n=newState();
 n.name=old.name;n.hero=old.hero;n.comp=old.comp;n.relics=old.relics;n.ach=old.ach;n.life=old.life;n.st=old.st;n.set=old.set;n.seen=old.seen;
 n.pres={heart:old.pres.heart+gain,total:old.pres.total+gain,count:old.pres.count+1,shop:old.pres.shop};
 n.cr=old.cr;n.tales=old.tales;n.chap=old.chap;n.bounty=old.bounty;n.asc=old.asc;
 n.t=Date.now();
 G.s=n;
 const st=startStash();if(st){addRes('wood',st);addRes('stone',st*.6);addRes('food',st*.8);n.tot={wood:0,stone:0,food:0,iron:0,gold:0,mana:0,crystal:0};}
 n.era=Math.min(3,shopLvl('eraskip')+ascLvl('startera'));
 if(n.era>=1)n.raid.next=Date.now()+150000;
 n.pop=2;
 G.dirty=true;recalc();
 sys('🌳 <b>Rebirth!</b> +'+gain+' Heartwood. Your hero keeps their strength. The realm begins anew.');
 toast('🌳 Rebirth +'+gain+' Heartwood');
 emit('struct');save();return true;
}
function shopCost(sh){return Math.ceil(sh.base*Math.pow(sh.g,shopLvl(sh.id)));}
function buyShop(id){
 const sh=SHMAP[id],s=G.s,l=shopLvl(id);
 if(l>=sh.max)return false;const c=shopCost(sh);if(s.pres.heart<c)return false;
 s.pres.heart-=c;s.pres.shop[id]=l+1;G.dirty=true;emit('struct');return true;
}
// ---- save / load ----
function save(){
 try{G.s.t=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(G.s));return true;}catch(e){return false;}
}
function mergeDeep(dst,src){
 for(const k in src){
  if(src[k]&&typeof src[k]==='object'&&!Array.isArray(src[k])&&dst[k]&&typeof dst[k]==='object'&&!Array.isArray(dst[k]))mergeDeep(dst[k],src[k]);
  else dst[k]=src[k];
 }
 return dst;
}
function loadState(json){
 const d=JSON.parse(json);const s=mergeDeep(newState(),d);
 // drop unknown ids
 for(const id in s.techs)if(!TMAP[id])delete s.techs[id];
 s.rq=s.rq.filter(q=>TMAP[q.id]);
 return s;
}
function exportSave(){return btoa(unescape(encodeURIComponent(JSON.stringify(G.s))));}
function importSave(txt){
 const json=decodeURIComponent(escape(atob(txt.trim())));
 G.s=loadState(json);G.dirty=true;recalc();save();emit('struct');
}
function hardReset(){G.s=newState();G.log=[];G.dirty=true;G.pendingEvent=null;recalc();save();emit('struct');}
function offlineCapSec(){return G.S.offCap*3600;}
function applyOffline(sec){
 if(sec<20)return null;
 const s=G.s;recalc();
 const eff=Math.min(1,G.S.offEff),use=Math.min(sec,offlineCapSec())*eff;
 const gain={};
 RES_ORDER.forEach(r=>{if(RES[r].era<=s.era){const a=G.rates[r]*use;gain[r]=a;addRes(r,a);}});
 const xp=0;
 s.raid.act=null;s.raid.next=Math.max(s.raid.next,Date.now()+60000);
 let enc=0;for(let i=0;i<Math.min(3,Math.floor(use/1500));i++)if(spawnEncounter())enc++;
 return {sec,use,gain,xp,enc};
}
// ---- main tick ----
let _lastSave=0,_lastStory=0,_autoTap=0;
function tick(dt){
 const s=G.s,now=Date.now();
 if(G.dirty)recalc();
 // buffs expiring
 for(const k in s.buffs)if(s.buffs[k]<=now){delete s.buffs[k];G.dirty=true;}
 // production
 RES_ORDER.forEach(r=>{if(RES[r].era<=s.era){const a=G.rates[r]*dt;if(a>0)addRes(r,a);}});
 // population
 const cap=popCap();
 if(s.pop<cap){s.pop=Math.min(cap,s.pop+Math.max(.5,s.pop*.03)*G.S.popGrow*dt);}
 else if(s.pop>cap)s.pop=cap;
 if(totalWorkers()>Math.floor(s.pop)){
  clearWorkers();
 }
 // research
 for(let i=s.rq.length-1;i>=0;i--){if(s.rq[i].end<=now){const q=s.rq.splice(i,1)[0];finishTech(q);}}
 // expeditions
 for(let i=s.exp.length-1;i>=0;i--){if(s.exp[i].end<=now){const x=s.exp.splice(i,1)[0];finishExp(x);}}
 // raids
 if(s.era>=1){
  if(s.raid.act){if(now>=s.raid.act.ends)resolveRaid();}
  else if(s.raid.next&&now>=s.raid.next)spawnRaid();
  else if(!s.raid.next)s.raid.next=now+150000;
 }
 // automation
 const at=shopLvl('auto');
 if(at){_autoTap+=dt*at;while(_autoTap>=1){_autoTap-=1;let v=tapValue();addRes(s.focus,v);}}
 const ab=shopLvl('builder');
 if(ab){s.auto.b+=dt;const iv=Math.max(1,12/ab);if(s.auto.b>=iv){s.auto.b=0;const b=bestBuy();if(b)buyBuilding(b.id,1);}}
 // slow checks
 if(now-_lastStory>1000){_lastStory=now;checkCompanions();checkStory();maybeEvent(now);slowChecks(now);}
 if(now-_lastSave>15000){_lastSave=now;save();}
}
function initGame(){
 let loaded=false;
 try{const raw=localStorage.getItem(SAVE_KEY);if(raw){G.s=loadState(raw);loaded=true;}}catch(e){loaded=false;}
 if(!loaded){
  G.s=newState();
  sys('Welcome, Warden-Heir. You stand in the ashes of the Hollowroot. Tap to gather. Tap more. Do not look at the dragon yet.');
 }
 G.dirty=true;recalc();
 let off=null;
 if(loaded){off=applyOffline((Date.now()-G.s.t)/1000);}
 G.s.t=Date.now();
 if(G.s.pop<2)G.s.pop=2;
 checkCompanions();
 return off;
}
