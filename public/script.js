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

/* ══════════════════════════════════════
   NAV — SECTION SWITCHING
══════════════════════════════════════ */
function showSec(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  // Scroll to top of main content on mobile
  if (window.innerWidth <= 800) window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Keyboard nav
document.addEventListener('keydown', e => {
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
  const c1 = t.headColors[0], c2 = t.headColors[1],
        c3 = t.headColors[2], gw = t.glow;
  el.innerHTML = `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;overflow:visible;filter:drop-shadow(0 0 10px ${c1}) drop-shadow(0 0 28px ${gw})">
    <path d="M 22 72 C 22 22 118 22 118 72" stroke="url(#bg)" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M 28 70 C 28 30 112 30 112 70" stroke="${c2}44" stroke-width="2" stroke-linecap="round" fill="none"/>
    <rect x="14" y="64" width="10" height="22" rx="3" fill="url(#yk)" stroke="${c3}" stroke-width="1"/>
    <rect x="116" y="64" width="10" height="22" rx="3" fill="url(#yk)" stroke="${c3}" stroke-width="1"/>
    <rect x="2" y="72" width="22" height="36" rx="8" fill="url(#cp)" stroke="${c1}" stroke-width="1.8"/>
    <rect x="6" y="77" width="14" height="26" rx="5" fill="url(#gr)" stroke="${c1}55" stroke-width="0.8"/>
    <circle cx="13" cy="90" r="3.5" fill="url(#sp)" stroke="${c1}" stroke-width="0.8"/><circle cx="13" cy="90" r="1.5" fill="${c2}"/>
    <rect x="116" y="72" width="22" height="36" rx="8" fill="url(#cp)" stroke="${c1}" stroke-width="1.8"/>
    <rect x="120" y="77" width="14" height="26" rx="5" fill="url(#gr)" stroke="${c1}55" stroke-width="0.8"/>
    <circle cx="127" cy="90" r="3.5" fill="url(#sp)" stroke="${c1}" stroke-width="0.8"/><circle cx="127" cy="90" r="1.5" fill="${c2}"/>
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="${c3}"/><stop offset="30%" stop-color="${c1}"/>
        <stop offset="50%"  stop-color="${c2}"/><stop offset="70%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
      <linearGradient id="yk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${c3}"/><stop offset="100%" stop-color="${c3}88"/>
      </linearGradient>
      <linearGradient id="cp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${c3}cc"/><stop offset="100%" stop-color="${c3}44"/>
      </linearGradient>
      <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#161616"/><stop offset="100%" stop-color="#080808"/>
      </linearGradient>
      <radialGradient id="sp" cx="40%" cy="35%">
        <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c3}"/>
      </radialGradient>
    </defs>
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
