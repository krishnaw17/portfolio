import type {
  Project,
  Experience,
  Skill,
  Education,
  Certification,
  // Testimonial
} from '@/types';

import resumePdf from './KrishnaWadhwaResume.pdf';

export const SITE = {
  name: 'Krishna Wadhwa',
  shortName: 'Krishna',
  role: 'Software Engineer',
  email: 'krishnawadhwa2@gmail.com',
  phone: +91 - 9461166675,
  location: 'Jaipur, India',
  social: {
    github: 'https://github.com/krishnaw17',
    linkedin: 'https://www.linkedin.com/in/krishna-wadhwa-3396a2274/',
    twitter: 'https://x.com/KRISHNAWAD48783',
  },
  resumeUrl: resumePdf,
};

export const HEADLINE_ROTATIONS = [
  'Software Engineer',
  'Full Stack Developer',
  'Problem Solver',
  'AI Enthusiast',
  'Backend Engineer',
];

// export const STATS = [
//   { value: 7, suffix: '+', label: 'Years crafting product' },
//   { value: 60, suffix: '+', label: 'Shipped projects' },
//   { value: 12, suffix: 'M+', label: 'Users impacted' },
//   { value: 99, suffix: '%', label: 'Lighthouse score' },
// ];

export const SKILLS: Skill[] = [
  //languages
  { name: 'JavaScript', category: 'languages', level: 90 },
  { name: 'C', category: 'languages', level: 80 },
  { name: 'C++', category: 'languages', level: 85 },

  //Frontend
  { name: 'React', category: 'frontend', level: 98 },
  { name: 'TypeScript', category: 'frontend', level: 96 },
  { name: 'Framer Motion', category: 'frontend', level: 92 },
  { name: 'Tailwind CSS', category: 'frontend', level: 96 },

   
  // { name: 'Three.js / R3F', category: 'frontend', level: 88 },

  // Full stack 
  { name: 'Next.js', category: 'full-stack', level: 95 },
  { name: 'Node.js', category: 'full-stack', level: 94 },
  { name: 'Express.js', category: 'full-stack', level: 90 },
  
  // Databases
  { name: 'SQL', category: 'databases', level: 94 },
  { name: 'NoSQL', category: 'databases', level: 82 },
  { name: 'Redis', category: 'databases', level: 90 },

  // Deployment
  { name: 'Vercel', category: 'deployment', level: 94 },
  { name: 'Render', category: 'deployment', level: 86 },
  
  //tools
  { name: 'Git', category: 'tools', level: 90 },
  {name: 'Github', category: 'tools', level: 87},
  { name: 'Postman', category: 'tools', level: 94 },
  
  // AI
  { name: 'Claude', category: 'ai', level: 92 },
  { name: 'ChatGPT', category: 'ai', level: 90 },
];

export const PROJECTS: Project[] = [
  {
    id: 'hireblind',
    title: 'HireBlind – Bias-Free Resume Scorer',
    description:
      'An AI-powered resume screening platform that evaluates resumes against job descriptions while removing bias through automated candidate data sanitization.',
    longDescription:
      'HireBlind is a full-stack AI recruitment platform built using Next.js, React.js, Node.js, MongoDB, JWT, and Gemini 2.0 Flash. The platform automatically extracts and sanitizes candidate information using Regex and LLM-based parsing, evaluates resumes against job descriptions, generates explainable AI scores, provides recruiter analytics, and implements secure JWT authentication with Role-Based Access Control (RBAC).',
    image: '/projects/hireblind.png',
    tags: [
      'Next.js',
      'React',
      'Node.js',
      'MongoDB',
      'JWT',
      'Gemini AI',
      'Tailwind CSS',
      'Vercel',
      'Render',
    ],
    category: 'ai',
    github: 'https://github.com/krishnaw17/backend_hireblind',
    live: 'https://frontend-hireblind.vercel.app/',
    metrics: [
      { label: 'Candidate Fields Parsed', value: '12+' },
      { label: 'Authentication', value: 'JWT + RBAC' },
      { label: 'AI Model', value: 'Gemini 2.0 Flash' },
    ],
    problem:
      'Recruiters spend significant time manually reviewing resumes, resulting in inconsistent evaluations and unconscious hiring bias.',
    solution:
      'Built an automated AI-powered resume processing pipeline using Regex, LLM-based parsing, Gemini AI scoring, MongoDB, and secure RBAC authentication to streamline recruitment.',
    impact:
      'Reduced manual resume screening effort while providing explainable AI-powered candidate evaluation and recruiter analytics.',
    year: 2026,
    featured: true,
  },

  {
    id: 'pravah-2025',
    title: 'Pravah 2025',
    description:
      'Official website for SKIT Jaipur’s annual cultural festival serving 4,000+ attendees.',
    longDescription:
      'Developed and deployed the official Pravah 2025 website using Next.js, React.js, and Tailwind CSS. The platform centralized event schedules, announcements, registrations, and responsive navigation while ensuring smooth performance across devices.',
    image: '/projects/pravah.png',
    tags: [
      'Next.js',
      'React.js',
      'Tailwind CSS',
      'Vercel',
    ],
    category: 'web',
    github: 'https://github.com/krishnaw17/pravah2025.git',
    live: 'https://pravah2025-two.vercel.app/',
    metrics: [
      { label: 'Festival Audience', value: '4,000+' },
      { label: 'Performance', value: 'Responsive' },
      { label: 'Deployment', value: 'Vercel' },
    ],
    problem:
      'Festival participants lacked a centralized platform for schedules, announcements, and event information.',
    solution:
      'Built a responsive web application providing event information, schedules, and announcements in a single platform.',
    impact:
      'Successfully served thousands of attendees during the college cultural festival.',
    year: 2025,
    featured: true,
  },

  {
    id: 'youtube-clone',
    title: 'YouTube Clone',
    description:
      'A responsive YouTube clone with real-time video search and playback powered by RapidAPI.',
    longDescription:
      'Developed a modern YouTube-inspired application using React.js, Redux Toolkit, Tailwind CSS, and RapidAPI. Implemented routed navigation, persistent search, dynamic video rendering, category filtering, and optimized performance.',
    image: '/projects/youtube.png',
    tags: [
      'React.js',
      'Redux Toolkit',
      'Tailwind CSS',
      'RapidAPI',
      'JavaScript',
      'Vercel',
    ],
    category: 'web',
    github: 'https://github.com/krishnaw17/yt_clone.git',
    live: 'https://yt-clone-alpha.vercel.app/',
    metrics: [
      { label: 'Performance', value: '+30 Lighthouse' },
      { label: 'Load Time', value: '-2 Seconds' },
      { label: 'State Management', value: 'Redux Toolkit' },
    ],
    problem:
      'Wanted to build a scalable frontend application while learning API integration, routing, and state management.',
    solution:
      'Created a feature-rich YouTube clone with optimized rendering, Redux state management, and responsive UI using Tailwind CSS.',
    impact:
      'Improved Lighthouse Performance score by 30 points while reducing average page load time by nearly 2 seconds.',
    year: 2024,
    featured: true,
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 'kistech',
    company: 'KisTechnoSoftware',
    role: 'Software Engineer Intern',
    period: 'July 2024 — August 2024',
    location: 'Jaipur, Rajasthan',
    description:
      'Worked as a Software Engineer Intern where I developed responsive web applications, optimized frontend performance, and collaborated with the development team to deliver production-ready features using React.js and modern frontend technologies.',
    achievements: [
      'Developed and deployed 10+ responsive UI components using React.js and Tailwind CSS.',
      'Improved page rendering performance by approximately 20% while maintaining cross-browser compatibility.',
      'Built a YouTube-style video platform using React.js, Redux Toolkit, RapidAPI, and Tailwind CSS.',
      'Improved Lighthouse Performance score by 30 points and reduced average page load time by nearly 2 seconds.',
      'Collaborated with senior developers to implement scalable frontend architecture and reusable components.',
    ],
    technologies: [
      'React.js',
      'Redux Toolkit',
      'JavaScript',
      'Tailwind CSS',
      'RapidAPI',
      'Git',
      'GitHub',
    ],
  },

  {
    id: 'innovicion',
    company: 'SKIT Jaipur',
    role: 'Lead Organizer • InnovICIon Hackathon',
    period: 'September 2025',
    location: 'Jaipur, Rajasthan',
    description:
      'Led the planning and execution of SKIT Jaipur’s first 24-hour national-level hackathon by coordinating logistics, sponsorships, volunteer management, and participant experience.',
    achievements: [
      'Successfully organized SKIT’s first-ever 24-hour hackathon.',
      'Managed a team of 40+ volunteers across multiple domains.',
      'Coordinated logistics for more than 300 participants.',
      'Worked with sponsors, mentors, judges, and organizing committees.',
      'Established InnovICIon as a flagship annual technical event.',
    ],
    technologies: [
      'Leadership',
      'Project Management',
      'Event Planning',
      'Team Coordination',
      'Public Relations',
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    id: 'skit',
    institution: 'Swami Keshvanand Institute of Technology (SKIT), Jaipur',
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    period: 'Sept 2023 — May 2027',
    description:
      'Currently pursuing B.Tech in Computer Science & Engineering with a CGPA of 8.46/10. Active in full-stack development, AI-powered applications, hackathons, and technical leadership.',
  },
  {
    id: 'sps',
    institution: 'Shradhalaya Public School, Rawatbhata',
    degree: 'Senior Secondary (CBSE)',
    field: 'Class XII',
    period: '2022 — 2023',
    description:
      'Completed Class XII with 88% marks, building a strong foundation in Mathematics, Physics, and Chemistry.',
  },
  {
    id: 'stpaul',
    institution: "St. Paul's Secondary School, Rawatbhata",
    degree: 'Secondary Education (CBSE)',
    field: 'Class X',
    period: '2020 — 2021',
    description:
      'Completed Class X with 85% marks while actively participating in academics and extracurricular activities.',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'linux-training',
    title: 'Linux Training',
    issuer: 'IIT Bombay',
    date: '2025',
  },
  {
    id: 'advanced-cpp',
    title: 'Advanced C++',
    issuer: 'Self-Paced',
    date: '2024',
  },
  {
    id: 'aiml-workshop',
    title: 'AI/ML Workshop',
    issuer: 'Cognizance, IIT Roorkee',
    date: '2024',
  },
];

// export const TESTIMONIALS: Testimonial[] = [
//   {
//     id: 't1',
//     name: 'Sarah Chen',
//     role: 'VP of Engineering',
//     company: 'Stripe',
//     text: 'Alex is the rare engineer who can architect a checkout runtime in the morning and ship a polished UI by lunch. They set the bar for the team.',
//   },
//   {
//     id: 't2',
//     name: 'Marcus Liu',
//     role: 'CTO',
//     company: 'Linear',
//     text: 'The most thoughtful engineer I have ever worked with. Their command-palette work is still the reference for keyboard-first product design.',
//   },
//   {
//     id: 't3',
//     name: 'Priya Nair',
//     role: 'Director of Product',
//     company: 'Vercel',
//     text: 'Alex turns ambiguous product problems into elegant, durable systems. The AI SDK exists because they decided it should.',
//   },
//   {
//     id: 't4',
//     name: 'Jonas Berg',
//     role: 'Co-founder',
//     company: 'Framer',
//     text: 'A frontend engineer with the systems mind of a backend lead. Every PR is a masterclass in clarity and craft.',
//   },
// ];
