
export interface User {
  id: string;
  fullName: string;
  email: string;
  city: string;
  isProfileComplete: boolean;
  avatar?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  category: string;
  salary: string;
  postedAt: string;
  description: string;
  logo: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
