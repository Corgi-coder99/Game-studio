import { structures, worldNodes, skills } from './kingdom.mjs';

// Live, interactive pixel scene. Buildings and terrain are drawn on a coarse grid.
export function mountMap(canvas, read, select) {
  const ctx = canvas.getContext('2d');
  const camera = { x: 0, y: 0, zoom: 1 }, hits = [];
  const cityArt = new Image();
  cityArt.src = '/assets/city-pixel.png';
  let dragging = null, moved = false, frame, disposed = false;
  const observer = new ResizeObserver(() => { canvas.width = Math.round(canvas.clientWidth); canvas.height = Math.round(canvas.clientHeight); });
  observer.observe(canvas);
  const noise = (x, y) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
  function poly(points, fill, stroke) { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(Math.round(x), Math.round(y)) : ctx.moveTo(Math.round(x), Math.round(y))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } }
  function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function iso(x, y) { return [(x - y) * 23, (x + y) * 11.5]; }
  function tile(x, y, color) { const [px, py] = iso(x, y); poly([[px, py], [px + 23, py + 11.5], [px, py + 23], [px - 23, py + 11.5]], color, '#192f2322'); }
  function tree(x, y, seed = 1) {
    rect(x - 3, y - 5, 6, 15, '#594c37');
    poly([[x - 19, y - 10], [x - 15, y - 28], [x - 8, y - 28], [x - 8, y - 39], [x + 4, y - 45], [x + 15, y - 34], [x + 14, y - 24], [x + 22, y - 15], [x + 18, y - 4]], seed > .5 ? '#294b39' : '#315945');
    rect(x - 10, y - 30, 12, 6, '#528058'); rect(x + 3, y - 23, 12, 5, '#426e4b');
    rect(x - 18, y + 8, 35, 4, '#1e392b66');
  }
  function box(x, y, w, h, color = '#d0ba8b') {
    poly([[x, y], [x + w, y + w * .4], [x, y + w * .8], [x - w, y + w * .4]], '#34373177');
    poly([[x - w, y + w * .4 - h], [x, y + w * .8 - h], [x, y + w * .8], [x - w, y + w * .4]], color);
    poly([[x, y + w * .8 - h], [x + w, y + w * .4 - h], [x + w, y + w * .4], [x, y + w * .8]], '#8f815f');
    poly([[x, y - h], [x + w, y + w * .4 - h], [x, y + w * .8 - h], [x - w, y + w * .4 - h]], '#e1cfa1');
  }
  function roof(x, y, w, color = '#345976') {
    poly([[x - w - 7, y + 8], [x - w + 5, y - 2], [x, y - w * .43], [x + w - 5, y - 2], [x + w + 7, y + 8], [x, y + w * .42]], '#152c3a');
    poly([[x - w - 5, y + 4], [x, y - w * .43], [x + w + 5, y + 4], [x, y + w * .31]], color);
    poly([[x, y - w * .43], [x + w + 5, y + 4], [x, y + w * .31]], '#203f56');
    for (let i = -w + 8; i < w; i += 9) rect(x + i, y - Math.max(0, w * .3 - Math.abs(i) * .3), 4, 3, '#88a1a177');
    rect(x - 5, y - w * .43 - 5, 10, 5, '#d0ae67');
  }
  function pagoda(x, y, size = 1, tint = '#b84c4c') {
    ctx.save(); ctx.translate(x, y); ctx.scale(size, size);
    box(0, -6, 48, 12, '#a6a28a'); box(0, -12, 38, 35, tint);
    for (const dx of [-22, -5, 13]) { rect(dx, -28, 9, 13, '#e9b85b'); rect(dx, -18, 9, 2, '#8c3f36'); }
    rect(-9, -7, 16, 22, '#373d34'); roof(0, -42, 48); box(0, -47, 23, 26, tint); roof(0, -72, 32, '#41627a');
    rect(-2, -100, 4, 16, '#d4af60');
    ctx.restore();
  }
  function farm(x, y) {
    poly([[x - 45, y - 12], [x, y - 31], [x + 46, y - 10], [x, y + 14]], '#735a34', '#b4a268');
    for (let row = 0; row < 5; row++) for (let col = 0; col < 7; col++) { const fx = x - 33 + col * 9 + row * 2, fy = y - 10 + row * 4 - col * 2; rect(fx, fy - 10, 2, 10, '#87934b'); rect(fx - 2, fy - 12, 6, 5, '#d5bf57'); }
    box(x + 27, y - 16, 16, 22); roof(x + 27, y - 38, 20, '#9f6d40');
  }
  function quarry(x, y) { for (let i = 0; i < 5; i++) { const bx = x + (i % 3) * 18 - 25, by = y + Math.floor(i / 3) * 13; poly([[bx - 13, by], [bx - 9, by - 22], [bx + 5, by - 28], [bx + 18, by - 9], [bx + 12, by + 4]], '#93a1a0'); poly([[bx + 5, by - 28], [bx + 18, by - 9], [bx + 12, by + 4], [bx, by - 2]], '#647977'); } }
  function dragon(x, y, time, color = '#c19ce5') {
    const flap = Math.sin(time * 3) * 4;
    poly([[x - 4, y - 5], [x - 36, y - 30 - flap], [x - 24, y - 2], [x - 39, y + 3], [x - 14, y + 8]], color);
    poly([[x + 4, y - 5], [x + 36, y - 30 - flap], [x + 24, y - 2], [x + 39, y + 3], [x + 14, y + 8]], color);
    rect(x - 7, y - 23, 14, 40, '#789d99'); rect(x - 10, y - 23, 20, 12, '#97c3a4'); rect(x - 5, y - 20, 3, 3, '#fff0a1'); rect(x + 5, y - 20, 3, 3, '#fff0a1');
    poly([[x - 5, y + 10], [x - 23, y + 28], [x + 4, y + 20], [x + 7, y + 10]], '#5a8988');
  }
  function citySprite(index, x, y, width = 140) {
    if (!cityArt.complete || !cityArt.naturalWidth) return false;
    const sw = cityArt.naturalWidth / 3, sh = cityArt.naturalHeight / 2;
    ctx.drawImage(cityArt, index % 3 * sw, Math.floor(index / 3) * sh, sw, sh, Math.round(x - width / 2), Math.round(y - width + 22), width, width);
    return true;
  }
  function label(x, y, title, subtitle, selected = false) {
    ctx.font = '600 11px system-ui'; const width = Math.max(80, ctx.measureText(title).width + 20);
    rect(x - width / 2, y, width, subtitle ? 34 : 23, selected ? '#d1ae64' : '#132b35ec');
    ctx.strokeStyle = selected ? '#ffe5a2' : '#a6926055'; ctx.strokeRect(Math.round(x - width / 2), Math.round(y), Math.round(width), subtitle ? 34 : 23);
    ctx.fillStyle = selected ? '#182b30' : '#f1e8ce'; ctx.textAlign = 'center'; ctx.fillText(title, x, y + 15);
    if (subtitle) { ctx.font = '9px system-ui'; ctx.fillStyle = selected ? '#354a45' : '#adbeae'; ctx.fillText(subtitle, x, y + 28); }
    ctx.textAlign = 'left';
  }
  function drawEffect(x, y, event, time) {
    const color = skills[event.actor]?.color || '#f6d78c', t = time % 1;
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
    if (['flame', 'dragon'].includes(event.kind)) for (let i = 0; i < 15; i++) { const a = i * 2.4 + time; rect(x + Math.cos(a) * 45 * t, y + Math.sin(a) * 25 * t - t * 30, 4 + i % 3, 7, i % 2 ? '#ffda7d' : '#ff704a'); }
    else if (event.kind === 'beam') { ctx.beginPath(); ctx.moveTo(x - 60, y - 65); ctx.lineTo(x + 30, y + 15); ctx.stroke(); ctx.lineWidth = 7; ctx.globalAlpha = .3; ctx.stroke(); ctx.globalAlpha = 1; }
    else if (event.kind === 'formation') { ctx.beginPath(); for (let i = 0; i <= 8; i++) { const a = i * Math.PI / 4 + time; const p = [x + Math.cos(a) * 50, y + Math.sin(a) * 24]; i ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); }
    else if (event.kind === 'petal') for (let i = 0; i < 12; i++) { const a = i * 2.4 + time; rect(x + Math.cos(a) * (20 + t * 30), y + Math.sin(a) * (15 + t * 20), 5, 5, color); }
    else if (event.kind === 'spear') for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x - 45 + i * 15, y + 20); ctx.lineTo(x + 25 + i * 15, y - 35); ctx.stroke(); }
    else if (event.kind === 'monkey') for (let i = 0; i < 3; i++) { rect(x - 40 + i * 40, y - 50 + Math.sin(time * 6 + i) * 10, 6, 55, color); rect(x - 46 + i * 40, y - 25, 18, 16, '#bf7045'); }
    else { ctx.beginPath(); ctx.ellipse(x, y, 20 + t * 40, 10 + t * 20, event.kind === 'crescent' ? -.5 : 0, 0, Math.PI * (event.kind === 'crescent' ? 1.6 : 2)); ctx.stroke(); }
  }
  function draw(timeMs) {
    if (disposed) return;
    const { state, view, selected } = read(), time = timeMs / 1000, city = view === 'city';
    const w = canvas.width, h = canvas.height;
    ctx.imageSmoothingEnabled = false; rect(0, 0, w, h, '#142a36');
    // Subtle world coordinates remain visible behind the playable island.
    for (let x = 0; x < w; x += 44) for (let y = 0; y < h; y += 32) rect(x + (y % 64 ? 22 : 0), y, 1, 1, '#2c435044');
    ctx.save(); const baseZoom = Math.min(1.1, Math.max(.64, w / 1000));
    ctx.translate(w / 2 + camera.x, h / 2 - (city ? 205 : 275) * baseZoom + camera.y); ctx.scale(camera.zoom * baseZoom, camera.zoom * baseZoom); hits.length = 0;
    const size = city ? 18 : 23;
    for (let x = 0; x < size; x++) for (let y = 0; y < size; y++) {
      const n = noise(x, y), river = !city && (x > 16 && y < 6 || y > 19 && x < 8);
      const path = city && (x === 8 || x === 9 || y === 8 || y === 9);
      tile(x, y, river ? ['#335e72', '#3c6a80'][n > .5 ? 0 : 1] : path ? ['#b9aa7b', '#afa079'][n > .5 ? 0 : 1] : ['#54754c', '#5b7e50', '#527247', '#638454'][Math.floor(n * 4)]);
      const [px, py] = iso(x, y);
      if (x === size - 1 || y === size - 1) { poly([[px, py + 23], [px + (x === size - 1 ? 23 : -23), py + 11.5], [px + (x === size - 1 ? 23 : -23), py + 25], [px, py + 37]], '#374c39'); }
      if (!river && !path && n > .88) { rect(px - 8, py + 9, 3, 3, '#8ca46b'); rect(px + 3, py + 15, 2, 2, '#a3ad75'); }
      if (!city && !river && n > .94 && !worldNodes.some(p => Math.abs(p.x - x) < 2 && Math.abs(p.y - y) < 2)) tree(px, py + 10, n);
      if (city && (x < 2 || y < 2 || x > 15 || y > 15) && n > .76) tree(px, py + 10, n);
    }
    if (city) {
      for (let i = 3; i < 16; i++) { const [x, y] = iso(3, i); box(x, y, 12, 21, '#aab09a'); const [a, b] = iso(i, 3); box(a, b, 12, 21, '#aab09a'); }
      for (const b of [...structures].sort((a, b) => a.x + a.y - b.x - b.y)) {
        const [x, y] = iso(b.x, b.y);
        if (b.id === selected) { ctx.strokeStyle = '#f2d185'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 12, 65, 31, 0, 0, Math.PI * 2); ctx.stroke(); }
        if (citySprite(structures.findIndex(item => item.id === b.id), x, y, b.id === 'hall' ? 150 : 120)) { /* Pixel atlas loaded. */ }
        else if (b.id === 'hall') pagoda(x, y, 1.3);
        else if (b.id === 'farm') farm(x, y);
        else if (b.id === 'wood') { box(x, y, 30, 27); roof(x, y - 30, 37, '#7c6550'); for (let i = 0; i < 4; i++) rect(x + 22 - i * 6, y + 6 + i * 3, 24, 5, '#b09161'); }
        else if (b.id === 'stone') quarry(x, y);
        else if (b.id === 'barracks') { pagoda(x, y, .85, '#b7b397'); rect(x + 35, y - 50, 3, 55, '#bfa976'); poly([[x + 38, y - 50], [x + 64, y - 45], [x + 38, y - 31]], '#bb565c'); }
        else { box(x, y + 10, 38, 15, '#a39bba'); dragon(x, y - 28 + Math.sin(time * 2) * 3, time, state.dragon === 'Hỏa' ? '#d89573' : state.dragon === 'Thủy' ? '#93bddd' : '#b1ce8a'); }
        const hitSize = b.id === 'hall' ? 150 : 120;
        hits.push({ id: b.id, x: x - hitSize / 2, y: y - hitSize + 22, w: hitSize, h: hitSize + 45 });
      }
      for (const b of structures) { const [x, y] = iso(b.x, b.y); label(x, y + 30, b.name, `Cấp ${state.levels[b.id]}`, selected === b.id); }
      label(0, 455, 'THIÊN MỆNH THÀNH', 'Lãnh địa của bạn · Thanh Vân');
    } else {
      for (const n of [...worldNodes].sort((a, b) => a.x + a.y - b.x - b.y)) {
        const [x, y] = iso(n.x, n.y);
        if (selected === n.id) { ctx.strokeStyle = '#f2d185'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 6, 62, 29, 0, 0, Math.PI * 2); ctx.stroke(); }
        if (n.type === 'home') { if (!citySprite(0, x, y, 135)) pagoda(x, y, 1.05); }
        else if (n.type === 'camp') { poly([[x - 33, y + 13], [x - 3, y - 35], [x + 27, y + 13]], '#ab5750', '#dfac79'); poly([[x - 3, y - 35], [x + 27, y + 13], [x + 4, y + 13]], '#713f45'); rect(x - 5, y - 5, 12, 19, '#332b35'); rect(x + 28, y - 51, 3, 60, '#c3a777'); poly([[x + 31, y - 51], [x + 51, y - 45], [x + 31, y - 34]], '#c3585c'); }
        else if (n.type === 'food') farm(x, y);
        else if (n.type === 'wood') { tree(x - 15, y, .8); tree(x + 14, y + 8, .3); }
        else quarry(x, y);
        label(x, y + 26, n.name, n.type === 'camp' ? `Cấp ${n.level} ${state.cleared.includes(n.id) ? '· Đã chinh phục' : '· Chưa chinh phục'}` : n.type === 'home' ? 'Thành trì' : 'Tài nguyên · 500', selected === n.id);
        hits.push({ id: n.id, x: x - 70, y: y - 100, w: 140, h: 165 });
      }
      if (state.march) {
        const m = state.march, node = worldNodes.find(n => n.id === m.nodeId), home = worldNodes[0];
        const [hx, hy] = iso(home.x, home.y), [nx, ny] = iso(node.x, node.y);
        const progress = Math.min(1, m.progress / m.duration);
        const ratio = m.stage === 'marching' ? progress : m.stage === 'returning' ? 1 - progress : 1;
        const x = hx + (nx - hx) * ratio, y = hy + (ny - hy) * ratio;
        ctx.strokeStyle = '#f7d48c'; ctx.lineWidth = 2; ctx.setLineDash([5, 7]); ctx.beginPath(); ctx.moveTo(hx, hy + 12); ctx.lineTo(nx, ny + 12); ctx.stroke(); ctx.setLineDash([]);
        for (let i = 0; i < 6; i++) { const dx = x + (i % 3) * 10 - 10, dy = y + Math.floor(i / 3) * 8; rect(dx, dy - 10, 7, 11, '#7dbcc4'); rect(dx + 1, dy - 14, 5, 5, '#edd6a7'); rect(dx + 7, dy - 20, 2, 20, '#dec58e'); }
        label(x, y - 54, m.stage === 'combat' ? 'ĐANG GIAO CHIẾN' : m.stage === 'gathering' ? 'ĐANG THU THẬP' : m.stage === 'returning' ? 'ĐANG TRỞ VỀ' : 'ĐANG HÀNH QUÂN', null, true);
        if (m.stage === 'combat' && state.battle) {
          for (const event of state.battle.events.filter(e => state.battle.clock - e.at < 2).slice(-3)) drawEffect(x, y - 30, event, time);
          const flashes = Math.sin(time * 7) > .5;
          if (flashes) rect(x - 2, y - 25, 5, 8, '#fff2a3');
        }
      }
    }
    ctx.restore();
    frame = requestAnimationFrame(draw);
  }
  canvas.addEventListener('pointerdown', e => { dragging = { x: e.clientX, y: e.clientY, cx: camera.x, cy: camera.y }; moved = false; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y; if (Math.abs(dx) + Math.abs(dy) > 5) moved = true; camera.x = Math.max(-500, Math.min(500, dragging.cx + dx)); camera.y = Math.max(-350, Math.min(350, dragging.cy + dy)); });
  canvas.addEventListener('pointerup', e => {
    if (!moved && dragging) { const r = canvas.getBoundingClientRect(), { view } = read(), z = Math.min(1.1, Math.max(.64, canvas.width / 1000)) * camera.zoom, base = Math.min(1.1, Math.max(.64, canvas.width / 1000)); const x = (e.clientX - r.left - canvas.width / 2 - camera.x) / z, y = (e.clientY - r.top - canvas.height / 2 + (view === 'city' ? 205 : 275) * base - camera.y) / z; const hit = [...hits].reverse().find(p => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h); if (hit) select(hit.id); }
    dragging = null;
  });
  canvas.addEventListener('wheel', e => { e.preventDefault(); camera.zoom = Math.max(.65, Math.min(1.8, camera.zoom - e.deltaY * .001)); }, { passive: false });
  frame = requestAnimationFrame(draw);
  return { reset() { camera.x = 0; camera.y = 0; camera.zoom = 1; }, zoom(delta) { camera.zoom = Math.max(.65, Math.min(1.8, camera.zoom + delta)); }, dispose() { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); } };
}
