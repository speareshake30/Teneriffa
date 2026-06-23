/* ---- music.js : background song via the YouTube IFrame Player API ----
 *
 * Plays the chosen YouTube track, looped, as background music. Browsers block
 * autoplay with sound until a user gesture, so playback is kicked off from the
 * START button tap (Game.startGame -> Music.start). A 🔊 button toggles mute.
 *
 * Note: iOS Safari is restrictive about programmatic playback of YouTube
 * embeds; if it doesn't start automatically there, tapping the 🔊 button
 * (a direct gesture on the player) is the fallback.
 */

const Music = {
  player: null,
  ready: false,
  wantPlay: false,
  videoId: 'zpzdgmqIHOQ',

  init() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('ytplayer', {
        videoId: this.videoId,
        playerVars: {
          autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1,
          playsinline: 1, rel: 0, loop: 1, playlist: this.videoId,
        },
        events: {
          onReady: () => { this.ready = true; if (this.wantPlay) this.start(); },
          onStateChange: (e) => {
            // loop a single video (loop=1 alone isn't reliable)
            if (e.data === YT.PlayerState.ENDED) {
              this.player.seekTo(0, true);
              this.player.playVideo();
            }
            this._syncBtn();
          },
        },
      });
    };

    const btn = document.getElementById('musicBtn');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },

  start() {
    if (!this.ready || !this.player) { this.wantPlay = true; return; }
    try {
      this.player.unMute();
      this.player.setVolume(40);
      this.player.playVideo();
    } catch (e) { /* ignore */ }
    this._syncBtn();
  },

  toggle() {
    if (!this.player) return;
    try {
      if (this.player.isMuted() || this.player.getPlayerState() !== YT.PlayerState.PLAYING) {
        this.player.unMute();
        this.player.setVolume(40);
        this.player.playVideo();
      } else {
        this.player.mute();
      }
    } catch (e) { /* ignore */ }
    this._syncBtn();
  },

  _syncBtn() {
    const btn = document.getElementById('musicBtn');
    if (!btn || !this.player) return;
    let playing = false;
    try {
      playing = this.player.getPlayerState() === YT.PlayerState.PLAYING && !this.player.isMuted();
    } catch (e) { /* ignore */ }
    btn.textContent = playing ? '🔊' : '🔇';
  },
};

window.addEventListener('load', () => Music.init());
