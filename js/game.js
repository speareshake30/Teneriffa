/* ---- game.js : main loop, pseudo-3D renderer, physics, UI ---- */

const Game = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,

  // ---- camera / projection ----
  cameraHeight: 1000,
  cameraDepth: 0,
  fieldOfView: 100,
  drawDistance: 160,

  // ---- physics ----
  position: 0,
  playerX: 0,         // -1..1 across the road
  speed: 0,
  maxSpeed: 0,
  accel: 0,
  breaking: 0,
  decel: 0,
  offRoadDecel: 0,
  offRoadLimit: 0,
  centrifugal: 0.3,

  // ---- state ----
  state: 'menu',      // menu | playing | card | finished
  lastIndex: 0,
  stamps: 0,
  skyBend: 0,
  lastTime: 0,

  init() {
    this.canvas = document.getElementById('screen');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.cameraDepth = 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180);
    this.maxSpeed = Track.segmentLength / (1 / 60); // one segment per frame @60fps
    this.accel = this.maxSpeed / 5;
    this.breaking = -this.maxSpeed;
    this.decel = -this.maxSpeed / 5;
    this.offRoadDecel = -this.maxSpeed / 2;
    this.offRoadLimit = this.maxSpeed / 4;
    this.cruiseSpeed = this.maxSpeed * 0.22; // slow automatic cruising speed

    Track.build();
    Input.init();
    this.resize();
    window.addEventListener('resize', () => this.resize());

    document.getElementById('stampsTotal').textContent = CHECKPOINTS.length;

    this._wireUI();
    requestAnimationFrame((t) => this.frame(t));
  },

  _wireUI() {
    document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    document.getElementById('finishBtn').addEventListener('click', () => this.startGame());
    document.getElementById('cardBtn').addEventListener('click', () => this.dismissCard());
  },

  startGame() {
    this.position = 0;
    this.playerX = 0;
    this.speed = 0;
    this.stamps = 0;
    this.lastIndex = 0;
    CHECKPOINTS.forEach((c) => { /* nothing persisted on the source */ });
    Track.segments.forEach((s) => { if (s.checkpoint) s.checkpoint.hit = false; });
    this.updateHud();
    document.getElementById('start').classList.add('hidden');
    document.getElementById('finish').classList.add('hidden');
    document.getElementById('card').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    Input.showTouchControls();
    this.state = 'playing';
  },

  // ---- resize: low internal resolution that MATCHES the viewport aspect ----
  // Cap the longer side and derive the other from the real aspect ratio, so the
  // canvas never stretches (works in portrait, e.g. iPhone 16 Pro 402x874).
  resize() {
    const winW = window.innerWidth || 1;
    const winH = window.innerHeight || 1;
    const MAX_LONG = 480; // longest internal edge, keeps the pixel-art look
    if (winW >= winH) {
      this.width = MAX_LONG;
      this.height = Math.max(1, Math.round(MAX_LONG * (winH / winW)));
    } else {
      this.height = MAX_LONG;
      this.width = Math.max(1, Math.round(MAX_LONG * (winW / winH)));
    }
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.imageSmoothingEnabled = false;
  },

  // ---- main frame ----
  frame(now) {
    if (!this.lastTime) this.lastTime = now;
    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    dt = Math.min(dt, 1 / 30); // clamp big gaps (tab switches)

    if (this.state === 'playing') {
      this.update(dt);
    }
    this.render();
    requestAnimationFrame((t) => this.frame(t));
  },

  update(dt) {
    const seg = Track.findSegment(this.position);
    const speedPercent = this.speed / this.maxSpeed;
    const dx = dt * 2 * speedPercent;

    if (Input.left) this.playerX -= dx;
    if (Input.right) this.playerX += dx;

    // centrifugal pull on curves
    this.playerX -= dx * speedPercent * seg.curve * this.centrifugal;

    // acceleration: drives automatically at a slow cruise; GAS boosts.
    if (Input.gas) {
      this.speed = Util.accelerate(this.speed, this.accel, dt);
    } else if (Input.brake) {
      this.speed = Util.accelerate(this.speed, this.breaking, dt);
    } else if (this.speed < this.cruiseSpeed) {
      // ease up to cruising speed
      this.speed = Math.min(this.cruiseSpeed, Util.accelerate(this.speed, this.accel * 0.6, dt));
    } else {
      // coast back down toward cruise after boosting
      this.speed = Math.max(this.cruiseSpeed, Util.accelerate(this.speed, this.decel, dt));
    }

    // off-road slow down
    if ((this.playerX < -1 || this.playerX > 1) && this.speed > this.offRoadLimit) {
      this.speed = Util.accelerate(this.speed, this.offRoadDecel, dt);
    }

    this.playerX = Util.clamp(this.playerX, -2, 2);
    this.speed = Util.clamp(this.speed, 0, this.maxSpeed);

    const prevPos = this.position;
    this.position = Util.wrap(this.position + this.speed * dt, Track.length);

    // smooth sky parallax follows curves
    this.skyBend = Util.lerp(this.skyBend, seg.curve * 30 - this.playerX * 30, dt * 3);

    this.checkCheckpoints(prevPos);
    this.updateHud();
  },

  checkCheckpoints(prevPos) {
    const len = Track.segments.length;
    const prevIdx = Math.floor(prevPos / Track.segmentLength) % len;
    const curIdx = Math.floor(this.position / Track.segmentLength) % len;
    if (curIdx === prevIdx) return;

    // walk segments crossed this frame (handles fast speeds + wrap)
    let i = prevIdx;
    while (i !== curIdx) {
      i = (i + 1) % len;
      const cp = Track.segments[i].checkpoint;
      if (cp && !cp.hit) {
        cp.hit = true;
        this.showCard(cp);
        return;
      }
    }
  },

  showCard(cp) {
    this.state = 'card';
    this.stamps++;
    this.updateHud();
    document.getElementById('cardBadge').textContent = cp.icon || '📍';
    document.getElementById('cardTitle').textContent = cp.title;
    document.getElementById('cardFact').textContent = cp.fact;
    const cardImg = document.getElementById('cardImage');
    if (cp.image) {
      cardImg.src = cp.image;
      cardImg.classList.remove('hidden');
    } else {
      cardImg.classList.add('hidden');
      cardImg.removeAttribute('src');
    }
    const tripBox = document.getElementById('cardTrip');
    if (cp.trip) {
      document.getElementById('cardTripText').textContent = cp.trip;
      tripBox.classList.remove('hidden');
    } else {
      tripBox.classList.add('hidden');
    }
    document.getElementById('card').classList.remove('hidden');
  },

  dismissCard() {
    document.getElementById('card').classList.add('hidden');
    if (this.stamps >= CHECKPOINTS.length) {
      this.state = 'finished';
      document.getElementById('hud').classList.add('hidden');
      document.getElementById('finish').classList.remove('hidden');
    } else {
      this.state = 'playing';
    }
  },

  updateHud() {
    document.getElementById('speed').textContent = Math.round(this.speed / this.maxSpeed * 220);
    document.getElementById('stamps').textContent = this.stamps;
  },

  // ---- rendering ----
  render() {
    const ctx = this.ctx;
    const W = this.width, H = this.height;
    const horizon = Math.round(H * 0.5);

    // sky + scenery
    Sprites.background(ctx, W, H, horizon, this.skyBend);
    ctx.fillStyle = '#caa45f';
    ctx.fillRect(0, horizon, W, H - horizon);

    const baseSeg = Track.findSegment(this.position);
    const basePercent = (this.position % Track.segmentLength) / Track.segmentLength;
    const playerY = Util.lerp(baseSeg.p1.world.y, baseSeg.p2.world.y, basePercent);
    const cameraY = this.cameraHeight + playerY;

    let maxy = H;
    let x = 0;
    let dx = -(baseSeg.curve * basePercent);

    const len = Track.segments.length;
    const drawn = [];

    for (let n = 0; n < this.drawDistance; n++) {
      const seg = Track.segments[(baseSeg.index + n) % len];
      const looped = seg.index < baseSeg.index;
      const camZ = this.position - (looped ? Track.length : 0);

      Util.project(seg.p1, (this.playerX * Track.roadWidth) - x, cameraY, camZ,
        this.cameraDepth, W, H, Track.roadWidth);
      Util.project(seg.p2, (this.playerX * Track.roadWidth) - x - dx, cameraY, camZ,
        this.cameraDepth, W, H, Track.roadWidth);

      x += dx;
      dx += seg.curve;

      seg.clip = maxy;

      if (seg.p1.camera.z <= this.cameraDepth) continue; // behind camera
      if (seg.p2.screen.y >= seg.p1.screen.y) continue;  // no upward progress
      if (seg.p2.screen.y >= maxy) continue;             // already covered

      this.renderSegment(seg);
      drawn.push(seg);
      maxy = seg.p2.screen.y;
    }

    // coastline: plateau drop-off to the sea on the right, far -> near so the
    // nearer (taller) cliffs correctly paint over the farther ones.
    for (let i = drawn.length - 1; i >= 0; i--) {
      this.renderCoastline(drawn[i]);
    }

    // sprites: far -> near so nearer overlaps
    for (let i = drawn.length - 1; i >= 0; i--) {
      const seg = drawn[i];
      for (const sp of seg.sprites) {
        this.renderSprite(seg, sp);
      }
    }

    // player car
    this.renderPlayer();
  },

  // The road sits on a plateau; to its right the land drops as a jagged rocky
  // cliff down to the sea far below. Drawn as a tall rock band + sea per segment.
  renderCoastline(seg) {
    const W = this.width, H = this.height;
    const c = seg.color;
    const p = seg.p1.screen; // use the near edge for a stable foreground band
    if (p.scale <= 0 || p.w <= 0) return;
    const r = p.w / 4;
    const jit = Math.max(0.05, seg.oceanJitter);
    const edge = p.x + p.w + r + jit * p.w; // jagged land/sea boundary x
    if (edge > W) return;                    // coast off-screen to the right

    // vertical drop projected like a world height -> the higher the road, the
    // bigger the gap between plateau and sea (the depth illusion).
    const CLIFF_H = 1100;
    const drop = Util.clamp(p.scale * CLIFF_H * H / 2, 4, H);
    const top = p.y;
    const waterY = Math.min(H, p.y + drop);

    // rocky cliff face (plateau level down to the waterline)
    this.poly(edge, top, W + 2, top, W + 2, waterY, edge, waterY, c.rock);
    // darker shadow at the foot of the cliff for volume
    const lip = Math.max(1, drop * 0.18);
    this.poly(edge, waterY - lip, W + 2, waterY - lip, W + 2, waterY, edge, waterY, '#3a3026');
    // sea from the waterline down to the bottom of the screen
    this.poly(edge, waterY, W + 2, waterY, W + 2, H, edge, H, c.ocean);
    // bright foam line where rock meets water
    const foam = Math.max(1, this.height * 0.008);
    this.poly(edge, waterY, W + 2, waterY, W + 2, waterY + foam, edge, waterY + foam, '#bfe6f0');
  },

  renderSegment(seg) {
    const ctx = this.ctx;
    const W = this.width;
    const c = seg.color;
    const p1 = seg.p1.screen, p2 = seg.p2.screen;

    // land band (sand) fills the whole row first
    ctx.fillStyle = c.grass;
    ctx.fillRect(0, p2.y, W, p1.y - p2.y);

    const r1 = p1.w / 4, r2 = p2.w / 4;

    // rumble strips
    this.poly(p1.x - p1.w - r1, p1.y, p1.x - p1.w, p1.y, p2.x - p2.w, p2.y, p2.x - p2.w - r2, p2.y, c.rumble);
    this.poly(p1.x + p1.w + r1, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x + p2.w + r2, p2.y, c.rumble);

    // road
    this.poly(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, c.road);

    // lane markers
    if (c.lane) {
      const l1 = p1.w / 24, l2 = p2.w / 24;
      const lanes = Track.lanes;
      for (let lane = 1; lane < lanes; lane++) {
        const lx1 = p1.x - p1.w + (2 * p1.w / lanes) * lane;
        const lx2 = p2.x - p2.w + (2 * p2.w / lanes) * lane;
        this.poly(lx1 - l1, p1.y, lx1 + l1, p1.y, lx2 + l2, p2.y, lx2 - l2, p2.y, c.lane);
      }
    }
  },

  poly(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },

  renderSprite(seg, sp) {
    const scr = seg.p1.screen;
    if (scr.scale <= 0 || scr.w <= 0) return;
    // sprite x: offset is measured in road-widths from center; screen.w == one roadWidth
    const x = scr.x + sp.offset * scr.w;
    const y = scr.y;
    if (y > seg.clip + 2) return; // hidden behind a hill
    if (x < -120 || x > this.width + 120) return;

    // world-width (in road-widths) per sprite type -> screen pixels -> px per cell
    let factor, cols;
    switch (sp.type) {
      case 'palm':     factor = 1.5; cols = 16; Sprites.palm(this.ctx, x, y, (factor * scr.w) / cols); break;
      case 'stone':    factor = 0.7; cols = 10; Sprites.stone(this.ctx, x, y, (factor * scr.w) / cols); break;
      case 'building': factor = 1.8; cols = 6;  Sprites.building(this.ctx, x, y, (factor * scr.w) / cols, sp.variant || 0); break;
      case 'sign':     factor = 1.1; cols = 12; Sprites.sign(this.ctx, x, y, (factor * scr.w) / cols, sp.color); break;
    }
  },

  renderPlayer() {
    if (this.state === 'menu') return;
    const W = this.width, H = this.height;
    const px = Math.max(1, (W * 0.20) / 16);
    const cx = W / 2;
    // bob with speed, and a small steer hint
    const bob = Math.sin(this.lastTime / 90) * (this.speed / this.maxSpeed) * 1.5;
    const baseY = H - Math.round(H * 0.06) + bob;
    let steer = 0;
    if (Input.left) steer = -1;
    if (Input.right) steer = 1;
    Sprites.car(this.ctx, cx, baseY, px, steer);
  },
};

window.addEventListener('load', () => Game.init());
