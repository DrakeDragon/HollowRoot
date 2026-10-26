// Headless progression bot. Usage: node sim2.js <hours> [idle]
const fs=require('fs'),vm=require('vm');
const order=['data1','data2','data3','data5a','data5b','data5c','data6a','data6b','data4','engine1','engine2','engine3'];
const files=order.map(f=>fs.readFileSync(__dirname+'/'+f+'.js','utf8')).join('\n');
const bot=`
const NOPREST=process.env.NOPREST==='1';const HOURS=+process.env.HOURS||4, ACTIVE=process.env.IDLE!=='1';
let lastEra=-1,lastReb=0,rebirths=0,ascs=0,lastLog=0;
G.hooks.struct=()=>{};
G.hooks.tale=t=>{};
initGame();
function step(t){
 FAKE.now+=1000;
 tick(1);
 const s=G.s;
 if(ACTIVE){for(let i=0;i<4;i++)tap();}
 if(t%2===0){
  const ce=canEra();let saving=false;
  if(ce.cost){let v=0;ce.cost.forEach(c=>v+=c[1]*RES[c[0]].v);let sv=0;RES_ORDER.forEach(r=>sv+=s.res[r]*RES[r].v);saving=(G.valueRate*900>=v)&&sv<v*1.2;}
  if(!saving){let n=0,b;while((b=bestBuy())&&n++<60)buyBuilding(b.id,1);}
 }
 if(t%5===0&&idleWorkers()>0)balanceWorkers();
 if(t%3===0){while(canEra().ok)advanceEra();}
 if(t%4===0){for(const te of TECH)if(techAvail(te))startTech(te.id);}
 if(t%10===0){
  const h=s.hero;
  if(h.lvl>=10&&!h.cls)chooseClass('root');
  const k=['str','vit','int','cha','wis','dex'];while(h.pts>0)addAttr(k[h.lvl%6],h.pts);
  for(const sk of SKILLS)if(skillAvail(sk))for(let i=0;i<5;i++)learnSkill(sk.id);
  for(const g of GEAR)upgradeGear(g.id);
  for(const c of COMP)if(s.comp[c.id])compLevelUp(c.id);
  for(const w of WONDERS)buildWonder(w.id);
  for(const sp of SPELLS)castSpell(sp.id);
  for(const r of REG)conquer(r.id);
  for(const e of EDICTS){if(edictAvail(e)&&s.edicts.length<G.S.edictSlots)toggleEdict(e.id);}
  for(const e of EXPS)if(expAvail(e))startExp(e.id);
  // creatures
  for(const e of s.cr.enc.slice())befriend(e.id);
  const owned=CRS.filter(c=>s.cr.own[c.id]);
  owned.sort((a,b)=>b.rar-a.rar||b.era-a.era);
  // keep best in active slots
  s.cr.active=owned.slice(0,G.S.crSlots).map(c=>c.id);G.dirty=true;
  for(const c of owned){let n=0;while(n++<3&&crBond(c.id));crEvolve(c.id);}
  for(const id of s.cr.active)castCrSkill(id);
  if(s.era>=1)wildCall();
  for(let i=s.bounty.list.length-1;i>=0;i--)claimBounty(i);
 }
 if(t%20===0||(s.raid.act&&t%2===0)){
  let u=null;for(const x of UNITS)if(unitAvail(x))u=x;
  if(u){const need=s.raid.act&&defensePower()<s.raid.act.str;const n=uMaxN(u);trainUnit(u.id,need?n:Math.ceil(n*.4));}
 }
 if(G.pendingEvent)resolveEvent(G.pendingEvent.ch[0].f);
 if(G.pendingTale)chooseTale(G.pendingTale.id,0);
 // prestige
 const gain=heartGain();
 if(!NOPREST&&canRebirth()&&t-lastReb>1200&&gain>=Math.max(3,0.35*s.pres.total)){
  const before=s.pres.total;
  rebirth();rebirths++;lastReb=t;
  console.log('  >> REBIRTH #'+rebirths+' at '+(t/3600).toFixed(2)+'h gain '+fmt(gain)+' total heart '+fmt(G.s.pres.total));
  for(const sh of SHOP){let n=0;while(n++<20&&buyShop(sh.id));}
 }
 if(!NOPREST&&canAscend()&&ascGain()>=1+G.s.asc.count){
  const g=ascGain();ascend();ascs++;lastReb=t;
  console.log('  >> ASCEND #'+ascs+' at '+(t/3600).toFixed(2)+'h seeds +'+g+' (total '+G.s.asc.seeds+')');
  for(const a of ASHOP){let n=0;while(n++<20&&buyAsc(a.id));}
 }
 if(s.era!==lastEra){lastEra=s.era;console.log('t='+(t/60).toFixed(1)+'min era '+s.era+' lvl '+s.hero.lvl+' pop '+Math.floor(s.pop)+' bld '+totalBuildings()+' army '+fmt(armyPower())+' reg '+Object.keys(s.regions).length+' cre '+crCount()+' chap '+s.chap+' heart '+heartGain());}
 if(t-lastLog>=7200){lastLog=t;console.log('  @'+(t/3600).toFixed(1)+'h era '+s.era+' lvl '+s.hero.lvl+' reb '+rebirths+' asc '+ascs+' chap '+s.chap+'/'+CHAPTERS.length+' cre '+crCount()+' evo '+crEvoCount()+' reg '+Object.keys(s.regions).length+' tales '+talesDone()+' ach '+Object.keys(s.ach).length+' mulAll '+fmt(G.S.mulAll)+' vrate '+fmt(G.valueRate));}
}
for(let t=1;t<=HOURS*3600;t++)step(t);
if(process.env.DIAG2){const c=canEra();console.log('era',G.s.era,'cost',JSON.stringify((c.cost||[]).map(x=>x[0]+':'+fmt(x[1]))),'res',RES_ORDER.map(r=>r+':'+fmt(G.s.res[r])+'(+'+fmt(G.rates[r])+')').join(' '),'lvlok',c.lvlOk,'work',JSON.stringify(G.s.work));}
if(process.env.DIAG){
 const s=G.s;const full=computeStats();console.log('mulAll full',full.mulAll,'crMul',full.crMul,'xp',full.xp,'click',full.click);
 const act=s.cr.active.slice();s.cr.active=[];const noc=computeStats();console.log('no creatures mulAll',noc.mulAll,'crMul',noc.crMul);s.cr.active=act;
 const tl=s.tales;s.tales={};const not=computeStats();console.log('no tales mulAll',not.mulAll);s.tales=tl;
 const as=s.asc.seeds;console.log('seeds',as,'heart',s.pres.total,'ach',Object.keys(s.ach).length);
 console.log('active',act.join(','),act.map(id=>s.cr.own[id].lvl+(s.cr.own[id].evo?'E':'')).join(','));
}
console.log('FINAL h='+HOURS,'era',G.s.era,'lvl',G.s.hero.lvl,'chap',G.s.chap,'cre',crCount(),'evo',crEvoCount(),'reg',Object.keys(G.s.regions).length,'tales',talesDone(),'ach',Object.keys(G.s.ach).length,'raids',G.s.st.raids,'lost',G.s.st.lost,'bounties',G.s.bounty.done,'reb',rebirths,'asc',ascs);
`;
const FAKE={now:1.8e12};
class FD extends Date{constructor(...a){if(a.length)super(...a);else super(FAKE.now);}static now(){return FAKE.now;}}
const store={};
const ctx={console,Math,Date:FD,JSON,Object,Array,Number,String,isFinite,isNaN,parseInt,parseFloat,FAKE,process,
 localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v;}},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,decodeURIComponent,encodeURIComponent};
vm.createContext(ctx);
process.env.HOURS=process.argv[2]||'4';if(process.argv[4]==='noprest')process.env.NOPREST='1';if(process.argv[3]==='idle')process.env.IDLE='1';
vm.runInContext(files+'\n'+bot,ctx);
