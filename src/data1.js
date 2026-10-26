'use strict';
// ===== Hollowroot data part 1: resources, eras, buildings =====
const RES_ORDER=['wood','stone','food','iron','gold','mana','crystal'];
const RES={
 wood:{n:'Wood',i:'🪵',v:1,era:0},
 stone:{n:'Stone',i:'🪨',v:1.3,era:0},
 food:{n:'Food',i:'🌾',v:1,era:0},
 iron:{n:'Iron',i:'⛓️',v:2.5,era:1},
 gold:{n:'Gold',i:'🪙',v:4,era:1},
 mana:{n:'Mana',i:'✨',v:6,era:2},
 crystal:{n:'Crystal',i:'💎',v:40,era:5}
};
const EB=[0,500,6e4,5e7,2e11,4e14,5e17,3e21];
const ERAS=[
 {n:'Ruined Glade',tag:'Ash, stumps and one very confused hero.',lvl:0},
 {n:'Hamlet',tag:'Smoke from actual chimneys. Progress!',lvl:3},
 {n:'Village',tag:'Roads. Rumors. Rent disputes.',lvl:8},
 {n:'Town',tag:'Walls, taxes and a suspiciously large guildhall.',lvl:14},
 {n:'City',tag:'Spires, sewers and sophisticated gossip.',lvl:22},
 {n:'Kingdom',tag:'Banners. Borders. Bureaucracy.',lvl:32},
 {n:'Empire',tag:'The map is now mostly your color.',lvl:44},
 {n:'Ascendant Realm',tag:'The World-Tree remembers its name.',lvl:58}
];
function eraCost(e){
 const B=EB[e],c={wood:B,stone:B*.6,food:B*.5};
 if(e>=2){c.iron=B*.3;c.gold=B*.4;}
 if(e>=3)c.mana=B*.15;
 if(e>=6)c.crystal=B*2e-6;
 return c;
}
const MIL=[10,25,50,100,150,200,250,300,400,500,650,800,1000];
const BLD=[],BMAP={};
function _b(o){o.g=o.g||1.15;BLD.push(o);BMAP[o.id]=o;}
function _cost(cL,cw){const base=14*Math.pow(8,cL);return cw.map(([r,w])=>[r,Math.max(1,Math.round(base*w))]);}
function prod(id,n,i,era,res,L,cw,pil,cL){
 _b({id,n,i,era,type:'prod',res,rate:0.1*Math.pow(5,L),cost:_cost(cL===undefined?L:cL,cw),pil,desc:'Produces '+RES[res].n+'.'});
}
function house(id,n,i,era,pop,cL,cw){
 _b({id,n,i,era,type:'house',pop,g:1.2,cost:_cost(cL,cw),pil:'stab',desc:'Houses '+pop+' citizens.'});
}
function civic(id,n,i,era,cL,cw,pil,desc,eff,g){
 _b({id,n,i,era,type:'civic',g:g||1.18,cost:_cost(cL,cw),pil,desc,eff});
}
// Era 0
prod('woodcamp','Woodcutter Camp','🪓',0,'wood',0,[['wood',1]],'ind');
prod('forager','Forager Lean-to','🍄',0,'food',0.2,[['wood',1.3]],'ind');
prod('quarry','Quarry Pit','⛏️',0,'stone',0.5,[['wood',1],['food',.5]],'ind');
// Era 1
house('cottage','Tree Cottage','🏡',1,4,0.55,[['wood',1],['stone',.5]]);
prod('farmstead','Farmstead','🌽',1,'food',1.2,[['food',1],['wood',.4]],'ind');
prod('digsite',"Prospector's Dig",'🔦',1,'iron',1,[['wood',1],['stone',.8]],'ind');
prod('market','Market Stall','🏪',1,'gold',1.1,[['food',1],['wood',.6]],'econ');
civic('barracks','Barracks','🛡️',1,1.4,[['wood',1],['iron',.5]],'mil','Army power +2% each.',{t:'armyMul',v:1.02});
// Era 2
house('longhouse','Longhouse','🏠',2,10,2,[['wood',1],['stone',.7]]);
prod('sawmill','Sawmill','🪚',2,'wood',2,[['wood',1],['stone',.5],['iron',.2]],'ind');
prod('stoneyard',"Stonecutter's Yard",'🧱',2,'stone',2.2,[['stone',1],['iron',.4]],'ind');
prod('moonwell','Moonwell','🌙',2,'mana',2.3,[['gold',1],['stone',.5]],'arc');
civic('shrine','Shrine of Leaves','🍃',2,2.2,[['wood',1],['gold',.4]],'cul','Hero XP +2% each.',{t:'xp',v:1.02});
civic('watchtower','Watchtower','🗼',2,2.4,[['stone',1],['iron',.5]],'mil','Raid defense +3% each.',{t:'raidDef',v:1.03});
// Era 3
house('manor','Elven Manor','🏛️',3,22,3.3,[['stone',1],['gold',.6]]);
prod('orchard','Orchard Terraces','🍎',3,'food',3,[['food',1],['stone',.5]],'ind');
prod('smelter','Smelter','🔥',3,'iron',3.1,[['iron',1],['wood',.5]],'ind');
prod('guildhall','Merchant Guildhall','💰',3,'gold',3.2,[['gold',1],['wood',.5]],'econ');
civic('academy','Academy of Leaves','📚',3,3.5,[['gold',1],['mana',.3]],'arc','Research speed +3% each.',{t:'rSpeed',v:1.03});
civic('grove','Healing Grove','🌿',3,3.3,[['wood',1],['mana',.3]],'stab','Citizens +1% and growth +5% each.',{t:'popMul',v:1.01});
// Era 4
house('district','Guild District','🏘️',4,45,4.5,[['stone',1],['gold',.6],['iron',.3]]);
prod('lumberguild','Lumber Guild','🌲',4,'wood',4,[['wood',1],['iron',.4],['gold',.2]],'ind');
prod('deepmine','Deep Mine','🕳️',4,'stone',4.1,[['stone',1],['iron',.6]],'ind');
prod('runecircle','Rune Circle','🔮',4,'mana',4.2,[['mana',1],['gold',.4]],'arc');
civic('roost','Dragon Roost','🐉',4,4.6,[['stone',1],['food',1],['gold',.3]],'mil','Tap power +3% each.',{t:'click',v:1.03});
// Era 5
house('citadelq','Citadel Quarter','🏰',5,90,5.6,[['stone',1],['gold',.7],['iron',.4]]);
prod('granary','Sun-Granary','🌾',5,'food',5,[['food',1],['stone',.5],['gold',.2]],'ind');
prod('foundry','Great Foundry','⚙️',5,'iron',5.1,[['iron',1],['stone',.5]],'ind');
prod('mint','Royal Mint','🪙',5,'gold',5.2,[['gold',1],['iron',.4]],'econ');
prod('grotto','Crystal Grotto','💎',5,'crystal',2.4,[['mana',1],['iron',.4]],'arc',5);
civic('embassy','Grand Embassy','🏳️',5,5.5,[['gold',1],['food',.6]],'econ','Gold +4% each.',{t:'mulRes',res:'gold',v:1.04});
// Era 6
house('palace','Palace Gardens','👑',6,180,6.5,[['gold',1],['stone',.6],['mana',.3]]);
prod('worldroot','Worldroot Tap','🌳',6,'wood',6,[['wood',1],['mana',.3],['iron',.3]],'ind');
prod('skyquarry','Sky Quarry','☁️',6,'stone',6.1,[['stone',1],['mana',.3],['iron',.3]],'ind');
prod('spire','Arcane Spire','🧿',6,'mana',6.2,[['mana',1],['gold',.4]],'arc');
prod('refinery','Aether Refinery','⚗️',6,'crystal',3.7,[['mana',1],['iron',.5],['crystal',.0005]],'arc',6);
// Era 7
house('spires','Ascended Spires','🌌',7,360,7.5,[['gold',1],['stone',.5],['crystal',.002]]);
prod('starforge','Starmetal Forge','☄️',7,'iron',7,[['iron',1],['mana',.3],['crystal',.002]],'ind');
prod('exchange','Imperial Exchange','🏦',7,'gold',7.1,[['gold',1],['iron',.4],['crystal',.002]],'econ');
prod('nexus','Heartwood Nexus','🌠',7,'mana',7.2,[['mana',1],['gold',.4],['crystal',.002]],'arc');
prod('skyshard','Skyshard Forge','✴️',7,'crystal',5,[['mana',1],['iron',.5],['crystal',.002]],'arc',7.3);
