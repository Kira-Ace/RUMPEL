// Date constants
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
export const TODAY  = { y:2026, m:3, d:1 }; // April 1 2026 (month 0-indexed)

// Tasks
export const initialTasks = {
  "2026-04-01":  [{id:1,title:"Physics Review",time:"12:30",desc:"Focus on thermodynamics and fluid dynamics.",tag:"Science"},{id:2,title:"Essay Draft",time:"15:00",desc:"Finalizing the introduction for the lit review.",tag:"English",accent:true}],
  "2026-03-31": [{id:3,title:"Math Problem Set",time:"18:00",desc:"Linear Algebra III — chapter exercises.",tag:"Math"}],
  "2026-03-30": [{id:5,title:"Chemistry Lab",time:"09:00",desc:"Titration results and analysis.",tag:"Science"},{id:6,title:"Vocab Quiz Prep",time:"16:00",desc:"Unit 5 — 30 words.",tag:"English"},{id:7,title:"Group Meeting",time:"18:30",desc:"Project sync.",tag:"Other"}],
  "2026-04-07":  [{id:8,title:"History Essay",time:"10:00",desc:"French Revolution causes and effects.",tag:"History"}],
  "2026-04-14": [{id:9,title:"Mid-term Review",time:"09:00",desc:"Chapters 1–8 comprehensive review.",tag:"Science"},{id:10,title:"Library Session",time:"14:00",desc:"Research for comparative lit essay.",tag:"English"}],
  "2026-05-05":  [{id:11,title:"Calc Problem Set",time:"11:00",desc:"Differential equations, problem set 3.",tag:"Math"}],
};

// Notes
export const NOTES = [
  {id:1,title:"Physics Formulas",preview:"F = ma, v² = u² + 2as, s = ut + ½at²...",date:"Apr 1",featured:true},
  {id:2,title:"Essay Outline",preview:"Thesis: The industrial revolution fundamentally altered...",date:"Mar 31"},
  {id:3,title:"Vocab List",preview:"Ephemeral, ubiquitous, pernicious...",date:"Mar 30"},
  {id:4,title:"Study Schedule",preview:"Mon–Wed: Science. Thu–Fri: Humanities.",date:"Mar 29"},
  {id:5,title:"Math Shortcuts",preview:"Integration tricks & common integrals",date:"Mar 28"},
];
