export interface Career {
  id: number;
  company_name: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string;
  achievements: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  video_file_path?: string;
  thumbnail_url?: string;
  thumbnail_file_path?: string;
  video_type: 'youtube' | 'file';
  file_size?: number;
  duration?: number;
  mime_type?: string;
  category: string;
  client?: string;
  project_date?: string;
  status: 'published' | 'draft';
  is_published: boolean;
  featured: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  profile_image_url: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  social_links: any;
  skills: string[];
  services: string[];
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}