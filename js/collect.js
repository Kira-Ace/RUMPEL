// collect
function collectDeskData() {
  return Array.from(document.querySelectorAll('.item')).map(el => {
    const type  = el.dataset.type;
    const label = el.querySelector('.item-lbl')?.innerText || '';
    const obj   = { type, label };

    const ta = el.querySelector('textarea');
    if (ta?.value?.trim()) obj.notes = ta.value.trim();

    const inp = el.querySelector('input.base-inp');
    if (inp?.value?.trim()) obj.objective = inp.value.trim();

    const tasks = [];
    el.querySelectorAll('.todo-inp').forEach(i => {
      if (i.value?.trim()) tasks.push(i.value.trim());
    });
    if (tasks.length) obj.tasks = tasks;

    // position
    obj.position = {
      x: parseFloat(el.style.left) / (document.getElementById('desk').clientWidth  || 1),
      y: parseFloat(el.style.top)  / (document.getElementById('desk').clientHeight || 1),
    };

    return obj;
  });
}

// detect
function detectArchetype(blocks) {
  if (!blocks.length) return 'minimalist';

  const counts = { freetext: 0, checklist: 0, display: 0, focus: 0, custom: 0 };
  blocks.forEach(b => {
    if (b.type in counts) counts[b.type]++;
    // custom
    if (!b.label.startsWith('Block')) counts.custom++;
  });

  const total = blocks.length;

  // decide
  if (total <= 1)                            return 'minimalist';
  if (counts.checklist >= total * 0.5)       return 'systematizer';
  if (counts.freetext  >= total * 0.5)       return 'essayist';
  if (counts.custom    >= Math.ceil(total / 2)) return 'sculptor';
  return 'hybrid';
}

// prompt
function buildPrompt(blocks) {
  const archetype = detectArchetype(blocks);
  const arch = ARCHETYPES[archetype];
  const blockDesc = blocks.map(b => {
    let s = `- [${b.type}] "${b.label}"`;
    if (b.objective) s += ` → focus: "${b.objective}"`;
    if (b.notes)     s += ` → notes: "${b.notes}"`;
    if (b.tasks?.length) s += ` → tasks: ${b.tasks.join(', ')}`;
    return s;
  }).join('\n');

  return `You are generating a personalized CS midterm study plan.

Student archetype: ${arch.name}
Archetype traits: ${arch.traits.join(', ')}

Their desk layout:
${blockDesc}

Create a 3-day study plan tailored to this archetype. Return ONLY valid JSON, no markdown:
{
  "days": [
    {
      "day": "Day 1",
      "date": "Today",
      "theme": "short descriptive theme",
      "sessions": [
        { "time": "9:00 AM", "duration": "25 min", "task": "specific CS midterm task", "type": "focus" }
      ]
    }
  ],
  "insight": "one short personal insight about how this archetype studies best (max 2 sentences)"
}

Rules:
- Session types: focus, break, review
- 4-5 sessions per day, mix types appropriately
- Tasks must be CS-specific (algorithms, data structures, etc.)
- Insight must reference their archetype traits specifically
- Adapt session lengths to archetype: systematizer = shorter focused blocks; essayist = longer sessions; hybrid = varied`;
}
