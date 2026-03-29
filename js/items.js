// items
window.zTop = 10;
let _uid = 0;

function addItem(chip) {
  const desk = document.getElementById('desk');
  const dw = desk.clientWidth, dh = desk.clientHeight;
  const [w, h] = BLOCK_SIZES[chip.type] || [150, 130];
  const id  = ++_uid;
  const rot = (Math.random() - 0.5) * 7;
  const x   = 18 + Math.random() * Math.max(0, dw - w - 36);
  const y   = 18 + Math.random() * Math.max(0, dh - h - 36);

  const el = document.createElement('div');
  el.className = `item ${chip.type} dropping`;
  el.dataset.id   = id;
  el.dataset.type = chip.type;
  el.style.cssText =
    `left:${x}px;top:${y}px;width:${w}px;min-height:${h}px;` +
    `z-index:${++window.zTop};transform:rotate(${rot}deg);` +
    `background-color:${chip.bg};`;
  el.style.setProperty('--r', `${rot}deg`);

  el.innerHTML = `
    <div class="item-head">
      <span class="item-lbl">${chip.label}</span>
      <button class="item-x" aria-label="Remove">×</button>
    </div>
    <div class="item-body">${_bodyHTML(chip)}</div>
    <div class="rz" aria-label="Resize"></div>`;

  // setup
  el.addEventListener('mousedown', dragStart);
  el.addEventListener('touchstart', dragStart, { passive: false });
  el.querySelector('.rz').addEventListener('mousedown', rzStart);
  el.querySelector('.rz').addEventListener('touchstart', rzStart, { passive: false });
  el.querySelector('.item-x').addEventListener('click', e => { e.stopPropagation(); removeItem(el); });

  // clicks
  el.addEventListener('click', _handleItemClick);

  // prevent destruction
  el.querySelectorAll('input,textarea,button,.cb,.todo-add-btn,.rz').forEach(n => {
    n.addEventListener('mousedown', e => e.stopPropagation());
    n.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
  });

  desk.appendChild(el);
  requestAnimationFrame(() => setTimeout(() => el.classList.remove('dropping'), 320));

  document.getElementById('hint').classList.add('gone');
  updateDeskUI();
}

function _bodyHTML(chip) {
  switch (chip.type) {
    case 'freetext':
      return `<textarea class="base-ta" placeholder="Write anything..."></textarea>`;

    case 'checklist':
      return `
        <div class="todo-list">
          ${[0,1,2].map(() => _todoRowHTML()).join('')}
        </div>
        <button class="todo-add-btn">+ add item</button>`;

    case 'display':
      return `
        <div class="block-display">
          <div class="block-display-num">—</div>
          <div class="block-display-lbl">${chip.label}</div>
        </div>`;

    case 'focus':
      return `
        <input class="base-inp" placeholder="Current objective...">
        <textarea class="base-ta" placeholder="Notes..." style="min-height:40px"></textarea>`;

    default:
      return `<textarea class="base-ta" placeholder="..."></textarea>`;
  }
}

function _todoRowHTML() {
  return `<div class="todo-row"><div class="cb"></div><input class="todo-inp" placeholder="..."></div>`;
}

function _makeTodoRow() {
  const wrap = document.createElement('div');
  wrap.innerHTML = _todoRowHTML();
  const row = wrap.firstElementChild;
  row.querySelectorAll('input,.cb').forEach(n => {
    n.addEventListener('mousedown', e => e.stopPropagation());
    n.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
  });
  return row;
}

function _handleItemClick(e) {
  const cb = e.target.closest('.cb');
  if (cb) {
    cb.classList.toggle('on');
    cb.closest('.todo-row')?.classList.toggle('done');
    return;
  }
  const addBtn = e.target.closest('.todo-add-btn');
  if (addBtn) {
    const list = e.currentTarget.querySelector('.todo-list');
    const row  = _makeTodoRow();
    list.appendChild(row);
    row.querySelector('.todo-inp')?.focus();
  }
}

function removeItem(el) {
  el.remove();
  updateDeskUI();
  if (!document.querySelector('.item')) {
    document.getElementById('hint').classList.remove('gone');
  }
}

function updateDeskUI() {
  const n = document.querySelectorAll('.item').length;
  document.getElementById('counter').textContent =
    n === 0 ? 'Empty desk' : `${n} block${n !== 1 ? 's' : ''} placed`;
  document.getElementById('startBtn').disabled = n === 0;
}
