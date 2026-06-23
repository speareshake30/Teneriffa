/* ---- util.js : math + small helpers shared across the game ---- */

const Util = {
  // Clamp value into [min, max]
  clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  },

  // Linear interpolation
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  // Smooth ease used for entering/exiting curves
  easeIn(a, b, percent) {
    return a + (b - a) * Math.pow(percent, 2);
  },
  easeInOut(a, b, percent) {
    return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);
  },

  // Accelerate / decelerate toward a target with a per-second rate
  accelerate(v, accel, dt) {
    return v + accel * dt;
  },

  // Mix two "#rrggbb" colors by t in [0,1] -> "rgb(r,g,b)"
  mixColor(hexA, hexB, t) {
    const a = Util.hexToRgb(hexA);
    const b = Util.hexToRgb(hexB);
    const r = Math.round(Util.lerp(a.r, b.r, t));
    const g = Math.round(Util.lerp(a.g, b.g, t));
    const bl = Math.round(Util.lerp(a.b, b.b, t));
    return `rgb(${r},${g},${bl})`;
  },

  hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  },

  // Project a point in road-space (camera-relative) to screen-space.
  // Mirrors the classic pseudo-3D projection used by OutRun-style racers.
  project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
    p.screen.w = Math.round(p.screen.scale * roadWidth * width / 2);
  },

  // Wrap a track position into [0, trackLength)
  wrap(value, max) {
    while (value >= max) value -= max;
    while (value < 0) value += max;
    return value;
  },

  rand(min, max) {
    return min + Math.random() * (max - min);
  },
  randInt(min, max) {
    return Math.round(Util.rand(min, max));
  },
};
