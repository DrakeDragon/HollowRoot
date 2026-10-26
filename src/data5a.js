'use strict';
// ===== part 5a: creature helpers + species 1-20 =====
const RAR=[
 {n:'Common',c:'#9fb0a6',w:50,m:1},
 {n:'Uncommon',c:'#6cc788',w:28,m:1.5},
 {n:'Rare',c:'#6aaee0',w:13,m:2.2},
 {n:'Epic',c:'#a98be6',w:6,m:3.2},
 {n:'Legendary',c:'#e8bf55',w:1.2,m:5},
 {n:'Mythic',c:'#ff7a9a',w:0,m:8}
];
const CRS=[],CRMAP={};
function mr(res,v){return {t:'mulRes',res,v};}
function ea(t,v){return {t,v};}
function CR(o){
 o.bc=60*Math.pow(7,o.era)*(1+o.rar*.6);
 o.g=o.g||{k:'wild'};
 CRS.push(o);CRMAP[o.id]=o;
}
// skill kinds: eff (timed buff), gain (secs of production), xp (fraction of level)
// ---- Era 1 ----
CR({id:'mossback',n:'Mossback Tortoise',i:'🐢',rar:0,era:1,hab:'Mossy ruins',fav:'food',
 pass:[mr('stone',1.015)],b5:[ea('costRed',.01)],b15:[mr('stone',1.4)],b30:[ea('mulAll',1.12)],
 sk:{n:'Shell Rest',d:'All production x2 for 40s',cd:240,dur:40,eff:[ea('mulAll',2)]},evo:'Elder Mossback',
 lore:['A tortoise the size of a wash basin is sitting in your road. A small tree grows on its back. It refuses to move, and eventually you build around it.',
  'The Mossback has decided your hammering is "a little fast." It begins pacing the builders at its own speed. Oddly, output goes up.',
  'Moss on its shell now includes tiny flowers. A citizen swears one of them gave her advice. She followed it. It was good advice.',
  'The Mossback nods once. Four hundred years of slowness have taught it that everything arrives. You are, apparently, a thing that arrives.']});
CR({id:'pip',n:'Pip the Acorn Sprite',i:'🐿️',rar:0,era:1,hab:'Hollowroot boughs',fav:'food',
 pass:[ea('click',1.03)],b5:[ea('crit',.03)],b15:[ea('click',1.5)],b30:[ea('critMul',1.5)],
 sk:{n:'Acorn Barrage',d:'Tap power x6 for 25s',cd:150,dur:25,eff:[ea('click',6)]},evo:'Oakheart Sprite',
 lore:['A squirrel with a tiny crown made of a hat stitched to an acorn cap climbs onto your shoulder and starts tapping on your ear. Rhythmically. As if teaching.',
  'Pip has started leaving acorns in your boots. Each one contains a very small, very smug riddle.',
  'Pip organizes a squirrel parade. It has banners. It is the most organized thing in the realm, including the council.',
  'Pip finally says its first word. The word is "Mine." Pip means the Hollowroot, and you, and everything. Fair.']});
CR({id:'dusk',n:'Dusk Moth',i:'🦋',rar:0,era:1,hab:'Twilight glade',fav:'wood',
 pass:[mr('wood',1.015)],b5:[mr('mana',1.15)],b15:[ea('xp',1.25)],b30:[ea('mulAll',1.12)],
 sk:{n:'Dust of Dusk',d:'Hero XP x3 for 45s',cd:300,dur:45,eff:[ea('xp',3)]},evo:'Lunar Moth',
 lore:['A moth the size of a dinner plate lands on your lantern. The light bends toward it, and the shadows lean in as if listening.',
  'The Dusk Moth leaves silver dust on everything it visits. Scholars collect it. Scholars are now suspiciously well-rested.',
  'It follows you across the whole glade at night, a pale glimmer, and for the first time the dark does not feel empty.',
  'The moth lands on the Hollowroot and the roots glow in the shape of wings. Some things are older than words.']});
CR({id:'cinder',n:'Cinder Fox',i:'🦊',rar:1,era:1,hab:'Ashen verge',fav:'food',
 pass:[ea('xp',1.02)],b5:[ea('crit',.04)],b15:[ea('armyMul',1.2)],b30:[ea('xp',1.5)],
 sk:{n:'Ember Dash',d:'Instantly gain 4 min of production',cd:420,gain:240},evo:'Ashfire Kitsune',
 lore:['A small fox with a tail like a lit fuse trots out of the ash and sits at your feet as if it has been waiting for you specifically. It has.',
  'The Cinder Fox steals things, but only things you were about to lose. A key, an hour, a bad idea. You start leaving the bad ideas out on purpose.',
  'It learned to nod. The nod means "I told you so." You have never won an argument with this animal.',
  'Its tail splits in two. Then in three. It sits on the bell tower and burns a quiet, steady gold. The whole town sleeps better.']});
// ---- Era 2 ----
CR({id:'truffle',n:'Truffle Boar',i:'🐗',rar:0,era:2,hab:'Oakwood',fav:'food',
 pass:[mr('food',1.02)],b5:[ea('popGrow',1.2)],b15:[mr('food',1.5)],b30:[ea('popMul',1.1)],
 sk:{n:'Feast Rush',d:'Food x4 for 60s',cd:240,dur:60,eff:[mr('food',4)]},evo:'Tuskguard Boar',
 lore:['A large boar sprints through a market square carrying a tiny child in a basket. The child is holding a truffle. Nobody has any questions.',
  'The Truffle Boar can smell trouble, and also dinner, and doesn\'t see the difference.',
  'It now leads the Harvest Festival. It does not know it is leading. The parade follows it anyway.',
  'The boar lies down at the village gate and sleeps. Nothing dares to pass without being polite.']});
CR({id:'heron',n:'Reedwing Heron',i:'🦢',rar:1,era:2,hab:'Greywater reeds',fav:'gold',
 pass:[mr('gold',1.02)],b5:[ea('expSpeed',1.1)],b15:[mr('gold',1.4)],b30:[ea('expSlots',1)],
 sk:{n:'Toll Collector',d:'Instantly gain 8 min of gold',cd:420,gain:480},evo:'Tidecaller Heron',
 lore:['A heron stands in the middle of a bridge and stares at every traveler. They all pay. Nobody remembers agreeing to.',
  'The Reedwing now keeps a ledger. Fish are listed as "investments." Your accountants are afraid.',
  'It can tell when someone is lying by the way they stand. It has begun doing this on your council.',
  'The heron lifts off and glides over the whole river, and at dusk the water turns to gold. The heron says nothing. It never does.']});
CR({id:'badger',n:'Burrow Badger',i:'🦡',rar:1,era:2,hab:'Ironvein hills',fav:'iron',
 pass:[mr('iron',1.02)],b5:[mr('stone',1.15)],b15:[mr('iron',1.4)],b30:[ea('costRed',.03)],
 sk:{n:'Deep Tunnel',d:'Iron and Stone x3 for 50s',cd:300,dur:50,eff:[mr(['iron','stone'],3)]},evo:'Delver Badger',
 lore:['A badger the width of a door digs up through the cellar of your barracks and hands a mildly shocked soldier a nugget of iron.',
  'The Burrow Badger digs for fun. The tunnels are now so extensive that nobody knows where the sewers end and the dungeons begin.',
  'It found a sealed vault of old elven coins. It returned them with a shrug and a very dusty bow.',
  'The tunnels link every district. The badger is quietly the most important engineer in the realm. Orrin refuses to speak to it.']});
CR({id:'newt',n:'Lantern Newt',i:'🦎',rar:1,era:2,hab:'Whispering fen',fav:'mana',
 pass:[mr('mana',1.02)],b5:[ea('spellCd',.97)],b15:[mr('mana',1.4)],b30:[ea('spellCost',.9)],
 sk:{n:'Glow Surge',d:'Mana x4 for 45s',cd:300,dur:45,eff:[mr('mana',4)]},evo:'Wisp-Lantern Newt',
 lore:['A newt with a glowing tail slides across a reading table and settles onto a book. The book has never been so thoroughly read.',
  'The Lantern Newt lights the way for the night scribes. Some say it also reads over their shoulders.',
  'Its glow now changes color with your mood. The council has requested it stop doing that.',
  'It climbs the Moonwell and the whole well hums back. The Newt is a lantern for something much older than a lantern.']});
CR({id:'owl',n:'Hollow Owl',i:'🦉',rar:2,era:2,hab:'Hollowroot knot',fav:'mana',
 pass:[ea('rSpeed',1.015)],b5:[ea('xp',1.2)],b15:[ea('rSpeed',1.3)],b30:[ea('resSlots',1)],
 sk:{n:'Third Eye',d:'Research x3 and XP x2 for 60s',cd:420,dur:60,eff:[ea('rSpeed',3),ea('xp',2)]},evo:'Archive Owl',
 lore:['An owl emerges from a knothole in the Hollowroot. It is far too large for the hole. It looks at you for a long moment and says, "Well. Finally."',
  'The Hollow Owl has opinions on your research order. They are correct. This is irritating.',
  'It teaches your scribes a method of writing that makes the page glow when it is true. Sadly, much of what they wrote glows weakly.',
  'The owl speaks the true name of the Hollowroot into the dark. Something far underground answers. Gently.']});
// ---- Era 3 ----
CR({id:'stag',n:'Thornback Stag',i:'🦌',rar:1,era:3,hab:'Briar forest',fav:'food',
 pass:[ea('popMul',1.008)],b5:[ea('popGrow',1.3)],b15:[ea('popMul',1.08)],b30:[ea('raidDef',1.3)],
 sk:{n:'Antler Call',d:'Population growth x5 for 60s',cd:360,dur:60,eff:[ea('popGrow',5)]},evo:'Crownhorn Stag',
 lore:['A great stag with a crown of thorns steps out into a clearing where a hundred refugees are huddled. They all stop shivering at once.',
  'The Thornback now escorts caravans through the briar. No one has been lost since. No one has been rude, either.',
  'Its antlers bloom in spring and the whole district smells of rain. The city council has asked if it could do that year-round.',
  'It lowers its head to you, once. Its antlers are heavy with living flowers. You have never been so honored.']});
CR({id:'wolf',n:'Silverpaw Wolf',i:'🐺',rar:1,era:3,hab:'Moonlit ridge',fav:'food',
 pass:[ea('armyMul',1.012)],b5:[ea('raidDef',1.1)],b15:[ea('armyMul',1.3)],b30:[ea('raidLoot',1.4)],
 sk:{n:'Howl of the Pack',d:'Army x2.5 for 45s',cd:300,dur:45,eff:[ea('armyMul',2.5)]},evo:'Moonfang Wolf',
 lore:['A silver wolf paces the ridge above your town for three nights. On the fourth, it walks down, sits beside a sentry, and stays.',
  'Silverpaw lets nobody sleep on watch. It does not bark. It simply stares, and the guards become ashamed.',
  'The wolf leads a night patrol into the fen. They return with nine bandits, one stolen cow, and a very satisfied wolf.',
  'Its howl at the full moon echoes across five regions. Orc scouts turn back without being told.']});
CR({id:'pike',n:'Glassfin Pike',i:'🐟',rar:1,era:3,hab:'Brightwater ford',fav:'gold',
 pass:[mr('gold',1.02)],b5:[ea('crit',.03)],b15:[mr('gold',1.4)],b30:[ea('mulAll',1.1)],
 sk:{n:'Golden Scales',d:'Gold x4 for 40s',cd:300,dur:40,eff:[mr('gold',4)]},evo:'Mirror Pike',
 lore:['A pike with translucent scales swims into the village fountain. Everyone who looks into the water sees a coin they once lost.',
  'The Glassfin Pike can see through lies. The council has quietly stopped holding meetings near the fountain.',
  'It teaches a child to read the surface of water. The child becomes the best negotiator the town has ever produced.',
  'The pike glows gold at dusk. Every merchant in the district claims it is "their" lucky charm. It belongs to nobody. It likes that.']});
CR({id:'bear',n:'Bellows Bear',i:'🐻',rar:2,era:3,hab:'Foundry caves',fav:'iron',
 pass:[ea('raidDef',1.015)],b5:[mr('iron',1.2)],b15:[ea('raidDef',1.4)],b30:[ea('armyMul',1.3)],
 sk:{n:'Bellow',d:'Raid defense x4 for 90s',cd:420,dur:90,eff:[ea('raidDef',4)]},evo:'Forgemaw Bear',
 lore:['A bear with soot-black fur wanders into the smelter, breathes onto the fire, and the whole furnace roars to twice its size. The smiths bow.',
  'The Bellows Bear has taken the night shift. Nobody remembers hiring it. Nobody complains.',
  'It fights off a troll that tried to steal a barrel of ore. The troll apologizes the next morning, with flowers.',
  'It sits at the forge like a slumbering mountain. A hundred hammers work around it, and the bear hums.']});
CR({id:'wisp',n:'Marsh Wisp',i:'✨',rar:2,era:3,hab:'Silent marsh',fav:'mana',
 pass:[mr('mana',1.025)],b5:[ea('spellDur',1.1)],b15:[mr('mana',1.5)],b30:[ea('spellCd',.9)],
 sk:{n:'Wisp Dance',d:'Spell cooldowns refund: gain 12 min of mana',cd:600,gain:720,res:'mana'},evo:'Starmarsh Wisp',
 lore:['A drifting light leads you through a marsh at night. You\'re not sure when you started following it, but you\'re glad you did.',
  'The Marsh Wisp has learned to hold still on request. This took sixteen weeks. It is very proud.',
  'It hovers beside Mira\'s cauldron and the potions come out in colors that no one has seen.',
  'You realize the wisp has been leading you somewhere for months. At last it stops, above a quiet pool, and shows you a star reflected.']});
CR({id:'spider',n:'Loom Spider',i:'🕷️',rar:2,era:3,hab:'Silkwood canopy',fav:'wood',
 pass:[ea('rSpeed',1.015)],b5:[ea('costRed',.01)],b15:[ea('rSpeed',1.3)],b30:[ea('crSlots',1)],
 sk:{n:'Weave Fate',d:'Building costs -25% for 60s',cd:420,dur:60,eff:[ea('costRed',.25)]},evo:'Fatebinder Spider',
 lore:['A spider the size of a cart weaves a web across a stalled bridge. By morning, the bridge is stronger than stone. The spider is meticulously polite about it.',
  'The Loom Spider reads the web it makes. Last night it told the baker that her mother\'s recipe was "fine, but the sugar is wrong." The baker wept.',
  'It weaves tapestries that predict small things. A rainstorm. A sneeze. A tax audit.',
  'The Spider finishes a tapestry of the whole realm and leaves one thread unspun. The thread, it says, is yours.']});
