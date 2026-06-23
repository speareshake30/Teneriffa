/* ---- input.js : keyboard, touch and fullscreen ---- */

const Input = {
  left: false,
  right: false,
  gas: false,
  brake: false,

  init() {
    // Detect touch device to swap control hints and show on-screen buttons.
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) document.body.classList.add('is-touch');

    this._initKeyboard();
    this._initTouch();
    this._initFullscreen();
  },

  _initKeyboard() {
    const map = (e, down) => {
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A': this.left = down; break;
        case 'ArrowRight': case 'd': case 'D': this.right = down; break;
        case 'ArrowUp': case 'w': case 'W': this.gas = down; break;
        case 'ArrowDown': case 's': case 'S': this.brake = down; break;
        case 'f': case 'F': if (down) Input.toggleFullscreen(); return;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', (e) => map(e, true));
    window.addEventListener('keyup', (e) => map(e, false));
  },

  _bindHold(el, set) {
    if (!el) return;
    const on = (e) => { e.preventDefault(); set(true); };
    const off = (e) => { e.preventDefault(); set(false); };
    el.addEventListener('touchstart', on, { passive: false });
    el.addEventListener('touchend', off, { passive: false });
    el.addEventListener('touchcancel', off, { passive: false });
    el.addEventListener('mousedown', on);
    el.addEventListener('mouseup', off);
    el.addEventListener('mouseleave', off);
  },

  _initTouch() {
    this._bindHold(document.getElementById('btnLeft'), (v) => this.left = v);
    this._bindHold(document.getElementById('btnRight'), (v) => this.right = v);
    this._bindHold(document.getElementById('btnGas'), (v) => this.gas = v);
    this._bindHold(document.getElementById('btnBrake'), (v) => this.brake = v);
  },

  _initFullscreen() {
    const btn = document.getElementById('fsBtn');
    if (btn) btn.addEventListener('click', () => Input.toggleFullscreen());
  },

  toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) req.call(el).catch(() => {});
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    }
  },

  showTouchControls() {
    if (document.body.classList.contains('is-touch')) {
      document.getElementById('touch').classList.remove('hidden');
    }
  },
};
