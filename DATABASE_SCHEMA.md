# Database Schema

This document describes the database schema for the Training Management System.

## Tables

### profiles
Stores user profile information and roles.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'player')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Index
CREATE INDEX idx_profiles_role ON profiles(role);
```

### trainings
Stores training sessions created by coaches.

```sql
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  training_date DATE NOT NULL,
  training_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view trainings" 
  ON trainings FOR SELECT 
  USING (true);

CREATE POLICY "Coaches can create trainings" 
  ON trainings FOR INSERT 
  WITH CHECK (
    auth.uid() = coach_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin'))
  );

CREATE POLICY "Coaches can update own trainings" 
  ON trainings FOR UPDATE 
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete own trainings" 
  ON trainings FOR DELETE 
  USING (auth.uid() = coach_id);

-- Indexes
CREATE INDEX idx_trainings_coach_id ON trainings(coach_id);
CREATE INDEX idx_trainings_date ON trainings(training_date);
```

### training_registrations
Stores player registrations for training sessions.

```sql
CREATE TABLE training_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(training_id, player_id)
);

-- Enable RLS
ALTER TABLE training_registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view registrations" 
  ON training_registrations FOR SELECT 
  USING (true);

CREATE POLICY "Players can register for trainings" 
  ON training_registrations FOR INSERT 
  WITH CHECK (
    auth.uid() = player_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('player', 'coach', 'admin'))
  );

CREATE POLICY "Players can unregister from trainings" 
  ON training_registrations FOR DELETE 
  USING (auth.uid() = player_id);

-- Indexes
CREATE INDEX idx_registrations_training_id ON training_registrations(training_id);
CREATE INDEX idx_registrations_player_id ON training_registrations(player_id);
```

## Triggers

### Update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at
  BEFORE UPDATE ON trainings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. Run these SQL commands in your Supabase SQL editor
2. Ensure Row Level Security (RLS) is enabled
3. Test the policies with different user roles

