/* ---- sprites.js : procedural pixel-art drawing (no image assets) ----
 *
 * Everything is drawn as chunky rectangles so it scales crisply on the
 * low-res canvas. Sprites are anchored at bottom-center (cx, baseY) and
 * sized by `scale` (pixels per sprite-unit).
 */

const Sprites = {
  // Draw a pixel grid from rows of single-char keys mapped to colors.
  // Anchored bottom-center.
  drawGrid(ctx, grid, palette, cx, baseY, px) {
    const h = grid.length;
    const w = grid[0].length;
    const left = cx - (w * px) / 2;
    const top = baseY - h * px;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const ch = grid[r][c];
        const color = palette[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(left + c * px), Math.round(top + r * px), Math.ceil(px), Math.ceil(px));
      }
    }
    return { width: w * px, height: h * px };
  },

  // ---- Player car (rear view), seen from behind ----
  car(ctx, cx, baseY, scale, steer) {
    // scale ~ desired width in px / 16
    const px = Math.max(1, scale);
    // Toyota Avensis 2006-style sedan, rear view, silver-metallic / sandy gold.
    const P = {
      '.': null,
      'H': '#e0dccb', 'B': '#c9c2ad', 'S': '#9c917a',  // body: highlight / mid / shadow
      'G': '#313539', 'g': '#475059',                  // glass / glass highlight
      'L': '#cf2f2f', 'P': '#eaeae2', 'C': '#b6bdc1',  // tail light / plate / chrome
      'k': '#141414',                                  // tyre
    };
    // 16 wide x 12 tall (rear view)
    const G = [
      '...HHHHHHHHHH...',
      '..HGGGGGGGGGGH..',
      '..BgGGGGGGGGgB..',
      '.BBBBBBBBBBBBBB.',
      'BBBBBBBBBBBBBBBB',
      'BHHHHHHHHHHHHHHB',
      'BLLLLBBBBBBLLLLB',
      'CCCCCCCCCCCCCCCC',
      'CCCCCPPPPPPCCCCC',
      'SSSSSSSSSSSSSSSS',
      'kkkBBBBBBBBBBkkk',
      'kkkBBBBBBBBBBkkk',
    ];
    // subtle lean while steering
    const lean = Util.clamp(steer || 0, -1, 1) * px;
    Sprites.drawGrid(ctx, G, P, cx + lean, baseY, px);
  },

  // ---- Palm tree ----
  // Drawn procedurally: a thin dark trunk topped by fronds radiating out and
  // drooping, each with a lime-green highlight along its upper edge — matching
  // the reference pixel-art palm. (16 cells wide, ~22 tall.)
  palm(ctx, cx, baseY, scale) {
    const px = Math.max(1, scale);
    const C = { trunk: '#26331a', dark: '#33501f', mid: '#6f8f4a', lime: '#aac95c' };

    // Distant palms: draw a cheap blob so we stay fast with hundreds on screen.
    if (px < 2.2) {
      const p = Math.max(1, Math.ceil(px));
      ctx.fillStyle = C.trunk;
      ctx.fillRect(Math.round(cx - p / 2), Math.round(baseY - 7 * px), p, Math.ceil(7 * px));
      ctx.fillStyle = C.mid;
      ctx.fillRect(Math.round(cx - 4 * px), Math.round(baseY - 10 * px), Math.ceil(8 * px), Math.ceil(3 * px));
      ctx.fillStyle = C.lime;
      ctx.fillRect(Math.round(cx - 4 * px), Math.round(baseY - 10 * px), Math.ceil(8 * px), Math.ceil(px));
      return;
    }

    const ox = cx - px / 2; // so gx=0 straddles the center
    const put = (gx, gy, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(ox + gx * px), Math.round(baseY - (gy + 1) * px), Math.ceil(px), Math.ceil(px));
    };

    const crownY = 15; // top of the trunk / base of the fronds

    // Trunk (thin, with a small flared base)
    for (let gy = 0; gy <= crownY; gy++) put(0, gy, C.trunk);
    put(-1, 0, C.trunk);
    put(1, 0, C.trunk);

    // Frond directions: [dx, dy, length]. Mix of upward and drooping fronds.
    const fronds = [
      [-0.95, 0.55, 8], [-0.55, 0.95, 7], [0.05, 1.0, 6], [0.6, 0.92, 7],
      [0.97, 0.5, 8], [1.0, -0.05, 8], [-1.0, 0.05, 8], [-0.9, -0.55, 7], [0.9, -0.6, 7],
    ];

    // Pass 1: frond bodies (dark underside + mid-green body)
    for (const [dx, dy, len] of fronds) {
      for (let i = 1; i <= len; i++) {
        const gx = dx * i, gy = crownY + dy * i;
        put(gx, gy - 1, C.dark);
        put(gx, gy, C.mid);
      }
    }
    // Pass 2: lime highlight along the upper edge of each frond (outer portion)
    for (const [dx, dy, len] of fronds) {
      for (let i = Math.ceil(len * 0.25); i <= len; i++) {
        const gx = dx * i, gy = crownY + dy * i;
        put(gx, gy + 1, C.lime);
      }
    }

    // Crown center
    put(0, crownY, C.mid);
    put(0, crownY + 1, C.lime);
  },

  // ---- Boulder / stone (bulgy volcanic rock) ----
  stone(ctx, cx, baseY, scale) {
    const px = Math.max(1, scale);
    const P = { '.': null, 'h': '#9a8c72', 'm': '#7c6f59', 'd': '#574d3f', 's': '#3d352b' };
    // distant fallback: a simple lump
    if (px < 2.0) {
      const p = Math.max(1, Math.ceil(px));
      ctx.fillStyle = '#7c6f59';
      ctx.fillRect(Math.round(cx - 3 * px), Math.round(baseY - 4 * px), Math.ceil(6 * px), Math.ceil(4 * px));
      ctx.fillStyle = '#574d3f';
      ctx.fillRect(Math.round(cx - 3 * px), Math.round(baseY - px), Math.ceil(6 * px), p);
      return;
    }
    // 10 wide x 7 tall, highlight upper-left, shadow lower-right (bulgy)
    const G = [
      '...hhhh...',
      '..hhhhhm..',
      '.hhhhhmmm.',
      'hhhhhmmmmd',
      'hhhhmmmmdd',
      '.mmmmmmdd.',
      '..ssdddd..',
    ];
    Sprites.drawGrid(ctx, G, P, cx, baseY, px);
  },

  // ---- City building (skyline filler) ----
  building(ctx, cx, baseY, scale, variant) {
    const px = Math.max(1, scale);
    const bodies = ['#3a2a5a', '#4a3168', '#2d2350'];
    const win = '#ffd86b';
    const body = bodies[(variant || 0) % bodies.length];
    const rows = 9 + (variant % 3) * 2;
    const cols = 6;
    const left = cx - (cols * px) / 2;
    const top = baseY - rows * px;
    ctx.fillStyle = body;
    ctx.fillRect(Math.round(left), Math.round(top), Math.ceil(cols * px), Math.ceil(rows * px));
    ctx.fillStyle = win;
    for (let r = 1; r < rows - 1; r += 2) {
      for (let c = 1; c < cols - 1; c += 2) {
        if ((r + c + variant) % 3 === 0) continue; // some windows dark
        ctx.fillRect(Math.round(left + c * px), Math.round(top + r * px), Math.ceil(px), Math.ceil(px));
      }
    }
  },

  // ---- Landmark billboard / sign ----
  sign(ctx, cx, baseY, scale, color) {
    const px = Math.max(1, scale);
    const w = 12, postH = 5, boardH = 9;
    const left = cx - (w * px) / 2;
    const top = baseY - (postH + boardH) * px;
    // posts
    ctx.fillStyle = '#5a4632';
    ctx.fillRect(Math.round(cx - 3 * px), Math.round(baseY - postH * px), Math.ceil(px), Math.ceil(postH * px));
    ctx.fillRect(Math.round(cx + 2 * px), Math.round(baseY - postH * px), Math.ceil(px), Math.ceil(postH * px));
    // board
    ctx.fillStyle = color || '#ffd86b';
    ctx.fillRect(Math.round(left), Math.round(top), Math.ceil(w * px), Math.ceil(boardH * px));
    // dark border
    ctx.fillStyle = '#1a1033';
    ctx.fillRect(Math.round(left), Math.round(top), Math.ceil(w * px), Math.ceil(px));
    ctx.fillRect(Math.round(left), Math.round(top + (boardH - 1) * px), Math.ceil(w * px), Math.ceil(px));
    // a little "?" mark / pin so it reads as a point of interest
    ctx.fillStyle = '#1a1033';
    const mx = cx, my = top + boardH * px * 0.5;
    ctx.fillRect(Math.round(mx - px * 0.5), Math.round(my - 2 * px), Math.ceil(px), Math.ceil(px));
    ctx.fillRect(Math.round(mx - px * 0.5), Math.round(my - 0.5 * px), Math.ceil(px), Math.ceil(px * 1.5));
  },

  // ---- Sky + sun + distant Teide volcano + skyline silhouette ----
  // Drawn across the whole low-res screen. `bend` shifts the scenery with curves.
  background(ctx, w, h, horizon, bend) {
    // Sunset gradient sky
    const grad = ctx.createLinearGradient(0, 0, 0, horizon);
    grad.addColorStop(0.0, '#3a1a5c');
    grad.addColorStop(0.45, '#8a3b6b');
    grad.addColorStop(0.75, '#ff7b54');
    grad.addColorStop(1.0, '#ffb24d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, horizon);

    // Sun
    const sunX = w / 2 - bend * 0.3;
    const sunY = horizon - h * 0.16;
    const sunR = Math.round(h * 0.13);
    ctx.fillStyle = '#ffe07a';
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();
    // sun scanlines (retro look)
    ctx.fillStyle = '#ff7b54';
    for (let i = 0; i < 5; i++) {
      const y = sunY + sunR * 0.25 + i * (sunR * 0.22);
      ctx.fillRect(sunX - sunR, Math.round(y), sunR * 2, Math.max(1, Math.round(h * 0.012)));
    }

    // Distant Teide volcano silhouette (left of center)
    const tBase = horizon;
    const tPeakX = w * 0.30 - bend * 0.5;
    const tPeakY = horizon - h * 0.28;
    const tHalf = w * 0.20;
    ctx.fillStyle = '#5a2f6b';
    ctx.beginPath();
    ctx.moveTo(tPeakX - tHalf, tBase);
    ctx.lineTo(tPeakX, tPeakY);
    ctx.lineTo(tPeakX + tHalf, tBase);
    ctx.closePath();
    ctx.fill();
    // snow cap
    ctx.fillStyle = '#f3e9ff';
    ctx.beginPath();
    ctx.moveTo(tPeakX - tHalf * 0.22, tPeakY + h * 0.05);
    ctx.lineTo(tPeakX, tPeakY);
    ctx.lineTo(tPeakX + tHalf * 0.22, tPeakY + h * 0.05);
    ctx.closePath();
    ctx.fill();

    // City skyline silhouette on the right, sitting on the horizon
    ctx.fillStyle = '#2a1640';
    const baseY = horizon;
    let bx = w * 0.55 - bend * 0.5;
    const seedHeights = [10, 22, 14, 30, 18, 26, 12, 24, 16, 28, 14];
    for (let i = 0; bx < w + 20; i++) {
      const bw = 10 + (i % 3) * 5;
      const bh = (seedHeights[i % seedHeights.length]) * (h / 180);
      ctx.fillRect(Math.round(bx), Math.round(baseY - bh), bw, bh);
      bx += bw + 3;
    }
  },
};
