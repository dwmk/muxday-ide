import React, { useState, useEffect, useRef } from 'react';
import { Play, Save, Share2, Eye, User, Code, Settings, LogOut, Plus, Trash2, Edit2, Check, X, Upload, ExternalLink as LinkIcon, Github, Linkedin, Instagram, MessageCircle, Award, Users, TrendingUp, ExternalLink, Menu, Search, Star, Heart, MessageSquare, Folder, Home, Grid, List } from 'lucide-react';

// MuxDay - Full-Featured Static Site IDE
const MuxDay = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [uploadType, setUploadType] = useState('url');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const iframeRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isLoggedIn && !user) {
      setUser({
        id: 1,
        username: 'demo_user',
        displayName: 'Demo User',
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop',
        bio: 'Building awesome projects on MuxDay',
        github: 'demouser',
        codepen: 'demouser',
        linkedin: 'demouser',
        instagram: 'demouser',
        discord: 'demouser#1234'
      });
      setProjects([
        { id: 1, name: 'Animated Button', views: 1234, likes: 89, visibility: 'public', created: '2024-12-01' },
        { id: 2, name: 'Glassmorphism Card', views: 892, likes: 56, visibility: 'public', created: '2024-11-28' }
      ]);
    }
  }, [isLoggedIn]);

  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    const document = iframeRef.current.contentDocument;
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch(e) {
              console.error('Script error:', e);
            }
          </script>
        </body>
      </html>
    `;
    
    document.open();
    document.write(content);
    document.close();
  };

  useEffect(() => {
    if (currentProject && iframeRef.current) {
      updatePreview();
    }
  }, [html, css, js, currentProject]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
    setCurrentProject(null);
  };

  const createNewProject = () => {
    const newProject = {
      id: Date.now(),
      name: 'Untitled Project',
      views: 0,
      likes: 0,
      visibility: 'public',
      created: new Date().toISOString().split('T')[0]
    };
    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setHtml('<h1>Hello MuxDay!</h1>');
    setCss('h1 { color: #5865F2; font-family: sans-serif; }');
    setJs('console.log("Welcome to MuxDay!");');
    setCurrentView('editor');
  };

  const saveProject = () => {
    alert('Project saved successfully!');
  };

  const deleteProject = (id) => {
    if (confirm('Delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
        setCurrentView('dashboard');
      }
    }
  };

  const openProject = (project) => {
    setCurrentProject(project);
    setHtml('<div class="container"><h1>Sample Project</h1><p>Edit me!</p></div>');
    setCss('.container { padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 1rem; color: white; }');
    setJs('document.querySelector("h1").addEventListener("click", () => alert("Hello!"));');
    setCurrentView('editor');
  };

  const CodeEditor = ({ value, onChange, language }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full p-4 bg-[#1e1e1e] text-gray-100 font-mono text-sm resize-none border-0 outline-none"
      spellCheck={false}
      placeholder={`Write your ${language.toUpperCase()} here...`}
    />
  );

  if (!isLoggedIn && currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#5865F2] via-[#7289DA] to-[#99AAB5] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
              MuxDay
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Build, Share, and Discover Amazing Web Projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLogin}
                className="px-8 py-4 bg-white text-[#5865F2] rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setCurrentView('explore')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
              >
                Explore Projects
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Code, title: 'Live Editor', desc: 'Code in real-time with instant preview' },
              { icon: Users, title: 'Community', desc: 'Share projects with developers worldwide' },
              { icon: Award, title: 'Verified Profiles', desc: 'Build your coding portfolio' }
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-white">
                <feature.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#36393f]">
        <nav className="bg-[#202225] border-b border-[#1e1f22] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => setShowSidebar(!showSidebar)} className="text-gray-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">MuxDay</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={createNewProject} className="px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {!isMobile && 'New Project'}
            </button>
            <button onClick={() => setCurrentView('profile')} className="text-gray-400 hover:text-white">
              <User className="w-6 h-6" />
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </nav>

        <div className="flex">
          {(!isMobile || showSidebar) && (
            <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'w-64'} bg-[#2f3136] p-4 border-r border-[#1e1f22]`}>
              <div className="flex items-center gap-3 mb-6 p-3 bg-[#202225] rounded-lg">
                <img src={user?.avatar} alt="" className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-white truncate">{user?.displayName}</p>
                    {user?.verified && <Award className="w-4 h-4 text-[#5865F2]" />}
                  </div>
                  <p className="text-sm text-gray-400 truncate">@{user?.username}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-[#5865F2] rounded-lg">
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                <button onClick={() => setCurrentView('profile')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#36393f] rounded-lg transition-colors">
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button onClick={() => setCurrentView('explore')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#36393f] rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                  Explore
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-3xl font-bold text-white">My Projects</h2>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#202225] text-white rounded-lg border border-[#1e1f22] focus:border-[#5865F2] outline-none"
                  />
                </div>
                <div className="flex bg-[#202225] rounded-lg p-1">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#5865F2] text-white' : 'text-gray-400'}`}>
                    <Grid className="w-5 h-5" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#5865F2] text-white' : 'text-gray-400'}`}>
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((project) => (
                <div key={project.id} className={`bg-[#2f3136] rounded-xl overflow-hidden border border-[#1e1f22] hover:border-[#5865F2] transition-all ${viewMode === 'list' ? 'flex items-center' : ''}`}>
                  <div className={`bg-gradient-to-br from-[#5865F2] to-[#7289DA] ${viewMode === 'grid' ? 'h-48' : 'w-48 h-full'} flex items-center justify-center`}>
                    <Code className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {project.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {project.likes}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openProject(project)} className="flex-1 px-3 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors text-sm font-medium">
                        Open
                      </button>
                      <button onClick={() => deleteProject(project.id)} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-20">
                <Folder className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6">Create your first project to get started</p>
                <button onClick={createNewProject} className="px-6 py-3 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors">
                  Create Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-[#36393f]">
        <nav className="bg-[#202225] border-b border-[#1e1f22] px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">MuxDay</h1>
          <button onClick={() => setCurrentView('dashboard')} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </nav>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-[#2f3136] rounded-xl overflow-hidden border border-[#1e1f22]">
            <div className="relative">
              <img src={user?.banner} alt="" className="w-full h-48 object-cover" />
              {editingProfile && (
                <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70">
                  <Upload className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                <div className="relative">
                  <img src={user?.avatar} alt="" className="w-32 h-32 rounded-full border-4 border-[#2f3136]" />
                  {editingProfile && (
                    <button className="absolute bottom-0 right-0 p-2 bg-[#5865F2] rounded-full text-white hover:bg-[#4752C4]">
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex-1 pt-16 md:pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-bold text-white">{user?.displayName}</h2>
                      {user?.verified && <Award className="w-6 h-6 text-[#5865F2]" />}
                    </div>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors flex items-center gap-2"
                    >
                      {editingProfile ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      {editingProfile ? 'Save' : 'Edit Profile'}
                    </button>
                  </div>

                  <p className="text-gray-400 mb-4">@{user?.username}</p>

                  {editingProfile ? (
                    <textarea
                      value={profileData.bio || user?.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full p-3 bg-[#202225] text-white rounded-lg border border-[#1e1f22] outline-none resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-300 mb-6">{user?.bio}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { icon: Github, label: 'GitHub', value: user?.github },
                      { icon: Code, label: 'CodePen', value: user?.codepen },
                      { icon: Linkedin, label: 'LinkedIn', value: user?.linkedin },
                      { icon: Instagram, label: 'Instagram', value: user?.instagram },
                      { icon: MessageCircle, label: 'Discord', value: user?.discord }
                    ].map((social, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-[#202225] rounded-lg">
                        <social.icon className="w-5 h-5 text-[#5865F2]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">{social.label}</p>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={profileData[social.label.toLowerCase()] || social.value}
                              onChange={(e) => setProfileData({ ...profileData, [social.label.toLowerCase()]: e.target.value })}
                              className="w-full bg-transparent text-white text-sm outline-none"
                            />
                          ) : (
                            <p className="text-sm text-white truncate">{social.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 p-4 bg-[#202225] rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                  <p className="text-sm text-gray-400">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{projects.reduce((acc, p) => acc + p.views, 0)}</p>
                  <p className="text-sm text-gray-400">Total Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{projects.reduce((acc, p) => acc + p.likes, 0)}</p>
                  <p className="text-sm text-gray-400">Total Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'editor') {
    return (
      <div className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden">
        <nav className="bg-[#202225] border-b border-[#1e1f22] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('dashboard')} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={currentProject?.name}
              onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
              className="bg-transparent text-white font-semibold text-lg outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveProject} className="px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              {!isMobile && 'Save'}
            </button>
            <button className="px-4 py-2 bg-[#43b581] text-white rounded-lg hover:bg-[#3ca374] transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              {!isMobile && 'Share'}
            </button>
          </div>
        </nav>

        <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden`}>
          <div className={`${isMobile ? (isPreviewMode ? 'hidden' : 'flex-1') : 'w-1/2'} flex flex-col border-r border-[#1e1f22]`}>
            <div className="flex bg-[#2f3136] border-b border-[#1e1f22]">
              {['html', 'css', 'js'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-white bg-[#1e1e1e] border-b-2 border-[#5865F2]'
                      : 'text-gray-400 hover:text-white hover:bg-[#36393f]'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {activeTab === 'html' && <CodeEditor value={html} onChange={setHtml} language="html" />}
              {activeTab === 'css' && <CodeEditor value={css} onChange={setCss} language="css" />}
              {activeTab === 'js' && <CodeEditor value={js} onChange={setJs} language="javascript" />}
            </div>
          </div>

          <div className={`${isMobile ? (isPreviewMode ? 'flex-1' : 'hidden') : 'w-1/2'} flex flex-col bg-white`}>
            <div className="bg-[#2f3136] px-4 py-3 flex items-center justify-between border-b border-[#1e1f22]">
              <span className="text-white font-medium">Preview</span>
              {isMobile && (
                <button onClick={() => setIsPreviewMode(!isPreviewMode)} className="text-gray-400 hover:text-white">
                  <Code className="w-5 h-5" />
                </button>
              )}
            </div>
            <iframe
              ref={iframeRef}
              title="preview"
              sandbox="allow-scripts"
              className="flex-1 w-full border-0"
            />
          </div>
        </div>

        {isMobile && !isPreviewMode && (
          <button
            onClick={() => setIsPreviewMode(true)}
            className="fixed bottom-4 right-4 p-4 bg-[#5865F2] text-white rounded-full shadow-lg hover:bg-[#4752C4] transition-colors"
          >
            <Eye className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default MuxDay;