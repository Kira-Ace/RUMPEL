// modal
let _selectedColor = COLOR_SWATCHES[1].hex; // default

function openCustomModal() {
  const modal = document.getElementById('custom-modal');
  modal.classList.add('visible');
  requestAnimationFrame(() => modal.classList.add('open'));
  document.getElementById('customName').value = '';
  document.getElementById('customName').focus();
}

function closeCustomModal() {
  const modal = document.getElementById('custom-modal');
  modal.classList.remove('open');
  setTimeout(() => modal.classList.remove('visible'), 400);
}

function saveCustom() {
  const name  = document.getElementById('customName').value.trim() || 'Custom Block';
  const type  = document.getElementById('customType').value;

  const chip = {
    id:    'custom-' + Date.now(),
    type,
    label: name,
    bg:    _selectedColor,
  };

  addCustomChip(chip);
  closeCustomModal();
  // drop now
  setTimeout(() => addItem(chip), 120);
}

function initColorPicker() {
  const row = document.getElementById('swatchRow');
  row.innerHTML = '';
  COLOR_SWATCHES.forEach((s, i) => {
    const sw = document.createElement('div');
    sw.className = 'swatch' + (i === 1 ? ' selected' : '');
    sw.style.backgroundColor = s.hex;
    sw.title = s.label;
    sw.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'));
      sw.classList.add('selected');
      _selectedColor = s.hex;
    });
    row.appendChild(sw);
  });
}

// close
document.getElementById('custom-modal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeCustomModal();
});
