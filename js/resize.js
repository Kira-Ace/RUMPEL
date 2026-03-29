// resize
let _rz = null;

function rzStart(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget.closest('.item');
  const p  = e.touches ? e.touches[0] : e;
  _rz = { el, ox: p.clientX, oy: p.clientY, sw: el.offsetWidth, sh: el.offsetHeight };

  document.addEventListener('mousemove', rzMove);
  document.addEventListener('mouseup',   rzEnd);
  document.addEventListener('touchmove', rzMove, { passive: false });
  document.addEventListener('touchend',  rzEnd);
}

function rzMove(e) {
  if (!_rz) return;
  if (e.cancelable) e.preventDefault();
  const p = e.touches ? e.touches[0] : e;
  _rz.el.style.width     = Math.max(120, _rz.sw + p.clientX - _rz.ox) + 'px';
  _rz.el.style.minHeight = Math.max(80,  _rz.sh + p.clientY - _rz.oy) + 'px';
}

function rzEnd() {
  _rz = null;
  document.removeEventListener('mousemove', rzMove);
  document.removeEventListener('mouseup',   rzEnd);
  document.removeEventListener('touchmove', rzMove);
  document.removeEventListener('touchend',  rzEnd);
}
