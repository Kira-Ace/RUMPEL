// drag
let _drag = null;

function dragStart(e) {
  if (e.target.closest('input,textarea,button,.cb,.todo-add-btn,.rz')) return;
  e.preventDefault();

  const el = e.currentTarget;
  el.style.zIndex = ++window.zTop;
  el.classList.add('is-dragging');

  const p = e.touches ? e.touches[0] : e;
  _drag = {
    el,
    ox: p.clientX - parseFloat(el.style.left),
    oy: p.clientY - parseFloat(el.style.top),
  };

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup',   dragEnd);
  document.addEventListener('touchmove', dragMove, { passive: false });
  document.addEventListener('touchend',  dragEnd);
}

function dragMove(e) {
  if (!_drag) return;
  if (e.cancelable) e.preventDefault();
  const p = e.touches ? e.touches[0] : e;
  _drag.el.style.left = (p.clientX - _drag.ox) + 'px';
  _drag.el.style.top  = (p.clientY - _drag.oy) + 'px';
}

function dragEnd() {
  if (_drag) _drag.el.classList.remove('is-dragging');
  _drag = null;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup',   dragEnd);
  document.removeEventListener('touchmove', dragMove);
  document.removeEventListener('touchend',  dragEnd);
}
