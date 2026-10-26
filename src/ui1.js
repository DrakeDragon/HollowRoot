'use strict';
// ===== UI part 1: shell, binding, realm, build =====
const ui={tab:'realm',sub:{hero:'stats',map:'regions',trophy:'ach'},mult:1,sel:null,binds:[],sig:{},lastSig:'',need:true};
const $=s=>document.querySelector(s);
function B(fn,cls,tag){const i=ui.binds.length;ui.binds.push({fn,t:0});tag=tag||'span';return '<'+tag+' data-b="'+i+'"'+(cls?' class="'+cls+'"':'')+'>'+fn()+'</'+tag+'>';}
function BC(base,fn){const i=ui.binds.length;ui.binds.push({fn,t:1,base});return 'data-bc="'+i+'" class="'+base+' '+fn()+'"';}
function BW(fn){const i=ui.binds.length;ui.binds.push({fn,t:2});return 'data-bw="'+i+'" style="width:'+fn()+'%"';}
function costHtml(cost){return cost.map(c=>'<span class="'+(G.s.res[c[0]]>=c[1]?'ok':'bad')+'">'+RES[c[0]].i+fmt(c[1])+'</span>').join(' ');}
function costObjArr(o){return Object.keys(o).map(k=>[k,o[k]]);}
function act(a,p,n){return 'data-a="'+a+'" data-p="'+(p===undefined?'':p)+'" data-n="'+(n===undefined?'':n)+'"';}
function pct(a,b){return Math.max(0,Math.min(100,b>0?a/b*100:0));}
function treeSVG(era){
 const leaf=['#5b5646','#6f8a3f','#4fa05a','#3fb868','#38c878','#33d889','#47e8a4','#9affcf'][Math.min(7,era)];
 const n=3+era*2;let c='';
 const pos=[[100,70,40],[70,85,30],[130,85,30],[100,45,28],[60,65,24],[140,65,24],[85,95,22],[115,95,22],[100,100,24],[45,85,20],[155,85,20],[80,40,18],[120,40,18],[100,25,16],[65,50,16],[135,50,16]];
 for(let i=0;i<Math.min(pos.length,n);i++)c+='<circle cx="'+pos[i][0]+'" cy="'+pos[i][1]+'" r="'+pos[i][2]+'" fill="'+leaf+'" opacity="'+(era===0?.35:.92)+'"/>';
 const glow=era>=7?'<circle cx="100" cy="70" r="70" fill="none" stroke="#9affcf" stroke-width="2" opacity=".5"/>':'';
 return '<svg viewBox="0 0 200 200"><path d="M92 190 L96 120 L90 100 L110 100 L104 120 L108 190 Z" fill="#6b4a2c"/><path d="M96 130 L70 108 M104 125 L132 104" stroke="#6b4a2c" stroke-width="5" fill="none"/>'+glow+c+(era===0?'<path d="M70 86 l-18 -12 M130 86 l20 -14 M100 48 l0 -16" stroke="#7a6a50" stroke-width="3"/>':'')+'</svg>';
}

// ---------- shell ----------
const TABS=[
 {id:'realm',n:'Realm',i:'🌳'},{id:'build',n:'Build',i:'🏗️'},{id:'hero',n:'Hero',i:'🧙'},{id:'army',n:'Army',i:'⚔️'},
 {id:'map',n:'Map',i:'🗺️'},{id:'lore',n:'Lore',i:'🔬'},{id:'empire',n:'Empire',i:'🏛️'},{id:'quest',n:'Chronicle',i:'📖'},
 {id:'zoo',n:'Menagerie',i:'🐾'},{id:'board',n:'Board',i:'📜'},{id:'rebirth',n:'Rebirth',i:'♻️'},{id:'trophy',n:'Trophies',i:'🏆'},{id:'set',n:'Settings',i:'⚙️'}
];
function buildShell(){
 $('#nav').innerHTML=TABS.map(t=>'<button data-tab="'+t.id+'"><i>'+t.i+'</i>'+t.n+'</button>').join('');
}
function setTab(id){ui.tab=id;ui.need=true;window.scrollTo(0,0);}
function renderTop(){
 const rs=unlockedRes();
 const sig=rs.join();
 const el=$('#res');
 if(el._sig!==sig){
  el._sig=sig;
  el.innerHTML=rs.map(r=>'<div class="chip" data-r="'+r+'"><b></b><small></small></div>').join('');
 }
 rs.forEach(r=>{
  const c=el.querySelector('[data-r="'+r+'"]');
  const b=c.children[0],sm=c.children[1];
  const a=RES[r].i+' '+fmt(G.s.res[r]),t=(G.rates[r]>=0?'+':'')+fmt(G.rates[r])+'/s';
  if(b._v!==a){b.textContent=a;b._v=a;}
  if(sm._v!==t){sm.textContent=t;sm._v=t;}
 });
 const s=G.s,h=s.hero;
 const sub='Lv '+h.lvl+' '+s.name+' · '+ERAS[s.era].n+' · 👥 '+fmt(Math.floor(s.pop))+'/'+fmt(popCap());
 if($('#sub')._v!==sub){$('#sub').firstChild.textContent=sub;$('#sub')._v=sub;}
 $('#sub').lastChild.textContent=SEASONS[seasonIdx()].i+' '+SEASONS[seasonIdx()].n+' '+fmtTime(seasonLeft());
 const nav=$('#nav');
 nav.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.tab===ui.tab);});
 const dots={hero:h.pts>0||h.sp>0||(h.lvl>=10&&!h.cls),army:!!s.raid.act,rebirth:canRebirth()||canAscend(),zoo:s.cr.enc.length>0,board:s.bounty.list.some(b=>bProg(b)>=b.goal)};
 nav.querySelectorAll('button').forEach(b=>b.classList.toggle('dot',!!dots[b.dataset.tab]));
}
function tabDef(id){return TABDEFS[id];}
function renderTab(){
 ui.binds=[];
 const d=tabDef(ui.tab);
 $('#view').innerHTML=d.render();
 ui.lastSig=d.sig();ui.need=false;
 updateBinds();
 if(d.after)d.after();
}
function updateBinds(){
 const v=$('#view');
 v.querySelectorAll('[data-b]').forEach(el=>{const b=ui.binds[+el.dataset.b];if(!b)return;const x=b.fn();if(el._v!==x){el.innerHTML=x;el._v=x;}});
 v.querySelectorAll('[data-bc]').forEach(el=>{const b=ui.binds[+el.dataset.bc];if(!b)return;const x=b.fn();if(el._v!==x){el.className=b.base+' '+x;el._v=x;}});
 v.querySelectorAll('[data-bw]').forEach(el=>{const b=ui.binds[+el.dataset.bw];if(!b)return;const x=b.fn();if(el._v!==x){el.style.width=x+'%';el._v=x;}});
}
function uiFrame(){
 renderTop();
 const d=tabDef(ui.tab);
 if(ui.need||d.sig()!==ui.lastSig)renderTab();else updateBinds();
}

// ---------- realm ----------
function logHtml(n){return G.log.slice(0,n).map(l=>'<div class="'+l.c+'">'+l.m+'</div>').join('')||'<div class="mt">Nothing yet.</div>';}
function eraPanel(){
 return B(()=>{
  const c=canEra();const s=G.s;
  if(c.max)return '<div class="gd">Your realm is at its zenith: <b>'+ERAS[s.era].n+'</b>. Consider a Rebirth.</div>';
  const e=c.e,lv=ERAS[e].lvl;
  return '<div class="row sb"><div><b>Next: '+ERAS[e].n+'</b><div class="xs mt">'+ERAS[e].tag+'</div></div><button '+act('era')+' class="btn gold '+(c.ok?'':'dis')+'">Advance</button></div>'
   +'<div class="sm" style="margin-top:5px"><span class="'+(c.lvlOk?'ok':'bad')+'">Hero Lv '+lv+'</span> · '+costHtml(c.cost)+'</div>';
 },'','div');
}
function realmRender(){
 const s=G.s,rs=unlockedRes();
 let h='';
 h+='<div id="tapwrap"><div id="tapBtn">'+treeSVG(s.era)+'</div>';
 h+='<div style="margin-top:6px;font-size:15px">'+B(()=>'Tap: <b class="gd">+'+fmt(tapValue())+'</b> '+RES[G.s.focus].i+' · crit '+Math.round(G.S.crit*100)+'%')+'</div></div>';
 h+='<div class="focus">'+rs.map(r=>'<button '+act('focus',r)+' '+BC('btn sm',()=>G.s.focus===r?'on':'')+'>'+RES[r].i+' '+RES[r].n+'</button>').join('')+'</div>';
 h+='<div class="card">'+eraPanel()+'</div>';
 if(s.raid.act)h+='<div class="card" style="border-color:var(--red)">'+B(()=>{const r=G.s.raid.act;if(!r)return '';const left=Math.max(0,(r.ends-Date.now())/1000);const ok=defensePower()>=r.str;return '<b class="bad">⚠️ '+r.name+'</b> arrives in '+Math.ceil(left)+'s<div class="sm">Defense '+fmt(defensePower())+' / '+fmt(r.str)+' → <b class="'+(ok?'ok':'bad')+'">'+(ok?'HOLDING':'LOSING')+'</b></div>';},'','div')+'</div>';
 const sp=SPELLS.filter(x=>x.era<=s.era);
 if(sp.length){
  h+='<h2>Spells</h2><div class="grid2">'+sp.map(x=>'<button '+act('spell',x.id)+' '+BC('btn',()=>{const rd=spellReady(x);return (rd&&G.s.res.mana>=spellCost(x))?'':'dis';})+' style="text-align:left"><div>'+x.i+' <b>'+x.n+'</b></div><div class="xs mt">'+x.d+'</div><div class="xs">'+B(()=>{const t=(G.s.spells[x.id]||0)-Date.now();if(G.s.buffs[x.id]>Date.now())return '<span class="gd">ACTIVE '+Math.ceil((G.s.buffs[x.id]-Date.now())/1000)+'s</span>';return t>0?'⏳ '+fmtTime(t/1000):'✨ '+fmt(spellCost(x));})+'</div></button>').join('')+'</div>';
 }
 const cs=Object.keys(s.comp);
 if(cs.length)h+='<h2>Party</h2><div class="row" style="flex-wrap:wrap;gap:10px">'+cs.map(id=>'<div class="card sm" style="margin:0;text-align:center"><div style="font-size:24px">'+CMAP[id].i+'</div><div class="xs">'+CMAP[id].n+'</div><div class="xs gd">Lv '+s.comp[id].lvl+'</div></div>').join('')+'</div>';
 h+='<h2>Chronicle</h2><div class="card log">'+B(()=>logHtml(14),'','div')+'</div>';
 return h;
}
// ---------- build ----------
function nBuy(b){const m=ui.mult;return m==='max'?Math.max(1,bMaxN(b)):m;}
function workerRows(){
 const rs=unlockedRes();
 return rs.map(r=>'<div class="row sb" style="padding:3px 0"><div>'+RES[r].i+' '+RES[r].n+' <b>'+B(()=>fmt(G.s.work[r]||0))+'</b></div><div class="row" style="gap:4px">'
  +['-10','-1','+1','+10'].map(v=>'<button class="btn sm" '+act('work',r,v)+'>'+v+'</button>').join('')+'<button class="btn sm" '+act('work',r,'max')+'>Max</button></div></div>').join('');
}
function bldCard(b){
 const own=()=>G.s.bld[b.id]||0;
 let info='';
 if(b.type==='prod')info=B(()=>{const c=own();return '+'+fmt(b.rate*bMult(c)*G.S.mulAll*G.S.mulRes[b.res])+'/s each '+RES[b.res].i;});
 else if(b.type==='house')info=B(()=>'Houses '+fmt(b.pop*G.S.popMul)+' each');
 else info=b.desc;
 return '<div class="card sm"><div class="row"><div class="ico">'+b.i+'</div><div class="grow"><div class="row sb"><b>'+b.n+'</b><span class="badge">x'+B(()=>own())+'</span></div>'
  +'<div class="xs mt">'+info+'</div>'
  +'<div class="mile"><i '+BW(()=>{const c=own(),nx=nextMil(c);if(!nx)return 100;let pv=0;for(const m of MIL)if(m<=c)pv=m;return pct(c-pv,nx-pv);})+'></i></div>'
  +'<div class="xs mt">'+B(()=>{const nx=nextMil(own());return nx?'Next x2 at '+nx:'Maxed milestones';})+'</div></div></div>'
  +'<div class="row sb" style="margin-top:6px"><div class="sm">'+B(()=>costHtml(bCostN(b,nBuy(b))))+'</div><button '+act('buy',b.id)+' '+BC('btn pri sm',()=>canPay(bCostN(b,nBuy(b)))?'':'dis')+'>'+B(()=>'Buy '+nBuy(b))+'</button></div></div>';
}
function wonderCard(w){
 const done=()=>!!G.s.wonders[w.id];
 return '<div class="card sm"><div class="row"><div class="ico">'+w.i+'</div><div class="grow"><b>'+w.n+'</b><div class="xs mt">'+w.d+'</div><div class="xs gd">'+w.eff.map(effText).join(', ')+'</div></div></div>'
  +B(()=>done()?'<div class="ok sm" style="margin-top:5px">✔ Built</div>':'<div class="row sb" style="margin-top:6px"><div class="sm">'+costHtml(wonderCostArr(w))+'</div><button class="btn gold sm" '+act('wonder',w.id)+'>Build</button></div>','','div')+'</div>';
}
function buildRender(){
 const s=G.s;
 let h='<div class="row sb"><h2 style="margin:0">Workers</h2><div class="sm">Idle: '+B(()=>fmt(idleWorkers()))+'</div></div>';
 h+='<div class="card sm">'+workerRows()+'<div class="row" style="margin-top:6px"><button class="btn sm grow" '+act('balance')+'>⚖️ Balance all</button><button class="btn sm grow" '+act('clearw')+'>Clear</button></div></div>';
 h+='<div class="row sb"><h2 style="margin:0">Buildings</h2><div class="row" style="gap:4px">'+[1,10,100,'max'].map(m=>'<button '+act('mult',m)+' '+BC('btn sm',()=>ui.mult===m?'on':'')+'>x'+(m==='max'?'Max':m)+'</button>').join('')+'</div></div><div style="height:8px"></div>';
 const bl=BLD.filter(b=>b.era<=s.era).sort((a,b)=>a.era-b.era);
 h+=bl.map(bldCard).join('');
 const nx=BLD.filter(b=>b.era===s.era+1);
 if(nx.length)h+='<div class="card sm mt">🔒 Next era unlocks: '+nx.map(b=>b.i+' '+b.n).join(', ')+'</div>';
 const ws=WONDERS.filter(w=>w.era<=s.era);
 if(ws.length)h+='<h2>Wonders</h2>'+ws.map(wonderCard).join('');
 return h;
}
