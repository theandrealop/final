-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_signups table
CREATE TABLE IF NOT EXISTS public.newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2) NOT NULL CHECK (original_price > 0),
  discount INTEGER NOT NULL CHECK (discount >= 0 AND discount <= 100),
  dates TEXT NOT NULL,
  airline TEXT NOT NULL,
  stops TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'terminated')),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_origin ON public.offers(origin);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON public.offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_signups(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for newsletter_signups table
CREATE POLICY "Anyone can insert newsletter signup" ON public.newsletter_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view newsletter signups" ON public.newsletter_signups
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for offers table
CREATE POLICY "Anyone can view active offers" ON public.offers
  FOR SELECT USING (status = 'active');

CREATE POLICY "Only authenticated users can view all offers" ON public.offers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
