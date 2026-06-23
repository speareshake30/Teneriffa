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
    icon: '📅',
    title: 'NÄR OCH VAR',
    color: '#3a8fb0',
    image: 'assets/lasgalletas.webp',
    fact: "Molly, Andreas, Guje, Marcus och Linnea är nere åtminstone 21:a December till 3:e Januari. Det är vanligtvis mellan 18-24 grader varmt vid den tiden på året. Vi bor i närheten av Las Galletas (Costa Silencio) med gångavstånd till havet!",
    trip: null,
  },
  {
    at: 0.34,
    icon: '🎉',
    title: 'DET BLIR KUL',
    color: '#e0913a',
    image: 'assets/detblirkul.jpg',
    fact: "Alla kommer att göra sin egen grej men fira julafton och nyår tillsammans med BBQ på Gujes terass! Vi vill att 10-12 pers ska komma men vi vet att vi iallafall blir 5. Restid (Arlanda ARN → Tenerife Sur, TFS) tar ungefär 6 timmar.",
    trip: null,
  },
  {
    at: 0.46,
    icon: '🧮',
    title: 'PRAKTISKT',
    color: '#7a8c4a',
    fact: "Alla bokar sin/sina egna resor men här har vi en liten kalkyl för att ge lite referensramar. Ju tidigare bokning desto billigare.\n\nBeräknade kostnader:\nHyrbil ~330 kr/dag\nFlyg 4600 kr t/r +/- per person\nBoende (hotell/airbnb) ~1000 kr per natt\n\nEn person:\nTotalt 1 vecka: ~15 000 kr exkl. mat\nTotalt 2 veckor: ~22 000 kr exkl. mat\n\nTvå personer, delat boende och bil:\nTotalt 1 vecka: 10 000 kr p.p. exkl. mat\nTotalt 2 veckor: 14 000 kr p.p. exkl. mat",
    trip: null,
  },
  {
    at: 0.58,
    icon: '🐧',
    title: 'Loro Parque',
    color: '#2ec4b6',
    image: 'assets/loroparque.jpg',
    fact: "En världsberömd djurpark i Puerto de la Cruz – med världens största inomhusanläggning för pingviner och en enorm akvarietunnel.",
    trip: null,
  },
  {
    at: 0.70,
    icon: '🏛️',
    title: 'La Laguna',
    color: '#c98b3a',
    image: 'assets/lalaguna.jpg',
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
