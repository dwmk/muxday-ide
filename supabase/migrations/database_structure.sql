-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE CHECK (char_length(username) >= 3),
  display_name text,
  avatar_url text,
  banner_url text,
  bio text,
  is_verified boolean DEFAULT false,
  socials jsonb DEFAULT '{"github": "", "codepen": "", "discord": "", "linkedin": "", "instagram": ""}'::jsonb,
  updated_at timestamp with time zone,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug text NOT NULL,
  user_id uuid NOT NULL,
  title text DEFAULT 'Untitled Mux'::text,
  html_code text DEFAULT ''::text,
  css_code text DEFAULT ''::text,
  js_code text DEFAULT ''::text,
  views_count bigint DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);