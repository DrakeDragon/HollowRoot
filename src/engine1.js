'use strict';
// ===== engine part 1: utils, state, stats, rates =====
const SAVE_KEY='hollowroot_save_v1';
const SUF=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd','Td','Qad','Qid','Sxd','Spd','Ocd','Nod','Vg'];
function fmt(n,d){
 if(d===undefined)d=2;
 if(n===undefined||n===null||isNaN(n))return '0';
 if(!isFinite(n))return '∞';
 if(n<0)return '-'+fmt(-n,d);
 if(n<1000){if(n>=100)return String(Math.floor(n));if(n>=10)return (Math.round(n*10)/10).toString();return (Math.round(n*100)/100).toString();}
 const e=Math.floor(Math.log10(n)/3);
 if(e<SUF.length&&(!G.s||G.s.set.notation!=='sci')){return (n/Math.pow(1000,e)).toFixed(d)+SUF[e];}
 const x=Math.floor(Math.log10(n));return (n/Math.pow(10,x)).toFixed(2)+'e'+x;
}
function fmtTime(sec){
 sec=Math.max(0,Math.floor(sec));
 if(sec<60)return sec+'s';
 if(sec<3600)return Math.floor(sec/60)+'m '+(sec%60)+'s';
 if(sec<86400)return Math.floor(sec/3600)+'h '+Math.floor(sec%3600/60)+'m';
 return Math.floor(sec/86400)+'d '+Math.floor(sec%86400/3600)+'h';
}
const G={s:null,S:null,rates:null,base:null,xps:0,dirty:true,log:[],hooks:{}};
function emit(k,a,b){if(G.hooks[k])G.hooks[k](a,b);}
function say(msg,cls){
 G.log.unshift({t:Date.now(),m:msg,c:cls||''});
 if(G.log.length>80)G.log.pop();
 emit('log');
}
function sys(msg){say('<b>[SYSTEM]</b> '+msg,'sys');}
function toast(m){emit('toast',m);}

function newState(){
 const t=Date.now();
 const s={v:1,t,created:t,name:'Warden',
  res:{},tot:{},life:{},bld:{},work:{},unit:{},era:0,techs:{},rq:[],
  hero:{lvl:1,xp:0,pts:0,sp:0,attr:{str:0,dex:0,int:0,wis:0,cha:0,vit:0},skills:{},cls:null,gear:{weapon:0,armor:0,trinket:0,crown:0}},
  comp:{},regions:{},wonders:{},edicts:[],spells:{},buffs:{},raid:{next:0,act:null},exp:[],relics:{},
  pres:{heart:0,total:0,count:0,shop:{}},ach:{},chap:0,
  cr:{own:{},active:[],enc:[],next:0,call:0,cd:{}},tales:{},bounty:{list:[],next:0,done:0},asc:{seeds:0,total:0,count:0,shop:{}},
  st:{taps:0,raids:0,spells:0,exps:0,lost:0,relics:0,feeds:0,builds:0,conq:0},
  pop:0,focus:'wood',set:{notation:'short',anim:true,vibe:true,confirm:true},
  run:{start:t},evt:{next:t+300000},auto:{b:0},
  seen:{}};
 RES_ORDER.forEach(r=>{s.res[r]=0;s.tot[r]=0;s.life[r]=0;s.work[r]=0;});
 s.res.wood=0;
 return s;
}
function shopLvl(id){return (G.s&&G.s.pres.shop[id])||0;}

// ---- effects ----
const MULT_T={crMul:1,seed:1,mulAll:1,mulWork:1,click:1,popMul:1,popGrow:1,armyMul:1,xp:1,rSpeed:1,spellCd:1,spellCost:1,spellDur:1,spellPow:1,raidDef:1,raidLoot:1,bond:1,critMul:1,expSpeed:1,gain:1};
function resList(r){return Array.isArray(r)?r:[r];}
function applyEff(S,e,m){
 if(m===undefined)m=1;
 if(e.t==='mulRes'){const f=Math.pow(e.v,m);resList(e.res).forEach(r=>{S.mulRes[r]*=f;});return;}
 if(e.t in MULT_T){S[e.t]*=Math.pow(e.v,m);return;}
 S[e.t]=(S[e.t]||0)+e.v*m;
}
function applyEffs(S,arr,m){arr.forEach(e=>applyEff(S,e,m));}
function bCount(id){return G.s.bld[id]||0;}
function totalBuildings(){let n=0;for(const k in G.s.bld)n+=G.s.bld[k];return n;}
function pillarPoints(){
 const s=G.s,p={};PILLARS.forEach(x=>p[x.id]=0);
 BLD.forEach(b=>{const c=s.bld[b.id]||0;if(c&&b.pil)p[b.pil]+=c*(1+b.era*.5)*(b.type==='civic'?2:1);});
 for(const id in s.techs){const t=TMAP[id];if(t&&t.pil)p[t.pil]+=2*t.tier;}
 const rc=Object.keys(s.regions).length;p.mil+=rc*3;p.stab+=rc;
 for(const id in s.comp)p.cul+=0.5*s.comp[id].lvl;
 p.cul+=Object.keys(s.wonders).length*20;
 p.stab+=Math.min(60,s.st.raids*.5);
 return p;
}
function pillarLevel(pts){return pts<10?0:Math.min(PIL_MAX,Math.floor(1+Math.log(pts/10)/Math.log(2.2)));}
function pillarLevels(){const p=pillarPoints(),o={};PILLARS.forEach(x=>o[x.id]=pillarLevel(p[x.id]));return o;}
function empireScore(){const l=pillarLevels();let t=0;for(const k in l)t+=l[k];return t;}

function computeStats(){
 const s=G.s,S={mulRes:{},workPct:.03,clickPct:.03,costRed:0,unitCost:0,crit:.05,offCap:8,offEff:.5,edictSlots:1,expSlots:1,resSlots:1,crSlots:1,crLuck:0};
 for(const k in MULT_T)S[k]=1;
 RES_ORDER.forEach(r=>S.mulRes[r]=1);
 for(const id in s.techs)applyEffs(S,TMAP[id].eff);
 // hero
 const a=s.hero.attr;
 S.click*=1+.015*a.str;S.armyMul*=1+.008*a.str;
 S.crit+=.004*a.dex;S.expSpeed*=1+.005*a.dex;
 S.rSpeed*=1+.006*a.int;S.spellCost*=Math.max(.5,1-.003*a.int);
 S.xp*=1+.01*a.wis;S.offEff+=.002*a.wis;
 S.mulRes.gold*=1+.006*a.cha;S.popMul*=1+.003*a.cha;S.bond*=1+.01*a.cha;
 S.raidDef*=1+.008*a.vit;S.mulAll*=1+.002*a.vit;
 for(const id in s.hero.skills){const sk=SMAP[id];if(sk)applyEffs(S,sk.eff,s.hero.skills[id]);}
 const g=s.hero.gear;
 S.click*=Math.pow(1.12,g.weapon);S.armyMul*=Math.pow(1.04,g.weapon);
 S.raidDef*=Math.pow(1.1,g.armor);S.popMul*=Math.pow(1.02,g.armor);
 S.mulAll*=Math.pow(1.03,g.trinket);
 S.xp*=Math.pow(1.05,g.crown);S.spellCost*=Math.pow(.99,g.crown);
 for(const id in s.comp)applyEffs(S,CMAP[id].eff,s.comp[id].lvl);
 for(const id in s.regions)applyEffs(S,REG[+id.slice(1)].eff);
 for(const id in s.wonders)applyEffs(S,WMAP[id].eff);
 s.edicts.forEach(id=>applyEffs(S,EMAP[id].eff));
 for(const id in s.relics)applyEffs(S,RLMAP[id].eff);
 BLD.forEach(b=>{if(b.type==='civic'){const c=s.bld[b.id]||0;if(c)applyEff(S,b.eff,c);}});
 const gr=s.bld.grove||0;if(gr)S.popGrow*=Math.pow(1.05,gr);
 const rc=s.bld.roost||0;if(rc)S.armyMul*=Math.pow(1.01,rc);
 SHOP.forEach(sh=>{const l=shopLvl(sh.id);if(l&&sh.eff)applyEffs(S,sh.eff,l);});
 S.mulAll*=Math.pow(1+0.05*s.pres.total,.35);
 S.mulAll*=Math.pow(1.1,0);
 S.mulAll*=Math.pow(1.1,shopLvl('legacy')*0); // applied via SHOP eff
 let ac=0;for(const k in s.ach)ac++;S.mulAll*=1+0.01*ac;S.achCount=ac;
 const pl=pillarLevels();S.pl=pl;
 S.mulRes.gold*=Math.pow(1.06,pl.econ);S.costRed+=.005*pl.econ;
 ['wood','stone','iron'].forEach(r=>S.mulRes[r]*=Math.pow(1.05,pl.ind));
 S.armyMul*=Math.pow(1.06,pl.mil);
 S.mulRes.mana*=Math.pow(1.07,pl.arc);S.mulRes.crystal*=Math.pow(1.05,pl.arc);
 S.xp*=Math.pow(1.05,pl.cul);S.bond*=Math.pow(1.04,pl.cul);
 S.raidDef*=Math.pow(1.06,pl.stab);S.popMul*=Math.pow(1.03,pl.stab);
 applyTales(S);
 ASHOP.forEach(a=>{const l=ascLvl(a.id);if(l&&a.eff)applyEffs(S,a.eff,l);});
 S.mulAll*=Math.pow(1+0.5*s.asc.seeds*S.seed,.6);
 S.crSlots+=(s.era>=2?1:0)+(s.era>=4?1:0)+(s.era>=6?1:0);
 creatureStats(S);
 applySeason(S);
 // buffs
 const now=Date.now(),b=s.buffs;
 const on=id=>b[id]&&b[id]>now;
 if(on('surge'))S.mulAll*=3;
 if(on('roar'))S.click*=10;
 if(on('skin'))S.raidDef*=3;
 if(on('fall'))S.armyMul*=4;
 if(on('song')){S.xp*=5;S.bond*=3;}
 S.costRed=Math.min(.6,S.costRed);S.unitCost=Math.min(.5,S.unitCost);S.crit=Math.min(.6,S.crit);
 S.spellCost=Math.max(.25,S.spellCost);S.spellCd=Math.max(.2,S.spellCd);
 S.crSlots=Math.min(9,Math.floor(S.crSlots+1e-9));S.edictSlots=Math.floor(S.edictSlots);S.expSlots=Math.floor(S.expSlots);S.resSlots=Math.floor(S.resSlots);
 return S;
}
function bMult(count){let m=1;for(let i=0;i<MIL.length;i++){if(count>=MIL[i])m*=2;else break;}return m;}
function nextMil(count){for(let i=0;i<MIL.length;i++)if(count<MIL[i])return MIL[i];return null;}
function popCap(){
 let cap=2;BLD.forEach(b=>{if(b.type==='house')cap+=(G.s.bld[b.id]||0)*b.pop;});
 return Math.floor(cap*G.S.popMul);
}
function totalWorkers(){let n=0;for(const r of RES_ORDER)n+=G.s.work[r]||0;return n;}
function computeRates(){
 const s=G.s,S=G.S,out={},base={};
 RES_ORDER.forEach(r=>{base[r]=0;});
 BLD.forEach(b=>{if(b.type==='prod'){const c=s.bld[b.id]||0;if(c)base[b.res]+=c*b.rate*bMult(c);}});
 RES_ORDER.forEach(r=>{
  const w=s.work[r]||0;
  const wm=1+S.workPct*S.mulWork*Math.pow(w,.7);
  const flat=w*.05*Math.pow(2,s.era)*S.mulWork;
  out[r]=(base[r]*wm+flat)*S.mulAll*S.mulRes[r];
 });
 G.rates=out;G.base=base;
 let vr=0;RES_ORDER.forEach(r=>vr+=out[r]*RES[r].v);
 G.valueRate=vr;
 G.xps=(.4+.015*Math.pow(vr,.3))*S.xp;
}
function recalc(){G.S=computeStats();computeRates();G.dirty=false;}
function tapValue(){
 const r=G.s.focus,S=G.S;
 return (1+G.rates[r]*S.clickPct)*S.click;
}
// ---- costs ----
function bCostN(b,n){
 const owned=G.s.bld[b.id]||0,g=b.g;
 const f=Math.pow(g,owned)*(Math.pow(g,n)-1)/(g-1)*(1-G.S.costRed);
 return b.cost.map(c=>[c[0],c[1]*f]);
}
function canPay(cost){for(const c of cost)if((G.s.res[c[0]]||0)<c[1])return false;return true;}
function pay(cost){cost.forEach(c=>{G.s.res[c[0]]-=c[1];});}
function maxAffordN(base,g,owned,disc,res){
 let best=Infinity;
 for(const c of base){
  const a=c[1]*Math.pow(g,owned)*disc,have=G.s.res[c[0]]||0;
  if(have<a)return 0;
  const n=Math.floor(Math.log(1+have*(g-1)/a)/Math.log(g)+1e-9);
  best=Math.min(best,n);
 }
 return isFinite(best)?best:0;
}
function bMaxN(b){return maxAffordN(b.cost,b.g,G.s.bld[b.id]||0,1-G.S.costRed);}
function uCostN(u,n){
 const owned=G.s.unit[u.id]||0,g=UG;
 const f=Math.pow(g,owned)*(Math.pow(g,n)-1)/(g-1)*(1-G.S.unitCost);
 return u.cost.map(c=>[c[0],c[1]*f]);
}
function uMaxN(u){return maxAffordN(u.cost,UG,G.s.unit[u.id]||0,1-G.S.unitCost);}
function armyPower(){
 let p=0;UNITS.forEach(u=>{p+=(G.s.unit[u.id]||0)*u.p;});
 return p*G.S.armyMul;
}
function totalUnits(){let n=0;for(const k in G.s.unit)n+=G.s.unit[k];return n;}
function xpNeed(l){return 35*l*Math.pow(1.14,l);}
function unlockedRes(){return RES_ORDER.filter(r=>RES[r].era<=G.s.era);}
