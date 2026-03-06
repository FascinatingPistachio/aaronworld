/* ═══════════════════════════════════════════════════════════
   AARONWORLD — script.js  v5  (Genshin Web Event Edition)
   • Animated night sky (stars · nebulae · shooting stars)
   • Floating element particles
   • Element theming via Enka.Network
   • Headphones SVG (element-aware)
   • Profile VFX canvas (music-reactive rings + particles)
   • Last.fm JSONP now-playing
   • Lanyard Discord rich presence
   • Nav section switching
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   NIGHT SKY CANVAS
══════════════════════════════════════ */
(function initSkyCanvas() {
  const canvas = document.getElementById('skyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], nebulae = [], shooters = [], frame = 0;
  let themeColors = ['rgba(100,80,200,0.35)', 'rgba(70,50,160,0.18)', 'rgba(140,120,240,0.28)'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
    buildNebulae();
  }

  function buildStars() {
    stars = [];
    const n = Math.min(320, Math.floor(W * H / 5500));
    for (let i = 0; i < n; i++) {
      const r = Math.random();
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.25 + Math.random() * 2.0,
        a: 0.15 + Math.random() * 0.85,
        speed: 0.004 + Math.random() * 0.014,
        phase: Math.random() * Math.PI * 2,
        color: r > 0.88 ? '#c4d8ff' : r > 0.74 ? '#ffeacc' : '#ffffff',
        big: r > 0.96
      });
    }
  }

  function buildNebulae() {
    nebulae = [];
    for (let i = 0; i < 6; i++) {
      nebulae.push({
        x: Math.random() * W, y: Math.random() * H * 0.8,
        rx: 100 + Math.random() * 220, ry: 60 + Math.random() * 130,
        a: 0.018 + Math.random() * 0.042
      });
    }
  }

  window._skyUpdateTheme = function(c) { themeColors = c || themeColors; };

  function spawnShooter() {
    if (Math.random() < 0.0025 && shooters.length < 3) {
      const angle = Math.PI / 7 + Math.random() * (Math.PI / 7);
      const spd   = 9 + Math.random() * 13;
      shooters.push({
        x: Math.random() * W * 0.75, y: Math.random() * H * 0.28,
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        life: 1, len: 55 + Math.random() * 110, w: 1.2 + Math.random() * 1.8
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Nebulae
    nebulae.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.rx);
      const col = themeColors[0];
      g.addColorStop(0,   col.replace(/[\d.]+\)$/, `${n.a * 2.8})`));
      g.addColorStop(0.5, col.replace(/[\d.]+\)$/, `${n.a * 1.1})`));
      g.addColorStop(1,   'transparent');
      ctx.save();
      ctx.scale(1, n.ry / n.rx);
      ctx.translate(0, n.y - n.y * (n.ry / n.rx));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Stars
    stars.forEach(s => {
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase));
      ctx.save();
      ctx.globalAlpha = s.a * tw;
      if (s.big) {
        // Cross sparkle for bright stars
        ctx.strokeStyle = s.color;
        ctx.lineWidth   = s.r * 0.5;
        ctx.globalAlpha = s.a * tw * 0.6;
        ctx.beginPath(); ctx.moveTo(s.x - s.r * 3, s.y); ctx.lineTo(s.x + s.r * 3, s.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s.x, s.y - s.r * 3); ctx.lineTo(s.x, s.y + s.r * 3); ctx.stroke();
        ctx.globalAlpha = s.a * tw;
      }
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      glow.addColorStop(0, s.color);
      glow.addColorStop(0.35, s.color);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });

    // Shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const ss = shooters[i];
      const g = ctx.createLinearGradient(
        ss.x - ss.vx * (ss.len / 10), ss.y - ss.vy * (ss.len / 10), ss.x, ss.y
      );
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.55, 'rgba(215,210,255,0.65)');
      g.addColorStop(1, 'rgba(255,255,255,0.95)');
      ctx.save();
      ctx.globalAlpha = ss.life * 0.9;
      ctx.strokeStyle = g; ctx.lineWidth = ss.w; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ss.x - ss.vx * (ss.len / 10), ss.y - ss.vy * (ss.len / 10));
      ctx.lineTo(ss.x, ss.y);
      ctx.stroke();
      ctx.restore();
      ss.x += ss.vx; ss.y += ss.vy; ss.life -= 0.026;
      if (ss.life <= 0 || ss.x > W || ss.y > H) shooters.splice(i, 1);
    }

    spawnShooter();
    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();

/* ══════════════════════════════════════
   ELEMENT THEME DATA
══════════════════════════════════════ */
const ELEMENT_THEMES = {
  dendro: {
    name:'Dendro', color:'#a8cc28', glow:'rgba(168,204,40,0.48)',
    badgeText:'Dendro Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Grass.png',
    headColors:['#b8d430','#d8f070','#5a9018','#b8d430'],
    particleColors:['#b8d430','#7acc50','#d8f070','#5a9018','#a8e840','#e8ff90'],
    particles:['🍃','🌿','✦','◆','🍃'],
    skyColors:['rgba(168,204,40,0.38)','rgba(90,144,24,0.18)','rgba(200,240,60,0.28)'],
  },
  pyro: {
    name:'Pyro', color:'#ff6b20', glow:'rgba(255,107,32,0.52)',
    badgeText:'Pyro Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Fire.png',
    headColors:['#ff6b20','#ffa060','#cc3d00','#ff6b20'],
    particleColors:['#ff6b20','#ff9050','#ffcc80','#cc3d00','#ff4000','#ffd0a0'],
    particles:['🔥','✦','◆','🔥','✦'],
    skyColors:['rgba(255,90,20,0.38)','rgba(200,50,0,0.18)','rgba(255,150,60,0.28)'],
  },
  hydro: {
    name:'Hydro', color:'#28b4e8', glow:'rgba(40,180,232,0.48)',
    badgeText:'Hydro Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Water.png',
    headColors:['#28b4e8','#80d8ff','#0080c8','#28b4e8'],
    particleColors:['#28b4e8','#80d8ff','#b0e8ff','#0080c8','#0060a8','#c0f0ff'],
    particles:['💧','✦','◆','💧','✦'],
    skyColors:['rgba(40,180,232,0.38)','rgba(0,100,180,0.18)','rgba(80,200,255,0.28)'],
  },
  cryo: {
    name:'Cryo', color:'#90d8f0', glow:'rgba(144,216,240,0.48)',
    badgeText:'Cryo Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Ice.png',
    headColors:['#90d8f0','#c8f0ff','#5ab8e0','#90d8f0'],
    particleColors:['#90d8f0','#c8f0ff','#e8faff','#5ab8e0','#3a98c0','#dff8ff'],
    particles:['❄️','✦','◆','❄️','✦'],
    skyColors:['rgba(144,216,240,0.36)','rgba(60,140,200,0.18)','rgba(180,240,255,0.25)'],
  },
  electro: {
    name:'Electro', color:'#c060ff', glow:'rgba(192,96,255,0.52)',
    badgeText:'Electro Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Electric.png',
    headColors:['#c060ff','#e0a0ff','#8020d0','#c060ff'],
    particleColors:['#c060ff','#e0a0ff','#f0d0ff','#8020d0','#6010b0','#ffecff'],
    particles:['⚡','✦','◆','⚡','✦'],
    skyColors:['rgba(192,80,255,0.38)','rgba(110,20,200,0.2)','rgba(220,140,255,0.28)'],
  },
  anemo: {
    name:'Anemo', color:'#40d8a0', glow:'rgba(64,216,160,0.48)',
    badgeText:'Anemo Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Wind.png',
    headColors:['#40d8a0','#90f0d0','#10a870','#40d8a0'],
    particleColors:['#40d8a0','#90f0d0','#c8fff0','#10a870','#008050','#edfff8'],
    particles:['🌬️','✦','◆','🌬️','✦'],
    skyColors:['rgba(64,216,160,0.36)','rgba(10,140,90,0.18)','rgba(100,240,180,0.26)'],
  },
  geo: {
    name:'Geo', color:'#e8c020', glow:'rgba(232,192,32,0.52)',
    badgeText:'Geo Main',
    iconUrl:'https://gi.yatta.moe/assets/UI/UI_Buff_Element_Rock.png',
    headColors:['#e8c020','#fff090','#b08800','#e8c020'],
    particleColors:['#e8c020','#fff090','#fffaaa','#b08800','#906000','#fffff0'],
    particles:['🪨','✦','◆','🪨','✦'],
    skyColors:['rgba(232,192,32,0.38)','rgba(160,110,0,0.2)','rgba(255,220,60,0.28)'],
  },
};

/* ══════════════════════════════════════
   CHARACTER → ELEMENT MAPS
══════════════════════════════════════ */
const CHAR_ELEM_BY_ID = {
  10000002:'cryo',10000003:'cryo',10000005:'dendro',10000006:'electro',10000007:'dendro',
  10000014:'hydro',10000015:'cryo',10000016:'pyro',10000020:'electro',10000021:'pyro',
  10000022:'anemo',10000023:'pyro',10000024:'electro',10000025:'hydro',10000026:'anemo',
  10000027:'geo',10000029:'pyro',10000030:'geo',10000031:'electro',10000032:'pyro',
  10000033:'hydro',10000034:'geo',10000036:'cryo',10000037:'cryo',10000038:'geo',
  10000039:'cryo',10000041:'hydro',10000042:'electro',10000043:'anemo',10000044:'pyro',
  10000045:'cryo',10000046:'pyro',10000047:'anemo',10000048:'pyro',10000049:'pyro',
  10000050:'pyro',10000051:'cryo',10000052:'electro',10000053:'anemo',10000054:'hydro',
  10000055:'geo',10000056:'electro',10000057:'geo',10000058:'electro',10000059:'anemo',
  10000060:'hydro',10000061:'cryo',10000062:'cryo',10000063:'geo',10000064:'electro',
  10000065:'hydro',10000066:'dendro',10000067:'electro',10000068:'dendro',10000069:'hydro',
  10000070:'electro',10000071:'hydro',10000072:'dendro',10000073:'cryo',10000074:'anemo',
  10000075:'anemo',10000076:'dendro',10000077:'dendro',10000078:'pyro',10000079:'cryo',
  10000080:'dendro',10000081:'dendro',10000082:'dendro',10000083:'anemo',10000084:'pyro',
  10000085:'cryo',10000086:'hydro',10000087:'cryo',10000088:'cryo',10000089:'hydro',
  10000090:'geo',10000091:'pyro',10000092:'pyro',10000093:'anemo',10000094:'geo',
  10000095:'pyro',10000096:'electro',10000097:'electro',10000098:'hydro',10000099:'dendro',
  10000100:'geo',10000101:'hydro',10000102:'dendro',10000103:'geo',10000104:'anemo',
  10000105:'electro',10000106:'cryo',10000107:'pyro',10000108:'anemo',10000109:'anemo',
  10000110:'electro',10000111:'electro',10000112:'cryo',10000113:'anemo',10000114:'hydro',
  10000115:'cryo',10000116:'electro',10000117:'hydro',10000118:'dendro',10000119:'electro',
  10000120:'dendro',10000121:'pyro',10000122:'anemo',10000123:'hydro',10000124:'geo',
  10000125:'geo',10000126:'anemo',
};

const CHAR_NAME_BY_ID = {
  10000002:'Kamisato Ayaka',10000003:'Qiqi',10000005:'Traveler',10000006:'Lisa',
  10000007:'Traveler',10000014:'Barbara',10000015:'Kaeya',10000016:'Diluc',
  10000020:'Razor',10000021:'Amber',10000022:'Venti',10000023:'Xiangling',
  10000024:'Beidou',10000025:'Xingqiu',10000026:'Xiao',10000027:'Ningguang',
  10000029:'Klee',10000030:'Zhongli',10000031:'Fischl',10000032:'Bennett',
  10000033:'Tartaglia',10000034:'Noelle',10000036:'Chongyun',10000037:'Ganyu',
  10000038:'Albedo',10000039:'Diona',10000041:'Mona',10000042:'Keqing',
  10000043:'Sucrose',10000044:'Xinyan',10000045:'Rosaria',10000046:'Hu Tao',
  10000047:'Kazuha',10000048:'Yanfei',10000049:'Yoimiya',10000050:'Thoma',
  10000051:'Eula',10000052:'Raiden Shogun',10000053:'Sayu',10000054:'Sangonomiya Kokomi',
  10000055:'Gorou',10000056:'Kujou Sara',10000057:'Arataki Itto',10000058:'Yae Miko',
  10000059:'Shikanoin Heizou',10000060:'Yelan',10000061:'Aloy',10000062:'Shenhe',
  10000063:'Yun Jin',10000064:'Kuki Shinobu',10000065:'Kamisato Ayato',10000066:'Collei',
  10000067:'Dori',10000068:'Tighnari',10000069:'Nilou',10000070:'Cyno',
  10000071:'Candace',10000072:'Nahida',10000073:'Layla',10000074:'Wanderer',
  10000075:'Faruzan',10000076:'Yaoyao',10000077:'Alhaitham',10000078:'Dehya',
  10000079:'Mika',10000080:'Kaveh',10000081:'Baizhu',10000082:'Kirara',
  10000083:'Lynette',10000084:'Lyney',10000085:'Freminet',10000086:'Neuvillette',
  10000087:'Wriothesley',10000088:'Charlotte',10000089:'Furina',10000090:'Navia',
  10000091:'Chevreuse',10000092:'Gaming',10000093:'Xianyun',10000094:'Chiori',
  10000095:'Arlecchino',10000096:'Clorinde',10000097:'Sethos',10000098:'Sigewinne',
  10000099:'Emilie',10000100:'Kachina',10000101:'Mualani',10000102:'Kinich',
  10000103:'Xilonen',10000104:'Chasca',10000105:'Ororon',10000106:'Citlali',
  10000107:'Mavuika',10000108:'Lan Yan',10000109:'Yumemizuki Mizuki',
  10000110:'Iansan',10000111:'Varesa',10000112:'Escoffier',10000113:'Ifa',
  10000114:'Dahlia',10000115:'Skirk',10000116:'Ineffa',10000117:'Aino',
  10000118:'Lauma',10000119:'Flins',10000120:'Nefer',10000121:'Durin',
  10000122:'Jahoda',10000123:'Columbina',10000124:'Illuga',10000125:'Zibai',
  10000126:'Varka',
};

const CHAR_ICON_BY_ID = {
  10000002:'Ayaka',10000003:'Qiqi',10000005:'PlayerBoy',10000006:'Lisa',
  10000007:'PlayerBoy',10000014:'Barbara',10000015:'Kaeya',10000016:'Diluc',
  10000020:'Razor',10000021:'Ambor',10000022:'Venti',10000023:'Xiangling',
  10000024:'Beidou',10000025:'Xingqiu',10000026:'Xiao',10000027:'Ningguang',
  10000029:'Klee',10000030:'Zhongli',10000031:'Fischl',10000032:'Bennett',
  10000033:'Tartaglia',10000034:'Noelle',10000036:'Chongyun',10000037:'Ganyu',
  10000038:'Albedo',10000039:'Diona',10000041:'Mona',10000042:'Keqing',
  10000043:'Sucrose',10000044:'Xinyan',10000045:'Rosaria',10000046:'Hutao',
  10000047:'Kazuha',10000048:'Feiyan',10000049:'Yoimiya',10000050:'Tohma',
  10000051:'Eula',10000052:'Shougun',10000053:'Sayu',10000054:'Kokomi',
  10000055:'Gorou',10000056:'Sara',10000057:'Itto',10000058:'Yae',
  10000059:'Heizo',10000060:'Yelan',10000061:'Aloy',10000062:'Shenhe',
  10000063:'Yunjin',10000064:'Shinobu',10000065:'Ayato',10000066:'Collei',
  10000067:'Dori',10000068:'Tighnari',10000069:'Nilou',10000070:'Cyno',
  10000071:'Candace',10000072:'Nahida',10000073:'Layla',10000074:'Wanderer',
  10000075:'Faruzan',10000076:'Yaoyao',10000077:'Alhatham',10000078:'Dehya',
  10000079:'Mika',10000080:'Kaveh',10000081:'Baizhu',10000082:'Kirara',
  10000083:'Lynette',10000084:'Lyney',10000085:'Freminet',10000086:'Neuvillette',
  10000087:'Wriothesley',10000088:'Charlotte',10000089:'Furina',10000090:'Navia',
  10000091:'Chevreuse',10000092:'Gaming',10000093:'Liuyun',10000094:'Chiori',
  10000095:'Arlecchino',10000096:'Clorinde',10000097:'Sethos',10000098:'Sigewinne',
  10000099:'Emilie',10000100:'Kachina',10000101:'Mualani',10000102:'Kinich',
  10000103:'Xilonen',10000104:'Chasca',10000105:'Ororon',10000106:'Citlali',
  10000107:'Mavuika',10000108:'Liuyun2',10000109:'Mizuki',10000110:'Iansan',
  10000111:'Varesa',10000112:'Escoffier',10000113:'Ifa',10000114:'Dahlia',
  10000115:'Skirk',10000116:'Ineffa',10000117:'Aino',10000118:'Lauma',
  10000119:'Flins',10000120:'Nefer',10000121:'Durin',10000122:'Jahoda',
  10000123:'Columbina',10000124:'Illuga',10000125:'Zibai',10000126:'Varka',
};

/* ══════════════════════════════════════
   ELEMENT THEME APPLICATION
══════════════════════════════════════ */
let currentElement = 'dendro';

function applyElementTheme(element) {
  if (!ELEMENT_THEMES[element]) return;
  currentElement = element;
  const theme = ELEMENT_THEMES[element];

  // Flash transition overlay
  const overlay = document.getElementById('elemTransitionOverlay');
  if (overlay) {
    overlay.classList.add('flash');
    setTimeout(() => overlay.classList.remove('flash'), 300);
  }

  // Data attribute for CSS
  document.documentElement.setAttribute('data-element', element);

  // Update element icons in header + profile
  const iconUrls = document.querySelectorAll(
    '#headerElemIconL, #headerElemIconR, .pfp-elem-badge img, #elemTag img'
  );
  iconUrls.forEach(img => {
    img.src = theme.iconUrl;
    img.onerror = () => { img.style.display = 'none'; };
  });

  // Update elem badge text
  const tag = document.getElementById('elemTag');
  if (tag) {
    const span = tag.querySelector('span');
    if (span) span.textContent = theme.badgeText;
  }

  // Update favicon
  if (window._setFaviconToElement) window._setFaviconToElement(theme.iconUrl);

  // Update sky nebula colors
  if (window._skyUpdateTheme) window._skyUpdateTheme(theme.skyColors);

  // Rebuild headphones
  buildHeadphonesSVG();

  // Respawn particles
  respawnParticles();

  // Cache
  try { sessionStorage.setItem('aw_elem', element); } catch(e) {}
}

/* ══════════════════════════════════════
   FLOATING PARTICLES
══════════════════════════════════════ */
let _particles = [];
function respawnParticles() {
  _particles.forEach(p => p.remove());
  _particles = [];
  const theme = ELEMENT_THEMES[currentElement];
  const glyphs = ['✦', '◆', '✧', '◇'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'gi-particle';
    p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    p.style.cssText = [
      `left:${2 + Math.random() * 96}vw`,
      `font-size:${6 + Math.random() * 12}px`,
      `color:${theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)]}`,
      `animation-duration:${16 + Math.random() * 28}s`,
      `animation-delay:${Math.random() * 40}s`,
    ].join(';');
    document.body.appendChild(p);
    _particles.push(p);
  }
}

/* ══════════════════════════════════════════════════════════
   ELEMENT-SPECIFIC PAGE TRANSITION WIPES
══════════════════════════════════════════════════════════ */
const _tc = document.getElementById('transitionCanvas');
const _tx = _tc ? _tc.getContext('2d') : null;
let _txBusy = false;

function _resizeTC() {
  if (!_tc) return;
  _tc.width  = window.innerWidth;
  _tc.height = window.innerHeight;
}
_resizeTC();
window.addEventListener('resize', _resizeTC);

/* ── Cinematic constellation warp ── */
/* One unified transition: a star field that rushes past at speed then
   gracefully decelerates to stillness, element-agnostic, always elegant. */

function _constellationWipe(ctx, W, H, p) {
  ctx.clearRect(0, 0, W, H);

  // ── Velocity curve: starts at full speed, decelerates with exponential ease-out
  // integral of (1-t)^2.6 gives position — we track speed separately for streak length
  const speed = Math.pow(1 - p, 2.4);           // 1.0 → 0.0
  const traveled = p - Math.pow(1 - p, 3.4) / 3.4 + (1/3.4); // normalized 0→~1

  // ── Master alpha: fade in fast, hold, fade out at the end
  const alpha = p < 0.1  ? p / 0.1
              : p > 0.78 ? 1 - (p - 0.78) / 0.22
              : 1;

  // ── Deep space background
  const bgAlpha = alpha * 0.91;
  ctx.fillStyle = `rgba(3, 2, 8, ${bgAlpha})`;
  ctx.fillRect(0, 0, W, H);

  // ── Subtle nebula wash behind the stars
  if (alpha > 0.05) {
    const nx = W * 0.55, ny = H * 0.42;
    const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, W * 0.55);
    ng.addColorStop(0,   `rgba(30, 20, 60, ${alpha * 0.28})`);
    ng.addColorStop(0.5, `rgba(18, 12, 40, ${alpha * 0.14})`);
    ng.addColorStop(1,   'transparent');
    ctx.fillStyle = ng;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Letterbox bars — thin, cinematic
  const lbH = H * 0.038;
  ctx.fillStyle = `rgba(2, 1, 6, ${alpha * 0.95})`;
  ctx.fillRect(0, 0, W, lbH);
  ctx.fillRect(0, H - lbH, W, lbH);

  // ── Star field: each star is a deterministic point based on seed i
  // At high speed they are long horizontal streaks; at low speed, dots
  const STAR_COUNT = 180;
  const maxStreakLen = W * 0.55;

  // Parallax "planes" — closer stars move faster and are brighter
  for (let i = 0; i < STAR_COUNT; i++) {
    // Deterministic position from seed
    const seed1 = (i * 2654435761) >>> 0;
    const seed2 = (i * 1013904223) >>> 0;
    const seed3 = (i * 1664525)    >>> 0;

    const baseX  = (seed1 % 10000) / 10000;   // 0-1
    const baseY  = (seed2 % 10000) / 10000;   // 0-1
    const plane  = (seed3 % 100)   / 100;     // 0-1 depth

    // Stars in closer planes travel further (parallax)
    const parallelFactor = 0.4 + plane * 1.6;

    // x position: stars stream from right to left as we "pan right"
    // At p=0 stars are at their seed position; at p=1 they've moved far left
    const drift = traveled * parallelFactor;
    const sx = ((baseX - drift) % 1 + 1) % 1;  // wraps 0–1
    const sy = baseY;

    const px = sx * W;
    const py = sy * H;

    // Streak length proportional to speed and plane depth
    const streakLen = speed * maxStreakLen * parallelFactor * 0.7;

    // Star size and brightness from plane (closer = brighter, larger)
    const brightness = 0.35 + plane * 0.65;
    const starAlpha  = alpha * brightness * (0.45 + plane * 0.55);
    const r          = 0.5 + plane * 1.6;

    if (streakLen > 2) {
      // Streak mode
      const x0 = Math.min(px + streakLen * 0.15, W + 20);
      const x1 = Math.max(px - streakLen * 0.85, -20);
      const g = ctx.createLinearGradient(x0, py, x1, py);
      const col = plane > 0.75 ? `255,248,230` : plane > 0.4 ? `220,230,255` : `180,190,255`;
      g.addColorStop(0,    `rgba(${col},0)`);
      g.addColorStop(0.15, `rgba(${col},${starAlpha * 0.6})`);
      g.addColorStop(0.7,  `rgba(${col},${starAlpha})`);
      g.addColorStop(1,    `rgba(${col},${starAlpha * 0.4})`);
      ctx.beginPath();
      ctx.moveTo(x0, py);
      ctx.lineTo(x1, py);
      ctx.strokeStyle = g;
      ctx.lineWidth = r * 0.9;
      ctx.stroke();
    } else {
      // Point/dot mode — when nearly stopped
      const col = plane > 0.75 ? `255,248,230` : plane > 0.4 ? `220,230,255` : `180,190,255`;
      // Soft glow for brighter stars
      if (plane > 0.6) {
        const gg = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        gg.addColorStop(0,   `rgba(${col},${starAlpha * 0.5})`);
        gg.addColorStop(1,   'transparent');
        ctx.fillStyle = gg;
        ctx.beginPath(); ctx.arc(px, py, r * 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${starAlpha})`;
      ctx.fill();
    }
  }

  // ── Constellation lines: appear only as speed approaches zero
  if (speed < 0.18 && alpha > 0.1) {
    const lineAlpha = alpha * (1 - speed / 0.18) * 0.32;
    // Fixed constellation pattern — a graceful arc of ~10 nodes
    const nodes = [
      [0.18, 0.22], [0.28, 0.16], [0.40, 0.20], [0.52, 0.14],
      [0.63, 0.18], [0.74, 0.25], [0.82, 0.20], [0.70, 0.35],
      [0.58, 0.38], [0.44, 0.32], [0.32, 0.36],
    ];
    // Draw lines
    ctx.beginPath();
    nodes.forEach(([nx, ny], idx) => {
      const px2 = nx * W, py2 = ny * H;
      idx === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
    });
    ctx.strokeStyle = `rgba(200, 215, 255, ${lineAlpha})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Draw node dots
    nodes.forEach(([nx, ny]) => {
      const px2 = nx * W, py2 = ny * H;
      const dotAlpha = lineAlpha * 2.5;
      const dg = ctx.createRadialGradient(px2, py2, 0, px2, py2, 5);
      dg.addColorStop(0,   `rgba(230, 240, 255, ${Math.min(dotAlpha, 0.9)})`);
      dg.addColorStop(1,   'transparent');
      ctx.fillStyle = dg;
      ctx.beginPath(); ctx.arc(px2, py2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px2, py2, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(dotAlpha * 1.4, 1)})`;
      ctx.fill();
    });
  }
}

/* Each element had a wipe function — now replaced by the unified constellation pan.
   Keep the object so no other code breaks if it references ELEMENT_WIPES. */
const ELEMENT_WIPES = {
  dendro(ctx, W, H, p) {
    // Leaf/petal burst from center — organic blobs scatter outward
    ctx.clearRect(0, 0, W, H);
    const ease = p < .5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + p * 0.8;
      const dist  = ease * Math.max(W, H) * 1.4;
      const cx    = W/2 + Math.cos(angle) * dist;
      const cy    = H/2 + Math.sin(angle) * dist;
      const r     = (0.25 + Math.sin(angle * 3) * 0.1) * Math.max(W, H) * (0.15 + ease * 0.85);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const a = p < 0.75 ? 1 : 1 - (p - 0.75) * 4;
      g.addColorStop(0, `rgba(90,140,18,${a})`);
      g.addColorStop(0.5, `rgba(60,100,10,${a * 0.9})`);
      g.addColorStop(1, `rgba(30,60,5,0)`);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill();
    }
    // Overlay fill sweep
    if (p > 0.05 && p < 0.8) {
      const sweepA = p < 0.4 ? p/0.4 : 1 - (p-0.4)/0.4;
      ctx.globalAlpha = sweepA * 0.35;
      ctx.fillStyle = '#1a3206';
      ctx.fillRect(0,0,W,H);
      ctx.globalAlpha = 1;
    }
  },

  pyro(ctx, W, H, p) {
    // Cinematic camera-pan wipe — a warm amber light sweeps left to right,
    // like sunlight crossing a wall. Soft leading edge, rich trailing fill.
    ctx.clearRect(0, 0, W, H);

    // Ease: quick start, decelerates into place
    const ease = p < 0.5
      ? 4 * p * p * p
      : 1 - Math.pow(-2 * p + 2, 3) / 2;

    // The leading edge of the pan (0 → W + bleed)
    const bleed  = W * 0.38;
    const leadX  = -bleed + (W + bleed * 2) * ease;

    // Reveal alpha — fades in quickly, holds, then fades out at the end
    const alpha = p < 0.12 ? p / 0.12
                : p > 0.82 ? 1 - (p - 0.82) / 0.18
                : 1;

    // 1 — Deep amber background fill (everything behind the lead edge)
    const fillGrad = ctx.createLinearGradient(0, 0, W, 0);
    fillGrad.addColorStop(0,    `rgba(18, 5, 0, ${alpha * 0.82})`);
    fillGrad.addColorStop(0.35, `rgba(40, 12, 2, ${alpha * 0.78})`);
    fillGrad.addColorStop(0.75, `rgba(62, 18, 4, ${alpha * 0.72})`);
    fillGrad.addColorStop(1,    `rgba(80, 22, 4, ${alpha * 0.65})`);
    ctx.fillStyle = fillGrad;
    ctx.fillRect(0, 0, Math.min(leadX, W), H);

    // 2 — The leading light column: a tall narrow shaft of warm glow
    const shaftW = W * 0.14;
    const shaftX = leadX - shaftW;
    if (shaftX < W && shaftX + shaftW > 0) {
      const shaftGrad = ctx.createLinearGradient(shaftX, 0, shaftX + shaftW, 0);
      shaftGrad.addColorStop(0,   `rgba(80, 22, 4, ${alpha * 0.72})`);
      shaftGrad.addColorStop(0.3, `rgba(180, 70, 10, ${alpha * 0.6})`);
      shaftGrad.addColorStop(0.6, `rgba(255, 140, 40, ${alpha * 0.55})`);
      shaftGrad.addColorStop(0.82,`rgba(255, 200, 100, ${alpha * 0.45})`);
      shaftGrad.addColorStop(1,   `rgba(255, 230, 160, 0)`);
      ctx.fillStyle = shaftGrad;
      ctx.fillRect(Math.max(shaftX, 0), 0, shaftW, H);
    }

    // 3 — Bright leading edge bloom: a thin radiant sliver
    const bloomW = W * 0.04;
    const bloomX = leadX - bloomW * 0.5;
    if (bloomX < W && bloomX + bloomW > 0) {
      const bloomGrad = ctx.createLinearGradient(bloomX, 0, bloomX + bloomW, 0);
      bloomGrad.addColorStop(0,   `rgba(255, 200, 110, 0)`);
      bloomGrad.addColorStop(0.35,`rgba(255, 230, 170, ${alpha * 0.85})`);
      bloomGrad.addColorStop(0.5, `rgba(255, 248, 220, ${alpha * 0.95})`);
      bloomGrad.addColorStop(0.65,`rgba(255, 230, 170, ${alpha * 0.85})`);
      bloomGrad.addColorStop(1,   `rgba(255, 200, 110, 0)`);
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(Math.max(bloomX, 0), 0, bloomW, H);
    }

    // 4 — Subtle vertical vignette bands in the filled zone (depth / atmosphere)
    if (ease > 0.08) {
      const bandCount = 4;
      for (let i = 0; i < bandCount; i++) {
        const bx   = (i / bandCount) * Math.min(leadX - shaftW, W);
        const bw   = W * 0.12;
        const ba   = alpha * 0.06 * Math.sin((i / bandCount) * Math.PI);
        const bg   = ctx.createLinearGradient(bx, 0, bx + bw, 0);
        bg.addColorStop(0,   `rgba(255,160,60,0)`);
        bg.addColorStop(0.5, `rgba(255,160,60,${ba})`);
        bg.addColorStop(1,   `rgba(255,160,60,0)`);
        ctx.fillStyle = bg;
        ctx.fillRect(Math.max(bx, 0), 0, bw, H);
      }
    }

    // 5 — Letterbox bars top + bottom for cinematic feel
    const lbH  = H * 0.045;
    const lbA  = alpha * 0.88;
    ctx.fillStyle = `rgba(8, 3, 0, ${lbA})`;
    ctx.fillRect(0, 0,      W, lbH);
    ctx.fillRect(0, H - lbH, W, lbH);
  },

  hydro(ctx, W, H, p) {
    // Water ripple flood from center — concentric expanding rings + fill
    ctx.clearRect(0, 0, W, H);
    const ease = p < .5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const maxR = Math.hypot(W, H);
    // Main fill circle
    const r = ease * maxR * 0.75;
    const fa = p > 0.8 ? 1 - (p-0.8)*5 : 1;
    const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, r);
    g.addColorStop(0,   `rgba(20,100,180,${fa})`);
    g.addColorStop(0.5, `rgba(10,70,140,${fa})`);
    g.addColorStop(1,   `rgba(5,40,90,0)`);
    ctx.beginPath(); ctx.arc(W/2, H/2, r, 0, Math.PI*2);
    ctx.fillStyle = g; ctx.fill();
    // Ripple rings
    for (let ri = 0; ri < 5; ri++) {
      const ringR = (ease - ri * 0.1) * maxR * 0.8;
      if (ringR <= 0) continue;
      const ringA = fa * (1 - ri * 0.18) * 0.6;
      ctx.beginPath(); ctx.arc(W/2, H/2, ringR, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(80,180,240,${ringA})`; ctx.lineWidth = 3 - ri*0.4; ctx.stroke();
    }
  },

  cryo(ctx, W, H, p) {
    // Frost crystals spread from corners — geometric angular growth
    ctx.clearRect(0, 0, W, H);
    const ease = p < .5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const fa = p > 0.82 ? 1 - (p-0.82)*5.8 : 1;
    const origins = [[0,0],[W,0],[0,H],[W,H],[W/2,H/2]];
    origins.forEach(([ox,oy], oi) => {
      const maxR = Math.hypot(W, H) * (0.6 + oi * 0.12);
      const r    = ease * maxR * (1 - oi * 0.06);
      if (r <= 0) return;
      // Hexagonal frost blob
      ctx.beginPath();
      const sides = 6;
      for (let s = 0; s < sides; s++) {
        const a = (s/sides)*Math.PI*2 + (oi * 0.2);
        const rx = ox + Math.cos(a) * r * (0.85 + Math.sin(a*3)*0.15);
        const ry = oy + Math.sin(a) * r * (0.85 + Math.cos(a*2)*0.15);
        s === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      const g = ctx.createRadialGradient(ox,oy,0,ox,oy,r);
      g.addColorStop(0,   `rgba(160,230,255,${fa * (0.9 - oi*0.1)})`);
      g.addColorStop(0.4, `rgba(80,160,210,${fa * (0.85 - oi*0.1)})`);
      g.addColorStop(1,   `rgba(20,60,110,0)`);
      ctx.fillStyle = g; ctx.fill();
    });
    // Snowflake sparkles
    if (ease > 0.2) {
      for (let i = 0; i < 20; i++) {
        const sx = (i / 20) * W;
        const sy = ((i * 37) % H);
        const sr = (ease - 0.2) * 12 * fa;
        ctx.save(); ctx.translate(sx, sy); ctx.globalAlpha = fa * 0.7;
        ctx.strokeStyle = 'rgba(220,245,255,0.9)'; ctx.lineWidth = 1;
        for (let a = 0; a < 6; a++) {
          const ang = (a/6)*Math.PI*2;
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(ang)*sr, Math.sin(ang)*sr); ctx.stroke();
        }
        ctx.restore();
      }
    }
  },

  electro(ctx, W, H, p) {
    // Lightning wipe — jagged vertical strike from top, fans out
    ctx.clearRect(0, 0, W, H);
    const ease  = 1 - Math.pow(1-p, 2.5);
    const fa    = p > 0.75 ? 1 - (p-0.75)*4 : 1;
    // Background flash
    ctx.globalAlpha = fa * Math.sin(p * Math.PI) * 0.5;
    ctx.fillStyle = 'rgba(140,60,255,1)';
    ctx.fillRect(0,0,W,H);
    ctx.globalAlpha = 1;

    // Multiple lightning bolts from top
    const bolts = [W*0.25, W*0.5, W*0.75];
    bolts.forEach((bx, bi) => {
      const seg = 18;
      const totalH = H * ease;
      ctx.beginPath(); ctx.moveTo(bx, 0);
      let cx2 = bx, cy2 = 0;
      for (let s = 1; s <= seg; s++) {
        cy2 = (s / seg) * totalH;
        cx2 = bx + (Math.sin(s * 4.5 + bi * 2.8 + p * 30) * 55) * (1 - s/seg * 0.4);
        ctx.lineTo(cx2, cy2);
      }
      const bAlpha = fa * (0.9 - bi * 0.1);
      ctx.strokeStyle = `rgba(220,160,255,${bAlpha})`; ctx.lineWidth = 3 - bi*0.5;
      ctx.shadowColor = '#cc80ff'; ctx.shadowBlur = 20; ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${bAlpha * 0.8})`; ctx.lineWidth = 1.2; ctx.shadowBlur = 0; ctx.stroke();
    });
    // Purple flood fill
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,   `rgba(80,10,140,${fa * ease * 0.7})`);
    g.addColorStop(0.5, `rgba(50,5,100,${fa * ease * 0.6})`);
    g.addColorStop(1,   `rgba(20,2,50,${fa * ease * 0.5})`);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H*ease*0.4);
  },

  anemo(ctx, W, H, p) {
    // Wind spiral — swirling ribbons of teal from edges, curling inward
    ctx.clearRect(0, 0, W, H);
    const ease = p < .5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const fa   = p > 0.78 ? 1-(p-0.78)*4.5 : 1;
    // Spiraling arcs
    for (let ri = 0; ri < 8; ri++) {
      const offset = ri / 8;
      const startAngle = offset * Math.PI * 2;
      const arcLen    = ease * Math.PI * 3;
      const maxR      = Math.hypot(W,H) * 0.6 * (1 - offset * 0.08);
      ctx.beginPath();
      for (let t = 0; t <= 60; t++) {
        const tt   = t / 60;
        const ang  = startAngle + arcLen * tt;
        const r2   = maxR * tt * ease;
        const x    = W/2 + Math.cos(ang) * r2;
        const y    = H/2 + Math.sin(ang) * r2;
        t === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      const alpha = fa * (0.7 - ri * 0.06);
      ctx.strokeStyle = `rgba(40,200,140,${alpha})`; ctx.lineWidth = 6 - ri * 0.5; ctx.stroke();
    }
    // Central glow
    const r = ease * Math.min(W,H) * 0.5;
    const g = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,r);
    g.addColorStop(0,   `rgba(40,200,140,${fa * 0.4})`);
    g.addColorStop(0.5, `rgba(10,120,80,${fa * 0.25})`);
    g.addColorStop(1,   `rgba(0,50,35,0)`);
    ctx.beginPath(); ctx.arc(W/2,H/2,r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
  },

  geo(ctx, W, H, p) {
    // Rock shatter — polygonal tiles crack from center outward
    ctx.clearRect(0, 0, W, H);
    const ease = 1-Math.pow(1-p,3);
    const fa   = p > 0.8 ? 1-(p-0.8)*5 : 1;
    const tileSize = 80;
    const cols = Math.ceil(W / tileSize) + 2;
    const rows = Math.ceil(H / tileSize) + 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tx = col * tileSize - tileSize;
        const ty = row * tileSize - tileSize;
        const tcx = tx + tileSize/2, tcy = ty + tileSize/2;
        const dist = Math.hypot(tcx - W/2, tcy - H/2) / Math.hypot(W/2, H/2);
        const delay = dist * 0.4;
        const tileP = Math.max(0, Math.min(1, (ease - delay) / (1 - delay)));
        if (tileP <= 0) continue;
        // Each tile drops in with an offset
        const dropY  = (1 - tileP) * 60;
        const alpha  = tileP * fa;
        const jx     = ((col * 17 + row * 31) % 20 - 10) * 0.5;
        const jy     = ((col * 23 + row * 13) % 20 - 10) * 0.5;
        // Hexagonal-ish tile
        ctx.save();
        ctx.translate(tcx + jx, tcy + jy + dropY);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        const sides = 6;
        for (let s = 0; s < sides; s++) {
          const a = (s/sides)*Math.PI*2 + 0.5;
          const r = tileSize * 0.52;
          s === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
                  : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath();
        const g = ctx.createRadialGradient(0,0,0,0,0,tileSize*0.5);
        g.addColorStop(0,   `rgba(220,180,30,1)`);
        g.addColorStop(0.4, `rgba(160,120,10,1)`);
        g.addColorStop(1,   `rgba(80,55,5,1)`);
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = `rgba(255,220,60,0.4)`; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      }
    }
  },
};

/* Run a wipe transition then switch sections */
function showSec(id, btn) {
  if (_txBusy) return;
  const current = document.querySelector('.section.active');
  if (current && current.id === id) return;

  if (!_tc || !_tx) {
    _doSwitch(id, btn); return;
  }

  _txBusy = true;
  _tc.classList.add('active');
  _resizeTC();
  const W = _tc.width, H = _tc.height;

  // Longer duration so the deceleration arc is clearly felt
  const DURATION = 900;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / DURATION, 1);

    _constellationWipe(_tx, W, H, p);

    // Switch content just past the midpoint, while overlay is fully opaque
    if (p >= 0.44 && !_tc._switched) {
      _tc._switched = true;
      _doSwitch(id, btn);
    }

    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      _tx.clearRect(0, 0, W, H);
      _tc.classList.remove('active');
      _tc._switched = false;
      _txBusy = false;
    }
  }
  requestAnimationFrame(tick);
}

function _doSwitch(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  if (window.innerWidth <= 800) window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if (_txBusy) return;
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const active = links.findIndex(l => l.classList.contains('active'));
  if (e.key === 'ArrowRight' && active < links.length - 1) links[active + 1].click();
  if (e.key === 'ArrowLeft'  && active > 0)               links[active - 1].click();
});

/* ══════════════════════════════════════
   HEADPHONES SVG
══════════════════════════════════════ */
function buildHeadphonesSVG() {
  const el = document.getElementById('pfpHeadphones');
  if (!el) return;
  const t  = ELEMENT_THEMES[currentElement];
  const c1 = t.headColors[0];
  const c2 = t.headColors[1];
  const c3 = t.headColors[2];
  const h2r = h => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      h.replace(/^#([a-f\d]{3})$/i,(_,a,b,c)=>`#${a+a}${b+b}${c+c}`));
    return m?`${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}`:'180,180,180';
  };
  const r1=h2r(c1), r2=h2r(c2), r3=h2r(c3);

  /* ════════════════════════════════════════════════════════════
     3D PROJECTION DERIVATION (orthographic, viewer in -Z)
     ────────────────────────────────────────────────────────────
     SVG viewBox 172×164  |  Container top:-50px, centred
     pfp-outer 116×116    →  avatar circle cx=86 cy=108 r=58

     Ear level y=104.  At y=104 on the avatar circle:
       dx = √(58²−(108−104)²) = √3348 ≈ 57.9
       Avatar left x = 28.1  right x = 143.9

     Cup face tilt: 38° forward from pure sideways.
       Normal (left): (−cos38°, 0, sin38°) = (−0.788, 0, 0.616)
       Projected rx = cupR·sin(38°) = 26·0.616 ≈ 16
       Projected ry = cupR = 26

     Cup housing depth = 12px (projected screen shift toward head)
       depth_shift_x = 12·|cos38°| = 12·0.788 ≈ 9.5 → 9 px

     Front face LEFT:  cx=12 cy=104 rx=16 ry=26
       inner_edge = 12+16 = 28 ✓ (avatar left edge)
     Back  face LEFT:  cx=21 cy=104  (shifted 9px toward head)

     Front face RIGHT: cx=160 cy=104 rx=16 ry=26
       inner_edge = 160−16 = 144 ✓ (avatar right edge)
     Back  face RIGHT: cx=151 cy=104

     Cup top y = 104−26 = 78.

     Headband arc: endpoints at avatar-temple level (y=88)
       At y=88: dx = √(58²−20²) = √2964 ≈ 54.4
       Endpoints (30,88) and (142,88)  [2px outside avatar]
       Arc ellipse: centre(86,88) rx=56 ry=78 → peak (86,10)
       Verify: ((30−86)/56)² = 1.0 ✓

     Yoke: y=78→88  (10px height between cup top and band endpoint)

     Rim SVG paths (outer half-ellipse front, then back):
       LEFT : M 12 78 A 16 26 0 0 0 12 130 L 21 130 A 16 26 0 0 1 21 78 Z
       RIGHT: M 160 78 A 16 26 0 0 1 160 130 L 151 130 A 16 26 0 0 0 151 78 Z
  ════════════════════════════════════════════════════════════ */

  el.innerHTML = `
<svg viewBox="0 0 172 164" fill="none" xmlns="http://www.w3.org/2000/svg"
     style="width:100%;height:100%;overflow:visible;display:block">
<defs>

  <!-- ── BAND gradients ── -->
  <linearGradient id="hbA" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#2c2c2c"/>
    <stop offset="42%"  stop-color="#1a1a1a"/>
    <stop offset="100%" stop-color="#0d0d0d"/>
  </linearGradient>
  <linearGradient id="hbS" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(255,255,255,.24)"/>
    <stop offset="55%"  stop-color="rgba(255,255,255,.04)"/>
    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
  </linearGradient>
  <linearGradient id="hbE" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="${c3}" stop-opacity="0"/>
    <stop offset="28%"  stop-color="${c1}" stop-opacity=".6"/>
    <stop offset="50%"  stop-color="${c2}" stop-opacity=".95"/>
    <stop offset="72%"  stop-color="${c1}" stop-opacity=".6"/>
    <stop offset="100%" stop-color="${c3}" stop-opacity="0"/>
  </linearGradient>

  <!-- ── YOKE metal ── -->
  <linearGradient id="ykM" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#141414"/>
    <stop offset="50%"  stop-color="#232323"/>
    <stop offset="100%" stop-color="#141414"/>
  </linearGradient>

  <!-- ── CUP FRONT FACE ── -->
  <!-- Left cup: lit upper-right (inward+up face gets light), shadows lower-left/outer -->
  <linearGradient id="cpL" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#2e2e2e"/>
    <stop offset="32%"  stop-color="#1f1f1f"/>
    <stop offset="68%"  stop-color="#141414"/>
    <stop offset="100%" stop-color="#090909"/>
  </linearGradient>
  <!-- Right cup: lit upper-left (mirror) -->
  <linearGradient id="cpR" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%"   stop-color="#2e2e2e"/>
    <stop offset="32%"  stop-color="#1f1f1f"/>
    <stop offset="68%"  stop-color="#141414"/>
    <stop offset="100%" stop-color="#090909"/>
  </linearGradient>

  <!-- ── RIM FILL — visible depth strip (top-lit inner housing edge) ── -->
  <linearGradient id="rimF" x1="0" y1="0" x2="0" y2="1"
                  gradientUnits="userSpaceOnUse" y1="78" y2="130">
    <stop offset="0%"   stop-color="rgba(62,62,62,1)"/>
    <stop offset="22%"  stop-color="rgba(38,38,38,1)"/>
    <stop offset="60%"  stop-color="rgba(18,18,18,1)"/>
    <stop offset="100%" stop-color="rgba(7,7,7,1)"/>
  </linearGradient>
  <!-- Thin element-tinted top edge of rim -->
  <linearGradient id="rimEl" x1="0" y1="0" x2="0" y2="1"
                  gradientUnits="userSpaceOnUse" y1="78" y2="130">
    <stop offset="0%"   stop-color="rgba(${r1},.35)"/>
    <stop offset="30%"  stop-color="rgba(${r1},.08)"/>
    <stop offset="100%" stop-color="rgba(${r1},0)"/>
  </linearGradient>

  <!-- ── EMBLEM recess ── -->
  <radialGradient id="emb" cx="46%" cy="38%" r="56%">
    <stop offset="0%"   stop-color="#1c1c1c"/>
    <stop offset="65%"  stop-color="#111"/>
    <stop offset="100%" stop-color="#070707"/>
  </radialGradient>

  <!-- ── SPECULAR flares (upper-outer corner of each cup) ── -->
  <!-- Left: flare at upper-right of cup face (inner-top, lit area) -->
  <radialGradient id="hiL" cx="74%" cy="21%" r="44%">
    <stop offset="0%"   stop-color="rgba(255,255,255,.20)"/>
    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
  </radialGradient>
  <!-- Right: mirror -->
  <radialGradient id="hiR" cx="26%" cy="21%" r="44%">
    <stop offset="0%"   stop-color="rgba(255,255,255,.20)"/>
    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
  </radialGradient>

  <!-- ── FILTERS ── -->
  <!-- LED glow: expand outward for the arc stroke -->
  <filter id="lg" x="-120%" y="-55%" width="340%" height="210%">
    <feGaussianBlur stdDeviation="2.4" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <!-- Soft ambient halo -->
  <filter id="ah" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="7"/>
  </filter>
  <!-- AO shadow -->
  <filter id="ao" x="-60%" y="-40%" width="220%" height="180%">
    <feGaussianBlur stdDeviation="3.5"/>
  </filter>
</defs>

<!-- ══ 1. AMBIENT HALOS — blurred element-colour glow behind cups ══ -->
<ellipse cx="12"  cy="104" rx="22" ry="32" fill="rgba(${r1},.10)" filter="url(#ah)"/>
<ellipse cx="160" cy="104" rx="22" ry="32" fill="rgba(${r1},.10)" filter="url(#ah)"/>

<!-- ══ 2. AMBIENT OCCLUSION — soft shadow where cup meets head ══ -->
<!-- Left: at avatar left edge (x=28), ear level (y=104) -->
<ellipse cx="28" cy="104" rx="6" ry="18" fill="rgba(0,0,0,.30)" filter="url(#ao)"/>
<!-- Right: avatar right edge (x=144) -->
<ellipse cx="144" cy="104" rx="6" ry="18" fill="rgba(0,0,0,.30)" filter="url(#ao)"/>

<!-- ══ 3. HEADBAND ══ -->
<!-- 3a. Outer drop-shadow stroke -->
<path d="M 30 88 A 56 78 0 0 0 142 88"
      stroke="#030303" stroke-width="11.5" stroke-linecap="round" fill="none"/>
<!-- 3b. Main metal tube body -->
<path d="M 30 88 A 56 78 0 0 0 142 88"
      stroke="url(#hbA)" stroke-width="9" stroke-linecap="round" fill="none"/>
<!-- 3c. Specular — top edge of tube (lighter, facing up toward light) -->
<path d="M 32 85 A 54 75 0 0 0 140 85"
      stroke="url(#hbS)" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".9"/>
<!-- 3d. Element accent stripe (runs along the middle of the band) -->
<path d="M 38 82 A 48 68 0 0 0 134 82"
      stroke="url(#hbE)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
<!-- 3e. Micro stitching at crown — top-centre of band -->
<path d="M 54 36 C 70 20 102 20 118 36"
      stroke="rgba(255,255,255,.05)" stroke-width=".7"
      stroke-dasharray="2.2 4.8" stroke-linecap="round" fill="none"/>

<!-- ══ 4. CUP SYSTEM: draw back→rim→front so front occludes rim ══ -->

<!-- ── 4a. BACK FACES (cup housing inner-wall depth) ── -->
<!-- Left back face: cx=21, same rx/ry as front but shifted 9px toward head -->
<ellipse cx="21"  cy="104" rx="16" ry="26" fill="#090909" opacity=".9"/>
<!-- Right back face: cx=151 -->
<ellipse cx="151" cy="104" rx="16" ry="26" fill="#090909" opacity=".9"/>

<!-- ── 4b. RIM FILLS (the 3D depth strip: outer half, front→back→front loop) ──
     Path traces:  front-top → outer-arc front → front-bottom
                   → back-bottom → outer-arc back (reverse) → back-top → close
     LEFT : front outer arc is LEFT half (sweep=0 = CCW = goes left/outer)
     RIGHT: front outer arc is RIGHT half (sweep=1 = CW  = goes right/outer) -->
<!-- Left rim fill -->
<path d="M 12 78 A 16 26 0 0 0 12 130 L 21 130 A 16 26 0 0 1 21 78 Z"
      fill="url(#rimF)"/>
<!-- Left rim element tint overlay -->
<path d="M 12 78 A 16 26 0 0 0 12 130 L 21 130 A 16 26 0 0 1 21 78 Z"
      fill="url(#rimEl)"/>
<!-- Right rim fill -->
<path d="M 160 78 A 16 26 0 0 1 160 130 L 151 130 A 16 26 0 0 0 151 78 Z"
      fill="url(#rimF)"/>
<!-- Right rim element tint overlay -->
<path d="M 160 78 A 16 26 0 0 1 160 130 L 151 130 A 16 26 0 0 0 151 78 Z"
      fill="url(#rimEl)"/>

<!-- ── 4c. RIM EDGES — top/bottom bright lines showing housing shelf ── -->
<!-- Left: top edge line (front-top to back-top) — brightly lit shelf -->
<line x1="12" y1="78" x2="21" y2="78"
      stroke="rgba(255,255,255,.28)" stroke-width=".9"/>
<!-- Left: bottom edge — in shadow -->
<line x1="12" y1="130" x2="21" y2="130"
      stroke="rgba(255,255,255,.07)" stroke-width=".6"/>
<!-- Right: top edge -->
<line x1="160" y1="78" x2="151" y2="78"
      stroke="rgba(255,255,255,.28)" stroke-width=".9"/>
<!-- Right: bottom edge -->
<line x1="160" y1="130" x2="151" y2="130"
      stroke="rgba(255,255,255,.07)" stroke-width=".6"/>

<!-- ── 4d. FRONT FACE SHELLS ── -->
<!-- Left cup front face shadow -->
<ellipse cx="13"  cy="105" rx="17" ry="27" fill="rgba(0,0,0,.45)"/>
<!-- Left cup front face body -->
<ellipse cx="12"  cy="104" rx="16" ry="26" fill="url(#cpL)"/>
<!-- Left cup element rim stroke -->
<ellipse cx="12"  cy="104" rx="16" ry="26"
         fill="none" stroke="url(#rimEl)" stroke-width="1.7" opacity=".9"/>
<!-- Left cup specular flare -->
<ellipse cx="12"  cy="104" rx="16" ry="26" fill="url(#hiL)"/>

<!-- Right cup front face shadow -->
<ellipse cx="159" cy="105" rx="17" ry="27" fill="rgba(0,0,0,.45)"/>
<!-- Right cup front face body -->
<ellipse cx="160" cy="104" rx="16" ry="26" fill="url(#cpR)"/>
<ellipse cx="160" cy="104" rx="16" ry="26"
         fill="none" stroke="url(#rimEl)" stroke-width="1.7" opacity=".9"/>
<ellipse cx="160" cy="104" rx="16" ry="26" fill="url(#hiR)"/>

<!-- ── 4e. CUP FACE DETAILS ── -->
<!-- EMBLEM RECESS — recessed oval logo area on cup face -->
<!-- Left emblem -->
<ellipse cx="12" cy="104" rx="8.5" ry="13" fill="url(#emb)"/>
<ellipse cx="12" cy="104" rx="8.5" ry="13"
         fill="none" stroke="rgba(${r1},.32)" stroke-width=".85"/>
<!-- Left inner detail ring -->
<ellipse cx="12" cy="104" rx="5"   ry="7.5"
         fill="none" stroke="rgba(${r1},.18)" stroke-width=".65"/>
<!-- Left centre accent dot -->
<ellipse cx="12" cy="104" rx="2"   ry="2.8"
         fill="rgba(${r2},.55)"/>
<!-- Left specular micro-bead (upper inner corner — most lit area) -->
<ellipse cx="16" cy="99"  rx="1.4" ry="1.6" fill="rgba(255,255,255,.25)"/>

<!-- Right emblem -->
<ellipse cx="160" cy="104" rx="8.5" ry="13" fill="url(#emb)"/>
<ellipse cx="160" cy="104" rx="8.5" ry="13"
         fill="none" stroke="rgba(${r1},.32)" stroke-width=".85"/>
<ellipse cx="160" cy="104" rx="5"   ry="7.5"
         fill="none" stroke="rgba(${r1},.18)" stroke-width=".65"/>
<ellipse cx="160" cy="104" rx="2"   ry="2.8"  fill="rgba(${r2},.55)"/>
<ellipse cx="156" cy="99"  rx="1.4" ry="1.6"  fill="rgba(255,255,255,.25)"/>

<!-- ── 4f. LED ARCS — element-colour glow strip on cup outer edge ── -->
<!-- Left LED: arc along outer portion of left cup face, mid-height
     Points: at y=92 and y=116 on outer arc of ellipse(cx=12,rx=16,ry=26)
     x = 12 − 16·√(1−((y−104)/26)²)
     y=92: x = 12 − 16·√(1−144/676) = 12 − 16·(23.2/26) ≈ 12−14.3 = −2.3 ≈ −2
     y=116: same x ≈ −2  (symmetric)
     Arc: CCW sweep from (−2,92) around outer (−4,104) to (−2,116) -->
<path d="M -2 92 A 16 26 0 0 0 -2 116"
      stroke="${c1}" stroke-width="1.4" stroke-linecap="round" fill="none"
      opacity=".9" filter="url(#lg)"/>
<!-- Right LED: mirror — CW sweep on right side of cx=160 cup -->
<path d="M 174 92 A 16 26 0 0 1 174 116"
      stroke="${c1}" stroke-width="1.4" stroke-linecap="round" fill="none"
      opacity=".9" filter="url(#lg)"/>

<!-- ── 4g. MOUNT SCREW DETAILS ── -->
<circle cx="24" cy="80"  r="1.2" fill="rgba(255,255,255,.12)"/>
<circle cx="24" cy="128" r="1.2" fill="rgba(255,255,255,.12)"/>
<circle cx="148" cy="80" r="1.2" fill="rgba(255,255,255,.12)"/>
<circle cx="148" cy="128" r="1.2" fill="rgba(255,255,255,.12)"/>

<!-- ══ 5. YOKE ARMS — drawn last so they appear over band endpoints ══ -->
<!-- Left yoke: x=19–32, y=78–88  (centred at x=25.5, bridges cup top to band) -->
<rect x="19" y="78" width="13" height="10" rx="2"
      fill="url(#ykM)" stroke="rgba(255,255,255,.07)" stroke-width=".6"/>
<!-- Adjustment notches on yoke face -->
<line x1="20.5" y1="81" x2="30.5" y2="81" stroke="rgba(255,255,255,.11)" stroke-width=".5"/>
<line x1="20.5" y1="83.5" x2="30.5" y2="83.5" stroke="rgba(255,255,255,.11)" stroke-width=".5"/>
<line x1="20.5" y1="86" x2="30.5" y2="86" stroke="rgba(255,255,255,.11)" stroke-width=".5"/>
<!-- Yoke outer-edge specular (thin bright line on left face of left yoke) -->
<line x1="19.5" y1="78" x2="19.5" y2="88" stroke="rgba(255,255,255,.16)" stroke-width=".6"/>

<!-- Right yoke: x=140–153, y=78–88 -->
<rect x="140" y="78" width="13" height="10" rx="2"
      fill="url(#ykM)" stroke="rgba(255,255,255,.07)" stroke-width=".6"/>
<line x1="141.5" y1="81" x2="151.5" y2="81" stroke="rgba(255,255,255,.11)" stroke-width=".5"/>
<line x1="141.5" y1="83.5" x2="151.5" y2="83.5" stroke="rgba(255,255,255,.11)" stroke-width=".5"/>
<line x1="141.5" y1="86" x2="151.5" y2="86" stroke="rgba(255,255,255,.11)" stroke-width=".5"/>
<line x1="152.5" y1="78" x2="152.5" y2="88" stroke="rgba(255,255,255,.16)" stroke-width=".6"/>

</svg>`;
}




/* ══════════════════════════════════════
   PROFILE VFX CANVAS (Music Reactive)
══════════════════════════════════════ */
function activateNowPlayingVfx() {
  const outer  = document.getElementById('pfpOuter');
  const phones = document.getElementById('pfpHeadphones');
  const canvas = document.getElementById('pfpVfx');
  if (!outer || !canvas || canvas._stopVfx) return;
  outer.classList.add('playing');
  phones?.classList.add('active');
  canvas.classList.add('active');

  const W = canvas.offsetWidth || 264, H = canvas.offsetHeight || 264;
  canvas.width = W; canvas.height = H;
  const cx = W / 2, cy = H / 2;
  const ctx = canvas.getContext('2d');
  const getColors = () => ELEMENT_THEMES[currentElement].particleColors;
  const getGlyphs = () => ELEMENT_THEMES[currentElement].particles;
  const particles = [], orbs = [], rings = [];
  let lastBeat = 0, beatPhase = 0, frame = 0, animId;

  class P {
    constructor(burst) {
      const a = Math.random() * Math.PI * 2, spd = burst ? 2.2 + Math.random() * 3 : 0.4 + Math.random() * 0.9;
      this.x  = cx + (Math.random() - 0.5) * 24; this.y = cy + (Math.random() - 0.5) * 24;
      this.vx = Math.cos(a) * spd; this.vy = Math.sin(a) * spd - (burst ? 0.8 : 0.15);
      this.life = this.maxLife = burst ? 1.0 + Math.random() * 0.4 : 0.6 + Math.random() * 0.6;
      this.size = burst ? 10 + Math.random() * 9 : 6 + Math.random() * 6;
      const gl = getGlyphs(), co = getColors();
      this.glyph = gl[Math.floor(Math.random() * gl.length)];
      this.color = co[Math.floor(Math.random() * co.length)];
      this.rot = Math.random() * Math.PI * 2; this.rotV = (Math.random() - 0.5) * 0.14;
      this.isGlyph = Math.random() > 0.35;
    }
    step() { this.x += this.vx; this.y += this.vy; this.vy += 0.022; this.vx *= 0.985; this.rot += this.rotV; this.life -= 0.016; }
    draw() {
      const a = Math.max(0, this.life / this.maxLife);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(this.x, this.y); ctx.rotate(this.rot);
      if (this.isGlyph) {
        ctx.font = `${this.size}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.glyph, 0, 0);
      } else {
        const g = ctx.createRadialGradient(0,0,0,0,0,this.size*0.7);
        g.addColorStop(0, this.color); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0,0,this.size*0.7,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }
  }

  class Orb {
    constructor() {
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 50;
      this.x = cx + Math.cos(a)*d; this.y = cy + Math.sin(a)*d;
      this.vx = (Math.random()-0.5)*0.4; this.vy = (Math.random()-0.5)*0.4;
      this.r = 3 + Math.random() * 5; this.life = 1; this.decay = 0.004 + Math.random() * 0.004;
      const co = getColors(); this.color = co[Math.floor(Math.random() * co.length)];
      this.phase = Math.random() * Math.PI * 2;
    }
    step() { this.x += this.vx + Math.sin(frame*0.03+this.phase)*0.3; this.y += this.vy + Math.cos(frame*0.02+this.phase)*0.3; this.life -= this.decay; }
    draw() {
      const a = Math.max(0, this.life) * 0.6; ctx.save(); ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*2.5);
      g.addColorStop(0,this.color); g.addColorStop(0.4,this.color); g.addColorStop(1,'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x,this.y,this.r*2.5,0,Math.PI*2); ctx.fill(); ctx.restore();
    }
  }

  function spawnAmbient() {
    if (particles.length < 32) particles.push(new P(false));
    if (orbs.length < 10)      orbs.push(new Orb());
  }
  function spawnBurst(strong) {
    const n = strong ? 14 : 7; for (let i = 0; i < n; i++) particles.push(new P(true));
    for (let i = 0; i < (strong ? 3 : 1); i++) orbs.push(new Orb());
  }

  let sigilA = 0;
  function drawSigil() {
    const r = 50, t = ELEMENT_THEMES[currentElement];
    ctx.save(); ctx.globalAlpha = 0.065; ctx.translate(cx,cy); ctx.rotate(sigilA);
    ctx.strokeStyle = t.headColors[0]; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = (Math.PI/3)*i; i===0 ? ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r); }
    ctx.closePath(); ctx.stroke(); ctx.restore();
    sigilA += 0.003;
  }

  function beatCheck(ts) {
    const bpm = 118 + Math.sin(ts*0.00008)*10, interval = (60/bpm)*1000;
    if (ts - lastBeat > interval) {
      lastBeat = ts; beatPhase++;
      const strong = beatPhase % 4 === 0;
      spawnBurst(strong);
      rings.push({ ts, strong });
    }
  }

  function drawRings(ts) {
    const c1 = ELEMENT_THEMES[currentElement].headColors[0];
    const hexRgb = h => `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
    for (let i = rings.length-1; i >= 0; i--) {
      const age = ts - rings[i].ts, dur = rings[i].strong ? 900 : 650;
      if (age > dur) { rings.splice(i,1); continue; }
      const p = age/dur, ease = 1 - Math.pow(1-p, 3);
      const rad = 56 + ease * (rings[i].strong ? 46 : 30), alpha = (1-p) * (rings[i].strong ? 0.7 : 0.45);
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2);
      ctx.strokeStyle = `rgba(${hexRgb(c1)},${alpha})`; ctx.lineWidth = rings[i].strong ? 2.5 : 1.5; ctx.stroke(); ctx.restore();
    }
  }

  function loop(ts) {
    ctx.clearRect(0,0,W,H);
    drawSigil(); beatCheck(ts); drawRings(ts);
    for (let i=orbs.length-1;i>=0;i--) { orbs[i].step(); orbs[i].draw(); if(orbs[i].life<=0) orbs.splice(i,1); }
    if (frame%3===0) spawnAmbient();
    for (let i=particles.length-1;i>=0;i--) { particles[i].step(); particles[i].draw(); if(particles[i].life<=0) particles.splice(i,1); }
    frame++; animId = requestAnimationFrame(loop);
  }
  animId = requestAnimationFrame(loop);

  canvas._stopVfx = () => {
    cancelAnimationFrame(animId); ctx.clearRect(0,0,W,H);
    canvas._stopVfx = null; canvas.classList.remove('active');
    phones?.classList.remove('active'); outer.classList.remove('playing');
  };
}

/* ══════════════════════════════════════
   HELPER
══════════════════════════════════════ */
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function set(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

/* ══════════════════════════════════════
   ENKA.NETWORK
══════════════════════════════════════ */
const ENKA_UID = '764275665';

function fetchEnka() {
  fetch(`/api/enka?uid=${ENKA_UID}`)
    .then(r => r.json())
    .then(d => handleEnkaData(d))
    .catch(() => setStaticEnka());
}

function setStaticEnka() {
  set('enka-ar','27'); set('enka-wl','2'); set('enka-region','EU');
  set('enka-main','Dendro Traveler'); set('enka-achieve','—');
  set('gc-ar','27'); set('sh-ar','AR 27'); set('sh-wl','WL 2'); set('sh-main','Dendro Main');
  applyElementTheme('dendro');
}

function handleEnkaData(data) {
  if (!data || data.detail || !data.playerInfo) { setStaticEnka(); return; }
  const info = data.playerInfo;

  set('enka-ar', info.level || '—');
  set('enka-wl', info.worldLevel ?? '—');
  set('enka-region', 'EU');
  set('enka-achieve', info.finishAchievementNum || '—');
  set('gc-ar', info.level || '—');
  set('sh-ar', `AR ${info.level || '—'}`);
  set('sh-wl', `WL ${info.worldLevel ?? '—'}`);

  const chars = data.avatarInfoList || [];
  if (!chars.length) { applyElementTheme('dendro'); return; }

  const first   = chars[0];
  const id      = first.avatarId;
  const name    = CHAR_NAME_BY_ID[id] || 'Traveler';
  const element = (id === 10000007 || id === 10000005)
    ? ({504:'anemo',704:'electro',604:'geo',1404:'dendro',8:'anemo'}[first.skillDepotId] || 'dendro')
    : (CHAR_ELEM_BY_ID[id] || 'dendro');

  const level = first.propMap?.['4001']?.val ? `Lv. ${first.propMap['4001'].val}` : '';
  const const_ = `C${(first.talentIdList || []).length}`;
  const iconName = CHAR_ICON_BY_ID[id];
  const iconUrl  = iconName ? `https://enka.network/ui/UI_AvatarIcon_${iconName}.png` : null;

  set('enka-main', name);
  set('sh-main', `${ELEMENT_THEMES[element]?.name || 'Dendro'} Main`);

  // Character card
  const card  = document.getElementById('enkaCharacterCard');
  const port  = document.getElementById('eccPortrait');
  const nEl   = document.getElementById('eccName');
  const lvEl  = document.getElementById('eccLevel');
  const cnEl  = document.getElementById('eccConst');
  if (card) {
    card.classList.add('active');
    if (port)  { port.src = iconUrl || ''; port.alt = name; port.onerror = () => port.style.display='none'; }
    if (nEl)   nEl.textContent  = name;
    if (lvEl)  lvEl.textContent = level;
    if (cnEl)  cnEl.textContent = const_;
  }

  applyElementTheme(element);
}

/* ══════════════════════════════════════
   LAST.FM
══════════════════════════════════════ */
const LASTFM_KEY  = 'd57c2c17b6a652c82b47410600dc0b61';
const LASTFM_USER = 'FoxStorm1';
let _lfmPrevKey = null, _lfmScript = null;

window.lastfmCallback = function(data) {
  const tracks = data.recenttracks?.track;
  const track  = Array.isArray(tracks) ? tracks[0] : tracks;
  const isPlaying = track?.['@attr']?.nowplaying === 'true';

  if (!isPlaying) {
    updateSidebarNP(false);
    const w = document.getElementById('lastfmWidget');
    if (w) w.innerHTML = `<div class="lfm-idle">◆ &nbsp; Not listening right now &nbsp; ◆</div>`;
    _lfmPrevKey = null;
    document.getElementById('pfpVfx')?._stopVfx?.();
    return;
  }

  const title  = track.name || 'Unknown Track';
  const artist = track.artist?.['#text'] || 'Unknown Artist';
  const album  = track.album?.['#text'] || '';
  const artUrl = track.image?.find(i => i.size === 'large')?.['#text'] || '';
  const key    = `${title}::${artist}`;

  updateSidebarNP(true, title, artist, artUrl);

  if (key !== _lfmPrevKey) {
    _lfmPrevKey = key;
    const w = document.getElementById('lastfmWidget');
    if (w) {
      w.innerHTML = `
        <div class="media-card">
          <div class="media-art">
            ${artUrl ? `<img src="${artUrl}" alt="${esc(title)}" onerror="this.parentElement.innerHTML='🎵'">` : '🎵'}
          </div>
          <div class="media-info">
            <div class="media-playing-row"><div class="media-dot"></div><span>Now Playing</span></div>
            <div class="media-title">${esc(title)}</div>
            <div class="media-sub">${esc(artist)}${album ? ' · ' + esc(album) : ''}</div>
            <a href="https://www.last.fm/user/${LASTFM_USER}" target="_blank" rel="noopener" class="media-link">Last.fm ↗</a>
          </div>
        </div>`;
    }
  }

  if (!document.getElementById('pfpVfx')?._stopVfx) activateNowPlayingVfx();
};

function updateSidebarNP(playing, title, artist, artUrl) {
  const strip = document.getElementById('sidebarNowPlaying');
  if (!strip) return;
  if (!playing) { strip.classList.remove('active'); return; }
  strip.classList.add('active');
  const snpTitle  = document.getElementById('snpTitle');
  const snpArtist = document.getElementById('snpArtist');
  const snpArt    = document.getElementById('snpArt');
  if (snpTitle)  snpTitle.textContent  = title;
  if (snpArtist) snpArtist.textContent = artist;
  if (snpArt) {
    snpArt.innerHTML = artUrl
      ? `<img src="${artUrl}" alt="" onerror="this.parentElement.innerHTML='🎵'">`
      : '🎵';
  }
}

function pollLastFm() {
  if (_lfmScript) { _lfmScript.remove(); _lfmScript = null; }
  const s = document.createElement('script');
  s.src = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks`
        + `&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`
        + `&callback=lastfmCallback`;
  s.onerror = () => console.warn('[Last.fm] JSONP failed');
  document.head.appendChild(s);
  _lfmScript = s;
}

/* ══════════════════════════════════════
   LANYARD
══════════════════════════════════════ */
(function initLanyard() {
  const DISCORD_ID = '789872551731527690';
  const widget = document.getElementById('lanyardWidget');
  if (!widget) return;

  let elapsedInt = null, currentGame = null;

  const STEAM_MAP = {
    '252950':'252950', // Rocket League
    '356876057940836353':'570',   // Dota2
    '365269832713969664':'730',   // CS2
    '438522866070716416':'1172470', // Apex
    '401875653219958785':'271590',  // GTA V
    '385880084663230464':'105600',  // Terraria
    '356876974230470659':'440',   // TF2
    '357244967025238018':'252950',  // Rocket League
    '367827983903490050':'1091500', // Cyberpunk
    '444490355991396363':'413150',  // Stardew
    '359502208508739584':'374320',  // DS3
    '378968978029936640':'1245620', // Elden Ring
    '503250966491480065':'526870',  // Satisfactory
  };

  const NAME_STEAM = {
    'rocket league':'252950','dota 2':'570','counter-strike 2':'730','apex legends':'1172470',
    'grand theft auto v':'271590','terraria':'105600','stardew valley':'413150',
    'elden ring':'1245620','dark souls iii':'374320','cyberpunk 2077':'1091500',
    'satisfactory':'526870','valheim':'892970',
  };

  function elapsed(ts) {
    if (!ts) return '';
    const s = Math.floor((Date.now()-ts)/1000), h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sc=s%60;
    return h>0 ? `${h}h ${m}m elapsed` : m>0 ? `${m}m ${sc}s elapsed` : `${sc}s elapsed`;
  }

  function imgUrl(appId, key) {
    if (!key) return null;
    if (key.startsWith('mp:external/')) return `https://media.discordapp.net/external/${key.replace('mp:external/','')}`;
    if (key.startsWith('http')) return key;
    if (appId) return `https://cdn.discordapp.com/app-assets/${appId}/${key}.png`;
    return null;
  }

  function iconCandidates(game) {
    const appId = game.application_id, out = [];
    const li = imgUrl(appId, game.assets?.large_image);
    if (li) out.push(li);
    const sid = STEAM_MAP[appId] || NAME_STEAM[game.name?.toLowerCase()];
    if (sid) {
      out.push(`https://cdn.cloudflare.steamstatic.com/steam/apps/${sid}/library_600x900.jpg`);
      out.push(`https://cdn.cloudflare.steamstatic.com/steam/apps/${sid}/header.jpg`);
    }
    if (appId) out.push(`https://cdn.discordapp.com/app-icons/${appId}/icon.png`);
    return out;
  }

  function tryImgs(img, list, fallback) {
    let i = 0;
    function next() { if (i>=list.length) { if (img.parentElement) img.parentElement.innerHTML=fallback; return; } img.onerror=next; img.src=list[i++]; }
    next();
  }

  function render(data) {
    const pres = data?.data; if (!pres) return;
    const acts = pres.activities || [], status = pres.discord_status || 'offline';
    const game = acts.find(a => a.type === 0);
    const labels = {online:'Online · Teyvat',idle:'Away',dnd:'Do Not Disturb',offline:'Offline'};

    if (!game) {
      widget.innerHTML = `
        <div class="lany-status-row">
          <span class="lanyard-status-dot ${status}"></span>
          <span class="lanyard-status-label">${labels[status]||'Offline'}</span>
        </div>
        <div class="lanyard-idle-msg">Not playing anything right now 🌿</div>`;
      clearInterval(elapsedInt); currentGame = null; return;
    }

    const ts   = game.timestamps?.start;
    const cands = iconCandidates(game);
    const siUrl = (game.assets?.large_image && game.assets?.small_image)
      ? imgUrl(game.application_id, game.assets.small_image) : null;

    if (currentGame !== game.name) {
      currentGame = game.name;
      widget.innerHTML = `
        <div class="lanyard-card">
          <div class="lanyard-icon" id="lanyIconWrap">
            <img id="lanyIconImg" alt="${esc(game.name)}">
            ${siUrl ? `<div class="lanyard-small-icon"><img src="${siUrl}" alt=""></div>` : ''}
          </div>
          <div class="lanyard-info">
            <div class="lanyard-playing-label"><div class="lanyard-playing-dot"></div>Now Playing</div>
            <div class="lanyard-game-name">${esc(game.name)}</div>
            ${game.details ? `<div class="lanyard-game-detail">${esc(game.details)}</div>` : ''}
            ${game.state   ? `<div class="lanyard-game-state">${esc(game.state)}</div>` : ''}
            ${ts ? `<div class="lanyard-elapsed" id="lanyElapsed">⏱ ${elapsed(ts)}</div>` : ''}
          </div>
        </div>`;
      const img = document.getElementById('lanyIconImg');
      if (img) tryImgs(img, cands, '🎮');
    }

    clearInterval(elapsedInt);
    if (ts) elapsedInt = setInterval(() => {
      const el = document.getElementById('lanyElapsed');
      if (el) el.textContent = `⏱ ${elapsed(ts)}`;
    }, 1000);
  }

  function poll() {
    fetch(`/api/lanyard?id=${DISCORD_ID}`)
      .then(r => r.json())
      .then(d => render(d))
      .catch(() => { widget.innerHTML = `<div class="lany-status-row" style="padding:16px"><span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--t2);">Presence unavailable</span></div>`; });
  }

  poll(); setInterval(poll, 15000);
})();

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
(function init() {
  // Build headphones immediately
  buildHeadphonesSVG();

  // Restore cached element
  try {
    const saved = sessionStorage.getItem('aw_elem');
    if (saved && ELEMENT_THEMES[saved]) applyElementTheme(saved);
    else respawnParticles();
  } catch(e) { respawnParticles(); }

  // Fetch live data
  fetchEnka();
  setInterval(fetchEnka, 300000);
  pollLastFm();
  setInterval(pollLastFm, 15000);
})();

/* ════════════════════════════════════════════════════════
   AARONWORLD — ETHEREAL LAYER v2 · Elegant Edition
   ════════════════════════════════════════════════════════ */

/* ─── Custom cursor ─── */
(function() {
  const dot  = Object.assign(document.createElement('div'), { id:'aw-cursor-dot'  });
  const ring = Object.assign(document.createElement('div'), { id:'aw-cursor-ring' });
  document.body.append(dot, ring);

  let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my, lastTrail=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    const now = Date.now();
    if (now - lastTrail > 42) { spawnTrail(mx, my); lastTrail = now; }
  });

  function spawnTrail(x, y) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    const sz = 3 + Math.random() * 4;
    t.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 560);
  }

  (function lerpRing() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(lerpRing);
  })();

  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

  const SEL = 'a,button,.anime-card,.info-card,.link-card,.nav-link';
  document.addEventListener('mouseover', e => { if (e.target.closest(SEL)) ring.classList.add('hovering'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(SEL)) ring.classList.remove('hovering'); });
})();

/* ─── Aurora Borealis ─── */
(function() {
  const cv = document.createElement('canvas');
  cv.id = 'auroraCanvas'; cv.setAttribute('aria-hidden','true');
  document.body.insertBefore(cv, document.body.firstChild);
  const ctx = cv.getContext('2d');
  let W, H, t = 0;

  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  resize(); addEventListener('resize', resize);

  const HUE_MAP = { dendro:128, pyro:18, hydro:200, cryo:192, electro:272, anemo:158, geo:46 };

  function getBaseHue() {
    return HUE_MAP[document.documentElement.getAttribute('data-element')] ?? 128;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.0045;
    const h0 = getBaseHue();

    // Three aurora curtains
    const bands = [
      { dh:0,  sy:.08, amp:.14, spd:.33, width:.28, alpha:.055 },
      { dh:18, sy:.14, amp:.11, spd:.51, width:.22, alpha:.045 },
      { dh:34, sy:.20, amp:.16, spd:.27, width:.20, alpha:.038 },
    ];

    bands.forEach(b => {
      const baseY = H * b.sy;
      const bandH = H * b.width;
      const steps = 90;

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const q = i / steps;
        const y = baseY
          + Math.sin(q * Math.PI * 2.8 + t * b.spd) * H * b.amp
          + Math.sin(q * Math.PI * 5.2 + t * b.spd * 1.6) * H * b.amp * .4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const x = (i / steps) * W;
        const q = i / steps;
        const y = baseY + bandH
          + Math.sin(q * Math.PI * 2.8 + t * b.spd + .4) * H * b.amp * .5;
        ctx.lineTo(x, y);
      }
      ctx.closePath();

      const g = ctx.createLinearGradient(0, baseY, 0, baseY + bandH);
      const pulse = b.alpha * (1 + Math.sin(t * .6) * .25);
      g.addColorStop(0,    `hsla(${h0+b.dh},75%,70%,0)`);
      g.addColorStop(0.3,  `hsla(${h0+b.dh},80%,68%,${pulse})`);
      g.addColorStop(0.55, `hsla(${h0+b.dh+12},78%,72%,${pulse*1.3})`);
      g.addColorStop(0.8,  `hsla(${h0+b.dh},75%,68%,${pulse*.7})`);
      g.addColorStop(1,    `hsla(${h0+b.dh},75%,70%,0)`);
      ctx.fillStyle = g; ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Constellation network ─── */
(function() {
  const cv = document.createElement('canvas');
  cv.id = 'constellCanvas'; cv.setAttribute('aria-hidden','true');
  document.body.insertBefore(cv, document.body.firstChild);
  const ctx = cv.getContext('2d');
  let W, H, nodes = [], t = 0;

  const resize = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    nodes = Array.from({ length: Math.min(50, Math.floor(W*H/22000)) }, () => ({
      x: Math.random()*W, y: Math.random()*H*.7,
      vx:(Math.random()-.5)*.1, vy:(Math.random()-.5)*.05,
      r:.7+Math.random()*1.2, a:.2+Math.random()*.5,
      phase: Math.random()*Math.PI*2
    }));
  };
  resize(); addEventListener('resize', resize);

  const RGB_MAP = {
    dendro:'168,204,40', pyro:'255,107,32', hydro:'40,180,232',
    cryo:'144,216,240', electro:'192,96,255', anemo:'64,216,160', geo:'232,192,32'
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.007;
    const el = document.documentElement.getAttribute('data-element') || 'dendro';
    const rgb = RGB_MAP[el] || RGB_MAP.dendro;

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H*.7; if (n.y > H*.7) n.y = 0;
    });

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${rgb},${(1-d/150)*.12})`;
          ctx.lineWidth = .4; ctx.stroke();
        }
      }
    }
    // Dots
    nodes.forEach(n => {
      const a = n.a * (.5 + .5*Math.sin(t*1.4 + n.phase));
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${rgb},${a})`; ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Holographic overlay injection ─── */
(function() {
  function inject() {
    document.querySelectorAll('.anime-card:not([data-holo])').forEach(c => {
      c.setAttribute('data-holo','1');
      const h = document.createElement('div');
      h.className = 'ac-holo'; c.appendChild(h);
    });
  }
  inject();
  new MutationObserver(inject).observe(document.body, { childList:true, subtree:true });
})();

/* ─── 3D card tilt ─── */
(function() {
  const TILT = 9;

  function bindTilt(sel, mag) {
    document.addEventListener('mousemove', e => {
      document.querySelectorAll(sel).forEach(card => {
        const r = card.getBoundingClientRect();
        if (e.clientX < r.left-80 || e.clientX > r.right+80 ||
            e.clientY < r.top -80 || e.clientY > r.bottom+80) return;
        const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
        const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
        card.style.transform = `perspective(700px) rotateX(${-dy*mag}deg) rotateY(${dx*mag}deg) translateZ(8px) translateY(-5px)`;

        // holo position
        const holo = card.querySelector('.ac-holo');
        if (holo) {
          const mx = ((e.clientX-r.left)/r.width*100).toFixed(1)+'%';
          const my = ((e.clientY-r.top)/r.height*100).toFixed(1)+'%';
          holo.style.backgroundPosition = `${mx} ${my}`;
        }
      });
    });
  }

  bindTilt('.anime-card', TILT);

  // Reset on mouse-leave
  document.addEventListener('mouseover', () => {});
  new MutationObserver(() => {
    document.querySelectorAll('.anime-card, .info-card').forEach(c => {
      if (!c._resetBound) {
        c._resetBound = true;
        c.addEventListener('mouseleave', () => { c.style.transform = ''; });
      }
    });
  }).observe(document.body, { childList:true, subtree:true });
  document.querySelectorAll('.anime-card, .info-card').forEach(c => {
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
})();

/* ─── Link-card spotlight ─── */
(function() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.link-card').forEach(c => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
      c.style.setProperty('--my', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    });
  });
})();


/* ─── Canvas Favicon Generator ─── */
(function() {
  const SIZE = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = SIZE;
  const ctx = cv.getContext('2d');

  function drawFavicon(accentHex) {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Parse hex → rgb
    const hex2rgb = h => {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        h.replace(/^#([a-f\d])([a-f\d])([a-f\d])$/i,'#$1$1$2$2$3$3')
      );
      return r ? [parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)] : [160,120,240];
    };
    const [R,G,B] = hex2rgb(accentHex);

    // Deep space background
    const bg = ctx.createRadialGradient(SIZE/2,SIZE/2,0,SIZE/2,SIZE/2,SIZE/2);
    bg.addColorStop(0, `rgba(${Math.round(R*0.12)},${Math.round(G*0.08)},${Math.round(B*0.16)},1)`);
    bg.addColorStop(1, 'rgba(4,3,10,1)');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(SIZE/2,SIZE/2,SIZE/2,0,Math.PI*2);
    ctx.fill();

    // Outer rim — element colour
    ctx.strokeStyle = `rgba(${R},${G},${B},0.55)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(SIZE/2,SIZE/2,SIZE/2-1.5,0,Math.PI*2);
    ctx.stroke();

    // Star field (deterministic)
    for (let i = 0; i < 22; i++) {
      const sx = ((i*2654435761)>>>0) % SIZE;
      const sy = ((i*1013904223)>>>0) % SIZE;
      const sr = 0.4 + (i % 3) * 0.45;
      const sa = 0.25 + (i % 4) * 0.18;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI*2);
      ctx.fillStyle = i % 5 === 0
        ? `rgba(${R},${G},${B},${sa})`
        : `rgba(210,220,255,${sa * 0.7})`;
      ctx.fill();
    }

    // Central diamond gem — the "A" monogram stand-in
    const cx = SIZE/2, cy = SIZE/2;
    const s  = 11; // half-size
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI/4);

    // Outer gem glow
    const glow = ctx.createRadialGradient(0,0,0,0,0,s*2.2);
    glow.addColorStop(0, `rgba(${R},${G},${B},0.45)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(-s*2.2,-s*2.2,s*4.4,s*4.4);

    // Gem facets
    // Bottom fill (shadow)
    ctx.fillStyle = `rgb(${Math.round(R*0.35)},${Math.round(G*0.35)},${Math.round(B*0.35)})`;
    ctx.fillRect(-s,-s,s*2,s*2);

    // Left facet
    ctx.beginPath();
    ctx.moveTo(-s,-s); ctx.lineTo(0,0); ctx.lineTo(-s,s); ctx.closePath();
    ctx.fillStyle = `rgba(${Math.round(R*0.6)},${Math.round(G*0.6)},${Math.round(B*0.6)},1)`;
    ctx.fill();

    // Right facet
    ctx.beginPath();
    ctx.moveTo(s,-s); ctx.lineTo(0,0); ctx.lineTo(s,s); ctx.closePath();
    ctx.fillStyle = `rgba(${R},${G},${B},0.9)`;
    ctx.fill();

    // Top facet (brightest — specular)
    ctx.beginPath();
    ctx.moveTo(-s,-s); ctx.lineTo(0,-s*0.35); ctx.lineTo(s,-s); ctx.lineTo(0,0); ctx.closePath();
    const specGrad = ctx.createLinearGradient(-s,-s,s,-s);
    specGrad.addColorStop(0, `rgba(255,255,255,0.55)`);
    specGrad.addColorStop(0.5, `rgba(${R+80>255?255:R+80},${G+80>255?255:G+80},${B+80>255?255:B+80},0.9)`);
    specGrad.addColorStop(1, `rgba(255,255,255,0.55)`);
    ctx.fillStyle = specGrad;
    ctx.fill();

    // Gem border
    ctx.strokeStyle = `rgba(${R},${G},${B},0.75)`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-s,-s,s*2,s*2);

    ctx.restore();

    // Update the <link> favicon
    const link = document.getElementById('faviconLink');
    if (link) link.href = cv.toDataURL('image/png');
  }

  // Called on element change
  window._setFaviconToElement = function(iconUrl) {
    const t = ELEMENT_THEMES[currentElement];
    if (t) drawFavicon(t.color);
  };

  // Initial draw with current theme
  const initTheme = ELEMENT_THEMES[document.documentElement.getAttribute('data-element')] || ELEMENT_THEMES.dendro;
  drawFavicon(initTheme.color);
})();
