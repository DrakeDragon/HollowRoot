'use strict';
// ===== engine part 3: seasons, creatures, bounties, tales, ascension =====
const SEASONS=[
 {n:'Spring',i:'🌸',d:'Food +25%, population growth +25%'},
 {n:'Summer',i:'☀️',d:'Wood and Stone +25%, tap power +15%'},
 {n:'Autumn',i:'🍂',d:'Gold +25%, raid loot +25%'},
 {n:'Winter',i:'❄️',d:'Mana +25%, hero XP +15%'}
];
const SEASON_MS=1200000;
function seasonIdx(){return Math.floor(Date.now()/SEASON_MS)%4;}
function seasonLeft(){return (SEASON_MS-(Date.now()%SEASON_MS))/1000;}
function applySeason(S){
 const i=seasonIdx();
 if(i===0){S.mulRes.food*=1.25;S.popGrow*=1.25;}
 else if(i===1){S.mulRes.wood*=1.25;S.mulRes.stone*=1.25;S.click*=1.15;}
 else if(i===2){S.mulRes.gold*=1.25;S.raidLoot*=1.25;}
 else{S.mulRes.mana*=1.25;S.xp*=1.15;}
}
// ---- Worldseed shop ----
const ASHOP=[
 {id:'core',n:'Seed Core',i:'💠',max:12,base:1,g:1.9,d:'x1.4 all production per level.',eff:[ea('mulAll',1.4)]},
 {id:'rich',n:'Heartwood Richness',i:'🌳',max:10,base:1,g:2,d:'+25% Heartwood per level.',eff:[ea('gain',1.25)]},
 {id:'slots',n:'Wider Orchard',i:'🏞️',max:3,base:3,g:3,d:'+1 creature slot per level.',eff:[ea('crSlots',1)]},
 {id:'cubs',n:'Wild Covenant',i:'🐾',max:10,base:2,g:1.9,d:'x1.15 creature boons per level.',eff:[ea('crMul',1.15)]},
 {id:'call',n:'Call of the Wild',i:'📯',max:5,base:2,g:2.2,d:'+20% encounter luck per level.',eff:[ea('crLuck',.2)]},
 {id:'whisper',n:'Beast Whisperer',i:'🗣️',max:1,base:4,g:1,d:'Active creature skills cast themselves.'},
 {id:'startera',n:'Elder Memory',i:'⏩',max:3,base:5,g:3,d:'Rebirth starts you 1 era further per level.'},
 {id:'offcap',n:'Evergreen Slumber',i:'🛌',max:6,base:2,g:2,d:'+12h offline cap per level.',eff:[ea('offCap',12)]},
 {id:'seat',n:'Council Thrones',i:'🪑',max:3,base:3,g:3,d:'+1 edict slot per level.',eff:[ea('edictSlots',1)]},
 {id:'bounty2',n:'Better Contracts',i:'📜',max:6,base:1,g:2,d:'Bounty rewards x1.5 per level.'},
 {id:'xpf',n:'Eternal Student',i:'📘',max:10,base:1,g:1.8,d:'x1.3 hero XP per level.',eff:[ea('xp',1.3)]},
 {id:'seedp',n:'Seed Resonance',i:'🌟',max:5,base:6,g:2.5,d:'Worldseeds are +20% stronger per level.',eff:[ea('seed',1.2)]}
];
const ASMAP={};ASHOP.forEach(a=>ASMAP[a.id]=a);
function ascLvl(id){return (G.s&&G.s.asc&&G.s.asc.shop[id])||0;}
function ascCost(a){return Math.ceil(a.base*Math.pow(a.g,ascLvl(a.id)));}
function buyAsc(id){
 const a=ASMAP[id],s=G.s,l=ascLvl(id);
 if(l>=a.max)return false;const c=ascCost(a);if(s.asc.seeds<c)return false;
 s.asc.seeds-=c;s.asc.shop[id]=l+1;G.dirty=true;emit('struct');return true;
}
function ascGain(){
 const s=G.s;if(s.pres.total<2e4)return 0;
 return Math.floor(Math.pow(s.pres.total/2e4,.5));
}
function canAscend(){return ascGain()>=1;}
function ascend(){
 if(!canAscend())return false;
 const old=G.s,gain=ascGain();
 const n=newState();
 n.name=old.name;n.hero=old.hero;n.comp=old.comp;n.relics=old.relics;n.ach=old.ach;n.life=old.life;n.st=old.st;n.set=old.set;n.seen=old.seen;
 n.cr=old.cr;n.tales=old.tales;n.chap=old.chap;n.bounty=old.bounty;
 n.asc={seeds:old.asc.seeds+gain,total:old.asc.total+gain,count:old.asc.count+1,shop:old.asc.shop};
 n.pres={heart:0,total:0,count:old.pres.count,shop:{}};
 n.t=Date.now();G.s=n;
 n.era=Math.min(3,ascLvl('startera'));if(n.era>=1)n.raid.next=Date.now()+150000;
 n.pop=2;G.dirty=true;recalc();
 sys('🌠 <b>Ascension!</b> +'+gain+' Worldseeds. Heartwood and its shop are consumed. A new world begins on the old roots.');
 toast('🌠 Ascension +'+gain+' Worldseeds');emit('struct');save();return true;
}
// ---- creatures ----
function crCount(){return Object.keys(G.s.cr.own).length;}
function crMaxBond(){let m=0;for(const k in G.s.cr.own)m=Math.max(m,G.s.cr.own[k].lvl);return m;}
function crEvoCount(){let n=0;for(const k in G.s.cr.own)if(G.s.cr.own[k].evo)n++;return n;}
function crName(c){const st=G.s.cr.own[c.id];return st&&st.evo?c.evo:c.n;}
function crSlotsNow(){return G.S.crSlots;}
function crRateCost(c,secs){return Math.max(0,(G.rates[c.fav]||0)*secs);}
function crBondCost(c){
 const st=G.s.cr.own[c.id];
 return [[c.fav,Math.max(c.bc*2*Math.pow(1.5,st.lvl-1),crRateCost(c,40*Math.pow(1.27,st.lvl-1)))/G.S.bond]];
}
function crEvoCost(c){return [[c.fav,Math.max(c.bc*Math.pow(1.5,30)*.8,crRateCost(c,14000))/G.S.bond],['gold',Math.max(c.bc*Math.pow(1.5,30)*.1,(G.rates.gold||0)*1800)/G.S.bond]];}
function crBefriendCost(c){return [[c.fav,Math.max(c.bc*2.5,crRateCost(c,500))/G.S.bond]];}
function crTotalMult(c){const st=G.s.cr.own[c.id];return (st.evo?1.5:1)*G.S.crMul;}
function wildPool(){
 const s=G.s;
 return CRS.filter(c=>c.g.k==='wild'&&c.era<=s.era&&!s.cr.own[c.id]&&!s.cr.enc.some(e=>e.id===c.id));
}
function rollWild(){
 const pool=wildPool();if(!pool.length)return null;
 const luck=G.S.crLuck;
 const w=pool.map(c=>RAR[c.rar].w*(c.rar>=2?1+luck*3:1));
 let tot=0;w.forEach(x=>tot+=x);let r=Math.random()*tot;
 for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0)return pool[i].id;}
 return pool[pool.length-1].id;
}
function spawnEncounter(){
 const s=G.s;if(s.cr.enc.length>=4)return false;
 const id=rollWild();if(!id)return false;
 s.cr.enc.push({id,t:Date.now()});
 const c=CRMAP[id];
 say(c.i+' A wild <b>'+c.n+'</b> ('+RAR[c.rar].n+') lingers near your realm. Check the Menagerie.','story');toast(c.i+' '+c.n+' appeared!');
 emit('struct');return true;
}
function autoActivate(id){
 const a=G.s.cr.active;
 if(a.indexOf(id)<0&&a.length<G.S.crSlots)a.push(id);
}
function grantCreature(id){
 const s=G.s,c=CRMAP[id];if(!c||s.cr.own[id])return false;
 s.cr.own[id]={lvl:1,evo:false};
 s.cr.enc=s.cr.enc.filter(e=>e.id!==id);
 autoActivate(id);G.dirty=true;
 say(c.i+' <b>'+c.n+'</b> joins your realm. '+c.lore[0],'story');toast(c.i+' '+c.n+' joined!');
 emit('struct');return true;
}
function befriend(id){
 const s=G.s,c=CRMAP[id];if(!c||!s.cr.enc.some(e=>e.id===id))return false;
 const cost=crBefriendCost(c);if(!canPay(cost))return false;
 pay(cost);return grantCreature(id);
}
function dismissEnc(id){G.s.cr.enc=G.s.cr.enc.filter(e=>e.id!==id);emit('struct');}
function wildCallCost(){return [['food',Math.max(100,(G.rates.food||0)*900)]];}
function wildCall(){
 const s=G.s,now=Date.now();
 if(s.era<1||s.cr.call>now||s.cr.enc.length>=4)return null;
 const cost=wildCallCost();if(!canPay(cost))return null;
 pay(cost);s.cr.call=now+120000;
 const chance=Math.min(.9,.5+G.S.crLuck*.3);
 if(Math.random()<chance&&spawnEncounter())return true;
 say('You call into the wilds. A squirrel answers. It has questions.');return false;
}
function crBond(id){
 const s=G.s,c=CRMAP[id],st=s.cr.own[id];if(!st||st.lvl>=30)return false;
 const cost=crBondCost(c);if(!canPay(cost))return false;
 pay(cost);st.lvl++;s.st.feeds++;G.dirty=true;
 const L={5:1,15:2,30:3}[st.lvl];
 if(L)say(c.i+' <b>'+c.n+'</b> (bond '+st.lvl+'): '+c.lore[L],'story');
 if(st.lvl===10)sys(c.sk.n+' unlocked for '+c.n+'.');
 addXp(xpReward(.002));emit('struct');return true;
}
function crEvolve(id){
 const s=G.s,c=CRMAP[id],st=s.cr.own[id];if(!st||st.lvl<30||st.evo)return false;
 const cost=crEvoCost(c);if(!canPay(cost))return false;
 pay(cost);st.evo=true;G.dirty=true;
 sys(c.i+' <b>'+c.n+'</b> evolves into <b>'+c.evo+'</b>! Boons x1.5.');toast(c.i+' '+c.evo+'!');
 addXp(xpReward(.05));emit('struct');return true;
}
function toggleActive(id){
 const s=G.s,a=s.cr.active,i=a.indexOf(id);
 if(!s.cr.own[id])return false;
 if(i>=0)a.splice(i,1);
 else{if(a.length>=G.S.crSlots)return false;a.push(id);}
 G.dirty=true;emit('struct');return true;
}
function crSkillReady(id){return (G.s.cr.cd[id]||0)<=Date.now();}
function crSkillOn(id){return (G.s.buffs['cs_'+id]||0)>Date.now();}
function castCrSkill(id){
 const s=G.s,c=CRMAP[id],st=s.cr.own[id];
 if(!st||st.lvl<10||s.cr.active.indexOf(id)<0||!crSkillReady(id))return false;
 const sk=c.sk,now=Date.now();
 s.cr.cd[id]=now+sk.cd*G.S.spellCd*1000;
 if(sk.eff){s.buffs['cs_'+id]=now+sk.dur*G.S.spellDur*1000;}
 if(sk.gain){
  if(sk.res){addRes(sk.res,Math.max(10,G.rates[sk.res]*sk.gain));if(sk.res==='crystal'||sk.res==='mana')addRes('mana',G.rates.mana*sk.gain*.5);}
  else RES_ORDER.forEach(r=>{if(RES[r].era<=s.era)addRes(r,G.rates[r]*sk.gain);});
 }
 s.st.spells++;G.dirty=true;sys(c.i+' <b>'+c.n+'</b> uses <b>'+sk.n+'</b>!');emit('struct');return true;
}
function autoCastCreatures(){
 if(!ascLvl('whisper'))return;
 G.s.cr.active.forEach(id=>{const st=G.s.cr.own[id];if(st&&st.lvl>=10&&crSkillReady(id))castCrSkill(id);});
}
const PASSF=.45;
function ccomp(f){return f<=3?f:3*(1+Math.log(f/3));}
function creatureStats(S){
 const s=G.s;
 const list=s.cr.active.filter(id=>s.cr.own[id]&&CRMAP[id]);
 const sh={mulRes:{}};RES_ORDER.forEach(r=>sh.mulRes[r]=1);for(const k in MULT_T)sh[k]=1;
 // pass 1: crMul contributions
 list.forEach(id=>{
  const c=CRMAP[id],st=s.cr.own[id],ev=st.evo?1.5:1;
  [c.pass,st.lvl>=5?c.b5:[],st.lvl>=15?c.b15:[],st.lvl>=30?c.b30:[]].forEach((arr,k)=>arr.forEach(e=>{if(e.t==='crMul')applyEff(sh,e,k===0?st.lvl*ev:ev);}));
 });
 S.crRaw=S.crMul*sh.crMul;S.crMul=1+.5*Math.log10(Math.max(1,S.crRaw));
 list.forEach(id=>{
  const c=CRMAP[id],st=s.cr.own[id],ev=(st.evo?1.5:1)*S.crMul;
  c.pass.forEach(e=>{if(e.t!=='crMul')applyEff(sh,e,st.lvl*ev*PASSF);});
  if(st.lvl>=5)c.b5.forEach(e=>{if(e.t!=='crMul')applyEff(sh,e,ev);});
  if(st.lvl>=15)c.b15.forEach(e=>{if(e.t!=='crMul')applyEff(sh,e,ev);});
  if(st.lvl>=30)c.b30.forEach(e=>{if(e.t!=='crMul')applyEff(sh,e,ev);});
 });
 // merge with diminishing returns
 for(const k in sh){
  if(k==='mulRes'){RES_ORDER.forEach(r=>{S.mulRes[r]*=ccomp(sh.mulRes[r]);});continue;}
  if(k==='crMul')continue;
  if(k in MULT_T){const f=sh[k];S[k]*=(f>=1?ccomp(f):1/ccomp(1/f));}
  else S[k]=(S[k]||0)+sh[k];
 }
 // timed skill buffs: gentle compression when many overlap
 const sb={mulRes:{}};RES_ORDER.forEach(r=>sb.mulRes[r]=1);for(const k in MULT_T)sb[k]=1;
 list.forEach(id=>{if(s.buffs['cs_'+id]>Date.now())CRMAP[id].sk.eff.forEach(e=>applyEff(sb,e,1));});
 const bc=f=>f<=8?f:8*(1+Math.log(f/8)*.6);
 for(const k in sb){
  if(k==='mulRes'){RES_ORDER.forEach(r=>{S.mulRes[r]*=bc(sb.mulRes[r]);});continue;}
  if(k in MULT_T){const f=sb[k];S[k]*=(f>=1?bc(f):1/bc(1/f));}
  else S[k]=(S[k]||0)+sb[k];
 }
}
// ---- bounties ----
function bCur(b){
 const s=G.s;
 switch(b.k){
  case 'tap':return s.st.taps;case 'prod':return s.life[b.res];case 'raid':return s.st.raids;
  case 'bld':return s.st.builds;case 'exp':return s.st.exps;case 'spell':return s.st.spells;
  case 'feed':return s.st.feeds;case 'conq':return s.st.conq;
 }
 return 0;
}
function bProg(b){return Math.min(b.goal,bCur(b)-b.snap);}
function bDesc(b){
 switch(b.k){
  case 'tap':return 'Tap '+fmt(b.goal)+' times';
  case 'prod':return 'Produce '+fmt(b.goal)+' '+RES[b.res].i+' '+RES[b.res].n;
  case 'raid':return 'Repel '+b.goal+' raid'+(b.goal>1?'s':'');
  case 'bld':return 'Construct '+b.goal+' buildings';
  case 'exp':return 'Finish '+b.goal+' expedition'+(b.goal>1?'s':'');
  case 'spell':return 'Cast '+b.goal+' spells or skills';
  case 'feed':return 'Raise creature bonds '+b.goal+' time'+(b.goal>1?'s':'');
  case 'conq':return 'Conquer '+b.goal+' region'+(b.goal>1?'s':'');
 }
 return '';
}
function genBounty(){
 const s=G.s,e=s.era,pool=['tap','prod','prod','bld'];
 if(e>=1){pool.push('raid','exp','conq');}
 if(e>=2)pool.push('spell');
 if(crCount()>0)pool.push('feed','feed');
 const used=s.bounty.list.map(b=>b.k);
 let k=pool[Math.floor(Math.random()*pool.length)];
 for(let i=0;i<6&&used.indexOf(k)>=0&&k!=='prod';i++)k=pool[Math.floor(Math.random()*pool.length)];
 const b={k,snap:0,goal:1,rew:{secs:60+e*12,xp:.02+.004*e,enc:.2}};
 if(k==='tap')b.goal=60+e*50;
 else if(k==='prod'){const rs=unlockedRes().filter(r=>r!=='crystal');b.res=rs[Math.floor(Math.random()*rs.length)];b.goal=Math.ceil(Math.max(200,G.rates[b.res]*900));}
 else if(k==='raid')b.goal=1+Math.floor(e/3);
 else if(k==='bld')b.goal=4+e*3;
 else if(k==='exp')b.goal=1+(e>=4?1:0);
 else if(k==='spell')b.goal=2+(e>=5?2:0);
 else if(k==='feed')b.goal=2+Math.floor(e/2);
 else if(k==='conq')b.goal=1;
 b.snap=bCur(b);
 return b;
}
function fillBounties(){
 const s=G.s,now=Date.now();
 while(s.bounty.list.length<3&&now>=s.bounty.next){s.bounty.list.push(genBounty());}
}
function claimBounty(i){
 const s=G.s,b=s.bounty.list[i];if(!b||bProg(b)<b.goal)return false;
 const mul=Math.pow(1.5,ascLvl('bounty2'));
 RES_ORDER.forEach(r=>{if(RES[r].era<=s.era&&r!=='crystal')addRes(r,Math.max(20,G.rates[r]*b.rew.secs*mul));});
 addXp(xpReward(b.rew.xp*mul));
 s.bounty.list.splice(i,1);s.bounty.next=Date.now()+120000;s.bounty.done++;
 let extra='';
 if(Math.random()<b.rew.enc&&spawnEncounter())extra=' A stranger followed the contract-bearer home.';
 sys('Bounty complete: <b>'+bDesc(b)+'</b>. Rewards claimed.'+extra);toast('📜 Bounty complete');
 emit('struct');return true;
}
// ---- tales ----
function talesDone(){return Object.keys(G.s.tales).length;}
function checkTales(){
 if(G.busy||G.pendingTale||G.pendingEvent)return;
 for(const t of TALES){
  if(G.s.tales[t.id]===undefined&&G.s.chap>=t.at){G.pendingTale=t;emit('tale',t);return;}
 }
}
function chooseTale(id,i){
 const t=TMAPS[id],ch=t&&t.ch[i];if(!ch||G.s.tales[id]!==undefined)return false;
 G.s.tales[id]=i;G.pendingTale=null;G.dirty=true;
 say('<b>'+t.t+':</b> '+ch.r,'story');
 addXp(xpReward(.03));emit('struct');return true;
}
function applyTales(S){
 for(const id in G.s.tales){const t=TMAPS[id];if(t&&t.ch[G.s.tales[id]])applyEffs(S,t.ch[G.s.tales[id]].eff);}
}
// ---- region/wonder/chapter creature grants ----
function checkCreatureGrants(){
 const s=G.s;
 CRS.forEach(c=>{
  if(s.cr.own[c.id])return;const g=c.g;
  if(g.k==='reg'&&s.regions['r'+g.i])grantCreature(c.id);
  else if(g.k==='chap'&&s.chap>=g.n)grantCreature(c.id);
  else if(g.k==='wonder'&&s.wonders[g.id])grantCreature(c.id);
 });
}
function slowChecks(now){
 const s=G.s;
 if(G.seasonIdx!==seasonIdx()){G.seasonIdx=seasonIdx();G.dirty=true;}
 // natural encounters
 if(s.era>=1){
  if(!s.cr.next)s.cr.next=now+200000;
  if(now>=s.cr.next){
   s.cr.next=now+(480000+Math.random()*420000)/(1+G.S.crLuck);
   if(Math.random()<.75)spawnEncounter();
  }
 }
 checkCreatureGrants();
 fillBounties();
 checkTales();
 autoCastCreatures();
 // trim active
 if(s.cr.active.length>G.S.crSlots){s.cr.active.length=G.S.crSlots;G.dirty=true;}
}
