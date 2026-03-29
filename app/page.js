'use client';

import { useMemo, useRef, useState } from 'react';

const PRESET_CHIPS = [
  { id: 'navbar', type: 'navbar', label: 'Navbar', bg: '#F2EFE9' },
  { id: 'focus', type: 'focus', label: 'Focus Block', bg: '#D8EDDA' },
  { id: 'tasks', type: 'tasks', label: 'Task List', bg: '#EAE0F8' },
  { id: 'notes', type: 'notes', label: 'Notes', bg: '#FFE0DF' },
  { id: 'calendar', type: 'calendar', label: 'Calendar', bg: '#FFF5C2' },
];

const COLOR_SWATCHES = ['#F2EFE9', '#E8ED6A', '#B8D4C8', '#C8D8E8', '#E8C0B0', '#D8C8E8'];
const MORPH_MSGS = ['Reading your layout...', 'Mapping your planner style...', 'Calibrating mobile snapping...', 'Building your first plan...'];

const ARCHETYPES = {
  casual: { title: 'Classic Calendar', desc: 'A clean day-by-day planner with practical task slots.' },
  gamified: { title: 'Gamified Quest', desc: 'Tasks become levels and streaks to keep momentum high.' },
  scroll: { title: 'Scroll Feed', desc: 'A timeline list to quickly scan, reorder, and complete tasks.' },
};

const fallbackPlan = {
  insight: 'You prefer clear structure with flexible rescheduling when life gets noisy.',
  days: [
    {
      day: 'Day 1',
      date: 'Today',
      theme: 'Foundation day',
      sessions: [
        { time: '8:00 AM', duration: '20 min', task: 'Fetch water', type: 'review' },
        { time: '8:30 AM', duration: '15 min', task: 'Feed dog', type: 'break' },
        { time: '9:00 AM', duration: '60 min', task: 'Study linear algebra', type: 'focus' },
      ],
    },
    {
      day: 'Day 2',
      date: 'Tomorrow',
      theme: 'Deep work',
      sessions: [
        { time: '9:00 AM', duration: '40 min', task: 'Matrices and vector spaces', type: 'focus' },
        { time: '10:00 AM', duration: '15 min', task: 'Break', type: 'break' },
        { time: '10:20 AM', duration: '30 min', task: 'Practice problems set A', type: 'review' },
      ],
    },
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function HomePage() {
  const deskRef = useRef(null);
  const seq = useRef(1);

  const [stage, setStage] = useState(1);
  const [chips, setChips] = useState(PRESET_CHIPS);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState(COLOR_SWATCHES[1]);

  const [plannerIndex, setPlannerIndex] = useState(0);
  const plannerKeys = ['casual', 'gamified', 'scroll'];
  const plannerType = plannerKeys[plannerIndex];
  const [gamified, setGamified] = useState(false);

  const [uiLayout, setUiLayout] = useState([
    { id: 'navbar', label: 'Navbar', x: 24, y: 520, w: 300, h: 56 },
    { id: 'settings', label: 'Settings', x: 300, y: 24, w: 52, h: 52 },
    { id: 'journal', label: 'Journal', x: 24, y: 420, w: 110, h: 48 },
  ]);

  const [morphOn, setMorphOn] = useState(false);
  const [morphMsg, setMorphMsg] = useState(MORPH_MSGS[0]);

  const [planDay, setPlanDay] = useState(0);
  const [todoToday, setTodoToday] = useState(['Fetch water', 'Feed dog', 'Study linear algebra']);
  const [rememberLater, setRememberLater] = useState([]);
  const [journal, setJournal] = useState('Felt mentally drained before my study session.');
  const [rescheduleSuggestion, setRescheduleSuggestion] = useState('');

  const stage1Done = items.length > 0;

  const addItem = (chip) => {
    const desk = deskRef.current;
    if (!desk) return;
    const rect = desk.getBoundingClientRect();
    const cellW = rect.width / 5;
    const cellH = rect.height / 10;
    const w = cellW;
    const h = cellH;

    setItems((prev) => [
      ...prev,
      {
        id: seq.current++,
        type: chip.type,
        label: chip.label,
        bg: chip.bg,
        x: 0,
        y: 0,
        w,
        h,
        notes: '',
        z: 10 + prev.length,
      },
    ]);
  };

  const handleStage1DragOrResize = (itemId, mode, ev) => {
    ev.preventDefault();
    const desk = deskRef.current;
    if (!desk) return;
    const rect = desk.getBoundingClientRect();
    const cellW = rect.width / 5;
    const cellH = rect.height / 10;

    const startX = ev.clientX;
    const startY = ev.clientY;
    const target = items.find((x) => x.id === itemId);
    if (!target) return;
    const ox = target.x;
    const oy = target.y;
    const ow = target.w;
    const oh = target.h;

    const onMove = (e) => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== itemId) return it;
          if (mode === 'drag') {
            return {
              ...it,
              x: clamp(ox + (e.clientX - startX), 0, rect.width - it.w),
              y: clamp(oy + (e.clientY - startY), 0, rect.height - it.h),
            };
          }

          return {
            ...it,
            w: clamp(ow + (e.clientX - startX), cellW, rect.width),
            h: clamp(oh + (e.clientY - startY), cellH, rect.height),
          };
        }),
      );
    };

    const onUp = () => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== itemId) return it;
          const snappedW = clamp(Math.round(it.w / cellW) * cellW, cellW, rect.width);
          const snappedH = clamp(Math.round(it.h / cellH) * cellH, cellH, rect.height);
          const snappedX = clamp(Math.round(it.x / cellW) * cellW, 0, rect.width - snappedW);
          const snappedY = clamp(Math.round(it.y / cellH) * cellH, 0, rect.height - snappedH);
          return { ...it, x: snappedX, y: snappedY, w: snappedW, h: snappedH };
        }),
      );
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const detectArchetype = useMemo(() => {
    if (plannerType === 'gamified') return 'The Challenger';
    if (plannerType === 'scroll') return 'The Flow Planner';
    return 'The Classic Structurer';
  }, [plannerType]);

  const goToStage3 = () => setStage(3);

  const handleUILayoutDrag = (id, ev) => {
    ev.preventDefault();
    const container = document.getElementById('ui-stage-canvas');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const current = uiLayout.find((x) => x.id === id);
    if (!current) return;

    const onMove = (e) => {
      const nx = clamp(current.x + e.clientX - startX, 0, rect.width - current.w);
      const ny = clamp(current.y + e.clientY - startY, 0, rect.height - current.h);
      setUiLayout((prev) => prev.map((el) => (el.id === id ? { ...el, x: nx, y: ny } : el)));
    };

    const onUp = () => {
      setUiLayout((prev) =>
        prev.map((el) => {
          if (el.id !== id) return el;
          if (el.id === 'navbar') {
            const snapTop = 12;
            const snapBottom = rect.height - el.h - 12;
            const toTop = Math.abs(el.y - snapTop) <= Math.abs(el.y - snapBottom);
            return { ...el, x: 12, y: toTop ? snapTop : snapBottom, w: rect.width - 24 };
          }
          if (el.id === 'settings') {
            const middleTop = rect.height * 0.4;
            const middleBottom = rect.height * 0.6;
            let y = el.y;
            if (y > middleTop && y < middleBottom) y = middleTop - el.h - 6;
            return { ...el, x: clamp(el.x, 8, rect.width - el.w - 8), y: clamp(y, 8, rect.height - el.h - 8) };
          }
          return { ...el, x: clamp(el.x, 8, rect.width - el.w - 8), y: clamp(el.y, 8, rect.height - el.h - 8) };
        }),
      );
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const buildPlan = async () => {
    setMorphOn(true);
    let mi = 0;
    const iv = setInterval(() => {
      mi = (mi + 1) % MORPH_MSGS.length;
      setMorphMsg(MORPH_MSGS[mi]);
    }, 800);
    await sleep(1500);
    clearInterval(iv);
    setMorphOn(false);
    setStage(4);
  };

  const moveLinearAlgebraToRemember = () => {
    setTodoToday((prev) => prev.filter((x) => x !== 'Study linear algebra'));
    setRememberLater((prev) => [...prev, 'Study linear algebra']);
    setRescheduleSuggestion('Suggested: move Linear Algebra to tomorrow at 10:20 AM after a lighter warm-up block.');
  };

  return (
    <>
      <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg>
      <div id="app">
        {stage === 1 && (
          <div id="s1" className="onboarding-stage">
            <div className="stage-header">
              <h2>Stage 1 · Block Puzzle (5 × 10)</h2>
              <p>
                Scenario: <em>If you had to organize your desk in the most efficient way for today&apos;s study, how would you do it?</em>
              </p>
            </div>
            <div id="desk" ref={deskRef} className="grid-desk">
              {items.length === 0 && <div className="empty-hint"><span className="hint-txt">Start by placing a block.<br />Try stretching Navbar to 5×1.</span></div>}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="item"
                  style={{ left: item.x, top: item.y, width: item.w, minHeight: item.h, zIndex: item.z, backgroundColor: item.bg }}
                  onPointerDown={(e) => handleStage1DragOrResize(item.id, 'drag', e)}
                >
                  <div className="item-head"><span className="item-lbl">{item.label}</span><button className="item-x" onClick={(e) => { e.stopPropagation(); setItems((prev) => prev.filter((x) => x.id !== item.id)); }}>×</button></div>
                  <div className="item-body" onPointerDown={(e) => e.stopPropagation()}>
                    <textarea className="base-ta" placeholder="Why this placement?" value={item.notes} onChange={(e) => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, notes: e.target.value } : x)))} />
                  </div>
                  <div className="rz" onPointerDown={(e) => { e.stopPropagation(); handleStage1DragOrResize(item.id, 'resize', e); }} />
                </div>
              ))}
            </div>
            <div className="cta"><div className="cta-lbl">{items.length} block{items.length === 1 ? '' : 's'} placed</div><button className="cta-btn" disabled={!stage1Done} onClick={() => setStage(2)}>Next: Planner Style →</button></div>
            <div id="tray"><div className="tray-head">Blocks</div><div className="tray-row"><div className="chip chip-create" onClick={() => setModalOpen(true)}><div className="chip-create-icon">+</div><div className="chip-nm">Create</div></div>{chips.map((chip) => <div className="chip" key={chip.id} onClick={() => addItem(chip)}><div className="chip-swatch" style={{ background: chip.bg }} /><div className="chip-nm">{chip.label}</div></div>)}</div></div>
          </div>
        )}

        {stage === 2 && (
          <div id="s2" className="onboarding-stage on">
            <div id="archetype-panel" data-letter={plannerType[0].toUpperCase()}>
              <div className="arch-eyebrow">Stage 2 · Planner Preference</div>
              <div className="arch-name">{ARCHETYPES[plannerType].title}</div>
              <div className="arch-desc">{ARCHETYPES[plannerType].desc}</div>
              <div className="arch-traits"><span className="trait-pill">{detectArchetype}</span><span className="trait-pill">Mobile-first</span><span className="trait-pill">Adaptive</span></div>
            </div>
            <div className="planner-carousel">
              {plannerKeys.map((k, idx) => (
                <button key={k} className={`planner-card ${idx === plannerIndex ? 'active' : ''}`} onClick={() => { setPlannerIndex(idx); setGamified(k === 'gamified'); }}>
                  <h3>{ARCHETYPES[k].title}</h3>
                  <p>{ARCHETYPES[k].desc}</p>
                </button>
              ))}
            </div>
            <div className="s2-footer"><button className="s2-btn" onClick={() => setStage(1)}>← Back</button><button className="s2-btn" onClick={() => setPlannerIndex((x) => (x + plannerKeys.length - 1) % plannerKeys.length)}>Prev</button><button className="s2-btn" onClick={() => setPlannerIndex((x) => (x + 1) % plannerKeys.length)}>Next</button><button className="s2-btn primary" onClick={goToStage3}>Stage 3 →</button></div>
          </div>
        )}

        {stage === 3 && (
          <div id="s2" className="onboarding-stage on">
            <div id="archetype-panel" data-letter="3">
              <div className="arch-eyebrow">Stage 3 · Consolidation</div>
              <div className="arch-name">Snap your mobile UI</div>
              <div className="arch-desc">Navbar can only snap to top or bottom. Settings can snap anywhere except the middle band. Journal is optional and recommended.</div>
            </div>
            <div id="ui-stage-canvas">
              <div className="middle-ban">No-snap middle zone for Settings</div>
              {uiLayout.map((el) => (
                <div key={el.id} className={`ui-element ${el.id}`} style={{ left: el.x, top: el.y, width: el.w, height: el.h }} onPointerDown={(e) => handleUILayoutDrag(el.id, e)}>
                  {el.label}
                </div>
              ))}
            </div>
            <div className="s2-footer"><button className="s2-btn" onClick={() => setStage(2)}>← Back</button><button className="s2-btn primary" onClick={buildPlan}>Generate Plan →</button></div>
          </div>
        )}

        {stage === 4 && (
          <div id="s2" className="onboarding-stage on">
            <div id="archetype-panel" data-letter="P">
              <div className="arch-eyebrow">Plan Generated</div>
              <div className="arch-name">{ARCHETYPES[plannerType].title}</div>
              <div className="arch-desc">Upload PDFs, images, or text to let AI extract study data and update this plan. Gamification is optional.</div>
              <div className="arch-traits"><span className="trait-pill">Gamified: {gamified ? 'On' : 'Off'}</span><span className="trait-pill">Journal-aware</span><span className="trait-pill">Reschedulable</span></div>
            </div>

            <div className="upload-row">
              <input type="file" accept=".pdf,image/*,.txt" multiple />
              <button className="s2-btn primary">Process into plan</button>
            </div>

            <div className="day-tabs" role="tablist">{fallbackPlan.days.map((d, i) => <button key={d.day} className={`day-tab ${i === planDay ? 'active' : ''}`} onClick={() => setPlanDay(i)}><div className="day-tab-n">{d.day.replace('Day ', '')}</div><div className="day-tab-lbl">{d.date}</div></button>)}</div>
            <div id="planCanvases" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{fallbackPlan.days.map((day, di) => <div key={day.day} className={`plan-canvas ${di === planDay ? 'active' : ''}`}><div className="day-theme-note">{day.theme}</div>{day.sessions.map((sess, si) => <div key={`${sess.time}-${si}`} className="plan-row"><div className="plan-time">{sess.time?.replace(/\s?(AM|PM)/, '')}</div><div className={`plan-block ${sess.type}`}><div className="plan-block-task">{gamified && sess.type === 'focus' ? `Lvl ${si + 1}: ${sess.task}` : sess.task}</div><div className="plan-block-meta"><span className={`plan-badge ${sess.type}`}>{sess.type}</span><span className="plan-block-dur">{sess.duration}</span></div></div></div>)}<div className="insight-block"><div className="insight-lbl">💡 For you specifically</div><div className="insight-txt">{fallbackPlan.insight}</div></div></div>)}</div>

            <div className="planner-ops">
              <div className="ops-col">
                <h4>Today To-do</h4>
                {todoToday.map((task) => <button key={task} className="todo-pill">{task}</button>)}
                <button className="s2-btn" onClick={moveLinearAlgebraToRemember}>Move “Study linear algebra” to Remember</button>
              </div>
              <div className="ops-col">
                <h4>Remember Later</h4>
                {rememberLater.length === 0 ? <p className="muted">Nothing moved yet.</p> : rememberLater.map((task) => <div key={task} className="todo-pill remember">{task}</div>)}
                {rescheduleSuggestion && <p className="suggest">{rescheduleSuggestion}</p>}
              </div>
              <div className="ops-col">
                <h4>Journal (Optional)</h4>
                <textarea className="base-ta" value={journal} onChange={(e) => setJournal(e.target.value)} />
                <p className="muted">Journal context helps AI suggest gentler or more intense scheduling.</p>
              </div>
            </div>

            <div className="s2-footer"><button className="s2-btn" onClick={() => setStage(1)}>Redesign Onboarding</button><button className="s2-btn primary">Use this plan →</button></div>
          </div>
        )}

        <div id="custom-modal" role="dialog" aria-modal="true" aria-label="Design custom block" className={`${modalOpen ? 'visible open' : ''}`} onClick={(e) => e.target.id === 'custom-modal' && setModalOpen(false)}>
          <div className="modal-sheet"><div className="modal-handle"></div><h2 className="modal-title">Design <em>your block</em></h2>
            <div className="field"><label className="field-lbl">Block name</label><input type="text" className="field-input" value={customName} onChange={(e) => setCustomName(e.target.value)} /></div>
            <div className="field"><label className="field-lbl">Color</label><div className="swatch-row">{COLOR_SWATCHES.map((s) => <div key={s} className={`swatch ${customColor === s ? 'selected' : ''}`} style={{ backgroundColor: s }} onClick={() => setCustomColor(s)} />)}</div></div>
            <div className="modal-actions"><button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-create" onClick={() => {
              const chip = { id: `custom-${Date.now()}`, type: 'notes', label: customName.trim() || 'Custom Block', bg: customColor };
              setChips((prev) => [...prev, chip]);
              setModalOpen(false);
              setCustomName('');
              addItem(chip);
            }}>Create & Place</button></div>
          </div>
        </div>

        <div id="morph" aria-live="polite" className={morphOn ? 'on' : ''}><div className="morph-dots"><div className="morph-dot"></div><div className="morph-dot"></div><div className="morph-dot"></div></div><div className="morph-msg">{morphMsg}</div></div>
      </div>
    </>
  );
}
