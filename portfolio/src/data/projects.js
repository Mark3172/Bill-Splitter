/*
  All portfolio projects live in this one file — edit here to add, remove,
  or update a project and the site updates everywhere automatically.

  Fields:
  - category: 'design' | 'development'  (used by the filter tabs)
  - links.figma:  Figma prototype URL   → shows "Watch Prototype" (opens in-page preview)
  - links.live:   deployed app URL      → shows "Live Demo" (opens in-page preview)
  - links.github: repository URL        → shows "Code"
  - links.doc:    case study / handoff  → shows the docLabel button
*/

export const projects = [
  {
    id: 'readly',
    title: 'Readly — Dyslexia Library App',
    category: 'design',
    categoryLabel: 'UI/UX Design',
    description:
      'Accessible reading platform designed for dyslexic users, with text-to-speech, adjustable letter spacing, and customizable color themes for comfortable reading.',
    tags: ['Accessibility', 'Mobile App', 'User Research'],
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=500&fit=crop',
    role: 'UI/UX Designer',
    timeline: '6 weeks · 2-person team',
    tech: ['Figma', 'Adobe Illustrator', 'User Testing'],
    links: {
      figma:
        'https://www.figma.com/proto/WX1xal4zIOWAA1Q1IdQm2K/Readly?page-id=174%3A207&node-id=773-1379&starting-point-node-id=773%3A1379&scaling=min-zoom&content-scaling=fixed&show-proto-sidebar=1&t=MzKgI1BM7teBFliG-1',
      doc: 'https://docs.google.com/document/d/1Q7O69CDvHcmWYHDEkU2VEpvKTLctcwelghK6yyx6a8s/edit?usp=sharing',
    },
    docLabel: 'Handoff Report',
  },
  {
    id: 'bill-splitter',
    title: 'Bill Splitter',
    category: 'development',
    categoryLabel: 'Web & Mobile App',
    description:
      'Split group bills in one touch: live equal-split math with multi-currency support, payment QR codes (KPay, AYA Pay, WavePay), and shareable PNG receipt cards. Ships as a web app plus an Expo mobile app.',
    tags: ['React', 'TypeScript', 'Expo', 'Fintech UI'],
    image: 'https://opengraph.githubassets.com/1/Mark3172/Bill-Splitter',
    role: 'Design & Development',
    timeline: 'Personal project',
    tech: ['React', 'TypeScript', 'Vite', 'Expo / React Native'],
    links: {
      github: 'https://github.com/Mark3172/Bill-Splitter',
    },
  },
  {
    id: 'greenlens',
    title: 'GreenLens AI',
    category: 'development',
    categoryLabel: 'AI Application',
    description:
      'AI-powered environmental inspector: an agent core with a CLI and a first inspection UI that analyzes surroundings and reports environmental findings.',
    tags: ['AI Agent', 'TypeScript', 'CLI'],
    image: 'https://opengraph.githubassets.com/1/Mark3172/greenlens-ai',
    role: 'Design & Development',
    timeline: 'Personal project',
    tech: ['TypeScript', 'Node.js', 'LLM APIs'],
    links: {
      github: 'https://github.com/Mark3172/greenlens-ai',
    },
  },
  {
    id: 'ai-chatbot',
    title: 'AI Student Support Chatbot',
    category: 'design',
    categoryLabel: 'UX Design · AI',
    description:
      '24/7 student-support chatbot built with Stack AI and GPT-4. Designed the conversational UI patterns, quick-response layouts, and accessibility features, then shipped a hackathon MVP.',
    tags: ['Conversational UI', 'AI Interface', 'Hackathon MVP'],
    image: 'https://opengraph.githubassets.com/1/Mark3172/atom-support-ai-chatbot',
    role: 'UX Designer · 5-person team',
    timeline: '3 months',
    tech: ['Figma', 'GPT-4', 'Stack AI', 'JavaScript'],
    links: {
      github: 'https://github.com/Mark3172/atom-support-ai-chatbot',
      doc: 'https://drive.google.com/file/d/12gq_WCmSH9aPPNuHA4m-tZH-ZOsMAcup/view?usp=sharing',
    },
    docLabel: 'Handoff Report',
  },
  {
    id: 'sneaker-commerce',
    title: 'Sneaker Commerce App',
    category: 'design',
    categoryLabel: 'UI Design',
    description:
      'Modern e-commerce concept for sneaker enthusiasts: product discovery with advanced filtering, wishlist, AR try-on visualization, and a streamlined mobile checkout flow.',
    tags: ['E-commerce', 'Mobile App', 'Prototype'],
    image:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=500&fit=crop',
    role: 'UI Designer · 3-person team',
    timeline: '1-week sprint',
    tech: ['Figma', 'Principle', 'Photoshop'],
    links: {
      figma:
        'https://www.figma.com/proto/esf6HFt1mjOYfPnURk10aC/JFMH-Project?page-id=2%3A3&node-id=457-1769&p=f&viewport=395%2C133%2C0.09&t=vVU5ZVUiJBB9Brer-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=457%3A1769&show-proto-sidebar=1',
      doc: 'https://docs.google.com/document/d/1zdkwh339nTdva8CIZw_BGP5q5lEFaCLHyQpGDCEpePU/edit?usp=sharing',
    },
    docLabel: 'Case Study',
  },
  {
    id: 'spacial-music',
    title: 'Spatial 3D Music Player',
    category: 'development',
    categoryLabel: 'Creative Web',
    description:
      'Interactive music player that places sound in a 3D space, blending creative web graphics with audio playback for an immersive listening experience.',
    tags: ['3D Graphics', 'Web Audio', 'JavaScript'],
    image: 'https://opengraph.githubassets.com/1/Mark3172/Spacial-3D-Music-Player',
    role: 'Developer',
    timeline: 'Team project',
    tech: ['JavaScript', 'Web Audio API', 'CSS 3D'],
    links: {
      github: 'https://github.com/Mark3172/Spacial-3D-Music-Player',
    },
  },
  {
    id: 'forage-midas',
    title: 'JPMC Midas — Advanced Software Engineering',
    category: 'development',
    categoryLabel: 'Backend Engineering',
    description:
      'Completed the J.P. Morgan Chase Advanced Software Engineering program (Forage): built a Java/Spring transaction-processing service with Kafka messaging, an H2 database layer, and REST APIs.',
    tags: ['Java', 'Spring Boot', 'Kafka'],
    image: 'https://opengraph.githubassets.com/1/Mark3172/forage-midas',
    role: 'Software Engineer (virtual program)',
    timeline: 'J.P. Morgan Chase · Forage',
    tech: ['Java', 'Spring Boot', 'Kafka', 'H2', 'REST'],
    links: {
      github: 'https://github.com/Mark3172/forage-midas',
    },
  },
];

export const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'design', label: 'UI/UX Design' },
  { id: 'development', label: 'Development' },
];
