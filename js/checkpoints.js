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
    title: 'TEIDE',
    color: '#8a5a3c',
    image: 'assets/teide.jpg',
    fact: "Spaniens högsta topp på 3 718 meter – och jordens tredje högsta vulkan mätt från havsbotten. Guancherna kallade den för Echeyde, vilket betyder ”helvete”. Dess Mars-liknande sluttningar har till och med agerat stand-in för den röda planeten i filmer!",
    trip: null, // t.ex. "Dag 2 — linbanan upp kl 10:00. Ta med varm jacka, det är kallt på toppen!"
  },
  {
    at: 0.22,
    icon: '🪨',
    title: 'Roques de García',
    color: '#b06a3a',
    fact: "En samling vilda vulkaniska klippformationer vid Teides fot. Den mest kända, Roque Cinchado, pryddes en gång Spaniens gamla 1 000-pesetassedel.",
    trip: null,
  },
  {
    at: 0.34,
    icon: '🧗',
    title: 'Los Gigantes',
    color: '#3a6ea5',
    fact: "Lodräta havsklippor som reser sig upp till ~600 m rakt ur Atlanten. Guancherna kallade dem ”Helvetets väggar”. Båtturer här får ofta sällskap av delfiner och valar.",
    trip: null,
  },
  {
    at: 0.46,
    icon: '🏔️',
    title: 'Masca',
    color: '#5a8c4a',
    fact: "En liten by gömd i Teno-bergen, med smeknamnet ”Kanarieöarnas Machu Picchu”. Den var en gång ett perfekt piratgömställe, bara nåbar via en brant ravin.",
    trip: null,
  },
  {
    at: 0.58,
    icon: '🐧',
    title: 'Loro Parque',
    color: '#2ec4b6',
    fact: "En världsberömd djurpark i Puerto de la Cruz – med världens största inomhusanläggning för pingviner och en enorm akvarietunnel.",
    trip: null,
  },
  {
    at: 0.70,
    icon: '🏛️',
    title: 'La Laguna',
    color: '#c98b3a',
    fact: "San Cristóbal de La Laguna – Kanarieöarnas ursprungliga huvudstad, grundad 1496, och en UNESCO-världsarvsstad med kullerstensgator och färgglada koloniala hus.",
    trip: null,
  },
  {
    at: 0.82,
    icon: '🌿',
    title: 'Anaga Rural Park',
    color: '#2f7d4f',
    fact: "Ett UNESCO-biosfärområde med uråldrig lagerskog (laurisilva) – en levande rest av de förhistoriska skogar som en gång täckte Medelhavsområdet.",
    trip: null,
  },
  {
    at: 0.93,
    icon: '🏖️',
    title: 'Playa de las Teresitas',
    color: '#e8c46a',
    fact: "Den gyllene sanden på denna palmkantade strand nära Santa Cruz är inte lokal – den skeppades hit från Sahara, eftersom Teneriffas naturliga stränder består av svart vulkansand!",
    trip: null,
  },
];
