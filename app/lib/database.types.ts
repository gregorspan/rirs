// Database types for the training management system

export type UserRole = 'admin' | 'coach' | 'player';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Training {
  id: string;
  coach_id: string;
  title: string;
  description: string;
  location: string;
  training_date: string;
  training_time: string;
  created_at: string;
  updated_at: string;
  coach?: Profile;
}

export interface TrainingRegistration {
  id: string;
  training_id: string;
  player_id: string;
  registered_at: string;
  training?: Training;
  player?: Profile;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

