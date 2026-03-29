// tray
let activeChips = [...PRESET_CHIPS];

function renderTray() {
  const row = document.getElementById('trayRow');
  // keep create first
  const createChip = row.querySelector('.chip-create');
  row.innerHTML = '';
  if (createChip) row.appendChild(createChip);

  activeChips.forEach(chip => {
    const el = document.createElement('div');
    el.className = 'chip';
    el.innerHTML = `
      <div class="chip-swatch" style="background:${chip.bg}"></div>
      <div class="chip-nm">${chip.label}</div>`;

    let tapped = false;
    el.addEventListener('touchend', e => {
      e.preventDefault();
      tapped = true;
      addItem(chip);
      setTimeout(() => (tapped = false), 400);
    });
    el.addEventListener('click', () => { if (!tapped) addItem(chip); });
    row.appendChild(el);
  });
}

function addCustomChip(chip) {
  activeChips.push(chip);
  renderTray();
}
