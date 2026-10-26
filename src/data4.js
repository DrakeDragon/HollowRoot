'use strict';
// ===== part 4: story chapters, events, achievements =====
const EVENTS=[
 {id:'merchant',t:'Wandering Merchant',tx:'A rabbitfolk merchant offers a "limited-time, non-refundable" deal.',ch:[
  {l:'Buy supplies (spend 10% gold)',f:'trade'},{l:'Haggle (free)',f:'haggle'},{l:'Send away',f:null}]},
 {id:'fey',t:'Fey Gift',tx:'A tiny fey leaves a gift on your doorstep, then a bill. Take it?',ch:[
  {l:'Accept the gift',f:'feygift'},{l:'Decline politely',f:null}]},
 {id:'rumor',t:'Rumor of Treasure',tx:'A drunk scout swears there is a chest buried "near that tree. The big one."',ch:[
  {l:'Dig for it (45s of production)',f:'dig'},{l:'Ignore the scout',f:null}]},
 {id:'festival',t:'Spontaneous Festival',tx:'Citizens have decided today is a holiday. Nobody knows which.',ch:[
  {l:'Join the festival (+XP)',f:'party'},{l:'Keep everyone working',f:'work'}]},
 {id:'storm',t:'Storm Over the Realm',tx:'Thunder rolls. Smolder hides under a cart.',ch:[
  {l:'Shelter and wait',f:'shelter'},{l:'Harvest the rain',f:'rain'}]},
 {id:'scholar',t:'Travelling Scholar',tx:'A scholar offers to teach your people a trick in exchange for lodging.',ch:[
  {l:'Offer lodging',f:'scholar'},{l:'Ask for a discount',f:'scholar2'}]},
 {id:'bandit',t:'Roadside Bandits',tx:'Bandits block the road and demand a toll. Politely. They have a pamphlet.',ch:[
  {l:'Pay the toll',f:'toll'},{l:'Fight them off',f:'fightb'}]},
 {id:'omen',t:'Omen in the Roots',tx:'The Hollowroot glows. The glow looks at you like it wants something.',ch:[
  {l:'Offer mana',f:'omen'},{l:'Back away slowly',f:null}]}
];

const ACH=[];
function _a(id,n,d,k,v,rn){ACH.push({id,n,d,k,v,rn});}
[100,1000,10000,100000,1e6].forEach((v,i)=>_a('tap'+i,['Gentle Tapper','Tap Dancer','Callus Collector','Finger of Fate','Tap Sovereign'][i],'Tap '+v.toLocaleString('en-US')+' times','tap',v));
RES_ORDER.forEach(r=>[1e3,1e6,1e9,1e12,1e15].forEach((v,i)=>_a('tot'+r+i,RES[r].n+' Hoarder '+(i+1),'Produce '+('1e'+Math.round(Math.log10(v)))+' '+RES[r].n,'tot',v,r)));
[10,50,100,250,500,1000,2500].forEach((v,i)=>_a('bld'+i,['Foundation','Neighborhood','Skyline','Metropolis','Megalopolis','Builder of Ages','Architect of Worlds'][i],'Own '+v+' buildings','bldn',v));
[5,10,25,50,100,150,200].forEach((v,i)=>_a('lvl'+i,'Hero Level '+v,'Reach hero level '+v,'lvl',v));
for(let e=1;e<=7;e++)_a('era'+e,'Era: '+ERAS[e].n,'Reach the '+ERAS[e].n,'era',e);
[1,5,10,15,20,25,30].forEach((v,i)=>_a('reg'+i,'Cartographer '+(i+1),'Conquer '+v+' regions','reg',v));
[1,10,50,100,500].forEach((v,i)=>_a('raid'+i,'Shield of the Realm '+(i+1),'Repel '+v+' raids','raid',v));
[100,1000,1e4,1e5,1e6].forEach((v,i)=>_a('army'+i,'Muster '+(i+1),'Command '+v.toLocaleString('en-US')+' units','army',v));
[5,15,30,45,TECH.length].forEach((v,i)=>_a('tech'+i,'Scholar '+(i+1),'Complete '+v+' researches','tech',v));
[1,3,10,25,50].forEach((v,i)=>_a('prest'+i,'Rebirth '+(i+1),'Rebirth '+v+' time'+(v>1?'s':''),'prest',v));
[1,3,5,7].forEach((v,i)=>_a('comp'+i,'Fellowship '+(i+1),'Recruit '+v+' companions','comp',v));
[1,3,5,7].forEach((v,i)=>_a('wond'+i,'Wonder Worker '+(i+1),'Build '+v+' wonders','wonder',v));
[1,25,100,500].forEach((v,i)=>_a('spell'+i,'Spellcaster '+(i+1),'Cast '+v+' spells','spell',v));
[1,10,50,200].forEach((v,i)=>_a('exp'+i,'Wanderer '+(i+1),'Finish '+v+' expeditions','exp',v));
[10,25,40,60,CHAPTERS.length].forEach((v,i)=>_a('chap'+i,'Storyteller '+(i+1),'Finish '+v+' chapters','chap',v));
[1,5,10].forEach((v,i)=>_a('relic'+i,'Relic Hunter '+(i+1),'Find '+v+' relics','relic',v));

[1,5,10,20,30,41].forEach((v,i)=>_a('cre'+i,'Menagerist '+(i+1),'Befriend '+v+' creatures','cre',v));
[5,10,20,30].forEach((v,i)=>_a('bond'+i,'Bonded '+(i+1),'Bond a creature to level '+v,'bond',v));
[1,5,15,30].forEach((v,i)=>_a('evo'+i,'Transformer '+(i+1),'Evolve '+v+' creatures','evo',v));
[1,8,16].forEach((v,i)=>_a('tale'+i,'Taleweaver '+(i+1),'Decide '+v+' tales','tale',v));
[1,10,50,200].forEach((v,i)=>_a('bount'+i,'Contractor '+(i+1),'Complete '+v+' bounties','bount',v));
[1,3,10].forEach((v,i)=>_a('asc'+i,'Worldseed '+(i+1),'Ascend '+v+' time'+(v>1?'s':''),'asc',v));
[1,50,500].forEach((v,i)=>_a('feed'+i,'Caretaker '+(i+1),'Raise bonds '+v+' times','feed',v));
