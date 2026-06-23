/* ---- checkpoints.js : the LEARNING content of the game ----
 *
 * Each landmark shows an info card when the player drives past it.
 *
 * HOW TO ADD YOUR DECEMBER TRIP DETAILS:
 *   Fill in the `trip` field of any landmark with the real itinerary info
 *   (day, hotel, activity, time, booking, etc). Leave it as null/"" to hide
 *   the "ON OUR TRIP" box. You can also add brand-new entries — just give each
 *   one a unique road position via `at` (fraction of the track, 0..1) and an
 *   `icon`, `title`, and `fact`.
 *
 * Facts below are real, sourced Tenerife landmark facts (see README).
 */

const CHECKPOINTS = [
  {
    at: 0.10,
    icon: '🌋',
    title: 'Mount Teide',
    color: '#8a5a3c',
    fact: "Spain's highest peak at 3,718 m — and the 3rd-tallest volcano on Earth measured from the ocean floor. The Guanches called it Echeyde, meaning 'hell'. Its Mars-like slopes have doubled as the Red Planet in movies!",
    trip: null, // e.g. "Day 2 — cable car up at 10:00. Bring a warm jacket, it's cold at the top!"
  },
  {
    at: 0.22,
    icon: '🪨',
    title: 'Roques de García',
    color: '#b06a3a',
    fact: "A cluster of wild volcanic rock formations beside Teide. The most famous, Roque Cinchado, was once printed on Spain's old 1,000-peseta banknote.",
    trip: null,
  },
  {
    at: 0.34,
    icon: '🧗',
    title: 'Los Gigantes',
    color: '#3a6ea5',
    fact: "Sheer sea cliffs rising up to ~600 m straight out of the Atlantic. The Guanches called them the 'Walls of Hell'. Boat trips here often spot dolphins and whales.",
    trip: null,
  },
  {
    at: 0.46,
    icon: '🏔️',
    title: 'Masca',
    color: '#5a8c4a',
    fact: "A tiny village hidden in the Teno mountains, nicknamed the 'Machu Picchu of the Canaries'. It was once a perfect pirate hideout, reachable only by a steep ravine trail.",
    trip: null,
  },
  {
    at: 0.58,
    icon: '🐧',
    title: 'Loro Parque',
    color: '#2ec4b6',
    fact: "A world-famous animal park in Puerto de la Cruz, home to the world's largest indoor penguin exhibit and a huge aquarium tunnel.",
    trip: null,
  },
  {
    at: 0.70,
    icon: '🏛️',
    title: 'La Laguna',
    color: '#c98b3a',
    fact: "San Cristóbal de La Laguna — the original capital of the Canary Islands, founded in 1496, and a UNESCO World Heritage town of cobbled streets and colourful colonial houses.",
    trip: null,
  },
  {
    at: 0.82,
    icon: '🌿',
    title: 'Anaga Rural Park',
    color: '#2f7d4f',
    fact: "A UNESCO Biosphere Reserve of ancient laurisilva (laurel) forest — a living relic of the prehistoric woodlands that once covered the Mediterranean.",
    trip: null,
  },
  {
    at: 0.93,
    icon: '🏖️',
    title: 'Playa de las Teresitas',
    color: '#e8c46a',
    fact: "The golden sand on this palm-lined beach near Santa Cruz isn't local — it was shipped in from the Sahara Desert, since Tenerife's natural beaches are volcanic black sand!",
    trip: null,
  },
];
