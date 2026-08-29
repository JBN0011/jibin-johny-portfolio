export interface Project {
  id: string;
  title: string;
  category: string;
  spanSize: 5 | 7 | 12;
  image: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
  tags: string[];
  year: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string;
  slug: string;
  tags: string[];
}

export interface StatItem {
  id: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
}

export interface PortfolioConfig {
  name: string;
  eyebrow: string;
  roles: string[];
  location: string;
  bio: string;
  profilePhoto: string;
  email: string;
  resumeUrl: string;
  resumeFileName: string;
  availableForWork: boolean;
  socials: {
    instagram: string;
    linkedin: string;
    leetcode: string;
    github: string;
  };
  adminPasscode: string;
  contactFormEndpoint?: string;
}
