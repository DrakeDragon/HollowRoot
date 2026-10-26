'use strict';
// ===== UI part 5: graphics layer (living realm scene, portraits, effects) =====
// later declarations override earlier ones (single concatenated script)
const SK=[ // per-era palettes: skyTop, skyBottom, farHill, midHill, ground, leaf, trunk
 ['#241f24','#6e5a4c','#3a3236','#4a3f3a','#3b342e','#6b6455','#4a3526'],
 ['#2a4658','#e9b27c','#41555a','#4b6a50','#44603f','#7ea044','#5c3f27'],
 ['#3b78b4','#cfe8f4','#5d7f93','#5f9461','#4f8a4b','#58b05a','#6b4a2c'],
 ['#3f6fa8','#d8ecf6','#6a8aa3','#5ea36a','#4d9a55','#45bb68','#6d4a2a'],
 ['#3a5fa0','#e4e0ec','#6f7fa6','#58a083','#46936d','#3fc77d','#70502f'],
 ['#3a2f78','#f1c1a0','#6a5a92','#4c8a86','#3e8470','#37d28e','#6e4d30'],
 ['#2a2468','#e8a0c0','#5d4a98','#418a96','#35806e','#34e09f','#6a4b38'],
 ['#150f4a','#8f6ad8','#3b2f86','#2d7f9e','#2a7a74','#6bffc8','#7b5a8a']
];
const SEAS_LEAF=[null,null,['#d9822b','#c24a2a','#e8a53a'],['#e8f2f8','#cfe3ee','#f4fbff']];
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function bldTier(){return Math.min(11,2+Math.floor(Math.log2(totalBuildings()+1)*1.1));}
function houseSVG(x,y,w,h,era,i,night){
 const wall=['#6b5a48','#8a6f55','#b79a74','#c4b08c','#cfcad8','#d9c7b0','#e0d0e0','#c9b8ff'][era];
 const roof=['#4a3a30','#7a4b2a','#a8472f','#9a3a3a','#46628f','#8a3f6a','#6a4aa8','#40d8b4'][era];
 const lit='#ffd978';let s='';
 if(era<=1){ // hut / tent
  s+='<path d="M'+(x-w/2)+' '+y+' L'+x+' '+(y-h)+' L'+(x+w/2)+' '+y+'Z" fill="'+wall+'"/><path d="M'+x+' '+(y-h)+' L'+(x+w/2)+' '+y+' L'+x+' '+y+'Z" fill="#00000030"/><rect x="'+(x-2)+'" y="'+(y-h*.4)+'" width="4" height="'+(h*.4)+'" fill="#2b1f16"/>';
 }else if(era<=4){
  s+='<rect x="'+(x-w/2)+'" y="'+(y-h*.62)+'" width="'+w+'" height="'+(h*.62)+'" fill="'+wall+'"/><rect x="'+x+'" y="'+(y-h*.62)+'" width="'+(w/2)+'" height="'+(h*.62)+'" fill="#0003"/>'
   +'<path d="M'+(x-w/2-2)+' '+(y-h*.6)+' L'+x+' '+(y-h)+' L'+(x+w/2+2)+' '+(y-h*.6)+'Z" fill="'+roof+'"/>'
   +'<rect x="'+(x-w*.28)+'" y="'+(y-h*.45)+'" width="'+(w*.2)+'" height="'+(h*.2)+'" fill="'+(night?lit:'#2a3340')+'" class="'+(night?'win':'')+'"/>'
   +(era>=3?'<rect x="'+(x+w*.14)+'" y="'+(y-h*.45)+'" width="'+(w*.2)+'" height="'+(h*.2)+'" fill="'+lit+'" opacity=".85" class="win"/>':'')
   +'<rect x="'+(x+w*.22)+'" y="'+(y-h*1.05)+'" width="3" height="'+(h*.3)+'" fill="#3a2e28"/><circle class="smoke" style="--d:'+(i%5)*.6+'s" cx="'+(x+w*.22+1.5)+'" cy="'+(y-h*1.1)+'" r="2.4" fill="#fff" opacity=".4"/>';
 }else if(era<=6){ // towers
  s+='<rect x="'+(x-w*.36)+'" y="'+(y-h*1.15)+'" width="'+(w*.72)+'" height="'+(h*1.15)+'" fill="'+wall+'"/><rect x="'+x+'" y="'+(y-h*1.15)+'" width="'+(w*.36)+'" height="'+(h*1.15)+'" fill="#0003"/>'
   +'<path d="M'+(x-w*.48)+' '+(y-h*1.12)+' L'+x+' '+(y-h*1.75)+' L'+(x+w*.48)+' '+(y-h*1.12)+'Z" fill="'+roof+'"/>'
   +'<rect x="'+(x-2)+'" y="'+(y-h*.8)+'" width="4" height="'+(h*.22)+'" rx="2" fill="'+lit+'" class="win"/><rect x="'+(x-2)+'" y="'+(y-h*.42)+'" width="4" height="'+(h*.2)+'" rx="2" fill="'+lit+'" opacity=".8" class="win"/>'
   +'<path d="M'+x+' '+(y-h*1.75)+' L'+x+' '+(y-h*1.95)+' L'+(x+8)+' '+(y-h*1.88)+' L'+x+' '+(y-h*1.82)+'" fill="#e8bf55" stroke="#e8bf55" stroke-width=".8"/>';
 }else{ // crystal spires
  s+='<path d="M'+(x-w*.34)+' '+y+' L'+(x-w*.18)+' '+(y-h*1.5)+' L'+x+' '+(y-h*2)+' L'+(x+w*.2)+' '+(y-h*1.4)+' L'+(x+w*.34)+' '+y+'Z" fill="url(#gCry)" opacity=".95"/>'
   +'<path d="M'+x+' '+(y-h*2)+' L'+(x+w*.2)+' '+(y-h*1.4)+' L'+(x+w*.34)+' '+y+' L'+x+' '+y+'Z" fill="#fff" opacity=".18"/>'
   +'<circle cx="'+x+'" cy="'+(y-h*2.1)+'" r="3" fill="#fff" class="twk" style="--d:'+(i%4)*.4+'s"/>';
 }
 return s;
}
function treeBlobs(era,cols,n){
 let s='';
 const base=[[180,96,38],[150,108,30],[210,108,30],[180,70,30],[142,86,24],[218,86,24],[165,124,22],[195,124,22],[120,112,20],[240,112,20],[160,52,22],[200,52,22],[180,36,18],[132,70,16],[228,70,16],[180,140,24]];
 for(let i=0;i<Math.min(base.length,n);i++){
  const b=base[i],c=cols[i%cols.length];
  s+='<circle cx="'+b[0]+'" cy="'+b[1]+'" r="'+b[2]+'" fill="'+c+'"/>';
 }
 for(let i=0;i<Math.min(base.length,n);i++){
  const b=base[i];s+='<circle cx="'+(b[0]-b[2]*.28)+'" cy="'+(b[1]-b[2]*.3)+'" r="'+(b[2]*.55)+'" fill="#fff" opacity=".13"/>';
 }
 return s;
}
function sceneSVG(era,seas,night){
 const P=SK[era],S=SEAS_LEAF[seas];
 let leafCols=S?S:[P[5],shade(P[5],-18),shade(P[5],14)];
 const bare=era===0;
 const n=bare?0:Math.min(16,4+era*2);
 let defs='<defs><linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+P[0]+'"/><stop offset="1" stop-color="'+P[1]+'"/></linearGradient>'
  +'<linearGradient id="gTrunk" x1="0" x2="1"><stop offset="0" stop-color="'+shade(P[6],-25)+'"/><stop offset=".5" stop-color="'+P[6]+'"/><stop offset="1" stop-color="'+shade(P[6],-35)+'"/></linearGradient>'
  +'<linearGradient id="gGnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+P[4]+'"/><stop offset="1" stop-color="'+shade(P[4],-40)+'"/></linearGradient>'
  +'<linearGradient id="gCry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8fff0"/><stop offset="1" stop-color="#6b7cff"/></linearGradient>'
  +'<radialGradient id="gGlow"><stop offset="0" stop-color="'+P[5]+'" stop-opacity=".55"/><stop offset="1" stop-color="'+P[5]+'" stop-opacity="0"/></radialGradient>'
  +'<radialGradient id="gSun"><stop offset="0" stop-color="#fff6c8"/><stop offset=".4" stop-color="#ffe08a"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient></defs>';
 let s='<svg viewBox="0 0 360 210" preserveAspectRatio="xMidYMax slice" class="scene">'+defs;
 s+='<rect width="360" height="210" fill="url(#gSky)"/>';
 // stars
 let st='';for(let i=0;i<34;i++)st+='<circle cx="'+(rnd(i)*360).toFixed(0)+'" cy="'+(rnd(i+50)*110).toFixed(0)+'" r="'+(0.4+rnd(i+9)*.9).toFixed(1)+'" fill="#fff" class="twk" style="--d:'+(rnd(i+3)*3).toFixed(1)+'s"/>';
 s+='<g class="stars" style="opacity:'+(night?1:.0)+'">'+st+'</g>';
 s+='<g class="sunwrap"><circle cx="0" cy="0" r="30" fill="url(#gSun)"/><circle cx="0" cy="0" r="9" fill="#fff3b8"/></g>';
 s+='<g class="moonwrap"><circle cx="0" cy="0" r="9" fill="#e8ecff"/><circle cx="4" cy="-2" r="8" fill="'+P[0]+'" opacity=".55"/></g>';
 // clouds
 s+='<g class="cl c1" fill="#fff" opacity=".28"><ellipse cx="60" cy="40" rx="26" ry="7"/><ellipse cx="76" cy="35" rx="18" ry="7"/></g><g class="cl c2" fill="#fff" opacity=".2"><ellipse cx="250" cy="28" rx="30" ry="6"/><ellipse cx="270" cy="24" rx="16" ry="6"/></g>';
 // far mountains
 s+='<path d="M0 150 L40 98 L70 126 L112 80 L150 128 L200 90 L246 130 L290 84 L330 124 L360 100 L360 170 L0 170Z" fill="'+P[2]+'"/>';
 s+='<path d="M112 80 L124 96 L112 92 L102 98Z M290 84 L302 100 L290 96 L280 102Z M40 98 L50 110 L40 106 L32 112Z" fill="#fff" opacity="'+(era===0?.05:.5)+'"/>';
 s+='<path d="M0 160 Q60 126 120 152 T240 146 T360 150 L360 180 L0 180Z" fill="'+P[3]+'"/>';
 // glow behind tree
 s+='<circle cx="180" cy="100" r="'+(bare?0:70+era*4)+'" fill="url(#gGlow)" class="aura"/>';
 // ground
 s+='<path d="M0 168 Q90 160 180 166 T360 164 L360 210 L0 210Z" fill="url(#gGnd)"/>';
 s+='<path d="M0 168 Q90 160 180 166 T360 164" stroke="#ffffff22" stroke-width="1.5" fill="none"/>';
 // far village (behind tree)
 const nb=bldTier();
 const xsL=[40,78,112,22,96,60,128],xsR=[318,282,248,338,264,300,232];
 let bl='';
 for(let i=0;i<nb;i++){
  const left=i%2===0,k=Math.floor(i/2);
  const x=left?xsL[k%xsL.length]:xsR[k%xsR.length];
  const w=18+rnd(i+4)*8,h=(era<=1?16:18+era*1.6)+rnd(i+8)*8;
  const y=167+(k%3)*2.5;
  bl+=houseSVG(x,y,w,h,era,i,night);
 }
 if(era>=3){ // walls
  bl+='<path d="M4 168 L4 158 L8 158 L8 160 L12 160 L12 158 L16 158 L16 168Z M344 168 L344 158 L348 158 L348 160 L352 160 L352 158 L356 158 L356 168Z" fill="'+(['','','','#8a7a66','#9a9aaa','#b0a590','#b0a0b8','#a8a0e8'][era])+'"/>';
 }
 s+=bl;
 // trunk + tree
 s+='<g class="treeg">';
 if(bare){
  s+='<path d="M170 170 L174 140 L168 118 L176 100 L186 118 L182 140 L190 170Z" fill="url(#gTrunk)"/><path d="M176 112 L150 92 M184 118 L212 98 M178 102 L176 78" stroke="'+P[6]+'" stroke-width="4" stroke-linecap="round" fill="none"/>'
   +'<circle cx="150" cy="92" r="3" fill="#8a7a60"/><circle cx="212" cy="98" r="3" fill="#8a7a60"/>';
 }else{
  s+='<path d="M160 172 Q170 160 172 140 Q168 120 174 100 L186 100 Q192 120 188 140 Q190 160 202 172Z" fill="url(#gTrunk)"/>'
   +'<path d="M174 124 Q150 112 140 94 M186 120 Q212 108 224 92 M180 104 Q178 84 170 72" stroke="url(#gTrunk)" stroke-width="'+(5+era*.4)+'" stroke-linecap="round" fill="none"/>'
   +'<path d="M162 172 Q150 176 138 174 M200 172 Q214 177 226 174" stroke="'+P[6]+'" stroke-width="5" stroke-linecap="round" fill="none"/>'
   +treeBlobs(era,leafCols,n);
  if(era>=6)s+='<circle cx="180" cy="92" r="62" fill="none" stroke="#bfffe6" stroke-width="1.2" opacity=".5" class="ringp"/>';
  if(era>=7)s+='<circle cx="180" cy="92" r="82" fill="none" stroke="#d8c8ff" stroke-width="1" opacity=".4" class="ringp" style="--d:1.2s"/>';
 }
 s+='</g>';
 // foreground grass tufts
 let gr='';for(let i=0;i<26;i++){const x=rnd(i+70)*360,y=176+rnd(i+90)*30;gr+='<path d="M'+x.toFixed(0)+' '+y.toFixed(0)+' l-2 -6 M'+x.toFixed(0)+' '+y.toFixed(0)+' l1 -7 M'+x.toFixed(0)+' '+y.toFixed(0)+' l3 -5" stroke="'+shade(P[4],25)+'" stroke-width="1.2" opacity=".7"/>';}
 s+=gr;
 // fireflies / spirit lights
 let ff='';for(let i=0;i<(era>=7?18:10);i++)ff+='<circle class="ff" cx="'+(20+rnd(i+120)*320).toFixed(0)+'" cy="'+(110+rnd(i+140)*60).toFixed(0)+'" r="1.6" fill="'+(era>=6?'#b8ffe8':'#fff2a0')+'" style="--d:'+(rnd(i+2)*5).toFixed(1)+'s;--t:'+(4+rnd(i+6)*4).toFixed(1)+'s"/>';
 s+='<g class="ffs" style="opacity:'+(night?1:.25)+'">'+ff+'</g>';
 // night tint
 s+='<rect width="360" height="210" fill="#0a1030" class="nightov" opacity="'+(night?.45:0)+'"/>';
 return s+'</svg>';
}
function shade(hex,amt){
 const n=parseInt(hex.slice(1),16);let r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
 r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
 return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function dayPhase(){return (Date.now()%360000)/360000;} // 6 minute day
function isNight(){const p=dayPhase();return p>.58;}
function actorsHtml(){
 const s=G.s,out=[];
 out.push(['🧝',0]);
 Object.keys(s.comp).slice(0,3).forEach(id=>out.push([CMAP[id].i,1]));
 s.cr.active.slice(0,8).forEach(id=>{const c=CRMAP[id];if(c)out.push([c.i,2]);});
 return out.map((a,i)=>{
  const dur=18+rnd(i+30)*26,del=-rnd(i+5)*dur;
  return '<span class="actor" style="--dur:'+dur.toFixed(1)+'s;animation-delay:'+del.toFixed(1)+'s;bottom:'+(2+rnd(i+11)*13).toFixed(0)+'%;font-size:'+(a[1]===0?24:a[1]===1?20:18)+'px"><i style="animation-delay:'+(-rnd(i)*2).toFixed(1)+'s">'+a[0]+'</i></span>';
 }).join('');
}
function fallHtml(seas){
 const ic=['🌸','🍃','🍂','❄️'][seas],n=seas===3?16:9;let o='';
 for(let i=0;i<n;i++)o+='<span class="fall" style="left:'+(rnd(i+200)*100).toFixed(0)+'%;animation-duration:'+(6+rnd(i+210)*7).toFixed(1)+'s;animation-delay:'+(-rnd(i+220)*10).toFixed(1)+'s;font-size:'+(9+rnd(i+230)*8).toFixed(0)+'px">'+ic+'</span>';
 return o;
}
function sceneHtml(){
 const s=G.s,seas=seasonIdx(),night=isNight(),ph=dayPhase();
 const dur=360;
 return '<div id="tapBtn" class="sceneBtn" style="--ph:'+ph.toFixed(3)+';--dur:'+dur+'s">'
  +sceneSVG(s.era,seas,night)
  +'<div class="fallwrap">'+fallHtml(seas)+'</div><div class="actors">'+actorsHtml()+'</div>'
  +'<div class="eraBanner"><div class="eb1">'+ERAS[s.era].n+'</div><div class="eb2">'+ERAS[s.era].tag+'</div></div>'
  +'<div class="sceneHint">Tap the World-Tree</div>'
  +'<div class="vign"></div></div>';
}
function treeSVG(era){return sceneSVG(era,1,false);}
function realmRender(){
 const s=G.s,rs=unlockedRes();
 let h='<div id="tapwrap">'+sceneHtml();
 h+='<div class="tapinfo">'+B(()=>'Tap: <b class="gd">+'+fmt(tapValue())+'</b> '+RES[G.s.focus].i+' · crit '+Math.round(G.S.crit*100)+'%')+'</div></div>';
 h+='<div class="focus">'+rs.map(r=>'<button '+act('focus',r)+' '+BC('btn sm foc',()=>G.s.focus===r?'on':'')+'>'+RES[r].i+' '+RES[r].n+'</button>').join('')+'</div>';
 h+='<div class="card hero-card">'+eraPanel()+'</div>';
 if(s.raid.act)h+='<div class="card" style="border-color:var(--red)">'+B(()=>{const r=G.s.raid.act;if(!r)return '';const left=Math.max(0,(r.ends-Date.now())/1000);const ok=defensePower()>=r.str;return '<b class="bad">⚠️ '+r.name+'</b> arrives in '+Math.ceil(left)+'s<div class="sm">Defense '+fmt(defensePower())+' / '+fmt(r.str)+' → <b class="'+(ok?'ok':'bad')+'">'+(ok?'HOLDING':'LOSING')+'</b></div>';},'','div')+'</div>';
 const sp=SPELLS.filter(x=>x.era<=s.era);
 if(sp.length){
  h+='<h2>Spells</h2><div class="grid2">'+sp.map(x=>'<button '+act('spell',x.id)+' '+BC('btn spellb',()=>{const rd=spellReady(x);return (rd&&G.s.res.mana>=spellCost(x))?'':'dis';})+' style="text-align:left"><div>'+x.i+' <b>'+x.n+'</b></div><div class="xs mt">'+x.d+'</div><div class="xs">'+B(()=>{const t=(G.s.spells[x.id]||0)-Date.now();if(G.s.buffs[x.id]>Date.now())return '<span class="gd">ACTIVE '+Math.ceil((G.s.buffs[x.id]-Date.now())/1000)+'s</span>';return t>0?'⏳ '+fmtTime(t/1000):'✨ '+fmt(spellCost(x));})+'</div></button>').join('')+'</div>';
 }
 const cs=Object.keys(s.comp);
 if(cs.length)h+='<h2>Party</h2><div class="row" style="flex-wrap:wrap;gap:10px">'+cs.map(id=>'<div class="card sm partyc"><div class="orb r2"><span>'+CMAP[id].i+'</span></div><div class="xs">'+CMAP[id].n+'</div><div class="xs gd">Lv '+s.comp[id].lvl+'</div></div>').join('')+'</div>';
 h+='<h2>Chronicle</h2><div class="card log">'+B(()=>logHtml(14),'','div')+'</div>';
 return h;
}
TABDEFS.realm={render:realmRender,sig:()=>[G.s.era,seasonIdx(),isNight()?1:0,bldTier(),G.s.raid.act?1:0,Object.keys(G.s.comp).length,G.s.cr.active.join(),SPELLS.filter(x=>x.era<=G.s.era).length].join()};
// ---- portraits ----
function orb(c,o){
 const evo=o&&o.evo;
 return '<div class="orb r'+c.rar+'" style="--rc:'+RAR[c.rar].c+'"><span>'+c.i+'</span>'+(evo?'<b class="evs">★</b>':'')+'</div>';
}
function heroSVG(){
 const cls=G.s.hero.cls,cc={root:'#3fa860',war:'#b94a3a',arc:'#6a5ad8'}[cls]||'#4a7a5a';
 return '<div class="heroP"><svg viewBox="0 0 80 100"><defs><radialGradient id="hgl"><stop offset="0" stop-color="'+cc+'" stop-opacity=".7"/><stop offset="1" stop-color="'+cc+'" stop-opacity="0"/></radialGradient></defs>'
  +'<circle cx="40" cy="50" r="38" fill="url(#hgl)"/>'
  +'<path d="M16 96 Q18 60 40 52 Q62 60 64 96Z" fill="'+cc+'"/><path d="M40 52 Q62 60 64 96 L40 96Z" fill="#0004"/>'
  +'<circle cx="40" cy="36" r="13" fill="#e8c9a4"/><path d="M26 34 Q28 18 40 18 Q54 18 54 34 Q48 26 40 26 Q32 26 26 34Z" fill="#e8d28a"/>'
  +'<path d="M27 36 L16 30 L28 42Z M53 36 L64 30 L52 42Z" fill="#e8c9a4"/>'
  +'<circle cx="35" cy="37" r="1.7" fill="#2b3a2a"/><circle cx="45" cy="37" r="1.7" fill="#2b3a2a"/><path d="M36 43 Q40 46 44 43" stroke="#a86a4a" fill="none" stroke-width="1.2"/>'
  +'<path d="M29 22 L33 14 L37 21 L40 12 L43 21 L47 14 L51 22Z" fill="#e8bf55"/>'
  +'<path d="M68 96 L68 40" stroke="#6b4a2c" stroke-width="3"/><circle cx="68" cy="36" r="6" fill="#9affcf" class="twk"/><circle cx="68" cy="36" r="10" fill="#9affcf" opacity=".25"/></svg></div>';
}
// ---- effects ----
function tapFx(x,y,txt,crit){
 if(!G.s.set.anim)return;
 const f=document.createElement('div');f.className='fl'+(crit?' crit':'');f.textContent=txt;f.style.left=(x-20+Math.random()*30)+'px';f.style.top=(y-30)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900);
 const ic=[RES[G.s.focus].i,'✨','🍃'];
 const n=crit?10:5;
 for(let i=0;i<n;i++){
  const p=document.createElement('div');p.className='pt';p.textContent=ic[i%3];
  const a=Math.random()*6.283,d=30+Math.random()*(crit?90:55);
  p.style.cssText='left:'+x+'px;top:'+y+'px;--dx:'+(Math.cos(a)*d).toFixed(0)+'px;--dy:'+(Math.sin(a)*d-20).toFixed(0)+'px;font-size:'+(11+Math.random()*9).toFixed(0)+'px';
  document.body.appendChild(p);setTimeout(()=>p.remove(),800);
 }
 const r=document.createElement('div');r.className='rip'+(crit?' crit':'');r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),600);
}
function eraCinematic(e){
 if(!G.s.set.anim)return;
 const o=document.createElement('div');o.className='cine';
 o.innerHTML='<div class="cbox"><div class="c0">A new age dawns</div><div class="c1">'+ERAS[e].n+'</div><div class="c2">'+ERAS[e].tag+'</div></div>';
 document.body.appendChild(o);setTimeout(()=>o.classList.add('out'),2300);setTimeout(()=>o.remove(),2900);
}
function levelFx(l){
 if(!G.s.set.anim)return;
 const o=document.createElement('div');o.className='lvlfx';o.innerHTML='<div>LEVEL '+l+'</div>';
 document.body.appendChild(o);setTimeout(()=>o.remove(),1800);
}
const _advEra=advanceEra;
advanceEra=function(){const e0=G.s.era;const r=_advEra.apply(this,arguments);if(r&&G.s.era>e0){ui.need=true;eraCinematic(G.s.era);}return r;};
const _addXp=addXp;
addXp=function(x){const l0=G.s.hero.lvl;_addXp(x);if(G.s.hero.lvl>l0)levelFx(G.s.hero.lvl);};
// hex gradient defs for the map + body flags
window.addEventListener('DOMContentLoaded',()=>{
 const d=document.createElement('div');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
 d.innerHTML='<svg width="0" height="0"><defs>'
  +'<linearGradient id="hOwn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fbf7a"/><stop offset="1" stop-color="#1f5e3a"/></linearGradient>'
  +'<linearGradient id="hCan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a1a"/><stop offset="1" stop-color="#3d3010"/></linearGradient>'
  +'<linearGradient id="hAv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5a44"/><stop offset="1" stop-color="#15281f"/></linearGradient>'
  +'<linearGradient id="hLock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16231d"/><stop offset="1" stop-color="#0a110e"/></linearGradient></defs></svg>';
 document.body.appendChild(d);
 setInterval(()=>{if(G.s)document.body.classList.toggle('noanim',!G.s.set.anim);document.body.dataset.era=G.s?G.s.era:0;},1000);
});
