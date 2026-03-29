// render
let _activeDayIndex = 0;
let _planData = null;

// start
async function renderStage2(blocks) {
  const s2 = document.getElementById('s2');
  s2.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => s2.classList.add('on')));

  const archetype = detectArchetype(blocks);
  _renderArchetypePanel(archetype);

  // loading
  _renderLoadingTabs();

  // fetch
  const plan = await _fetchPlan(blocks);
  _planData  = plan;

  _renderDayTabs(plan.days);
  _renderAllCanvases(plan.days, plan.insight);
  _switchDay(0);
}

// panel
function _renderArchetypePanel(archetypeKey) {
  const arch  = ARCHETYPES[archetypeKey];
  const panel = document.getElementById('archetype-panel');
  panel.setAttribute('data-letter', arch.letter);
  panel.innerHTML = `
    <div class="arch-eyebrow">Study Profile</div>
    <div class="arch-name">${arch.name.replace(arch.italic, `<em>${arch.italic}</em>`)}</div>
    <div class="arch-desc">${arch.desc}</div>
    <div class="arch-traits">
      ${arch.traits.map(t => `<span class="trait-pill">${t}</span>`).join('')}
    </div>`;
}

// skeleton
function _renderLoadingTabs() {
  const tabBar   = document.getElementById('dayTabBar');
  const canvases = document.getElementById('planCanvases');

  tabBar.innerHTML = `
    <div class="day-tab active">
      <div class="day-tab-n">—</div>
      <div class="day-tab-lbl">Loading...</div>
    </div>`;

  canvases.innerHTML = `
    <div class="plan-canvas active" style="align-items:center;justify-content:center;opacity:0.5">
      <span style="font-family:var(--font-hand);font-size:20px;color:var(--ink-faint)">Generating your plan...</span>
    </div>`;
}

// tabs
function _renderDayTabs(days) {
  const tabBar = document.getElementById('dayTabBar');
  tabBar.innerHTML = '';
  days.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className = 'day-tab' + (i === 0 ? ' active' : '');
    btn.dataset.day = i;
    btn.innerHTML = `
      <div class="day-tab-n">${_dayNumber(day.day)}</div>
      <div class="day-tab-lbl">${day.date || 'Day ' + (i+1)}</div>`;
    btn.addEventListener('click', () => _switchDay(i));
    tabBar.appendChild(btn);
  });
}

// canvas
function _renderAllCanvases(days, insight) {
  const canvases = document.getElementById('planCanvases');
  canvases.innerHTML = '';

  days.forEach((day, di) => {
    const canvas = document.createElement('div');
    canvas.className = 'plan-canvas';
    canvas.dataset.day = di;

    // theme
    const themeEl = document.createElement('div');
    themeEl.className = 'day-theme-note';
    themeEl.textContent = day.theme;
    canvas.appendChild(themeEl);

    // blocks
    (day.sessions || []).forEach((sess, si) => {
      const row = document.createElement('div');
      row.className = 'plan-row';
      row.style.animationDelay = `${si * 0.06}s`;

      row.innerHTML = `
        <div class="plan-time">${_formatTime(sess.time)}</div>
        <div class="plan-block ${sess.type}">
          <div class="plan-block-task">${sess.task}</div>
          <div class="plan-block-meta">
            <span class="plan-badge ${sess.type}">${sess.type}</span>
            <span class="plan-block-dur">${sess.duration}</span>
          </div>
        </div>`;
      canvas.appendChild(row);
    });

    // Insight sticky on last day
    if (di === days.length - 1 && insight) {
      const note = document.createElement('div');
      note.className = 'insight-block';
      note.innerHTML = `
        <div class="insight-lbl">💡 For you specifically</div>
        <div class="insight-txt">${insight}</div>`;
      canvas.appendChild(note);
    }

    canvases.appendChild(canvas);
  });
}

function _switchDay(idx) {
  _activeDayIndex = idx;

  document.querySelectorAll('.day-tab').forEach((t, i) =>
    t.classList.toggle('active', i === idx));

  document.querySelectorAll('.plan-canvas').forEach((c, i) =>
    c.classList.toggle('active', i === idx));
}

// ── API CALL ─────────────────────────────────────────────
async function _fetchPlan(blocks) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: buildPrompt(blocks) }],
      }),
    });

    const data = await res.json();
    const raw  = (data.content || []).map(b => b.text || '').join('');
    const m    = raw.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch (_) { /* fall through to fallback */ }

  return _fallbackPlan(blocks);
}

// ── FALLBACK ─────────────────────────────────────────────
function _fallbackPlan(blocks) {
  const archKey = detectArchetype(blocks);

  const plans = {
    systematizer: {
      insight: 'Your checklist instinct is your edge. Break each algorithm into sub-steps before you start coding. Your brain will feel at home.',
      days: [
        { day:'Day 1', date:'Today',    theme:'Map the territory',     sessions:[
          { time:'9:00 AM',  duration:'20 min', task:'List every topic on the exam, mark confidence levels', type:'focus' },
          { time:'9:25 AM',  duration:'5 min',  task:'Break',                                               type:'break' },
          { time:'9:30 AM',  duration:'30 min', task:'Linked lists: trace through insert, delete, search',  type:'focus' },
          { time:'10:05 AM', duration:'15 min', task:'Tick off mastered sub-topics',                        type:'review'},
        ]},
        { day:'Day 2', date:'Tomorrow', theme:'Execute the checklist',  sessions:[
          { time:'9:00 AM',  duration:'30 min', task:'Sorting algorithms: bubble, merge, quick — each as a checklist', type:'focus' },
          { time:'9:35 AM',  duration:'10 min', task:'Walk / rest',                                                    type:'break' },
          { time:'9:45 AM',  duration:'25 min', task:'Timed practice: write code from checklist memory',               type:'focus' },
          { time:'10:15 AM', duration:'10 min', task:'Update your confidence list',                                    type:'review'},
        ]},
        { day:'Day 3', date:'Exam Day', theme:'Verify & ship',          sessions:[
          { time:'8:00 AM', duration:'20 min', task:'Final checklist review: flag anything still shaky',    type:'review'},
          { time:'8:25 AM', duration:'10 min', task:'Easy practice reps on flagged items',                  type:'focus' },
          { time:'8:40 AM', duration:'——',     task:'Eat, rest, arrive early',                              type:'break' },
        ]},
      ],
    },
    essayist: {
      insight: 'Write out your understanding of each concept in plain language before you code it. If you can explain it to yourself in sentences, you own it.',
      days: [
        { day:'Day 1', date:'Today',    theme:'Write to understand', sessions:[
          { time:'9:00 AM',  duration:'45 min', task:'Rewrite lecture notes in your own words — trees, graphs, complexity', type:'focus' },
          { time:'9:50 AM',  duration:'10 min', task:'Break',                                                               type:'break' },
          { time:'10:00 AM', duration:'30 min', task:'Write a plain-language explanation of Big-O for each algorithm',      type:'focus' },
          { time:'10:35 AM', duration:'15 min', task:'Review written summaries for gaps',                                   type:'review'},
        ]},
        { day:'Day 2', date:'Tomorrow', theme:'Translate to code',   sessions:[
          { time:'9:00 AM',  duration:'40 min', task:'For each written summary, implement the code from scratch',           type:'focus' },
          { time:'9:45 AM',  duration:'10 min', task:'Walk',                                                               type:'break' },
          { time:'9:55 AM',  duration:'30 min', task:'Past exam problems — annotate your approach in writing first',        type:'review'},
        ]},
        { day:'Day 3', date:'Exam Day', theme:'Final pass',          sessions:[
          { time:'8:00 AM', duration:'25 min', task:'Re-read your own explanations, especially weak areas',                type:'review'},
          { time:'8:30 AM', duration:'——',     task:'Light breakfast, then go',                                            type:'break' },
        ]},
      ],
    },
  };

  return plans[archKey] || plans.essayist;
}

// ── UTILS ────────────────────────────────────────────────
function _dayNumber(dayStr) {
  const m = (dayStr || '').match(/\d+/);
  return m ? m[0] : '—';
}

function _formatTime(t) {
  if (!t) return '';
  // Compact: "9:00 AM" → "9:00"
  return t.replace(/\s?(AM|PM)/, '');
}
