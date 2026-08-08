import { Project, Achievement, Feedback, Certification, SocialProfile, WorkExperience } from './types';

export const WORK_EXPERIENCE_DATA: WorkExperience[] = [
  {
    id: 'jit-arvr',
    role: 'Student - Game and VR developer',
    company: 'AR/VR R&D, Jeppiaar Institute of Technology',
    location: 'On-Site / Chennai, IN',
    period: '2024 - Present',
    type: 'Lead',
    description: 'Leading the club and a core development team building high-fidelity games and VR softwares in Unreal Engine 5 and Unity',
    responsibilities: [
      'Designed and developed immersive games and VR experiences using Unreal Engine, focusing on gameplay mechanics, interactive environments, and user engagement.',
      'Implemented and optimized game systems, Blueprints, UI, lighting, and performance to deliver smooth, high-quality experiences across target platforms.',
      'Collaborated throughout the development lifecycle, from concept and prototyping to testing, debugging, and deployment, ensuring polished and immersive final products.'
    ],
    techStack: ['Unreal Engine 5', 'C++', 'Blueprints', 'Python', 'Nanite & Lumen', 'Git', 'VR/AR Development'],
    status: 'ACTIVE MISSION'
  },
  {
    id: 'Uni-intern',
    role: '3D Animation & Scene Developer',
    company: 'Universiti Sainz Islam Malaysia (USIM)',
    location: 'Remote / Chennai, IN',
    period: '07/2025 — 10/2025',
    type: 'Internship',
    description: 'Designed and developed optimized 3D scenes by assembling assets, configuring lighting, materials, cameras, and environmental details for the peoduct.',
    responsibilities: [
      'Developed realistic 3D product scenes by arranging assets, materials, lighting, and camera compositions to create visually compelling presentations.',
      'Optimized scene performance through efficient asset management, polygon optimization, texture balancing, and lighting techniques while maintaining high visual quality.',
      'Collaborated with designers and stakeholders to ensure product scenes accurately represented design specifications and delivered an engaging user experience.'
    ],
    techStack: ['Blender', 'Substance Painter', 'Unreal Engine 5', 'PBR Shading'],
    status: 'COMPLETED'
  },
  {
    id: 'quill-intern',
    role: '3D Artist',
    company: 'Quill Drone Technologies',
    location: 'On-site / Chennai, IN',
    period: '09/2024 — 11/2024',
    type: 'Internship',
    description: 'Delivered custom 3D models for drone prototypes, parts.',
    responsibilities: [
      'Created detailed 3D models of drone prototypes, mechanical components, and assemblies based on engineering concepts and technical specifications.',
      'Optimized 3D assets for visualization, simulation, and real-time applications while ensuring dimensional accuracy and clean topology.',
      'Collaborated with engineering and design teams to iterate on prototype designs, refine components, and prepare models for rendering, presentations, and manufacturing workflows.'
    ],
    techStack: ['Blender 3D'],
    status: 'COMPLETED'
  }
];


export const PROJECTS_DATA: Project[] = [
  {
    id: 'cry-within',
    title: 'Cry Within - A 3 - Chapter Horror Game',
    category: 'game',
    status: 'PRODUCTION',
    brief: 'A feel good to creepy horror game with a focus on atmospheric storytelling and immersive gameplay.',
    description: 'A feel good to creepy horror game with a focus on atmospheric storytelling and immersive gameplay.',
    tags: ['Unreal Engine', 'Blender'],
    features: ['FPV', 'Realistic gameplay experience'],
    telemetry: {
      engine: 'UNREAL ENGINE & BLENDER',
      fps: '60 FPS STABLE',
      efficiency: 'HIGH FIDELITY'
    }
  },
  {
    id: 'bharatyatra',
    title: 'BharatYatra',
    category: 'game',
    status: 'DEPLOYED',
    brief: 'A travel application for exploring India\'s rich cultural heritage through VR.',
    description: 'A travel application for exploring India\'s rich cultural heritage through VR.',
    tags: ['Unreal Engine', 'Blender', 'VR'],
    features: ['Finger pointed control', 'AI Guide'],
    telemetry: {
      engine: 'UNREAL ENGINE, BLENDER, VR',
      fps: '90 FPS DIRECT',
      efficiency: 'REAL-TIME GESTURE'
    }
  },
  {
    id: 'energo',
    title: 'Energo',
    category: 'game',
    status: 'DEPLOYED',
    brief: 'Energo is an interactive educational game that teaches Class 5 students the fundamentals of energy through engaging gameplay and challenges.',
    description: 'Energo is an interactive educational game that teaches Class 5 students the fundamentals of energy through engaging gameplay and challenges.',
    tags: ['React vite // VSCode'],
    features: ['Real time examples', 'Q/A based learning'],
    telemetry: {
      engine: 'VSCode, React Vite',
      fps: '60 FPS STABLE',
      efficiency: 'Real Time Learning'
    }
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'innowah',
    title: 'Entered the Semi Finals of IIT PALS InnoWAH event',
    badgeName: 'IIT PALS',
    xpPoints: 1000,
    category: 'Contest',
    description: 'Presented the BharatYatra project at the IIT PALS InnoWAH event and got selected for the semi-finals.',
    date: '[When it was achieved]'
  },
  {
    id: 'gamerush',
    title: 'Secured 2nd Place in GAME RUSH @Kalasalingam',
    badgeName: 'Kalasalingam Engineering College',
    xpPoints: 1500,
    category: 'Contest',
    description: 'Participated in live game development event at Kalasalingam college',
    date: '[When it was achieved]'
  }
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: 'malay-bootcamp',
    title: '11 day international bootcamp at Universiti Sainz Islam Malaysia (USIM), Malaysia',
    issuer: 'Universiti Sainz Islam Malaysia(USIM)',
    date: 'July, 2025',
    credentialId: 'UNI-MALAY-77542',
    verifyUrl: 'https://www.linkedin.com/in/sanath-lal-shibu-lekha-b1a543371?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    skills: ['Robotics', 'Gen AI', 'Power BI', 'Design Thinking'],
    status: 'AUTHENTICATED'
  },
  // {
  //   id: 'ai-ml-python',
  //   title: 'Applied Machine Learning & Neural Networks',
  //   issuer: 'DeepLearning.AI / Python Academy',
  //   date: '2025',
  //   credentialId: 'ML-PYT-992143',
  //   verifyUrl: 'https://coursera.org',
  //   skills: ['PyTorch & TensorFlow', 'Computer Vision', 'NLP Transformers', 'Model Optimization'],
  //   status: 'AUTHENTICATED'
  // },
  // {
  //   id: 'blender-3d',
  //   title: '3D Asset Design & Spatial Environment Modeling',
  //   issuer: 'Blender Foundation Certified Course',
  //   date: '2024',
  //   credentialId: 'BLN-3D-441092',
  //   verifyUrl: 'https://www.blender.org',
  //   skills: ['Low/High Poly Modeling', 'UV Unwrapping', 'Substance Texturing', 'PBR Shaders'],
  //   status: 'VERIFIED'
  // },
  // {
  //   id: 'web-frontend',
  //   title: 'Modern Responsive Web & Frontend Engineering',
  //   issuer: 'Meta / FreeCodeCamp Professional',
  //   date: '2024',
  //   credentialId: 'MTA-FED-102948',
  //   verifyUrl: 'https://meta.com',
  //   skills: ['React 19 & TypeScript', 'Tailwind CSS', 'Web Performance', 'UI/UX Interactive HUDs'],
  //   status: 'ACTIVE'
  // }
];

export const SOCIAL_PROFILES_DATA: SocialProfile[] = [
  {
    id: 'github',
    platform: 'GitHub',
    username: '@sanath-here',
    url: 'https://github.com/Sanath-here',
    iconName: 'Github',
    description: 'Open-source game tools, Unreal Engine blueprints, AI scripts, and web apps.',
    status: 'CODE_REPOS // ACTIVE',
    primaryColor: '#c4fd02'
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    username: 'Sanath Lal Shibu Lekha ',
    url: 'https://www.linkedin.com/in/sanath-lal-shibu-lekha-b1a543371?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    iconName: 'Linkedin',
    description: 'Professional career timeline, engineering milestones, and industry connections.',
    status: 'PRO_NETWORK // CONNECTED',
    primaryColor: '#0a66c2'
  },
  {
    id: 'email',
    platform: 'Direct Email',
    username: 'sanath.lal2023@gmail.com',
    url: 'mailto:sanath.lal2023@gmail.com',
    iconName: 'Mail',
    description: 'Direct communications channel for project inquiries, freelance, and collaborations.',
    status: 'TRANSMISSION // DIRECT',
    primaryColor: '#ea4335'
  },
  {
    id: 'itchio',
    platform: 'Itch.io',
    username: 'sanathlal-noctorine.itch.io',
    url: 'https://sanath-noctorine.itch.io/',
    iconName: 'Gamepad2',
    description: 'Playable game builds, horror game demos, and interactive VR prototypes.',
    status: 'GAME_BUILDS // ONLINE',
    primaryColor: '#fa5c5c'
  }
];

export const PRESEEDED_FEEDBACK: Feedback[] = [];

