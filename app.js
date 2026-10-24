'use strict';
const PRIZES = 4;
const TYPE = {
  F:{n:'Fire',     g:'M12 2.5c.6 3.4 4.8 5.6 4.8 10.6a4.8 4.8 0 0 1-9.6 0c0-2.6 1.6-4 2-6.4 1.4 1 2.4 2.6 2.4 4.4 1.2-2.4 1.4-5.6.4-8.6z'},
  W:{n:'Water',    g:'M12 3C9.2 7.8 6 11 6 15a6 6 0 0 0 12 0c0-4-3.2-7.2-6-12z'},
  G:{n:'Grass',    g:'M5 19C5 10.5 10.5 5 20 4c-.6 9.5-6 15-15 15zM5 19l8-8-1.2-.2z'},
  L:{n:'Lightning',g:'M13.5 2 5 13.5h6L10 22l9-12h-6.2z'},
  C:{n:'Colorless',g:'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z'}
};
const DEF = {
  cindlet:{kind:'pokemon',name:'Cindlet',stage:'Basic',type:'F',hp:60,weak:'W',retreat:1,
    attacks:[{name:'Ember Nip',cost:['F'],dmg:20}],art:{rx:13,ry:12,feat:'ears'}},
  pyrrox:{kind:'pokemon',name:'Pyrrox',stage:'Stage 1',from:'Cindlet',type:'F',hp:110,weak:'W',retreat:2,
    attacks:[{name:'Flare Rush',cost:['F','C'],dmg:60},{name:'Kindle Burst',cost:['F','F','C'],dmg:100,text:'Discard a Fire Energy from this Pokémon.',fx:'discardF'}],art:{rx:20,ry:17,feat:'ears'}},
  magmaw:{kind:'pokemon',name:'Magmaw ex',ex:true,stage:'Basic',type:'F',hp:190,weak:'W',retreat:3,
    attacks:[{name:'Scorch',cost:['F','C'],dmg:40},{name:'Magma Surge',cost:['F','F','F'],dmg:160,text:'This Pokémon also does 30 damage to itself.',fx:'self30'}],art:{rx:25,ry:19,feat:'spikes'}},
  puffkin:{kind:'pokemon',name:'Puffkin',stage:'Basic',type:'C',hp:70,weak:'L',retreat:1,
    ability:{name:'Tailwind Scout',text:'Once during your turn, if this Pokémon is on your Bench, you may draw a card.'},
    attacks:[{name:'Gust Tackle',cost:['C','C'],dmg:30}],art:{rx:18,ry:15,feat:'tuft'}},
  budling:{kind:'pokemon',name:'Budling',stage:'Basic',type:'G',hp:60,weak:'F',retreat:1,
    attacks:[{name:'Vine Whip',cost:['G'],dmg:20}],art:{rx:12,ry:11,feat:'leaf'}},
  thornoak:{kind:'pokemon',name:'Thornoak',stage:'Stage 1',from:'Budling',type:'G',hp:120,weak:'F',resist:'W',retreat:3,
    attacks:[{name:'Bramble Lash',cost:['G','C'],dmg:50},{name:'Toxic Thorn',cost:['G','G','C'],dmg:60,text:`Your opponent's Active Pokémon is now Poisoned.`,fx:'poison'}],art:{rx:22,ry:19,feat:'spikes'}},
  ripplet:{kind:'pokemon',name:'Ripplet',stage:'Basic',type:'W',hp:70,weak:'L',retreat:1,
    attacks:[{name:'Bubble Shot',cost:['W','C'],dmg:40}],art:{rx:16,ry:12,feat:'fin'}},
  stag:{kind:'pokemon',name:'Verdant Stag ex',ex:true,stage:'Basic',type:'G',hp:180,weak:'F',retreat:2,
    attacks:[{name:'Antler Charge',cost:['G','C'],dmg:50},{name:'Forest Fury',cost:['G','G','C'],dmg:140}],art:{rx:23,ry:18,feat:'antlers'}},
  flintkit:{kind:'pokemon',name:'Flintkit',stage:'Basic',type:'F',hp:70,weak:'W',retreat:1,
    attacks:[{name:'Spark Bite',cost:['F'],dmg:10,plus:true,text:'Flip a coin. If heads, this attack does 20 more damage.',fx:'flip20'}],art:{rx:15,ry:11,feat:'spikes'}},
  forgehound:{kind:'pokemon',name:'Forgehound',stage:'Stage 1',from:'Flintkit',type:'F',hp:120,weak:'W',retreat:2,
    attacks:[{name:'Hot Fang',cost:['F','C'],dmg:50},{name:'Furnace Charge',cost:['F','F','C'],dmg:40,plus:true,text:'This attack does 20 more damage for each Fire Energy attached to this Pokémon.',fx:'moreF'}],art:{rx:21,ry:16,feat:'ears'}},
  tidalisk:{kind:'pokemon',name:'Tidalisk',stage:'Stage 1',from:'Ripplet',type:'W',hp:120,weak:'L',retreat:2,
    attacks:[{name:'Aqua Lash',cost:['W','C'],dmg:60},{name:'Restoring Tide',cost:['W','W','C'],dmg:90,text:'Heal 30 damage from this Pokémon.',fx:'heal30'}],art:{rx:21,ry:14,feat:'fin'}},
  pebbleshell:{kind:'pokemon',name:'Pebbleshell',stage:'Basic',type:'W',hp:90,weak:'L',retreat:2,
    attacks:[{name:'Pinch',cost:['W'],dmg:20},{name:'Shell Bash',cost:['W','C','C'],dmg:60}],art:{rx:19,ry:12,feat:'spikes'}},
  sporelet:{kind:'pokemon',name:'Sporelet',stage:'Basic',type:'G',hp:50,weak:'F',retreat:1,
    attacks:[{name:'Spore Puff',cost:['G'],dmg:10,text:`Your opponent's Active Pokémon is now Poisoned.`,fx:'poison'}],art:{rx:12,ry:12,feat:'leaf'}},
  mycolord:{kind:'pokemon',name:'Mycolord',stage:'Stage 1',from:'Sporelet',type:'G',hp:110,weak:'F',retreat:2,
    attacks:[{name:'Toxic Cloud',cost:['G'],dmg:20,text:`Your opponent's Active Pokémon is now Poisoned.`,fx:'poison'},{name:'Fungal Crush',cost:['G','G','C'],dmg:60,plus:true,text:`If your opponent's Active Pokémon is Poisoned, this attack does 60 more damage.`,fx:'poisonBonus'}],art:{rx:21,ry:18,feat:'leaf'}},
  zappup:{kind:'pokemon',name:'Zappup',stage:'Basic',type:'L',hp:60,weak:'G',retreat:1,
    attacks:[{name:'Static Nip',cost:['L'],dmg:10,text:`Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed.`,fx:'flipPara'}],art:{rx:13,ry:11,feat:'ears'}},
  voltwolf:{kind:'pokemon',name:'Voltwolf',stage:'Stage 1',from:'Zappup',type:'L',hp:110,weak:'G',retreat:1,
    attacks:[{name:'Thunder Fang',cost:['L','C'],dmg:40,text:`Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed.`,fx:'flipPara'},{name:'Volt Rush',cost:['L','L','C'],dmg:110,text:'This Pokémon also does 20 damage to itself.',fx:'self20'}],art:{rx:20,ry:15,feat:'ears'}},
  stormwing:{kind:'pokemon',name:'Stormwing ex',ex:true,stage:'Basic',type:'L',hp:180,weak:'G',retreat:2,
    attacks:[{name:'Gale Shock',cost:['L','C'],dmg:50},{name:'Tempest Rain',cost:['L','L','C'],dmg:120,text:`This attack also does 10 damage to each of your opponent's Benched Pokémon.`,fx:'bench10'}],art:{rx:24,ry:16,feat:'antlers'}},
  burrowbun:{kind:'pokemon',name:'Burrowbun',stage:'Basic',type:'C',hp:60,weak:'L',retreat:1,
    attacks:[{name:'Dig Up',cost:['C'],dmg:10,text:'Draw a card.',fx:'draw1'},{name:'Quick Kick',cost:['C','C'],dmg:30}],art:{rx:15,ry:13,feat:'ears'}},
  ironhorn:{kind:'pokemon',name:'Ironhorn',stage:'Basic',type:'C',hp:110,weak:'L',retreat:3,
    attacks:[{name:'Horn Rush',cost:['C','C','C'],dmg:70}],art:{rx:22,ry:15,feat:'spikes'}},
  cinderbat:{kind:'pokemon',name:'Cinderbat',stage:'Basic',type:'F',hp:50,weak:'W',retreat:1,
    attacks:[{name:'Bite',cost:['C'],dmg:10},{name:'Ember Dive',cost:['F','C'],dmg:30}],art:{rx:13,ry:11,feat:'ears'}},
  blazewing:{kind:'pokemon',name:'Blazewing',stage:'Stage 1',from:'Cinderbat',type:'F',hp:100,weak:'W',retreat:1,
    attacks:[{name:'Flare Peck',cost:['F'],dmg:30},{name:'Scorching Dive',cost:['F','F','C'],dmg:80,text:`This attack also does 30 damage to your opponent's Benched Pokémon with the least HP left.`,fx:'snipe30'}],art:{rx:20,ry:14,feat:'ears'}},
  scorchtoise:{kind:'pokemon',name:'Scorchtoise',stage:'Basic',type:'F',hp:120,weak:'W',retreat:3,
    attacks:[{name:'Shell Bump',cost:['C','C'],dmg:30},{name:'Magma Ram',cost:['F','F','C','C'],dmg:120}],art:{rx:23,ry:15,feat:'spikes'}},
  kindlemoth:{kind:'pokemon',name:'Kindlemoth',stage:'Basic',type:'F',hp:60,weak:'W',retreat:1,
    attacks:[{name:'Dazzle Dust',cost:['F'],dmg:10,text:`Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed.`,fx:'flipPara'}],art:{rx:14,ry:11,feat:'tuft'}},
  drizzlet:{kind:'pokemon',name:'Drizzlet',stage:'Basic',type:'W',hp:60,weak:'L',retreat:1,
    attacks:[{name:'Rain Splash',cost:['W'],dmg:20}],art:{rx:15,ry:11,feat:'tuft'}},
  monsoonray:{kind:'pokemon',name:'Monsoonray',stage:'Stage 1',from:'Drizzlet',type:'W',hp:110,weak:'L',retreat:1,
    attacks:[{name:'Tidal Glide',cost:['W','C'],dmg:50},{name:'Storm Surge',cost:['W','W','C'],dmg:40,plus:true,text:'This attack does 20 more damage for each Water Energy attached to this Pokémon.',fx:'moreType'}],art:{rx:24,ry:11,feat:'fin'}},
  coralhorn:{kind:'pokemon',name:'Coralhorn',stage:'Basic',type:'W',hp:80,weak:'L',retreat:1,
    attacks:[{name:'Reef Jab',cost:['W','C'],dmg:30,text:`Discard an Energy from your opponent's Active Pokémon.`,fx:'discardOppE'}],art:{rx:13,ry:15,feat:'antlers'}},
  leviathorn:{kind:'pokemon',name:'Leviathorn ex',ex:true,stage:'Basic',type:'W',hp:200,weak:'L',retreat:3,
    attacks:[{name:'Undertow',cost:['W','C'],dmg:60},{name:'Abyssal Crush',cost:['W','W','C','C'],dmg:160}],art:{rx:25,ry:17,feat:'spikes'}},
  thistlit:{kind:'pokemon',name:'Thistlit',stage:'Basic',type:'G',hp:60,weak:'F',retreat:1,
    attacks:[{name:'Prickle',cost:['G'],dmg:20}],art:{rx:14,ry:12,feat:'spikes'}},
  brambleboar:{kind:'pokemon',name:'Brambleboar',stage:'Stage 1',from:'Thistlit',type:'G',hp:120,weak:'F',retreat:2,
    attacks:[{name:'Thorn Charge',cost:['G','C'],dmg:50},{name:'Bramble Rampage',cost:['G','G','C'],dmg:40,plus:true,text:'This attack does 10 more damage for each 10 damage on this Pokémon.',fx:'rage'}],art:{rx:22,ry:16,feat:'spikes'}},
  petalmoth:{kind:'pokemon',name:'Petalmoth',stage:'Basic',type:'G',hp:70,weak:'F',retreat:1,
    attacks:[{name:'Soothing Scent',cost:['G'],dmg:10,text:'Heal 30 damage from this Pokémon.',fx:'heal30'},{name:'Petal Gust',cost:['G','C'],dmg:30}],art:{rx:15,ry:12,feat:'tuft'}},
  mosswisp:{kind:'pokemon',name:'Mosswisp',stage:'Basic',type:'G',hp:80,weak:'F',retreat:1,
    attacks:[{name:'Wisp Tap',cost:['G'],dmg:10,text:'Draw a card.',fx:'draw1'},{name:'Sap Drain',cost:['G','G'],dmg:40,text:'Heal 30 damage from this Pokémon.',fx:'heal30'}],art:{rx:15,ry:14,feat:'leaf'}},
  coilbug:{kind:'pokemon',name:'Coilbug',stage:'Basic',type:'L',hp:50,weak:'G',retreat:1,
    attacks:[{name:'Charge Bite',cost:['L'],dmg:20}],art:{rx:14,ry:11,feat:'antlers'}},
  teslamander:{kind:'pokemon',name:'Teslamander',stage:'Stage 1',from:'Coilbug',type:'L',hp:110,weak:'G',retreat:2,
    attacks:[{name:'Spark Tail',cost:['L','C'],dmg:50,text:`Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed.`,fx:'flipPara'},{name:'Overload',cost:['L','L','C'],dmg:30,plus:true,text:'This attack does 20 more damage for each Lightning Energy attached to this Pokémon.',fx:'moreType'}],art:{rx:21,ry:13,feat:'fin'}},
  ampereel:{kind:'pokemon',name:'Ampereel',stage:'Basic',type:'L',hp:80,weak:'G',retreat:2,
    attacks:[{name:'Static Field',cost:['L','C'],dmg:30,text:`This attack also does 10 damage to each of your opponent's Benched Pokémon.`,fx:'bench10'}],art:{rx:20,ry:11,feat:'fin'}},
  fluxfly:{kind:'pokemon',name:'Fluxfly',stage:'Basic',type:'L',hp:50,weak:'G',retreat:0,
    attacks:[{name:'Double Zap',cost:['L'],dmg:20,mult:true,text:'Flip 2 coins. This attack does 20 damage for each heads.',fx:'flip2x20'}],art:{rx:12,ry:11,feat:'tuft'}},
  scrapjay:{kind:'pokemon',name:'Scrapjay',stage:'Basic',type:'C',hp:60,weak:'L',retreat:1,
    attacks:[{name:'Peck',cost:['C'],dmg:10},{name:'Pilfer',cost:['C','C'],dmg:20,text:'Draw a card.',fx:'draw1'}],art:{rx:13,ry:12,feat:'tuft'}},
  gustcrow:{kind:'pokemon',name:'Gustcrow',stage:'Stage 1',from:'Scrapjay',type:'C',hp:100,weak:'L',retreat:1,
    attacks:[{name:'Gale Strike',cost:['C','C'],dmg:50},{name:'Squad Swoop',cost:['C','C','C'],dmg:30,plus:true,text:'This attack does 10 more damage for each of your Benched Pokémon.',fx:'perBench10'}],art:{rx:19,ry:14,feat:'tuft'}},
  lumberbear:{kind:'pokemon',name:'Lumberbear',stage:'Basic',type:'C',hp:130,weak:'L',retreat:3,
    attacks:[{name:'Heavy Swipe',cost:['C','C','C'],dmg:60},{name:'Timber Slam',cost:['C','C','C','C'],dmg:100}],art:{rx:23,ry:18,feat:'ears'}},
  mimicat:{kind:'pokemon',name:'Mimicat',stage:'Basic',type:'C',hp:70,weak:'L',retreat:1,
    attacks:[{name:'Pounce',cost:['C'],dmg:10,plus:true,text:'Flip a coin. If heads, this attack does 20 more damage.',fx:'flip20'},{name:'Copy Claw',cost:['C','C'],dmg:30}],art:{rx:15,ry:12,feat:'ears'}},
  potion:{kind:'item',name:'Potion',text:'Heal 30 damage from 1 of your Pokémon.'},
  healingberry:{kind:'item',name:'Healing Berry',text:'Heal 40 damage from your Active Pokémon.'},
  antidoteherb:{kind:'item',name:'Antidote Herb',text:'Heal 20 damage from your Active Pokémon and remove all Special Conditions from it.'},
  greatball:{kind:'item',name:'Great Ball',text:'Look at the top 7 cards of your deck. Put a Pokémon you find there into your hand, then shuffle your deck.'},
  retriever:{kind:'item',name:'Pokémon Retriever',text:'Put a Pokémon from your discard pile into your hand.'},
  energysearch:{kind:'item',name:'Energy Search',text:'Search your deck for a basic Energy card, reveal it, and put it into your hand. Then shuffle your deck.'},
  sparebattery:{kind:'item',name:'Spare Battery',text:'Attach a basic Energy card from your discard pile to 1 of your Benched Pokémon.'},
  lecture:{kind:'supporter',name:`Professor's Lecture`,text:'Discard your hand and draw 7 cards.'},
  fieldmedic:{kind:'supporter',name:'Field Medic',text:'Heal 30 damage from each of your Pokémon.'},
  swappartner:{kind:'supporter',name:'Swap Partner',text:'Each player shuffles their hand into their deck. Then you draw 5 cards and your opponent draws 4 cards.'},
  rushorders:{kind:'supporter',name:'Rush Orders',text:'Search your deck for an Evolution card, reveal it, and put it into your hand. Then shuffle your deck.'},
  superpotion:{kind:'item',name:'Super Potion',text:'Heal 60 damage from 1 of your Pokémon. If you healed any damage, discard an Energy from that Pokémon.'},
  energyretrieval:{kind:'item',name:'Energy Retrieval',text:'Put up to 2 basic Energy cards from your discard pile into your hand.'},
  peptalk:{kind:'supporter',name:'Pep Talk',text:'Draw cards until you have 6 cards in your hand.'},
  lurewhistle:{kind:'supporter',name:'Lure Whistle',text:`Switch 1 of your opponent's Benched Pokémon with their Active Pokémon.`},
  switch:{kind:'item',name:'Switch',text:'Switch your Active Pokémon with 1 of your Benched Pokémon.'},
  fieldguide:{kind:'item',name:'Field Guide',text:'Search your deck for a Basic Pokémon, reveal it, and put it into your hand. Then shuffle your deck.'},
  research:{kind:'supporter',name:'Research Lead',text:'Draw 3 cards.'},
  fireE:{kind:'energy',name:'Fire Energy',type:'F'},
  grassE:{kind:'energy',name:'Grass Energy',type:'G'},
  waterE:{kind:'energy',name:'Water Energy',type:'W'},
  lightningE:{kind:'energy',name:'Lightning Energy',type:'L'}
};
for (const k in DEF) DEF[k].id = k;
/* Four 30-card decks. Weakness runs in a loop: Fire beats Grass, Grass beats Lightning, Lightning beats Water, Water beats Fire. */
const DECKS = {
  blaze:{name:'Blaze', type:'F', star:'pyrrox', blurb:'Fire. Hard hitters that grow stronger with every Energy.',
    list:{cindlet:2,pyrrox:2,magmaw:1,flintkit:2,forgehound:1,cinderbat:2,blazewing:1,scorchtoise:1,kindlemoth:1,potion:1,switch:1,fieldguide:1,greatball:1,research:1,peptalk:1,rushorders:1,energyretrieval:1,fireE:9}},
  thicket:{name:'Thicket', type:'G', star:'stag', blurb:'Grass. Poison wears opponents down, then Mycolord finishes them.',
    list:{budling:2,thornoak:1,sporelet:2,mycolord:2,stag:1,thistlit:2,brambleboar:1,petalmoth:1,mosswisp:1,potion:1,healingberry:1,fieldmedic:1,lurewhistle:1,fieldguide:1,research:1,rushorders:1,antidoteherb:1,grassE:9}},
  tide:{name:'Tide', type:'W', star:'leviathorn', blurb:'Water. Sturdy Pokémon that heal, strip Energy and outlast.',
    list:{ripplet:2,tidalisk:2,pebbleshell:1,drizzlet:2,monsoonray:1,coralhorn:2,leviathorn:1,lumberbear:1,superpotion:1,switch:1,fieldguide:1,greatball:1,research:1,lecture:1,energysearch:1,sparebattery:1,waterE:10}},
  storm:{name:'Storm', type:'L', star:'stormwing', blurb:'Lightning. Fast attackers that Paralyze and spread damage.',
    list:{zappup:2,voltwolf:1,stormwing:1,coilbug:2,teslamander:1,ampereel:1,fluxfly:2,scrapjay:2,gustcrow:1,potion:1,lurewhistle:1,switch:1,fieldguide:1,research:1,swappartner:1,energyretrieval:1,sparebattery:1,lightningE:9}},
  wild:{name:'Wild', type:'C', star:'lumberbear', blurb:'Colorless. Any Energy powers them, so they are never stuck.',
    list:{puffkin:2,burrowbun:2,ironhorn:2,mimicat:2,lumberbear:1,scrapjay:2,gustcrow:1,potion:1,retriever:1,switch:1,greatball:1,research:1,peptalk:1,swappartner:1,fieldmedic:1,fireE:5,waterE:5}}
};
const COUNTER = {F:'W', W:'L', L:'G', G:'F', C:'L'};
const DIFFS = {
  easy:{name:'Easy', blurb:'Makes mistakes and sometimes forgets to attack. Good for your first games.'},
  normal:{name:'Normal', blurb:'Plays the basics well: attaches every turn, evolves, and takes Knock Outs.'},
  hard:{name:'Hard', blurb:'Plans each turn, sets up Knock Outs and retreats out of danger. With a random deck, it picks the type yours is weak to.'}
};

/* ME is the player index this device controls: 0 offline and for the host, 1 for a guest. */
let UID = 0, GEN = 0, S, ME = 0, MENU = true, MENU_VIEW = 'home', GALLERY = 'all';
function loadRival(){ const d={deck:'blaze',diff:'normal',opp:'random'}; try { return Object.assign(d, JSON.parse(localStorage.getItem('ba-rival')||'{}')); } catch(e){ return d; } }
const RIVAL = loadRival();
function saveRival(){ try { localStorage.setItem('ba-rival', JSON.stringify(RIVAL)); } catch(e){} }
let rand = Math.random;
function mulberry32(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const mk = id => ({uid:++UID,id});
const D = c => DEF[c.id];
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shuffle = a => { for (let i=a.length-1;i>0;i--){const j=rand()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]} return a; };
const build = list => shuffle(Object.entries(list).flatMap(([id,n]) => Array.from({length:n}, () => mk(id))));
const P = i => S.players[i];
const oppName = () => S.online ? 'Opponent' : 'Rival';
const them = () => S.online ? 'Your opponent' : 'The Rival';
const who = pi => pi===ME ? 'You' : oppName();
const topC = m => D(m.stack[m.stack.length-1]);
const hpLeft = m => Math.max(0, topC(m).hp - m.damage);
const inPlay = p => [p.active, ...p.bench].filter(Boolean);
const findMon = (p,uid) => inPlay(p).find(m => m.uid===uid);
const take = (p,uid) => { const i=p.hand.findIndex(c=>c.uid===uid); return i<0 ? null : p.hand.splice(i,1)[0]; };
const isBasic = c => D(c).kind==='pokemon' && D(c).stage==='Basic';
const ev = x => S.events.push(x);

function newPlayer(name, deck, isAI){
  return {name,isAI,deck,hand:[],discard:[],prizes:[],active:null,bench:[],turnsTaken:0,energyAttached:false,supporterPlayed:false,retreated:false};
}
function mkMon(card){ return {uid:card.uid,stack:[card],energy:[],damage:0,turnPlayed:S.turn,poisoned:false,abilityTurn:-1}; }
function log(m, w){ S.log.unshift({m,w}); if (S.log.length>80) S.log.pop(); }

/* ---------- art ---------- */
function eIcon(t){ return `<span class="ei t-${t}" title="${TYPE[t].n}"><svg viewBox="0 0 24 24"><path d="${TYPE[t].g}"/></svg></span>`; }
const ART = Object.keys(DEF);
function art(id){
  const svg = artSvg(id);
  if (!ART.includes(id)) return svg;
  return `<span class="art-wrap">${svg}<img src="art/${id}.webp" alt="" loading="lazy" decoding="async" onerror="this.remove()"></span>`;
}
function artSvg(id){
  const d = DEF[id];
  const bg = `<rect width="100" height="60" fill="var(--t-soft)"/><circle cx="84" cy="8" r="22" fill="var(--t)" opacity=".16"/>`;
  if (d.kind==='energy') return `<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}<circle cx="50" cy="30" r="21" fill="var(--t)"/><g transform="translate(36 16) scale(1.17)"><path d="${TYPE[d.type].g}" fill="#fff"/></g></svg>`;
  if (d.kind!=='pokemon'){
    const ink = '#2a2f36';
    const icon = {
      potion:`<path d="M44 9h12v13l13 21a7 7 0 0 1-6 10H37a7 7 0 0 1-6-10l13-21z" fill="var(--card)" stroke="${ink}" stroke-width="2.4"/><path d="M35 40h30l3 5a5 5 0 0 1-4.5 7h-27A5 5 0 0 1 32 45z" fill="var(--t)"/><path d="M50 26v10M45 31h10" stroke="${ink}" stroke-width="2.4"/>`,
      switch:`<path d="M24 22h46l-9-8M76 38H30l9 8" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
      fieldguide:`<path d="M26 12h22a4 4 0 0 1 4 4v34a4 4 0 0 0-4-4H26zM74 12H52v38a4 4 0 0 1 4-4h18z" fill="var(--card)" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="63" cy="27" r="5" fill="none" stroke="var(--t)" stroke-width="2.6"/><path d="M66.5 30.5 70 34" stroke="var(--t)" stroke-width="2.6"/><path d="M31 22h14M31 28h14M31 34h10" stroke="${ink}" stroke-width="2"/>`,
      research:`<rect x="34" y="10" width="32" height="42" rx="3" fill="var(--card)" stroke="${ink}" stroke-width="2.4"/><rect x="43" y="7" width="14" height="7" rx="2" fill="var(--t)"/><path d="M40 24h20M40 31h20M40 38h13" stroke="${ink}" stroke-width="2.2"/>`
    }[id];
    return `<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}${icon}</svg>`;
  }
  const {rx,ry,feat} = d.art, cx = 50, cy = 51 - ry, er = Math.max(2.4, ry*.19), ex = rx*.38, ey = cy - ry*.12;
  let f = '';
  if (feat==='ears') f = `<path d="M${cx-rx*.75} ${cy-ry*.45} l${-rx*.2} ${-ry*.95} l${rx*.6} ${ry*.5}zM${cx+rx*.75} ${cy-ry*.45} l${rx*.2} ${-ry*.95} l${-rx*.6} ${ry*.5}z" fill="var(--t)"/>`;
  if (feat==='spikes') f = [-.55,0,.55].map(k=>`<path d="M${cx+k*rx-5} ${cy-ry*.82+Math.abs(k)*6} l5 -11 l5 11z" fill="color-mix(in srgb,var(--t) 70%,#000)"/>`).join('');
  if (feat==='tuft') f = [-.45,0,.45].map(k=>`<circle cx="${cx+k*rx}" cy="${cy-ry*.9}" r="${ry*.35}" fill="color-mix(in srgb,var(--t) 70%,#fff)"/>`).join('');
  if (feat==='leaf') f = `<path d="M${cx} ${cy-ry+1} c-2 -6 2 -11 10 -12 c-1 8 -5 12 -10 12z" fill="color-mix(in srgb,var(--t) 75%,#fff)"/><path d="M${cx} ${cy-ry+1} v-5" stroke="var(--t)" stroke-width="2"/>`;
  if (feat==='fin') f = `<path d="M${cx-6} ${cy-ry+3} q6 -16 14 -10 q-4 4 -2 12z" fill="color-mix(in srgb,var(--t) 70%,#fff)"/>`;
  if (feat==='antlers') f = [-1,1].map(s=>`<path d="M${cx+s*rx*.45} ${cy-ry*.75} l${s*6} -12 m${-s*3} 6 l${s*-6} -6 m${s*6} 0 l${s*7} -4" stroke="color-mix(in srgb,var(--t) 55%,#5b3a1a)" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('');
  const eyes = [-1,1].map(s=>`<circle cx="${cx+s*ex}" cy="${ey}" r="${er}" fill="#fff"/><circle cx="${cx+s*ex+.5}" cy="${ey+.4}" r="${er*.55}" fill="#1d1d1d"/>`).join('');
  const ring = d.ex ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx+6}" ry="${ry+6}" fill="none" stroke="var(--t)" stroke-width="1.6" stroke-dasharray="2 3" opacity=".7"/>` : '';
  return `<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}<ellipse cx="50" cy="55" rx="34" ry="5" fill="var(--t)" opacity=".22"/>${ring}${f}<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="var(--t)"/><ellipse cx="${cx}" cy="${cy+ry*.4}" rx="${rx*.55}" ry="${ry*.4}" fill="#fff" opacity=".22"/>${eyes}</svg>`;
}

/* ---------- full card ---------- */
function fullCard(id){
  const d = DEF[id];
  if (d.kind==='pokemon') return `
  <div class="fc t-${d.type}">
    <div class="fc-head">
      <span class="part" data-part="stage"><span class="stage">${d.stage}</span>${d.from?`<span class="from">Evolves from ${d.from}</span>`:''}</span>
      <span class="part fc-name" data-part="name">${d.name}</span>
      <span class="part fc-hp" data-part="hp"><small>HP</small>${d.hp}</span>
      <span class="part" data-part="type">${eIcon(d.type)}</span>
    </div>
    <div class="fc-art">${art(id)}</div>
    ${d.ability?`<div class="part fc-ability" data-part="ability"><span class="ab-tag">Ability</span> <b>${d.ability.name}</b><p>${d.ability.text}</p></div>`:''}
    ${d.attacks.map(a=>`<div class="fc-atk">
      <span class="part cost" data-part="cost">${a.cost.map(eIcon).join('')}</span>
      <span class="atk-main"><b>${a.name}</b>${a.text?`<span class="part atk-text" data-part="text">${a.text}</span>`:''}</span>
      <span class="part dmg" data-part="damage">${a.dmg||''}${a.mult?'×':''}${a.plus?'+':''}</span></div>`).join('')}
    ${d.ex?`<div class="part fc-rule" data-part="rule"><b>Pokémon ex rule:</b> When your Pokémon ex is Knocked Out, your opponent takes 2 Prize cards.</div>`:''}
    <div class="fc-foot">
      <span class="part" data-part="weakness"><small>Weakness</small><span class="val">${d.weak?eIcon(d.weak)+'×2':'—'}</span></span>
      <span class="part" data-part="resistance"><small>Resistance</small><span class="val">${d.resist?eIcon(d.resist)+'−30':'—'}</span></span>
      <span class="part" data-part="retreat"><small>Retreat</small><span class="val">${d.retreat?Array(d.retreat).fill(eIcon('C')).join(''):'—'}</span></span>
    </div>
  </div>`;
  if (d.kind==='energy') return `
  <div class="fc t-${d.type}">
    <div class="fc-head"><span class="part kindpill" data-part="kind">Basic Energy</span><span class="part fc-name" data-part="name">${d.name}</span><span class="part" data-part="type">${eIcon(d.type)}</span></div>
    <div class="fc-art">${art(id)}</div>
    <div class="part fc-rule" data-part="rule">Attach 1 Energy card from your hand to 1 of your Pokémon once per turn. It provides 1 ${TYPE[d.type].n} Energy.</div>
  </div>`;
  return `
  <div class="fc t-T">
    <div class="fc-head"><span class="part kindpill" data-part="kind">Trainer · ${d.kind==='item'?'Item':'Supporter'}</span></div>
    <span class="part fc-name" data-part="name">${d.name}</span>
    <div class="fc-art">${art(id)}</div>
    <p class="part fc-text" data-part="text">${d.text}</p>
    <div class="part fc-rule" data-part="rule">${d.kind==='item'?'You may play any number of Item cards during your turn.':'You may play only 1 Supporter card during your turn.'}</div>
  </div>`;
}

/* ---------- rules ---------- */
function canPay(en, cost){
  const pool = {}; en.forEach(e => { const t=D(e).type; pool[t]=(pool[t]||0)+1; });
  let left = en.length;
  for (const t of cost) if (t!=='C'){ if (!pool[t]) return false; pool[t]--; left--; }
  return left >= cost.filter(t=>t==='C').length;
}
function costText(cost){ const n={}; cost.forEach(t=>n[t]=(n[t]||0)+1); return Object.entries(n).map(([t,k])=>`${k} ${TYPE[t].n}`).join(' + '); }
const ownerOf = m => S.players.find(p => inPlay(p).includes(m));
function bonus(att, def, atk){
  if (atk.fx==='moreF') return 20*att.energy.filter(e=>D(e).type==='F').length;
  if (atk.fx==='moreType') return 20*att.energy.filter(e=>D(e).type===topC(att).type).length;
  if (atk.fx==='poisonBonus' && def && def.poisoned) return 60;
  if (atk.fx==='rage') return att.damage;
  if (atk.fx==='perBench10'){ const o=ownerOf(att); return o ? 10*o.bench.length : 0; }
  return 0;
}
function calcDamage(att, def, atk, extra=0){
  let d = (atk.dmg||0) + bonus(att,def,atk) + extra; const notes = [];
  if (!d || !def) return {d, notes};
  if (topC(def).weak===topC(att).type){ d*=2; notes.push('Weakness ×2'); }
  if (topC(def).resist===topC(att).type){ d=Math.max(0,d-30); notes.push('Resistance −30'); }
  return {d, notes};
}
function whyNotBench(pi,c){
  const p=P(pi);
  if (S.setup && S.ready[pi]) return 'You already locked in your setup.';
  if (!isBasic(c)) return 'Only Basic Pokémon can be played from your hand. Evolution cards go on top of a Pokémon already in play.';
  if (p.active && p.bench.length>=5) return 'Your Bench is full. You can have at most 5 Benched Pokémon.';
  return '';
}
function whyNotAttach(pi){
  if (S.setup) return `You can't attach Energy during setup.`;
  if (P(pi).energyAttached) return 'You already attached an Energy this turn. You get one attachment per turn.';
  return '';
}
const evoTargets = (pi,c) => inPlay(P(pi)).filter(m => topC(m).name===D(c).from);
function whyNotEvolve(pi,c,m){
  const p=P(pi);
  if (S.setup) return `You can't evolve during setup. Evolution cards wait in your hand until the game starts.`;
  if (p.turnsTaken<2) return `Neither player can evolve on their first turn.`;
  if (m && topC(m).name!==D(c).from) return `${D(c).name} evolves from ${D(c).from}, not ${topC(m).name}.`;
  if (m && m.turnPlayed>=S.turn) return `${topC(m).name} came into play or evolved this turn. Wait until your next turn to evolve it.`;
  return '';
}
function whyNotTrainer(pi,c){
  const d=D(c), p=P(pi);
  if (S.setup) return `Trainer cards can't be played during setup.`;
  if (d.kind==='supporter'){
    if (p.supporterPlayed) return 'You already played a Supporter this turn. Only one per turn.';
    if (S.turn===1) return `The player who goes first can't play a Supporter on their first turn.`;
  }
  if ((d.id==='potion'||d.id==='superpotion') && !inPlay(p).some(m=>m.damage>0)) return 'None of your Pokémon have damage to heal.';
  if (d.id==='energyretrieval' && !p.discard.some(c=>D(c).kind==='energy')) return 'There are no Energy cards in your discard pile.';
  if (d.id==='peptalk' && p.hand.length-1>=6) return 'You already have 6 or more cards in your hand.';
  if (d.id==='peptalk' && !p.deck.length) return 'Your deck is empty.';
  if (d.id==='lurewhistle' && !P(1-pi).bench.length) return `Your opponent has no Benched Pokémon to lure out.`;
  if (d.id==='healingberry' && !p.active.damage) return 'Your Active Pokémon has no damage to heal.';
  if (d.id==='antidoteherb' && !p.active.damage && !p.active.poisoned && !p.active.paralyzed) return 'Your Active Pokémon has no damage or Special Conditions.';
  if (d.id==='greatball' && !p.deck.length) return 'Your deck is empty.';
  if (d.id==='retriever' && !p.discard.some(c=>D(c).kind==='pokemon')) return 'There are no Pokémon in your discard pile.';
  if (d.id==='energysearch' && !p.deck.some(c=>D(c).kind==='energy')) return 'There are no Energy cards left in your deck.';
  if (d.id==='sparebattery' && !p.discard.some(c=>D(c).kind==='energy')) return 'There are no Energy cards in your discard pile.';
  if (d.id==='sparebattery' && !p.bench.length) return 'You need a Benched Pokémon to attach the Energy to.';
  if (d.id==='lecture' && !p.deck.length) return 'Your deck is empty.';
  if (d.id==='fieldmedic' && !inPlay(p).some(m=>m.damage>0)) return 'None of your Pokémon have damage to heal.';
  if (d.id==='rushorders' && !p.deck.some(c=>D(c).stage==='Stage 1')) return 'There are no Evolution cards left in your deck.';
  if (d.id==='switch' && !p.bench.length) return 'You need a Benched Pokémon to switch with.';
  if (d.id==='fieldguide' && !p.deck.some(isBasic)) return 'There are no Basic Pokémon left in your deck.';
  if (d.id==='research' && !p.deck.length) return 'Your deck is empty.';
  return '';
}
function whyNotRetreat(pi){
  const p=P(pi), a=p.active;
  if (S.setup) return 'Finish setup first.';
  if (a.paralyzed) return `${topC(a).name} is Paralyzed and can't retreat this turn.`;
  if (p.retreated) return 'You already retreated this turn. You can retreat once per turn.';
  if (!p.bench.length) return 'You need a Benched Pokémon to take its place.';
  if (a.energy.length<topC(a).retreat) return `Retreating ${topC(a).name} costs ${topC(a).retreat} Energy and it has ${a.energy.length}.`;
  return '';
}
function whyNotAttack(pi,i){
  const a=P(pi).active, atk=topC(a).attacks[i];
  if (S.setup) return 'Finish setup first.';
  if (S.turn===1) return `The player who goes first can't attack on their first turn.`;
  if (a.paralyzed) return `${topC(a).name} is Paralyzed and can't attack this turn.`;
  if (!canPay(a.energy, atk.cost)) return `Needs ${costText(atk.cost)} Energy. ${topC(a).name} has ${a.energy.length?costText(a.energy.map(e=>D(e).type)):'none'}.`;
  return '';
}
function whyNotAbility(pi,m){
  if (S.setup) return 'Finish setup first.';
  if (P(pi).active===m) return 'Tailwind Scout only works while this Pokémon is on your Bench.';
  if (m.abilityTurn===S.turn) return 'This Puffkin already used Tailwind Scout this turn.';
  if (!P(pi).deck.length) return 'Your deck is empty.';
  return '';
}

/* ---------- engine actions ---------- */
function doBench(pi,cuid){
  const p=P(pi), c=take(p,cuid), m=mkMon(c);
  if (!p.active){ p.active=m; log(`${who(pi)} put ${S.setup&&pi!==ME?'a Pokémon':D(c).name} in the Active Spot.`,pi); ev('active'); }
  else { p.bench.push(m); log(`${who(pi)} benched ${S.setup&&pi!==ME?'a Pokémon':D(c).name}.`,pi); ev('bench'); }
  return m;
}
function doAttach(pi,cuid,muid){
  const p=P(pi), m=findMon(p,muid), c=take(p,cuid);
  m.energy.push(c); p.energyAttached=true;
  log(`${who(pi)} attached ${D(c).name} to ${topC(m).name}.`,pi); ev('attach');
}
function doEvolve(pi,cuid,muid){
  const p=P(pi), m=findMon(p,muid), c=take(p,cuid), old=topC(m).name;
  m.stack.push(c); m.turnPlayed=S.turn; m.poisoned=m.paralyzed=false;
  log(`${who(pi)} evolved ${old} into ${D(c).name}. It keeps its Energy and damage.`,pi); ev('evolve');
}
function doTrainer(pi,cuid,arg){
  const p=P(pi), c=take(p,cuid), d=D(c);
  p.discard.push(c);
  if (d.kind==='supporter'){ p.supporterPlayed=true; ev('supporter'); }
  if (d.id==='potion'){ const m=findMon(p,arg), h=Math.min(30,m.damage); m.damage-=h; log(`${who(pi)} played Potion and healed ${h} damage from ${topC(m).name}.`,pi); ev('potion'); }
  if (d.id==='switch'){ const k=p.bench.findIndex(m=>m.uid===arg), old=p.active; old.poisoned=old.paralyzed=false; p.active=p.bench[k]; p.bench[k]=old;
    log(`${who(pi)} played Switch. ${topC(p.active).name} is now Active and ${topC(old).name} went to the Bench.`,pi); ev('switch'); }
  if (d.id==='fieldguide'){ const k=p.deck.findIndex(x=>x.id===arg), [b]=p.deck.splice(k,1); p.hand.push(b); shuffle(p.deck);
    log(`${who(pi)} played Field Guide and took ${D(b).name} from the deck.`,pi); ev('item'); }
  if (d.id==='research'){ const n=Math.min(3,p.deck.length); for (let i=0;i<n;i++) p.hand.push(p.deck.pop());
    log(`${who(pi)} played Research Lead and drew ${n} cards.`,pi); }
  if (d.id==='superpotion'){ const m=findMon(p,arg), h=Math.min(60,m.damage); m.damage-=h; let extra='';
    if (h && m.energy.length){ p.discard.push(m.energy.pop()); extra=' and discarded an Energy from it'; }
    log(`${who(pi)} played Super Potion, healed ${h} damage from ${topC(m).name}${extra}.`,pi); ev('potion'); }
  if (d.id==='energyretrieval'){ let n=0; for (let i=p.discard.length-1;i>=0&&n<2;i--) if (D(p.discard[i]).kind==='energy'){ p.hand.push(p.discard.splice(i,1)[0]); n++; }
    log(`${who(pi)} played Energy Retrieval and put ${n} Energy back into their hand.`,pi); }
  if (d.id==='peptalk'){ let n=0; while (p.hand.length<6 && p.deck.length){ p.hand.push(p.deck.pop()); n++; }
    log(`${who(pi)} played Pep Talk and drew ${n} card${n===1?'':'s'}.`,pi); }
  if (d.id==='healingberry'){ const a=p.active, h=Math.min(40,a.damage); a.damage-=h; log(`${who(pi)} played Healing Berry and healed ${h} damage from ${topC(a).name}.`,pi); ev('potion'); }
  if (d.id==='antidoteherb'){ const a=p.active, h=Math.min(20,a.damage); a.damage-=h; a.poisoned=a.paralyzed=false; log(`${who(pi)} played Antidote Herb on ${topC(a).name}: healed ${h} damage and cleared its Special Conditions.`,pi); }
  if (d.id==='greatball'){ const top7=p.deck.slice(-7).reverse(), f=top7.find(c=>D(c).kind==='pokemon');
    if (f){ p.deck.splice(p.deck.indexOf(f),1); p.hand.push(f); } shuffle(p.deck);
    log(f?`${who(pi)} played Great Ball and found ${D(f).name}.`:`${who(pi)} played Great Ball but found no Pokémon in the top 7 cards.`,pi); }
  if (d.id==='retriever' || d.id==='energysearch' || d.id==='rushorders'){
    const src = d.id==='retriever' ? p.discard : p.deck, k=src.map(x=>x.id).lastIndexOf(arg), [c2]=src.splice(k,1); p.hand.push(c2);
    if (src===p.deck) shuffle(p.deck);
    log(`${who(pi)} played ${d.name} and took ${D(c2).name}${src===p.deck?' from the deck':' from the discard pile'}.`,pi); }
  if (d.id==='sparebattery'){ const m=findMon(p,arg), k=p.discard.map(c=>D(c).kind).lastIndexOf('energy'), [e]=p.discard.splice(k,1); m.energy.push(e);
    log(`${who(pi)} played Spare Battery and attached ${D(e).name} to ${topC(m).name}.`,pi); }
  if (d.id==='lecture'){ p.discard.push(...p.hand.splice(0)); const n=Math.min(7,p.deck.length); for (let i=0;i<n;i++) p.hand.push(p.deck.pop());
    log(`${who(pi)} played Professor's Lecture, discarded their hand and drew ${n} cards.`,pi); }
  if (d.id==='fieldmedic'){ inPlay(p).forEach(m=>m.damage=Math.max(0,m.damage-30)); log(`${who(pi)} played Field Medic and healed 30 damage from each of their Pokémon.`,pi); ev('potion'); }
  if (d.id==='swappartner'){ const o=P(1-pi);
    for (const [pl,n] of [[p,5],[o,4]]){ pl.deck.push(...pl.hand.splice(0)); shuffle(pl.deck); for (let i=0;i<n&&pl.deck.length;i++) pl.hand.push(pl.deck.pop()); }
    log(pi===ME?'You played Swap Partner. You drew 5 cards and your opponent drew 4.':`${oppName()} played Swap Partner. They drew 5 cards and you drew 4.`,pi); }
  if (d.id==='lurewhistle'){ const o=P(1-pi), k=o.bench.findIndex(m=>m.uid===arg), old=o.active; old.poisoned=old.paralyzed=false; o.active=o.bench[k]; o.bench[k]=old;
    log(`${who(pi)} played Lure Whistle and pulled ${topC(o.active).name} into the Active Spot.`,pi); ev('lure'); }
}
function doRetreat(pi,buid){
  const p=P(pi), a=p.active, n=topC(a).retreat;
  p.discard.push(...a.energy.splice(a.energy.length-n, n));
  a.poisoned=a.paralyzed=false;
  const k=p.bench.findIndex(m=>m.uid===buid); p.active=p.bench[k]; p.bench[k]=a; p.retreated=true;
  log(`${who(pi)} retreated ${topC(a).name}, discarding ${n} Energy. ${topC(p.active).name} is now Active.`,pi); ev('retreat');
}
function doAbility(pi,muid){
  const p=P(pi), m=findMon(p,muid); m.abilityTurn=S.turn;
  const c=p.deck.pop(); p.hand.push(c);
  log(`${who(pi)} used Tailwind Scout and drew ${pi===ME?D(c).name:'a card'}.`,pi); ev('ability');
}
function doPromote(pi,buid){
  const p=P(pi), k=p.bench.findIndex(m=>m.uid===buid);
  p.active=p.bench.splice(k,1)[0];
  log(`${who(pi)} moved ${topC(p.active).name} into the Active Spot.`,pi);
}
function aiPromote(){
  const p=P(1);
  const best=[...p.bench].sort((a,b)=>(b.energy.length*25+hpLeft(b))-(a.energy.length*25+hpLeft(a)))[0];
  doPromote(1,best.uid);
}
function doAttack(pi,i){
  const p=P(pi), o=P(1-pi), a=p.active, d=o.active, atk=topC(a).attacks[i];
  const flip = () => { const h=rand()<.5; log(`Coin flip: ${h?'heads':'tails'}.`,pi); return h; };
  let extra = atk.fx==='flip20' && flip() ? 20 : 0;
  if (atk.fx==='flip2x20'){ const h=(flip()?1:0)+(flip()?1:0); extra = 20*h - atk.dmg; }
  const r=calcDamage(a,d,atk,extra);
  d.damage+=r.d; S.hit=d.uid;
  log(`${topC(a).name} used ${atk.name} on ${topC(d).name} for ${r.d} damage${r.notes.length?` (${r.notes.join(', ')})`:''}.`,pi);
  if (atk.fx==='self20'){ a.damage+=20; log(`${topC(a).name} also did 20 damage to itself.`,pi); }
  if (atk.fx==='snipe30' && o.bench.length){ const t=[...o.bench].sort((x,y)=>hpLeft(x)-hpLeft(y))[0]; t.damage+=30; log(`${atk.name} also did 30 damage to ${topC(t).name} on the Bench.`,pi); }
  if (atk.fx==='discardOppE' && d.energy.length){ o.discard.push(d.energy.pop()); log(`${atk.name} discarded an Energy from ${topC(d).name}.`,pi); }
  if (atk.fx==='heal30'){ const h=Math.min(30,a.damage); a.damage-=h; if (h) log(`${topC(a).name} healed ${h} damage.`,pi); }
  if (atk.fx==='bench10' && o.bench.length){ o.bench.forEach(m=>m.damage+=10); log(`${atk.name} also did 10 damage to each of ${pi===ME?'your opponent\'s':'your'} Benched Pokémon.`,pi); }
  if (atk.fx==='draw1' && p.deck.length){ const c=p.deck.pop(); p.hand.push(c); log(`${who(pi)} drew ${pi===ME?D(c).name:'a card'}.`,pi); }
  if (atk.fx==='flipPara' && d.damage<topC(d).hp && flip()){ d.paralyzed=true; log(`${topC(d).name} is now Paralyzed.`,pi); }
  if (atk.fx==='discardF'){ const k=a.energy.findIndex(e=>D(e).type==='F'); if (k>=0){ p.discard.push(...a.energy.splice(k,1)); log(`${topC(a).name} discarded a Fire Energy.`,pi);} }
  if (atk.fx==='self30'){ a.damage+=30; log(`${topC(a).name} also did 30 damage to itself.`,pi); }
  if (atk.fx==='poison' && d.damage<topC(d).hp){ d.poisoned=true; log(`${topC(d).name} is now Poisoned.`,pi); }
  ev('attack:'+atk.name); ev('attackBy:'+topC(a).name);
  if (pi===ME) clearUI();
  resolveAfterDamage(() => endTurn());
}
function knockOut(pi,m){
  const p=P(pi), o=P(1-pi), t=topC(m);
  p.discard.push(...m.stack, ...m.energy);
  if (p.active===m) p.active=null; else p.bench=p.bench.filter(x=>x!==m);
  const n=Math.min(t.ex?2:1, o.prizes.length);
  for (let i=0;i<n;i++) o.hand.push(o.prizes.pop());
  log(`${t.name} was Knocked Out! ${who(1-pi)} took ${n} Prize card${n>1?'s':''}${t.ex?' (Pokémon ex give up 2)':''}.`);
  ev('ko');
}
function checkWin(){
  const W=(pi,why)=>{ S.over={winner:pi,why}; S.busy=false; clearUI(); log(why); clearSaved(); return true; };
  for (const pi of [0,1]) if (!P(pi).prizes.length) return W(pi, pi===ME?'You took your last Prize card.':`${them()} took their last Prize card.`);
  for (const pi of [0,1]) if (!P(pi).active && !P(pi).bench.length) return W(1-pi, pi===ME?'You have no Pokémon left in play.':`${them()} has no Pokémon left in play.`);
  return false;
}
function resolveAfterDamage(next){
  for (const pi of [S.cur,1-S.cur]) for (const m of inPlay(P(pi))) if (m.damage>=topC(m).hp) knockOut(pi,m);
  if (checkWin()){ render(); return; }
  const need=[0,1].filter(pi=>!P(pi).active && P(pi).bench.length);
  for (const pi of need) if (P(pi).isAI) aiPromote(S.diff);
  const wait=need.filter(pi=>!P(pi).isAI);
  if (wait.length){
    S.promoteWait=new Set(wait); S.after=next; S.busy=false;
    if (wait.includes(ME)) S.ui={sel:null,mode:'promote',data:null};
    render(); return;
  }
  next();
}
function onPromote(pi,muid){
  doPromote(pi,muid);
  if (!S.promoteWait) return;
  S.promoteWait.delete(pi);
  if (pi===ME) clearUI();
  if (!S.promoteWait.size){ S.promoteWait=null; const f=S.after; S.after=null; if (f) f(); }
}
function endTurn(){
  clearUI();
  if (S.mode==='lesson'){ S.locked=true; render(); return; }
  for (const pi of [0,1]){ const a=P(pi).active; if (a && a.poisoned){ a.damage+=10; log(`Pokémon Checkup: ${topC(a).name} took 10 Poison damage.`); } }
  const ca=P(S.cur).active; if (ca && ca.paralyzed){ ca.paralyzed=false; log(`Pokémon Checkup: ${topC(ca).name} is no longer Paralyzed.`); }
  resolveAfterDamage(() => startTurn(1-S.cur));
}
function startTurn(pi){
  S.cur=pi; S.turn++;
  const p=P(pi); p.turnsTaken++; p.energyAttached=p.supporterPlayed=p.retreated=false;
  if (!p.deck.length){ S.over={winner:1-pi,why:`${pi===ME?'You':them()} had no cards left to draw at the start of the turn.`}; clearSaved(); render(); return; }
  const c=p.deck.pop(); p.hand.push(c);
  log(pi===ME?`Your turn ${S.turn}. You drew ${D(c).name}.`:`${oppName()}'s turn ${S.turn}. They drew a card.`, pi);
  render();
  if (p.isAI) runAI();
}
function maybeStart(){
  if (!S.setup || !S.ready[0] || !S.ready[1]) return;
  S.setup=false;
  const first=rand()<.5?0:1;
  log(first===ME?'Coin flip: you go first.':`Coin flip: ${them().toLowerCase()} goes first.`);
  startTurn(first);
}

/* ---------- action log: every human move is a replayable action ---------- */
function act(k, f={}){
  const a={k,pi:ME,...f};
  applyAction(a);
  if (S.online) Net.send({t:'act',a});
  render();
}
function applyAction(a){
  if (S.online){ S.actions.push(a); if (!S.replaying) saveOnline(); }
  const pi=a.pi;
  switch (a.k){
    case 'bench': doBench(pi,a.c); break;
    case 'attach': doAttach(pi,a.c,a.m); break;
    case 'evolve': doEvolve(pi,a.c,a.m); break;
    case 'trainer': doTrainer(pi,a.c,a.x); break;
    case 'retreat': doRetreat(pi,a.m); break;
    case 'ability': doAbility(pi,a.m); break;
    case 'attack': doAttack(pi,a.i); break;
    case 'promote': onPromote(pi,a.m); break;
    case 'end': log(`${who(pi)} ended ${pi===ME?'your':'their'} turn.`,pi); endTurn(); break;
    case 'ready': S.ready[pi]=true; if (S.online) log(pi===ME?'You are ready.':'Your opponent is ready.',pi); maybeStart(); break;
  }
}

/* ---------- rival AI (offline match): easy / normal / hard ---------- */
const AI_DELAY = {ms:650};
const HARD_OFF = {};
const ENERGY_FOR = {F:'fireE',W:'waterE',G:'grassE',L:'lightningE',C:'fireE'};
const canHit = m => !m.paralyzed && topC(m).attacks.some(a=>canPay(m.energy,a.cost));
const expBonus = atk => atk.fx==='flip20' ? 10 : atk.fx==='flip2x20' ? 0 : 0;
// Best expected damage `att` can do to `def`, optionally pretending it has one more Energy of its type.
function bestHit(att, def, plusOne=false){
  if (!att || !def) return {d:0,i:-1};
  const en = plusOne ? att.energy.concat([{id:ENERGY_FOR[topC(att).type]}]) : att.energy;
  let best={d:0,i:-1};
  topC(att).attacks.forEach((a,i)=>{
    if (!canPay(en,a.cost)) return;
    const r=calcDamage(plusOne?{...att,energy:en}:att, def, a, expBonus(a));
    if (r.d>best.d || best.i<0) best={d:r.d,i};
  });
  return best;
}
const threat = m => P(0).active ? bestHit(P(0).active, m, true).d : 0;
function aiPromote(diff='normal'){
  const p=P(1), o=P(0).active;
  let best;
  if (diff==='easy') best=p.bench[Math.random()*p.bench.length|0];
  else if (diff==='hard' && !HARD_OFF.promote) best=[...p.bench].sort((a,b)=>score(b)-score(a))[0];
  else best=[...p.bench].sort((a,b)=>(b.energy.length*25+hpLeft(b))-(a.energy.length*25+hpLeft(a)))[0];
  function score(m){ return bestHit(m,o).d*1.5 + bestHit(m,o,true).d*.5 + hpLeft(m)*.5 - (o&&topC(m).weak===topC(o).type?80:0) - (topC(m).ex?40:0); }
  doPromote(1,best.uid);
}
async function runAI(){
  const g=S.gen, p=P(1), o=P(0), diff=S.diff||'normal';
  S.busy=true; render();
  const step = async () => { render(); await sleep(AI_DELAY.ms); return S.gen===g && !S.over; };
  if (!await step()) return;
  const card = id => p.hand.find(c=>c.id===id && !whyNotTrainer(1,c));
  const play = async (id,arg) => { const c=card(id); if (!c) return true; doTrainer(1,c.uid,arg); return step(); };
  const roll = x => Math.random()<x;
  const evoFor = m => p.hand.find(c=>D(c).from===topC(m).name);

  if (diff==='easy'){
    if (roll(.3) && card('research') && !(await play('research'))) return;
    for (const c of p.hand.filter(isBasic)) if (p.bench.length<2){ doBench(1,c.uid); if (!await step()) return; }
    for (const c of p.hand.filter(c=>D(c).stage==='Stage 1')){ const t=inPlay(p).find(m=>!whyNotEvolve(1,c,m)); if (t && roll(.5)){ doEvolve(1,c.uid,t.uid); if (!await step()) return; } }
    if (p.active.damage>=40 && roll(.4) && card('potion') && !(await play('potion',p.active.uid))) return;
    const en=p.hand.find(c=>D(c).kind==='energy');
    if (en && roll(.6)){ const ip=inPlay(p), t=ip[Math.random()*ip.length|0]; doAttach(1,en.uid,t.uid); if (!await step()) return; }
    S.busy=false;
    const opts=topC(p.active).attacks.map((a,i)=>i).filter(i=>!whyNotAttack(1,i));
    if (opts.length && roll(.85)) return doAttack(1,opts[Math.random()*opts.length|0]);
    log('Rival ended their turn.',1); return endTurn();
  }

  // ---- draw and search (normal + hard) ----
  if (S.turn!==1 && !p.supporterPlayed){
    if (p.hand.length<=2 && card('lecture')){ if (!await play('lecture')) return; }
    else if (p.hand.length<=3 && card('peptalk')){ if (!await play('peptalk')) return; }
    else if (p.hand.length<=4 && card('research') && p.deck.length>6){ if (!await play('research')) return; }
  }
  if (p.bench.length<4 && card('greatball')){ if (!await play('greatball')) return; }
  let fg;
  while ((fg=card('fieldguide')) && p.bench.length<4){
    const basics=p.deck.filter(isBasic);
    const pick = (diff==='hard' && basics.find(b=>p.hand.some(c=>D(c).from===D(b).name))) || basics.find(b=>D(b).ex) || basics[0];
    doTrainer(1,fg.uid,pick.id); if (!await step()) return;
  }
  if (p.bench.length<3 && card('retriever')){ const pk=p.discard.filter(c=>isBasic(c)).pop(); if (pk && !(await play('retriever',pk.id))) return; }
  if (!p.supporterPlayed && S.turn!==1 && card('rushorders')){ const t=p.deck.find(c=>D(c).stage==='Stage 1' && inPlay(p).some(m=>topC(m).name===D(c).from)); if (t && !(await play('rushorders',t.id))) return; }
  if (!p.hand.some(c=>D(c).kind==='energy')){
    if (card('energysearch')){ const e=p.deck.find(c=>D(c).kind==='energy'); if (!(await play('energysearch',e.id))) return; }
    else if (card('energyretrieval')){ if (!(await play('energyretrieval'))) return; }
  }
  for (const c of p.hand.filter(isBasic)) if (p.bench.length<5){ doBench(1,c.uid); if (!await step()) return; }
  for (const c of p.hand.filter(c=>D(c).stage==='Stage 1')){ const t=inPlay(p).find(m=>!whyNotEvolve(1,c,m)); if (t){ doEvolve(1,c.uid,t.uid); if (!await step()) return; } }
  if ((p.active.poisoned||p.active.paralyzed) && card('antidoteherb')){ if (!await play('antidoteherb')) return; }
  if (card('sparebattery')){ const t=[...p.bench].sort((a,b)=>topC(b).hp-topC(a).hp).find(m=>topC(m).attacks.some(a=>!canPay(m.energy,a.cost))); if (t && !(await play('sparebattery',t.uid))) return; }

  // ---- hard: plan a Knock Out ----
  let attachTo=null;
  const energy = () => p.hand.find(c=>D(c).kind==='energy');
  const oa = () => o.active;
  if (diff==='hard' && !HARD_OFF.plan){
    const a=p.active, need=hpLeft(oa());
    if (bestHit(a,oa()).d>=need && canHit(a)) attachTo=null;            // already a KO
    else if (!p.energyAttached && energy() && !a.paralyzed && bestHit(a,oa(),true).d>=need) attachTo=a;
    else {
      // Pull a weak Benched Pokémon forward and finish it.
      const lure=card('lurewhistle');
      if (lure && !p.supporterPlayed && !a.paralyzed){
        const canPlus = !p.energyAttached && energy();
        const t=[...o.bench].filter(b=>bestHit(a,b,!!canPlus).d>=hpLeft(b)).sort((x,y)=>(topC(y).ex?1:0)-(topC(x).ex?1:0))[0];
        if (t){ doTrainer(1,lure.uid,t.uid); if (!await step()) return; if (bestHit(a,oa()).d<hpLeft(oa())) attachTo=a; }
      }
      // Or power up a Benched attacker that can KO, then swap it in.
      if (!attachTo && !p.energyAttached && energy()){
        const canSwap = card('switch') || (!whyNotRetreat(1));
        const b=p.bench.find(m=>bestHit(m,oa(),true).d>=hpLeft(oa()));
        if (b && canSwap){
          doAttach(1,energy().uid,b.uid); if (!await step()) return;
          if (card('switch')){ if (!(await play('switch',b.uid))) return; } else { doRetreat(1,b.uid); if (!await step()) return; }
        }
      }
    }
  }
  if (diff==='hard' && !HARD_OFF.survive){
    // Survive: heal if that prevents a KO, otherwise retreat to something sturdier.
    const t=threat(p.active), left=hpLeft(p.active);
    const koNow = canHit(p.active) && bestHit(p.active,oa()).d>=hpLeft(oa());
    if (!koNow && t>=left){
      const heal = card('superpotion')&&t<left+60 ? ['superpotion',p.active.uid] : card('healingberry')&&t<left+40 ? ['healingberry'] : card('potion')&&t<left+30 ? ['potion',p.active.uid] : card('fieldmedic')&&!p.supporterPlayed&&t<left+30 ? ['fieldmedic'] : null;
      if (heal){ if (!(await play(...heal))) return; }
      else if (p.bench.length && (topC(p.active).ex || p.prizes.length<=2 || !canHit(p.active))){
        const canPlus = !p.energyAttached && energy();
        const ready = m => canHit(m) || (canPlus && bestHit(m,oa(),true).i>=0);
        const better=[...p.bench].filter(m=>ready(m) && threat(m)<hpLeft(m)).sort((x,y)=>bestHit(y,oa(),true).d-bestHit(x,oa(),true).d)[0];
        if (better){
          const viaSwitch = !!card('switch');
          if (viaSwitch || !whyNotRetreat(1)){
            if (!canHit(better) && canPlus){ doAttach(1,energy().uid,better.uid); if (!await step()) return; }
            if (viaSwitch){ if (!(await play('switch',better.uid))) return; } else { doRetreat(1,better.uid); if (!await step()) return; }
          }
        }
      }
    }
  }
  if (diff!=='hard') {
    const pot=card('superpotion')||card('healingberry')||card('potion');
    if (pot && p.active.damage>=(pot.id==='superpotion'?60:30)){ if (!(await play(pot.id,p.active.uid))) return; }
    if (card('fieldmedic') && !p.supporterPlayed && inPlay(p).reduce((n,m)=>n+m.damage,0)>=60){ if (!await play('fieldmedic')) return; }
  }

  // ---- attach Energy ----
  if (!p.energyAttached && energy()){
    let t=attachTo;
    if (!t){
      const need = m => topC(m).attacks.some(a=>!canPay(m.energy,a.cost));
      t = need(p.active) ? p.active
        : [...p.bench].sort((a,b)=>(evoFor(b)?50:0)+topC(b).hp-(evoFor(a)?50:0)-topC(a).hp).find(need) || null;
    }
    if (t){ const e=p.hand.find(c=>D(c).kind==='energy'&&D(c).type===topC(t).type)||energy(); doAttach(1,e.uid,t.uid); if (!await step()) return; }
  }
  if (!p.retreated && p.bench.length && !canHit(p.active) && !whyNotRetreat(1)){
    const ready=p.bench.find(canHit); if (ready){ doRetreat(1,ready.uid); if (!await step()) return; }
  }
  S.busy=false;
  if (S.turn!==1){
    const a=p.active; let best=-1, bs=-1e9;
    topC(a).attacks.forEach((atk,i)=>{
      if (whyNotAttack(1,i)) return;
      const d=calcDamage(a,oa(),atk,expBonus(atk)).d, ko=d>=hpLeft(oa());
      let sc=d;
      if (diff==='hard' && !HARD_OFF.score){
        const self=atk.fx==='self30'?30:atk.fx==='self20'?20:0;
        if (ko) sc+=500*(topC(oa()).ex?2:1);
        if (self && self>=hpLeft(a) && !(ko && p.prizes.length<=(topC(oa()).ex?2:1))) sc-=1000;
        if (atk.fx==='bench10') sc+=10*o.bench.length;
        if (atk.fx==='snipe30' && o.bench.length) sc+=30;
        if (atk.fx==='discardOppE' && oa().energy.length) sc+=25;
        if (atk.fx==='poison' && !oa().poisoned) sc+=20;
        if (atk.fx==='flipPara') sc+=15;
      }
      if (sc>bs){ bs=sc; best=i; }
    });
    if (best>=0) return doAttack(1,best);
  }
  log('Rival ended their turn.',1);
  endTurn();
}

/* ---------- lessons ---------- */
function scenario(o){
  S.turn = 5;
  const me=newPlayer('You', build({fireE:6,cindlet:2,potion:2,research:2}), false);
  const op=newPlayer('Rival', build({grassE:6,budling:3,research:3}), true);
  me.turnsTaken=op.turnsTaken=3;
  S.players=[me,op];
  const place = s => { const m=mkMon(mk(s.id)); if (s.under) m.stack.unshift(mk(s.under)); m.turnPlayed=0;
    (s.energy||[]).forEach(e=>m.energy.push(mk(e))); m.damage=s.damage||0; m.poisoned=!!s.poisoned; return m; };
  me.active = o.me.active ? place(o.me.active) : null;
  me.bench = (o.me.bench||[]).map(place);
  op.active = place(o.op.active);
  op.bench = (o.op.bench||[]).map(place);
  me.hand = (o.hand||[]).map(mk);
  me.prizes = Array.from({length:o.mePrizes??PRIZES}, ()=>mk('fireE'));
  op.prizes = Array.from({length:PRIZES}, ()=>mk('grassE'));
  S.setup = !!o.setup; S.cur = 0;
}
const LESSONS = [
  {key:'card', title:'Read a card', kind:'anatomy',
   body:`<p>Every Pokémon card is laid out the same way, so once you can read one you can read them all. These creatures are made up for this academy, but each part works exactly like the real cards.</p><p>Tap the parts on the right to see where each one lives on the card. Switch between cards to compare a Basic, an evolution, a Pokémon ex, a Trainer, and an Energy.</p>`,
   goal:'Look at four or more card parts.', check:()=>S.partsSeen.size>=4},
  {key:'setup', title:'Set up the table', setup:true,
   body:`<p>Each player shuffles a 60-card deck and draws 7. You place one <span class="kbd">Basic</span> Pokémon face down as your <span class="kbd">Active Pokémon</span>, plus up to 5 more Basics on your <span class="kbd">Bench</span>.</p><p>Then each player sets aside <span class="kbd">Prize cards</span> from the top of their deck, face down. A real game uses 6. This academy uses 4 so matches stay short. Every time you Knock Out a Pokémon, you take a Prize.</p><p>If you have no Basic in your opening hand, you reveal it, shuffle, and draw again. That's a mulligan.</p>`,
   goal:'Make Cindlet your Active Pokémon, then put Puffkin on your Bench.',
   hint:'Tap Cindlet in your hand, then choose Make Active. Try Pyrrox too and see why it has to wait.',
   build(){ scenario({setup:true, me:{}, op:{active:{id:'budling'}}, hand:['cindlet','puffkin','pyrrox','fireE','potion']}); },
   check:()=>P(0).active && P(0).bench.length>=1},
  {key:'energy', title:'Attach Energy',
   body:`<p>Attacks cost Energy. Once per turn you may attach <span class="kbd">one</span> Energy card from your hand to one of your Pokémon, Active or Benched. It stays attached until something discards it.</p><p>This is the most important habit in the game: attach every turn, even if you can't attack yet.</p>`,
   goal:'Attach a Fire Energy to Cindlet. Then try to attach the second one.',
   hint:'Tap a Fire Energy in your hand, choose Attach, then tap Cindlet on the mat.',
   build(){ scenario({me:{active:{id:'cindlet'}}, op:{active:{id:'budling'}}, hand:['fireE','fireE','potion']}); },
   check:()=>S.events.includes('attach')},
  {key:'attack', title:'Attack and Weakness',
   body:`<p>Attacking is the last thing you do on your turn. The symbols left of an attack are its cost. Typed symbols need that exact Energy. The <span class="kbd">star</span> is Colorless, and any Energy can pay for it.</p><p>Damage is then adjusted: if the defender's <span class="kbd">Weakness</span> matches the attacker's type, damage is doubled. <span class="kbd">Resistance</span> subtracts 30.</p><p>When damage reaches a Pokémon's HP it is <span class="kbd">Knocked Out</span>. It goes to the discard pile, you take a Prize card, and your opponent moves a Benched Pokémon up.</p>`,
   goal:'Knock Out Budling with Ember Nip.',
   hint:'Tap Cindlet on the mat. Budling is weak to Fire, so 20 damage becomes 40, which finishes it.',
   build(){ scenario({me:{active:{id:'cindlet',energy:['fireE']}}, op:{active:{id:'budling',damage:20}, bench:[{id:'ripplet'}]}}); },
   check:()=>S.events.includes('ko')},
  {key:'evolve', title:'Evolve',
   body:`<p>A <span class="kbd">Stage 1</span> card goes on top of the Pokémon named in its "Evolves from" line. The evolved Pokémon keeps all attached Energy and damage, but now uses the new card's HP, attacks, Weakness and Retreat Cost.</p><p>Two limits: nobody can evolve on their first turn, and you can't evolve a Pokémon that came into play this turn.</p>`,
   goal:'Evolve Cindlet into Pyrrox, attach an Energy, and use Flare Rush.',
   hint:`Order matters less than you'd think. Evolving first means the 20 damage now sits on a 110 HP Pokémon.`,
   build(){ scenario({me:{active:{id:'cindlet',energy:['fireE'],damage:20}}, op:{active:{id:'thornoak',under:'budling'}, bench:[{id:'budling'}]}, hand:['pyrrox','fireE']}); },
   check:()=>S.events.includes('evolve') && S.events.includes('attack:Flare Rush')},
  {key:'trainers', title:'Trainers and Abilities',
   body:`<p><span class="kbd">Trainer cards</span> come in two kinds. <span class="kbd">Items</span> are small tricks, and you can play as many as you like. <span class="kbd">Supporters</span> are strong, so you get only one per turn.</p><p>An <span class="kbd">Ability</span> is printed on a Pokémon and is not an attack. Using one doesn't end your turn.</p>`,
   goal:'Heal Pyrrox with Potion, play Research Lead, and use Puffkin’s Ability.',
   hint:'After playing one Research Lead, try the second to see the Supporter limit.',
   build(){ scenario({me:{active:{id:'pyrrox',under:'cindlet',energy:['fireE','fireE'],damage:50}, bench:[{id:'puffkin'}]}, op:{active:{id:'stag'}}, hand:['potion','research','research']}); },
   check:()=>['potion','supporter','ability'].every(x=>S.events.includes(x))},
  {key:'retreat', title:'Retreat',
   body:`<p>Your Active Pokémon can swap with a Benched one by <span class="kbd">retreating</span>. Discard Energy from it equal to its Retreat Cost, then pick the replacement. You can retreat once per turn, and it doesn't end your turn.</p><p>Retreat when your Active is about to be Knocked Out, or when the opponent's type hits its Weakness.</p>`,
   goal:'Retreat Cindlet to safety, then attack with Puffkin.',
   hint:'Ripplet is a Water type and Cindlet is weak to Water. Tap Cindlet and choose Retreat.',
   build(){ scenario({me:{active:{id:'cindlet',energy:['fireE'],damage:40}, bench:[{id:'puffkin',energy:['fireE','fireE']}]}, op:{active:{id:'ripplet',damage:40}, bench:[{id:'budling'}]}}); },
   check:()=>S.events.includes('retreat') && S.events.includes('attackBy:Puffkin')},
  {key:'conditions', title:'Special Conditions',
   body:`<p>Some attacks leave a <span class="kbd">Special Condition</span> on the defending Active Pokémon. <span class="kbd">Poisoned</span> means it takes 10 damage during Pokémon Checkup, which happens between every turn.</p><p><span class="kbd">Paralyzed</span> means it can't attack or retreat during its owner's next turn. It wears off at the end of that turn.</p><p>Moving a Pokémon to the Bench, by retreating or with a card like Switch, removes all Special Conditions. So does evolving. The real game also has Asleep, Burned and Confused.</p>`,
   goal:'Cure Cindlet by playing Switch.',
   hint:'Retreating would also work here, but Switch costs no Energy.',
   build(){ scenario({me:{active:{id:'cindlet',energy:['fireE'],damage:30,poisoned:true}, bench:[{id:'puffkin'}]}, op:{active:{id:'thornoak',under:'budling'}}, hand:['switch','fireE']}); },
   check:()=>S.events.includes('switch')},
  {key:'win', title:'Pokémon ex and winning',
   body:`<p><span class="kbd">Pokémon ex</span> have big HP and big attacks, but when one is Knocked Out the opponent takes <span class="kbd">2</span> Prize cards.</p><p>You win in any of three ways: take your last Prize card, leave your opponent with no Pokémon in play, or your opponent can't draw at the start of their turn.</p>`,
   goal:'You have 2 Prize cards left. Knock Out Verdant Stag ex to win.',
   hint:'Magma Surge needs three Fire Energy. Magmaw ex has two.',
   build(){ scenario({mePrizes:2, me:{active:{id:'magmaw',energy:['fireE','fireE']}}, op:{active:{id:'stag',damage:20}, bench:[{id:'budling'}]}, hand:['fireE','potion']}); },
   check:()=>S.over && S.over.winner===0},
  {key:'play', title:'Full match', kind:'match'},
  {key:'friend', title:'Play a friend', kind:'online'}
];
const PLAY_IDX = LESSONS.findIndex(l=>l.kind==='match');
const FRIEND_IDX = LESSONS.findIndex(l=>l.kind==='online');

function loadDone(){ try { return new Set(JSON.parse(localStorage.getItem('bench-academy-done')||'[]')); } catch(e){ return new Set(); } }
function saveDone(set){ try { localStorage.setItem('bench-academy-done', JSON.stringify([...set])); } catch(e){} }
const DONE = loadDone();

function blank(li){ return {gen:++GEN,li,mode:'lesson',online:false,players:[],cur:0,turn:5,ui:{sel:null,mode:null,data:null},log:[],events:[],over:null,overHidden:false,busy:false,locked:false,setup:false,ready:[false,false],after:null,promoteWait:null,actions:[],seed:0,replaying:false,done:false,part:'hp',partsSeen:new Set(),acard:'pyrrox',hit:null}; }
function goMenu(view='home'){
  if (S && LESSONS[S.li].kind==='online') leaveOnline();
  ME=0; rand=Math.random; S=blank(0); MENU=true; MENU_VIEW=view;
  render(); window.scrollTo(0,0);
}
function nextLesson(){ const i=LESSONS.findIndex((l,k)=>k<PLAY_IDX && !DONE.has(l.key)); return i<0 ? 0 : i; }
function goLesson(i){
  i=Math.max(0,Math.min(LESSONS.length-1,i));
  MENU=false;
  const L=LESSONS[i];
  if (L.kind==='online' && S && S.li===i && !MENU){ render(); return; }
  if (S && LESSONS[S.li].kind==='online' && L.kind!=='online') leaveOnline();
  ME=0; rand=Math.random;
  S=blank(i);
  if (L.kind==='match'){
    S.mode='match'; S.myDeck=DECKS[RIVAL.deck]?RIVAL.deck:'blaze'; S.diff=DIFFS[RIVAL.diff]?RIVAL.diff:'normal';
    const others=Object.keys(DECKS).filter(k=>k!==S.myDeck);
    // On Hard with a random Rival deck, the Rival counter-picks: it brings the type your Pokémon are weak to.
    const counter = others.find(k => DECKS[k].type===COUNTER[DECKS[S.myDeck].type]);
    S.aiDeck = DECKS[RIVAL.opp] ? RIVAL.opp : (S.diff==='hard' && counter) ? counter : others[Math.random()*others.length|0];
    startMatch();
  }
  else if (L.kind==='online'){ S.mode='lobby'; LINK.inLobby=true; }
  else if (L.build) L.build();
  render();
  if (window.innerWidth<760) document.getElementById('lesson').scrollIntoView({block:'start'});
}
function startMatch(){
  S.turn=0;
  const md = S.online ? 'blaze' : S.myDeck, ad = S.online ? 'thicket' : S.aiDeck;
  const me=newPlayer('You',build(DECKS[md].list),false), op=newPlayer(S.online?'Opponent':'Rival',build(DECKS[ad].list),!S.online);
  S.players=[me,op];
  [me,op].forEach((p,pi)=>{
    let mull=0;
    for(;;){ p.deck.push(...p.hand); p.hand=[]; shuffle(p.deck); p.hand=p.deck.splice(-7); if (p.hand.some(isBasic)) break; mull++; }
    if (mull) log(`${who(pi)} had no Basic Pokémon and took ${mull} mulligan${mull>1?'s':''}: reshuffled and drew 7 again.`, pi);
    p.prizes=p.deck.splice(-PRIZES);
  });
  S.setup=true; S.cur=0;
  if (S.online){
    S.ready=[false,false];
    log(`Both players drew 7 cards and set aside ${PRIZES} Prize cards. You play the ${ME===0?'Fire':'Grass'} deck. Choose your Active Pokémon, then tap Ready.`);
    return;
  }
  // Rival setup. Hard keeps Pokémon ex off the front line; Easy barely builds a Bench.
  const basics=op.hand.filter(isBasic).sort((a,b)=>(D(a).hp-(S.diff==='hard'&&D(a).ex?200:0))-(D(b).hp-(S.diff==='hard'&&D(b).ex?200:0)));
  op.active=mkMon(take(op,basics.pop().uid));
  for (const c of basics) if (op.bench.length<(S.diff==='easy'?1:5)) op.bench.push(mkMon(take(op,c.uid)));
  S.ready=[false,true];
  log(`You play ${DECKS[md].name}. The Rival plays ${DECKS[ad].name} on ${DIFFS[S.diff].name}. Both players drew 7 cards and set aside ${PRIZES} Prize cards. Choose your Active Pokémon.`);
}
function checkLesson(){
  const L=LESSONS[S.li];
  if (S.mode!=='lesson' || S.done || !L.check) return;
  if (L.check()){ S.done=true; DONE.add(L.key); saveDone(DONE); setTimeout(()=>toast('Goal complete. Nice!'),50); }
}

/* ---------- two-phone play ---------- */
const LINK = {role:null, step:'choose', qr:'', text:'', err:'', open:false, lost:false, inLobby:true, pending:null};
function saveOnline(){
  try { if (S.online && !S.over) localStorage.setItem('ba-online', JSON.stringify({role:LINK.role, seed:S.seed, actions:S.actions, t:Date.now()})); } catch(e){}
}
function loadSaved(){ try { return JSON.parse(localStorage.getItem('ba-online')||'null'); } catch(e){ return null; } }
function clearSaved(){ if (S.online && !S.replaying){ try { localStorage.removeItem('ba-online'); } catch(e){} } }
function startOnline(seed, me){
  S=blank(FRIEND_IDX); S.mode='match'; S.online=true; S.seed=seed;
  ME=me; rand=mulberry32(seed); UID=0;
  startMatch();
}
function beginOnline(seed, me, actions){
  startOnline(seed, me);
  S.replaying=true;
  for (const a of actions) applyAction(a);
  S.replaying=false;
  clearUI(); saveOnline();
  LINK.inLobby=false; LINK.step='live';
  render();
}
function leaveOnline(){
  Net.close();
  Object.assign(LINK,{role:null,step:'choose',qr:'',text:'',err:'',open:false,lost:false,inLobby:true,pending:null});
}
function showCode(bytes, step){ LINK.qr=Net.qrSvg(bytes); LINK.text=Net.toText(bytes); LINK.step=step; LINK.err=''; }
async function hostGame(resume){
  LINK.role='host'; LINK.inLobby=true; LINK.step='working'; LINK.err=''; render();
  if (!(S.online && S.players.length)){
    const saved=loadSaved();
    LINK.pending = resume && saved ? {seed:saved.seed, actions:saved.actions} : {seed:(Math.random()*4294967296)>>>0, actions:[]};
  }
  try { showCode(await Net.host(), 'host-show'); }
  catch(e){ LINK.err=e.message||String(e); LINK.step='choose'; }
  render();
}
async function useHostCode(code){
  LINK.role='guest'; LINK.inLobby=true; LINK.step='working'; LINK.err=''; render();
  try { showCode(await Net.join(code), 'guest-show'); }
  catch(e){ LINK.err=e.message||String(e); LINK.step='choose'; }
  render();
}
async function useReplyCode(code){
  LINK.step='connecting'; render();
  try { await Net.accept(code); }
  catch(e){ LINK.err=e.message||String(e); LINK.step='host-show'; render(); }
}
async function scanFor(handler){
  LINK.err='';
  try { await Net.scan(code => handler(code)); }
  catch(e){ LINK.err=e.message||String(e); render(); }
}
Net.onOpen = () => {
  LINK.open=true; LINK.lost=false;
  if (LINK.role==='host'){
    const g = (S.online && S.players.length && !S.over) ? {seed:S.seed, actions:S.actions} : (LINK.pending || {seed:(Math.random()*4294967296)>>>0, actions:[]});
    beginOnline(g.seed, 0, g.actions);
    Net.send({t:'sync', seed:g.seed, actions:g.actions});
  } else { LINK.step='waiting'; render(); }
  toast('Connected');
};
Net.onMessage = m => {
  if (m.t==='sync'){ beginOnline(m.seed, 1, m.actions||[]); return; }
  if (m.t==='act' && S.online){
    try { applyAction(m.a); }
    catch(e){ console.error(e); if (LINK.role==='guest') Net.send({t:'resync'}); }
    render(); return;
  }
  if (m.t==='resync' && LINK.role==='host' && S.online) Net.send({t:'sync', seed:S.seed, actions:S.actions});
};
Net.onClose = () => { LINK.open=false; if (S.online && S.players.length){ LINK.lost=true; } else if (LINK.step!=='choose'){ LINK.err='The connection closed. Try again.'; LINK.step='choose'; } render(); };
Net.onFail = () => { LINK.open=false; LINK.err=`The phones couldn't reach each other. Put both on the same Wi-Fi, or connect one to the other's hotspot, then try again.`; LINK.step='choose'; LINK.inLobby=true; render(); };
function rematch(){
  const seed=(Math.random()*4294967296)>>>0;
  beginOnline(seed, 0, []);
  Net.send({t:'sync', seed, actions:[]});
}

/* ---------- UI ---------- */
function clearUI(){ S.ui={sel:null,mode:null,data:null}; }
let toastT;
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2800); }

function isTarget(owner,m){
  const mode=S.ui.mode, p=P(ME);
  if (mode==='lure') return owner!==ME && P(owner).bench.includes(m);
  if (mode==='battery') return owner===ME && p.bench.includes(m);
  if (!mode || owner!==ME) return false;
  const onBench = p.bench.includes(m);
  if (mode==='attach') return true;
  if (mode==='evolve'){ const c=p.hand.find(x=>x.uid===S.ui.data); return c && !whyNotEvolve(ME,c,m); }
  if (mode==='potion') return m.damage>0;
  return ['switch','retreat','promote'].includes(mode) && onBench;
}
function miniMon(m,owner){
  const d=topC(m), rem=hpLeft(m), sel=S.ui.sel?.kind==='mon'&&S.ui.sel.uid===m.uid;
  return `<button class="mini t-${d.type}${sel?' sel':''}${isTarget(owner,m)?' tgt':''}${S.hit===m.uid?' hit':''}" data-act="mon" data-owner="${owner}" data-uid="${m.uid}" aria-label="${d.name}, ${rem} of ${d.hp} HP">
    <span class="m-top"><span class="m-name">${d.name.replace(' ex','')}</span>${d.ex?'<span class="ex">ex</span>':''}</span>
    <span class="m-art">${art(d.id)}</span>
    <span class="m-hp"><b>${rem}</b><span>/${d.hp}</span></span>
    <span class="m-bar"><i class="${rem/d.hp<=.34?'lo':''}" style="width:${rem/d.hp*100}%"></i></span>
    <span class="m-en">${m.energy.map(e=>eIcon(D(e).type)).join('')}</span>
    ${m.damage?`<span class="dmgc" title="Damage">${m.damage}</span>`:''}
    ${m.poisoned?'<span class="psn">Poisoned</span>':''}${m.paralyzed?`<span class="psn para"${m.poisoned?' style="top:42%"':''}>Paralyzed</span>`:''}
  </button>`;
}
function hiddenMon(){ return `<div class="cback"></div>`; }
function benchRow(p,owner){
  // During online setup, the opponent's choices stay face down until both are ready.
  const hide = S.online && S.setup && owner!==ME;
  let h=''; for (let i=0;i<5;i++) h += p.bench[i] ? (hide?hiddenMon():miniMon(p.bench[i],owner)) : '<div class="slot"></div>';
  return `<div class="zone"><div class="lbl">${owner!==ME?`${oppName()}'s Bench`:'Your Bench'} · ${p.bench.length}/5</div><div class="row5 bench">${h}</div></div>`;
}
function pile(label,n,discardTop){
  const empty = n===0;
  return `<div class="zone"><div class="lbl">${label}</div><div class="pile"><div class="cback${empty||discardTop?' ghost':''}"></div><span class="count">${n}</span></div></div>`;
}
function prizeZone(p,owner){
  let h=''; for (let i=0;i<PRIZES;i++) h += `<div class="cback${i<p.prizes.length?'':' ghost'}"></div>`;
  return `<div class="zone" style="grid-column:span 2"><div class="lbl">${owner!==ME?`${oppName()} Prizes`:'Your Prizes'} · ${p.prizes.length} left</div><div class="prizes">${h}</div></div>`;
}
function activeZone(p,owner){
  const hide = S.online && S.setup && owner!==ME;
  return `<div class="zone active-zone"><div class="lbl">Active</div>${p.active?(hide?hiddenMon():miniMon(p.active,owner)):'<div class="slot"></div>'}</div>`;
}
function midline(){
  if (S.mode==='lesson') return `<span class="turnchip me">${S.setup?'Setup':'Your turn'}</span><span class="mid-note">${S.locked?'Turn over. Press Reset lesson to try again.':'Practice board. The Rival waits for you.'}</span>`;
  const lost = S.online && LINK.lost ? `<span class="conn bad">Disconnected</span><button class="btn primary" data-act="reconnect">Reconnect</button>` : '';
  if (S.over){
    const again = !S.online ? `<button class="btn primary" data-act="newmatch">New match</button>` : LINK.role==='host' && !LINK.lost ? `<button class="btn primary" data-act="rematch">Rematch</button>` : '';
    return `<span class="turnchip">Game over</span>${lost||again}`;
  }
  if (S.setup){
    const me=P(ME);
    const btn = S.ready[ME] ? `<span class="mid-note">Waiting for ${S.online?'your opponent':'the Rival'}…</span>`
      : `<button class="btn primary" data-act="do" data-a="start" ${me.active?'':'disabled'}>${S.online?'Ready':'Start battle'}</button>`;
    return `<span class="turnchip">Setup</span>${lost||btn}`;
  }
  const mine=S.cur===ME;
  const right = lost || (mine&&S.ui.mode!=='promote'&&!S.promoteWait ? `<button class="btn primary" data-act="do" data-a="end">End turn</button>` : `<span class="mid-note">${S.busy?'Rival is playing…':S.promoteWait&&!S.promoteWait.has(ME)?'Opponent is choosing a new Active…':''}</span>`);
  return `<span class="turnchip ${mine?'me':'opp'}">${mine?'Your turn':`${oppName()}’s turn`} · ${S.turn}</span>${right}`;
}
function boardView(){
  const me=P(ME), op=P(1-ME), O=1-ME;
  const av = S.online ? '' : `<span class="av"><img src="art/rival.webp" alt="" onerror="this.remove()"></span>`;
  return `<div class="mat">
    <div class="side">
      ${benchRow(op,O)}
      <div class="row5">${pile('Deck',op.deck.length)}${pile(`Discard`,op.discard.length,true)}${activeZone(op,O)}${prizeZone(op,O)}</div>
      <div class="opp-hand">${av}<span class="lbl">${oppName()}'s hand · ${op.hand.length} cards</span></div>
    </div>
    <div class="midline">${midline()}</div>
    <div class="side">
      <div class="row5">${prizeZone(me,ME)}${activeZone(me,ME)}${pile('Deck',me.deck.length)}${pile('Discard',me.discard.length,true)}</div>
      ${benchRow(me,ME)}
    </div>
  </div>`;
}
function handCard(c){
  const d=D(c), sel=S.ui.sel?.kind==='hand'&&S.ui.sel.uid===c.uid;
  const tcls = d.kind==='pokemon'||d.kind==='energy' ? d.type : 'T';
  const kind = d.kind==='pokemon' ? d.stage : d.kind==='item' ? 'Item' : d.kind==='supporter' ? 'Supporter' : 'Energy';
  return `<button class="hc t-${tcls}${sel?' sel':''}" data-act="hand" data-uid="${c.uid}" aria-label="${d.name}">
    <span class="hc-kind">${kind}</span><span class="hc-name">${d.name}</span><span class="hc-art">${art(d.id)}</span>
    <span class="hc-foot">${d.kind==='pokemon'?`<span>HP ${d.hp}</span>${eIcon(d.type)}`:d.kind==='energy'?`<span>Energy</span>${eIcon(d.type)}`:'<span>Trainer</span>'}</span></button>`;
}
function handView(){
  const p=P(ME);
  return `<div class="handwrap"><div class="lbl">Your hand · ${p.hand.length} cards</div><div class="hand" id="hand">${p.hand.map(handCard).join('')||'<span class="empty">No cards in hand.</span>'}</div></div>`;
}

function actBtn(a, label, why, extra='', num='', go=false){
  return `<button class="act${!why&&go?' go':''}" data-act="do" data-a="${a}" ${extra} ${why?'disabled':''}><span><b>${label}</b>${why?`<span class="why">${why}</span>`:''}</span>${num!==''?`<span class="num">${num}</span>`:''}</button>`;
}
function handActions(c){
  const d=D(c), p=P(ME);
  if (S.mode==='match' && !S.setup && S.cur!==ME) return '';
  if (d.kind==='pokemon'){
    if (d.stage==='Basic'){
      const label = !p.active ? 'Make Active' : 'Put on Bench';
      return actBtn('bench', label, whyNotBench(ME,c), '', '', true);
    }
    let why = whyNotEvolve(ME,c);
    if (!why && !evoTargets(ME,c).length) why = `You need ${d.from} in play to evolve into ${d.name}.`;
    if (!why && !evoTargets(ME,c).some(m=>!whyNotEvolve(ME,c,m))) why = whyNotEvolve(ME,c,evoTargets(ME,c)[0]);
    return actBtn('evolve', `Evolve your ${d.from}`, why, '', '', true);
  }
  if (d.kind==='energy') return actBtn('attach', 'Attach to a Pokémon', whyNotAttach(ME), '', '', true);
  return actBtn('play', `Play ${d.name}`, whyNotTrainer(ME,c), '', '', true);
}
function monActions(m,owner){
  const p=P(owner);
  if (owner!==ME || S.setup || (S.mode==='match' && S.cur!==ME)) return '';
  let h='';
  if (p.active===m){
    const oa=P(1-ME).active;
    topC(m).attacks.forEach((atk,i)=>{
      const r=calcDamage(m,oa,atk), why=whyNotAttack(ME,i);
      const label = `${atk.name}${r.notes.length?` <span class="why">${atk.dmg} → ${r.d} (${r.notes.join(', ')})</span>`:''}`;
      h += actBtn('attack', label, why, `data-i="${i}"`, r.d, true);
    });
    h += actBtn('retreat', `Retreat (discard ${topC(m).retreat} Energy)`, whyNotRetreat(ME));
  } else if (topC(m).ability){
    h += actBtn('ability', `Use ${topC(m).ability.name}`, whyNotAbility(ME,m), `data-uid="${m.uid}"`, '', true);
  }
  return h;
}
function modeView(){
  const u=S.ui, p=P(ME);
  const card = u.data ? p.hand.find(c=>c.uid===u.data) : null;
  const msg = {
    attach:`Tap one of your Pokémon on the mat to attach ${card?D(card).name:'the Energy'}.`,
    evolve:`Tap the ${card?D(card).from:''} you want to evolve. Glowing Pokémon are legal targets.`,
    potion:`Tap a damaged Pokémon to heal ${card&&card.id==='superpotion'?60:30}.`,
    switch:'Tap a Benched Pokémon to swap into the Active Spot.',
    retreat:`Tap a Benched Pokémon to become your new Active. ${p.active?topC(p.active).retreat:0} Energy will be discarded.`,
    promote:'Your Active Pokémon was Knocked Out. Tap a Benched Pokémon to move it into the Active Spot.',
    lure:`Tap one of your opponent's Benched Pokémon to pull it into the Active Spot.`,
    battery:'Tap a Benched Pokémon to attach an Energy from your discard pile.',
    search:card?`${D(card).name}: choose a card.`:'Choose a card.'
  }[u.mode];
  let opts='';
  if (u.mode==='search' && card){
    const {src,ok}=searchSpec(card.id,p), ids=[...new Set(src.filter(ok).map(c=>c.id))];
    opts = `<div class="opts">${ids.map(id=>`<button class="btn ghost" data-act="do" data-a="search" data-id="${id}">${DEF[id].name} ×${src.filter(c=>c.id===id).length}</button>`).join('')}</div>`;
  }
  return `<div class="insp-h"><b>${u.mode==='promote'?'New Active Pokémon':'Choose a target'}</b>${u.mode!=='promote'?'<button class="x" data-act="do" data-a="cancel" aria-label="Cancel">✕</button>':''}</div><div class="banner">${msg}</div>${opts}`;
}
function searchSpec(id,p){
  if (id==='retriever') return {src:p.discard, ok:c=>D(c).kind==='pokemon'};
  if (id==='energysearch') return {src:p.deck, ok:c=>D(c).kind==='energy'};
  if (id==='rushorders') return {src:p.deck, ok:c=>D(c).stage==='Stage 1'};
  return {src:p.deck, ok:isBasic};
}
function inspView(){
  const u=S.ui;
  if (u.mode) return modeView();
  if (!u.sel) return `<div class="insp-empty"><b class="lbl">Inspector</b><p>Tap any card on the mat or in your hand to read it and see what you can do with it.</p></div>`;
  const close = '<button class="x" data-act="close" aria-label="Close">✕</button>';
  if (u.sel.kind==='hand'){
    const c=P(ME).hand.find(x=>x.uid===u.sel.uid);
    if (!c){ clearUI(); return inspView(); }
    return `<div class="insp-h"><b>${D(c).name}</b>${close}</div><div class="acts">${handActions(c)}</div>${fullCard(c.id)}`;
  }
  const m=findMon(P(u.sel.owner),u.sel.uid);
  if (!m){ clearUI(); return inspView(); }
  const d=topC(m), where = P(u.sel.owner).active===m ? 'Active' : 'Bench';
  const status = `<div class="status"><span>${u.sel.owner===ME?'Yours':oppName()} · ${where}</span><span>HP left <b>${hpLeft(m)}</b>/${d.hp}</span><span>Damage <b>${m.damage}</b></span><span>Energy ${m.energy.length?m.energy.map(e=>eIcon(D(e).type)).join(''):'<b>none</b>'}</span>${m.poisoned?'<span style="color:var(--poison);font-weight:700">Poisoned</span>':''}${m.paralyzed?'<span style="color:var(--lightning);font-weight:700">Paralyzed</span>':''}${m.stack.length>1?`<span>Evolved from ${D(m.stack[0]).name}</span>`:''}</div>`;
  const acts = monActions(m,u.sel.owner);
  return `<div class="insp-h"><b>${d.name}</b>${close}</div>${status}${acts?`<div class="acts">${acts}</div>`:''}${fullCard(d.id)}`;
}

function coach(){
  const p=P(ME), o=P(1-ME), h=[];
  if (S.over) return [];
  if (S.online && LINK.lost) return ['The phones lost their connection. Tap Reconnect and scan again. Your game is saved and picks up where you left off.'];
  if (S.setup){
    if (!p.active) return ['Pick a Basic Pokémon from your hand to be your Active Pokémon. It takes the first hits, so a high-HP one is a safe choice.'];
    if (!S.ready[ME]) return [`Bench any other Basic Pokémon you like, then tap ${S.online?'Ready':'Start battle'}. Benched Pokémon are your backup when the Active is Knocked Out.`];
    return ['Waiting for your opponent to finish setting up. Your choices stay hidden from each other until you are both ready.'];
  }
  if (S.ui.mode==='promote') return ['Pick your new Active Pokémon. One with Energy already attached can hit back right away.'];
  if (S.promoteWait && !S.promoteWait.has(ME)) return ['Your opponent is choosing a new Active Pokémon.'];
  if (S.cur!==ME) return [`${them()} is taking their turn. Watch the log to see what they do.`];
  if (S.turn===1) h.push(`You're going first, so you can't attack or play a Supporter this turn. Build your Bench and attach Energy.`);
  if (p.hand.some(c=>D(c).kind==='energy') && !p.energyAttached) h.push(`You haven't attached Energy yet. You get one per turn, so don't skip it.`);
  for (const c of p.hand.filter(c=>D(c).stage==='Stage 1')) if (inPlay(p).some(m=>!whyNotEvolve(ME,c,m))){ h.push(`${D(c).name} can evolve your ${D(c).from} right now.`); break; }
  if (p.hand.some(isBasic) && p.bench.length<5) h.push('You have a Basic Pokémon in hand. Benching it gives you backup.');
  if (p.bench.some(m=>topC(m).ability && m.abilityTurn!==S.turn)) h.push('Puffkin on your Bench can use Tailwind Scout to draw a card.');
  const a=p.active, oa=o.active;
  if (a && oa){
    const opts=topC(a).attacks.map((atk,i)=>({atk,ok:!whyNotAttack(ME,i),r:calcDamage(a,oa,atk)})).filter(x=>x.ok).sort((x,y)=>y.r.d-x.r.d);
    if (opts.length){ const b=opts[0]; h.push(`${b.atk.name} does ${b.r.d} to ${topC(oa).name}${b.r.notes.length?` (${b.r.notes.join(', ')})`:''}${b.r.d>=hpLeft(oa)?`. That's a Knock Out`:''}. Attacking ends your turn, so do everything else first.`); }
    else if (S.turn>1) h.push(`${topC(a).name} can't pay for an attack yet. Attach Energy, or retreat to a Pokémon that can.`);
    if (topC(a).weak===topC(oa).type) h.push(`Watch out: ${topC(a).name} is weak to ${TYPE[topC(oa).type].n}, so ${topC(oa).name} hits it for double.`);
  }
  return h.slice(0,4);
}
function logView(){
  const cls = w => w===undefined ? '' : w===ME ? 'w0' : 'w1';
  return `<div class="sect"><h3>Game log</h3><ol class="log">${S.log.map(l=>`<li class="${cls(l.w)}">${l.m}</li>`).join('')||'<li>Nothing has happened yet.</li>'}</ol></div>`;
}
function matchPanel(){
  const p=P(ME), mine=!S.setup && S.cur===ME;
  const ck=(on,t,s)=>`<li class="${on?'y':''}"><i></i><span>${t}${s?` <small>${s}</small>`:''}</span></li>`;
  const head = S.online
    ? `<div class="eyebrow">Two players</div><h2>Play a friend</h2>
       <p>You ${LINK.role==='host'?'are hosting':'joined'} and play the <b>${ME===0?'Fire':'Grass'}</b> deck. First to take ${PRIZES} Prize cards wins. <span class="conn ${LINK.open?'ok':'bad'}">${LINK.open?'Connected':'Disconnected'}</span></p>`
    : `<div class="eyebrow">Final exam</div><h2>Beat the Rival</h2>
       <div class="rival"><div class="pic"><img src="art/rival.webp" alt="The Rival, a young trainer in a green jacket" onerror="this.remove()"></div><div><b>The Rival · ${DIFFS[S.diff].name}</b><span>Plays the ${DECKS[S.aiDeck].name} deck</span></div></div>
       <p>You play the <b>${DECKS[S.myDeck].name}</b> deck. First to take ${PRIZES} Prize cards wins.</p>`;
  const foot = S.online
    ? `<div class="goal-btns">${LINK.lost?'<button class="btn primary" data-act="reconnect">Reconnect</button>':''}<button class="btn ghost" data-act="leave">Leave game</button></div>`
    : `<div class="goal-btns"><button class="btn ghost" data-act="newmatch">New match</button><button class="btn ghost" data-act="setup">Change deck or difficulty</button></div>`;
  return `${head}
    <div class="sect"><h3>Coach</h3><ul class="coach">${coach().map(x=>`<li>${x}</li>`).join('')||'<li>Good game.</li>'}</ul></div>
    <div class="sect"><h3>Your turn, in order</h3><ul class="check">
      ${ck(mine,'Draw a card','automatic')}${ck(mine&&p.energyAttached,'Attach 1 Energy','once')}${ck(mine&&p.supporterPlayed,'Play 1 Supporter','once')}
      ${ck(false,'Bench, evolve, play Items','any number')}${ck(mine&&p.retreated,'Retreat','optional, once')}${ck(false,'Attack','ends your turn')}</ul></div>
    ${foot}
    ${logView()}`;
}
function lobbyPanel(){
  return `<div class="eyebrow">Two players</div><h2>Play a friend</h2>
    <p>Play face to face on two phones. The phones connect directly to each other, so there are no accounts and no game server.</p>
    <ol class="steps"><li>One of you taps <b>Host a game</b>.</li><li>The other taps <b>Join a game</b> and scans the host's code.</li><li>The host taps <b>Scan their reply</b> and scans the code that appears on the guest's phone.</li></ol>
    <p class="hint">Both phones on the same Wi-Fi, or one on the other's hotspot, connects most reliably. If the connection drops, tap Reconnect and scan again. The game picks up where it left off.</p>`;
}
function lessonPanel(){
  const L=LESSONS[S.li];
  if (L.kind==='online') return S.players.length ? matchPanel() : lobbyPanel();
  if (L.kind==='match') return matchPanel();
  const last = S.li===PLAY_IDX-1;
  return `<div class="eyebrow">Lesson ${S.li+1} of ${PLAY_IDX}</div><h2>${L.title}</h2>${L.body}
    <div class="goal${S.done?' ok':''}"><div class="goal-h">${S.done?'Goal complete':'Your goal'}</div><p>${L.goal}</p>${L.hint&&!S.done?`<p class="hint">${L.hint}</p>`:''}
    <div class="goal-btns">${L.build?'<button class="btn ghost" data-act="reset">Reset lesson</button>':''}<button class="btn ${S.done?'primary':'ghost'}" data-act="next">${last?'Play a full match':'Next lesson'}</button></div></div>
    ${L.kind!=='anatomy'?logView():''}`;
}
function textFallback(mine, pasteLabel){
  return `<details class="alt"${LINK.err&&mine?' open':''}><summary>Can't scan? Use a text code</summary>
    ${mine?`<p>Send this code to the other phone (AirDrop or Messages works):</p><textarea id="mycode" readonly>${LINK.text}</textarea><button class="btn ghost" data-act="copycode">Copy code</button>`:''}
    ${pasteLabel?`<p>${pasteLabel}</p><textarea id="paste" placeholder="Paste the code here"></textarea><button class="btn ghost" data-act="usecode">Connect</button>`:''}
  </details>`;
}
function lobbyView(){
  const saved=loadSaved();
  const err = LINK.err ? `<p class="err">${LINK.err}</p>` : '';
  const cancel = `<button class="btn ghost" data-act="cancellink">Cancel</button>`;
  let body='';
  switch (LINK.step){
    case 'working': body=`<h2>Getting ready…</h2><p>Preparing a connection code. This takes a few seconds.</p>`; break;
    case 'host-show': body=`<div class="eyebrow">Step 1 of 2</div><h2>Have your friend scan this</h2>
      <p>On their phone: open Bench Academy, go to Play a friend, and tap <b>Join a game</b>.</p>
      <div class="qr">${LINK.qr}</div>${err}
      <div class="big-btns"><button class="btn primary lg" data-act="scanreply">Scan their reply</button>${cancel}</div>
      ${textFallback(true,`Then paste their reply code:`)}`; break;
    case 'guest-show': body=`<div class="eyebrow">Step 2 of 2</div><h2>Show this to the host</h2>
      <p>The host taps <b>Scan their reply</b> and points their camera here. The game starts as soon as they scan it.</p>
      <div class="qr">${LINK.qr}</div>${err}<div class="big-btns">${cancel}</div>${textFallback(true,'')}`; break;
    case 'connecting': body=`<h2>Connecting…</h2><p>Linking the two phones. Keep both screens on.</p>${err}<div class="big-btns">${cancel}</div>`; break;
    case 'waiting': body=`<h2>Connected</h2><p>Waiting for the host to start the game…</p>`; break;
    default: body=`<h2>Start a two-phone game</h2>${err}
      <div class="big-btns">
        <button class="btn primary lg" data-act="host">Host a game</button>
        <button class="btn ghost lg" data-act="join">Join a game</button>
        ${saved&&saved.role==='host'?`<button class="btn ghost lg" data-act="resume">Resume saved game</button>`:''}
      </div>
      ${saved&&saved.role==='guest'?`<p class="hint">You have a game in progress as the guest. To pick it up, ask the host to tap Resume saved game, then join.</p>`:''}
      ${textFallback(false,`Joining with a text code from the host? Paste it here:`)}`;
  }
  return `<div class="lobby panel">${body}</div>`;
}
const PARTS = [
  ['kind','Card kind','Trainer cards are Items or Supporters. Energy cards pay for attacks.'],
  ['stage','Stage','Basic Pokémon are played straight from your hand. Stage 1 cards must evolve from the Pokémon named here.'],
  ['name','Name','Evolution checks this exact name.'],
  ['hp','HP','Hit Points. When damage reaches this number, the Pokémon is Knocked Out.'],
  ['type','Type','Decides which Energy its attacks want and which Pokémon are weak to it.'],
  ['ability','Ability','A power you can use during your turn. It does not end your turn.'],
  ['cost','Attack cost','One symbol per Energy needed. The star is Colorless and any Energy pays for it.'],
  ['damage','Damage','Base damage, before Weakness and Resistance are applied.'],
  ['text','Effect text','What else the card or attack does.'],
  ['weakness','Weakness','Attacks from this type do double damage to it.'],
  ['resistance','Resistance','Attacks from this type do 30 less damage to it.'],
  ['retreat','Retreat cost','Energy you discard to move this Pokémon to the Bench.'],
  ['rule','Rule box','Special rules for the card. Pokémon ex give up 2 Prize cards.']
];
function anatomyView(){
  const ids=['cindlet','pyrrox','puffkin','magmaw','potion','research','fireE'];
  let card=fullCard(S.acard);
  const present=new Set([...card.matchAll(/data-part="(\w+)"/g)].map(x=>x[1]));
  if (S.part) card=card.replaceAll(`data-part="${S.part}"`, `data-part="${S.part}" data-hl`);
  return `<div class="anat panel">
    <div class="anat-chips">${ids.map(id=>`<button class="chip${S.acard===id?' on':''}" data-act="acard" data-id="${id}">${DEF[id].name}</button>`).join('')}</div>
    <div class="anat-grid"><div class="${S.part&&present.has(S.part)?'focus':''}">${card}</div>
    <ul class="parts">${PARTS.map(([k,t,x])=>`<li><button data-act="part" data-p="${k}" class="${S.part===k?'on':''}${present.has(k)?'':' absent'}"><b>${t}${present.has(k)?'':' · not on this card'}</b><span>${x}</span></button></li>`).join('')}</ul></div></div>`;
}
function overlay(){
  if (!S.over || S.overHidden) return '';
  const won=S.over.winner===ME, lesson=S.mode==='lesson';
  let btns;
  if (lesson) btns=`<button class="btn primary" data-act="next">Play a full match</button><button class="btn ghost" data-act="reset">Replay lesson</button>`;
  else if (S.online) btns=(LINK.role==='host'?`<button class="btn primary" data-act="rematch" ${LINK.open?'':'disabled'}>Rematch</button>`:`<span class="mid-note">The host can start a rematch.</span>`)+`<button class="btn ghost" data-act="hideov">View the board</button><button class="btn ghost" data-act="leave">Menu</button>`;
  else btns=`<button class="btn primary" data-act="newmatch">Play again</button><button class="btn ghost" data-act="hideov">View the board</button><button class="btn ghost" data-act="menu">Menu</button>`;
  return `<div class="ov"><div class="ov-box"><div class="eyebrow">${won?'Victory':'Defeat'}</div><h2>${won?'You win!':`${them()} wins`}</h2><p>${S.over.why}</p><div class="goal-btns">${btns}</div></div></div>`;
}
function menuView(){
  const done=LESSONS.filter((l,i)=>i<PLAY_IDX && DONE.has(l.key)).length, next=nextLesson(), saved=loadSaved();
  const learnMeta = done===PLAY_IDX ? 'All lessons complete' : done ? `Continue: ${LESSONS[next].title}` : 'Start with lesson 1';
  const mode = (act, t, artHtml, tag, title, text, meta, extra='') => `
    <button class="mode t-${t}" data-act="${act}">
      <span class="mode-art${artHtml.includes('<img')&&artHtml.split('<img').length>2?' split':''}">${artHtml}<span class="tag">${tag}</span></span>
      <span class="mode-body"><b>${title}</b><p>${text}</p>${extra}<span class="mode-meta"><span>${meta}</span><span class="go">Play →</span></span></span>
    </button>`;
  const img = n => `<img src="art/${n}.webp" alt="" onerror="this.remove()">`;
  return `<div class="menu-h"><h1>Choose how to play</h1><p>New to the Pokémon Trading Card Game? Start with the lessons. Each one teaches a rule and lets you try it on a real board.</p></div>
  <div class="modes">
    ${mode('m-learn','F',img('cindlet'),'Single player','Learn the game',`${PLAY_IDX} short lessons, from reading a card to winning a game.`,learnMeta,
      `<span class="prog" aria-label="${done} of ${PLAY_IDX} lessons done"><i style="width:${done/PLAY_IDX*100}%"></i></span>`)}
    ${mode('m-rival','G',img('rival'),'Single player','Battle the Rival','A full match against a computer opponent on Easy, Normal or Hard, with a coach that suggests moves.',`${DECKS[RIVAL.deck].name} deck · ${DIFFS[RIVAL.diff].name}`)}
    ${mode('m-friend','W',img('pyrrox')+img('stag'),'Two phones','Play a friend','Face to face on two phones. Pair by scanning a code. No accounts and no game server.',saved&&saved.role==='host'?'Game in progress, tap to resume':'Host or join')}
  </div>
  <button class="gallery-link" data-act="m-gallery"><span class="gl-art">${img('stormwing')}${img('leviathorn')}${img('magmaw')}</span><span><b>Card gallery</b><span>Browse all ${Object.keys(DEF).length} cards in ${Object.keys(DECKS).length} decks</span></span><span class="go">→</span></button>
  <p class="menu-foot">Your lesson progress and settings are saved on this device.</p>`;
}
function rivalView(){
  const opt=(cls,act,k,on,inner)=>`<button class="${cls}${on?' on':''}" data-act="${act}" data-k="${k}" aria-pressed="${on}">${inner}</button>`;
  return `<div class="menu-h"><button class="back" data-act="menu-home">← All modes</button><h1>Battle the Rival</h1><p>Pick your deck and how hard the Rival plays.</p></div>
  <h3 class="sec">Your deck</h3>
  <div class="decks">${Object.entries(DECKS).map(([k,d])=>opt(`deck t-${d.type}`,'pick-deck',k,RIVAL.deck===k,
    `<span class="deck-art"><img src="art/${d.star}.webp" alt="" onerror="this.remove()"></span><span class="deck-body"><b>${eIcon(d.type)} ${d.name}</b><span>${d.blurb}</span></span>`)).join('')}</div>
  <h3 class="sec">Rival difficulty</h3>
  <div class="diffs">${Object.entries(DIFFS).map(([k,d])=>opt('diff','pick-diff',k,RIVAL.diff===k,`<b>${d.name}</b><span>${d.blurb}</span>`)).join('')}</div>
  <h3 class="sec">Rival's deck</h3>
  <div class="chiprow">${opt('chip','pick-opp','random',RIVAL.opp==='random','Random')}${Object.entries(DECKS).map(([k,d])=>opt('chip','pick-opp',k,RIVAL.opp===k,`${eIcon(d.type)} ${d.name}`)).join('')}</div>
  <button class="btn primary lg start" data-act="start-rival">Start battle</button>`;
}
function galleryView(){
  const F={all:['All',()=>true],F:['Fire',d=>d.type==='F'&&d.kind==='pokemon'],W:['Water',d=>d.type==='W'&&d.kind==='pokemon'],G:['Grass',d=>d.type==='G'&&d.kind==='pokemon'],
    L:['Lightning',d=>d.type==='L'&&d.kind==='pokemon'],C:['Colorless',d=>d.type==='C'&&d.kind==='pokemon'],T:['Trainers',d=>d.kind==='item'||d.kind==='supporter'],E:['Energy',d=>d.kind==='energy']};
  const list=Object.values(DEF).filter(F[GALLERY][1]);
  const decksWith = id => Object.values(DECKS).filter(d=>d.list[id]).map(d=>d.name).join(', ');
  return `<div class="menu-h"><button class="back" data-act="menu-home">← All modes</button><h1>Card gallery</h1><p>${Object.keys(DEF).length} cards. Every one is playable in at least one deck or lesson.</p></div>
  <div class="chiprow">${Object.entries(F).map(([k,[n]])=>`<button class="chip${GALLERY===k?' on':''}" data-act="gal" data-k="${k}">${n}</button>`).join('')}</div>
  <div class="gallery">${list.map(d=>`<figure>${fullCard(d.id)}<figcaption>${decksWith(d.id)?`In ${decksWith(d.id)}`:'Lessons only'}</figcaption></figure>`).join('')}</div>`;
}
function render(){
  const menu=$('#menu'), layout=$('#layout'), insp0=$('#insp');
  $('#menu-btn').hidden = MENU;
  if (MENU){
    menu.hidden=false; layout.hidden=true; $('#nav').innerHTML='';
    insp0.classList.remove('open'); $('#app').classList.remove('sheet'); $('#ovl').innerHTML='';
    menu.innerHTML = MENU_VIEW==='rival' ? rivalView() : MENU_VIEW==='gallery' ? galleryView() : menuView(); return;
  }
  menu.hidden=true; layout.hidden=false;
  if (S.replaying) return;
  checkLesson();
  const L=LESSONS[S.li];
  const hs=$('#hand')?.scrollLeft||0;
  const num = l => l.kind==='match' ? '▶' : l.kind==='online' ? '⇄' : LESSONS.indexOf(l)+1;
  $('#nav').innerHTML = S.mode!=='lesson' ? '' : LESSONS.map((l,i)=>i>=PLAY_IDX?'':`<button class="chip${i===S.li?' on':''}${DONE.has(l.key)?' done':''}" data-act="nav" data-i="${i}"><span class="n">${num(l)}</span>${l.title}</button>`).join('');
  $('#lesson').innerHTML = lessonPanel();
  const insp=$('#insp');
  const lobby = L.kind==='online' && (LINK.inLobby || !S.players.length);
  if (L.kind==='anatomy' || lobby){
    $('#stage').innerHTML = lobby ? lobbyView() : anatomyView();
    insp.hidden=true; insp.classList.remove('open'); $('#app').classList.remove('sheet');
  } else {
    $('#stage').innerHTML = boardView() + handView();
    insp.hidden=false; insp.innerHTML=inspView();
    const open=!!(S.ui.sel||S.ui.mode);
    insp.classList.toggle('open',open); $('#app').classList.toggle('sheet',open);
  }
  const h=$('#hand'); if (h) h.scrollLeft=hs;
  $('#ovl').innerHTML=overlay();
  if (S.hit){ const id=S.hit; setTimeout(()=>{ if (S.hit===id) S.hit=null; },500); }
}

/* ---------- input ---------- */
document.addEventListener('click', e => {
  const b=e.target.closest('[data-act]'); if (!b || b.disabled) return;
  const a=b.dataset.act, d=b.dataset;
  switch (a){
    case 'nav': return goLesson(+d.i);
    case 'menu': return goMenu();
    case 'm-learn': return goLesson(nextLesson());
    case 'm-rival': MENU_VIEW='rival'; render(); return window.scrollTo(0,0);
    case 'm-gallery': MENU_VIEW='gallery'; render(); return window.scrollTo(0,0);
    case 'menu-home': MENU_VIEW='home'; return render();
    case 'pick-deck': RIVAL.deck=d.k; if (RIVAL.opp===d.k) RIVAL.opp='random'; saveRival(); return render();
    case 'pick-diff': RIVAL.diff=d.k; saveRival(); return render();
    case 'pick-opp': RIVAL.opp=d.k; saveRival(); return render();
    case 'start-rival': return goLesson(PLAY_IDX);
    case 'gal': GALLERY=d.k; return render();
    case 'setup': return goMenu('rival');
    case 'm-friend': return goLesson(FRIEND_IDX);
    case 'next': return goLesson(S.li+1);
    case 'reset': return goLesson(S.li);
    case 'newmatch': return goLesson(PLAY_IDX);
    case 'hideov': S.overHidden=true; return render();
    case 'part': S.part=d.p; S.partsSeen.add(d.p); return render();
    case 'acard': S.acard=d.id; return render();
    case 'close': clearUI(); return render();
    case 'host': return hostGame(false);
    case 'resume': return hostGame(true);
    case 'join': LINK.role='guest'; return scanFor(code => useHostCode(code));
    case 'scanreply': return scanFor(code => useReplyCode(code));
    case 'reconnect': LINK.inLobby=true; LINK.err=''; if (LINK.role==='host') return hostGame(true); LINK.step='choose'; return render();
    case 'cancellink': Net.close(); LINK.step='choose'; LINK.err=''; if (S.online && S.players.length){ LINK.inLobby=false; LINK.lost=true; } return render();
    case 'leave': return goMenu();
    case 'rematch': return rematch();
    case 'copycode': {
      const t=$('#mycode'); const done=()=>toast('Code copied.');
      if (navigator.clipboard) navigator.clipboard.writeText(LINK.text).then(done).catch(()=>{ t.select(); toast('Select and copy the code.'); });
      else { t.select(); toast('Select and copy the code.'); }
      return;
    }
    case 'usecode': {
      const code=($('#paste')?.value||'').trim(); if (!code) return toast('Paste a code first.');
      return LINK.step==='host-show' ? useReplyCode(code) : useHostCode(code);
    }
  }
  if (S.over) return;
  if (S.busy){ toast('Wait for the Rival to finish their turn.'); return; }
  if (a==='hand'){
    if (S.ui.mode==='promote') return toast('First choose a new Active Pokémon from your Bench.');
    S.ui={sel:{kind:'hand',uid:+d.uid},mode:null,data:null}; return render();
  }
  if (a==='mon') return onMon(+d.owner,+d.uid);
  if (a==='do') return doUI(d.a,d);
});
function onMon(owner,uid){
  const mode=S.ui.mode;
  if (!mode){ S.ui.sel={kind:'mon',owner,uid}; return render(); }
  const p=P(ME), m=findMon(P(owner),uid);
  if (mode==='lure'){ if (owner===ME || !P(owner).bench.includes(m)) return toast(`Choose one of your opponent's Benched Pokémon.`); const c=S.ui.data; clearUI(); return act('trainer',{c,x:uid}); }
  if (owner!==ME) return toast('Choose one of your own Pokémon.');
  if (mode==='battery'){ if (!p.bench.includes(m)) return toast('Choose a Benched Pokémon.'); const c=S.ui.data; clearUI(); return act('trainer',{c,x:uid}); }
  const onBench=p.bench.includes(m);
  if (mode==='promote'){ if (!onBench) return toast('Choose a Benched Pokémon.'); clearUI(); return act('promote',{m:uid}); }
  if (mode==='attach') act('attach',{c:S.ui.data,m:uid});
  else if (mode==='evolve'){ const c=p.hand.find(x=>x.uid===S.ui.data), r=whyNotEvolve(ME,c,m); if (r) return toast(r); act('evolve',{c:c.uid,m:uid}); }
  else if (mode==='potion'){ if (!m.damage) return toast(`${topC(m).name} has no damage to heal.`); act('trainer',{c:S.ui.data,x:uid}); }
  else if (mode==='switch'){ if (!onBench) return toast('Choose a Benched Pokémon.'); act('trainer',{c:S.ui.data,x:uid}); }
  else if (mode==='retreat'){ if (!onBench) return toast('Choose a Benched Pokémon.'); act('retreat',{m:uid}); }
  else if (mode==='search') return toast('Pick a card from the list in the panel.');
  const keep = findMon(p,uid) ? uid : p.active.uid;
  S.ui={sel:{kind:'mon',owner:ME,uid:mode==='retreat'||mode==='switch'?p.active.uid:keep},mode:null,data:null};
  render();
}
function doUI(a,d){
  const p=P(ME);
  if (a==='cancel'){ if (S.ui.mode!=='promote'){ S.ui.mode=null; S.ui.data=null; } return render(); }
  if (S.locked) return toast(`This lesson's turn is over. Press Reset lesson to try again.`);
  if (S.online && LINK.lost) return toast('Reconnect the phones before making a move.');
  if (a==='start'){
    if (!p.active) return toast('Choose an Active Pokémon first.');
    if (S.ready[ME]) return;
    clearUI(); return act('ready');
  }
  if (!S.setup && S.cur!==ME) return toast(S.online?'Wait for your opponent to finish their turn.':'Wait for your turn.');
  if (S.ui.mode==='promote') return toast('Choose a new Active Pokémon from your Bench first.');
  const sel=S.ui.sel, hc = sel?.kind==='hand' ? p.hand.find(c=>c.uid===sel.uid) : null;
  switch (a){
    case 'bench': { const r=whyNotBench(ME,hc); if (r) return toast(r); const uid=hc.uid; act('bench',{c:uid}); S.ui={sel:{kind:'mon',owner:ME,uid},mode:null,data:null}; break; }
    case 'attach': { const r=whyNotAttach(ME); if (r) return toast(r); S.ui.mode='attach'; S.ui.data=hc.uid; break; }
    case 'evolve': S.ui.mode='evolve'; S.ui.data=hc.uid; break;
    case 'play': {
      const r=whyNotTrainer(ME,hc); if (r) return toast(r);
      const MODES={potion:'potion',superpotion:'potion',switch:'switch',lurewhistle:'lure',sparebattery:'battery',fieldguide:'search',retriever:'search',energysearch:'search',rushorders:'search'};
      if (MODES[hc.id]){ S.ui.mode=MODES[hc.id]; S.ui.data=hc.uid; }
      else { clearUI(); return act('trainer',{c:hc.uid}); }
      break;
    }
    case 'search': { const c=S.ui.data; clearUI(); return act('trainer',{c,x:d.id}); }
    case 'retreat': { const r=whyNotRetreat(ME); if (r) return toast(r); S.ui.mode='retreat'; break; }
    case 'attack': { const r=whyNotAttack(ME,+d.i); if (r) return toast(r); return act('attack',{i:+d.i}); }
    case 'ability': { const m=findMon(p,+d.uid), r=whyNotAbility(ME,m); if (r) return toast(r); return act('ability',{m:m.uid}); }
    case 'end': clearUI(); return act('end');
  }
  render();
}

$('#logo').innerHTML = `<svg viewBox="0 0 24 24"><path d="${TYPE.F.g}"/></svg>`;
if (location.hash==='#friend') goLesson(FRIEND_IDX); else goMenu();
