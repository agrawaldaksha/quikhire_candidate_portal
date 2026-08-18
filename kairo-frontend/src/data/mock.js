// Mock content for the Kairo prototype.

export const COMPANY_COLORS = ['#2f6df6', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#1d4ed8']

export const TESTIMONIALS = [
  {
    name: 'Yasmine A.', role: 'Product Designer → hired at Loop', initials: 'YA', color: '#2f6df6',
    text: 'Kai actually felt like it was on my side. It remembered every detail, never pushed roles I didn’t want, and got me a warm intro that turned into my dream job.',
  },
  {
    name: 'Gareth L.', role: 'Staff Engineer', initials: 'GL', color: '#0ea5e9',
    text: 'A league above any recruiter I’ve worked with. No agenda, no volume spam — just thoughtful matches and a negotiation plan that got me +$22k.',
  },
  {
    name: 'Chiara Q.', role: 'Data Scientist → hired at Fyxer', initials: 'CQ', color: '#14b8a6',
    text: 'Feels like a talent partner available 24/7, not a job board. It understood my background and long-term goals, then filtered opportunities around them.',
  },
  {
    name: 'Marcus W.', role: 'Engineering Manager', initials: 'MW', color: '#f59e0b',
    text: 'The screening chat was the best part — it asked sharp, adaptive questions and built my profile in ten minutes. The mock interview feedback was scarily good.',
  },
  {
    name: 'Devanshi R.', role: 'PM → hired at Marloo', initials: 'DR', color: '#ef4444',
    text: 'Got a direct intro to the CEO, skipped the whole application black hole, and had an offer in two weeks. This is how hiring should work.',
  },
  {
    name: 'Celik N.', role: 'Frontend Engineer', initials: 'CN', color: '#1d4ed8',
    text: 'The conversation is natural, quick, and surprisingly human. It picked up the right signals and gave spot-on recommendations. Genuinely powerful.',
  },
]

export const STEPS = [
  { no: 'Step 01', title: 'Tell Kai what you want', body: 'A 10-minute adaptive chat. Kai asks the right questions to understand what “great” looks like for you.' },
  { no: 'Step 02', title: 'Kai searches while you sleep', body: '12M+ roles scanned daily — not keyword matches, but genuine step-ups you’d never surface yourself.' },
  { no: 'Step 03', title: 'You approve the matches', body: 'Say yes or no. Kai gets sharper with every response and keeps refining until it’s a real fit.' },
  { no: 'Step 04', title: 'Kai preps you to win', body: 'Mock interviews, salary benchmarks and CV feedback — tailored to you and the exact role.' },
  { no: 'Step 05', title: 'Warm intro, not an application', body: 'When there’s a match in QuikHire’s network, Kai introduces you straight to the hiring manager.' },
]

export const DASH_MATCHES = [
  { co: 'Loop', color: '#2f6df6', title: 'Senior Product Designer', sub: 'Design Systems · Remote (EU) · €85–105k', score: 96 },
  { co: 'Fyxer', color: '#0ea5e9', title: 'Founding Design Engineer', sub: 'AI · London / Hybrid · £90–120k', score: 93 },
  { co: 'Marloo', color: '#14b8a6', title: 'Lead UX Designer', sub: 'Fintech · Remote · $110–140k', score: 90 },
  { co: 'Vanta', color: '#f59e0b', title: 'Product Designer II', sub: 'Security · SF / Hybrid · $130–160k', score: 88 },
]

export const DASH_INTROS = [
  { who: 'Marcus, Head of Design at Loop', role: 'Senior Product Designer', note: 'Loved your work on design systems and wants to chat this week.', color: '#2f6df6' },
  { who: 'Aisha, CTO at Fyxer', role: 'Founding Design Engineer', note: 'Impressed by your 0→1 shipping. 2-day process, skips applications.', color: '#0ea5e9' },
]

// ---- New jobs feed (Jack&Jill-style) ----
export const NEW_JOBS = [
  { id: 'j1', co: 'Loop', color: '#2f6df6', title: 'Senior Product Designer', loc: 'Remote (EU)', comp: '€85–105k', tags: ['Design Systems', 'Figma', 'B2B'], score: 96, posted: '2h ago', why: 'Matches your design-systems depth and remote preference.' },
  { id: 'j2', co: 'Fyxer', color: '#0ea5e9', title: 'Founding Design Engineer', loc: 'London / Hybrid', comp: '£90–120k', tags: ['0→1', 'React', 'AI'], score: 93, posted: '5h ago', why: 'Early-stage 0→1 role — you shine at shipping fast.' },
  { id: 'j3', co: 'Marloo', color: '#14b8a6', title: 'Lead UX Designer', loc: 'Remote', comp: '$110–140k', tags: ['Fintech', 'Leadership'], score: 90, posted: '1d ago', why: 'Leadership scope with the fintech domain you asked for.' },
  { id: 'j4', co: 'Vanta', color: '#f59e0b', title: 'Product Designer II', loc: 'SF / Hybrid', comp: '$130–160k', tags: ['Security', 'Growth'], score: 88, posted: '1d ago', why: 'Strong comp band and a growth-stage security product.' },
  { id: 'j5', co: 'Ridge', color: '#7c3aed', title: 'Design Lead', loc: 'Remote (US)', comp: '$140–170k', tags: ['Design Ops', 'Mentoring'], score: 85, posted: '2d ago', why: 'Mentoring-heavy role aligned with your priorities.' },
]

// ---- Coaching hub (tabbed) ----
export const COACHING = {
  General: [
    { t: 'Career story workshop', d: 'Shape a crisp narrative that ties your roles into one clear arc.', mins: 20, ic: '🎯' },
    { t: 'Strengths & gaps review', d: 'Kai maps your strongest signals and where to invest next.', mins: 15, ic: '📊' },
    { t: 'Weekly search plan', d: 'A focused plan: who to talk to, what to apply for, this week.', mins: 10, ic: '🗓' },
  ],
  Product: [
    { t: 'Product sense drill', d: 'Practice product-thinking prompts with structured feedback.', mins: 25, ic: '🧩' },
    { t: 'Metrics & tradeoffs', d: 'Sharpen how you reason about metrics, north stars and tradeoffs.', mins: 20, ic: '📈' },
    { t: 'PM case walkthrough', d: 'Work a realistic case end-to-end with Kai coaching you.', mins: 30, ic: '🗂' },
  ],
  Salary: [
    { t: 'Benchmark your range', d: 'See a live P50–P90 band for your role, level and market.', mins: 10, ic: '💰' },
    { t: 'Negotiation script', d: 'A word-for-word plan for the comp conversation.', mins: 15, ic: '🤝' },
    { t: 'Competing-offer play', d: 'How to handle multiple offers without burning bridges.', mins: 15, ic: '♟' },
  ],
  Consulting: [
    { t: 'Case interview basics', d: 'Frameworks, structuring and the MECE habit — fast.', mins: 25, ic: '📐' },
    { t: 'Market sizing reps', d: 'Estimation drills with clean, defensible logic.', mins: 20, ic: '🔢' },
    { t: 'Fit / PEI stories', d: 'Build leadership stories that land in consulting interviews.', mins: 20, ic: '💬' },
  ],
  'Mock interview': [
    { t: 'Behavioural mock', d: 'A full behavioural round with tailored, honest feedback.', mins: 30, ic: '🎤' },
    { t: 'Technical mock', d: 'Role-specific technical questions and a scorecard.', mins: 40, ic: '⌨' },
    { t: 'Rapid-fire round', d: 'Ten quick prompts to warm up before the real thing.', mins: 15, ic: '⚡' },
  ],
  Custom: [
    { t: 'Bring your own goal', d: 'Tell Kai what you want to work on and it builds a session.', mins: 20, ic: '✨' },
  ],
}

// ---- Learning: video tutorials mapped to skills/topics ----
// Each key is a lowercased skill or topic; value is an array of tutorials.
// `file` is served from kairo-frontend/public/learning/<file> (or swap for a full URL).
// Populate this from the HeyGen "heygen videoss" folder (fall back to the parent Ride folder).
// kind: 'One-shot' (full walkthrough) | 'Topic' (focused explainer) | 'Deep-dive'.
export const LEARNING_VIDEOS = {
  'java': [{ title: 'Java for Beginners', file: 'java_for_beginners.mp4', len: '0:26', kind: 'One-shot' }, { title: 'Java Basics: Strings & Logic', file: 'java_basics_strings_logic.mp4', len: '0:58', kind: 'Topic' }, { title: 'Java Data Types', file: 'java_data_types.mp4', len: '0:18', kind: 'Topic' }, { title: 'Java Operators Explained', file: 'java_operators_explained.mp4', len: '1:09', kind: 'Topic' }, { title: 'Java Switch & Break', file: 'java_switch_break.mp4', len: '1:02', kind: 'Topic' }, { title: 'Static Methods in Java', file: 'static_methods_in_java.mp4', len: '0:46', kind: 'Topic' }, { title: 'Polymorphism in Java', file: 'what_is_polymorphism_in_java.mp4', len: '0:23', kind: 'Topic' }, { title: 'Multithreading in Java', file: 'what_is_a_multi_threading_in_java.mp4', len: '0:14', kind: 'Topic' }, { title: 'Java History', file: 'java_history.mp4', len: '1:12', kind: 'Topic' }],
  'core java': [{ title: 'Java for Beginners', file: 'java_for_beginners.mp4', len: '0:26', kind: 'One-shot' }, { title: 'Java Basics: Strings & Logic', file: 'java_basics_strings_logic.mp4', len: '0:58', kind: 'Topic' }, { title: 'Java Data Types', file: 'java_data_types.mp4', len: '0:18', kind: 'Topic' }, { title: 'Java Operators Explained', file: 'java_operators_explained.mp4', len: '1:09', kind: 'Topic' }, { title: 'Java Switch & Break', file: 'java_switch_break.mp4', len: '1:02', kind: 'Topic' }, { title: 'Static Methods in Java', file: 'static_methods_in_java.mp4', len: '0:46', kind: 'Topic' }, { title: 'Polymorphism in Java', file: 'what_is_polymorphism_in_java.mp4', len: '0:23', kind: 'Topic' }, { title: 'Multithreading in Java', file: 'what_is_a_multi_threading_in_java.mp4', len: '0:14', kind: 'Topic' }, { title: 'Java History', file: 'java_history.mp4', len: '1:12', kind: 'Topic' }],
  'j2ee': [{ title: 'Java for Beginners', file: 'java_for_beginners.mp4', len: '0:26', kind: 'One-shot' }, { title: 'Java Basics: Strings & Logic', file: 'java_basics_strings_logic.mp4', len: '0:58', kind: 'Topic' }, { title: 'Java Data Types', file: 'java_data_types.mp4', len: '0:18', kind: 'Topic' }, { title: 'Java Operators Explained', file: 'java_operators_explained.mp4', len: '1:09', kind: 'Topic' }, { title: 'Java Switch & Break', file: 'java_switch_break.mp4', len: '1:02', kind: 'Topic' }, { title: 'Static Methods in Java', file: 'static_methods_in_java.mp4', len: '0:46', kind: 'Topic' }, { title: 'Polymorphism in Java', file: 'what_is_polymorphism_in_java.mp4', len: '0:23', kind: 'Topic' }, { title: 'Multithreading in Java', file: 'what_is_a_multi_threading_in_java.mp4', len: '0:14', kind: 'Topic' }, { title: 'Java History', file: 'java_history.mp4', len: '1:12', kind: 'Topic' }],
  'spring boot': [{ title: 'Java + Spring Boot', file: 'java_springboot.mp4', len: '1:18', kind: 'One-shot' }],
  'springboot': [{ title: 'Java + Spring Boot', file: 'java_springboot.mp4', len: '1:18', kind: 'One-shot' }],
  'spring': [{ title: 'Java + Spring Boot', file: 'java_springboot.mp4', len: '1:18', kind: 'One-shot' }],
  'python': [{ title: 'Python Basics Unlocked', file: 'python_basics_unlocked.mp4', len: '1:20', kind: 'One-shot' }, { title: 'Python Automation', file: 'python_automation.mp4', len: '1:56', kind: 'Topic' }],
  'oop': [{ title: 'Intro to OOP: Thinking in Objects', file: 'introduction_to_oopm_thinking_in_objects.mp4', len: '0:52', kind: 'One-shot' }, { title: 'Polymorphism in Java', file: 'what_is_polymorphism_in_java.mp4', len: '0:23', kind: 'Topic' }],
  'oops': [{ title: 'Intro to OOP: Thinking in Objects', file: 'introduction_to_oopm_thinking_in_objects.mp4', len: '0:52', kind: 'One-shot' }, { title: 'Polymorphism in Java', file: 'what_is_polymorphism_in_java.mp4', len: '0:23', kind: 'Topic' }],
  'object oriented programming': [{ title: 'Intro to OOP: Thinking in Objects', file: 'introduction_to_oopm_thinking_in_objects.mp4', len: '0:52', kind: 'One-shot' }, { title: 'Polymorphism in Java', file: 'what_is_polymorphism_in_java.mp4', len: '0:23', kind: 'Topic' }],
  'data structures': [{ title: 'Linked Lists Basics', file: 'linked_lists_basics.mp4', len: '1:03', kind: 'Topic' }, { title: 'Bubble Sort Explained', file: 'bubble_sort_explained.mp4', len: '0:55', kind: 'Topic' }, { title: 'Insertion Sort Explained', file: 'insertion_sort_explained.mp4', len: '0:45', kind: 'Topic' }, { title: 'Selection Sort Explained', file: 'selection_sort_explained.mp4', len: '0:48', kind: 'Topic' }, { title: 'Merge Sort Explained', file: 'merge_sort_explained.mp4', len: '0:38', kind: 'Topic' }, { title: 'Quick Sort Explained', file: 'quick_sort_explained.mp4', len: '0:41', kind: 'Topic' }, { title: 'Heap Sort — Step by Step', file: 'understanding_heap_sort_a_step_by_step_animation.mp4', len: '0:44', kind: 'Topic' }],
  'dsa': [{ title: 'Linked Lists Basics', file: 'linked_lists_basics.mp4', len: '1:03', kind: 'Topic' }, { title: 'Bubble Sort Explained', file: 'bubble_sort_explained.mp4', len: '0:55', kind: 'Topic' }, { title: 'Insertion Sort Explained', file: 'insertion_sort_explained.mp4', len: '0:45', kind: 'Topic' }, { title: 'Selection Sort Explained', file: 'selection_sort_explained.mp4', len: '0:48', kind: 'Topic' }, { title: 'Merge Sort Explained', file: 'merge_sort_explained.mp4', len: '0:38', kind: 'Topic' }, { title: 'Quick Sort Explained', file: 'quick_sort_explained.mp4', len: '0:41', kind: 'Topic' }, { title: 'Heap Sort — Step by Step', file: 'understanding_heap_sort_a_step_by_step_animation.mp4', len: '0:44', kind: 'Topic' }],
  'data structures & algorithms': [{ title: 'Linked Lists Basics', file: 'linked_lists_basics.mp4', len: '1:03', kind: 'Topic' }, { title: 'Bubble Sort Explained', file: 'bubble_sort_explained.mp4', len: '0:55', kind: 'Topic' }, { title: 'Insertion Sort Explained', file: 'insertion_sort_explained.mp4', len: '0:45', kind: 'Topic' }, { title: 'Selection Sort Explained', file: 'selection_sort_explained.mp4', len: '0:48', kind: 'Topic' }, { title: 'Merge Sort Explained', file: 'merge_sort_explained.mp4', len: '0:38', kind: 'Topic' }, { title: 'Quick Sort Explained', file: 'quick_sort_explained.mp4', len: '0:41', kind: 'Topic' }, { title: 'Heap Sort — Step by Step', file: 'understanding_heap_sort_a_step_by_step_animation.mp4', len: '0:44', kind: 'Topic' }],
  'data structures and algorithms': [{ title: 'Linked Lists Basics', file: 'linked_lists_basics.mp4', len: '1:03', kind: 'Topic' }, { title: 'Bubble Sort Explained', file: 'bubble_sort_explained.mp4', len: '0:55', kind: 'Topic' }, { title: 'Insertion Sort Explained', file: 'insertion_sort_explained.mp4', len: '0:45', kind: 'Topic' }, { title: 'Selection Sort Explained', file: 'selection_sort_explained.mp4', len: '0:48', kind: 'Topic' }, { title: 'Merge Sort Explained', file: 'merge_sort_explained.mp4', len: '0:38', kind: 'Topic' }, { title: 'Quick Sort Explained', file: 'quick_sort_explained.mp4', len: '0:41', kind: 'Topic' }, { title: 'Heap Sort — Step by Step', file: 'understanding_heap_sort_a_step_by_step_animation.mp4', len: '0:44', kind: 'Topic' }],
  'algorithms': [{ title: 'Bubble Sort Explained', file: 'bubble_sort_explained.mp4', len: '0:55', kind: 'Topic' }, { title: 'Insertion Sort Explained', file: 'insertion_sort_explained.mp4', len: '0:45', kind: 'Topic' }, { title: 'Selection Sort Explained', file: 'selection_sort_explained.mp4', len: '0:48', kind: 'Topic' }, { title: 'Merge Sort Explained', file: 'merge_sort_explained.mp4', len: '0:38', kind: 'Topic' }, { title: 'Quick Sort Explained', file: 'quick_sort_explained.mp4', len: '0:41', kind: 'Topic' }, { title: 'Heap Sort — Step by Step', file: 'understanding_heap_sort_a_step_by_step_animation.mp4', len: '0:44', kind: 'Topic' }],
  'multithreading': [{ title: 'Multithreading in Java', file: 'what_is_a_multi_threading_in_java.mp4', len: '0:14', kind: 'Topic' }, { title: 'Deadlock Explained', file: 'deadlock_explained.mp4', len: '0:42', kind: 'Topic' }],
  'concurrency': [{ title: 'Multithreading in Java', file: 'what_is_a_multi_threading_in_java.mp4', len: '0:14', kind: 'Topic' }, { title: 'Deadlock Explained', file: 'deadlock_explained.mp4', len: '0:42', kind: 'Topic' }],
  'node.js': [{ title: 'Node.js — Part 1', file: 'node_1.mp4', len: '3:00', kind: 'Topic' }, { title: 'Node.js — Part 2', file: 'node_2.mp4', len: '2:59', kind: 'Topic' }, { title: 'Node.js — Part 3', file: 'node_3.mp4', len: '3:01', kind: 'Topic' }],
  'nodejs': [{ title: 'Node.js — Part 1', file: 'node_1.mp4', len: '3:00', kind: 'Topic' }, { title: 'Node.js — Part 2', file: 'node_2.mp4', len: '2:59', kind: 'Topic' }, { title: 'Node.js — Part 3', file: 'node_3.mp4', len: '3:01', kind: 'Topic' }],
  'node': [{ title: 'Node.js — Part 1', file: 'node_1.mp4', len: '3:00', kind: 'Topic' }, { title: 'Node.js — Part 2', file: 'node_2.mp4', len: '2:59', kind: 'Topic' }, { title: 'Node.js — Part 3', file: 'node_3.mp4', len: '3:01', kind: 'Topic' }],
  'react': [{ title: 'React — Part 1', file: 'react_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'React — Part 2', file: 'react_part_2.mp4', len: '2:34', kind: 'Topic' }],
  'react.js': [{ title: 'React — Part 1', file: 'react_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'React — Part 2', file: 'react_part_2.mp4', len: '2:34', kind: 'Topic' }],
  'reactjs': [{ title: 'React — Part 1', file: 'react_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'React — Part 2', file: 'react_part_2.mp4', len: '2:34', kind: 'Topic' }],
  'html': [{ title: 'HTML & CSS — Part 1', file: 'html_css_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'HTML & CSS — Part 2', file: 'html_css_part_2.mp4', len: '2:33', kind: 'Topic' }],
  'css': [{ title: 'HTML & CSS — Part 1', file: 'html_css_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'HTML & CSS — Part 2', file: 'html_css_part_2.mp4', len: '2:33', kind: 'Topic' }],
  'html & css': [{ title: 'HTML & CSS — Part 1', file: 'html_css_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'HTML & CSS — Part 2', file: 'html_css_part_2.mp4', len: '2:33', kind: 'Topic' }],
  'html/css': [{ title: 'HTML & CSS — Part 1', file: 'html_css_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'HTML & CSS — Part 2', file: 'html_css_part_2.mp4', len: '2:33', kind: 'Topic' }],
  'html and css': [{ title: 'HTML & CSS — Part 1', file: 'html_css_part_1.mp4', len: '2:30', kind: 'Topic' }, { title: 'HTML & CSS — Part 2', file: 'html_css_part_2.mp4', len: '2:33', kind: 'Topic' }],
  'sql': [{ title: 'SQL — Part 1', file: 'sql_part_1.mp4', len: '2:45', kind: 'Topic' }, { title: 'SQL — Part 2', file: 'sql_part_2.mp4', len: '2:50', kind: 'Topic' }],
  'postgresql': [{ title: 'SQL — Part 1', file: 'sql_part_1.mp4', len: '2:45', kind: 'Topic' }, { title: 'SQL — Part 2', file: 'sql_part_2.mp4', len: '2:50', kind: 'Topic' }],
  'mysql': [{ title: 'SQL — Part 1', file: 'sql_part_1.mp4', len: '2:45', kind: 'Topic' }, { title: 'SQL — Part 2', file: 'sql_part_2.mp4', len: '2:50', kind: 'Topic' }],
  'c++': [{ title: 'C++ — Part 1', file: 'cpp_part_1.mp4', len: '2:30', kind: 'Topic' }],
  'cpp': [{ title: 'C++ — Part 1', file: 'cpp_part_1.mp4', len: '2:30', kind: 'Topic' }],
}

// Sub-topic hints so a skill can still match related videos in the folder.
// e.g. a "React" skill can surface "hooks" / "jsx" clips when no exact match exists.
export const LEARNING_SUBTOPICS = {
  react: ['hooks', 'jsx', 'components', 'state', 'useeffect'],
  javascript: ['es6', 'promises', 'async', 'closures', 'dom'],
  python: ['pandas', 'numpy', 'flask', 'django', 'oop'],
  java: ['spring', 'collections', 'streams', 'jvm'],
  sql: ['joins', 'indexes', 'queries', 'normalization'],
  'communication': ['storytelling', 'presenting', 'writing'],
  leadership: ['delegation', 'feedback', 'motivation'],
  'product management': ['roadmap', 'prioritization', 'metrics', 'discovery'],
}
