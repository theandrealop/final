-- Remove newsletter_signups and offers tables since we're not using them anymore
DROP TABLE IF EXISTS public.newsletter_signups CASCADE;
DROP TABLE IF EXISTS public.offers CASCADE;

-- Remove related functions and triggers
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_timestamp() CASCADE;

-- Keep only the users table for authentication
-- The users table and auth functions remain unchanged
