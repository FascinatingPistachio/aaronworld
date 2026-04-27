/* ═══════════════════════════════════════════════════════════
   AARONWORLD — script.js  (Fontaine Edition)
   • Animated deep-sea canvas (bubbles · hydro orbs · ripples)
   • Hydro particle system
   • Profile VFX canvas (hydro rings + particles)
   • Enka.Network integration (Genshin stats)
   • Last.fm JSONP now-playing
   • Lanyard Discord rich presence
   • Nav section switching
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   DEEP SEA CANVAS (background)
══════════════════════════════════════ */
(function initSeaCanvas() {
  const canvas = document.getElementById('skyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let bubbles   = [];
  let orbs      = [];
  let ripples   = [];
  let particles = [];
  let frame     = 0;

  /* ── Size ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildBubbles();
    buildOrbs();
    buildParticles();
  }
  window.addEventListener('resize', resize);

  /* ── Bubbles ── */
  function buildBubbles() {
    bubbles = [];
    const n = Math.min(80, Math.floor(W * H / 14000));
    for (let i = 0; i < n; i++) {
      spawnBubble(true);
    }
  }
  function spawnBubble(randomY) {
    const r = 1 + Math.random() * 5;
    bubbles.push({
      x: Math.random() * W,
      y: randomY ? Math.random() * H : H + r * 2,
      r: r,
      speed: 0.3 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.3,
      a: 0.1 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.03,
    });
  }

  /* ── Hydro orbs (larger, glow) ── */
  function buildOrbs() {
    orbs = [];
    const n = 5 + Math.floor(W / 400);
    for (let i = 0; i < n; i++) {
      orbs.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 30 + Math.random() * 70,
        a: 0.015 + Math.random() * 0.035,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.05 + Math.random() * 0.12),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        hue: 190 + Math.random() * 30,
      });
    }
  }

  /* ── Floating particles ── */
  function buildParticles() {
    particles = [];
    const n = Math.min(120, Math.floor(W * H / 8000));
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.5 + Math.random() * 1.5,
        a: 0.1 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.03 + Math.random() * 0.12),
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.005 + Math.random() * 0.015,
      });
    }
  }

  /* ── Ripples (spawned occasionally) ── */
  function spawnRipple() {
    if (Math.random() < 0.008 && ripples.length < 6) {
      ripples.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0,
        maxR: 60 + Math.random() * 80,
        life: 1,
        speed: 0.4 + Math.random() * 0.4,
      });
    }
  }

  /* ── Draw ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Deep gradient background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#020610');
    bg.addColorStop(0.3, '#040d22');
    bg.addColorStop(0.7, '#060f28');
    bg.addColorStop(1,   '#08142e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Caustic light patches
    const t = frame * 0.003;
    for (let i = 0; i < 3; i++) {
      const cx = W * (0.2 + i * 0.3 + Math.sin(t + i * 1.2) * 0.08);
      const cy = H * (0.3 + Math.cos(t * 0.7 + i) * 0.15);
      const rr = 150 + Math.sin(t + i) * 50;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
      g.addColorStop(0, `rgba(20,80,140,${0.06 + Math.sin(t + i) * 0.02})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Hydro orbs
    orbs.forEach(o => {
      const pulse = 0.8 + 0.2 * Math.sin(o.pulse);
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * pulse);
      g.addColorStop(0, `hsla(${o.hue},80%,70%,${o.a * 2})`);
      g.addColorStop(0.5, `hsla(${o.hue},70%,50%,${o.a})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * pulse, 0, Math.PI * 2);
      ctx.fill();

      o.x += o.vx; o.y += o.vy;
      o.pulse += o.pulseSpeed;
      if (o.y + o.r < 0) {
        o.y = H + o.r;
        o.x = Math.random() * W;
      }
    });

    // Floating particles
    particles.forEach(p => {
      const tw = 0.5 + 0.5 * Math.sin(frame * p.phaseSpeed + p.phase);
      ctx.save();
      ctx.globalAlpha = p.a * tw;
      ctx.fillStyle = `hsl(200, 80%, 70%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
    });

    // Bubbles
    bubbles.forEach((b, i) => {
      b.wobble += b.wobbleSpeed;
      const wx = Math.sin(b.wobble) * 1.5;
      ctx.save();
      ctx.globalAlpha = b.a;
      ctx.strokeStyle = `rgba(61, 216, 240, 0.7)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(b.x + wx, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
      // Inner highlight
      ctx.globalAlpha = b.a * 0.4;
      ctx.fillStyle = `rgba(180, 240, 255, 0.5)`;
      ctx.beginPath();
      ctx.arc(b.x + wx - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      b.x += wx * 0.1 + b.drift;
      b.y -= b.speed;
      if (b.y + b.r < 0) {
        bubbles[i] = null;
      }
    });
    bubbles = bubbles.filter(Boolean);
    while (bubbles.length < Math.min(80, Math.floor(W * H / 14000))) {
      spawnBubble(false);
    }

    // Ripples
    spawnRipple();
    ripples.forEach(r => {
      ctx.save();
      ctx.globalAlpha = r.life * 0.25;
      ctx.strokeStyle = `rgba(61, 216, 240, 0.6)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      r.r += r.speed;
      r.life = 1 - r.r / r.maxR;
    });
    ripples = ripples.filter(r => r.life > 0);

    // Subtle horizontal light bands (underwater refraction)
    for (let i = 0; i < 4; i++) {
      const y = H * (0.1 + i * 0.25) + Math.sin(frame * 0.004 + i * 1.5) * 20;
      const g2 = ctx.createLinearGradient(0, y - 2, 0, y + 2);
      g2.addColorStop(0, 'transparent');
      g2.addColorStop(0.5, `rgba(61, 216, 240, 0.025)`);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, y - 2, W, 4);
    }

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();


/* ══════════════════════════════════════
   PROFILE VFX CANVAS
══════════════════════════════════════ */
(function initProfileVfx() {
  const cv = document.getElementById('pfpVfx');
  if (!cv) return;
  const cx = cv.getContext('2d');
  cv.width = 100; cv.height = 100;
  const CX = 50, CY = 50;
  let t = 0;

  // Tiny hydro particles orbiting
  const pts = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * Math.PI * 2,
    speed: 0.006 + Math.random() * 0.006,
    r:     38 + (Math.random() - 0.5) * 6,
    size:  1 + Math.random() * 1.5,
    a:     0.4 + Math.random() * 0.6,
  }));

  function drawVfx() {
    cx.clearRect(0, 0, 100, 100);

    // Animated glow ring
    const g = cx.createRadialGradient(CX, CY, 34, CX, CY, 50);
    const pulse = 0.04 + 0.02 * Math.sin(t * 0.05);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.7, `rgba(61,216,240,${pulse})`);
    g.addColorStop(1, 'transparent');
    cx.fillStyle = g;
    cx.beginPath();
    cx.arc(CX, CY, 50, 0, Math.PI * 2);
    cx.fill();

    // Orbiting particles
    pts.forEach(p => {
      p.angle += p.speed;
      const x = CX + Math.cos(p.angle) * p.r;
      const y = CY + Math.sin(p.angle) * p.r;
      cx.save();
      cx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.angle * 3));
      cx.fillStyle = '#3dd8f0';
      cx.shadowColor = '#3dd8f0';
      cx.shadowBlur  = 4;
      cx.beginPath();
      cx.arc(x, y, p.size, 0, Math.PI * 2);
      cx.fill();
      cx.restore();
    });

    t++;
    requestAnimationFrame(drawVfx);
  }
  drawVfx();
})();


/* ══════════════════════════════════════
   SECTION NAV
══════════════════════════════════════ */
function showSec(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) {
    sec.classList.add('active');
    // Re-trigger reveal animations
    sec.querySelectorAll('.reveal').forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ══════════════════════════════════════
   ENKA.NETWORK — Genshin Stats
══════════════════════════════════════ */
(async function fetchEnka() {
  const UID = '764275665';
  try {
    const resp = await fetch(`https://enka.network/api/uid/${UID}`, {
      headers: { 'User-Agent': 'aaronworld-site/2.0' }
    });
    if (!resp.ok) throw new Error('enka ' + resp.status);
    const data = await resp.json();
    const pi = data.playerInfo;
    if (!pi) return;

    const ar = pi.level      ?? '—';
    const wl = pi.worldLevel ?? '—';

    // AR / WL
    document.querySelectorAll('#enka-ar').forEach(el => el.textContent = ar);
    document.querySelectorAll('#enka-wl').forEach(el => el.textContent = wl);
    document.getElementById('sh-ar')?.textContent != null && (document.getElementById('sh-ar').textContent = `AR ${ar}`);
    document.getElementById('sh-wl')?.textContent != null && (document.getElementById('sh-wl').textContent = `WL ${wl}`);
    document.getElementById('gc-ar')?.textContent != null && (document.getElementById('gc-ar').textContent = ar);

    // Achievements
    const ach = pi.finishAchievementNum;
    if (ach !== undefined) document.getElementById('enka-achieve').textContent = ach;

    // Active character (first showcase slot)
    const chars = data.avatarInfoList;
    if (chars && chars.length > 0) {
      const ch = chars[0];
      const charData = data.avatarInfoList[0];
      const nameCard = pi.showAvatarInfoList?.[0];

      // Try to get name from avatarId
      const avatarId = ch.avatarId;
      const levelInfo = ch.propMap;
      const level     = levelInfo?.['4001']?.val ?? '?';
      const constellation = ch.talentIdList?.length ?? 0;

      // Character name map (common ones)
      const nameMap = {
        10000016: 'Diluc',     10000020: 'Razor',      10000022: 'Venti',
        10000023: 'Xiangling', 10000024: 'Beidou',     10000025: 'Xingqiu',
        10000026: 'Xiao',      10000027: 'Ningguang',  10000029: 'Klee',
        10000030: 'Zhongli',   10000031: 'Fischl',     10000032: 'Bennett',
        10000033: 'Tartaglia', 10000034: 'Noelle',     10000035: 'Qiqi',
        10000036: 'Chongyun',  10000037: 'Ganyu',      10000038: 'Albedo',
        10000039: 'Diona',     10000041: 'Mona',       10000042: 'Keqing',
        10000043: 'Sucrose',   10000044: 'Xinyan',     10000045: 'Rosaria',
        10000046: 'Hu Tao',    10000047: 'Kazuha',     10000048: 'Yanfei',
        10000049: 'Yoimiya',   10000050: 'Thoma',      10000051: 'Eula',
        10000052: 'Raiden Shogun', 10000053: 'Sayu',   10000054: 'Kokomi',
        10000055: 'Gorou',     10000056: 'Sara',       10000060: 'Shenhe',
        10000061: 'Yunjin',    10000062: 'Arataki Itto', 10000063: 'Yae Miko',
        10000065: 'Yelan',     10000066: 'Ayato',      10000067: 'Aloy',
        10000069: 'Sayo',      10000070: 'Ayaka',      10000071: 'Yoimiya',
        10000073: 'Tighnari',  10000074: 'Collei',     10000075: 'Dori',
        10000076: 'Candace',   10000077: 'Nilou',      10000078: 'Nahida',
        10000079: 'Layla',     10000080: 'Wanderer',   10000081: 'Faruzan',
        10000082: 'Yaoyao',    10000083: 'Alhaitham',  10000084: 'Dehya',
        10000085: 'Mika',      10000086: 'Kaveh',      10000087: 'Baizhu',
        10000089: 'Lynette',   10000090: 'Lyney',      10000091: 'Freminet',
        10000092: 'Neuvillette', 10000093: 'Wriothesley',
        10000094: 'Charlotte', 10000095: 'Furina',     10000096: 'Navia',
        10000097: 'Chevreuse', 10000098: 'Xianyun',    10000099: 'Gaming',
        10000100: 'Chiori',    10000101: 'Sigewinne',  10000102: 'Arlecchino',
        10000103: 'Sethos',    10000104: 'Clorinde',   10000105: 'Emilie',
        10000106: 'Kachina',   10000107: 'Kinich',     10000108: 'Mualani',
        10000109: 'Xilonen',   10000110: 'Chasca',     10000111: 'Ororon',
        10000112: 'Citlali',   10000113: 'Mavuika',    10000114: 'Lan Yan',
      };
      const charName = nameMap[avatarId] ?? `Character #${avatarId}`;

      // Update main display
      document.getElementById('enka-main').textContent  = charName;
      document.getElementById('sh-main').textContent    = charName;
      document.getElementById('eccName').textContent    = charName;
      document.getElementById('eccLevel').textContent   = `Lv. ${level}`;
      document.getElementById('eccConst').textContent   = `C${constellation}`;

      // Portrait (Enka CDN)
      const iconMap = {
        10000092: 'UI_AvatarIcon_Neuvillette',
        10000095: 'UI_AvatarIcon_Furina',
        10000093: 'UI_AvatarIcon_Wriothesley',
      };
      const iconName = iconMap[avatarId] ?? `UI_AvatarIcon_${charName.replace(/\s/g,'')}`;
      const portrait = document.getElementById('eccPortrait');
      if (portrait) {
        portrait.src = `https://enka.network/ui/${iconName}.png`;
        portrait.onerror = function() { this.style.display = 'none'; };
      }
    }

  } catch (e) {
    console.warn('[Enka] fetch failed:', e.message);
  }
})();


/* ══════════════════════════════════════
   LAST.FM — Now Playing / Recent
══════════════════════════════════════ */
(function initLastFm() {
  const USER   = 'FoxStorm1';
  const API    = 'http://ws.audioscrobbler.com/2.0/';
  const KEY    = ''; // public JSONP — no key needed for limited calls

  function setNowPlaying(track) {
    const title  = track.name;
    const artist = track.artist['#text'];
    const art    = track.image?.[2]?.['#text'] || '';
    const np     = track['@attr']?.nowplaying === 'true';

    // Sidebar strip
    const snpTitle  = document.getElementById('snpTitle');
    const snpArtist = document.getElementById('snpArtist');
    const snpArt    = document.getElementById('snpArt');
    const snpStrip  = document.getElementById('sidebarNowPlaying');

    if (snpTitle)  snpTitle.textContent  = title;
    if (snpArtist) snpArtist.textContent = artist;
    if (snpArt && art) {
      const img = document.createElement('img');
      img.src = art; img.alt = title;
      img.onerror = () => snpArt.textContent = '🎵';
      snpArt.textContent = '';
      snpArt.appendChild(img);
    }
    if (snpStrip) snpStrip.style.display = '';
  }

  function buildLastFmWidget(tracks) {
    const el = document.getElementById('lastfmWidget');
    if (!el) return;
    el.innerHTML = '';
    tracks.slice(0, 6).forEach((track, i) => {
      const np    = track['@attr']?.nowplaying === 'true';
      const title  = track.name;
      const artist = track.artist['#text'];
      const art    = track.image?.[1]?.['#text'] || '';
      const row    = document.createElement('div');
      row.className = 'track-row';
      row.innerHTML = `
        <img class="track-art" src="${art}" alt="${title}" onerror="this.style.background='var(--bg-3)'">
        <div class="track-info">
          <div class="track-title">${title}</div>
          <div class="track-artist">${artist}</div>
        </div>
        ${np ? '<div class="track-now">LIVE</div>' : ''}
      `;
      el.appendChild(row);
    });
  }

  async function fetchTracks() {
    try {
      // Using AllOrigins CORS proxy
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&api_key=3d39b89f8e2b2ea18bd8b9cf5f8df7e2&format=json&limit=6`;
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const resp  = await fetch(proxy);
      const raw   = await resp.json();
      const data  = JSON.parse(raw.contents);
      const tracks = data?.recenttracks?.track;
      if (!tracks || !tracks.length) return;
      const list = Array.isArray(tracks) ? tracks : [tracks];
      setNowPlaying(list[0]);
      buildLastFmWidget(list);
    } catch (e) {
      console.warn('[Last.fm]', e.message);
      // Fallback JSONP method
      fetchLastFmJsonp();
    }
  }

  function fetchLastFmJsonp() {
    const cb = 'lfm_cb_' + Date.now();
    const s  = document.createElement('script');
    s.src    = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&api_key=3d39b89f8e2b2ea18bd8b9cf5f8df7e2&format=json&limit=6&callback=${cb}`;
    window[cb] = function(data) {
      document.head.removeChild(s);
      delete window[cb];
      const tracks = data?.recenttracks?.track;
      if (!tracks) return;
      const list = Array.isArray(tracks) ? tracks : [tracks];
      setNowPlaying(list[0]);
      buildLastFmWidget(list);
    };
    document.head.appendChild(s);
  }

  fetchTracks();
  setInterval(fetchTracks, 60000);
})();


/* ══════════════════════════════════════
   LANYARD — Discord Rich Presence
══════════════════════════════════════ */
(function initLanyard() {
  const DISCORD_ID = '789872551731527690';
  const INTERVAL   = 15000;

  function statusColor(s) {
    return { online:'#3de877', idle:'#f0c040', dnd:'#f04060', offline:'#607080' }[s] || '#607080';
  }
  function statusLabel(s) {
    return { online:'Online', idle:'Idle', dnd:'Do Not Disturb', offline:'Offline' }[s] || 'Unknown';
  }

  function renderLanyard(data) {
    const el = document.getElementById('lanyardWidget');
    if (!el) return;

    if (!data || !data.success) {
      el.innerHTML = '<p class="body-text subtle">Unable to reach Lanyard API.</p>';
      return;
    }

    const d    = data.data;
    const user = d.discord_user;
    const status = d.discord_status;
    const acts = d.activities || [];
    const act  = acts.find(a => a.type === 0) || acts[0];

    let html = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span class="status-dot ${status}"></span>
        <span style="font-family:var(--font-head);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--silver-2)">${user.global_name || user.username}</span>
        <span style="font-family:var(--font-head);font-size:10px;color:var(--text-dim);letter-spacing:.1em">${statusLabel(status)}</span>
      </div>`;

    if (act) {
      const assets  = act.assets || {};
      const appId   = act.application_id;
      const imgBase = appId ? `https://cdn.discordapp.com/app-assets/${appId}` : null;

      const largeUrl  = (imgBase && assets.large_image && !assets.large_image.startsWith('mp:'))
        ? `${imgBase}/${assets.large_image}.png`
        : (assets.large_image?.startsWith('https') ? assets.large_image : null);
      const smallUrl  = (imgBase && assets.small_image && !assets.small_image.startsWith('mp:'))
        ? `${imgBase}/${assets.small_image}.png`
        : null;

      const largeImg  = largeUrl ? `<img class="ly-img" src="${largeUrl}" alt="${act.name}" onerror="this.style.display='none'">` : `<div class="ly-img" style="display:flex;align-items:center;justify-content:center;font-size:22px;background:var(--bg-3);border:1px solid var(--border)">🎮</div>`;
      const smallImg  = smallUrl ? `<img class="ly-small-img" src="${smallUrl}" alt="">` : '';

      const elapsed   = act.timestamps?.start
        ? formatElapsed(Date.now() - act.timestamps.start)
        : '';

      html += `
        <div class="lanyard-card">
          <div class="ly-img-wrap">
            ${largeImg}
            ${smallImg}
          </div>
          <div class="ly-info">
            <div class="ly-type">Playing</div>
            <div class="ly-name">${act.name}</div>
            ${act.details ? `<div class="ly-detail">${act.details}</div>` : ''}
            ${act.state   ? `<div class="ly-detail" style="color:var(--text-dim)">${act.state}</div>` : ''}
          </div>
          ${elapsed ? `<div class="ly-elapsed">${elapsed}</div>` : ''}
        </div>`;
    } else {
      html += '<p class="body-text subtle" style="margin:0">No active game detected.</p>';
    }

    el.innerHTML = html;
  }

  function formatElapsed(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return h > 0
      ? `${h}h ${m % 60}m`
      : `${m}m ${s % 60}s`;
  }

  async function poll() {
    try {
      const resp = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await resp.json();
      renderLanyard(data);
    } catch (e) {
      console.warn('[Lanyard]', e.message);
    }
  }

  poll();
  setInterval(poll, INTERVAL);
})();
