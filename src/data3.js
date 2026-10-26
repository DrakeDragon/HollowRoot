'use strict';
// ===== part 3: army, map, edicts, pillars, wonders, spells, expeditions, relics, prestige =====
const UNITS=[
 {id:'militia',n:'Militia',i:'🔱',era:1,p:1,cost:[['food',25],['wood',10]]},
 {id:'archer',n:'Leaf Archers',i:'🏹',era:1,p:5,cost:[['wood',100],['food',60]]},
 {id:'warden',n:'Wardens',i:'🛡️',era:2,p:25,cost:[['iron',400],['food',250]]},
 {id:'treant',n:'Treant Guard',i:'🌳',era:3,p:120,cost:[['wood',3000],['mana',400]]},
 {id:'golem',n:'Stone Golems',i:'🗿',era:4,p:650,cost:[['stone',20000],['iron',3000],['mana',1000]]},
 {id:'wyvern',n:'Wyvern Riders',i:'🦅',era:5,p:3500,cost:[['food',250000],['iron',40000],['gold',30000]]},
 {id:'blade',n:'Spellblades',i:'🗡️',era:6,p:20000,cost:[['mana',600000],['iron',300000],['gold',200000]]},
 {id:'dlord',n:'Dragonlords',i:'🐉',era:7,p:120000,cost:[['gold',4e6],['iron',3e6],['crystal',8000]]}
];
const UMAP={};UNITS.forEach(u=>UMAP[u.id]=u);
const UG=1.03;
const FOES=['Orc Scouting Party','Warg Riders','Bandit Gang','Ogre Raiders','Troll Warband','Dread Legion','Iron Horde','Void Cultists'];
const RAID_BASE=[0,150,800,4500,24000,130000,700000,4e6];

const REG=[];
function _r(n,era,i,eff,d){REG.push({id:'r'+REG.length,n,era,i,eff,d,req:Math.round(20*Math.pow(2.55,REG.length))});}
_r('Ashen Verge',1,'🔥',[{t:'mulRes',res:'wood',v:1.2}],'Burnt scrub. Good kindling.');
_r('Mossbound Ruins',1,'🏚️',[{t:'mulRes',res:'stone',v:1.2}],'Old walls, new owner.');
_r("Cressida's Orchard",1,'🍐',[{t:'mulRes',res:'food',v:1.2}],'Feral pears. Delicious.');
_r('Hollow Barrow',1,'⚰️',[{t:'click',v:1.3}],'Something in here taps back.');
_r('Bramblewood',2,'🌲',[{t:'mulRes',res:'wood',v:1.3}],'Thorny, profitable.');
_r('Greywater Crossing',2,'🌉',[{t:'mulRes',res:'gold',v:1.25}],'Tolls. Tolls everywhere.');
_r('Scorched Fields',2,'🌾',[{t:'popMul',v:1.1}],'Rebuilt farmland. Folks move in.');
_r('Ironvein Hills',3,'⛰️',[{t:'mulRes',res:'iron',v:1.4}],'Rust-colored rivers.');
_r('Whispering Fen',3,'🌫️',[{t:'mulRes',res:'mana',v:1.4}],'The mud whispers. Ignore it.');
_r('Brightwater Ford',3,'💧',[{t:'mulRes',res:'gold',v:1.3},{t:'xp',v:1.1}],'A good place for rumors.');
_r('Skyreach Crags',4,'🏔️',[{t:'mulRes',res:'stone',v:1.5}],'The rocks have views.');
_r('Dragonbone Basin',4,'🦴',[{t:'armyMul',v:1.2},{t:'click',v:1.2}],'A giant rib cage. Spooky. Useful.');
_r('Sunken Library',4,'📚',[{t:'rSpeed',v:1.3},{t:'xp',v:1.2}],'Wet books. Dry wit.');
_r('Verdant Marches',5,'🌿',[{t:'mulAll',v:1.1}],'Border country, finally yours.');
_r('Obsidian Coast',5,'🌋',[{t:'mulRes',res:['iron','gold'],v:1.5}],'Glassy shores. Sharp bargains.');
_r('The Glasswood',5,'🔷',[{t:'mulRes',res:'crystal',v:1.5},{t:'mulRes',res:'mana',v:1.2}],'Trees that ring like bells.');
_r('Stormcrown Peaks',6,'⚡',[{t:'armyMul',v:1.3},{t:'raidDef',v:1.2}],'Lightning approves of you.');
_r('The Dreaming Deep',6,'🌌',[{t:'mulAll',v:1.15}],'Do not nap here.');
_r('Starfall Plateau',7,'☄️',[{t:'mulRes',res:'crystal',v:2},{t:'mulAll',v:1.1}],'Pieces of sky, lightly used.');
_r('Ember Throne Lands',7,'👑',[{t:'mulAll',v:1.25},{t:'xp',v:1.3}],'The old king left the lights on.');
function regCost(r){return {food:r.req*4,gold:r.req*2};}

const PILLARS=[
 {id:'econ',n:'Economy',i:'🪙',c:'#e0b84a',d:'Gold x1.06 and -0.5% building cost per level'},
 {id:'ind',n:'Industry',i:'⚒️',c:'#c97b3a',d:'Wood, Stone and Iron x1.05 per level'},
 {id:'mil',n:'Military',i:'⚔️',c:'#d05a5a',d:'Army power x1.06 per level'},
 {id:'arc',n:'Arcana',i:'🔮',c:'#a07ae0',d:'Mana x1.07 and Crystal x1.05 per level'},
 {id:'cul',n:'Culture',i:'🍃',c:'#6cc788',d:'Hero XP x1.05, bond x1.04 per level'},
 {id:'stab',n:'Stability',i:'🏛️',c:'#5aa5d8',d:'Raid defense x1.06, population x1.03 per level'}
];
const PMAP={};PILLARS.forEach(p=>PMAP[p.id]=p);
const PIL_MAX=12;
const RANKS=['Stump Sitter','Hamlet Reeve','Village Head','Town Warden','City Regent','Lord Protector','King of the Glade','Emperor Elect','Evergreen Sovereign','Hollowroot Ascendant'];

const EDICTS=[
 {id:'labor',n:'Forced Labor',i:'⛓️',req:{ind:2},eff:[{t:'mulRes',res:['wood','stone','iron'],v:1.4},{t:'mulRes',res:'gold',v:.8}],d:'Raw materials boom. Gold sulks.'},
 {id:'markets',n:'Free Markets',i:'🏪',req:{econ:2},eff:[{t:'mulRes',res:'gold',v:1.5},{t:'raidDef',v:.9}],d:'More gold, fewer guards.'},
 {id:'martial',n:'Martial Law',i:'🚨',req:{mil:3},eff:[{t:'armyMul',v:1.4},{t:'mulAll',v:.9}],d:'Stronger army, grumpier realm.'},
 {id:'charter',n:"Scholar's Charter",i:'📜',req:{cul:2},eff:[{t:'rSpeed',v:1.6},{t:'mulAll',v:.95}],d:'Research flies. Output sighs.'},
 {id:'harvest',n:'Harvest Festival',i:'🎉',req:{ind:1},eff:[{t:'mulRes',res:'food',v:1.6},{t:'xp',v:1.15}],d:'Pie for everyone.'},
 {id:'mandate',n:'Arcane Mandate',i:'🔮',req:{arc:3},eff:[{t:'mulRes',res:'mana',v:1.6},{t:'costRed',v:.02}],d:'Mages get a budget.'},
 {id:'ironclad',n:'Ironclad Defense',i:'🧱',req:{stab:3},eff:[{t:'raidDef',v:1.8},{t:'mulAll',v:.92}],d:'Walls over wages.'},
 {id:'borders',n:'Open Borders',i:'🚪',req:{stab:2},eff:[{t:'popMul',v:1.3},{t:'raidDef',v:.9}],d:'All are welcome. Mostly.'},
 {id:'craft',n:"Craftsman's Pride",i:'🔨',req:{ind:3},eff:[{t:'click',v:2},{t:'mulWork',v:.85}],d:'Hands-on leadership.'},
 {id:'patron',n:'Royal Patronage',i:'🎭',req:{cul:3},eff:[{t:'xp',v:1.5},{t:'bond',v:1.2}],d:'The hero gets a statue. And lessons.'},
 {id:'ration',n:'Wartime Rationing',i:'🥣',req:{mil:2},eff:[{t:'unitCost',v:.25},{t:'mulRes',res:'food',v:.8}],d:'Soldiers cost less. Soup costs more.'},
 {id:'golden',n:'Golden Age Decree',i:'🌅',req:{cul:5,stab:5},eff:[{t:'mulAll',v:1.25}],d:'Everyone is suspiciously happy.'}
];
const EMAP={};EDICTS.forEach(e=>EMAP[e.id]=e);

const WONDERS=[
 {id:'w1',n:'The Mossbound Gate',i:'⛩️',era:1,eff:[{t:'mulAll',v:1.15}],d:'A ceremonial gate. Mostly ceremony.'},
 {id:'w2',n:'Shrine of the First Leaf',i:'🍀',era:2,eff:[{t:'xp',v:1.5},{t:'popMul',v:1.1}],d:'The first leaf of the new Hollowroot.'},
 {id:'w3',n:'The Great Waterwheel',i:'🎡',era:3,eff:[{t:'mulRes',res:['wood','stone','food'],v:1.5}],d:'Turns. Constantly. Smugly.'},
 {id:'w4',n:'Library of Sap-Script',i:'📜',era:4,eff:[{t:'rSpeed',v:2},{t:'mulRes',res:'mana',v:1.5}],d:'Books written in tree sap. Sticky.'},
 {id:'w5',n:"The Dragon's Spire",i:'🗼',era:5,eff:[{t:'armyMul',v:1.5},{t:'click',v:2}],d:'Smolder insists it has a perch.'},
 {id:'w6',n:'Aether Colossus',i:'🗽',era:6,eff:[{t:'mulAll',v:1.5}],d:'Very large. Very humming.'},
 {id:'w7',n:'The Hollowroot Reborn',i:'🌳',era:7,eff:[{t:'mulAll',v:2},{t:'gain',v:1.5}],d:'The World-Tree lives again.'}
];
const WMAP={};WONDERS.forEach(w=>WMAP[w.id]=w);
function wonderCost(w){const B=EB[w.era]*8,c={wood:B,stone:B*.8,food:B*.5,gold:B*.5};if(w.era>=3)c.mana=B*.2;if(w.era>=6)c.crystal=B*3e-6;return c;}

const SPELLS=[
 {id:'surge',n:'Verdant Surge',i:'🌱',era:2,sec:60,m0:40,cd:120,dur:30,d:'All production x3 for 30s.'},
 {id:'roar',n:'Rallying Roar',i:'📣',era:2,sec:30,m0:25,cd:90,dur:20,d:'Tap power x10 for 20s.'},
 {id:'rain',n:'Gilded Rain',i:'🌧️',era:2,sec:120,m0:80,cd:240,dur:0,d:'Instantly gain 5 min of gold.'},
 {id:'skin',n:'Stoneskin Bulwark',i:'🪨',era:2,sec:120,m0:100,cd:300,dur:120,d:'Raid defense x3 for 2 min.'},
 {id:'lapse',n:'Chrono Bloom',i:'⏳',era:3,sec:300,m0:300,cd:900,dur:0,d:'Instantly gain 10 min of all production.'},
 {id:'fall',n:'Starfall',i:'☄️',era:5,sec:300,m0:2000,cd:600,dur:60,d:'Army x4 for 60s and ends any raid in victory.'},
 {id:'song',n:'Heartsong',i:'🎶',era:6,sec:300,m0:5000,cd:600,dur:120,d:'Hero XP x5 and bond x3 for 2 min.'}
];
const SPMAP={};SPELLS.forEach(s=>SPMAP[s.id]=s);

const EXPS=[
 {id:'e1',n:'Scout the Glade Edge',era:1,dur:60,res:[['wood',60]],xp:.04,relic:.02},
 {id:'e2',n:'Forage the Old Road',era:1,dur:180,res:[['food',120],['wood',60]],xp:.06,relic:.04},
 {id:'e3',n:'Raid a Goblin Pantry',era:2,dur:600,res:[['gold',240],['food',200]],xp:.1,relic:.06},
 {id:'e4',n:'Map the Whispering Fen',era:2,dur:1500,res:[['mana',400],['stone',300]],xp:.14,relic:.08},
 {id:'e5',n:'Escort a Caravan',era:3,dur:3600,res:[['gold',900],['iron',500]],xp:.2,relic:.1},
 {id:'e6',n:'Explore the Sunken Archive',era:4,dur:7200,res:[['mana',1200],['gold',800]],xp:.28,relic:.14},
 {id:'e7',n:'Hunt the Mountain Ogre',era:4,dur:5400,res:[['iron',1500],['stone',1000]],xp:.25,relic:.12},
 {id:'e8',n:'Parley with the Sky Clans',era:5,dur:14400,res:[['gold',3000],['crystal',200]],xp:.4,relic:.18},
 {id:'e9',n:'Delve the Dreaming Deep',era:6,dur:21600,res:[['mana',6000],['crystal',600]],xp:.55,relic:.22},
 {id:'e10',n:'Chase a Falling Star',era:7,dur:28800,res:[['crystal',2500],['gold',8000]],xp:.7,relic:.28},
 {id:'e11',n:'Wander the Hollow Between',era:7,dur:43200,res:[['crystal',5000],['mana',15000]],xp:1,relic:.4}
];
const EXMAP={};EXPS.forEach(e=>EXMAP[e.id]=e);

const RELICS=[
 {id:'acorn',n:'Golden Acorn',i:'🌰',eff:[{t:'mulAll',v:1.03}]},
 {id:'compass',n:'Crooked Compass',i:'🧭',eff:[{t:'expSpeed',v:1.15}]},
 {id:'ledger',n:'Haunted Ledger',i:'📒',eff:[{t:'mulRes',res:'gold',v:1.1}]},
 {id:'whet',n:'Everwhet Stone',i:'🪨',eff:[{t:'armyMul',v:1.08}]},
 {id:'quill',n:'Quill of Echoes',i:'🪶',eff:[{t:'xp',v:1.1}]},
 {id:'seed',n:'Seed of Spring',i:'🌱',eff:[{t:'mulRes',res:['wood','food'],v:1.1}]},
 {id:'lens',n:'Moon Lens',i:'🔭',eff:[{t:'mulRes',res:'mana',v:1.1}]},
 {id:'horn',n:'Hunting Horn',i:'📯',eff:[{t:'click',v:1.15}]},
 {id:'ring',n:'Signet of Sylvan Kings',i:'💍',eff:[{t:'popMul',v:1.05}]},
 {id:'hourglass',n:'Slow Hourglass',i:'⏳',eff:[{t:'offEff',v:.05}]},
 {id:'mirror',n:'Mirror of Kin',i:'🪞',eff:[{t:'bond',v:1.15}]},
 {id:'anvil',n:'Pocket Anvil',i:'⚒️',eff:[{t:'costRed',v:.01}]},
 {id:'ember',n:'Ember Scale',i:'🔥',eff:[{t:'raidDef',v:1.1}]},
 {id:'star',n:'Fallen Star Shard',i:'⭐',eff:[{t:'mulAll',v:1.05}]},
 {id:'bell',n:'Bell of Hours',i:'🔔',eff:[{t:'rSpeed',v:1.1}]},
 {id:'crown',n:'Rusty Crown',i:'👑',eff:[{t:'gain',v:1.1}]}
];
const RLMAP={};RELICS.forEach(r=>RLMAP[r.id]=r);

// Heartwood shop: cost = base*growth^lvl
const SHOP=[
 {id:'stash',n:'Seedling Stash',i:'🌰',max:10,base:1,g:2.2,d:'Start each run with more wood, stone and food.'},
 {id:'memory',n:'Memory of Builders',i:'🏗️',max:10,base:2,g:2,d:'-2% building costs per level.',eff:[{t:'costRed',v:.02}]},
 {id:'taps',n:'Ancestral Hands',i:'👆',max:10,base:2,g:1.9,d:'x1.5 tap power per level.',eff:[{t:'click',v:1.5}]},
 {id:'insight',n:'Ancient Insight',i:'📘',max:10,base:3,g:1.9,d:'x1.25 hero XP per level.',eff:[{t:'xp',v:1.25}]},
 {id:'auto',n:'Auto-Gatherer',i:'🤖',max:10,base:4,g:2,d:'Taps by itself, 1 tap/s per level.'},
 {id:'builder',n:'Auto-Builder',i:'🧱',max:5,base:12,g:3,d:'Buys the best building automatically, faster each level.'},
 {id:'slumber',n:'Longer Slumber',i:'🛌',max:10,base:3,g:1.8,d:'+4h offline cap per level.',eff:[{t:'offCap',v:4}]},
 {id:'dream',n:'Dreamwalker',i:'💤',max:5,base:5,g:2.2,d:'+10% offline efficiency per level.',eff:[{t:'offEff',v:.1}]},
 {id:'eraskip',n:'Era Skip',i:'⏩',max:3,base:20,g:6,d:'Start each run 1 era further per level.'},
 {id:'seat',n:'Extra Edict Seat',i:'🪑',max:2,base:15,g:5,d:'+1 edict slot per level.',eff:[{t:'edictSlots',v:1}]},
 {id:'mastery',n:'Spell Mastery',i:'🎇',max:8,base:4,g:1.9,d:'x0.92 spell cooldowns per level.',eff:[{t:'spellCd',v:.92}]},
 {id:'veteran',n:'Raid Veteran',i:'🎖️',max:8,base:3,g:1.8,d:'x1.15 raid defense per level.',eff:[{t:'raidDef',v:1.15}]},
 {id:'bounty',n:'Heartwood Bounty',i:'🌳',max:10,base:6,g:2.3,d:'+10% Heartwood gained per level.',eff:[{t:'gain',v:1.1}]},
 {id:'legacy',n:'Heroic Legacy',i:'🦸',max:5,base:8,g:2.5,d:'Your wiser hero grants x1.1 all production per level.',eff:[{t:'mulAll',v:1.1}]}
];
const SHMAP={};SHOP.forEach(s=>SHMAP[s.id]=s);
