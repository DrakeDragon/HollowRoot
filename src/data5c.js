'use strict';
// ===== part 5c: creature buildings, Beastlore tech, 10 new regions =====
civic('stable','Beast Stable','🐴',2,2.4,[['wood',1],['food',.6]],'cul','Creature bonding speed +3% each.',{t:'bond',v:1.03},1.2);
civic('aviary','Aviary of Wings','🕊️',4,4.7,[['wood',1],['stone',.5],['gold',.3]],'cul','Encounter luck +2% each.',{t:'crLuck',v:.02},1.2);
civic('menagerie','Grand Menagerie','🦁',5,5.7,[['stone',1],['gold',.6],['food',.6]],'cul','Creature boon power +0.4% each (diminishing).',{t:'crMul',v:1.004},1.22);
civic('lodge',"Beastmaster's Lodge",'🏕️',6,6.7,[['wood',1],['gold',.5],['mana',.3]],'cul','Creature slots +1 per 10.',{t:'crSlots',v:.1},1.3);
// ---- Beastlore research branch ----
(function(){
 const names=['Animal Husbandry','Stable Craft',"Whisperer's Lore",'Gentle Taming','Heart-Bond','Wild Covenant'];
 const effs=[[ea('crLuck',.1),ea('bond',1.2)],[ea('crSlots',1)],[ea('bond',1.4),ea('crMul',1.1)],[ea('crLuck',.2),ea('crSlots',1)],[ea('crMul',1.25)],[ea('crMul',1.4),ea('crSlots',1)]];
 const resn=['food','food','gold','gold','mana','mana'];
 for(let k=1;k<=6;k++){
  const era=k+1;
  _t({id:'bea'+k,br:'bea',tier:k,n:names[k-1],i:'🐾',era,cost:techCost(era,resn[k-1]),time:TTIME[k-1],eff:effs[k-1],pil:'cul',
   req:k>1?['bea'+(k-1)]:[],d:effs[k-1].map(effText).join(', ')});
 }
 BRANCHES.push({id:'bea',n:'Beastlore',i:'🐾'});
})();
// ---- 10 new regions (indices 20-29) ----
_r('Rootwake Deep',7,'🌱',[{t:'mulAll',v:1.12},{t:'mulRes',res:'wood',v:1.8}],'Where the roots go to think.');
_r('Gloamfen Reach',7,'🌑',[{t:'mulRes',res:'mana',v:1.8},{t:'spellDur',v:1.2}],'The fen, but meaner.');
_r('Clockwork Ruins',7,'⚙️',[{t:'rSpeed',v:1.6},{t:'xp',v:1.3}],'Old gears still tick. Nobody knows why.');
_r('Bonecrown Steppe',7,'🏜️',[{t:'armyMul',v:1.5},{t:'raidLoot',v:1.4}],'A crown made of someone enormous.');
_r('Silverleaf Archipelago',7,'🏝️',[{t:'mulRes',res:['gold','food'],v:1.8}],'Islands that glitter like coins.');
_r('Hollow Between Gate',7,'🌀',[{t:'mulAll',v:1.15},{t:'crSlots',v:1}],'A door between what is and what might be.');
_r('Tidebloom Sea',7,'🌊',[{t:'mulRes',res:'food',v:2},{t:'popMul',v:1.2}],'The sea blooms in spring, and so do you.');
_r('Wyrmrest Spires',7,'🗻',[{t:'armyMul',v:1.6},{t:'raidDef',v:1.4}],'Where old dragons nap.');
_r('The Last Orchard',7,'🍎',[{t:'mulAll',v:1.2},{t:'crMul',v:1.15}],'The final harvest is also the first.');
_r('Evergreen Heart',7,'💚',[{t:'mulAll',v:1.5},{t:'gain',v:1.3}],'The place the Hollowroot dreams of.');
