/* ---- track.js : builds the pseudo-3D road (segments, curves, hills) ----
 *
 * Classic OutRun-style segment list. Each segment has a near edge (p1) and a
 * far edge (p2) in world space; the renderer projects them to screen.
 * Roadside sprites (palms, buildings) and checkpoint signs are attached here.
 */

const Track = {
  segmentLength: 200,   // world length of a single segment
  rumbleLength: 3,      // segments per rumble-strip color flip
  roadWidth: 1100,      // half-width of the road in world units
  lanes: 2,

  segments: [],

  // Color themes alternate to create the moving rumble-strip effect.
  COLORS: {
    LIGHT: { road: '#54505e', grass: '#d8b676', rumble: '#f6f6f6', lane: '#f6f6f6', ocean: '#2f78ad', rock: '#6a5b4a' },
    DARK:  { road: '#4b4754', grass: '#caa45f', rumble: '#d84343', lane: null, ocean: '#2a6c9e', rock: '#5a4d3e' },
    START: { road: '#dddddd', grass: '#d8b676', rumble: '#dddddd', lane: null, ocean: '#2f78ad', rock: '#6a5b4a' },
  },

  get length() {
    return this.segments.length * this.segmentLength;
  },

  findSegment(z) {
    return this.segments[Math.floor(z / this.segmentLength) % this.segments.length];
  },

  lastY() {
    return this.segments.length === 0 ? 0 : this.segments[this.segments.length - 1].p2.world.y;
  },

  addSegment(curve, y) {
    const n = this.segments.length;
    const prevY = this.lastY();
    this.segments.push({
      index: n,
      p1: { world: { x: 0, y: prevY, z: n * this.segmentLength }, camera: {}, screen: {} },
      p2: { world: { x: 0, y: y, z: (n + 1) * this.segmentLength }, camera: {}, screen: {} },
      curve: curve,
      sprites: [],
      checkpoint: null,
      // jagged cliff edge: how far the rock/ocean boundary juts out (in road-widths)
      oceanJitter: 0.10 + (n % 4) * 0.07 + (n % 7) * 0.03,
      color: Math.floor(n / this.rumbleLength) % 2 ? this.COLORS.DARK : this.COLORS.LIGHT,
    });
  },

  addRoad(enter, hold, leave, curve, height) {
    const startY = this.lastY();
    const endY = startY + height * this.segmentLength;
    const total = enter + hold + leave;
    for (let n = 0; n < enter; n++) {
      this.addSegment(Util.easeIn(0, curve, n / enter), Util.easeInOut(startY, endY, n / total));
    }
    for (let n = 0; n < hold; n++) {
      this.addSegment(curve, Util.easeInOut(startY, endY, (enter + n) / total));
    }
    for (let n = 0; n < leave; n++) {
      this.addSegment(Util.easeInOut(curve, 0, n / leave), Util.easeInOut(startY, endY, (enter + hold + n) / total));
    }
  },

  // Build a varied loop of straights, curves and hills.
  build() {
    this.segments = [];
    const S = { len: 25, curve: { easy: 2, med: 4, hard: 6 }, hill: { low: 20, med: 40, high: 60 } };

    this.addRoad(20, 20, 20, 0, 0);                       // start straight
    this.addRoad(S.len, S.len, S.len, S.curve.med, 0);    // right
    this.addRoad(S.len, S.len, S.len, 0, S.hill.med);     // uphill
    this.addRoad(S.len, S.len, S.len, -S.curve.med, 0);   // left
    this.addRoad(S.len, S.len, S.len, 0, -S.hill.med);    // downhill
    this.addRoad(S.len, S.len, S.len, S.curve.hard, S.hill.low);
    this.addRoad(S.len, S.len, S.len, 0, 0);
    this.addRoad(S.len, S.len, S.len, -S.curve.hard, -S.hill.low);
    this.addRoad(S.len, S.len, S.len, S.curve.easy, S.hill.high);
    this.addRoad(S.len, S.len, S.len, -S.curve.med, -S.hill.med);
    this.addRoad(40, 40, 40, 0, 0);                       // long finishing straight

    // Mark the very first few segments as start/finish.
    for (let n = 0; n < 8; n++) {
      this.segments[n + 4].color = this.COLORS.START;
    }

    this.placeScenery();
    this.placeCheckpoints();
  },

  placeScenery() {
    const n = this.segments.length;
    // The RIGHT side of the road is ocean, so all land scenery (palms, towns)
    // lives on the LEFT (negative offsets) only.
    for (let i = 10; i < n; i++) {
      // palms densely line the left (land) side of the road
      if (i % 2 === 0) {
        this.segments[i].sprites.push({ type: 'palm', offset: -1.4 - Math.random() * 0.6, scale: 1 });
      }
      // occasional second palm further inland for depth
      if (i % 5 === 2) {
        this.segments[i].sprites.push({ type: 'palm', offset: -(2.3 + Math.random() * 0.9), scale: 1 });
      }
      // building clusters (towns) on the left
      const town = (Math.floor(i / 60) % 2) === 1;
      if (town && i % 7 === 0) {
        this.segments[i].sprites.push({
          type: 'building',
          offset: -(2.4 + Math.random() * 1.2),
          scale: 1,
          variant: Util.randInt(0, 5),
        });
      }
    }
  },

  placeCheckpoints() {
    const n = this.segments.length;
    CHECKPOINTS.forEach((cp, idx) => {
      const segIndex = Util.clamp(Math.floor(cp.at * n), 2, n - 3);
      const seg = this.segments[segIndex];
      seg.checkpoint = { ...cp, id: idx, hit: false };
      // a sign on the left (land side) so the player sees what's coming
      seg.sprites.push({ type: 'sign', offset: -1.7, scale: 1.1, color: cp.color });
    });
  },
};
