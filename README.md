# 🌴 Tenerife Drive

A fullscreen, pixel-art **OutRun-style arcade driving game** about our **December 2026
trip to Tenerife**. Drive down the sunset highway, cruise past the island's landmarks,
and collect a "stamp" at each one — every stamp pops up a fun fact about the island and
(once you fill them in) a detail about our actual trip.

Built with plain HTML5 Canvas + vanilla JavaScript — **no build step, no dependencies**.
Runs fullscreen in Chrome on desktop and in Safari/Chrome on iPhone & Android.

## ▶️ How to run

**Easiest:** double-click `index.html` to open it in your browser.

**Local dev server:**

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

### 🌐 Serving the live site (teneriffa.candycluster.com)

The site is served from this machine on **`localhost:8080`**, which the reverse proxy maps
to `https://teneriffa.candycluster.com`. Use the included script — it pulls the latest from
GitHub and serves on port 8080, re-syncing in the background so new commits go live
automatically:

```bash
./serve.sh
```

Options: `PORT=8080` (default) and `SYNC_INTERVAL=60` seconds between GitHub pulls
(`SYNC_INTERVAL=0` to disable auto-sync). To keep it running across reboots, wrap it in a
systemd service, a `tmux`/`screen` session, or your process manager of choice.

Tap **START ENGINE**, then:

| | Desktop | Mobile |
|---|---|---|
| Steer | ◀ ▶ arrow keys / A · D | hold the on-screen ◀ ▶ buttons |
| Accelerate | ▲ / W | **GAS** button |
| Brake | ▼ / S | **BRAKE** button |
| Fullscreen | press **F** or the ⛶ button | tap the ⛶ button |

## ✏️ Adding our real trip itinerary

All the learning content lives in **`js/checkpoints.js`**. Each landmark looks like this:

```js
{
  at: 0.10,            // where on the track it appears (0 = start, 1 = end)
  icon: '🌋',
  title: 'Mount Teide',
  color: '#8a5a3c',    // billboard color
  fact: "Spain's highest peak at 3,718 m ...",
  trip: null,          // <-- ADD OUR TRIP DETAIL HERE
}
```

To attach a real itinerary detail, just fill in `trip`, e.g.:

```js
trip: "Day 2 — cable car booked for 10:00. Bring a warm jacket, it's freezing at the top!",
```

That text shows up in a green **"ON OUR TRIP"** box on the landmark's card. Leave it as
`null` to hide the box. You can also add brand-new landmarks — copy an entry, give it a
unique `at` position, and it appears in the game automatically (no other code changes).

## 🗂️ Project structure

```
index.html         UI shell (canvas + overlays + touch controls)
css/style.css      Fullscreen responsive + pixel-art styling
js/util.js         Math + pseudo-3D projection helpers
js/sprites.js      Procedural pixel-art (car, palms, Teide, skyline, signs)
js/track.js        Builds the road (curves, hills) and places scenery + checkpoints
js/checkpoints.js  ← THE LEARNING CONTENT (edit this for trip details)
js/input.js        Keyboard, touch and fullscreen handling
js/game.js         Main loop, physics, renderer, checkpoint cards
```

## 🚧 Status

This is the **playable prototype**. Ideas for later: background music & engine sound,
a lap timer / score, real landmark photos on the cards, and multiple routes per region of
the island.

## Landmark facts — sources

- Mount Teide facts — [nightskiestenerife.com](https://www.nightskiestenerife.com/5-fun-facts-about-mount-teide), [volcanoteide.com](https://www.volcanoteide.com/en/national_park)
- Los Gigantes, Masca, La Laguna, Anaga — [civitatis.com](https://www.civitatis.com/blog/en/things-to-do-tenerife/), [one-million-places.com](https://one-million-places.com/en/spain/tenerife-cliffs-los-gigantes-mountain-village-masca)
- Loro Parque — [loroparque.com](https://www.loroparque.com/en/what-to-see-in-tenerife/)
