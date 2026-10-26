'use strict';
// ===== part 2: techs, hero skills, gear, companions =====
const TB=[160,1800,28e3,600e3,16e6,4.4e8,16e9,6e11];
const TTIME=[30,90,360,1440,5400,21600,43200];
const TECH=[],TMAP={};
function _t(o){TECH.push(o);TMAP[o.id]=o;}
function techCost(e,res){
 const B=TB[e],c={};c[res]=B;
 if(res!=='gold'&&e>=1)c.gold=B*.5;else if(e===0)c.wood=B*.5;
 if(res==='gold')c.food=B*.5;
 return c;
}
const RBR=[
 {id:'for',n:'Forestry',i:'🌲',res:'wood',names:['Sharper Axes','Rope & Pulley','Managed Groves','Treewalker Lumberers','Living Timber','Worldwood Harvest'],pil:'ind'},
 {id:'mas',n:'Masonry',i:'🧱',res:'stone',names:['Iron Chisels','Cut-Stone Standards','Quarry Engineering','Rune-Split Rock','Gravity Lifts','Mountain Singing'],pil:'ind'},
 {id:'agr',n:'Agrarian Arts',i:'🌾',res:'food',names:['Crop Rotation','Irrigation Ditches','Orchard Grafting','Sun-Blessed Seed','Greenhouse Terraces','Endless Harvest'],pil:'ind'},
 {id:'met',n:'Metallurgy',i:'⛓️',res:'iron',names:['Bellows & Charcoal','Blast Furnaces','Alloy Recipes','Starsteel Folding','Deep Veins Map','Living Metal'],pil:'ind'},
 {id:'com',n:'Commerce',i:'🪙',res:'gold',names:['Honest Scales','Trade Caravans','Letters of Credit','Guild Charters','Banking Houses','Global Exchange'],pil:'econ'},
 {id:'arc',n:'Arcana',i:'✨',res:'mana',names:['Leyline Dowsing','Rune Inscription','Moonlit Rituals','Aether Weaving','Spellforged Towers','Heartwood Resonance'],pil:'arc'}
];
const RMULS=[1.25,1.3,1.4,1.5,1.6,1.8];
RBR.forEach(br=>{
 for(let k=1;k<=6;k++){
  const era=RES[br.res].era+(k-1);if(era>7)continue;
  const eff=[{t:'mulRes',res:br.res,v:RMULS[k-1]}];
  if(k===2)eff.push({t:'mulWork',v:1.15});
  if(k===4)eff.push({t:'costRed',v:.01});
  if(k===6)eff.push({t:'mulAll',v:1.05});
  _t({id:br.id+k,br:br.id,tier:k,n:br.names[k-1],i:br.i,era,cost:techCost(era,br.res),time:TTIME[k-1],eff,pil:br.pil,
   req:k>1?[br.id+(k-1)]:[],d:eff.map(effText).join(', ')});
 }
});
const SPEC=[
 {id:'sta',n:'Statecraft',i:'📜',pil:'stab',names:['Census Scrolls','Standing Councils','Civil Registry','Royal Bureaucracy','Imperial Charter','Mandate of Evergreen'],res:'gold',
  effs:[[{t:'popMul',v:1.2}],[{t:'costRed',v:.03},{t:'mulAll',v:1.1}],[{t:'edictSlots',v:1},{t:'popGrow',v:1.5}],[{t:'popMul',v:1.5},{t:'mulAll',v:1.15}],[{t:'costRed',v:.05},{t:'offCap',v:4}],[{t:'mulAll',v:1.4},{t:'edictSlots',v:1}]]},
 {id:'war',n:'Warcraft',i:'⚔️',pil:'mil',names:['Drilled Ranks','Forged Armor','Watch Rotations','Siege Doctrine','Spoils Law','Legendary Tactics'],res:'iron',
  effs:[[{t:'armyMul',v:1.3}],[{t:'unitCost',v:.05}],[{t:'raidDef',v:1.3}],[{t:'armyMul',v:1.6}],[{t:'raidLoot',v:1.5}],[{t:'armyMul',v:2},{t:'unitCost',v:.1}]]},
 {id:'lor',n:'Lorecraft',i:'📖',pil:'cul',names:['Oral Histories','Scribe Colleges','Archive Network','The Great Library','Dream Study','Mind of the Forest'],res:'mana',
  effs:[[{t:'xp',v:1.3}],[{t:'rSpeed',v:1.25}],[{t:'resSlots',v:1}],[{t:'xp',v:1.6},{t:'spellCd',v:.9},{t:'expSlots',v:1}],[{t:'offEff',v:.1},{t:'expSpeed',v:1.3}],[{t:'xp',v:2},{t:'rSpeed',v:1.5}]]}
];
SPEC.forEach(br=>{
 for(let k=1;k<=6;k++){
  const era=k;
  let res=br.res;if(br.id==='lor'&&era<2)res='gold';
  _t({id:br.id+k,br:br.id,tier:k,n:br.names[k-1],i:br.i,era,cost:techCost(era,res),time:TTIME[k-1],eff:br.effs[k-1],pil:br.pil,
   req:k>1?[br.id+(k-1)]:[],d:br.effs[k-1].map(effText).join(', ')});
 }
});
const BRANCHES=RBR.map(b=>({id:b.id,n:b.n,i:b.i})).concat(SPEC.map(b=>({id:b.id,n:b.n,i:b.i})));

function effText(e){
 const pc=v=>'+'+Math.round((v-1)*100)+'%';
 const nm=e.res?(Array.isArray(e.res)?e.res:[e.res]).map(r=>RES[r]?RES[r].n:r).join('/'):'';
 switch(e.t){
  case 'mulAll':return pc(e.v)+' all production';
  case 'mulRes':return 'x'+(Math.round(e.v*100)/100)+' '+nm;
  case 'mulWork':return pc(e.v)+' worker output';
  case 'click':return 'x'+(Math.round(e.v*100)/100)+' tap power';
  case 'clickPct':return '+'+Math.round(e.v*100)+'% tap scaling';
  case 'popMul':return pc(e.v)+' population';
  case 'popGrow':return 'x'+e.v+' pop growth';
  case 'costRed':return '-'+Math.round(e.v*1000)/10+'% building costs';
  case 'unitCost':return '-'+Math.round(e.v*100)+'% unit costs';
  case 'armyMul':return pc(e.v)+' army power';
  case 'xp':return pc(e.v)+' hero XP';
  case 'rSpeed':return pc(e.v)+' research speed';
  case 'spellCd':return pc(e.v).replace('+','')+' spell cooldowns';
  case 'spellCost':return pc(e.v).replace('+','')+' spell cost';
  case 'spellDur':return pc(e.v)+' spell duration';
  case 'raidDef':return pc(e.v)+' raid defense';
  case 'raidLoot':return pc(e.v)+' raid loot';
  case 'bond':return pc(e.v)+' bond gain';
  case 'crit':return '+'+Math.round(e.v*100)+'% crit chance';
  case 'critMul':return 'x'+e.v+' crit damage';
  case 'offCap':return '+'+e.v+'h offline cap';
  case 'offEff':return '+'+Math.round(e.v*100)+'% offline efficiency';
  case 'edictSlots':return '+'+e.v+' edict slot';
  case 'expSlots':return '+'+e.v+' expedition slot';
  case 'resSlots':return '+'+e.v+' research slot';
  case 'expSpeed':return pc(e.v)+' expedition speed';
  case 'gain':return pc(e.v)+' Heartwood gain';
  case 'crMul':return pc(e.v)+' creature boons';
  case 'crSlots':return '+'+e.v+' creature slot';
  case 'crLuck':return '+'+Math.round(e.v*100)+'% creature encounter luck';
  case 'crBond':return pc(e.v)+' creature bonding speed';
  case 'seed':return pc(e.v)+' Worldseed power';
 }
 return e.t;
}

// ---- attributes ----
const ATTR=[
 {id:'str',n:'Might',i:'💪',d:'+1.5% tap power, +0.8% army power per point'},
 {id:'dex',n:'Agility',i:'🏹',d:'+0.4% crit chance, +0.5% expedition speed per point'},
 {id:'int',n:'Intellect',i:'🧠',d:'+0.6% research speed, -0.3% spell cost per point'},
 {id:'wis',n:'Wisdom',i:'🦉',d:'+1% hero XP, +0.2% offline efficiency per point'},
 {id:'cha',n:'Charisma',i:'🎭',d:'+0.6% gold, +0.3% population, +1% bond per point'},
 {id:'vit',n:'Vitality',i:'🛡️',d:'+0.8% raid defense, +0.2% all production per point'}
];
const CLASSES=[
 {id:'root',n:'Rootwarden',i:'🌳',d:'Master of growth and harvest.'},
 {id:'war',n:'Warlord',i:'⚔️',d:'Armies, raids and glory.'},
 {id:'arc',n:'Archmage',i:'🔮',d:'Mana, spells and secrets.'},
 {id:'stew',n:'Steward',i:'📜',d:'Gold, order and paperwork.'}
];
const SKILLS=[
 {id:'gather',n:'Keen Gatherer',i:'🖐️',lvl:2,max:5,eff:[{t:'click',v:1.15}]},
 {id:'hands',n:'Efficient Hands',i:'🛠️',lvl:5,max:5,eff:[{t:'mulWork',v:1.1}]},
 {id:'study',n:'Quick Study',i:'📘',lvl:8,max:5,eff:[{t:'xp',v:1.1}]},
 {id:'haggle',n:'Haggler',i:'🤝',lvl:10,max:5,eff:[{t:'mulRes',res:'gold',v:1.12}]},
 {id:'attune',n:'Mana Attunement',i:'🌀',lvl:12,max:5,eff:[{t:'spellCost',v:.94}]},
 {id:'taskm',n:'Taskmaster',i:'📋',lvl:15,max:5,eff:[{t:'rSpeed',v:1.12}]},
 {id:'frugal',n:'Frugal Builder',i:'🪙',lvl:18,max:5,eff:[{t:'costRed',v:.01}]},
 {id:'tongue',n:'Silver Tongue',i:'🗣️',lvl:20,max:5,eff:[{t:'bond',v:1.15}]},
 {id:'scouts',n:'Thrifty Scouts',i:'🧭',lvl:25,max:2,eff:[{t:'expSlots',v:1}]},
 {id:'eye',n:"Veteran's Eye",i:'👁️',lvl:30,max:5,eff:[{t:'crit',v:.02},{t:'critMul',v:1.1}]},
 {id:'lord',n:'Open-Handed Lord',i:'🎁',lvl:40,max:5,eff:[{t:'mulAll',v:1.05}]},
 {id:'dilate',n:'Time Dilation',i:'⌛',lvl:60,max:5,eff:[{t:'offEff',v:.05}]},
 {id:'photo',n:'Photosynthesis',i:'☀️',lvl:10,cls:'root',max:5,eff:[{t:'mulRes',res:['wood','food'],v:1.25}]},
 {id:'roots',n:'Deep Roots',i:'🪱',lvl:20,cls:'root',max:5,eff:[{t:'mulRes',res:['stone','iron'],v:1.25}]},
 {id:'bless',n:'Verdant Blessing',i:'🌿',lvl:35,cls:'root',max:5,eff:[{t:'mulAll',v:1.08}]},
 {id:'heart',n:"World-Tree's Heart",i:'💚',lvl:50,cls:'root',max:5,eff:[{t:'popMul',v:1.1}]},
 {id:'cry',n:'Battle Cry',i:'📣',lvl:10,cls:'war',max:5,eff:[{t:'armyMul',v:1.2}]},
 {id:'disc',n:'Iron Discipline',i:'🔩',lvl:20,cls:'war',max:5,eff:[{t:'raidDef',v:1.2}]},
 {id:'spoils',n:'Spoils of War',i:'💰',lvl:35,cls:'war',max:5,eff:[{t:'raidLoot',v:1.3}]},
 {id:'conq',n:'Conqueror',i:'🚩',lvl:50,cls:'war',max:5,eff:[{t:'armyMul',v:1.15},{t:'unitCost',v:.02}]},
 {id:'flow',n:'Arcane Flow',i:'🌊',lvl:10,cls:'arc',max:5,eff:[{t:'mulRes',res:'mana',v:1.25}]},
 {id:'well',n:'Deep Well',i:'🕳️',lvl:20,cls:'arc',max:5,eff:[{t:'spellDur',v:1.15}]},
 {id:'echo',n:'Spell Echo',i:'🔁',lvl:35,cls:'arc',max:5,eff:[{t:'spellCd',v:.92}]},
 {id:'alch',n:'Aether Alchemy',i:'⚗️',lvl:50,cls:'arc',max:5,eff:[{t:'mulRes',res:['mana','crystal'],v:1.25}]},
 {id:'tax',n:'Tax Reform',i:'🧾',lvl:10,cls:'stew',max:5,eff:[{t:'mulRes',res:'gold',v:1.25}]},
 {id:'plan',n:'Civic Planner',i:'📐',lvl:20,cls:'stew',max:5,eff:[{t:'costRed',v:.02}]},
 {id:'census',n:'Census',i:'👥',lvl:35,cls:'stew',max:5,eff:[{t:'popMul',v:1.15}]},
 {id:'chanc',n:'Grand Chancellor',i:'🏛️',lvl:50,cls:'stew',max:1,eff:[{t:'edictSlots',v:1},{t:'mulAll',v:1.1}]}
];
const SMAP={};SKILLS.forEach(s=>SMAP[s.id]=s);
const GEAR=[
 {id:'weapon',n:'Weapon',i:'🗡️',names:['Rusted Blade','Bronze Sword','Ironbrand','Elven Saber','Moonsteel Blade','Starforged Edge','Dragonbone Glaive','Worldroot Blade'],d:'x1.12 tap, +4% army per tier'},
 {id:'armor',n:'Armor',i:'🛡️',names:['Patched Tunic','Leather Jerkin','Chain Hauberk','Leafweave Mail','Moonplate','Starplate','Dragonscale','Heartwood Aegis'],d:'+10% raid defense, +2% population per tier'},
 {id:'trinket',n:'Trinket',i:'📿',names:['Lucky Pebble','Carved Acorn','Silver Charm','Sap Amulet','Runic Locket','Star Pendant','Dragon Eye','Seed of the Crown'],d:'+3% all production per tier'},
 {id:'crown',n:'Crown',i:'👑',names:['Twig Circlet','Bronze Band','Laurel Crown','Silver Diadem','Moonlit Crown','Star Coronet','Dragonbone Crown','Evergreen Crown'],d:'+5% XP and -1% spell cost per tier'}
];
const GEAR_MAX=24;
function gearName(g,t){if(t<=0)return 'None';const names=g.names;const nm=names[Math.min(names.length-1,Math.floor((t-1)/3))];return nm+' +'+(((t-1)%3)+1);}
function gearCost(t){// cost to go from tier t to t+1
 const m=Math.pow(3.2,t);const c={iron:200*m,gold:120*m};if(t>=10)c.crystal=15*Math.pow(2.6,t-10);return c;}
const COMP=[
 {id:'smolder',n:'Smolder',i:'🐲',role:'Dragon (flameless)',join:{lvl:3},res:'food',bc:60,eff:[{t:'click',v:1.05},{t:'armyMul',v:1.03}],
  intro:'A young dragon with no flame and a lot of opinions drags himself out of the ash. He claims the fire is "just resting."',
  beats:{10:'Smolder coughs out a single warm ember. Everyone claps. He pretends not to care.',25:'Smolder learns to glide. Mostly into trees.',40:'Smolder breathes real fire. The Hollowroot approves. The fire marshal does not.'}},
 {id:'sylvara',n:'Sylvara',i:'🧝‍♀️',role:'Exiled healer-noble',join:{era:1},res:'food',bc:150,eff:[{t:'popMul',v:1.03},{t:'raidDef',v:1.03}],
  intro:'Lady Sylvara arrives with a satchel of herbs and a title nobody remembers. She starts fixing everyone anyway.',
  beats:{10:'Sylvara quietly reorganizes the infirmary and your sleep schedule.',25:'Sylvara sings to the wounded. Morale and mortality both improve.',40:'Sylvara is addressed as "Your Grace." She corrects them. Then accepts it.'}},
 {id:'tuck',n:'Tuck Burrowby',i:'🐰',role:'Rabbitfolk quartermaster',join:{era:2},res:'gold',bc:300,eff:[{t:'mulRes',res:'gold',v:1.04},{t:'expSpeed',v:1.02}],
  intro:'Tuck arrives with seventeen carts, a ledger, and a firm no-refunds policy.',
  beats:{10:'Tuck discovers a loophole in the tax code. The loophole files a complaint.',25:'Tuck opens a caravan route that even the bandits respect.',40:'Tuck owns a bank now. Do not ask how.'}},
 {id:'orrin',n:'Orrin Gearwright',i:'🔧',role:'Gnome engineer',join:{era:3},res:'iron',bc:1000,eff:[{t:'mulRes',res:['iron','stone'],v:1.04},{t:'costRed',v:.002}],
  intro:'Orrin falls out of a crate labeled FRAGILE and immediately starts redesigning your walls.',
  beats:{10:'Orrin builds a crane that builds cranes.',25:'Orrin has a blueprint for "a bigger gear." It is just a bigger gear.',40:'Orrin unveils the Grand Gear. It does one thing. Loudly.'}},
 {id:'mira',n:'Mira Thistle',i:'🧙‍♀️',role:'Hedge-witch',join:{era:3},res:'mana',bc:4000,eff:[{t:'mulRes',res:'mana',v:1.05},{t:'spellCd',v:.99}],
  intro:'Mira walks out of the fen with a cat, a cauldron and a strict policy on small talk.',
  beats:{10:'Mira teaches the cat a cantrip. The cat teaches Mira nothing.',25:'Mira brews tea that doubles as a mana potion.',40:'Mira is quietly the most powerful person in the realm. She wants to be left alone.'}},
 {id:'grakk',n:'Grakk the Reformed',i:'🪓',role:'Orc captain, defected',join:{era:5},res:'iron',bc:30000,eff:[{t:'armyMul',v:1.05},{t:'raidLoot',v:1.03}],
  intro:'An orc captain lowers his axe. "I have read your pamphlet," he says. "The pay is better."',
  beats:{10:'Grakk starts a book club. It is all war manuals.',25:'Grakk trains the watch to shout in a more terrifying key.',40:'Grakk is knighted. He cries. Then pretends he did not.'}},
 {id:'oldbark',n:'Old Bark',i:'🌲',role:'Last Treant',join:{era:6},res:'wood',bc:2e6,eff:[{t:'mulRes',res:['wood','food'],v:1.05},{t:'mulAll',v:1.01}],
  intro:'A stump in the glade clears its throat. It has been waiting four hundred years to say, "Finally."',
  beats:{10:'Old Bark finishes his sentence from last decade.',25:'Old Bark remembers the first king. He was shorter than expected.',40:'Old Bark blooms. The whole realm smells like spring.'}}
];
const CMAP={};COMP.forEach(c=>CMAP[c.id]=c);
