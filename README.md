# 🌊 AaronWorld

> *"Where Justice Flows Like Water, and Every Tide Tells a Story"*

A cinematic, immersive personal website inspired by **Neuvillette**, the **Oratrice Mécanique d'Cardinale**, and the world of **Genshin Impact's Fontaine**. Built to feel like the opening of an anime movie.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/aaronworld)

🔗 **Live:** [aaronworld.vercel.app](https://aaronworld.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 Cinematic Loader | Animated Fontaine seal with converging water droplets and progress meter |
| 🎵 Procedural Music | Web Audio API orchestral ambient — pentatonic melody with reverb & drone |
| 💧 Canvas Water Effects | Flowing luminescent streams that respond to your mouse |
| ✨ Particle System | 120 floating particles with mouse repulsion |
| 🌊 Ripple System | Click anywhere to create water ripples — sounds and visuals |
| 🖱️ Custom Cursor | Water droplet cursor with trailing ring |
| 📜 Scroll Animations | GSAP-powered reveals, parallax, and stagger effects |
| ⚖️ Hydro Meter | Sidebar scroll progress indicator |
| 🎮 Easter Egg | Try the Konami Code: ↑↑↓↓←→←→BA |
| 🔇 Audio Toggle | Music & sound on/off with smooth fade |

---

## 🎨 Design Tokens

```
Deep Navy    #020b18  — Background abyss
Ocean Blue   #0a4a8a  — Mid depths  
Teal Core    #00c8f0  — Primary accent
Teal Glow    #00ffee  — Highlight & glow
Gold         #c9a227  — Judicial accent
Silver       #c0d8e8  — Body text
```

**Fonts:** Cinzel Decorative (titles) + Cormorant Garamond (body)

---

## 🚀 Deploy to Vercel

### Option 1 — One-click (recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — no build config needed

### Option 2 — Vercel CLI
```bash
npm i -g vercel
cd aaronworld
vercel
```

### Option 3 — Drag & Drop
Go to [vercel.com/new](https://vercel.com/new) and drag the project folder.

---

## 📁 Project Structure

```
aaronworld/
├── index.html      # The entire site — HTML + CSS + JS
├── vercel.json     # Vercel deployment config
└── README.md       # You are here
```

This is an intentionally single-file architecture — no build process, no dependencies to install, instant deployment.

---

## 🎵 Audio System

The site uses the **Web Audio API** to generate music procedurally:

- **Drone layer** — Multiple detuned sine oscillators at 55Hz/110Hz
- **Shimmer layer** — High-frequency LFO-modulated tones
- **Melody** — Pentatonic arpeggios (D minor: 196, 220, 261, 293, 349 Hz)
- **Water noise** — Bandpass-filtered white noise
- **Reverb** — Convolution reverb with generated impulse response
- **Sound effects** — Water drops on hover/click, chord strikes on clicks

Audio requires user interaction to start (browser policy). Click the 🎵 button (bottom-right).

---

## 🌊 Visual Effects Stack

1. **CSS animated waves** — Three layered SVG waves with offset timing
2. **Hero canvas** — 20 luminescent water streams with mouse interaction
3. **Background particles** — 120 floating particles with sine-wave drift
4. **Ripple canvas** — Expanding circles triggered by mouse & clicks
5. **GSAP ScrollTrigger** — Parallax, stagger reveals, and scroll-scrub
6. **CSS glow effects** — Box shadows and filter: drop-shadow throughout

---

## 🎮 Sections

| Section | Lore Name | Content |
|---|---|---|
| Hero | — | Cinematic title reveal with water canvas |
| About | **The Chronicler** | Bio with Neuvillette-inspired portrait |
| Features | **The Realm** | Three domain cards with hover effects |
| Portfolio | **The Archive** | Five featured works/interests |
| Contact | **The Covenant** | Social links + Fontaine seal |

---

## 📝 Customisation Guide

### Change Name
Search for `Aaron` in `index.html` and replace with your name.

### Update Social Links
Find the `#covenant` section and update the `href="#"` attributes.

### Add/Edit Archive Items
Find `.archive-item` elements in the HTML and edit the title, description, and tag.

### Adjust Colors
Edit CSS custom properties in `:root {}` near the top of `<style>`.

### Modify Music
In the `AudioEngine` class, edit `melodyNotes` array to change the melody.

---

*Built with water and code. Inspired by the Hydro Sovereign.*

> *"The law of water is impartial — it flows equally to all."*
> — Neuvillette
