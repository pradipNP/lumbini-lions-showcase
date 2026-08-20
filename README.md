# Awaken The Lion

**A cinematic single-page showcase for Lumbini Lions & Red Paltan** — from the sacred birthplace of Buddha to NPL Season 2 champions.

> Fan-made talent showcase · Not an official Lumbini Lions property

---

## Live demo

After deploying, add your URL here:

`https://your-username.github.io/awaken-the-lion/`

---

## What this site is

An immersive scroll-driven web experience built as a **Red Paltan design & development showcase**. It tells the story of Lumbini — spiritual origin, Red Paltan pride, the full squad, the NPL final victory, official sound, and a personal portfolio closing chapter.

There is **no backend, no build step, and no framework**. It is plain HTML, CSS, and vanilla JavaScript enhanced with animation libraries.

---

## Chapters (scroll journey)

| # | Section | ID | What happens |
|---|---------|-----|--------------|
| I | **Origin** | `#hero` | Full-screen stupa video, title reveal, particle field |
| II | **Sacred Ground** | `#sacred` | Lumbini heritage cards, Buddha quote, transition bridge |
| III | **The Pride** | `#pride` | Red Paltan branding, logo, stats, **lion roar on enter** |
| IV | **The Squad** | `#squad` | Rohit Paudel (captain, centered), internationals row, domestic players |
| V | **Champions** | `#champions` | Final score, confetti celebration, moments track, gallery |
| VI | **Sounds of the Pride** | `#anthem` | YouTube embeds — Lion's Song & Anthem |
| VII | **Showcase** | `#showcase` | Portfolio entry, Red Paltan contact, footer |

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Animation | [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Video | HTML5 `<video>` (hero background) |
| Audio | HTML5 `<audio>` + YouTube iframe API |
| Fonts | Google Fonts — Cinzel, Bebas Neue, Outfit, Noto Sans Devanagari |

---

## Project structure

```
awaken-the-lion/
├── index.html              # All sections & content
├── favicon.ico             # Browser tab icon
├── css/
│   └── main.css            # Full site styling
├── js/
│   └── main.js             # Timeline, scroll, audio, effects
├── assets/
│   ├── audio/
│   │   ├── lion.mp3        # One-shot roar (Pride section)
│   │   └── song.mp3        # Header "Lion's Song" button
│   ├── images/
│   │   ├── logo.jpg        # Lumbini Lions logo
│   │   ├── rohit.png       # Captain photo
│   │   ├── champions.jpg   # Trophy celebration
│   │   ├── og-image.jpg    # Social link preview (1200×630)
│   │   ├── favicon-32x32.png
│   │   └── apple-touch-icon.png
│   └── video/
│       └── stupa.mp4       # Hero background (peaceful loop)
└── package.json            # Local dev server script only
```

---

## Run locally

Browsers block most audio on `file://` pages. **Always use a local server**, not "Open index.html directly".

```bash
npm start
```

Then open **http://localhost:3000**

**First visit:** click the preloader ("Click to enter") — this unlocks audio in Chrome.

Alternatives: VS Code **Live Server**, or `npx serve .`

---

## How sound works

This site uses **three separate audio systems**. They do not share one player.

### 1. Lion roar (`assets/audio/lion.mp3`)

- **When:** Scrolling **down into Chapter III (The Pride)** for the first time since last visiting Hero or Sacred Ground.
- **How:** `initLionAudio()` in `js/main.js` uses GSAP ScrollTrigger on `#pride`.
- **Re-arm:** Scrolling back into `#hero` or `#sacred` resets the roar so it can play again on the next Pride entry.
- **Browser rule:** Chrome requires a user click/tap before any audio. The preloader click unlocks audio silently (volume 0 play → pause), then the roar plays at full volume when Pride is reached.

### 2. Header "Lion's Song" button (`assets/audio/song.mp3`)

- **When:** User clicks the **Lion's Song** button in the fixed header (`#audio-toggle`).
- **How:** `initHeaderSongToggle()` toggles the hidden `<audio id="lions-song-audio">` element.
- **Note:** This is your local MP3 — independent from the YouTube player in the Music section.

### 3. Music section (YouTube)

- **When:** User clicks **Lion's Song** or **Anthem** buttons inside `#anthem`.
- **How:** YouTube iframe API embeds two players (`J_Ah9Yy9W8U`, `ZsTniyGi0pU`).
- **Extra:** Clicking play scrolls to the Music section and activates the visualizer bars.

---

## How animations & scroll work

### Preloader
GSAP timeline fades out the ॐ preloader after ~2.2s. Clicking it skips the intro and unlocks audio.

### Smooth scroll (Lenis)
Lenis handles buttery scrolling. ScrollTrigger is proxied to Lenis so scroll-based animations stay in sync.

### Reveal animations
Elements with class `.reveal` fade up when they enter the viewport (ScrollTrigger, `top 85%`).

### Hero video
`stupa.mp4` plays at **0.65× speed** for a calm loop behind the title.

### Founded stat
The "Founded" number counts from **0 → 2024** when Pride enters view.

### Cricket bat cursor
On desktop, a custom SVG bat follows the mouse. Clicking triggers a swing animation and flying ball particles (GSAP).

### Champions confetti
When the Lumbini Lions winner score card enters view, red & gold confetti bursts fire (CSS + JS particles). A soft glow pulses while the Champions section is visible.

### Particles
A canvas `<canvas id="particle-canvas">` renders floating embers via `ParticleField` class.

---

## Deploy to GitHub Pages

1. On GitHub, go to **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` → folder `/ (root)` → Save
4. Wait ~1–2 minutes. Your site will be at:
   `https://<username>.github.io/awaken-the-lion/`

### After deploy — update social preview URLs

Relative `og:image` paths may not work on all social platforms. In `index.html`, change to absolute URLs:

```html
<meta property="og:image" content="https://YOUR-USERNAME.github.io/awaken-the-lion/assets/images/og-image.jpg">
<meta name="twitter:image" content="https://YOUR-USERNAME.github.io/awaken-the-lion/assets/images/og-image.jpg">
```

### Other hosts
- **Netlify:** drag & drop the folder, or connect the repo
- **Vercel:** import the GitHub repo, zero config for static sites

---

## Built with Cursor

This project was created using **[Cursor](https://cursor.com)** — an AI-powered code editor.

Typical workflow used:

1. **Describe the vision** in chat (cinematic Lumbini → Lions story, Red Paltan colors, chapter structure).
2. **Iterate section by section** — Hero video, Sacred Ground, Pride, Squad layout, Champions confetti, audio fixes.
3. **Cursor Agent** edited `index.html`, `css/main.css`, and `js/main.js` directly in the workspace.
4. **Preview & test** with `npm start` (local HTTP server) — required for audio and scroll to behave like production.
5. **Debug in chat** — e.g. lion roar not playing in Chrome was fixed by preloader audio unlock + ScrollTrigger re-arm logic.

Cursor did not replace understanding the stack — it accelerated writing HTML structure, GSAP scroll triggers, CSS grid layouts, and browser audio workarounds.

---

## Should you add a LICENSE?

**Yes — for the code.** This repo includes a **MIT License** (`LICENSE` file). That means others can freely use, modify, and learn from your HTML/CSS/JS.

**Important:** The MIT License applies to **source code only**. These may have separate rights:

- `song.mp3`, `lion.mp3` — verify you have rights to distribute
- YouTube videos — embedded, not hosted; subject to YouTube ToS
- `logo.jpg`, `champions.jpg`, `rohit.png` — team/media assets; fan use with credit
- Wikimedia images in Sacred Ground — [CC BY-SA](https://creativecommons.org/licenses/by-sa/) (credit in footer)

The footer already states this is a fan showcase, not an official property.

---

## Credits

- **Lumbini Lions** — [lumbinilions.com.np](https://lumbinilions.com.np)
- **Red Paltan** — Design showcase & contact in footer
- Squad data — [Official squad page](https://lumbinilions.com.np/our-squad)
- Sacred Ground images — Wikimedia Commons (CC BY-SA)
- Lion's Song (YouTube) — [youtu.be/J_Ah9Yy9W8U](https://youtu.be/J_Ah9Yy9W8U)
- Anthem (YouTube) — [youtu.be/ZsTniyGi0pU](https://youtu.be/ZsTniyGi0pU)

---

## Contact

Red Paltan · Lumbini  
📧 redpaltanlumbini@gmail.com  
📞 +977 976-6812227

---

<p align="center"><strong>AWAKEN THE LION</strong> · From Lumbini, For The Pride · 🇳🇵</p>
