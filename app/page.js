'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

const PRESET_CHIPS = [
  { id: 'sidebar', type: 'sidebar', label: 'Navigation', bg: '#F2EFE9' },
  { id: 'header', type: 'header', label: 'Status Bar', bg: '#FFF5C2' },
  { id: 'path', type: 'path', label: 'Core Path', bg: '#EAE0F8' },
  { id: 'panel', type: 'panel', label: 'Side Panel', bg: '#FFE0DF' },
  { id: 'timer', type: 'timer', label: 'Focus Arch', bg: '#D8EDDA' },
];

const BLOCK_SIZES = { sidebar: [80, 280], header: [320, 70], path: [200, 300], panel: [160, 220], timer: [140, 180] };
const COLOR_SWATCHES = ['#F2EFE9', '#E8ED6A', '#B8D4C8', '#C8D8E8', '#E8C0B0', '#D8C8E8'];
const MORPH_MSGS = ['Reading your layout...', 'Mapping your habits...', 'Calibrating your system...', 'Almost...'];

const ARCHETYPES = {
  systematizer: { name: 'The Systematizer', italic: 'Systematizer', letter: 'S', desc: 'You think in lists. Your mind works best when tasks are broken down, sequenced, and checkable.', traits: ['Checklist-driven', 'Sequential', 'Completion-oriented'] },
  essayist: { name: 'The Essayist', italic: 'Essayist', letter: 'E', desc: 'You process by writing. Your notes are where your thinking actually happens.', traits: ['Note-heavy', 'Reflective', 'Writing-led'] },
  sculptor: { name: 'The Sculptor', italic: 'Sculptor', letter: 'K', desc: 'You shape your workspace deliberately. Each block has a purpose, a place.', traits: ['Spatial thinker', 'Custom-system builder', 'Detail-oriented'] },
  hybrid: { name: 'The Hybrid', italic: 'Hybrid', letter: 'H', desc: 'You adapt and pull from wherever works while keeping pieces connected.', traits: ['Adaptive', 'Multi-modal', 'Context-sensitive'] },
  minimalist: { name: 'The Minimalist', italic: 'Minimalist', letter: 'M', desc: 'You resist clutter. One thing at a time, clearly.', traits: ['Focused', 'Low-friction', 'Intentional'] },
};

const fallbackPlan = {
  insight: 'Your workspace shows you learn best with visible structure and clear transitions.',
  days: [
    { day: 'Day 1', date: 'Today', theme: 'Map the territory', sessions: [
      { time: '9:00 AM', duration: '30 min', task: 'List all exam topics and mark confidence', type: 'focus' },
      { time: '9:35 AM', duration: '10 min', task: 'Break', type: 'break' },
      { time: '9:45 AM', duration: '35 min', task: 'Review data structures with examples', type: 'focus' },
      { time: '10:25 AM', duration: '15 min', task: 'Summarize weak points', type: 'review' },
    ] },
    { day: 'Day 2', date: 'Tomorrow', theme: 'Timed execution', sessions: [
      { time: '9:00 AM', duration: '35 min', task: 'Algorithms drills: sort + search', type: 'focus' },
      { time: '9:40 AM', duration: '10 min', task: 'Break', type: 'break' },
      { time: '9:50 AM', duration: '35 min', task: 'Solve one full past problem set', type: 'focus' },
      { time: '10:30 AM', duration: '15 min', task: 'Error log + patch list', type: 'review' },
    ] },
    { day: 'Day 3', date: 'Exam Day', theme: 'Confidence pass', sessions: [
      { time: '8:00 AM', duration: '20 min', task: 'Quick concept recap cards', type: 'review' },
      { time: '8:25 AM', duration: '15 min', task: 'Two warm-up coding reps', type: 'focus' },
      { time: '8:45 AM', duration: '—', task: 'Reset, hydrate, arrive early', type: 'break' },
    ] },
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function HomePage() {
  const deskRef = useRef(null);
  const seq = useRef(1);
  const [chips, setChips] = useState(PRESET_CHIPS);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState('freetext');
  const [customColor, setCustomColor] = useState(COLOR_SWATCHES[1]);
  const [morphOn, setMorphOn] = useState(false);
  const [morphMsg, setMorphMsg] = useState(MORPH_MSGS[0]);
  const [stage2, setStage2] = useState({ on: false, plan: null, day: 0, archetype: null });

  const countLabel = items.length === 0 ? 'Empty desk' : `${items.length} block${items.length > 1 ? 's' : ''} placed`;

  const addItem = (chip) => {
    const desk = deskRef.current;
    if (!desk) return;
    const [w, h] = BLOCK_SIZES[chip.type] || [150, 130];
    const dw = desk.clientWidth, dh = desk.clientHeight;
    const rot = (Math.random() - 0.5) * 7;
    setItems((prev) => [...prev, {
      id: seq.current++, type: chip.type, label: chip.label, bg: chip.bg,
      x: 18 + Math.random() * Math.max(0, dw - w - 36), y: 18 + Math.random() * Math.max(0, dh - h - 36), w, h, rot,
      notes: '', objective: '', tasks: ['', '', ''], z: 10 + prev.length,
    }]);
  };

  const handleDragOrResize = (itemId, mode, ev) => {
    ev.preventDefault();
    const startX = ev.clientX; const startY = ev.clientY;
    const target = items.find((x) => x.id === itemId);
    if (!target) return;
    const ox = target.x, oy = target.y, ow = target.w, oh = target.h;

    const onMove = (e) => {
      setItems((prev) => prev.map((it) => {
        if (it.id !== itemId) return it;
        if (mode === 'drag') return { ...it, x: ox + (e.clientX - startX), y: oy + (e.clientY - startY) };
        return { ...it, w: Math.max(120, ow + e.clientX - startX), h: Math.max(80, oh + e.clientY - startY) };
      }));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const detectArchetype = (blocks) => {
    if (blocks.length <= 1) return 'minimalist';
    const counts = { freetext: 0, checklist: 0, custom: 0 };
    blocks.forEach((b) => {
      if (b.type === 'checklist') counts.checklist += 1;
      if (b.type === 'freetext') counts.freetext += 1;
      if (!['Navigation', 'Status Bar', 'Core Path', 'Side Panel', 'Focus Arch'].includes(b.label)) counts.custom += 1;
    });
    if (counts.checklist >= blocks.length * 0.5) return 'systematizer';
    if (counts.freetext >= blocks.length * 0.5) return 'essayist';
    if (counts.custom >= Math.ceil(blocks.length / 2)) return 'sculptor';
    return 'hybrid';
  };

  const startStudying = async () => {
    if (!items.length) return;
    setMorphOn(true);
    let mi = 0;
    const iv = setInterval(() => {
      mi = (mi + 1) % MORPH_MSGS.length;
      setMorphMsg(MORPH_MSGS[mi]);
    }, 1000);
    await sleep(1800);
    clearInterval(iv);
    setMorphOn(false);
    await sleep(350);
    setStage2({ on: true, plan: fallbackPlan, day: 0, archetype: detectArchetype(items) });
  };

  const archetype = stage2.archetype ? ARCHETYPES[stage2.archetype] : null;

  return (
    <>
      <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg>
      <div id="app">
        <div id="s1" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 8, padding: '10px 16px 0' }}>
            <Link href="/onboarding" style={{ fontSize: 12, padding: '6px 10px', borderRadius: 999, textDecoration: 'none', background: '#eef4ff', color: '#355699', fontWeight: 600 }}>New here? Onboarding</Link>
            <Link href="/reference-board" style={{ fontSize: 12, padding: '6px 10px', borderRadius: 999, textDecoration: 'none', background: '#fff2eb', color: '#9b4f2b', fontWeight: 600 }}>Reference Board</Link>
          </div>
          <div id="desk" ref={deskRef}>
            {items.length === 0 && <div className="empty-hint" id="hint"><span className="hint-txt">Your desk is empty.<br />Add a block below ↓</span></div>}
            {items.map((item) => (
              <div key={item.id} className={`item ${item.type}`} data-type={item.type} style={{ left: item.x, top: item.y, width: item.w, minHeight: item.h, zIndex: item.z, transform: `rotate(${item.rot}deg)`, backgroundColor: item.bg }} onPointerDown={(e) => handleDragOrResize(item.id, 'drag', e)}>
                <div className="item-head"><span className="item-lbl">{item.label}</span><button className="item-x" onClick={(e) => { e.stopPropagation(); setItems((prev) => prev.filter((x) => x.id !== item.id)); }}>×</button></div>
                <div className="item-body" onPointerDown={(e) => e.stopPropagation()}>
                  {item.type === 'checklist' && <><div className="todo-list">{item.tasks.map((task, idx) => <div className="todo-row" key={idx}><div className="cb"></div><input className="todo-inp" value={task} onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, tasks: x.tasks.map((t, i) => i === idx ? e.target.value : t) } : x))} /></div>)}</div><button className="todo-add-btn" onClick={() => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, tasks: [...x.tasks, ''] } : x))}>+ add item</button></>}
                  {item.type === 'focus' && <><input className="base-inp" placeholder="Current objective..." value={item.objective} onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, objective: e.target.value } : x))} /><textarea className="base-ta" placeholder="Notes..." style={{ minHeight: 40 }} value={item.notes} onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, notes: e.target.value } : x))} /></>}
                  {(item.type === 'freetext' || ['sidebar', 'header', 'path', 'panel', 'timer'].includes(item.type)) && <textarea className="base-ta" placeholder="Write anything..." value={item.notes} onChange={(e) => setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, notes: e.target.value } : x))} />}
                  {item.type === 'display' && <div className="block-display"><div className="block-display-num">—</div><div className="block-display-lbl">{item.label}</div></div>}
                </div>
                <div className="rz" onPointerDown={(e) => { e.stopPropagation(); handleDragOrResize(item.id, 'resize', e); }} />
              </div>
            ))}
          </div>
          <div className="cta"><div className="cta-lbl" id="counter">{countLabel}</div><button className="cta-btn" id="startBtn" onClick={startStudying} disabled={!items.length}>POST IT →</button></div>
          <div id="tray"><div className="tray-head">Stationeries</div><div className="tray-row" id="trayRow"><div className="chip chip-create" onClick={() => setModalOpen(true)}><div className="chip-create-icon">+</div><div className="chip-nm">Create</div></div>{chips.map((chip) => <div className="chip" key={chip.id} onClick={() => addItem(chip)}><div className="chip-swatch" style={{ background: chip.bg }} /><div className="chip-nm">{chip.label}</div></div>)}</div></div>
        </div>

        <div id="custom-modal" role="dialog" aria-modal="true" aria-label="Design custom block" className={`${modalOpen ? 'visible open' : ''}`} onClick={(e) => e.target.id === 'custom-modal' && setModalOpen(false)}>
          <div className="modal-sheet"><div className="modal-handle"></div><h2 className="modal-title">Design <em>your block</em></h2>
            <div className="field"><label className="field-lbl">Block name</label><input type="text" className="field-input" value={customName} onChange={(e) => setCustomName(e.target.value)} /></div>
            <div className="field"><label className="field-lbl">Mechanism</label><select className="field-select" value={customType} onChange={(e) => setCustomType(e.target.value)}><option value="freetext">Text Pad — free-form writing</option><option value="checklist">Checklist — actionable items</option><option value="focus">Focus Block — objective + notes</option><option value="display">Display — static label</option></select></div>
            <div className="field"><label className="field-lbl">Color</label><div className="swatch-row" id="swatchRow">{COLOR_SWATCHES.map((s) => <div key={s} className={`swatch ${customColor === s ? 'selected' : ''}`} style={{ backgroundColor: s }} onClick={() => setCustomColor(s)} />)}</div></div>
            <div className="modal-actions"><button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-create" onClick={() => {
              const chip = { id: `custom-${Date.now()}`, type: customType, label: customName.trim() || 'Custom Block', bg: customColor };
              setChips((prev) => [...prev, chip]);
              setModalOpen(false);
              setCustomName('');
              addItem(chip);
            }}>Create & Place</button></div>
          </div>
        </div>

        <div id="morph" aria-live="polite" className={morphOn ? 'on' : ''}><div className="morph-dots"><div className="morph-dot"></div><div className="morph-dot"></div><div className="morph-dot"></div></div><div className="morph-msg" id="morphMsg">{morphMsg}</div></div>

        <div id="s2" role="main" aria-label="Your study plan" className={stage2.on ? 'on' : ''} style={{ display: stage2.on ? 'flex' : 'none' }}>
          {archetype && <div id="archetype-panel" data-letter={archetype.letter}><div className="arch-eyebrow">Study Profile</div><div className="arch-name">{archetype.name.replace(archetype.italic, '')}<em>{archetype.italic}</em></div><div className="arch-desc">{archetype.desc}</div><div className="arch-traits">{archetype.traits.map((t) => <span key={t} className="trait-pill">{t}</span>)}</div></div>}
          <div className="day-tabs" id="dayTabBar" role="tablist">{stage2.plan?.days?.map((d, i) => <button key={d.day} className={`day-tab ${i === stage2.day ? 'active' : ''}`} onClick={() => setStage2((p) => ({ ...p, day: i }))}><div className="day-tab-n">{d.day.match(/\d+/)?.[0] || '—'}</div><div className="day-tab-lbl">{d.date}</div></button>)}</div>
          <div id="planCanvases" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{stage2.plan?.days?.map((day, di) => <div key={day.day} className={`plan-canvas ${di === stage2.day ? 'active' : ''}`}><div className="day-theme-note">{day.theme}</div>{day.sessions.map((sess, si) => <div key={`${sess.time}-${si}`} className="plan-row"><div className="plan-time">{sess.time?.replace(/\s?(AM|PM)/, '')}</div><div className={`plan-block ${sess.type}`}><div className="plan-block-task">{sess.task}</div><div className="plan-block-meta"><span className={`plan-badge ${sess.type}`}>{sess.type}</span><span className="plan-block-dur">{sess.duration}</span></div></div></div>)}{di === stage2.plan.days.length - 1 && <div className="insight-block"><div className="insight-lbl">💡 For you specifically</div><div className="insight-txt">{stage2.plan.insight}</div></div>}</div>)}</div>
          <div className="s2-footer"><button className="s2-btn" onClick={() => setStage2((p) => ({ ...p, on: false }))}>← Redesign</button><button className="s2-btn primary">Use this plan →</button></div>
        </div>
      </div>
    </>
  );
}
