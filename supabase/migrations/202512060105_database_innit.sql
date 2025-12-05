-- MuxDay Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  github VARCHAR(100),
  codepen VARCHAR(100),
  linkedin VARCHAR(100),
  instagram VARCHAR(100),
  discord VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  html_content TEXT DEFAULT '',
  css_content TEXT DEFAULT '',
  js_content TEXT DEFAULT '',
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Project likes table
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project comments table
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project views tracking (for analytics)
CREATE TABLE project_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  visitor_id VARCHAR(255), -- Can be user_id or anonymous session ID
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project analytics summary (materialized view for performance)
CREATE TABLE project_analytics (
  project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OpenGraph metadata for projects
CREATE TABLE project_metadata (
  project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  og_title VARCHAR(200),
  og_description TEXT,
  og_image TEXT,
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(200),
  twitter_description TEXT,
  twitter_image TEXT,
  custom_meta JSONB, -- For any additional custom meta tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User followers table
CREATE TABLE user_followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- User sessions (for analytics)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_visibility ON projects(visibility);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_views ON projects(views DESC);
CREATE INDEX idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX idx_project_likes_user_id ON project_likes(user_id);
CREATE INDEX idx_project_comments_project_id ON project_comments(project_id);
CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_project_views_visitor_id ON project_views(visitor_id);
CREATE INDEX idx_project_views_viewed_at ON project_views(viewed_at);
CREATE INDEX idx_user_followers_follower_id ON user_followers(follower_id);
CREATE INDEX idx_user_followers_following_id ON user_followers(following_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at BEFORE UPDATE ON project_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update project analytics
CREATE OR REPLACE FUNCTION update_project_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO project_analytics (project_id, total_views, unique_visitors, likes_count, comments_count, last_viewed_at)
    VALUES (
        NEW.project_id,
        (SELECT COUNT(*) FROM project_views WHERE project_id = NEW.project_id),
        (SELECT COUNT(DISTINCT visitor_id) FROM project_views WHERE project_id = NEW.project_id),
        (SELECT COUNT(*) FROM project_likes WHERE project_id = NEW.project_id),
        (SELECT COUNT(*) FROM project_comments WHERE project_id = NEW.project_id),
        NOW()
    )
    ON CONFLICT (project_id) DO UPDATE SET
        total_views = (SELECT COUNT(*) FROM project_views WHERE project_id = NEW.project_id),
        unique_visitors = (SELECT COUNT(DISTINCT visitor_id) FROM project_views WHERE project_id = NEW.project_id),
        likes_count = (SELECT COUNT(*) FROM project_likes WHERE project_id = NEW.project_id),
        comments_count = (SELECT COUNT(*) FROM project_comments WHERE project_id = NEW.project_id),
        last_viewed_at = NOW(),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for analytics
CREATE TRIGGER update_analytics_on_view AFTER INSERT ON project_views
    FOR EACH ROW EXECUTE FUNCTION update_project_analytics();

CREATE TRIGGER update_analytics_on_like AFTER INSERT OR DELETE ON project_likes
    FOR EACH ROW EXECUTE FUNCTION update_project_analytics();

CREATE TRIGGER update_analytics_on_comment AFTER INSERT OR DELETE ON project_comments
    FOR EACH ROW EXECUTE FUNCTION update_project_analytics();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(p_user_id UUID, p_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug from project name
    base_slug := LOWER(REGEXP_REPLACE(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    final_slug := base_slug;
    
    -- Check if slug exists and append counter if needed
    WHILE EXISTS (SELECT 1 FROM projects WHERE user_id = p_user_id AND slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all public profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can view public projects" ON projects
    FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Project likes policies
CREATE POLICY "Anyone can view likes" ON project_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like projects" ON project_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike projects" ON project_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Project comments policies
CREATE POLICY "Anyone can view comments on public projects" ON project_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_comments.project_id 
            AND (projects.visibility = 'public' OR projects.user_id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can comment" ON project_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON project_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON project_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for avatars and banners
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true),
       ('banners', 'banners', true),
       ('project-assets', 'project-assets', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Banner images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can upload banners" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'banners' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own banners" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'banners' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );