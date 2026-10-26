'use strict';
// ===== part 6a: chapters 1-28 =====
const CHAPTERS=[];
function CH(n,c,txt){CHAPTERS.push({n,c,txt});}
// ---------------- ACT I: ASH AND ACORNS ----------------
CH('Ash and Acorns',{k:'tap',n:10},'You wake in the ashes beneath the Hollowroot, the dead World-Tree. A glowing window blinks: <b>[SYSTEM]</b> Welcome, Warden-Heir. Please tap things until civilization happens.');
CH('A Roof, Technically',{k:'bld',id:'woodcamp',n:3},'Three woodcutter camps stand. The trees are nervous. The System congratulates you for "aggressive optimism." You decide not to ask what it means.');
CH('Something With Scales',{k:'lvl',n:3},'A flameless dragon named Smolder limps out of the smoke and declares himself your bodyguard. He cannot yet defend a sandwich. He does not let this stop him.');
CH('Berries, Allegedly',{k:'bld',id:'forager',n:4},'Four foragers return from the burnt wood with baskets of berries. Half are edible. The other half are, according to Smolder, "an adventure."');
CH('Smoke From Chimneys',{k:'era',n:1},'The Glade becomes a Hamlet. Someone hung laundry. It is the most hopeful thing you have ever seen.');
CH('First Rent',{k:'bld',id:'cottage',n:5},'Five cottages. Five families. Five completely different opinions about where the road should go. You begin to understand what "governing" means.');
CH('The Orcs Send a Letter',{k:'raid',n:1},'You repelled your first raid. The orcs left a strongly worded note and one boot. The note is signed: <i>"With regards, from the Collector of the Hollow Tithe."</i> You have no idea what that means. Yet.');
CH('A Friend With Fur',{k:'cre',n:1},'You find someone sitting in your road who is not a citizen. They\'re not a threat, either. They\'re just here, and they are a friend. Check the Menagerie. Creatures bond with you, and give you strength.');
CH("Lady Sylvara's Satchel",{k:'comp',n:2},'A noblewoman arrives with a satchel of herbs and a title nobody remembers. She starts fixing everyone anyway. She does not say her last name. Yet.');
CH('The Class of Things',{k:'lvl',n:10},'Level 10. The System offers you a choice: <i>"Choose a Class."</i> You ask what happens if you refuse. It replies: <i>"Then you will be a Warden. Which is a class. Please choose."</i>');
CH('Pie Economics',{k:'tot',res:'food',n:20000},'Twenty thousand portions of food have passed through your hands. Someone invents the pie. The entire economy reorganizes around it by Tuesday.');
CH('Council of Stumps',{k:'era',n:2},'Village status achieved. A council forms. It meets on literal stumps and argues about stump seating. You are told this is "the beginning of democracy."');
// ---------------- ACT II: ROOTS ----------------
CH('Maps Are for Winners',{k:'reg',n:1},'The first region answers to you. A scout hands you a map. The map is mostly wishful thinking, with one accurate river. You frame it.');
CH("Tuck's Ledger",{k:'comp',n:3},'A rabbitfolk quartermaster arrives with seventeen carts, a ledger, and a firm no-refunds policy. The ledger has a single page dedicated to you. It is titled "Trouble."');
CH('Scribbles in Bark',{k:'tech',n:5},'Five discoveries inscribed in bark. Your scribes complain about parchment. Your woodcutters complain about scribes. The bark has no comment.');
CH('A Hundred Doors',{k:'bldn',n:100},'A hundred buildings. Someone makes a sign that says "Welcome to Hollowroot." Someone else makes a sign that says "Welcome to Hollow." The first sign is kept.');
CH('The Map Gets Colored',{k:'reg',n:3},'Three regions answer to you. The old maps are redrawn in your favorite shade of green.');
CH("The Collector's Letter",{k:'raid',n:5},'A formal scroll arrives, sealed in black wax: <i>"The Hollowroot\'s lands are collateral. The debt has come due. Pay in full or be collected. — Magister Corvane Vael, Collector of the Hollow Tithe."</i> Smolder sneezes on it.');
CH('A Menagerie Begins',{k:'cre',n:3},'Three creatures now call your realm home. A citizen suggests naming the district "Beastville." The creatures vote it down. In squeaks and a snort.');
CH('The Weight of Leaves',{k:'lvl',n:18},'Level 18. Your body feels different. The System congratulates you on "adequate progress." Smolder pats your leg with a wing and says it is the nicest thing he has said all week.');
CH('The Mossbound Gate',{k:'wonder',n:1},'You complete your first wonder. It is a gate. It leads nowhere. Everyone is deeply moved. Smolder flies through it three times to be sure.');
CH('Five Hundred Hands',{k:'pop',n:500},'Five hundred citizens. The tavern ran out of chairs. The tavern is thrilled, and charges rent for standing.');
CH('A Friendship With Fur',{k:'bond',n:10},'A creature\'s bond reaches level 10 and begins to do something wonderful: it lends you a Skill. Open the Menagerie and see what your friend can do. And thank them. They like that.');
CH('Town of Scholars',{k:'era',n:3},'Town walls rise. A library appears. Orrin draws plans for walls that build walls. You approve a smaller idea, which he immediately resents and perfects.');
// ---------------- ACT III: BRANCHES ----------------
CH('Orrin Falls From a Crate',{k:'comp',n:4},'A gnome falls out of a crate marked FRAGILE and immediately starts redesigning your walls. He has seen your drawings and calls them "adorable." You\'re not sure whether to hire him or hide.');
CH('Library of Leaves',{k:'tech',n:12},'Twelve discoveries. Your scribes run out of parchment and start using bark. The bark does not mind. The bark has begun to answer back.');
CH('Five Provinces',{k:'reg',n:5},'Five regions. Governors are chosen by lottery, which goes badly, then very well, then badly again. The system, you learn, is "a work in progress."');
CH('The Wall Holds',{k:'raid',n:15},'Fifteen raids repelled. The Collector\'s soldiers wear black and march in perfect step. The captain\'s helmet is stamped with a ledger. You wonder who they are paying.');
CH('Tides of Power',{k:'lvl',n:40},'Level 40. The System pauses before congratulating you: <i>"Warden. You are growing faster than the Hollowroot ever predicted. Please be careful."</i> You ask what it means. It does not answer.');
CH('Wild Hearts',{k:'cre',n:6},'Six creatures. A farmer insists his sheep are jealous. The sheep are jealous. They begin a nonviolent protest in the pasture.');
CH('Mira Walks Out of the Fen',{k:'comp',n:5},'Mira Thistle arrives with a cat, a cauldron, and a strict policy on small talk. She looks at the Hollowroot for a long time and says, quietly, <i>"It\'s still alive. Barely."</i>');
CH('Gold in the Hands',{k:'tot',res:'gold',n:50000000},'Merchants arrive from lands you\'ve never heard of. One of them offers to buy the sunset. Tuck negotiates. You are not sure what the sunset is worth, but you know it is more than he paid.');
CH('Shrine of the First Leaf',{k:'wonder',n:2},'The shrine stands. Citizens leave offerings of acorns and slightly regrettable poetry. A leaf on the Hollowroot unfurls. Just one. It\'s green. Mira cries into her cat.');
CH('Deep Bonds',{k:'bond',n:20},'A bond reaches level 20. The creature looks up at you in the evening light, and for a moment you see in its eyes the thing the System keeps calling "belonging."');
CH('A Town Becomes a City',{k:'pop',n:5000},'Five thousand citizens. A baker opens a second bakery to compete with her first. Nobody understands, and everybody eats.');
CH('City of Spires',{k:'era',n:4},'Towers where there were stumps. A bard writes a song about you. It rhymes "Warden" with "hordin\'." You request a different bard. They send the same one, wearing a hat.');
// ---------------- ACT IV: CANOPY ----------------
CH('The Eight Banners',{k:'reg',n:8},'Eight regions fly your banner. A scout from the east reports that the Collector has moved his headquarters to a fortress "that looks like a tombstone with ambition."');
CH('The Thousand Banners',{k:'pow',n:100000000},'A hundred million strong in might. Foes now send flowers before they send raids. The flowers are poisoned, but it is the thought that counts.');
CH('Metamorphosis',{k:'evo',n:1},'A creature, bonded to the final level, transforms. Light rolls around it like water. When it fades, a grander form stands in its place, and it still leans against your leg like it did the first day.');
CH("Wanderers' Return",{k:'exp',n:20},'Twenty expeditions return. A scout brings a map, a relic, and a stone she insists is "a shy dragon egg." It is a stone. She is thrilled.');
CH('The Weight of Crowns',{k:'lvl',n:70},'Level 70. You find you have started to speak like a king, in short sentences with large pauses. Smolder tells you to stop. You do. For nine minutes.');
CH('Library of Sap-Script',{k:'wonder',n:4},'The Library opens. Its books are written in sap and are slightly sticky. Scholars wash their hands more than they read. Still, the knowledge enters the realm and lives there.');
CH('Ten Provinces',{k:'reg',n:10},'Ten regions. Governors are appointed. Two are immediately appointed to a different region as "a promotion."');
CH('Crown of Branches',{k:'era',n:5},'You are now a Kingdom. A crown of woven branches is placed on your head. It is itchy. It is yours. Smolder pretends not to be impressed and fails.');
CH('Grakk Lowers His Axe',{k:'comp',n:6},'An orc captain lowers his axe at the gate. "I have read your pamphlet," he says. "The pay is better." Smolder looks at you. You look at Smolder. The pamphlet, it turns out, was Tuck\'s.');
CH('Fifteen Friends',{k:'cre',n:15},'Fifteen creatures. The realm has taken to calling them "the Wild Court." They hold meetings in the orchard. Nothing gets decided. It is wonderful.');
CH('Bonded Beyond Words',{k:'bond',n:25},'A creature\'s bond passes level 25. There are no more words. There are looks, leans, and the slow blink of an animal that has decided you\'re family.');
CH('Crystal Rain',{k:'tot',res:'crystal',n:1000000},'A million crystal pass through your hands. Mages pin them to their robes. Children skip them on ponds. The Collector\'s spies begin to whisper that you are "dangerously cheerful."');
// ---------------- ACT V: STORM ----------------
CH('A Hundredth Shield',{k:'raid',n:100},'One hundred raids repelled. The Collector\'s captain finally sends a message that is not a threat: <i>"Why do you keep winning?"</i> Smolder, from the rafters, writes back: "Because we like it here."');
CH('Ten Million Spears',{k:'pow',n:10000000000000},'Ten trillion in might under your banner. The Collector pauses his advance. For the first time in a thousand years, someone has made the Ledger blink.');
CH('Empire, Reluctantly',{k:'era',n:6},'Empire. The word feels big in your mouth. The System says: <b>[SYSTEM]</b> <i>Please do not become a villain. Thank you.</i> You promise. Smolder holds you to it with a stern, tiny frown.');
CH('Old Bark Clears His Throat',{k:'comp',n:7},'A stump in the glade clears its throat. It has been waiting four hundred years to say, "Finally." He knew the old kings. He knew the Planting. He knows what the Ledger is. He has been waiting for someone who would ask.');
CH('Fourteen Banners',{k:'reg',n:14},'Fourteen regions. Old Bark tells you why the Collector wants the Hollowroot: it was not stolen, but <i>borrowed against</i>. By a king. In a hurry. For a good reason.');
CH('Level One Hundred',{k:'lvl',n:100},'Level 100. Bards fight over your biography. You resolve it by publishing your own. It is mostly accurate. Smolder is described as "a minor character." He is not speaking to you.');
CH('Three Transformations',{k:'evo',n:3},'Three of your friends have transformed. The realm throws a festival. A dragon, a moth, and a tortoise lead the parade. The tortoise is last. It is also the one everyone cheers for.');
CH("The Dragon's Spire",{k:'wonder',n:5},'The Dragon\'s Spire rises. Smolder lands on its tip, spreads his wings, and breathes a perfect, steady, three-foot flame. Everyone claps. He pretends he did not cry.');
CH('Sixteen Provinces',{k:'reg',n:16},'Sixteen provinces. The cartographer demands a raise and a better pen. You grant both. The pen is a feather from the Thunder Roc. He frames it instead.');
CH('Thirty Discoveries',{k:'tech',n:30},'Thirty discoveries. Orrin builds a machine to do your research for you. It writes one line: "More tea." You give it more tea. It works faster.');
CH('Twenty Hearts',{k:'cre',n:20},'Twenty creatures call your realm home. You realize some have formed friendships with each other. A tortoise and a hummingbird watch sunsets together. No one talks about it.');
CH('Contracts Fulfilled',{k:'bount',n:10},'Ten bounties fulfilled. The Board overflows with notes of thanks. One reads only: "Thank you for the sunrise." You do not remember providing it.');
// ---------------- ACT VI: HEARTWOOD ----------------
CH('The Tree Remembers',{k:'era',n:7},'The Hollowroot stirs. A sprout. A single, glowing leaf. The entire realm holds its breath. The System speaks, and the voice is no longer a window: <i>"Warden. I am ready to tell you who I am."</i>');
CH('Eighteen Regions',{k:'reg',n:18},'Eighteen regions. The System tells you: <i>"I am the Hollowroot. I have been dreaming for four hundred years. Forgive the jokes. They were all I had."</i> You laugh. You sit. Smolder sits with you.');
CH('Aether Colossus',{k:'wonder',n:6},'The Aether Colossus stands. It hums. A million tiny lights run along its limbs. The Hollowroot says: <i>"That is how it feels, when you are not alone."</i>');
CH('Level One Thirty',{k:'lvl',n:130},'Level 130. Your power is no longer measured in muscle but in how many people don\'t have to be afraid. Sylvara tells you that is the only real kind. She is right. It is annoying.');
CH('Twenty Banners',{k:'reg',n:20},'Twenty regions. The Collector sends one more letter: <i>"I would like to speak. Not as an enemy. As the only one left who remembers."</i> The letter smells of old paper and older grief.');
CH('Eight Transformations',{k:'evo',n:8},'Eight friends transformed. The Wild Court holds its first formal council. They elect Pip as speaker. Nobody can say why. It does an excellent job.');
CH('A Bond Without End',{k:'bond',n:30},'A bond reaches its limit. The creature does not know it is a limit. It simply leans in, and you lean in, and the Hollowroot hums a low, steady note of approval.');
CH('Forty-Five Discoveries',{k:'tech',n:45},'Forty-five discoveries. Your archive fills with maps, songs, and a recipe for soup that makes you remember your mother\'s hands. You write it down immediately.');
CH('The Hollowroot Reborn',{k:'wonder',n:7},'The Hollowroot Reborn stands complete. The old world is gone. The new one has your name on the gate. And the roots stir, and something ancient uncoils beneath them. It bows.');
CH('Choices That Echo',{k:'tale',n:8},'Eight tales decided. The Hollowroot says: <i>"You are a different Warden now than the one who woke in the ash."</i> You are. You didn\'t notice.');
CH('Thirty Species',{k:'cre',n:30},'Thirty species. The Wild Court has a flag. It is a leaf, a paw print, and a very small crown. Pip designed it. The crown is not to scale.');
CH('Again, But Wiser',{k:'prest',n:1},'You Rebirth. The realm resets; the lessons do not. The Hollowroot whispers: <i>"Warden, you have done this before. Let us do it better. And this time, let us remember the little things."</i>');
// ---------------- ACT VII: EVERGREEN ----------------
CH('The Collector Speaks',{k:'reg',n:24},'The Collector arrives at your gate alone, in a black coat stitched with names. He is older than he looks. He says, "I am not here to collect. I am here because someone should finally ask me why."');
CH('Level One Sixty',{k:'lvl',n:160},'Level 160. The Collector watches you work for a day and a night. He leaves a note: <i>"You are doing it the way my brother never could. Slowly. With others."</i>');
CH('Third Spring',{k:'prest',n:3},'Your third Rebirth. The Hollowroot blooms earlier than ever. The Collector, standing at your gate, finally sits down. "I forgot," he says, "that I could."');
CH('Fifteen Transformations',{k:'evo',n:15},'Fifteen friends transformed. The Wild Court stages a pageant retelling your story. It is wildly inaccurate and exactly right. Smolder is played by a very tall hen.');
CH('Twenty-Seven Banners',{k:'reg',n:27},'Twenty-seven regions. The Collector opens the Ledger and shows you the first page. It reads: <i>"Borrowed: one winter, to keep a kingdom warm. Owed: everything."</i> He closes it. His hands tremble.');
CH('Tales Told',{k:'tale',n:14},'Fourteen tales decided. You have become, the Hollowroot says, <i>"a person who is known by what they chose, rather than what they were given."</i>');
CH('Level One Ninety',{k:'lvl',n:190},'Level 190. The edge of the System itself. Beyond the final level, the Hollowroot says, there is no more number. Only the work. The work, you realize, is what you wanted anyway.');
CH('Thirty-Eight Friends',{k:'cre',n:38},'Thirty-eight creatures. Even the shy ones. A single empty place remains in the orchard, reserved for someone yet to come. Nobody has asked. Everyone is waiting.');
CH('The Evergreen Heart',{k:'reg',n:30},'All thirty regions. The map is entirely your color. The Hollowroot tells you: <i>"I am the whole map now. And I am still afraid of being cut down."</i> You promise to protect it. You mean it.');
CH('A Worldseed',{k:'asc',n:1},'You Ascend. A single golden seed lies in your palm. The Hollowroot: <i>"Plant it. Not for me. For the next Warden. And the one after. That is what it means to be alive."</i>');
CH('Level Two Hundred',{k:'lvl',n:200},'Level 200. The System goes silent for a very long time. Then: <i>"Warden. There are no more levels. There is only what you do next."</i> It adds, quietly: <i>"Thank you for the jokes."</i>');
CH('The Complete Menagerie',{k:'cre',n:CRS.length},'Every creature in the realm is yours. The empty place in the orchard fills, at last, with a small, round, ordinary dog. It looks at you, wags its tail once, and falls asleep. The Hollowroot hums. The saga of the Warden has an end, and an after, and a long, green, unfinishing spring.');
