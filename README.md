# 🌳 Hollowroot: Rise of the Elven Realm

**An enormous idle kingdom-builder for your phone.** Tap the World-Tree, raise a realm from a burnt glade to an Ascendant Realm, level a hero, bond with 41 creatures, conquer a 30-region map, live through an 84-chapter story, then Rebirth and Ascend to do it all again, bigger.

It is a single self-contained web page: no installs, no accounts, no libraries, no ads. Your progress saves in your own browser and keeps building while you are away.

> Original world and story. Inspired by the joy of LitRPG kingdom-building tales, but it is not affiliated with any book or author.

---

## ▶ Play

**Live (after you enable GitHub Pages, see below):** `https://YOUR-USERNAME.github.io/YOUR-REPO/`

**On your phone:** open the link in Safari or Chrome, then **Share → Add to Home Screen**. It launches full-screen like an app.

**Locally:** double-click `index.html`.

---

## 🚀 Put it on GitHub Pages (2 minutes)

1. Create a new **public** repository on GitHub (e.g. `hollowroot`).
2. Upload everything in this folder (drag and drop works on github.com: *Add file → Upload files*). `index.html` must be in the repo root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, then **Save**.
5. Wait about a minute. Your game is live at the URL shown on that page.

Updating later: replace `index.html` in the repo and commit. Players keep their saves.

---

## 🎮 How the game works

### The loop
- **Tap** the World-Tree to gather your focus resource (wood, stone, food, iron, gold, mana, crystal).
- **Build** producers, houses and civic buildings. Every building doubles its output at milestone counts.
- **Assign workers** to resources. Population grows with housing.
- **Advance through 8 eras:** Ruined Glade → Hamlet → Village → Town → City → Kingdom → Empire → Ascendant Realm. Each era needs resources *and* hero level, and unlocks new buildings, units, regions, spells and creatures.
- **Research** 60 technologies across 10 branches (real-time timers that keep running while you are away).
- **Conquer** the 30-hex map for permanent bonuses; send **expeditions**; defend against **raids** with your army.

### The hero 🧝
- Levels 1 to 200. **XP comes only from your actions**: tapping, raids, expeditions, chapters, bounties, wonders and events. Nothing is earned just by waiting.
- 6 attributes (Might, Agility, Intellect, Wisdom, Charisma, Vitality), 4 classes (Rootwarden, Warlord, Archmage, Steward), 28 skills, 4 gear slots with upgrades.
- 7 **companions** join as your realm grows (Smolder, Sylvara, Tuck Burrowby, Orrin Gearwright, Mira Thistle, Grakk the Reformed, Old Bark), each with their own levels and story beats.

### 🐾 Creatures: bond, boon, evolve
- **41 species** across 6 rarities (Common to Mythic). Find them as **wild encounters**, with the **Call of the Wild**, or earn them by conquering regions, finishing chapters and building wonders.
- **Bond** each one from level 1 to 30. Every bond level adds a passive boon; milestone boons unlock at 5, 15 and 30.
- At **bond 10** each creature unlocks an **active skill** (timed buffs and instant gains).
- At **bond 30** they can **Evolve** into a stronger form.
- Take up to **9 creatures** with you (slots unlock with eras and buildings). The **Codex** records lore that grows as you bond.
- Four creature buildings (Stable, Aviary, Grand Menagerie, Beastmaster's Lodge) and the **Beastlore** research branch boost the whole system.

### 📖 Story
- **84 chapters in 7 acts**, each unlocked by playing (building, conquering, bonding, ascending and more).
- **16 branching Tales**: permanent choices that change your realm's bonuses for the rest of the save.
- Random events, companion story beats, and a running Chronicle log.

### 🌦 Living world
- A 20-minute **season cycle** (Spring, Summer, Autumn, Winter), each with its own bonuses.
- A **Bounty Board** with rotating goals and rewards.
- 8 types of random events, 12 edicts, 6 civic pillars, 7 wonders, 7 spells, 11 expedition types and 16 relics to find.
- 139 achievements.

### ♻️ Two layers of prestige
- **Rebirth**: reset the realm for **Heartwood** and spend it in a 14-item shop. Your hero, companions, creatures, relics, story and trophies stay.
- **Ascension**: later, trade your Heartwood history for **Worldseeds** and a 12-item permanent shop. Creatures, tales, chapters and achievements persist through both.

### 🎨 Presentation
- A living, animated realm scene that changes with every era, with day/night, seasons, fireflies, a growing village, and your hero, party and creatures wandering the grounds.
- Era-advance and level-up cinematics, particle effects, creature portraits with rarity auras, and a glowing hex map.
- Built mobile-first for portrait phones. Animations can be turned off in **Settings**.

### 💾 Saving
- Autosaves every 15 seconds and when you leave the page, in your browser's local storage.
- **Export / Import** a save as text in Settings (back up or move between devices).
- Offline progress is capped and runs at reduced efficiency (both improve with upgrades).
- Clearing your browser data erases the save, so export now and then.

---

## 📁 What's in this package

| File | Purpose |
|---|---|
| `index.html` | **The whole game** (this is all GitHub Pages needs) |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `icon.svg` | Home-screen app icon and metadata |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |
| `src/` | Readable source: data, engine and UI scripts, stylesheet, and the build script |

### Rebuilding from source
`index.html` is generated by stitching `src/*.js` and `src/style.css` together.

```bash
cd src
python3 build.py     # writes ../index.html
```

Source layout: `data*.js` (content: buildings, techs, creatures, story, tales), `engine1-3.js` (stats, actions, creatures, seasons, prestige), `ui1-5.js` (screens and the graphics layer).

### Balance testing
`src/sim2.js` is a headless progression bot used to tune pacing:

```bash
node src/sim2.js 24 active        # simulate 24 hours of active play
node src/sim2.js 24 idle          # no tapping
node src/sim2.js 24 active noprest
```

---

## 🛠 Tech notes
- Plain HTML, CSS and JavaScript in one file (about 235 KB). No dependencies, no network calls.
- Works offline once loaded. Tested in desktop Chromium with mobile emulation; the balance was tuned with a simulated player, so real-world pacing may need adjustment.

## 🐛 Tuning and feedback
If something feels too fast, too slow, or too grindy, the numbers to adjust are in `src/data1.js` (era costs), `src/data2.js` (research time and cost: `TTIME`, `TB`), `src/engine1.js` (XP curve: `xpNeed`) and `src/engine3.js` (creature bond costs).

Enjoy the realm. 🌱
