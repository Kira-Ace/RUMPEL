// presets
const PRESET_CHIPS = [
  { type: 'sidebar',  label: 'Navigation',  color: '#F2EFE9', bcolor: '#1A1C1A', icon: '🧭' },
  { type: 'header',   label: 'Status Bar',  color: '#FFF5C2', bcolor: '#D9C068', icon: '🔥' },
  { type: 'path',     label: 'Core Path',   color: '#EAE0F8', bcolor: '#B098CE', icon: '🗺️' },
  { type: 'panel',    label: 'Side Panel',  color: '#FFE0DF', bcolor: '#D9A8A6', icon: '📋' },
  { type: 'timer',    label: 'Focus Arch',  color: '#D8EDDA', bcolor: '#8EC490', icon: '⏱' }
];

const BLOCK_SIZES = {
  sidebar: [80, 280],   // tall
  header:  [320, 70],   // wide
  path:    [200, 300],  // big
  panel:   [160, 220],  // chunk
  timer:   [140, 180],  // small
};

// colors
const COLOR_SWATCHES = [
  { id: 'swatch-paper',       hex: '#F2EFE9', label: 'Paper'       },
  { id: 'swatch-highlight',   hex: '#E8ED6A', label: 'Highlight'   },
  { id: 'swatch-sage',        hex: '#B8D4C8', label: 'Sage'        },
  { id: 'swatch-slate',       hex: '#C8D8E8', label: 'Slate'       },
  { id: 'swatch-terracotta',  hex: '#E8C0B0', label: 'Terra'       },
  { id: 'swatch-lavender',    hex: '#D8C8E8', label: 'Lavender'    },
];

// types
const ARCHETYPES = {
  systematizer: {
    name:   'The Systematizer',
    italic: 'Systematizer',
    letter: 'S',
    desc:   'You think in lists. Your mind works best when tasks are broken down, sequenced, and checkable. Structure isn\'t a constraint for you — it\'s oxygen.',
    traits: ['Checklist-driven', 'Sequential', 'Completion-oriented'],
  },
  essayist: {
    name:   'The Essayist',
    italic: 'Essayist',
    letter: 'E',
    desc:   'You process by writing. Blank pages don\'t intimidate you — they invite you. Your notes are where your thinking actually happens, not just gets recorded.',
    traits: ['Note-heavy', 'Reflective', 'Writing-led'],
  },
  sculptor: {
    name:   'The Sculptor',
    italic: 'Sculptor',
    letter: 'K',
    desc:   'You shape your workspace deliberately. Each block has a purpose, a place. You\'re not just studying — you\'re engineering an environment for focus.',
    traits: ['Spatial thinker', 'Custom-system builder', 'Detail-oriented'],
  },
  hybrid: {
    name:   'The Hybrid',
    italic: 'Hybrid',
    letter: 'H',
    desc:   'You adapt. You\'re not married to one system — you pull from wherever works. This flexibility is a strength, as long as the pieces stay connected.',
    traits: ['Adaptive', 'Multi-modal', 'Context-sensitive'],
  },
  minimalist: {
    name:   'The Minimalist',
    italic: 'Minimalist',
    letter: 'M',
    desc:   'You resist clutter. One thing at a time, clearly. Your desk being sparse isn\'t laziness — it\'s a signal that you know what you need and aren\'t distracted by the rest.',
    traits: ['Focused', 'Low-friction', 'Intentional'],
  },
};

// msgs
const MORPH_MSGS = [
  'Reading your layout...',
  'Mapping your habits...',
  'Calibrating your system...',
  'Almost...',
];
