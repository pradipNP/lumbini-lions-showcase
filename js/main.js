/**
 * AWAKEN THE LION — Main Application
 * Scene/timeline engine · Scroll · Audio · Particles
 */

'use strict';

/* ==========================================================================
   Experience Timeline Engine (reusable for audio sync)
   ========================================================================== */

class ExperienceTimeline {
  constructor() {
    /** @type {gsap.core.Timeline} */
    this.master = gsap.timeline({ paused: true });
    /** @type {Map<string, number>} */
    this.markers = new Map();
    /** @type {HTMLAudioElement|object|null} */
    this.audio = null;
  }

  /**
   * @param {string} id
   * @param {function(gsap.core.Timeline): void} builder
   */
  addScene(id, builder) {
    this.markers.set(id, this.master.duration());
    builder(this.master);
    return this;
  }

  play() { this.master.play(); }
  pause() { this.master.pause(); }
  seek(time) { this.master.seek(time); }
  seekScene(id) {
    const t = this.markers.get(id);
    if (t !== undefined) this.seek(t);
  }

  attachAudio(source) { this.audio = source; }

  syncToAudio() {
    if (this.audio && typeof this.audio.currentTime === 'number') {
      this.seek(this.audio.currentTime);
    }
  }
}


/* ==========================================================================
   Particle Field
   ========================================================================== */

class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.opacity = 0.4;
    this._resize = this._resize.bind(this);
    this._loop = this._loop.bind(this);
    window.addEventListener('resize', this._resize);
    this._resize();
    this._spawn(80);
    this._loop();
  }

  _resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = r.width;
    this.h = r.height;
  }

  _spawn(n) {
    this.particles = Array.from({ length: n }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.08 - 0.02,
      a: Math.random() * 0.5 + 0.1,
    }));
  }

  _loop() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = this.h + 5; p.x = Math.random() * this.w; }
      if (p.x < -5) p.x = this.w + 5;
      if (p.x > this.w + 5) p.x = -5;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(232, 197, 71, ${p.a * this.opacity})`;
      this.ctx.fill();
    }
    requestAnimationFrame(this._loop);
  }
}


/* ==========================================================================
   YouTube Player
   ========================================================================== */

const YT_SONG_ID = 'J_Ah9Yy9W8U';
const YT_ANTHEM_ID = 'ZsTniyGi0pU';

let ytPlayerSong = null;
let ytPlayerAnthem = null;
let ytReadyCount = 0;

const ytPlayerOpts = {
  height: '100%',
  width: '100%',
  playerVars: {
    autoplay: 0,
    controls: 1,
    modestbranding: 1,
    rel: 0,
  },
};

window.onYouTubeIframeAPIReady = function () {
  ytPlayerSong = new YT.Player('youtube-player-song', {
    ...ytPlayerOpts,
    videoId: YT_SONG_ID,
    events: {
      onReady: onYTPlayerReady,
      onStateChange: (e) => onYTStateChange(e, 'song'),
    },
  });

  ytPlayerAnthem = new YT.Player('youtube-player-anthem', {
    ...ytPlayerOpts,
    videoId: YT_ANTHEM_ID,
    events: {
      onReady: onYTPlayerReady,
      onStateChange: (e) => onYTStateChange(e, 'anthem'),
    },
  });
};

function onYTPlayerReady() {
  ytReadyCount += 1;
}

function getYTPlayer(which) {
  return which === 'anthem' ? ytPlayerAnthem : ytPlayerSong;
}

function pauseOtherPlayer(active) {
  const other = active === 'anthem' ? ytPlayerSong : ytPlayerAnthem;
  if (other && typeof other.pauseVideo === 'function') {
    const state = other.getPlayerState?.();
    if (state === YT.PlayerState.PLAYING) other.pauseVideo();
  }
}

function onYTStateChange(event, which) {
  const visualizer = document.getElementById('visualizer');
  const playing = event.data === YT.PlayerState.PLAYING;

  if (playing) pauseOtherPlayer(which);

  const songPlaying = ytPlayerSong?.getPlayerState?.() === YT.PlayerState.PLAYING;
  const anthemPlaying = ytPlayerAnthem?.getPlayerState?.() === YT.PlayerState.PLAYING;
  const anyPlaying = songPlaying || anthemPlaying;

  visualizer?.classList.toggle('is-active', anyPlaying);

  document.getElementById('play-lions-song')?.classList.toggle('is-playing', songPlaying);
  document.getElementById('play-anthem-video')?.classList.toggle('is-playing', anthemPlaying);
}


/* ==========================================================================
   Shared page audio unlock (browser autoplay policy)
   ========================================================================== */

const pageAudio = {
  unlocked: false,
  _listeners: new Set(),

  onUnlocked(fn) {
    this._listeners.add(fn);
    if (this.unlocked) fn();
  },

  markUnlocked() {
    if (this.unlocked) return;
    this.unlocked = true;
    this._listeners.forEach((fn) => fn());
  },

  unlockFromGesture() {
    if (this.unlocked) return Promise.resolve();

    const songEl = document.getElementById('lions-song-audio');
    const lionEl = document.getElementById('lion-audio');
    const elements = [songEl, lionEl].filter(Boolean);

    const silentUnlock = (index) => {
      if (index >= elements.length) return Promise.resolve();
      const el = elements[index];
      const savedVolume = el.volume;
      el.volume = 0;
      el.currentTime = 0;

      return el.play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
          el.volume = savedVolume;
          this.markUnlocked();
        })
        .catch(() => {
          el.volume = savedVolume;
          return silentUnlock(index + 1);
        });
    };

    return silentUnlock(0);
  },
};


/* ==========================================================================
   Header song toggle — MP3 (audio-toggle button)
   ========================================================================== */

function initHeaderSongToggle() {
  const audioToggle = document.getElementById('audio-toggle');
  const songEl = document.getElementById('lions-song-audio');
  if (!audioToggle || !songEl) return;

  songEl.addEventListener('play', () => pageAudio.markUnlocked());

  function updateToggleUI() {
    const playing = !songEl.paused && !songEl.ended;
    audioToggle.classList.toggle('is-playing', playing);
    audioToggle.setAttribute('aria-label', playing ? "Pause Lion's Song" : "Play Lion's Song");
  }

  audioToggle.addEventListener('click', () => {
    if (songEl.paused) {
      pageAudio.unlockFromGesture().finally(() => {
        songEl.play().catch(() => {});
      });
    } else {
      songEl.pause();
    }
  });

  ['play', 'pause', 'ended'].forEach((evt) => {
    songEl.addEventListener(evt, updateToggleUI);
  });
}


/* ==========================================================================
   App Init
   ========================================================================== */

function init() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  const introTimeline = new ExperienceTimeline();

  introTimeline.addScene('fade-out', (tl) => {
    tl.to({}, { duration: reducedMotion ? 0 : 2.2 });
    tl.to(preloader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.classList.add('is-done');
        ScrollTrigger.refresh();
      },
    });
  });

  introTimeline.addScene('header-in', (tl) => {
    tl.to('#site-header', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      onStart: () => document.getElementById('site-header').classList.add('is-visible'),
    }, '-=0.3');
  });

  if (reducedMotion) {
    preloader.classList.add('is-done');
    document.getElementById('site-header').classList.add('is-visible');
  } else {
    introTimeline.play();
  }

  function finishIntro() {
    if (preloader.classList.contains('is-done')) return;
    introTimeline.master.progress(1);
    preloader.classList.add('is-done');
    ScrollTrigger.refresh();
  }

  preloader?.addEventListener('pointerdown', () => {
    pageAudio.unlockFromGesture();
    finishIntro();
  }, { passive: true });

  /* ── Particles ── */
  const particles = new ParticleField(document.getElementById('particle-canvas'));

  gsap.registerPlugin(ScrollTrigger);

  /* ── Smooth scroll (Lenis) ── */
  let lenis;
  if (!reducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ── Hero drone video (mid → end loop) ── */
  initHeroVideo(reducedMotion);

  /* ── Cricket bat cursor ── */
  initCricketCursor();

  /* ── Lion roar once when entering Chapter III from above ── */
  initLionAudio(reducedMotion, lenis, finishIntro);

  /* ── Founded year count-up (2024) ── */
  initFoundedCount(reducedMotion);

  /* ── Champions winner celebration ── */
  initChampionsCelebration(reducedMotion);

  /* ── Scroll progress ── */
  const progressBar = document.getElementById('scroll-progress-bar');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => { if (progressBar) progressBar.style.width = `${self.progress * 100}%`; },
  });

  /* ── Reveal animations ── */
  if (!reducedMotion) {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    /* Parallax backgrounds */
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      gsap.to(el, {
        yPercent: speed * 30,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* Hero title stagger */
    gsap.to('.hero-title .hero-title__line', {
      opacity: 1,
      y: 0,
      duration: 1.4,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 2.5,
    });

    gsap.utils.toArray('#hero .reveal').forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1, delay: 2.8 + i * 0.15, ease: 'power2.out' });
    });

    /* Lion logo subtle scale on scroll */
    ScrollTrigger.create({
      trigger: '#pride',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set('.lion-logo__img', { scale: 1 + self.progress * 0.08 });
      },
    });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ── Horizontal drag for moments track ── */
  const track = document.getElementById('moments-track');
  if (track && !reducedMotion) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; });
    track.addEventListener('mouseup', () => { isDown = false; });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  /* ── Music controls ── */
  initHeaderSongToggle();
  const playSongBtn = document.getElementById('play-lions-song');
  const playAnthemBtn = document.getElementById('play-anthem-video');

  function scrollToMusic() {
    if (lenis) lenis.scrollTo('#anthem', { offset: 0 });
    else document.getElementById('anthem')?.scrollIntoView({ behavior: 'smooth' });
  }

  function togglePlayer(which) {
    if (ytReadyCount < 2) return;
    const player = getYTPlayer(which);
    if (!player) return;

    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      pauseOtherPlayer(which);
      player.playVideo();
      scrollToMusic();
    }
  }

  playSongBtn?.addEventListener('click', () => togglePlayer('song'));
  playAnthemBtn?.addEventListener('click', () => togglePlayer('anthem'));

  /* ── Expose API ── */
  window.AwakenTheLion = {
    timeline: introTimeline,
    particles,
    playLionsSong: () => getYTPlayer('song')?.playVideo(),
    playAnthem: () => getYTPlayer('anthem')?.playVideo(),
    pauseMusic: () => {
      ytPlayerSong?.pauseVideo();
      ytPlayerAnthem?.pauseVideo();
    },
  };

  if (lenis) ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', init);


/* ==========================================================================
   Hero Video — stupa footage, slowed for a peaceful feel
   ========================================================================== */

function initHeroVideo(reducedMotion) {
  const video = document.getElementById('hero-video');
  if (!video || reducedMotion) return;

  const PEACE_PLAYBACK_RATE = 0.65;

  function startPeacefulLoop() {
    video.playbackRate = PEACE_PLAYBACK_RATE;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  video.addEventListener('loadedmetadata', startPeacefulLoop);

  if (video.readyState >= 1) startPeacefulLoop();
}


/* ==========================================================================
   Founded stat — count 0 → 2024 when Pride section enters view
   ========================================================================== */

function initFoundedCount(reducedMotion) {
  const el = document.querySelector('.stat-card__num[data-count]');
  if (!el) return;

  const target = parseInt(el.dataset.count, 10) || 2024;

  if (reducedMotion) {
    el.textContent = String(target);
    return;
  }

  const counter = { value: 0 };
  let hasAnimated = false;

  ScrollTrigger.create({
    trigger: '#pride',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      if (hasAnimated) return;
      hasAnimated = true;
      gsap.to(counter, {
        value: target,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(counter.value));
        },
      });
    },
  });
}


/* ==========================================================================
   Cricket Bat Cursor + Hit Ball FX
   ========================================================================== */

function initCricketCursor() {
  const bat = document.getElementById('cricket-cursor');
  const fxLayer = document.getElementById('hit-fx-layer');
  if (!bat || !fxLayer || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let prevX = mouseX;
  let prevY = mouseY;
  let swinging = false;

  gsap.set(bat, {
    x: mouseX,
    y: mouseY,
    rotate: 0,
    xPercent: -50,
    yPercent: 0,
    transformOrigin: '50% 0%',
  });

  document.addEventListener('mousemove', (e) => {
    prevX = mouseX;
    prevY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const vx = mouseX - prevX;
    const speed = Math.min(Math.hypot(vx, mouseY - prevY), 30);
    const targetTilt = vx * 0.6 + speed * 0.08;

    if (!swinging) {
      gsap.to(bat, {
        x: mouseX,
        y: mouseY,
        rotate: targetTilt,
        duration: 0.18,
        ease: 'power2.out',
      });
    } else {
      gsap.to(bat, { x: mouseX, y: mouseY, duration: 0.08 });
    }
  });

  document.querySelectorAll('a, button, .moment-card, .sacred-card, .player-card').forEach((el) => {
    el.addEventListener('mouseenter', () => bat.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => bat.classList.remove('is-hover'));
  });

  document.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || swinging) return;
    swinging = true;
    bat.classList.add('is-swinging');

    gsap.timeline({
      onComplete: () => {
        swinging = false;
        bat.classList.remove('is-swinging');
      },
    })
      .to(bat, { rotate: -38, duration: 0.06, ease: 'power4.in' })
      .call(() => spawnHitEffects(fxLayer, e.clientX, e.clientY), null, 0.06)
      .to(bat, { rotate: 32, duration: 0.1, ease: 'power3.out' })
      .to(bat, { rotate: 8, duration: 0.08, ease: 'power1.inOut' })
      .to(bat, { rotate: 0, duration: 0.2, ease: 'power2.out' });
  });
}

function spawnHitEffects(layer, x, y) {
  const flash = document.createElement('div');
  flash.className = 'hit-flash';
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  layer.appendChild(flash);

  gsap.timeline({ onComplete: () => flash.remove() })
    .fromTo(flash, { scale: 0.3, opacity: 1 }, { scale: 2.5, opacity: 0, duration: 0.35, ease: 'power2.out' });

  const ring = document.createElement('div');
  ring.className = 'hit-ring';
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  layer.appendChild(ring);

  gsap.timeline({ onComplete: () => ring.remove() })
    .fromTo(ring, { scale: 0.5, opacity: 0.9 }, { scale: 3, opacity: 0, duration: 0.4, ease: 'power2.out' });

  const ball = document.createElement('div');
  ball.className = 'hit-ball';
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  layer.appendChild(ball);

  const angle = (-35 - Math.random() * 50) * (Math.PI / 180);
  const distance = 100 + Math.random() * 140;

  gsap.timeline({ onComplete: () => ball.remove() })
    .fromTo(ball, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.04 })
    .to(ball, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotation: 480 + Math.random() * 360,
      duration: 0.65,
      ease: 'power2.out',
    }, 0)
    .to(ball, { opacity: 0, duration: 0.15 }, 0.5);
}


/* ==========================================================================
   Lion Roar — once per visit to Chapter III+; re-arms when returning to Ch I–II
   ========================================================================== */

function initLionAudio(reducedMotion, lenis, finishIntro) {
  const lionEl = document.getElementById('lion-audio');
  const prideSection = document.getElementById('pride');
  const sacredSection = document.getElementById('sacred');
  const heroSection = document.getElementById('hero');
  if (!lionEl || !prideSection || reducedMotion) return;

  let armed = true;
  let isPlaying = false;
  let inPrideZone = false;

  lionEl.load();

  lionEl.addEventListener('error', () => {
    console.warn('Lion roar audio failed to load. Check assets/audio/lion.mp3 is deployed.');
  });

  function onUserGesture() {
    finishIntro?.();
    pageAudio.unlockFromGesture();
  }

  function tryRoarIfReady() {
    if (inPrideZone && armed && !isPlaying && pageAudio.unlocked) {
      playRoar();
    }
  }

  pageAudio.onUnlocked(tryRoarIfReady);

  document.addEventListener('pointerdown', onUserGesture, { capture: true, passive: true });
  document.addEventListener('touchstart', onUserGesture, { capture: true, passive: true });
  document.addEventListener('keydown', onUserGesture, { passive: true });

  function playRoar() {
    if (!armed || isPlaying) return;

    if (!pageAudio.unlocked) {
      pageAudio.unlockFromGesture().then(tryRoarIfReady);
      return;
    }

    isPlaying = true;
    lionEl.currentTime = 0;
    lionEl.volume = 1;

    lionEl.play()
      .then(() => {
        armed = false;
      })
      .catch(() => {
        isPlaying = false;
      });
  }

  function rearm() {
    armed = true;
    isPlaying = false;
  }

  lionEl.addEventListener('ended', () => {
    isPlaying = false;
    lionEl.currentTime = 0;
  });

  /* Roar when scrolling down into Pride (Chapter III) */
  ScrollTrigger.create({
    trigger: prideSection,
    start: 'top 75%',
    end: 'bottom top',
    onEnter: () => {
      inPrideZone = true;
      playRoar();
    },
    onLeaveBack: () => {
      inPrideZone = false;
    },
    onLeave: () => {
      inPrideZone = false;
    },
  });

  /* Re-arm when back in Chapters I or II */
  [heroSection, sacredSection].forEach((section) => {
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: rearm,
      onEnterBack: rearm,
    });
  });

  /* Refresh triggers after layout, preloader, and media settle */
  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 3000);
}

/* ==========================================================================
   Champions — winner card confetti & popper celebration
   ========================================================================== */

function initChampionsCelebration(reducedMotion) {
  const winner = document.querySelector('.final-score__team--winner');
  if (!winner) return;

  const celebration = winner.querySelector('.celebration');
  if (!celebration || reducedMotion) return;

  const colors = ['#e8c547', '#9b0f0f', '#d42020', '#b8942e', '#f0ebe0'];
  const origins = [
    { x: 0.16, y: 0.04 },
    { x: 0.84, y: 0.04 },
    { x: 0.5, y: 0.02 },
  ];

  for (let i = 0; i < 48; i += 1) {
    const origin = origins[i % origins.length];
    const spread = (Math.random() - 0.5) * 1.4;
    const velocity = 50 + Math.random() * 90;
    const burstX = Math.sin(spread) * velocity;
    const burstY = -(40 + Math.random() * 80);

    const piece = document.createElement('span');
    piece.className = 'celebration__piece';
    if (i % 4 === 0) piece.classList.add('celebration__piece--streamer');

    piece.style.setProperty('--ox', `${origin.x * 100}%`);
    piece.style.setProperty('--oy', `${origin.y * 100}%`);
    piece.style.setProperty('--burst-x', `${burstX}px`);
    piece.style.setProperty('--burst-y', `${burstY}px`);
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 70}px`);
    piece.style.setProperty('--start-x', `${(Math.random() - 0.5) * 180}px`);
    piece.style.setProperty('--delay', `${Math.random() * 2.8}s`);
    piece.style.setProperty('--dur', `${1.6 + Math.random() * 1.4}s`);
    piece.style.setProperty('--rot', `${Math.random() * 720}deg`);
    piece.style.setProperty('--color', colors[i % colors.length]);
    piece.style.setProperty('--size', `${4 + Math.random() * 5}px`);
    celebration.appendChild(piece);
  }

  const runsEl = winner.querySelector('.final-score__runs');

  ScrollTrigger.create({
    trigger: winner,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      winner.classList.add('is-celebrating', 'is-celebrating--burst');

      if (runsEl) {
        gsap.fromTo(
          runsEl,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2)' },
        );
      }

      window.setTimeout(() => {
        winner.classList.remove('is-celebrating--burst');
      }, 2200);
    },
  });

  ScrollTrigger.create({
    trigger: '#champions',
    start: 'top 55%',
    end: 'bottom 25%',
    onEnter: () => winner.classList.add('is-celebrating'),
    onLeave: () => winner.classList.remove('is-celebrating', 'is-celebrating--burst'),
    onEnterBack: () => winner.classList.add('is-celebrating'),
    onLeaveBack: () => winner.classList.remove('is-celebrating', 'is-celebrating--burst'),
  });
}
