import { ProjectItem, ExperienceItem, VideoReelItem, SkillItem, WorkflowPhase } from '../types';

export const PERSONAL_INFO = {
  name: 'John Paulo Sanchez',
  handle: 'jpsnchz.dev',
  roles: ['Web Developer', 'Multimedia Designer', 'Social Media Editor'],
  roleSubtitle: 'Web Developer  |  Multimedia Designer  |  Social Media Editor',
  location: 'Manila, Philippines (Available Remote)',
  email: 'johnpaulosnchz@gmail.com',
  bio: `I am a Computer Engineering student, web developer, and multimedia designer crafting thoughtful digital systems at the intersection of clean code, visual precision, and creative media. With a background spanning responsive frontend engineering, backend databases, audiovisual production, and high-engagement content strategy, I build digital products that look intentional and perform reliably.`,
  secondaryBio: `Whether architecting community-friendly civic web systems, building streamlined rental ledgers, or editing high-retention short-form educational videos, my focus is always clarity, craftsmanship, and practical impact.`,
  stats: [
    { label: 'Years Exp', value: '03+' },
    { label: 'Projects', value: '12' },
    { label: 'Craft & Code', value: '100%' },
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/jpsnchz0101', handle: 'jpsnchz0101' },
    { name: 'Instagram', url: 'https://www.instagram.com/snchz_pauuu/', handle: '@snchz_pauuu' },
  ],
};

export const HERO_ROTATING_WORDS = ['UGC ads', 'talking-head clips', 'product reels'];

export interface ShowcaseReel {
  index: number; // Matches /video/{index}.mp4 and its poster
  format: string;
  title: string;
  caption: string;
}

// Ordered with client-facing formats first
export const SHOWCASE_REELS: ShowcaseReel[] = [
  {
    index: 3,
    format: 'Talking head',
    title: 'Talking-head edit',
    caption: 'Animated captions and pop-up graphics that keep a spoken clip moving.',
  },
  {
    index: 2,
    format: 'Product ad',
    title: 'Feralde perfume ad',
    caption: 'A search-bar hook that leads into the product reveal.',
  },
  {
    index: 4,
    format: 'UGC style',
    title: '"Don\'t buy an old motorcycle"',
    caption: 'A lifestyle story carried by simple on-screen captions.',
  },
  {
    index: 5,
    format: 'Kinetic type',
    title: 'Pressure montage',
    caption: 'Speech clips cut together with animated typography.',
  },
  {
    index: 6,
    format: 'Storytelling',
    title: 'Pole vault story',
    caption: 'A narrative sports edit that builds to its payoff.',
  },
  {
    index: 1,
    format: 'Motion',
    title: 'ASCII effect breakdown',
    caption: 'An After Effects walkthrough explained step by step.',
  },
];

export const SERVICES = [
  {
    id: 'editing',
    title: 'Short-form & UGC editing',
    summary: 'Send me raw footage. You get finished vertical videos, ready to post.',
    bullets: [
      'Hooks and pacing built around the first 3 seconds',
      'Animated captions, B-roll and sound design',
      'Exports for Reels, TikTok and YouTube Shorts',
    ],
  },
  {
    id: 'social',
    title: 'Social media management',
    summary: 'I keep your page active and consistent, so you can focus on running things.',
    bullets: [
      'A monthly content plan built around your goals',
      'Captions, hashtags, graphics and scheduling',
      'A simple monthly review of what to do next',
    ],
  },
];

export const AUDIENCES = [
  {
    label: 'Brands & e-commerce',
    need: 'UGC-style ads and product videos, plus a page that stays active.',
  },
  {
    label: 'Creators & coaches',
    need: 'Talking-head clips edited into shorts, with a steady posting plan.',
  },
];

export const PROCESS_STEPS = [
  {
    title: 'Send your brief',
    summary: 'Share your footage or goals, a few videos you like, and where it will be posted.',
  },
  {
    title: 'Agree the scope',
    summary: 'You get the deliverables, deadline and revision rounds in writing before I start.',
  },
  {
    title: 'Review the first cut',
    summary: 'I share the draft, you leave feedback, and I make the changes.',
  },
  {
    title: 'Get it ready to post',
    summary: 'Final files in the formats you need, or scheduled for you if I run your page.',
  },
];

export const CTA_EMAIL_SUBJECT = 'Project inquiry from your portfolio';

export const CTA_EMAIL_BODY = `Hi John Paulo,

I'm looking for: (short-form editing / social media management / both)
Brand or page:
What I need:
Timeline:
An example video I like:
`;

// Timeline HUD clips, in page order. Each id matches a section on the page.
export const SEQUENCES = [
  { id: 'work', label: 'The work' },
  { id: 'cut', label: 'The cut' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Export' },
];

export interface CutWord {
  text: string;
  filler?: boolean; // Removed in the cut stage
  emphasis?: boolean; // Shown large and yellow in captions
}

// Demo script for the scroll-driven edit. Written for this page, not client footage.
export const CUT_WORDS: CutWord[] = [
  { text: 'So,', filler: true },
  { text: 'um,', filler: true },
  { text: 'basically,', filler: true },
  { text: 'you' },
  { text: 'like,', filler: true },
  { text: 'have' },
  { text: 'uh,', filler: true },
  { text: 'three', emphasis: true },
  { text: 'seconds', emphasis: true },
  { text: 'to' },
  { text: 'you know,', filler: true },
  { text: 'stop', emphasis: true },
  { text: 'the' },
  { text: 'scroll.', emphasis: true },
];

export const CUT_STAGES = [
  { label: 'Raw clip', note: 'Every "um" and pause is still in here.' },
  { label: 'Cut the dead air', note: 'The filler goes, and the clip closes up.' },
  { label: 'Add captions', note: 'Key words get the weight, for people watching on mute.' },
  { label: 'Sound & pace', note: 'Music, hits and a punch-in carry the energy.' },
  { label: 'Ready to post', note: 'Same message, far less waiting for the point.' },
];

// One sample month: reel, carousel, story, or a rest day
export const SAMPLE_MONTH: Array<'reel' | 'carousel' | 'story' | 'rest'> = [
  'reel', 'story', 'carousel', 'rest', 'reel', 'story', 'rest',
  'carousel', 'reel', 'story', 'rest', 'reel', 'carousel', 'rest',
  'reel', 'story', 'carousel', 'rest', 'reel', 'story', 'rest',
  'carousel', 'reel', 'story', 'rest', 'reel', 'carousel', 'rest',
];

export const CORE_TECH_STACK = [
  { name: 'HTML5', category: 'Markup' },
  { name: 'CSS3 / Flexbox / Grid', category: 'Styling' },
  { name: 'JavaScript (ES6+)', category: 'Language' },
  { name: 'React', category: 'Framework' },
  { name: 'Tailwind CSS', category: 'CSS Utility' },
  { name: 'Python', category: 'Language' },
  { name: 'Flask', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },
  { name: 'MySQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Git & GitHub', category: 'Version Control' },
  { name: 'Figma', category: 'UI/UX Design' },
  { name: 'Canva', category: 'Graphic Design' },
  { name: 'CapCut', category: 'Video Editing' },
];

export const AI_TOOLS = [
  { name: 'Claude', description: 'Architecture & Logic Reasoning' },
  { name: 'ChatGPT', description: 'Algorithmic Optimization' },
  { name: 'v0.dev', description: 'UI Component Scaffolding' },
  { name: 'Cursor', description: 'Agentic Code Navigation' },
  { name: 'Lovable.dev', description: 'Interactive Prototyping' },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    period: '2023 — Present',
    role: 'Freelance Web Developer & Multimedia Specialist',
    company: 'Independent / Contract',
    location: 'Remote',
    type: 'Freelance & Projects',
    description: 'Engineering responsive web applications, bespoke UI interfaces, and multi-format social media content for community initiatives and clients.',
    bullets: [
      'Developed end-to-end full-stack web applications utilizing Python Flask, PHP, JavaScript, and relational databases (MySQL/PostgreSQL).',
      'Designed user interface workflows, design systems, and responsive prototypes using Figma and Canva.',
      'Produced short-form vertical video reels achieving high engagement through kinetic typography, dynamic cuts, and audio beat-syncing.',
    ],
    tags: ['React', 'JavaScript', 'Python', 'Flask', 'MySQL', 'CapCut', 'Figma'],
  },
  {
    id: 'exp-2',
    period: '2022 — Present',
    role: 'Computer Engineering Student & Civic Tech Builder',
    company: 'University & Community Projects',
    location: 'Philippines',
    type: 'Academic & Civic',
    description: 'Focusing on computer systems architecture, database management, software development lifecycles, and accessible community software.',
    bullets: [
      'Architected LaanBayan, an open civic portal facilitating barangay asset allocation, requests, and community announcements.',
      'Engineered Balai, an intuitive room rental ledger and boarding house tenant tracking utility.',
      'Active participant in technical student organizations, hackathons, and open-source project showcases.',
    ],
    tags: ['Computer Engineering', 'Systems Architecture', 'Relational DBs', 'Community Tech'],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'laanbayan',
    number: '01',
    title: 'LaanBayan',
    subtitle: 'Civic Resource & Barangay Management Web System',
    category: 'Full-Stack Web Application',
    description: 'A community-first civic technology platform designed to streamline local barangay resource allocation, citizen service requests, and transparent inventory tracking.',
    highlights: [
      'Multi-role authentication for barangay administrators and local community residents.',
      'Real-time status tracking for municipal utility and facility reservations.',
      'Structured database schema in MySQL/PostgreSQL with audit trails and automated record generation.',
    ],
    techStack: ['Python', 'Flask', 'MySQL', 'JavaScript', 'HTML5', 'Tailwind CSS'],
    githubUrl: 'https://github.com/jpsnchz0101',
    liveUrl: '#',
    featured: true,
  },
  {
    id: 'balai',
    number: '02',
    title: 'Balai',
    subtitle: 'Streamlined Boarding House & Rental Ledger Management Tool',
    category: 'Property Management Utility',
    description: 'A focused digital ledger and tenant tracking application built for property owners, boarding houses, and room rental management with frictionless record keeping.',
    highlights: [
      'Dynamic tenant registry with monthly rent calculation, payment history, and utility bill splits.',
      'Clean monospace dashboard interface optimizing fast data entry and balance checks.',
      'Lightweight storage with instant search, tenant archiving, and exportable financial summaries.',
    ],
    techStack: ['PHP', 'JavaScript', 'MySQL', 'CSS3', 'Responsive Design'],
    githubUrl: 'https://github.com/jpsnchz0101',
    liveUrl: '#',
    featured: true,
  },
  {
    id: 'multimedia-suite',
    number: '03',
    title: 'Short-Form Kinetic Edits & Content System',
    subtitle: 'High-Retention Video Editing & Social Media Systems',
    category: 'Multimedia & Video Production',
    description: 'A production framework for short-form social video edits combining beat-matched jump cuts, kinetic motion typography, and scannable visual pacing.',
    highlights: [
      'Custom typography overlays and sound effects designed for maximum hook retention.',
      'Workflow pipeline utilizing CapCut, Canva, and Photoshop for multi-platform delivery.',
      'Published across Instagram Reels and TikTok with consistent visual identity.',
    ],
    techStack: ['CapCut', 'Canva', 'Motion Typography', 'Sound Design'],
    githubUrl: 'https://www.instagram.com/snchz_pauuu/',
    liveUrl: '#multimedia',
    featured: true,
  },
];

export const VIDEO_REELS: VideoReelItem[] = [
  {
    id: 'reel-1',
    title: 'Reel 01',
    caption: 'Dynamic vertical edit featuring kinetic motion typography, visual pacing, and sound design.',
    src: '/video/1.mp4',
    fallbackSrc: '/assets/video/1.mp4',
    poster: '',
    duration: '9:16',
    tags: ['REEL 01', '9:16', 'MOTION', 'EDIT'],
    ratio: '9:16',
  },
  {
    id: 'reel-2',
    title: 'Reel 02',
    caption: 'Short-form visual storytelling and high-retention video production.',
    src: '/video/2.mp4',
    fallbackSrc: '/assets/video/2.mp4',
    poster: '',
    duration: '9:16',
    tags: ['REEL 02', '9:16', 'CREATIVE', 'PACING'],
    ratio: '9:16',
  },
  {
    id: 'reel-3',
    title: 'Reel 03',
    caption: 'Cinematic composition, beat matching, and seamless visual transitions.',
    src: '/video/3.mp4',
    fallbackSrc: '/assets/video/3.mp4',
    poster: '',
    duration: '9:16',
    tags: ['REEL 03', '9:16', 'TRANSITIONS', 'VFX'],
    ratio: '9:16',
  },
  {
    id: 'reel-4',
    title: 'Reel 04',
    caption: 'Engaging product or workflow showcase optimized for mobile social feeds.',
    src: '/video/4.mp4',
    fallbackSrc: '/assets/video/4.mp4',
    poster: '',
    duration: '9:16',
    tags: ['REEL 04', '9:16', 'PRODUCT', 'SHOWCASE'],
    ratio: '9:16',
  },
  {
    id: 'reel-5',
    title: 'Reel 05',
    caption: 'Kinetic typography, animated accents, and rhythm-synchronized cuts.',
    src: '/video/5.mp4',
    fallbackSrc: '/assets/video/5.mp4',
    poster: '',
    duration: '9:16',
    tags: ['REEL 05', '9:16', 'TYPOGRAPHY', 'AUDIO'],
    ratio: '9:16',
  },
  {
    id: 'reel-6',
    title: 'Reel 06',
    caption: 'Creative portfolio piece highlighting digital craftsmanship and visual identity.',
    src: '/video/6.mp4',
    fallbackSrc: '/assets/video/6.mp4',
    poster: '',
    duration: '9:16',
    tags: ['REEL 06', '9:16', 'PORTFOLIO', 'DESIGN'],
    ratio: '9:16',
  },
];

export const WORKFLOW_PHASES: WorkflowPhase[] = [
  {
    phase: 'Phase 01',
    title: 'Discovery & Scoping',
    summary: 'Analyzing core objectives, identifying user personas, mapping data requirements, and defining technical specifications.',
    deliverables: ['Requirements specification', 'Database entity diagram', 'Project roadmap'],
  },
  {
    phase: 'Phase 02',
    title: 'UI/UX & Prototyping',
    summary: 'Drafting intuitive wireframes, establishing typographic scales and color tokens, and testing prototypes in Figma and Canva.',
    deliverables: ['Interactive Figma prototypes', 'Design tokens & typography', 'Component library'],
  },
  {
    phase: 'Phase 03',
    title: 'Full-Stack Engineering',
    summary: 'Writing clean HTML/CSS/JS, engineering backend endpoints, structuring relational databases, and tuning performance.',
    deliverables: ['Semantic modular frontend', 'RESTful API endpoints', 'Optimized SQL queries'],
  },
  {
    phase: 'Phase 04',
    title: 'Review, Polish & Launch',
    summary: 'Conducting cross-device responsive QA, fine-tuning rhythm and micro-interactions, and deploying accessible web experiences.',
    deliverables: ['Lighthouse performance audits', 'Cross-browser testing', 'Production deployment'],
  },
];

export const SKILLS_LIST: SkillItem[] = [
  // Web
  { name: 'HTML5 Semantic', category: 'web', categoryLabel: 'Web Development', level: 'Advanced', description: 'Accessible, semantic markup and SEO best practices' },
  { name: 'CSS3 / Modern Flex & Grid', category: 'web', categoryLabel: 'Web Development', level: 'Advanced', description: 'Responsive layouts, variables, keyframe animations' },
  { name: 'JavaScript (ES6+)', category: 'web', categoryLabel: 'Web Development', level: 'Advanced', description: 'Async/await, DOM APIs, modern ECMAScript patterns' },
  { name: 'React & Hooks', category: 'web', categoryLabel: 'Web Development', level: 'Proficient', description: 'Component lifecycles, state management, modular architecture' },
  { name: 'Tailwind CSS', category: 'web', categoryLabel: 'Web Development', level: 'Advanced', description: 'Utility-first rapid prototyping with strict design tokens' },
  
  // Backend & Databases
  { name: 'Python 3', category: 'backend', categoryLabel: 'Backend & Data', level: 'Proficient', description: 'Data structures, scripting, algorithm design' },
  { name: 'Flask Framework', category: 'backend', categoryLabel: 'Backend & Data', level: 'Proficient', description: 'REST APIs, server-side routing, template rendering' },
  { name: 'PHP Server Scripting', category: 'backend', categoryLabel: 'Backend & Data', level: 'Proficient', description: 'Dynamic web backends, session handling, CRUD systems' },
  { name: 'MySQL Relational DB', category: 'backend', categoryLabel: 'Backend & Data', level: 'Advanced', description: 'Complex joins, normalization, indexing, transactions' },
  { name: 'PostgreSQL', category: 'backend', categoryLabel: 'Backend & Data', level: 'Intermediate', description: 'ACID compliance, schema definitions, relations' },

  // Multimedia & Video
  { name: 'CapCut Video Editing', category: 'multimedia', categoryLabel: 'Multimedia & Video', level: 'Advanced', description: 'Pacing, multi-layer overlays, keyframes, transitions' },
  { name: 'Kinetic Motion Typography', category: 'multimedia', categoryLabel: 'Multimedia & Video', level: 'Advanced', description: 'Rhythmic captioning, synchronized text animations' },
  { name: 'Audio & Beat Syncing', category: 'multimedia', categoryLabel: 'Multimedia & Video', level: 'Advanced', description: 'Waveform alignment, beat drops, sound effects' },
  { name: 'Canva Design & Graphics', category: 'multimedia', categoryLabel: 'Multimedia & Video', level: 'Advanced', description: 'Editorial posters, social decks, typography layout' },
  { name: 'Figma UI/UX Prototyping', category: 'multimedia', categoryLabel: 'Multimedia & Video', level: 'Proficient', description: 'Wireframing, auto-layout, vector design, interactive flows' },

  // Tools & Version Control
  { name: 'Git & GitHub', category: 'tools', categoryLabel: 'Engineering Tools', level: 'Advanced', description: 'Branching, PRs, version history, team collaboration' },
  { name: 'VS Code & Terminals', category: 'tools', categoryLabel: 'Engineering Tools', level: 'Advanced', description: 'CLI workflows, linting, debugging, keyboard mastery' },
  { name: 'Responsive DevTools', category: 'tools', categoryLabel: 'Engineering Tools', level: 'Advanced', description: 'Network throttling, accessibility audits, profiling' },

  // AI Workflows
  { name: 'Claude & ChatGPT Prompting', category: 'ai', categoryLabel: 'AI Workflows', level: 'Advanced', description: 'Technical reasoning, unit test generation, algorithmic review' },
  { name: 'Cursor & v0 Prototyping', category: 'ai', categoryLabel: 'AI Workflows', level: 'Advanced', description: 'Accelerated UI engineering and component architecture' },
];
