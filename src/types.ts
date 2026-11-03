export type ThemeMode = 'dark' | 'light';

export type NodePhysicsMode = 'constellation' | 'gravity' | 'repulsion' | 'nebula';

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface VideoReelItem {
  id: string;
  title: string;
  caption: string;
  src: string;
  fallbackSrc?: string;
  poster: string;
  duration: string;
  tags: string[];
  ratio: string;
}

export interface SkillItem {
  name: string;
  category: 'web' | 'backend' | 'multimedia' | 'tools' | 'ai';
  categoryLabel: string;
  level?: string;
  description: string;
  iconSvg?: string;
  accentColor?: string;
}

export interface WorkflowPhase {
  phase: string;
  title: string;
  summary: string;
  deliverables: string[];
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarInitials: string;
  rating: number;
  date: string;
  verified: boolean;
  projectScope: string;
  serviceCategory: 'web' | 'multimedia' | 'design';
  comment: string;
}

