/* ---- music.js : background song via the YouTube IFrame Player API ----
 *
 * Browsers forbid audio-with-sound before a user gesture, so we use the
 * standard pattern:
 *   1. On load, start the track MUTED (muted autoplay is always allowed).
 *   2. On the FIRST user interaction anywhere (move/tap/click/key), UNMUTE.
 * This makes the music come in the instant the visitor touches anything.
 * A 🔊/🔇 button toggles it after that.
 */

const Music = {
  player: null,
  ready: false,
  soundOn: false,
  videoId: 'zpzdgmqIHOQ', // Madonna – La Isla Bonita

  init() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('ytplayer', {
        videoId: this.videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0,
          modestbranding: 1, playsinline: 1, rel: 0,
          loop: 1, playlist: this.videoId,
        },
        events: {
          onReady: (e) => {
            this.ready = true;
            // make sure the iframe is allowed to autoplay, then start muted
            try {
              const f = e.target.getIframe();
              if (f) f.setAttribute('allow', 'autoplay; encrypted-media');
            } catch (err) { /* ignore */ }
            try { e.target.mute(); e.target.playVideo(); } catch (err) { /* ignore */ }
            if (this._pendingSound) this.enableSound();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) { // loop reliably
              this.player.seekTo(0, true);
              this.player.playVideo();
            }
            this._syncBtn();
          },
          onError: () => {
            // Most commonly 101/150: the video owner disabled embedding.
            console.warn('[music] YouTube playback error — the video may not be embeddable.');
          },
        },
      });
    };

    // Unmute on the very first interaction of any kind (earliest sound is legal).
    const kick = () => this.enableSound();
    ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach((ev) =>
      window.addEventListener(ev, kick, { once: true, capture: true, passive: true }));

    const btn = document.getElementById('musicBtn');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },

  // Turn sound on (called on first gesture and from the START button).
  enableSound() {
    if (!this.ready || !this.player) { this._pendingSound = true; return; }
    try {
      this.player.unMute();
      this.player.setVolume(40);
      this.player.playVideo();
      this.soundOn = true;
    } catch (e) { /* ignore */ }
    this._syncBtn();
  },

  // kept for Game.startGame()
  start() { this.enableSound(); },

  toggle() {
    if (!this.player) return;
    try {
      if (this.player.isMuted() || this.player.getPlayerState() !== YT.PlayerState.PLAYING) {
        this.player.unMute();
        this.player.setVolume(40);
        this.player.playVideo();
        this.soundOn = true;
      } else {
        this.player.mute();
        this.soundOn = false;
      }
    } catch (e) { /* ignore */ }
    this._syncBtn();
  },

  _syncBtn() {
    const btn = document.getElementById('musicBtn');
    if (!btn || !this.player) return;
    let on = false;
    try {
      on = this.player.getPlayerState() === YT.PlayerState.PLAYING && !this.player.isMuted();
    } catch (e) { /* ignore */ }
    btn.textContent = on ? '🔊' : '🔇';
  },
};

window.addEventListener('load', () => Music.init());
