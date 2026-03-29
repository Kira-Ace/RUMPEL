// main

document.addEventListener('DOMContentLoaded', () => {
  renderTray();
  initColorPicker();
});

// flow
async function startStudying() {
  const blocks = collectDeskData();
  if (!blocks.length) return;

  // overlay
  const morph = document.getElementById('morph');
  morph.classList.add('on');

  let mi = 0;
  const msgEl = document.getElementById('morphMsg');
  const iv = setInterval(() => {
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent   = MORPH_MSGS[++mi % MORPH_MSGS.length];
      msgEl.style.opacity = '1';
    }, 200);
  }, 1000);

  msgEl.style.transition = 'opacity 0.2s';

  // wait
  await _sleep(1800);

  clearInterval(iv);
  morph.classList.remove('on');

  // next
  await _sleep(350);
  await renderStage2(blocks);
}

function goBack() {
  const s2 = document.getElementById('s2');
  s2.classList.remove('on');
  setTimeout(() => { s2.style.display = 'none'; }, 500);
}

// utils
function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
