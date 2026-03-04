/* ═══════════════════════════════════════════════════
   AARONWORLD — script.js
   • Element theming (Enka API → active character)
   • Square game covers (SteamGridDB + Discord CDN)
   • Last.fm now playing
   • Lanyard Discord presence
═══════════════════════════════════════════════════ */

/* ── ELEMENT THEME SYSTEM ── */
const ELEMENT_THEMES = {
  dendro:  {
    name: 'Dendro', color: '#b8d430', glow: 'rgba(184,212,48,0.45)',
    particles: ['🍃','🌿','🍀','🌱','🍃','🌿'],
    badgeText: 'Dendro Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Grass.png',
    headColors: ['#b8d430','#d8f070','#5a9018','#b8d430'],
    particleColors: ['#b8d430','#7acc50','#d8f070','#5a9018','#a8e840','#e8ff90'],
  },
  pyro:    {
    name: 'Pyro', color: '#ff6b20', glow: 'rgba(255,107,32,0.5)',
    particles: ['🔥','✦','◆','🔥','✦'],
    badgeText: 'Pyro Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Fire.png',
    headColors: ['#ff6b20','#ffa060','#cc3d00','#ff6b20'],
    particleColors: ['#ff6b20','#ff9050','#ffcc80','#cc3d00','#ff4000','#ffd0a0'],
  },
  hydro:   {
    name: 'Hydro', color: '#28b4e8', glow: 'rgba(40,180,232,0.5)',
    particles: ['💧','✦','◆','💧','✦'],
    badgeText: 'Hydro Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Water.png',
    headColors: ['#28b4e8','#80d8ff','#0080c8','#28b4e8'],
    particleColors: ['#28b4e8','#80d8ff','#b0e8ff','#0080c8','#0060a8','#c0f0ff'],
  },
  cryo:    {
    name: 'Cryo', color: '#90d8f0', glow: 'rgba(144,216,240,0.5)',
    particles: ['❄️','✦','◆','❄️','✦'],
    badgeText: 'Cryo Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Ice.png',
    headColors: ['#90d8f0','#c8f0ff','#5ab8e0','#90d8f0'],
    particleColors: ['#90d8f0','#c8f0ff','#e8faff','#5ab8e0','#3a98c0','#dff8ff'],
  },
  electro: {
    name: 'Electro', color: '#c060ff', glow: 'rgba(192,96,255,0.5)',
    particles: ['⚡','✦','◆','⚡','✦'],
    badgeText: 'Electro Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Electric.png',
    headColors: ['#c060ff','#e0a0ff','#8020d0','#c060ff'],
    particleColors: ['#c060ff','#e0a0ff','#f0d0ff','#8020d0','#6010b0','#ffecff'],
  },
  anemo:   {
    name: 'Anemo', color: '#40d8a0', glow: 'rgba(64,216,160,0.5)',
    particles: ['🌬️','✦','◆','🌬️','✦'],
    badgeText: 'Anemo Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Wind.png',
    headColors: ['#40d8a0','#90f0d0','#10a870','#40d8a0'],
    particleColors: ['#40d8a0','#90f0d0','#c8fff0','#10a870','#008050','#edfff8'],
  },
  geo:     {
    name: 'Geo', color: '#e8c020', glow: 'rgba(232,192,32,0.5)',
    particles: ['🪨','✦','◆','🪨','✦'],
    badgeText: 'Geo Main',
    iconUrl: 'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Rock.png',
    headColors: ['#e8c020','#fff090','#b08800','#e8c020'],
    particleColors: ['#e8c020','#fff090','#fffaaa','#b08800','#906000','#fffff0'],
  },
};

// Enka character name → element mapping (fallback for name-based lookup)
const CHAR_ELEMENT_MAP = {
  // Pyro
  'Amber':'pyro','Bennett':'pyro','Diluc':'pyro','Hu Tao':'pyro','Klee':'pyro',
  'Lyney':'pyro','Yanfei':'pyro','Yoimiya':'pyro','Xiangling':'pyro','Xinyan':'pyro',
  'Arlecchino':'pyro','Chevreuse':'pyro','Gaming':'pyro','Thoma':'pyro','Dehya':'pyro',
  'Mavuika':'pyro','Durin':'pyro',
  // Hydro
  'Barbara':'hydro','Kokomi':'hydro','Mona':'hydro','Tartaglia':'hydro',
  'Neuvillette':'hydro','Sigewinne':'hydro','Furina':'hydro',
  'Xingqiu':'hydro','Yelan':'hydro','Ayato':'hydro','Candace':'hydro','Nilou':'hydro',
  'Mualani':'hydro','Columbina':'hydro','Dahlia':'hydro','Aino':'hydro',
  // Cryo
  'Chongyun':'cryo','Diona':'cryo','Eula':'cryo','Ganyu':'cryo','Kaeya':'cryo',
  'Layla':'cryo','Qiqi':'cryo','Rosaria':'cryo','Shenhe':'cryo','Wriothesley':'cryo',
  'Ayaka':'cryo','Freminet':'cryo','Mika':'cryo','Charlotte':'cryo','Aloy':'cryo',
  'Citlali':'cryo','Escoffier':'cryo','Skirk':'cryo',
  // Electro
  'Beidou':'electro','Cyno':'electro','Fischl':'electro','Keqing':'electro','Lisa':'electro',
  'Raiden Shogun':'electro','Razor':'electro','Sara':'electro','Shinobu':'electro',
  'Yae Miko':'electro','Dori':'electro','Sethos':'electro','Clorinde':'electro',
  'Ororon':'electro','Iansan':'electro','Varesa':'electro','Ineffa':'electro','Flins':'electro',
  // Anemo
  'Jean':'anemo','Kazuha':'anemo','Lynette':'anemo','Sayu':'anemo','Sucrose':'anemo',
  'Venti':'anemo','Wanderer':'anemo','Xiao':'anemo','Faruzan':'anemo',
  'Chasca':'anemo','Xianyun':'anemo','Heizou':'anemo','Lan Yan':'anemo',
  'Mizuki':'anemo','Jahoda':'anemo','Varka':'anemo','Ifa':'anemo',
  // Geo
  'Albedo':'geo','Chiori':'geo','Gorou':'geo','Itto':'geo','Ningguang':'geo',
  'Noelle':'geo','Yun Jin':'geo','Zhongli':'geo','Navia':'geo','Kachina':'geo',
  'Xilonen':'geo','Illuga':'geo','Zibai':'geo',
  // Dendro
  'Alhaitham':'dendro','Baizhu':'dendro','Collei':'dendro','Kaveh':'dendro',
  'Kirara':'dendro','Nahida':'dendro','Tighnari':'dendro','Yaoyao':'dendro',
  'Emilie':'dendro','Kinich':'dendro','Lauma':'dendro','Nefer':'dendro',
};

function getElementForCharacter(name) {
  if (!name) return null;
  if (CHAR_ELEMENT_MAP[name]) return CHAR_ELEMENT_MAP[name];
  for (const [k,v] of Object.entries(CHAR_ELEMENT_MAP)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return null;
}

let currentElement = 'dendro';
let themeLeaves = [];

function applyElementTheme(element) {
  if (!ELEMENT_THEMES[element]) return;
  currentElement = element;
  const theme = ELEMENT_THEMES[element];

  const overlay = document.getElementById('elemTransitionOverlay');
  if (overlay) {
    overlay.classList.add('flash');
    setTimeout(() => overlay.classList.remove('flash'), 300);
  }

  document.documentElement.setAttribute('data-element', element);

  const badge = document.querySelector('.elem-badge');
  if (badge) badge.textContent = '  ' + theme.badgeText;

  document.querySelectorAll('.h-elem-icon, .pfp-elem img').forEach(img => {
    if (img.tagName === 'IMG') {
      img.src = theme.iconUrl;
      img.onerror = () => img.style.display = 'none';
    }
  });

  // Update loader element icon if still visible
  const loaderIcon = document.getElementById('loaderElemIcon');
  const loaderCenter = document.getElementById('loaderCenterIcon');
  if (loaderIcon) {
    loaderIcon.src = theme.iconUrl;
  }
  if (loaderCenter) {
    loaderCenter.style.boxShadow =
      `0 0 30px ${theme.glow}, 0 0 60px ${theme.glow.replace('0.5','0.2')}, 0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)`;
  }

  // Set favicon to element icon
  if (window._setFaviconToElement) {
    window._setFaviconToElement(theme.iconUrl);
  }

  respawnParticles();
  buildHeadphonesSVG();

  try { sessionStorage.setItem('aw_elem', element); } catch(e) {}
}

/* ── FLOATING PARTICLES ── */
function respawnParticles() {
  themeLeaves.forEach(l => l.remove());
  themeLeaves = [];
  const count = 38;
  for (let i = 0; i < count; i++) {
    const l = document.createElement('div');
    l.className = 'leaf';
    l.textContent = '✦';
    l.style.left = (Math.random() * 96) + 'vw';
    l.style.fontSize = (7 + Math.random() * 14) + 'px';
    l.style.animationDuration = (18 + Math.random() * 26) + 's';
    l.style.animationDelay   = (Math.random() * 32) + 's';
    document.body.appendChild(l);
    themeLeaves.push(l);
  }
}
respawnParticles();

/* ── NAV ── */
function showSec(id, link) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  link.classList.add('active');
}

/* visitor counter removed */

/* guestbook removed */

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── HEADPHONES SVG (element-aware) ── */
function buildHeadphonesSVG() {
  const el = document.getElementById('pfpHeadphones');
  if (!el) return;
  const theme = ELEMENT_THEMES[currentElement];
  const c1 = theme.headColors[0];
  const c2 = theme.headColors[1];
  const c3 = theme.headColors[2];
  const glow = theme.glow;

  el.innerHTML = `
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;height:100%;overflow:visible;
             filter:drop-shadow(0 0 10px ${c1}) drop-shadow(0 0 28px ${glow})">
      <path d="M 22 72 C 22 22 118 22 118 72"
        stroke="url(#bandGrad)" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M 28 70 C 28 30 112 30 112 70"
        stroke="${c2}44" stroke-width="2" stroke-linecap="round" fill="none"/>
      <rect x="14" y="64" width="10" height="22" rx="3"
        fill="url(#yokeGrad)" stroke="${c3}" stroke-width="1"/>
      <rect x="116" y="64" width="10" height="22" rx="3"
        fill="url(#yokeGrad)" stroke="${c3}" stroke-width="1"/>
      <rect x="2" y="72" width="22" height="36" rx="8"
        fill="url(#cupGrad)" stroke="${c1}" stroke-width="1.8"/>
      <rect x="6" y="77" width="14" height="26" rx="5"
        fill="url(#grillGrad)" stroke="${c1}55" stroke-width="0.8"/>
      <circle cx="13" cy="90" r="3.5" fill="url(#speakerGrad)" stroke="${c1}" stroke-width="0.8"/>
      <circle cx="13" cy="90" r="1.5" fill="${c2}"/>
      <rect x="116" y="72" width="22" height="36" rx="8"
        fill="url(#cupGrad)" stroke="${c1}" stroke-width="1.8"/>
      <rect x="120" y="77" width="14" height="26" rx="5"
        fill="url(#grillGrad)" stroke="${c1}55" stroke-width="0.8"/>
      <circle cx="127" cy="90" r="3.5" fill="url(#speakerGrad)" stroke="${c1}" stroke-width="0.8"/>
      <circle cx="127" cy="90" r="1.5" fill="${c2}"/>
      <g opacity="0.5">
        <path d="M 2 84 Q -6 90 2 96" stroke="${c1}" stroke-width="1.2" stroke-linecap="round" fill="none">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.4s" repeatCount="indefinite"/>
        </path>
      </g>
      <g opacity="0.5">
        <path d="M 138 84 Q 146 90 138 96" stroke="${c1}" stroke-width="1.2" stroke-linecap="round" fill="none">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.4s" repeatCount="indefinite"/>
        </path>
      </g>
      <defs>
        <linearGradient id="bandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="${c3}"/>
          <stop offset="30%"  stop-color="${c1}"/>
          <stop offset="50%"  stop-color="${c2}"/>
          <stop offset="70%"  stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
        <linearGradient id="yokeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="${c3}"/>
          <stop offset="100%" stop-color="${c3}88"/>
        </linearGradient>
        <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${c3}cc"/>
          <stop offset="100%" stop-color="${c3}44"/>
        </linearGradient>
        <linearGradient id="grillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#141414"/>
          <stop offset="100%" stop-color="#080808"/>
        </linearGradient>
        <radialGradient id="speakerGrad" cx="40%" cy="35%">
          <stop offset="0%"   stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </radialGradient>
      </defs>
    </svg>`;
}

/* ── NOW PLAYING VFX (element-aware) ── */
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

  const getThemeColors = () => ELEMENT_THEMES[currentElement].particleColors;
  const getThemeGlyphs = () => ELEMENT_THEMES[currentElement].particles;

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
      const glyphs = getThemeGlyphs();
      const colors = getThemeColors();
      this.glyph   = glyphs[Math.floor(Math.random() * glyphs.length)];
      this.color   = colors[Math.floor(Math.random() * colors.length)];
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
      const colors = getThemeColors();
      this.color = colors[Math.floor(Math.random() * colors.length)];
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

  let sigilAngle = 0;
  function drawSigil() {
    const r = 50;
    const theme = ELEMENT_THEMES[currentElement];
    ctx.save(); ctx.globalAlpha = 0.07;
    ctx.translate(cx, cy); ctx.rotate(sigilAngle);
    ctx.strokeStyle = theme.headColors[0]; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI/3)*i;
      i===0 ? ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    }
    ctx.closePath(); ctx.stroke();
    ctx.restore();
    sigilAngle += 0.003;
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
    const theme = ELEMENT_THEMES[currentElement];
    const c1 = theme.headColors[0];
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
      const hexToRgb = h => {
        const rv = parseInt(h.slice(1,3),16);
        const gv = parseInt(h.slice(3,5),16);
        const bv = parseInt(h.slice(5,7),16);
        return `${rv},${gv},${bv}`;
      };
      ctx.strokeStyle = `rgba(${hexToRgb(c1)},${a})`;
      ctx.lineWidth   = rings[i].strong ? 2.5 : 1.5;
      ctx.stroke();
      ctx.restore();
    }
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

/* ═══════════════════════════════════════════════════
   ENKA.NETWORK — Party Characters + Element Theme
═══════════════════════════════════════════════════ */
const ENKA_UID = '764275665';

function fetchEnka() {
  fetch(`/api/enka?uid=${ENKA_UID}`)
    .then(r => r.json())
    .then(data => handleEnkaData(data))
    .catch(err => {
      console.warn('[Enka] fetch failed:', err);
      setStaticEnka();
    });
}

function setStaticEnka() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('enka-ar', '27');
  set('enka-wl', '2');
  set('enka-region', 'EU');
  set('enka-main', 'Dendro Traveler');
  set('enka-achieve', '—');
  applyElementTheme('dendro');
}

function handleEnkaData(data) {
  if (!data || data.detail) { setStaticEnka(); return; }
  const info = data.playerInfo;
  if (!info) { setStaticEnka(); return; }

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('enka-ar', info.level || '—');
  // Also update showcase card AR
  const gcAr = document.getElementById('gc-ar');
  if (gcAr) gcAr.textContent = info.level || '—';
  set('enka-wl', info.worldLevel !== undefined ? info.worldLevel : '—');
  set('enka-region', 'EU');
  set('enka-achieve', info.finishAchievementNum || '—');

  const headerBar = document.getElementById('enka-header-bar');
  const chars = data.avatarInfoList || [];

  if (chars.length === 0) {
    setActiveCharacterCard(null);
    set('enka-main', 'Traveler');
    if (headerBar) headerBar.textContent = `AR ${info.level}  ✦  WL ${info.worldLevel}  ✦  EU`;
    applyElementTheme('dendro');
    return;
  }

  const firstChar    = chars[0];
  const charName     = getCharNameFromEnka(firstChar);
  const element      = getElementFromEnkaChar(firstChar) || getElementForCharacter(charName) || 'dendro';
  const charLevel    = getCharLevel(firstChar);
  const constellation = getConstellation(firstChar);
  const iconUrl      = getCharIconUrl(firstChar);

  set('enka-main', charName || 'Traveler');
  if (headerBar) headerBar.textContent = `AR ${info.level}  ✦  WL ${info.worldLevel}  ✦  ${charName}  ✦  EU`;

  setActiveCharacterCard({ name: charName, level: charLevel, element, iconUrl, constellation });
  applyElementTheme(element);
}

/* ── CHARACTER DATA MAPS ── */
function getCharNameFromEnka(charInfo) {
  if (!charInfo) return 'Traveler';
  const id = charInfo.avatarId;

  const ID_MAP = {
    // ── 1.0 Launch ──
    10000002: 'Kamisato Ayaka',
    10000003: 'Qiqi',
    10000005: 'Traveler',        // Lumine (female)
    10000006: 'Lisa',
    10000007: 'Traveler',        // Aether (male)
    10000014: 'Barbara',
    10000015: 'Kaeya',
    10000016: 'Diluc',
    10000020: 'Razor',
    10000021: 'Amber',
    10000022: 'Venti',
    10000023: 'Xiangling',
    10000024: 'Beidou',
    10000025: 'Xingqiu',
    10000026: 'Xiao',
    10000027: 'Ningguang',
    10000029: 'Klee',
    10000030: 'Zhongli',
    10000031: 'Fischl',
    10000032: 'Bennett',
    10000033: 'Tartaglia',
    10000034: 'Noelle',
    10000035: 'Qiqi',
    10000036: 'Chongyun',
    10000037: 'Ganyu',
    10000038: 'Albedo',
    10000039: 'Diona',
    10000041: 'Mona',
    10000042: 'Keqing',
    10000043: 'Sucrose',
    10000044: 'Xinyan',
    // ── 1.1 ──
    10000045: 'Rosaria',
    10000046: 'Hu Tao',
    10000047: 'Kazuha',
    10000048: 'Yanfei',
    10000049: 'Yoimiya',
    10000050: 'Thoma',
    // ── 1.2 ──
    10000051: 'Eula',
    // ── 1.3 ──
    10000052: 'Raiden Shogun',
    10000053: 'Sayu',
    // ── 1.4 ──
    10000054: 'Sangonomiya Kokomi',
    10000055: 'Gorou',
    10000056: 'Kujou Sara',
    // ── 2.3 ──
    10000057: 'Arataki Itto',
    // ── 2.5 ──
    10000058: 'Yae Miko',
    // ── 2.8 ──
    10000059: 'Shikanoin Heizou',
    // ── 2.7 ──
    10000060: 'Yelan',
    // ── 2.1 ──
    10000061: 'Aloy',
    // ── 2.4 ──
    10000062: 'Shenhe',
    10000063: 'Yun Jin',
    // ── 2.7 ──
    10000064: 'Kuki Shinobu',
    // ── 2.6 ──
    10000065: 'Kamisato Ayato',
    // ── 3.0 ──
    10000066: 'Collei',
    10000067: 'Dori',
    10000068: 'Tighnari',
    // ── 3.1 ──
    10000069: 'Nilou',
    10000070: 'Cyno',
    10000071: 'Candace',
    // ── 3.2 ──
    10000072: 'Nahida',
    10000073: 'Layla',
    // ── 3.3 ──
    10000074: 'Wanderer',
    10000075: 'Faruzan',
    // ── 3.4 ──
    10000076: 'Yaoyao',
    10000077: 'Alhaitham',
    // ── 3.5 ──
    10000078: 'Dehya',
    10000079: 'Mika',
    // ── 3.6 ──
    10000080: 'Kaveh',
    10000081: 'Baizhu',
    // ── 3.7 ──
    10000082: 'Kirara',
    // ── 4.0 ──
    10000083: 'Lynette',
    10000084: 'Lyney',
    10000085: 'Freminet',
    // ── 4.1 ──
    10000086: 'Neuvillette',
    10000087: 'Wriothesley',
    // ── 4.2 ──
    10000088: 'Charlotte',
    10000089: 'Furina',
    // ── 4.3 ──
    10000090: 'Navia',
    10000091: 'Chevreuse',
    // ── 4.4 ──
    10000092: 'Gaming',
    10000093: 'Xianyun',
    // ── 4.5 ──
    10000094: 'Chiori',
    // ── 4.6 ──
    10000095: 'Arlecchino',
    // ── 4.7 ──
    10000096: 'Clorinde',
    10000097: 'Sethos',
    10000098: 'Sigewinne',
    // ── 4.8 ──
    10000099: 'Emilie',
    // ── 5.0 ──
    10000100: 'Kachina',
    10000101: 'Mualani',
    10000102: 'Kinich',
    // ── 5.1 ──
    10000103: 'Xilonen',
    // ── 5.2 ──
    10000104: 'Chasca',
    10000105: 'Ororon',
    // ── 5.3 ──
    10000106: 'Citlali',
    10000107: 'Mavuika',
    10000108: 'Lan Yan',
    // ── 5.4 ──
    10000109: 'Yumemizuki Mizuki',
    // ── 5.5 ──
    10000110: 'Iansan',
    10000111: 'Varesa',
    // ── 5.6 ──
    10000112: 'Escoffier',
    10000113: 'Ifa',
    // ── 5.7 ──
    10000114: 'Dahlia',
    10000115: 'Skirk',
    // ── 5.8 ──
    10000116: 'Ineffa',
    // ── Luna I ──
    10000117: 'Aino',
    10000118: 'Lauma',
    10000119: 'Flins',
    // ── Luna II ──
    10000120: 'Nefer',
    // ── Luna III ──
    10000121: 'Durin',
    10000122: 'Jahoda',
    // ── Luna IV ──
    10000123: 'Columbina',
    10000124: 'Illuga',
    10000125: 'Zibai',
    // ── Luna V ──
    10000126: 'Varka',
  };

  const CHAR_ELEMENT_BY_ID = {
    // 1.0
    10000002: 'cryo',    // Ayaka
    10000003: 'cryo',    // Qiqi
    10000005: 'dendro',  // Traveler (Lumine, default dendro)
    10000006: 'electro', // Lisa
    10000007: 'dendro',  // Traveler (Aether, default dendro)
    10000014: 'hydro',   // Barbara
    10000015: 'cryo',    // Kaeya
    10000016: 'pyro',    // Diluc
    10000020: 'electro', // Razor
    10000021: 'pyro',    // Amber
    10000022: 'anemo',   // Venti
    10000023: 'pyro',    // Xiangling
    10000024: 'electro', // Beidou
    10000025: 'hydro',   // Xingqiu
    10000026: 'anemo',   // Xiao
    10000027: 'geo',     // Ningguang
    10000029: 'pyro',    // Klee
    10000030: 'geo',     // Zhongli
    10000031: 'electro', // Fischl
    10000032: 'pyro',    // Bennett
    10000033: 'hydro',   // Tartaglia
    10000034: 'geo',     // Noelle
    10000035: 'cryo',    // Qiqi (dupe)
    10000036: 'cryo',    // Chongyun
    10000037: 'cryo',    // Ganyu
    10000038: 'geo',     // Albedo
    10000039: 'cryo',    // Diona
    10000041: 'hydro',   // Mona
    10000042: 'electro', // Keqing
    10000043: 'anemo',   // Sucrose
    10000044: 'pyro',    // Xinyan
    // 1.1+
    10000045: 'cryo',    // Rosaria
    10000046: 'pyro',    // Hu Tao
    10000047: 'anemo',   // Kazuha
    10000048: 'pyro',    // Yanfei
    10000049: 'pyro',    // Yoimiya
    10000050: 'pyro',    // Thoma
    // 1.2+
    10000051: 'cryo',    // Eula
    // 1.3+
    10000052: 'electro', // Raiden Shogun
    10000053: 'anemo',   // Sayu
    // 1.4+
    10000054: 'hydro',   // Kokomi
    10000055: 'geo',     // Gorou
    10000056: 'electro', // Sara
    // 2.3
    10000057: 'geo',     // Itto
    // 2.5
    10000058: 'electro', // Yae Miko
    // 2.8
    10000059: 'anemo',   // Heizou
    // 2.7
    10000060: 'hydro',   // Yelan
    // 2.1
    10000061: 'cryo',    // Aloy
    // 2.4
    10000062: 'cryo',    // Shenhe
    10000063: 'geo',     // Yun Jin
    // 2.7
    10000064: 'electro', // Shinobu
    // 2.6
    10000065: 'hydro',   // Ayato
    // 3.0
    10000066: 'dendro',  // Collei
    10000067: 'electro', // Dori
    10000068: 'dendro',  // Tighnari
    // 3.1
    10000069: 'hydro',   // Nilou
    10000070: 'electro', // Cyno
    10000071: 'hydro',   // Candace
    // 3.2
    10000072: 'dendro',  // Nahida
    10000073: 'cryo',    // Layla
    // 3.3
    10000074: 'anemo',   // Wanderer
    10000075: 'anemo',   // Faruzan
    // 3.4
    10000076: 'dendro',  // Yaoyao
    10000077: 'dendro',  // Alhaitham
    // 3.5
    10000078: 'pyro',    // Dehya
    10000079: 'cryo',    // Mika
    // 3.6
    10000080: 'dendro',  // Kaveh
    10000081: 'dendro',  // Baizhu
    // 3.7
    10000082: 'dendro',  // Kirara
    // 4.0
    10000083: 'anemo',   // Lynette
    10000084: 'pyro',    // Lyney
    10000085: 'cryo',    // Freminet
    // 4.1
    10000086: 'hydro',   // Neuvillette
    10000087: 'cryo',    // Wriothesley
    // 4.2
    10000088: 'cryo',    // Charlotte
    10000089: 'hydro',   // Furina
    // 4.3
    10000090: 'geo',     // Navia
    10000091: 'pyro',    // Chevreuse
    // 4.4
    10000092: 'pyro',    // Gaming
    10000093: 'anemo',   // Xianyun
    // 4.5
    10000094: 'geo',     // Chiori
    // 4.6
    10000095: 'pyro',    // Arlecchino
    // 4.7
    10000096: 'electro', // Clorinde
    10000097: 'electro', // Sethos
    10000098: 'hydro',   // Sigewinne
    // 4.8
    10000099: 'dendro',  // Emilie
    // 5.0
    10000100: 'geo',     // Kachina
    10000101: 'hydro',   // Mualani
    10000102: 'dendro',  // Kinich
    // 5.1
    10000103: 'geo',     // Xilonen
    // 5.2
    10000104: 'anemo',   // Chasca
    10000105: 'electro', // Ororon
    // 5.3
    10000106: 'cryo',    // Citlali
    10000107: 'pyro',    // Mavuika
    10000108: 'anemo',   // Lan Yan
    // 5.4
    10000109: 'anemo',   // Mizuki
    // 5.5
    10000110: 'electro', // Iansan
    10000111: 'electro', // Varesa
    // 5.6
    10000112: 'cryo',    // Escoffier
    10000113: 'anemo',   // Ifa
    // 5.7
    10000114: 'hydro',   // Dahlia
    10000115: 'cryo',    // Skirk
    // 5.8
    10000116: 'electro', // Ineffa
    // Luna I
    10000117: 'hydro',   // Aino
    10000118: 'dendro',  // Lauma
    10000119: 'electro', // Flins
    // Luna II
    10000120: 'dendro',  // Nefer
    // Luna III
    10000121: 'pyro',    // Durin
    10000122: 'anemo',   // Jahoda
    // Luna IV
    10000123: 'hydro',   // Columbina
    10000124: 'geo',     // Illuga
    10000125: 'geo',     // Zibai
    // Luna V
    10000126: 'anemo',   // Varka
  };

  window._enkaElemById = CHAR_ELEMENT_BY_ID;
  window._enkaIdToName = ID_MAP;

  return ID_MAP[id] || 'Traveler';
}

function getElementFromEnkaChar(charInfo) {
  if (!charInfo) return null;
  const id = charInfo.avatarId;
  if (window._enkaElemById && window._enkaElemById[id]) {
    return window._enkaElemById[id];
  }
  // Traveler element determined by skillDepotId
  if (id === 10000007 || id === 10000005) {
    const depot = charInfo.skillDepotId;
    const travelerElements = {
      504: 'anemo', 704: 'electro', 604: 'geo', 1404: 'dendro',
      8: 'anemo', 6: 'pyro', 4: 'cryo', 2: 'hydro'
    };
    return travelerElements[depot] || 'dendro';
  }
  return null;
}

function getCharLevel(charInfo) {
  if (!charInfo || !charInfo.propMap) return null;
  const lvProp = charInfo.propMap['4001'];
  return lvProp ? `Lv. ${lvProp.val}` : null;
}

function getConstellation(charInfo) {
  if (!charInfo) return null;
  const consts = charInfo.talentIdList;
  return consts ? `C${consts.length}` : 'C0';
}

function getCharIconUrl(charInfo) {
  if (!charInfo) return null;
  const id = charInfo.avatarId;

  // Maps avatar ID → Enka CDN icon name
  // Format: https://enka.network/ui/UI_AvatarIcon_{name}.png
  const ICON_MAP = {
    10000002: 'Ayaka',
    10000003: 'Qiqi',
    10000005: 'PlayerBoy',   // Lumine → show male (Aether) as requested
    10000006: 'Lisa',
    10000007: 'PlayerBoy',   // Aether (male)
    10000014: 'Barbara',
    10000015: 'Kaeya',
    10000016: 'Diluc',
    10000020: 'Razor',
    10000021: 'Ambor',
    10000022: 'Venti',
    10000023: 'Xiangling',
    10000024: 'Beidou',
    10000025: 'Xingqiu',
    10000026: 'Xiao',
    10000027: 'Ningguang',
    10000029: 'Klee',
    10000030: 'Zhongli',
    10000031: 'Fischl',
    10000032: 'Bennett',
    10000033: 'Tartaglia',
    10000034: 'Noelle',
    10000036: 'Chongyun',
    10000037: 'Ganyu',
    10000038: 'Albedo',
    10000039: 'Diona',
    10000041: 'Mona',
    10000042: 'Keqing',
    10000043: 'Sucrose',
    10000044: 'Xinyan',
    10000045: 'Rosaria',
    10000046: 'Hutao',
    10000047: 'Kazuha',
    10000048: 'Feiyan',
    10000049: 'Yoimiya',
    10000050: 'Tohma',
    10000051: 'Eula',
    10000052: 'Shougun',
    10000053: 'Sayu',
    10000054: 'Kokomi',
    10000055: 'Gorou',
    10000056: 'Sara',
    10000057: 'Itto',
    10000058: 'Yae',
    10000059: 'Heizo',
    10000060: 'Yelan',
    10000061: 'Aloy',
    10000062: 'Shenhe',
    10000063: 'Yunjin',
    10000064: 'Shinobu',
    10000065: 'Ayato',
    10000066: 'Collei',
    10000067: 'Dori',
    10000068: 'Tighnari',
    10000069: 'Nilou',
    10000070: 'Cyno',
    10000071: 'Candace',
    10000072: 'Nahida',
    10000073: 'Layla',
    10000074: 'Wanderer',
    10000075: 'Faruzan',
    10000076: 'Yaoyao',
    10000077: 'Alhatham',
    10000078: 'Dehya',
    10000079: 'Mika',
    10000080: 'Kaveh',
    10000081: 'Baizhu',
    10000082: 'Kirara',
    10000083: 'Lynette',
    10000084: 'Lyney',
    10000085: 'Freminet',
    10000086: 'Neuvillette',
    10000087: 'Wriothesley',
    10000088: 'Charlotte',
    10000089: 'Furina',
    10000090: 'Navia',
    10000091: 'Chevreuse',
    10000092: 'Gaming',
    10000093: 'Liuyun',
    10000094: 'Chiori',
    10000095: 'Arlecchino',
    10000096: 'Clorinde',
    10000097: 'Sethos',
    10000098: 'Sigewinne',
    10000099: 'Emilie',
    10000100: 'Kachina',
    10000101: 'Mualani',
    10000102: 'Kinich',
    10000103: 'Xilonen',
    10000104: 'Chasca',
    10000105: 'Ororon',
    10000106: 'Citlali',
    10000107: 'Mavuika',
    10000108: 'Liuyun2',    // Lan Yan — may vary, fallback gracefully
    10000109: 'Mizuki',
    10000110: 'Iansan',
    10000111: 'Varesa',
    10000112: 'Escoffier',
    10000113: 'Ifa',
    10000114: 'Dahlia',
    10000115: 'Skirk',
    10000116: 'Ineffa',
    10000117: 'Aino',
    10000118: 'Lauma',
    10000119: 'Flins',
    10000120: 'Nefer',
    10000121: 'Durin',
    10000122: 'Jahoda',
    10000123: 'Columbina',
    10000124: 'Illuga',
    10000125: 'Zibai',
    10000126: 'Varka',
  };

  const name = ICON_MAP[id];
  if (!name) return null;
  return `https://enka.network/ui/UI_AvatarIcon_${name}.png`;
}

function setActiveCharacterCard(char) {
  const card = document.getElementById('enkaCharacterCard');
  if (!card) return;
  if (!char) { card.classList.remove('active'); return; }
  card.classList.add('active');
  const portrait = card.querySelector('.char-portrait');
  const nameEl   = card.querySelector('.char-name');
  const levelEl  = card.querySelector('.char-level');
  const constEl  = card.querySelector('.char-constellation');

  if (portrait) {
    if (char.iconUrl) {
      portrait.src = char.iconUrl;
      portrait.alt = char.name;
      portrait.style.display = 'block';
      portrait.onerror = () => { portrait.style.display = 'none'; };
    } else {
      portrait.style.display = 'none';
    }
  }
  if (nameEl)   nameEl.textContent  = char.name || 'Traveler';
  if (levelEl)  levelEl.textContent = char.level || '';
  if (constEl)  constEl.textContent = char.constellation || '';
}

/* ═══════════════════════════════════════════════════
   LAST.FM — JSONP polling
═══════════════════════════════════════════════════ */
const LASTFM_KEY  = 'd57c2c17b6a652c82b47410600dc0b61';
const LASTFM_USER = 'FoxStorm1';
let lastfmPrevKey  = null;
let lastfmScriptEl = null;

function lastfmCallback(data) {
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
            <div class="media-status"><div class="media-dot"></div>Now Playing</div>
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
  if (!playing) { card.classList.remove('active'); return; }
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
  if (lastfmScriptEl) { lastfmScriptEl.remove(); lastfmScriptEl = null; }
  const s = document.createElement('script');
  s.src = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks`
        + `&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`
        + `&callback=lastfmCallback`;
  s.onerror = () => console.warn('Last.fm JSONP failed');
  document.head.appendChild(s);
  lastfmScriptEl = s;
}

/* ═══════════════════════════════════════════════════
   LANYARD — Discord Rich Presence
═══════════════════════════════════════════════════ */
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
    if (!imageKey) return null;
    if (imageKey.startsWith('mp:external/')) {
      return `https://media.discordapp.net/external/${imageKey.replace('mp:external/', '')}`;
    }
    if (imageKey.startsWith('http')) return imageKey;
    if (appId) return `https://cdn.discordapp.com/app-assets/${appId}/${imageKey}.png`;
    return null;
  }

  function buildIconCandidates(game) {
    const appId = game.application_id;
    const candidates = [];

    const li = getLanyardImageUrl(appId, game.assets?.large_image);
    if (li) candidates.push(li);

    const steamId = DISCORD_TO_STEAM[appId] || GAME_NAME_TO_STEAM[game.name?.toLowerCase()];
    if (steamId) {
      candidates.push(`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/library_600x900.jpg`);
      candidates.push(`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/header.jpg`);
    }

    if (appId) candidates.push(`https://cdn.discordapp.com/app-icons/${appId}/icon.png`);

    if (!game.assets?.large_image && game.assets?.small_image) {
      const si = getLanyardImageUrl(appId, game.assets.small_image);
      if (si) candidates.push(si);
    }

    return candidates;
  }

  const DISCORD_TO_STEAM = {
    '356888672342802432': '230410',   // Warframe
    '363445589247131668': '892970',   // Valheim
    '356876057940836353': '570',      // Dota 2
    '365269832713969664': '730',      // CS:GO / CS2
    '438522866070716416': '1172470',  // Apex Legends
    '401875653219958785': '271590',   // GTA V
    '385880084663230464': '105600',   // Terraria
    '356876974230470659': '440',      // TF2
    '357244967025238018': '252950',   // Rocket League
    '367827983903490050': '1091500',  // Cyberpunk 2077
    '444490355991396363': '413150',   // Stardew Valley
    '359502208508739584': '374320',   // Dark Souls 3
    '378968978029936640': '1245620',  // Elden Ring
    '503250966491480065': '526870',   // Satisfactory
    '936929561302675456': null,       // Genshin Impact
  };

  const GAME_NAME_TO_STEAM = {
    'dota 2': '570',
    'counter-strike 2': '730',
    'counter-strike: global offensive': '730',
    'apex legends': '1172470',
    'grand theft auto v': '271590',
    'terraria': '105600',
    'stardew valley': '413150',
    'elden ring': '1245620',
    'dark souls iii': '374320',
    'cyberpunk 2077': '1091500',
    'valheim': '892970',
    'satisfactory': '526870',
    'rocket league': '252950',
    'warframe': '230410',
    'minecraft': null,
    'valorant': null,
    'league of legends': null,
    'genshin impact': null,
  };

  function setImgWithFallbacks(img, candidates, fallbackEmoji) {
    let idx = 0;
    function tryNext() {
      if (idx >= candidates.length) {
        if (img.parentElement) img.parentElement.innerHTML = fallbackEmoji;
        return;
      }
      img.onerror = tryNext;
      img.src = candidates[idx++];
    }
    tryNext();
  }

  function renderPresence(data) {
    const presence = data?.data;
    if (!presence) return;

    const activities = presence.activities || [];
    const status = presence.discord_status || 'offline';
    const game = activities.find(a => a.type === 0);

    const statusLabels = {
      online: 'Online · Teyvat', idle: 'Away', dnd: 'Do Not Disturb', offline: 'Offline'
    };

    if (!game) {
      widget.innerHTML = `
        <div style="padding:12px 16px;display:flex;align-items:center;gap:8px;">
          <span class="lanyard-status-dot ${status}" style="flex-shrink:0;"></span>
          <span class="lanyard-status-label">${statusLabels[status] || 'Offline'}</span>
        </div>
        <div class="lanyard-idle-msg">Not playing anything right now 🌿</div>`;
      clearInterval(elapsedInterval);
      currentActivity = null;
      return;
    }

    const startTs        = game.timestamps?.start;
    const iconCandidates = buildIconCandidates(game);
    const smallImg = (game.assets?.large_image && game.assets?.small_image)
      ? getLanyardImageUrl(game.application_id, game.assets.small_image)
      : null;

    function buildHtml() {
      const elapsed = startTs ? getElapsed(startTs) : '';
      return `
        <div class="lanyard-card">
          <div class="lanyard-icon" id="lanyardIconWrap">
            <img id="lanyardIconImg" alt="${esc(game.name)}" style="border-radius:6px;">
            ${smallImg ? `<div class="lanyard-small-icon"><img src="${smallImg}" alt=""></div>` : ''}
          </div>
          <div class="lanyard-info">
            <div class="lanyard-playing-label">
              <div class="lanyard-playing-dot"></div>
              Now Playing
            </div>
            <div class="lanyard-game-name">${esc(game.name)}</div>
            ${game.details ? `<div class="lanyard-game-detail">${esc(game.details)}</div>` : ''}
            ${game.state   ? `<div class="lanyard-game-state">${esc(game.state)}</div>`   : ''}
            ${elapsed      ? `<div class="lanyard-elapsed" id="lanyardElapsed">⏱ ${elapsed}</div>` : ''}
          </div>
        </div>`;
    }

    if (currentActivity !== game.name) {
      currentActivity = game.name;
      widget.innerHTML = buildHtml();
      const img = document.getElementById('lanyardIconImg');
      if (img) setImgWithFallbacks(img, iconCandidates, '🎮');
    }

    clearInterval(elapsedInterval);
    if (startTs) {
      elapsedInterval = setInterval(() => {
        const elapsedEl = document.getElementById('lanyardElapsed');
        if (elapsedEl) elapsedEl.textContent = `⏱ ${getElapsed(startTs)}`;
      }, 1000);
    }
  }

  function poll() {
    fetch(`/api/lanyard?id=${DISCORD_ID}`)
      .then(res => res.json())
      .then(data => renderPresence(data))
      .catch(err => {
        console.warn('[Lanyard] fetch failed:', err);
        widget.innerHTML = `<div style="padding:10px 16px;font-family:'Cinzel',serif;font-size:11px;color:var(--ink4);">Presence unavailable</div>`;
      });
  }

  poll();
  setInterval(poll, 15000);
})();

/* ── INIT ── */
buildHeadphonesSVG();
pollLastFm();
setInterval(pollLastFm, 1000);

try {
  const saved = sessionStorage.getItem('aw_elem');
  if (saved && ELEMENT_THEMES[saved]) applyElementTheme(saved);
} catch(e) {}

fetchEnka();
setInterval(fetchEnka, 300000);
