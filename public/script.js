/* ── FLOATING LEAVES ── */
['🍃','🌿','🍀','🌱','🍃','🌿'].forEach(e => {
  const l = document.createElement('div');
  l.className = 'leaf';
  l.textContent = e;
  l.style.left = (Math.random() * 96) + 'vw';
  l.style.fontSize = (9 + Math.random() * 13) + 'px';
  l.style.animationDuration = (15 + Math.random() * 22) + 's';
  l.style.animationDelay   = (Math.random() * 28) + 's';
  document.body.appendChild(l);
});

/* ── NAV ── */
function showSec(id, link) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  link.classList.add('active');
}

/* ── VISITOR COUNTER ──
   Uses a simple <img> pixel hit counter via hits.seeyoufarm.com
   which is CSP-safe (image loads are allowed).
   Falls back to a local sessionStorage incrementing counter.        */
(function() {
  const el = document.getElementById('cDigits');
  const show = n => {
    el.innerHTML = String(Math.max(0, n)).padStart(6, '0')
      .split('').map(d => `<div class="digit">${d}</div>`).join('');
  };
  // Read stored count and show it immediately
  const stored = parseInt(sessionStorage.getItem('aw_cnt') || '0');
  show(stored + 1);
  sessionStorage.setItem('aw_cnt', stored + 1);

  // Also fire a hits.seeyoufarm counter pixel so the count is tracked
  // (display is handled above from session; this just pings the server)
  const img = new Image();
  img.src = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=aaronworld-neocities&count_bg=%230a1206&title_bg=%230a1206&icon=&title=&edge_flat=true';
})();

/* ── GUESTBOOK ── */
(function() {
  const list = document.getElementById('gblist');
  const entries = JSON.parse(localStorage.getItem('aw_gb') || '[]');
  if (entries.length) {
    entries.forEach(e => list.insertAdjacentHTML('beforeend', gbHTML(e)));
  } else {
    list.innerHTML = `<div class="gb-empty">No messages yet — be the first to sign! 🌿</div>`;
  }
})();

function gbHTML(e) {
  return `<div class="gbentry">
    <div class="gb-top"><span class="gb-name">${esc(e.n)}</span><span class="gb-date">${e.d}</span></div>
    <div class="gb-msg">${esc(e.m)}</div>
  </div>`;
}

function submitGB() {
  const n = document.getElementById('gbN').value.trim();
  const m = document.getElementById('gbM').value.trim();
  if (!n || !m) return;
  const entry = { n, m, d: new Date().toISOString().slice(0, 10) };
  const stored = JSON.parse(localStorage.getItem('aw_gb') || '[]');
  stored.push(entry);
  localStorage.setItem('aw_gb', JSON.stringify(stored.slice(0, 50)));
  const list = document.getElementById('gblist');
  const empty = list.querySelector('.gb-empty');
  if (empty) empty.remove();
  list.insertAdjacentHTML('beforeend', gbHTML(entry));
  ['gbN', 'gbS', 'gbM'].forEach(id => document.getElementById(id).value = '');
  const ok = document.getElementById('gbOK');
  ok.style.display = 'block';
  setTimeout(() => ok.style.display = 'none', 3500);
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── HEADPHONES SVG ── */
function buildHeadphonesSVG() {
  const el = document.getElementById('pfpHeadphones');
  if (!el) return;
  el.innerHTML = `
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;height:100%;overflow:visible;
             filter:drop-shadow(0 0 10px #b8d430) drop-shadow(0 0 28px rgba(184,212,48,0.45))">
      <path d="M 22 72 C 22 22 118 22 118 72"
        stroke="url(#bandGrad)" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M 28 70 C 28 30 112 30 112 70"
        stroke="rgba(216,240,112,0.25)" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 52 36 C 60 26 80 26 88 36"
        stroke="rgba(212,168,48,0.4)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <rect x="14" y="64" width="10" height="22" rx="3"
        fill="url(#yokeGrad)" stroke="#5a9018" stroke-width="1"/>
      <rect x="16" y="66" width="6" height="4" rx="1.5" fill="rgba(184,212,48,0.25)"/>
      <rect x="116" y="64" width="10" height="22" rx="3"
        fill="url(#yokeGrad)" stroke="#5a9018" stroke-width="1"/>
      <rect x="118" y="66" width="6" height="4" rx="1.5" fill="rgba(184,212,48,0.25)"/>
      <rect x="2" y="72" width="22" height="36" rx="8"
        fill="url(#cupGrad)" stroke="#b8d430" stroke-width="1.8"/>
      <rect x="6" y="77" width="14" height="26" rx="5"
        fill="url(#grillGrad)" stroke="rgba(184,212,48,0.35)" stroke-width="0.8"/>
      <circle cx="13" cy="90" r="6" fill="none" stroke="rgba(184,212,48,0.3)" stroke-width="0.8"/>
      <circle cx="13" cy="90" r="3.5" fill="url(#speakerGrad)" stroke="#b8d430" stroke-width="0.8"/>
      <circle cx="13" cy="90" r="1.5" fill="#d8f070"/>
      <path d="M 4 76 Q 2 90 4 104" stroke="rgba(216,240,112,0.2)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <rect x="22" y="78" width="2" height="24" rx="1" fill="rgba(212,168,48,0.5)"/>
      <rect x="116" y="72" width="22" height="36" rx="8"
        fill="url(#cupGrad)" stroke="#b8d430" stroke-width="1.8"/>
      <rect x="120" y="77" width="14" height="26" rx="5"
        fill="url(#grillGrad)" stroke="rgba(184,212,48,0.35)" stroke-width="0.8"/>
      <circle cx="127" cy="90" r="6" fill="none" stroke="rgba(184,212,48,0.3)" stroke-width="0.8"/>
      <circle cx="127" cy="90" r="3.5" fill="url(#speakerGrad)" stroke="#b8d430" stroke-width="0.8"/>
      <circle cx="127" cy="90" r="1.5" fill="#d8f070"/>
      <path d="M 136 76 Q 138 90 136 104" stroke="rgba(216,240,112,0.2)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <rect x="116" y="78" width="2" height="24" rx="1" fill="rgba(212,168,48,0.5)"/>
      <g opacity="0.5">
        <path d="M 2 84 Q -6 90 2 96" stroke="#b8d430" stroke-width="1.2" stroke-linecap="round" fill="none">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.4s" repeatCount="indefinite"/>
        </path>
        <path d="M -1 80 Q -12 90 -1 100" stroke="#5a9018" stroke-width="0.9" stroke-linecap="round" fill="none">
          <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.4s" begin="0.2s" repeatCount="indefinite"/>
        </path>
      </g>
      <g opacity="0.5">
        <path d="M 138 84 Q 146 90 138 96" stroke="#b8d430" stroke-width="1.2" stroke-linecap="round" fill="none">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.4s" repeatCount="indefinite"/>
        </path>
        <path d="M 141 80 Q 152 90 141 100" stroke="#5a9018" stroke-width="0.9" stroke-linecap="round" fill="none">
          <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.4s" begin="0.2s" repeatCount="indefinite"/>
        </path>
      </g>
      <defs>
        <linearGradient id="bandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#2c5010"/>
          <stop offset="30%"  stop-color="#b8d430"/>
          <stop offset="50%"  stop-color="#d8f070"/>
          <stop offset="70%"  stop-color="#b8d430"/>
          <stop offset="100%" stop-color="#2c5010"/>
        </linearGradient>
        <linearGradient id="yokeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#1e4010"/>
          <stop offset="100%" stop-color="#0e2008"/>
        </linearGradient>
        <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#2c5818"/>
          <stop offset="50%"  stop-color="#1a3a0c"/>
          <stop offset="100%" stop-color="#0e2008"/>
        </linearGradient>
        <linearGradient id="grillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#141e08"/>
          <stop offset="100%" stop-color="#0a1206"/>
        </linearGradient>
        <radialGradient id="speakerGrad" cx="40%" cy="35%">
          <stop offset="0%"   stop-color="#5a9018"/>
          <stop offset="100%" stop-color="#1a3a0c"/>
        </radialGradient>
      </defs>
    </svg>`;
}

/* ── NOW PLAYING VFX ── */
function activateNowPlayingVfx() {
  const outer      = document.getElementById('pfpOuter');
  const headphones = document.getElementById('pfpHeadphones');
  const canvas     = document.getElementById('pfpVfx');
  if (!outer || !canvas || canvas._stopVfx) return;

  outer.classList.add('playing');
  headphones?.classList.add('active');
  canvas.classList.add('active');

  const W = canvas.offsetWidth  || 256;
  const H = canvas.offsetHeight || 256;
  canvas.width  = W;
  canvas.height = H;
  const cx = W / 2, cy = H / 2;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#b8d430','#7acc50','#d8f070','#5a9018','#a8e840','#e8ff90'];
  const GLYPHS = ['🍃','🌿','🍀','✦','◆','🌱'];
  const particles = [], orbs = [], rings = [];
  let lastBeat = 0, beatPhase = 0, frame = 0;

  class Particle {
    constructor(burst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? 2.2 + Math.random() * 3.0 : 0.4 + Math.random() * 0.9;
      this.x  = cx + (Math.random() - 0.5) * 24;
      this.y  = cy + (Math.random() - 0.5) * 24;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (burst ? 0.8 : 0.15);
      this.life = burst ? 1.0 + Math.random() * 0.4 : 0.6 + Math.random() * 0.6;
      this.maxLife = this.life;
      this.size    = burst ? 11 + Math.random() * 9 : 7 + Math.random() * 6;
      this.glyph   = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rot     = Math.random() * Math.PI * 2;
      this.rotV    = (Math.random() - 0.5) * 0.14;
      this.isGlyph = Math.random() > 0.3;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.022;  this.vx *= 0.985;
      this.rot += this.rotV; this.life -= 0.016;
    }
    draw() {
      const a = Math.max(0, this.life / this.maxLife);
      ctx.save(); ctx.globalAlpha = a;
      ctx.translate(this.x, this.y); ctx.rotate(this.rot);
      if (this.isGlyph) {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(this.glyph, 0, 0);
      } else {
        const g = ctx.createRadialGradient(0,0,0, 0,0, this.size*0.7);
        g.addColorStop(0, this.color); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0,0,this.size*0.7,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }
  }

  class Orb {
    constructor() {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 55 + Math.random() * 45;
      this.x  = cx + Math.cos(angle) * dist;
      this.y  = cy + Math.sin(angle) * dist;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r     = 3 + Math.random() * 5;
      this.life  = 1.0; this.maxLife = 1.0;
      this.decay = 0.004 + Math.random() * 0.004;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx + Math.sin(frame * 0.03 + this.phase) * 0.3;
      this.y += this.vy + Math.cos(frame * 0.02 + this.phase) * 0.3;
      this.life -= this.decay;
    }
    draw() {
      const a = Math.max(0, this.life) * 0.65;
      ctx.save(); ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(this.x,this.y,0, this.x,this.y, this.r*2.5);
      g.addColorStop(0, this.color); g.addColorStop(0.4, this.color); g.addColorStop(1,'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r*2.5,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  function spawnAmbient() {
    if (particles.length < 32) particles.push(new Particle(false));
    if (orbs.length < 10) orbs.push(new Orb());
  }
  function spawnBurst(strong) {
    const n = strong ? 14 : 7;
    for (let i = 0; i < n; i++) particles.push(new Particle(true));
    for (let i = 0; i < (strong ? 3 : 1); i++) orbs.push(new Orb());
  }

  function checkBeat(ts) {
    const BPM = 118 + Math.sin(ts * 0.00008) * 10;
    const interval = (60 / BPM) * 1000;
    if (ts - lastBeat > interval) {
      lastBeat = ts; beatPhase++;
      const strong = beatPhase % 4 === 0;
      spawnBurst(strong);
      rings.push({ ts, strong });
    }
  }

  function drawRings(ts) {
    for (let i = rings.length - 1; i >= 0; i--) {
      const age = ts - rings[i].ts;
      const dur = rings[i].strong ? 900 : 650;
      if (age > dur) { rings.splice(i,1); continue; }
      const p     = age / dur;
      const eased = 1 - Math.pow(1 - p, 3);
      const pfpR  = 56;
      const maxEx = rings[i].strong ? 46 : 30;
      const r     = pfpR + eased * maxEx;
      const a     = (1 - p) * (rings[i].strong ? 0.7 : 0.45);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle = `rgba(184,212,48,${a})`;
      ctx.lineWidth   = rings[i].strong ? 2.5 : 1.5;
      ctx.stroke();
      if (rings[i].strong && p < 0.5) {
        ctx.beginPath(); ctx.arc(cx,cy,r*1.18,0,Math.PI*2);
        ctx.strokeStyle = `rgba(216,240,112,${a*0.4})`;
        ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    }
  }

  let sigilAngle = 0;
  function drawSigil() {
    const r = 50;
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.translate(cx, cy); ctx.rotate(sigilAngle);
    ctx.strokeStyle = '#b8d430'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI/3)*i;
      i===0 ? ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    }
    ctx.closePath(); ctx.stroke();
    ctx.rotate(Math.PI/6); ctx.globalAlpha = 0.04;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI/3)*i;
      i===0 ? ctx.moveTo(Math.cos(a)*r*0.55,Math.sin(a)*r*0.55) : ctx.lineTo(Math.cos(a)*r*0.55,Math.sin(a)*r*0.55);
    }
    ctx.closePath(); ctx.stroke();
    ctx.restore();
    sigilAngle += 0.003;
  }

  let animId;
  function loop(ts) {
    ctx.clearRect(0,0,W,H);
    drawSigil();
    checkBeat(ts);
    drawRings(ts);
    for (let i = orbs.length-1; i >= 0; i--) {
      orbs[i].update(); orbs[i].draw();
      if (orbs[i].life <= 0) orbs.splice(i,1);
    }
    if (frame % 3 === 0) spawnAmbient();
    for (let i = particles.length-1; i >= 0; i--) {
      particles[i].update(); particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i,1);
    }
    frame++;
    animId = requestAnimationFrame(loop);
  }
  animId = requestAnimationFrame(loop);

  canvas._stopVfx = () => {
    cancelAnimationFrame(animId);
    ctx.clearRect(0,0,W,H);
    canvas._stopVfx = null;
    canvas.classList.remove('active');
    headphones?.classList.remove('active');
    outer.classList.remove('playing');
  };
}

/* ── ENKA STATS ──
   Neocities CSP blocks fetch() to external APIs.
   We load Enka via a dynamically injected <script> tag
   using their JSONP-style endpoint.
   Since Enka doesn't support JSONP natively, we skip live
   Enka fetching on Neocities and just show static values.    */
(function setStaticEnka() {
  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set('enka-ar', '27');
  set('enka-wl', '2');
  set('enka-region', 'EU');
  set('enka-main', 'Dendro Traveler');
  set('enka-achieve', '—');
})();

/* ══════════════════════════════════════════════════
   LAST.FM — JSONP polling (CSP-safe)
   Neocities blocks fetch() but allows dynamic <script>
   tags. Last.fm supports a &callback= JSONP parameter
   which returns JS that calls our function directly.
   We inject a new <script> tag every second, clean up
   the old one, and Last.fm calls lastfmCallback() for us.
══════════════════════════════════════════════════ */
const LASTFM_KEY  = 'd57c2c17b6a652c82b47410600dc0b61';
const LASTFM_USER = 'FoxStorm1';
let lastfmPrevKey  = null;
let lastfmScriptEl = null;

function lastfmCallback(data) {
  /* This function is called by the injected Last.fm JSONP script */
  const tracks    = data.recenttracks?.track;
  const track     = Array.isArray(tracks) ? tracks[0] : tracks;
  const isPlaying = track?.['@attr']?.nowplaying === 'true';

  if (!isPlaying) {
    updateSidebarCard(false);
    const widget = document.getElementById('lastfmWidget');
    if (widget) {
      widget.innerHTML = `<div class="gi-empty" style="padding:18px 0;">
        <span style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;color:var(--ink4);text-transform:uppercase;">
          ◆ &nbsp; Not listening right now &nbsp; ◆
        </span>
      </div>`;
    }
    lastfmPrevKey = null;
    document.getElementById('pfpVfx')?._stopVfx?.();
    return;
  }

  const title  = track.name || 'Unknown Track';
  const artist = track.artist?.['#text'] || 'Unknown Artist';
  const album  = track.album?.['#text'] || '';
  const artUrl = track.image?.find(i => i.size === 'large')?.['#text'] || '';

  updateSidebarCard(true, title, artist, artUrl);

  const trackKey = `${title}::${artist}`;
  if (trackKey !== lastfmPrevKey) {
    lastfmPrevKey = trackKey;
    const widget = document.getElementById('lastfmWidget');
    if (widget) {
      widget.innerHTML = `
        <div class="media-card">
          <div class="media-poster">
            ${artUrl
              ? `<img src="${artUrl}" alt="${esc(title)}" loading="lazy" onerror="this.parentElement.innerHTML='🎵'">`
              : '🎵'}
          </div>
          <div class="media-info">
            <div class="media-status">
              <div class="media-dot"></div>
              Now Playing
            </div>
            <div class="media-title">${esc(title)}</div>
            <div class="media-sub">${esc(artist)}${album ? ' · ' + esc(album) : ''}</div>
            <div style="margin-top:5px">
              <a href="https://www.last.fm/user/${LASTFM_USER}" target="_blank" rel="noopener"
                class="media-type-badge" style="text-decoration:none">Last.fm ↗</a>
            </div>
          </div>
        </div>`;
    }
  }

  const canvas = document.getElementById('pfpVfx');
  if (!canvas?._stopVfx) activateNowPlayingVfx();
}

function updateSidebarCard(playing, title, artist, artUrl) {
  const card = document.getElementById('sidebarNowPlaying');
  if (!card) return;
  if (!playing) {
    card.classList.remove('active');
    return;
  }
  card.classList.add('active');
  const titleEl  = document.getElementById('snpTitle');
  const artistEl = document.getElementById('snpArtist');
  const artEl    = document.getElementById('snpArt');
  if (titleEl)  titleEl.textContent  = title;
  if (artistEl) artistEl.textContent = artist;
  if (artEl) {
    artEl.innerHTML = artUrl
      ? `<img src="${artUrl}" alt="${esc(title)}" onerror="this.parentElement.innerHTML='🎵'">`
      : '🎵';
  }
}

function pollLastFm() {
  /* Remove previous JSONP script tag to avoid pile-up */
  if (lastfmScriptEl) {
    lastfmScriptEl.remove();
    lastfmScriptEl = null;
  }
  /* Inject new script tag — Last.fm will call lastfmCallback() */
  const s = document.createElement('script');
  s.src = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks`
        + `&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`
        + `&callback=lastfmCallback`;
  s.onerror = () => {
    console.warn('Last.fm JSONP script failed to load');
  };
  document.head.appendChild(s);
  lastfmScriptEl = s;
}

/* ── Build SVG headphones on load ── */
buildHeadphonesSVG();

/* ── Start polling ── */
pollLastFm();
setInterval(pollLastFm, 1000);
/* ══════════════════════════════════════════════════
   LANYARD — Discord Rich Presence via HTTP Polling
   Uses Vercel proxy (CSP-safe for Neocities)
══════════════════════════════════════════════════ */
(function initLanyard() {

  const DISCORD_ID = '789872551731527690';
  const widget = document.getElementById('lanyardWidget');
  if (!widget) return;

  let elapsedInterval = null;
  let currentActivity = null;

  function getElapsed(ts) {
    if (!ts) return '';
    const secs = Math.floor((Date.now() - ts) / 1000);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m elapsed`;
    if (m > 0) return `${m}m ${s}s elapsed`;
    return `${s}s elapsed`;
  }

  function getLanyardImageUrl(appId, imageKey) {
    if (!imageKey) return '';
    if (imageKey.startsWith('mp:external/')) {
      const path = imageKey.replace('mp:external/', '');
      return `https://media.discordapp.net/external/${path}`;
    }
    return `https://cdn.discordapp.com/app-assets/${appId}/${imageKey}.png`;
  }

  function renderPresence(data) {
    const presence = data?.data;
    if (!presence) return;

    const activities = presence.activities || [];
    const status = presence.discord_status || 'offline';
    const game = activities.find(a => a.type === 0);

    const statusLabels = {
      online: 'Online',
      idle: 'Away',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    };

    if (!game) {
      widget.innerHTML = `
        <div style="padding:10px 14px;">
          <span class="lanyard-status-dot ${status}"></span>
          ${statusLabels[status] || 'Offline'}
          <div class="lanyard-idle-msg">
            Not playing anything right now 🌿
          </div>
        </div>`;
      clearInterval(elapsedInterval);
      currentActivity = null;
      return;
    }

    const appId   = game.application_id;
    const largeImg = getLanyardImageUrl(appId, game.assets?.large_image);
    const startTs  = game.timestamps?.start;

    function buildHtml() {
      const elapsed = startTs ? getElapsed(startTs) : '';
      return `
        <div class="lanyard-card">
          <div class="lanyard-icon">
            ${largeImg
              ? `<img src="${largeImg}" alt="${esc(game.name)}" onerror="this.parentElement.innerHTML='🎮'">`
              : '🎮'}
          </div>
          <div class="lanyard-info">
            <div class="lanyard-game-name">${esc(game.name)}</div>
            ${game.details ? `<div>${esc(game.details)}</div>` : ''}
            ${game.state ? `<div>${esc(game.state)}</div>` : ''}
            ${elapsed ? `<div class="lanyard-elapsed">⏱ ${elapsed}</div>` : ''}
          </div>
        </div>`;
    }

    if (currentActivity !== game.name) {
      currentActivity = game.name;
      widget.innerHTML = buildHtml();
    }

    clearInterval(elapsedInterval);
    if (startTs) {
      elapsedInterval = setInterval(() => {
        const elapsedEl = widget.querySelector('.lanyard-elapsed');
        if (elapsedEl) {
          elapsedEl.textContent = `⏱ ${getElapsed(startTs)}`;
        }
      }, 1000);
    }
  }

  function poll() {
    fetch(`/api/lanyard?id=${DISCORD_ID}`)
      .then(res => res.json())
      .then(renderPresence)
      .catch(() => {
        widget.innerHTML = `<div style="padding:10px;">Presence unavailable</div>`;
      });
  }

  poll();
  setInterval(poll, 15000);

})();
