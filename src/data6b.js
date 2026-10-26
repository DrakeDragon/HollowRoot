'use strict';
// ===== part 6b: acts, branching tales, companion beats =====
const ACTS=[
 {n:'Act I: Ash and Acorns',from:0},{n:'Act II: Roots',from:12},{n:'Act III: Branches',from:24},{n:'Act IV: Canopy',from:36},
 {n:'Act V: Storm',from:48},{n:'Act VI: Heartwood',from:60},{n:'Act VII: Evergreen',from:72}
];
function actOf(i){let a=0;ACTS.forEach((x,k)=>{if(i>=x.from)a=k;});return a;}
const TALES=[];
function TL(id,at,t,tx,ch){TALES.push({id,at,t,tx,ch});}
TL('stump',6,'The Stump That Wouldn\'t Move','A stump sits in the middle of your first road. It has been there four hundred years. Builders are staring at it. It, maybe, is staring back.',[
 {l:'Chop it down',r:'The axes ring. The stump falls with a sigh. You feel, briefly, like a person who has done a thing.',eff:[mr('wood',1.1)]},
 {l:'Build around it',r:'The road bends gracefully. The stump becomes a landmark. Travelers use it for directions.',eff:[ea('popMul',1.05)]},
 {l:'Politely ask it to move',r:'A long silence. Then, with a creak, the stump rolls aside and begins to grow. Nobody is more surprised than the stump.',eff:[ea('click',1.12)]}]);
TL('piethief',10,'The Pie Thief','The first pie has gone missing from the windowsill. A small trail of crumbs leads to a very full child. The baker is furious. The child is crying. The pie was, reportedly, excellent.',[
 {l:'Make an example',r:'The child must clean the bakery for a week. The bakery has never been so clean. The child has never been so loved.',eff:[ea('raidDef',1.05)]},
 {l:'Forgive and share the pie',r:'Pie for everyone. The child is tomorrow\'s baker, and the creature outside the window knows it.',eff:[ea('bond',1.1)]},
 {l:'Hire the child as official taster',r:'The child is soon the most respected critic in the realm. The baker\'s pies improve. Mostly out of fear.',eff:[mr('food',1.1)]}]);
TL('tuckdebt',14,'Tuck\'s Fine Print','Tuck presents a contract in tiny writing. It is, as far as you can tell, a good deal. It is also forty pages long and includes the phrase "and all heirs." He looks at you with innocent eyes.',[
 {l:'Sign it',r:'Gold flows. Somewhere, a clause activates. You will find out which one in a few years.',eff:[mr('gold',1.12)]},
 {l:'Have Sylvara read it',r:'She finds three traps and a recipe for stew. The stew is excellent. The traps are removed.',eff:[ea('costRed',.02)]},
 {l:'Tear it up and shake hands',r:'Tuck weeps. He\'s never had that before. His prices drop for a year, then a decade.',eff:[ea('bond',1.1)]}]);
TL('letter',18,'The Collector\'s Offer','Corvane\'s letter proposes terms. Surrender the Hollowroot, and your realm may keep its roofs. Smolder snarls. Sylvara frowns. Tuck is calculating. The System says nothing, but the leaves on the Hollowroot tremble.',[
 {l:'Defy him',r:'Your reply is one word. Smolder suggests an additional one. Your army swells with volunteers.',eff:[ea('armyMul',1.1)]},
 {l:'Negotiate',r:'You propose a payment plan. The Collector doesn\'t answer, but the raids slow. Tuck takes credit.',eff:[mr('gold',1.1)]},
 {l:'Burn the letter',r:'It burns green. The ashes smell like old paper and something sadder. You tell no one.',eff:[ea('mulAll',1.04)]}]);
TL('cubs',22,'The Orphaned Cubs','Three small creatures huddle on the edge of the orchard. Their parent did not come back from the road. They shiver. They are wild, and they are hungry. They look at you.',[
 {l:'Adopt them',r:'The cubs move into the stable. They bite everyone. They also guard everyone. The stable becomes the loudest, warmest place in the realm.',eff:[ea('crMul',1.1)]},
 {l:'Return them to the wild',r:'You carry them to the edge of the forest. They look back once. Later, a pawprint appears on your doorstep: a thank-you.',eff:[ea('crLuck',.15)]},
 {l:'Ask Sylvara to nurse them',r:'Sylvara hums while she works, and by morning all three are fat and sleepy. She falls asleep in a chair with a cub on each arm.',eff:[ea('xp',1.1)]}]);
TL('rune',26,'The Rune in the Library','A scribe finds a glowing rune scratched into a shelf, under centuries of dust. It pulses when you walk near. The scribe backs away with a very polite look of dread.',[
 {l:'Study it',r:'The rune is a map of the Hollowroot\'s roots. It rewrites itself as you read. You come away with a headache and a plan.',eff:[ea('rSpeed',1.12)]},
 {l:'Seal it away',r:'The shelf is boarded up. Mira watches in silence, then quietly nods.',eff:[ea('spellCost',.95)]},
 {l:'Burn the shelf',r:'It burns blue. The library smells of cinnamon for a week. The rune is gone, but you feel lighter.',eff:[ea('mulAll',1.04)]}]);
TL('flight',30,'Smolder\'s First Flight','Smolder stands on the edge of the tallest tower, flapping very hard. He\'s been trying all week. He would like you to watch. He would also like you to pretend you didn\'t.',[
 {l:'Let him jump',r:'He falls, flaps, and catches the wind. For two minutes, he flies. He lands on a chimney and refuses to come down until dinner.',eff:[ea('click',1.15)]},
 {l:'Catch him if he falls',r:'You stand below with your arms out. He doesn\'t fall. He glides in a long lazy spiral and lands on your shoulders. Heavy. Perfect.',eff:[ea('raidDef',1.1)]},
 {l:'Fly with him',r:'You climb the tower. You both jump. It goes badly. It goes well. By the end you\'re both lying in a haystack, laughing.',eff:[ea('xp',1.12)]}]);
TL('wall',33,'The Mourning Wall','A citizen has been quietly leaving flowers at the foot of a blank wall. Others have joined. They never say who they\'re mourning. They\'re mourning someone. They\'re all mourning someone.',[
 {l:'Build a memorial wall',r:'Names are carved. Every name is a person someone loved. The wall is never empty of flowers again.',eff:[ea('popMul',1.05),ea('xp',1.05)]},
 {l:'Leave it as it is',r:'You stand there at night, alone. You think of someone. You do not say who. The wall says nothing back, which is the point.',eff:[ea('bond',1.1)]},
 {l:'Invite everyone to share a story',r:'A hundred strangers sit in a circle. By morning, the district is a family. The creatures wander in and out, and no one tells them to leave.',eff:[ea('mulAll',1.04)]}]);
TL('traitor',37,'The Traitor on the Council','A councilor has been selling your patrol schedules to the Collector. The evidence is a ledger page, a single glove, and the councilor\'s trembling face.',[
 {l:'Expose them publicly',r:'The hall is silent. Justice is done, and no one feels good about it. Trust is rebuilt, slowly, like a wall.',eff:[ea('raidDef',1.1)]},
 {l:'Forgive, with a warning',r:'The councilor kneels. Weeks later, they warn you about an ambush. It saves a thousand lives.',eff:[ea('popMul',1.05),ea('bond',1.05)]},
 {l:'Promote them, and watch them',r:'Power changes people. In this case, for the better. They never forget why you chose them.',eff:[mr('gold',1.1)]}]);
TL('cat',42,'Mira\'s Cat','Mira\'s cat has been sitting on your throne for three days. It refuses to move. When you finally pick it up, it speaks. It says: "I am the Queen of the Hollow Wood. I would like my crown back."',[
 {l:'Offer it a seat of honor',r:'The Queen sits at your right hand. She tells terrible secrets about every ambassador. She is worth more than a standing army.',eff:[ea('crSlots',1)]},
 {l:'Ask a favor in return',r:'She blinks, slowly. A favor is granted. The spells of the realm come back a little faster.',eff:[ea('spellCd',.95)]},
 {l:'Just pet it',r:'The Queen purrs. It is the most powerful sound in the realm. Even the Collector\'s spies sigh.',eff:[ea('xp',1.1)]}]);
TL('winter',47,'The Hunger Winter','The harvest fails in the east. Refugees stream toward your gates. Your stores are good. Not good enough for everyone. The council turns to you.',[
 {l:'Store grain for your own',r:'Your people eat, barely. The refugees keep walking. The creatures follow them out for a mile and then, quietly, turn back.',eff:[mr('food',1.15)]},
 {l:'Open the gates',r:'Everyone eats less. Everyone eats. The city grows. And the refugees never forget.',eff:[ea('popMul',1.08)]},
 {l:'Ration the army first',r:'Soldiers eat last. The army grows fiercely loyal. The city grows quietly proud.',eff:[ea('unitCost',.06)]}]);
TL('barkmem',52,'Old Bark\'s Memory','Old Bark offers to show you the Planting, the day the Hollowroot was seeded. It requires you to dream. It requires you to be honest. It requires, he says, that you not wake up angry.',[
 {l:'Watch the whole dream',r:'You see the first king, young, tired, planting a seed with his brother beside him. They are laughing. You wake with tears on your face.',eff:[ea('xp',1.2)]},
 {l:'Ask about the Ledger',r:'The dream darkens. A hand signs a page. The hand is not the king\'s. It is his brother\'s. Old Bark does not look at you. You do not ask again.',eff:[mr('gold',1.15)]},
 {l:'Plant a seed of your own',r:'In the dream, you push a seed into the soil beside the first one. It sprouts instantly. Old Bark whispers, "Well. That\'s new."',eff:[ea('crMul',1.1)]}]);
TL('dinner',58,'The Embassy Dinner','Ambassadors from six nations dine in your hall. A flute plays. A creature stole the soup. An ambassador is furious. Another is delighted. A third is pretending not to be delighted.',[
 {l:'Smooth it over with gifts',r:'The ambassadors leave with arms full of wonders. Your treasury weeps. Your reputation sings.',eff:[ea('bond',1.1)]},
 {l:'Laugh and bring more soup',r:'The room erupts. Tension melts. A treaty is signed over dessert. Nobody remembers who suggested it.',eff:[mr('gold',1.15)]},
 {l:'Defend the creature\'s honor',r:'You make a speech about the dignity of thieving soup. It is the best speech you\'ve ever made. It makes the news.',eff:[ea('crLuck',.2)]}]);
TL('clans',63,'The Sky Clans\' Terms','The Sky Clans agree to treaty, on one condition: your armies never fly above the clouds. It is a fair price. It is also a limit you hadn\'t planned on.',[
 {l:'Accept the terms',r:'Peace spreads. You walk on the ground. The clans send you a feather every year.',eff:[ea('raidDef',1.15)]},
 {l:'Negotiate a loophole',r:'Tuck finds one. The clans find out. They\'re impressed. The treaty is renegotiated to something better.',eff:[mr('gold',1.15)]},
 {l:'Refuse',r:'The clans withdraw. Your armies grow sharper, leaner, angrier. They fly anyway. It costs you dearly, and you win.',eff:[ea('armyMul',1.15)]}]);
TL('seedcrown',69,'The Seed of the Crown','The Hollowroot, reborn, offers you a single seed. It says: "This is the seed of the crown. Plant it in a person, and they are king. Plant it in the earth, and the earth is king. Plant it in you, and you are what you decide."',[
 {l:'Plant it in the earth',r:'A grove grows overnight. It does not give orders. It gives shade. The whole realm moves a little slower, a little kinder.',eff:[ea('mulAll',1.1)]},
 {l:'Give it to the people',r:'It is divided into a thousand seeds and planted in a thousand gardens. Nobody wears a crown. Everybody wears a leaf.',eff:[ea('popMul',1.12)]},
 {l:'Keep it',r:'You hold it in your palm. It beats like a heart. You carry it everywhere. It is heavy, warm, alive.',eff:[ea('xp',1.25)]}]);
TL('ledger',76,'The Ledger','The Collector places the Ledger on your table. It is a heavy book bound in black. The debt is real. The creditor is long gone. The Collector is the last who remembers it. He asks only that you decide: what is owed?',[
 {l:'Forgive the debt',r:'You write one word across the final page: PAID. The Ledger turns to ash. The Collector exhales. Four hundred years of grief leave his shoulders like birds.',eff:[ea('mulAll',1.15),ea('gain',1.2)]},
 {l:'Burn the Ledger',r:'It burns bright green. Corvane watches, tearless, and says, "I was waiting for someone to be angry on my behalf." He thanks you. Smolder, for once, says nothing.',eff:[ea('armyMul',1.25),ea('xp',1.3)]},
 {l:'Repay it, with interest',r:'You pay the debt in labor, in seeds, in time. The Collector is staggered. He\'s never been repaid before. He weeps, once, quietly, and then gets to work.',eff:[ea('crMul',1.2),mr('gold',1.3)]}]);
const TMAPS={};TALES.forEach(t=>TMAPS[t.id]=t);

// ---- extra companion story beats ----
const EXTRA_BEATS={
 smolder:{5:'Smolder is ashamed of his flameless snout. You tell him about the time you were ashamed of yours. He tilts his head. "You have a snout?"',20:'Smolder lights a candle with a very small, very careful flame. He looks at you. You nod. He does it again.',30:'Smolder has stopped calling himself "the defective one." He now says "the late bloomer." It is progress.',50:'Smolder stands on the Spire at dusk and lets out a flame bright enough to light the whole realm. Then he turns and says, quietly, "Thanks for waiting."'},
 sylvara:{5:'Sylvara hums while she works. It is a lullaby her mother used to sing. She doesn\'t know you can hear.',20:'Sylvara confesses her last name. It belongs to a house that no longer exists. She asks you not to say it aloud. You don\'t.',30:'Sylvara founds a school for healers. The first student is a cub. The second is a goblin. The third is a very surprised prince.',50:'Sylvara\'s house is rebuilt, stone by stone, by the people she healed. She reads the name above the door and cries. Then she bakes bread for everyone.'},
 tuck:{5:'Tuck has taken to calling you "Boss." You\'ve asked him to stop. He now calls you "Boss, with love."',20:'Tuck opens a bank. The bank has a single vault. In it is one copper coin, and a note: "The first one I ever earned."',30:'Tuck\'s caravans now reach seventeen nations. He sends you a postcard from each. They all say "wish you were here, but not for free."',50:'Tuck retires, briefly. He lasts four hours. He explains: "Retirement has no profit margin." He goes back to work, humming.'},
 orrin:{5:'Orrin\'s walls are straight. His moods are not. He builds, he sulks, he builds again. You bring him tea.',20:'Orrin completes the "Grand Gear." It does nothing. It does it beautifully. He weeps with joy.',30:'Orrin builds a clock that tells time in moods. It says "cranky" most of the day. It is correct.',50:'Orrin\'s final blueprint is a bridge across the Hollow Between. He builds it. It holds. He asks nobody to walk across it. He just wanted to know he could.'},
 mira:{5:'Mira\'s cat sits on every spellbook. Mira says this "improves the magic." The magic has not argued.',20:'Mira teaches you a three-word spell. It means "I am here." It is the hardest spell you have ever learned.',30:'Mira is nominated for Archmage. She declines. She is nominated again. She sets the nominating committee\'s hats on fire. Lightly.',50:'Mira opens the Hollow Between with a hum. The cat walks through, looks back, and meows once. Mira smiles. "It says thank you."'},
 grakk:{5:'Grakk practices saying "please." It takes him an hour. He says it to a wall. The wall holds up well.',20:'Grakk writes a letter home to his clan. They write back. It is one line: "We heard. Proud of you." He keeps it in his boot.',30:'Grakk leads a mixed patrol of orcs, elves, and a very suspicious goat. They get along. The goat is the captain.',50:'Grakk is knighted. He cries. Then pretends he did not. Then cries again, openly. The hall stands and cheers. The goat is knighted too.'},
 oldbark:{5:'Old Bark finishes his sentence from last decade. It was "…and that, my dear, is why you never trust a squirrel."',20:'Old Bark remembers the first king. He was shorter than expected, and kinder than the stories.',30:'Old Bark blooms. The whole realm smells of spring. Pip falls out of a tree in surprise.',50:'Old Bark\'s last bloom. He tells you it is not an ending: "Just a very long pause, dear. I plan to be rude about it."'}
};
for(const id in EXTRA_BEATS)for(const l in EXTRA_BEATS[id])CMAP[id].beats[l]=EXTRA_BEATS[id][l];
