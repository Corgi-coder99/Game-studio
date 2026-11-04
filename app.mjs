import { heroes, initialState, validState, summon, createBattle, attack } from './game.mjs';
const storageKey = 'thien-menh-studio-v1';
let state = initialState();
try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (validState(saved)) state = saved; } catch {}
let page = 'collection', filter = 'Tất cả', battle = null, results = [], selected = heroes[0].id, skill = false;
const $ = s => document.querySelector(s);
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 3500); }
function save() { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { toast('Không thể lưu trên trình duyệt. Hãy xuất bản lưu để giữ tiến độ.'); } }
const effective = h => ({ ...h, ...state.overrides[h.id] });
function spriteStyle(id) {
  const index = heroes.findIndex(h => h.id === id);
  return `--sprite-x:${(index % 4) * 100 / 3}%;--sprite-y:${index < 4 ? 0 : 100}%`;
}
function card(hero, mode = 'collection') {
  const h = mode === 'battle' ? hero : effective(hero);
  const owned = state.owned.includes(h.id), inTeam = state.team.includes(h.id), dead = h.hp <= 0;
  const button = mode === 'battle' ? h.side === 'enemy' && !dead && !battle.winner : mode === 'collection' && owned;
  const action = mode === 'battle' ? `data-target="${h.key}"` : `data-team="${h.id}"`;
  return `<${button ? 'button' : 'div'} class="hero-card ${!owned && mode === 'collection' ? 'locked' : ''} ${dead ? 'dead' : ''} ${mode === 'battle' && h.key === battle.allies[battle.active]?.key && h.side === 'ally' && !battle.winner ? 'active' : ''}" style="--hero:${h.color}" ${button ? action : ''} ${button ? `aria-label="${mode === 'battle' ? 'Tấn công' : inTeam ? 'Bỏ khỏi đội:' : 'Thêm vào đội:'} ${h.name}"` : ''}>
    <div class="card-top"><span class="rarity ${h.rarity}">${h.rarity}</span><span>${h.element} ◈</span></div>
    <div class="portrait pixel-portrait" role="img" aria-label="Hình pixel 2D ${h.name}" style="${spriteStyle(h.id)}"><span class="portrait-seal">${h.faction}</span></div>
    <div class="card-info"><small>${h.title}</small><h3>${h.name}</h3><div class="stats"><span>⚔ ${h.atk}</span><span>♡ ${h.hp}${mode === 'battle' ? ` / ${h.maxHp}` : ''}</span></div>${mode === 'battle' ? `<meter min="0" max="${h.maxHp}" value="${h.hp}" aria-label="Sinh lực ${h.name}"></meter>` : `<div class="card-footer">${mode === 'summon' ? h.duplicate ? 'Trùng thẻ · +25 linh ngọc' : 'Đã thêm vào bộ sưu tập' : owned ? inTeam ? '✓ Trong đội hình' : '+ Thêm vào đội' : 'Chưa chiêu mộ'}</div>`}</div>
  </${button ? 'button' : 'div'}>`;
}
function collection() {
  const list = heroes.filter(h => filter === 'Tất cả' || h.faction === filter);
  return `<section class="intro"><div><span class="eyebrow">BỘ SƯU TẬP · MÙA 01</span><h1>Huyền thoại hội tụ<span>.</span></h1><p>Chiêu mộ anh hùng. Kết hợp ngũ tướng. Viết lại thiên mệnh.</p></div><button class="primary" data-page="summon">✦ Chiêu mộ anh hùng <span>↗</span></button></section>
    <section class="banner"><div class="banner-art" aria-hidden="true">命</div><span class="eyebrow">THIÊN MỆNH · LEGENDS OF THE EAST</span><h2>Một đội hình.<br>Vạn cách định thiên hạ.</h2><p>Hỏa khắc Mộc · Mộc khắc Thủy · Thủy khắc Hỏa<br>Tận dụng khắc chế để tăng 35% sát thương.</p><button class="light" data-page="battle">Đến Hổ Lao Quan →</button><div class="banner-tag">CHƯƠNG I <span>虎牢關</span></div></section>
    <div class="section-heading"><div><h2>Tàng thư anh hùng <small>${state.owned.length} / ${heroes.length}</small></h2><p>Chọn thẻ đã sở hữu để thêm hoặc bỏ khỏi đội hình.</p></div><div class="filters" aria-label="Lọc phe">${['Tất cả', 'Tam Quốc', 'Tây Du', 'Phong Thần'].map(f => `<button class="${filter === f ? 'selected' : ''}" data-filter="${f}" aria-pressed="${filter === f}">${f}</button>`).join('')}</div></div>
    <div class="card-grid">${list.map(h => card(h)).join('')}</div>${teamPanel()}`;
}
function teamPanel() { return `<section class="team-panel"><div><span class="eyebrow">ĐỘI HÌNH XUẤT CHIẾN</span><h2>${state.team.length} / 5 anh hùng</h2></div><div class="team-slots">${Array.from({ length: 5 }, (_, i) => { const h = heroes.find(h => h.id === state.team[i]); return h ? `<button style="--hero:${h.color}" data-team="${h.id}" title="Bỏ ${h.name} khỏi đội"><b class="team-sprite" style="${spriteStyle(h.id)}" aria-hidden="true"></b><span>${h.name}</span></button>` : '<div class="empty-slot">＋<span>Chọn anh hùng</span></div>'; }).join('')}</div><button class="primary" data-page="battle" ${state.team.length < 5 ? 'disabled' : ''}>Xuất chiến →</button></section>`; }
function summonPage() { return `<section class="intro"><div><span class="eyebrow">ĐÀI CHIÊU MỘ</span><h1>Gọi tên huyền thoại<span>.</span></h1><p>Mỗi lần chiêu mộ là một cuộc gặp gỡ mới.</p></div></section><section class="summon-stage"><div class="summon-symbol" aria-hidden="true">召</div><span class="eyebrow">BANNER THƯỜNG · 8 ANH HÙNG</span><h2>Thiên địa anh hùng</h2><p>SSR 5% · SR 25% · R 70%<br>Bảo hiểm SSR sau tối đa 30 lượt không ra SSR.<br>Thẻ trùng hoàn lại 25 linh ngọc.</p><div class="pity">Bảo hiểm: ${state.pity} / 30 <progress value="${state.pity}" max="30"></progress></div><div class="actions"><button class="light" data-summon="1" ${state.coins < 100 ? 'disabled' : ''}>Chiêu mộ ×1 <small>◈ 100</small></button><button class="primary" data-summon="10" ${state.coins < 1000 ? 'disabled' : ''}>Chiêu mộ ×10 <small>◈ 1.000</small></button></div><small>Tiền mô phỏng · Không mua bằng tiền thật</small></section>${results.length ? `<div class="section-heading"><h2>Kết quả chiêu mộ</h2></div><div class="card-grid">${results.map(h => card(h, 'summon')).join('')}</div>` : ''}`; }
function battlePage() {
  if (!battle) return `<section class="intro"><div><span class="eyebrow">CHIẾN DỊCH · ẢI 01</span><h1>Hổ Lao Quan<span>.</span></h1><p>Hạ gục toàn bộ đối thủ để nhận 300 linh ngọc. Thua nhận 50.</p></div></section>${teamPanel()}<section class="rules"><h2>Quy tắc giao chiến</h2><p>Từng tướng của bạn hành động theo thứ tự từ trái sang phải. Chọn một thẻ địch còn sống để đánh. Khi cả đội hoàn tất lượt, quân địch phản công. Tuyệt kỹ tăng 60% sát thương, mở cho từng tướng ở mỗi vòng thứ 3. Đội địch ưu tiên mục tiêu đầu tiên còn sống.</p><button class="primary" data-start-battle ${state.team.length !== 5 ? 'disabled' : ''}>Bắt đầu trận đấu →</button></section>`;
  return `<div class="section-heading"><div><span class="eyebrow">HỔ LAO QUAN · VÒNG ${battle.turn}</span><h1>${battle.winner ? battle.winner === 'ally' ? 'Chiến thắng!' : 'Thất bại' : 'Chọn mục tiêu.'}</h1><p>${battle.winner ? battle.winner === 'ally' ? 'Đã nhận 300 linh ngọc.' : 'Đã nhận 50 linh ngọc. Thử thay đổi đội hình!' : `Đang hành động: ${battle.allies[battle.active].name}`}</p></div>${battle.winner ? '<button class="primary" data-rematch>Chuẩn bị trận mới →</button>' : `<button class="${skill ? 'primary' : 'light'}" data-skill ${battle.turn % 3 ? 'disabled' : ''} aria-pressed="${skill}">✦ Tuyệt kỹ ${skill ? 'đã chọn' : '(vòng 3, 6, 9…)'}</button>`}</div><span class="eyebrow">QUÂN ĐỊCH · CHỌN THẺ ĐỂ TẤN CÔNG</span><div class="arena"><div class="card-grid battle-grid">${battle.enemies.map(h => card(h, 'battle')).join('')}</div><div class="battle-divider">⚔ CHIẾN TRƯỜNG ⚔</div><span class="eyebrow">ĐỘI CỦA BẠN · VIỀN SÁNG CHỈ TƯỚNG ĐANG HÀNH ĐỘNG</span><div class="card-grid battle-grid">${battle.allies.map(h => card(h, 'battle')).join('')}</div></div><section class="battle-log" aria-live="polite"><h3>Nhật ký giao chiến</h3>${battle.log.slice(-8).map(l => `<p>${l}</p>`).join('')}</section>`;
}
function studio() {
  const h = effective(heroes.find(h => h.id === selected));
  return `<section class="intro"><div><span class="eyebrow">CODEX GAME STUDIO · LOCAL FIRST</span><h1>Xưởng tạo huyền thoại<span>.</span></h1><p>Thử cân bằng thẻ bài, xuất dữ liệu và tiếp tục phát triển cùng Codex.</p></div><span class="status-dot">Không cần API</span></section><div class="studio-layout"><section class="editor-panel"><span class="eyebrow">CARD LAB / 01</span><h2>Chỉnh thông số thẻ</h2><form id="editor"><label>Anh hùng<select name="hero" id="hero-select">${heroes.map(h => `<option value="${h.id}" ${h.id === selected ? 'selected' : ''}>${h.name} · ${h.rarity}</option>`).join('')}</select></label><label>Sinh lực · 50–300<input type="number" name="hp" min="50" max="300" value="${h.hp}" required></label><label>Tấn công · 10–80<input type="number" name="atk" min="10" max="80" value="${h.atk}" required></label><p>Thay đổi áp dụng cho đội của bạn từ trận mới. Quân địch dùng thông số gốc.</p><div class="actions"><button class="primary" type="submit">Lưu thông số</button><button class="light" type="button" data-reset-card>Khôi phục thẻ</button></div></form></section><div class="editor-preview">${card(h, 'preview')}<span class="eyebrow">XEM TRƯỚC THẺ</span></div><section class="editor-panel"><span class="eyebrow">WORKSPACE / 02</span><h2>Dữ liệu & Codex</h2><p>Game chạy độc lập. Codex làm việc trong kho mã qua hướng dẫn AGENTS.md; trang này chưa kết nối hoặc điều khiển phiên Codex.</p><button class="light wide" data-export>↓ Xuất bản lưu JSON</button><label class="file-label">↑ Nhập bản lưu JSON<input type="file" id="import-save" accept="application/json,.json"></label><button class="light wide" data-brief>Sao chép yêu cầu cho Codex</button><p class="muted">Mẫu yêu cầu: thêm một nhân vật, cập nhật dữ liệu, kiểm tra cân bằng và chạy kiểm thử.</p><button class="text-button" data-reset>Đặt lại toàn bộ bản thử nghiệm</button></section></div><section class="rules"><span class="eyebrow">CHI PHÍ VẬN HÀNH</span><h2>Nhẹ từ bản đầu.</h2><p>Không phụ thuộc thư viện, không dịch vụ trả phí, không gọi AI khi chơi. Hình pixel 2D được đóng gói sẵn, không cần tải ảnh qua mạng. Chi phí Codex tùy gói và mức sử dụng của bạn; chi phí hosting tùy nơi triển khai. Dữ liệu nằm trên trình duyệt này, hãy xuất bản lưu để sao lưu.</p></section>`;
}
function render() {
  const nav = [['collection', '▦', 'Anh hùng'], ['summon', '✦', 'Chiêu mộ'], ['battle', '⚔', 'Chiến dịch'], ['studio', '⌘', 'Studio']];
  $('#app').innerHTML = `<aside><a class="brand" href="#" aria-label="Thiên Mệnh trang chủ"><span class="brand-mark">天</span><div>THIÊN MỆNH<small>CODEX GAME STUDIO</small></div></a><span class="nav-caption">KHÔNG GIAN CỦA BẠN</span><nav>${nav.map(([id, icon, label]) => `<button data-page="${id}" class="${page === id ? 'current' : ''}" ${page === id ? 'aria-current="page"' : ''}><span>${icon}</span>${label}${page === id ? '<i></i>' : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="seal">傳奇</div><p>Huyền thoại phương Đông.<br>Thế giới do bạn tạo.</p><small>PROTOTYPE · v0.1</small></div></aside><div class="workspace"><header><span class="breadcrumb">Workspace <span>/</span> ${nav.find(n => n[0] === page)[2]}</span><div class="header-right"><span class="local-badge">● Lưu cục bộ</span><span class="currency">◈ ${state.coins.toLocaleString('vi-VN')} <small>LINH NGỌC</small></span><span class="avatar" aria-label="Người chơi">P</span></div></header><main>${({ collection, summon: summonPage, battle: battlePage, studio })[page]()}</main><footer><span>THIÊN MỆNH</span> Bản thử nghiệm · ${state.wins} chiến thắng · ${state.pulls} lượt chiêu mộ</footer></div>`;
}
document.addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  try {
    if (b.dataset.page) { page = b.dataset.page; render(); window.scrollTo(0, 0); }
    else if (b.dataset.filter) { filter = b.dataset.filter; render(); }
    else if (b.dataset.team) {
      const id = b.dataset.team;
      if (state.team.includes(id)) state.team = state.team.filter(x => x !== id);
      else if (state.team.length < 5) state.team.push(id);
      else return toast('Đội đã đủ 5 tướng. Bỏ một tướng trước khi thêm.');
      save(); render();
    } else if (b.dataset.summon) { const pull = summon(state, Number(b.dataset.summon)); state = pull.state; results = pull.results; save(); render(); }
    else if (b.hasAttribute('data-start-battle')) { battle = createBattle(state); skill = false; render(); }
    else if (b.dataset.target) {
      const before = battle.winner; battle = attack(battle, b.dataset.target, skill); skill = false;
      if (!before && battle.winner) { state.coins += battle.winner === 'ally' ? 300 : 50; if (battle.winner === 'ally') state.wins++; save(); }
      render();
    } else if (b.hasAttribute('data-skill')) { skill = !skill; render(); }
    else if (b.hasAttribute('data-rematch')) { battle = null; render(); }
    else if (b.hasAttribute('data-reset-card')) { delete state.overrides[selected]; save(); render(); }
    else if (b.hasAttribute('data-export')) { const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'thien-menh-save.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    else if (b.hasAttribute('data-brief')) { await navigator.clipboard.writeText(`Trong kho Game-studio, đọc AGENTS.md và docs/game-design.md. Thêm một nhân vật huyền thoại Trung Quốc vào game.mjs với chỉ số cân bằng, cập nhật test liên quan, chạy npm test và kiểm tra giao diện. Không thêm dịch vụ trả phí hoặc gọi AI lúc chơi. Dữ liệu cân bằng hiện tại: ${JSON.stringify(state.overrides)}`); toast('Đã sao chép yêu cầu. Dán vào phiên Codex của bạn.'); }
    else if (b.hasAttribute('data-reset') && confirm('Xóa tiến độ, đội hình và toàn bộ thay đổi cân bằng?')) { state = initialState(); results = []; battle = null; save(); render(); }
  } catch (err) { toast(err.message); }
});
document.addEventListener('change', async e => {
  if (e.target.id === 'hero-select') { selected = e.target.value; render(); }
  if (e.target.id === 'import-save') {
    try { const file = e.target.files[0]; if (!file) return; if (file.size > 100000) throw new Error('Bản lưu quá lớn.'); const imported = JSON.parse(await file.text()); if (!validState(imported)) throw new Error('Bản lưu không hợp lệ hoặc khác phiên bản.'); if (!confirm('Thay thế tiến độ hiện tại bằng bản lưu đã chọn?')) return; state = imported; battle = null; results = []; save(); render(); toast('Đã khôi phục bản lưu.'); }
    catch (err) { toast(err.message); }
  }
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'editor') return; e.preventDefault();
  const form = new FormData(e.target); const hp = Number(form.get('hp')), atk = Number(form.get('atk'));
  if (!Number.isInteger(hp) || hp < 50 || hp > 300 || !Number.isInteger(atk) || atk < 10 || atk > 80) return toast('Thông số ngoài phạm vi cho phép.');
  state.overrides[selected] = { hp, atk }; save(); render(); toast('Đã lưu. Thông số áp dụng từ trận tiếp theo.');
});
render();
