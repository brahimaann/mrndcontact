// /public/ascii-globe/globe.js
// Spinning ASCII wireframe globe rendered into: <pre id="ascii-globe-bg"></pre>
(() => {
  const pre = document.getElementById("ascii-globe-bg");
  if (!pre) return;

  // Prevent double-mount if hot reload injects script multiple times
  if (pre.dataset.globeRunning === "1") return;
  pre.dataset.globeRunning = "1";

  // --- Config ---
  const FPS = 24;

  // "Terminal" resolution (characters). Higher = sharper, heavier CPU.
  const COLS = 120;
  const ROWS = 44;

  // Globe / camera
  const R = 1.0;      // unit sphere radius
  const FOV = 2.4;    // projection strength
  const CAM_Z = 3.2;  // camera distance

  // Wire grid density
  const LAT_LINES = 10;   // parallels count
  const LON_LINES = 18;   // meridians count
  const SEGMENTS = 120;   // points per line

  // Rim sampling (helps read as globe)
  const OUTLINE = 1400;

  // Shading characters (dark -> bright)
  const SHADES = " .:-=+*#%@";

  // --- Helpers ---
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function rotY(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
  }
  function rotX(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
  }
  function rotZ(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
  }

  function project(p) {
    const z = (CAM_Z - p.z);
    const inv = 1 / (z / FOV);
    const x2 = p.x * inv;
    const y2 = p.y * inv;

    const sx = Math.round((x2 * 0.5 + 0.5) * (COLS - 1));
    const sy = Math.round((-y2 * 0.5 + 0.5) * (ROWS - 1));
    return { sx, sy, z };
  }

  function idxShade(brightness01) {
    const t = clamp(brightness01, 0, 1);
    return SHADES[Math.round(t * (SHADES.length - 1))];
  }

  function makeBuffers() {
    const chars = new Array(ROWS);
    const depth = new Array(ROWS);
    for (let r = 0; r < ROWS; r++) {
      chars[r] = new Array(COLS).fill(" ");
      depth[r] = new Array(COLS).fill(Infinity);
    }
    return { chars, depth };
  }

  function putPixel(buf, x, y, z, ch) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
    if (z < buf.depth[y][x]) {
      buf.depth[y][x] = z;
      buf.chars[y][x] = ch;
    }
  }

  function drawPoint(buf, pWorld) {
    const n = pWorld; // unit normal
    const front = clamp((n.z + 1) * 0.5, 0, 1);
    const ch = idxShade(front * 0.9 + 0.1);

    const { sx, sy, z } = project(pWorld);
    putPixel(buf, sx, sy, z, ch);
  }

  function sampleMeridian(lon, t) {
    const lat = (t * Math.PI) - (Math.PI / 2);
    return {
      x: R * Math.cos(lat) * Math.cos(lon),
      y: R * Math.sin(lat),
      z: R * Math.cos(lat) * Math.sin(lon),
    };
  }

  function sampleParallel(lat, t) {
    const lon = t * Math.PI * 2;
    return {
      x: R * Math.cos(lat) * Math.cos(lon),
      y: R * Math.sin(lat),
      z: R * Math.cos(lat) * Math.sin(lon),
    };
  }

  // Fit font size to viewport without changing COLS/ROWS
  function fitFont() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768; // md breakpoint
    const pxW = Math.floor(w / COLS);
    const pxH = Math.floor(h / ROWS);
    // Smaller font size on mobile for better fit, larger on desktop
    if (isMobile) {
      const px = Math.max(8, Math.min(pxW, pxH, 12)); // Smaller range on mobile: 8-12px
      pre.style.fontSize = px + "px";
      pre.style.lineHeight = px + "px";
    } else {
      const px = Math.max(12, Math.min(pxW, pxH, 18)); // Desktop: 12-18px
      pre.style.fontSize = px + "px";
      pre.style.lineHeight = px + "px";
    }
    console.log(`[ASCII Globe] Font size set to ${pre.style.fontSize} (viewport: ${w}x${h}, mobile: ${isMobile})`);
  }
  window.addEventListener("resize", fitFont);
  fitFont();

  function render(timeMs) {
    const t = timeMs * 0.001;

    // Spin
    const aY = t * 0.8;
    const aX = Math.sin(t * 0.35) * 0.25;
    const aZ = 0.0;

    const buf = makeBuffers();

    // Rim / outline points (front-biased)
    for (let i = 0; i < OUTLINE; i++) {
      const u = i / (OUTLINE - 1);
      const v = (i * 0.61803398875) % 1; // golden ratio frac
      const lat = Math.asin(2 * u - 1);
      const lon = 2 * Math.PI * v;

      let p = {
        x: R * Math.cos(lat) * Math.cos(lon),
        y: R * Math.sin(lat),
        z: R * Math.cos(lat) * Math.sin(lon),
      };

      p = rotY(p, aY);
      p = rotX(p, aX);
      p = rotZ(p, aZ);

      if (p.z < 0.15) continue;

      const { sx, sy, z } = project(p);
      const rim = 1 - Math.abs(p.z / R);
      const ch = idxShade(clamp(rim * 1.2, 0, 1));
      putPixel(buf, sx, sy, z, ch);
    }

    // Meridians
    for (let m = 0; m < LON_LINES; m++) {
      const lon = (m / LON_LINES) * Math.PI * 2;
      for (let s = 0; s <= SEGMENTS; s++) {
        let p = sampleMeridian(lon, s / SEGMENTS);
        p = rotY(p, aY);
        p = rotX(p, aX);
        p = rotZ(p, aZ);
        if (p.z < 0) continue;
        drawPoint(buf, p);
      }
    }

    // Parallels
    for (let pidx = 1; pidx < LAT_LINES; pidx++) {
      const lat = (pidx / LAT_LINES) * Math.PI - (Math.PI / 2);
      if (Math.abs(lat) > (Math.PI / 2 - 0.22)) continue;

      for (let s = 0; s <= SEGMENTS; s++) {
        let p = sampleParallel(lat, s / SEGMENTS);
        p = rotY(p, aY);
        p = rotX(p, aX);
        p = rotZ(p, aZ);
        if (p.z < 0) continue;
        drawPoint(buf, p);
      }
    }

    const lines = new Array(ROWS);
    for (let r = 0; r < ROWS; r++) lines[r] = buf.chars[r].join("");
    pre.textContent = lines.join("\n");
  }

  // Fixed timestep
  let last = performance.now();
  let acc = 0;
  let totalTime = 0;
  const step = 1000 / FPS;

  function loop(now) {
    acc += (now - last);
    last = now;

    while (acc >= step) {
      totalTime += step;
      render(totalTime);
      acc -= step;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
