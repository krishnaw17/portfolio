export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  tags: string[];
  category: 'web' | 'ai' | 'systems' | 'design';
  github?: string;
  live?: string;
  metrics: { label: string; value: string }[];
  problem: string;
  solution: string;
  impact: string;
  year: number;
  featured?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
}

export interface Skill {
  name: string;
  category: 'languages' | 'full-stack' | 'deployment' | 'frontend' | 'databases' | 'ai' | 'tools';
  level: number; // 0..100
  icon?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}
