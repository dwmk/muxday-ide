-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Profiles Table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  display_name text,
  avatar_url text, -- Can be remote or bucket path
  banner_url text,
  bio text,
  is_verified boolean default false,
  socials jsonb default '{"github": "", "codepen": "", "linkedin": "", "instagram": "", "discord": ""}',
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

-- 3. Create Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  slug text not null, -- for url /username/slug
  user_id uuid references profiles(id) on delete cascade not null,
  title text default 'Untitled Mux',
  html_code text default '',
  css_code text default '',
  js_code text default '',
  views_count bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, slug)
);

-- 4. Create Storage Bucket for User Assets
insert into storage.buckets (id, name, public) values ('assets', 'assets', true);

-- 5. RLS Policies (Security)
alter table profiles enable row level security;
alter table projects enable row level security;

-- Profiles: Public read, User update own
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Projects: Public read, User update own
create policy "Projects are viewable by everyone." on projects for select using (true);
create policy "Users can create projects." on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects." on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects." on projects for delete using (auth.uid() = user_id);

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'assets' );
create policy "User Upload" on storage.objects for insert with check ( bucket_id = 'assets' and auth.uid() = (storage.foldername(name))[1]::uuid );

-- 6. RPC for Atomic View Increment
create or replace function increment_view_count(project_id uuid)
returns void as $$
begin
  update projects
  set views_count = views_count + 1
  where id = project_id;
end;
$$ language plpgsql;