export interface Project {
  id: string;
  title: string;
  category: 'game' | 'web' | 'software';
  status: 'DEPLOYED' | 'OPERATIONAL' | 'ALPHA TEST' | 'PRODUCTION';
  brief: string;
  description: string;
  tags: string[];
  features: string[];
  telemetry: {
    fps?: string;
    engine?: string;
    downloads?: string;
    efficiency?: string;
  };
  demoLink?: string;
}

export interface Achievement {
  id: string;
  title: string;
  badgeName: string;
  xpPoints: number;
  category: string;
  description: string;
  date: string;
}

export interface Feedback {
  id: string;
  author: string;
  role: string;
  message: string;
  rating: number;
  date: string;
  subject?: string;
  email?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verifyUrl?: string;
  badgeIcon?: string;
  skills: string[];
  status: 'VERIFIED' | 'AUTHENTICATED' | 'ACTIVE';
}

export interface SocialProfile {
  id: string;
  platform: string;
  username: string;
  url: string;
  iconName: string;
  description: string;
  status: string;
  primaryColor?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Freelance' | 'Lead' | 'Internship' | 'Remote';
  description: string;
  responsibilities: string[];
  techStack: string[];
  metrics?: string;
  status: 'ACTIVE MISSION' | 'COMPLETED' | 'CLASSIFIED';
}

