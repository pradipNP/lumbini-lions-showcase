# Awaken The Lion

A personal portfolio showcase inspired by **Lumbini Lions** — from the sacred birthplace of Buddha to NPL Season 2 champions.

> **Disclaimer:** Fan-made portfolio project. Not affiliated with or endorsed by Lumbini Lions.

---

## Overview

**Awaken The Lion** is a personal design and front-end development portfolio piece — a scroll-driven narrative site submitted as a Red Paltan talent showcase entry. It presents seven chapters using vanilla HTML, CSS, and JavaScript with GSAP, Lenis, and native media APIs.

There is no backend, build pipeline, or JavaScript framework.

---

## Live demo

| | |
|---|---|
| **Production** | _Deploy URL pending_ |
| **Repository** | [github.com](https://github.com) _(update with your repo URL)_ |

---

## Features

- Full-screen hero with ambient background video
- Chapter-based scroll narrative with smooth scrolling (Lenis)
- Scroll-triggered reveal animations (GSAP ScrollTrigger)
- Contextual lion roar audio on entering The Pride section
- Header music toggle (local MP3) and YouTube embeds in the Music chapter
- Interactive squad layout — captain spotlight, international row, domestic grid
- Champions section with score card and confetti celebration
- Custom cricket-bat cursor with hit effects (desktop)
- Open Graph and Twitter Card meta tags for link sharing
- Responsive layout with reduced-motion support

---

## Tech stack

| Category | Technology |
|----------|------------|
| Markup | HTML5 |
| Styling | CSS3 |
| Scripting | Vanilla JavaScript (ES6+) |
| Animation | GSAP 3, ScrollTrigger |
| Smooth scroll | Lenis |
| Media | HTML5 Video & Audio, YouTube IFrame API |
| Typography | Google Fonts — Cinzel, Bebas Neue, Outfit, Noto Sans Devanagari |

---

## Project structure

```
awaken-the-lion/
├── index.html
├── favicon.ico
├── LICENSE
├── README.md
├── css/
│   └── main.css
├── js/
│   └── main.js
├── assets/
│   ├── audio/
│   │   ├── lion.mp3
│   │   └── song.mp3
│   ├── images/
│   │   ├── logo.jpg
│   │   ├── rohit.png
│   │   ├── champions.jpg
│   │   ├── og-image.jpg
│   │   ├── favicon-32x32.png
│   │   └── apple-touch-icon.png
│   └── video/
│       └── stupa.mp4
└── package.json
```

---

## Getting started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- [Node.js](https://nodejs.org/) (optional — for the included dev server)

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/awaken-the-lion.git
cd awaken-the-lion
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** Do not open `index.html` directly via the `file://` protocol. Browsers restrict autoplay and media loading on local files. A local HTTP server is required.

On first load, click the preloader to unlock audio playback.

---

## Architecture

### Chapters

| Chapter | Section ID | Description |
|---------|------------|-------------|
| I — Origin | `#hero` | Hero video, title sequence, particle canvas |
| II — Sacred Ground | `#sacred` | Heritage imagery, Buddha quote, transition |
| III — The Pride | `#pride` | Team branding, logo, animated stats, lion roar |
| IV — The Squad | `#squad` | Player cards — captain, internationals, domestic squad |
| V — Champions | `#champions` | Final score, confetti, moments carousel, gallery |
| VI — Music | `#anthem` | YouTube players, visualizer, track controls |
| VII — Showcase | `#showcase` | Portfolio summary and contact |

### Audio

The application implements three independent audio channels:

| Source | File / Service | Trigger |
|--------|----------------|---------|
| Lion roar | `assets/audio/lion.mp3` | ScrollTrigger on `#pride` (re-arms when returning to `#hero` or `#sacred`) |
| Header track | `assets/audio/song.mp3` | `#audio-toggle` button in the site header |
| Music chapter | YouTube IFrame API | `#play-lions-song` and `#play-anthem-video` buttons |

Browser autoplay policies require a user gesture before audio can play. The preloader interaction performs a silent unlock (zero-volume play/pause) to satisfy this requirement.

### Key modules (`js/main.js`)

| Function | Responsibility |
|----------|----------------|
| `init()` | Application bootstrap, Lenis, ScrollTrigger, UI bindings |
| `initHeroVideo()` | Hero background video playback rate |
| `initLionAudio()` | Pride-section roar with scroll triggers and audio unlock |
| `initHeaderSongToggle()` | Header MP3 play/pause control |
| `initFoundedCount()` | Animated stat counter (0 → 2024) |
| `initChampionsCelebration()` | Confetti and score-card celebration effects |
| `initCricketCursor()` | Custom cursor and hit particle effects |
| `ExperienceTimeline` | GSAP intro/preloader sequence |
| `ParticleField` | Canvas particle system |

---

## Deployment

### GitHub Pages

1. Push the repository to GitHub.
2. Navigate to **Settings → Pages**.
3. Set source to **Deploy from branch** → `main` → `/ (root)`.
4. After deployment, update Open Graph image URLs in `index.html` to absolute paths:

```html
<meta property="og:image" content="https://YOUR-USERNAME.github.io/awaken-the-lion/assets/images/og-image.jpg">
<meta name="twitter:image" content="https://YOUR-USERNAME.github.io/awaken-the-lion/assets/images/og-image.jpg">
```

### Other platforms

Netlify, Vercel, and Cloudflare Pages support static deployment with zero configuration.

---

## License

This project's **source code** is licensed under the [MIT License](LICENSE).

```
© 2026 · Awaken The Lion · A fan showcase — not an official Lumbini Lions property
```

Third-party media included in this repository — audio tracks, team imagery, video footage, and embedded YouTube content — may be subject to separate copyrights and terms of use. See [Credits](#credits) below.

---

## Author

Personal portfolio project — designed and developed by the repository owner.

| | |
|---|---|
| **Project** | Awaken The Lion |
| **Location** | Lumbini, Nepal |
| **Showcase** | Red Paltan talent showcase entry |
| **Email** | [redpaltanlumbini@gmail.com](mailto:redpaltanlumbini@gmail.com) |
| **Phone** | +977 976-6812227 |

Lumbini Lions are the **subject** of this work, not the author or copyright holder.

---

## Credits

| Asset | Source |
|-------|--------|
| Lumbini Lions branding & squad data | [lumbinilions.com.np](https://lumbinilions.com.np) |
| Sacred Ground photography | [Wikimedia Commons](https://commons.wikimedia.org/) (CC BY-SA) |
| Lion's Song (YouTube) | [youtu.be/J_Ah9Yy9W8U](https://youtu.be/J_Ah9Yy9W8U) |
| Team anthem (YouTube) | [youtu.be/ZsTniyGi0pU](https://youtu.be/ZsTniyGi0pU) |
| Animation libraries | [GSAP](https://greensock.com/gsap/), [Lenis](https://lenis.darkroom.engineering/) |

---

<p align="center">
  <strong>AWAKEN THE LION</strong><br>
  From Lumbini · For The Pride · Nepal
</p>
