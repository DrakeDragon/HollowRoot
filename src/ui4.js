'use strict';
// ===== UI part 4: Menagerie, Board, Chronicle+Tales, Ascension =====
ui.sub.zoo='party';ui.sub.quest='now';ui.sub.reb='reb';ui.open={};
function rarTag(c){return '<span class="tag" style="color:'+RAR[c.rar].c+'">'+RAR[c.rar].n+'</span>';}
function effList(arr){return arr.map(effText).join(', ');}
function crCard(c){
 const own=()=>G.s.cr.own[c.id];
 const act_=()=>G.s.cr.active.indexOf(c.id)>=0;
 const lv=()=>own()?own().lvl:0;
 const sk=c.sk;
 return '<div class="card sm" style="border-left:3px solid '+RAR[c.rar].c+'"><div class="row">'+orb(c,G.s.cr.own[c.id])+'<div class="grow">'
  +'<div class="row sb"><b>'+B(()=>crName(c))+rarTag(c)+'</b><span class="badge">'+B(()=>'Bond '+lv()+'/30')+'</span></div>'
  +'<div class="xs mt">'+c.hab+' · Favorite: '+RES[c.fav].i+'</div>'
  +'<div class="bar" style="margin:4px 0"><i '+BW(()=>pct(lv(),30))+'></i></div>'
  +'<div class="xs gd">Per bond level: '+effList(c.pass)+'</div>'
  +'<div class="xs '+'">'+B(()=>{const l=lv();return '<span class="'+(l>=5?'ok':'mt')+'">Lv5: '+effList(c.b5)+'</span><br><span class="'+(l>=15?'ok':'mt')+'">Lv15: '+effList(c.b15)+'</span><br><span class="'+(l>=30?'ok':'mt')+'">Lv30: '+effList(c.b30)+'</span>';})+'</div>'
  +'<div class="xs" style="margin-top:3px">'+B(()=>{const l=lv();return '<span class="'+(l>=10?'ok':'mt')+'">⚡ Lv10 Skill — <b>'+sk.n+'</b>: '+sk.d+' (cd '+fmtTime(sk.cd*G.S.spellCd)+')</span>';})+'</div>'
  +'</div></div>'
  +'<div class="row" style="margin-top:6px;flex-wrap:wrap;gap:5px">'
  +'<button '+act('crbond',c.id)+' '+BC('btn pri sm',()=>lv()<30&&canPay(crBondCost(c))?'':'dis')+'>'+B(()=>lv()>=30?'Bond maxed':'Bond '+costHtml(crBondCost(c)))+'</button>'
  +B(()=>lv()>=30&&!own().evo?'<button class="btn gold sm" '+act('crevo',c.id)+'>Evolve '+costHtml(crEvoCost(c))+'</button>':'')
  +B(()=>{const l=lv(),on=crSkillOn(c.id),rd=crSkillReady(c.id),ac=act_();if(l<10||!ac)return '';if(on)return '<span class="gd xs">ACTIVE '+Math.ceil((G.s.buffs["cs_"+c.id]-Date.now())/1000)+'s</span>';if(!rd)return '<span class="mt xs">⏳ '+fmtTime((G.s.cr.cd[c.id]-Date.now())/1000)+'</span>';return '<button class="btn gold sm" '+act('crskill',c.id)+'>Use '+sk.n+'</button>';})
  +'<button '+act('crtoggle',c.id)+' '+BC('btn sm',()=>act_()?'on':'')+'>'+B(()=>act_()?'Active ✔':'Set active')+'</button></div></div>';
}
function zooHead(){
 return '<div class="card"><div class="row sb"><div><b>Active companions</b><div class="xs mt">Only active creatures lend their boons.</div></div><b class="gd" style="font-size:20px">'+B(()=>G.s.cr.active.length+'/'+G.S.crSlots)+'</b></div>'
  +'<div class="xs mt" style="margin-top:4px">Boon power x'+B(()=>fmt(G.S.crMul))+' · Bonding speed x'+B(()=>fmt(G.S.bond))+' · Luck +'+B(()=>Math.round(G.S.crLuck*100))+'% · Befriended '+B(()=>crCount()+'/'+CRS.length)+'</div></div>';
}
function zooParty(){
 const own=CRS.filter(c=>G.s.cr.own[c.id]);
 if(!own.length)return '<div class="card sm">No creatures yet. Visit the <b>Wild</b> tab. A friend may already be waiting.</div>';
 own.sort((a,b)=>(G.s.cr.active.indexOf(b.id)>=0)-(G.s.cr.active.indexOf(a.id)>=0)||b.rar-a.rar);
 return own.map(crCard).join('');
}
function zooWild(){
 const s=G.s;
 let h='<div class="card"><div class="row sb"><div><b>📯 Call of the Wild</b><div class="xs mt">Spend food to lure a stranger. Also: wanderers arrive on their own.</div></div></div>'
  +'<div class="row sb" style="margin-top:6px"><div class="sm">'+B(()=>costHtml(wildCallCost()))+'</div><button '+act('wildcall')+' '+BC('btn pri sm',()=>(s.era>=1&&G.s.cr.call<=Date.now()&&G.s.cr.enc.length<4&&canPay(wildCallCost()))?'':'dis')+'>'+B(()=>G.s.era<1?'Hamlet era':G.s.cr.call>Date.now()?'⏳ '+fmtTime((G.s.cr.call-Date.now())/1000):'Call')+'</button></div></div>';
 h+='<h2>Encounters</h2>'+B(()=>{
  const e=G.s.cr.enc;if(!e.length)return '<div class="card sm mt">Nobody is waiting. Check back soon, or call.</div>';
  return e.map(x=>{const c=CRMAP[x.id];return '<div class="card sm" style="border-left:3px solid '+RAR[c.rar].c+'"><div class="row">'+orb(c,G.s.cr.own[c.id])+'<div class="grow"><b>'+c.n+'</b>'+rarTag(c)+'<div class="xs mt">'+c.hab+'</div><div class="xs">'+c.lore[0].slice(0,140)+'…</div></div></div><div class="row sb" style="margin-top:6px"><div class="sm">'+costHtml(crBefriendCost(c))+'</div><div class="row" style="gap:5px"><button class="btn sm" data-a="crrelease" data-p="'+c.id+'">Release</button><button class="btn pri sm" data-a="crbefriend" data-p="'+c.id+'">Befriend</button></div></div></div>';}).join('');
 },'','div');
 return h;
}
function codexHow(c){
 const g=c.g;
 if(g.k==='wild')return 'Wild · '+ERAS[c.era].n+' era';
 if(g.k==='reg')return 'Conquer '+REG[g.i].n;
 if(g.k==='chap')return 'Story chapter '+g.n;
 if(g.k==='wonder')return 'Build '+WMAP[g.id].n;
 return '';
}
function zooCodex(){
 let h='<div class="card sm">Discovered '+B(()=>crCount()+'/'+CRS.length)+'. Some species only come through conquest or story.</div>';
 for(let e=1;e<=7;e++){
  const l=CRS.filter(c=>c.era===e);if(!l.length)continue;
  h+='<h3>'+ERAS[e].n+'</h3>';
  h+=l.map(c=>{const o=G.s.cr.own[c.id];return '<div class="card sm" style="opacity:'+(o?1:.6)+';border-left:3px solid '+RAR[c.rar].c+'"><div class="row">'+(o?orb(c,o):'<div class="ico">❔</div>')+'<div class="grow"><b>'+(o?crName(c):'???')+'</b>'+rarTag(c)+'<div class="xs mt">'+(o?c.hab:'Undiscovered')+' · '+codexHow(c)+'</div>'+(o?'<div class="xs">'+c.lore[Math.min(3,o.lvl>=30?3:o.lvl>=15?2:o.lvl>=5?1:0)]+'</div>':'')+'</div></div></div>';}).join('');
 }
 return h;
}
function zooRender(){
 const sub=ui.sub.zoo;
 return zooHead()+subTabs('zoo',[['party','Companions'],['wild','Wild'],['codex','Codex']])+(sub==='party'?zooParty():sub==='wild'?zooWild():zooCodex());
}
// ---------- board ----------
function boardRender(){
 const s=G.s;
 let h='<div class="card"><div class="row sb"><div><b>'+B(()=>SEASONS[seasonIdx()].i+' '+SEASONS[seasonIdx()].n)+'</b><div class="xs mt">'+B(()=>SEASONS[seasonIdx()].d)+'</div></div><div class="xs mt">Changes in '+B(()=>fmtTime(seasonLeft()))+'</div></div></div>';
 h+='<h2>Bounty Board</h2><div class="xs mt">Bounties done: '+B(()=>G.s.bounty.done)+' · New ones appear shortly after you claim.</div><div style="height:6px"></div>';
 h+=B(()=>{
  const l=G.s.bounty.list;if(!l.length)return '<div class="card sm mt">New contracts are being posted…</div>';
  return l.map((b,i)=>{const p=bProg(b),done=p>=b.goal;
   return '<div class="card sm"><div class="row sb"><b>'+bDesc(b)+'</b></div><div class="bar'+(done?' g':'')+'" style="margin:5px 0"><i style="width:'+pct(p,b.goal)+'%"></i></div><div class="row sb"><div class="xs mt">'+fmt(p)+' / '+fmt(b.goal)+' · Reward: '+fmtTime(b.rew.secs)+' of output + XP'+(b.rew.enc?' · '+Math.round(b.rew.enc*100)+'% chance of a visitor':'')+'</div><button class="btn pri sm'+(done?'':' dis')+'" data-a="claim" data-p="'+i+'">Claim</button></div></div>';}).join('');
 },'','div');
 return h;
}
// ---------- chronicle ----------
function chapCard(i){const c=CHAPTERS[i];return '<div class="card sm"><b class="gd">'+(i+1)+'. '+c.n+'</b><div class="sm" style="margin-top:3px">'+c.txt+'</div></div>';}
function questRender2(){
 const s=G.s,sub=ui.sub.quest;
 let h=subTabs('quest',[['now','Chapter'],['all','All Chapters'],['tales','Tales']]);
 if(sub==='tales'){
  h+='<div class="card sm">Tales are choices that echo forever. Your answers persist through Rebirth and Ascension. Decided: '+B(()=>talesDone()+'/'+TALES.length)+'</div>';
  TALES.forEach(t=>{
   const d=s.tales[t.id];
   if(d!==undefined){const ch=t.ch[d];h+='<div class="card sm"><b class="gd">'+t.t+'</b><div class="xs mt">You chose: <b>'+ch.l+'</b></div><div class="sm" style="margin:3px 0">'+ch.r+'</div><div class="xs gd">'+effList(ch.eff)+'</div></div>';}
   else h+='<div class="card sm" style="opacity:.55"><b>🔒 '+(s.chap>=t.at?'Awaiting your decision…':'An unwritten tale')+'</b><div class="xs mt">Appears at chapter '+(t.at+1)+'</div></div>';
  });
  return h;
 }
 if(sub==='all'){
  ACTS.forEach((a,k)=>{
   const end=k+1<ACTS.length?ACTS[k+1].from:CHAPTERS.length;
   h+='<h2>'+a.n+'</h2>';
   for(let i=Math.min(end,s.chap)-1;i>=a.from;i--)h+=chapCard(i);
   if(s.chap<=a.from)h+='<div class="card sm mt" style="opacity:.5">🔒 Not yet written</div>';
  });
  return h;
 }
 const ai=actOf(Math.min(s.chap,CHAPTERS.length-1)),act_=ACTS[ai];
 const actEnd=ai+1<ACTS.length?ACTS[ai+1].from:CHAPTERS.length;
 h+='<div class="card sm"><b class="gd">'+act_.n+'</b><div class="bar g" style="margin:4px 0"><i '+BW(()=>pct(Math.min(G.s.chap,actEnd)-act_.from,actEnd-act_.from))+'></i></div><div class="xs mt">Chapter '+B(()=>Math.min(G.s.chap+1,CHAPTERS.length))+' of '+CHAPTERS.length+'</div></div>';
 if(s.chap<CHAPTERS.length){
  const ch=CHAPTERS[s.chap];
  h+='<div class="card" style="border-color:var(--gold)"><div class="xs mt">Next chapter</div><b class="gd" style="font-size:17px">'+ch.n+'</b><div style="margin:6px 0">'+condText(ch.c)+'</div>'
   +'<div class="bar g"><i '+BW(()=>pct(condVal(ch.c),chapterGoal(ch.c)))+'></i></div><div class="xs mt">'+B(()=>fmt(Math.min(condVal(ch.c),chapterGoal(ch.c)))+' / '+fmt(chapterGoal(ch.c)))+'</div></div>';
 }else h+='<div class="card gd">All chapters complete. The saga continues in your rebirths and your Wild Court.</div>';
 h+='<h2>Recent</h2>';
 for(let i=s.chap-1;i>=Math.max(0,s.chap-6);i--)h+=chapCard(i);
 if(!s.chap)h+='<div class="card sm mt">Your story begins with a tap.</div>';
 return h;
}
// ---------- ascension ----------
function ascRender(){
 const s=G.s;
 let h='<div class="card"><b class="gd" style="font-size:17px">🌠 Ascension: Worldseed</b><div class="sm mt" style="margin:4px 0">When Rebirth is not enough. Ascend to convert your lifetime Heartwood into Worldseeds. This <b>consumes</b> Heartwood and its shop. You keep your hero, creatures, tales, relics, trophies and the Worldseed shop. Worldseeds boost all production (with diminishing returns) and unlock the Worldseed shop. Raids grow 30% stronger per Ascension.</div>'
  +'<div class="row sb"><div>Worldseeds: <b class="gd">'+B(()=>fmt(G.s.asc.seeds))+'</b></div><div>Ascensions: <b>'+B(()=>G.s.asc.count)+'</b></div></div>'
  +'<div style="margin-top:6px">Gain now: <b class="ok">'+B(()=>'+'+fmt(ascGain())+' 🌠')+'</b></div><div class="xs mt">'+B(()=>G.s.pres.total<2e4?'Needs 20,000 lifetime Heartwood this cycle ('+fmt(G.s.pres.total)+').':'Ready.')+'</div>'
  +'<button '+act('ascend')+' '+BC('btn gold',()=>canAscend()?'':'dis')+' style="width:100%;margin-top:8px">Ascend</button></div>';
 h+='<h2>Worldseed Shop</h2>'+ASHOP.map(a=>'<div class="card sm"><div class="row"><div class="ico">'+a.i+'</div><div class="grow"><div class="row sb"><b>'+a.n+'</b><span class="badge">'+B(()=>ascLvl(a.id)+'/'+a.max)+'</span></div><div class="xs mt">'+a.d+'</div></div>'
  +'<button '+act('buyasc',a.id)+' '+BC('btn gold sm',()=>ascLvl(a.id)<a.max&&G.s.asc.seeds>=ascCost(a)?'':'dis')+'>'+B(()=>ascLvl(a.id)>=a.max?'MAX':'🌠 '+ascCost(a))+'</button></div></div>').join('');
 return h;
}
function rebirthRender2(){
 return subTabs('reb',[['reb','Rebirth'],['asc','Ascension']])+(ui.sub.reb==='asc'?ascRender():rebirthRender());
}
// ---------- tale modal ----------
function showTale(t){
 showModal('<div class="xs mt">'+ACTS[actOf(Math.min(t.at,CHAPTERS.length-1))].n+'</div><h3 style="color:var(--gold);margin:2px 0 6px">'+t.t+'</h3><div class="sm">'+t.tx+'</div>'
  +t.ch.map((c,i)=>'<button class="btn" data-tale="'+t.id+'|'+i+'" style="text-align:left">'+c.l+'<div class="xs gd" style="font-weight:400">'+effList(c.eff)+'</div></button>').join('')
  +'<div class="xs mt" style="margin-top:8px">This choice is permanent.</div>');
}
// ---------- extra action handler ----------
function handleExtra(a,p,n){
 switch(a){
  case 'crbond':crBond(p);break;
  case 'crevo':crEvolve(p);break;
  case 'crtoggle':toggleActive(p);break;
  case 'crskill':castCrSkill(p);break;
  case 'crbefriend':befriend(p);break;
  case 'crrelease':dismissEnc(p);break;
  case 'wildcall':wildCall();break;
  case 'claim':claimBounty(+p);break;
  case 'buyasc':buyAsc(p);break;
  case 'ascend':
   if(!canAscend())break;
   showModal('<h3 style="color:var(--gold);margin-top:0">Ascend?</h3><div class="sm">Gain <b class="gd">'+fmt(ascGain())+' Worldseeds</b>. Heartwood and its shop are consumed. Realm, research, army and map reset. Hero, creatures, tales, relics, trophies and the Worldseed shop stay.</div><button class="btn gold" data-asc="1">Ascend now</button><button class="btn" data-close="1">Cancel</button>');
   break;
 }
}
TABDEFS.zoo={render:zooRender,sig:()=>[ui.sub.zoo,crCount(),G.s.cr.enc.length,G.s.cr.active.join(),Object.values(G.s.cr.own).map(o=>o.evo?1:0).join('')].join()};
TABDEFS.board={render:boardRender,sig:()=>G.s.bounty.list.length+'|'+G.s.bounty.done};
TABDEFS.quest={render:questRender2,sig:()=>[ui.sub.quest,G.s.chap,talesDone()].join()};
TABDEFS.rebirth={render:rebirthRender2,sig:()=>[ui.sub.reb,G.s.era,Object.keys(G.s.asc.shop).length].join()};
