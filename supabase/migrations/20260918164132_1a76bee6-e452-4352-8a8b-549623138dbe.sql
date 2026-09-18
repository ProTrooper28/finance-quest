CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT 'Explorer',
  avatar_url text,
  financial_goal text,
  language text NOT NULL DEFAULT 'English',
  xp integer NOT NULL DEFAULT 1240,
  coins integer NOT NULL DEFAULT 480,
  level integer NOT NULL DEFAULT 4,
  streak integer NOT NULL DEFAULT 7,
  leaderboard_rank integer NOT NULL DEFAULT 128,
  onboarding_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_slug text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  quiz_score integer CHECK (quiz_score BETWEEN 0 AND 100),
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_progress TO authenticated;
GRANT ALL ON public.module_progress TO service_role;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own module progress" ON public.module_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_module_progress_updated_at BEFORE UPDATE ON public.module_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.portfolio_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  average_price numeric NOT NULL DEFAULT 0 CHECK (average_price >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_positions TO authenticated;
GRANT ALL ON public.portfolio_positions TO service_role;
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own portfolio" ON public.portfolio_positions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_portfolio_positions_updated_at BEFORE UPDATE ON public.portfolio_positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.watchlist TO authenticated;
GRANT ALL ON public.watchlist TO service_role;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own watchlist" ON public.watchlist FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.mentor_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  parts jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_messages TO authenticated;
GRANT ALL ON public.mentor_messages TO service_role;
ALTER TABLE public.mentor_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own mentor messages" ON public.mentor_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX mentor_messages_user_created_idx ON public.mentor_messages(user_id, created_at);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(COALESCE(NEW.email, 'Explorer'), '@', 1))) ON CONFLICT (id) DO NOTHING; RETURN NEW; END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();