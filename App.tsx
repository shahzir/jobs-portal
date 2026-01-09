
import React, { useState, useEffect } from 'react';
import { User, AuthState, Job } from './types';
import { MOCK_JOBS, PAKISTAN_CITIES, JOB_CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'home' | 'jobs' | 'profile' | 'auth'>('home');
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('pakjobs_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showApplyNotice, setShowApplyNotice] = useState<Job | null>(null);

  // Auth Forms
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Profile Form
  const [profileBio, setProfileBio] = useState('');
  const [profileSkills, setProfileSkills] = useState('');
  const [profileCity, setProfileCity] = useState('');

  useEffect(() => {
    localStorage.setItem('pakjobs_auth', JSON.stringify(authState));
    if (authState.user) {
      setProfileBio(authState.user.bio || '');
      setProfileSkills(authState.user.skills?.join(', ') || '');
      setProfileCity(authState.user.city || '');
    }
  }, [authState]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: '1',
      fullName: 'Muhammad Ali',
      email: email,
      city: 'Karachi',
      isProfileComplete: false, 
      skills: []
    };
    setAuthState({ user: mockUser, isAuthenticated: true });
    // IMPORTANT: Login krte hi profile complete ka option (we show banner on home or redirect to profile if needed)
    setActivePage('home');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: fullName,
      email: email,
      city: '',
      isProfileComplete: false
    };
    setAuthState({ user: newUser, isAuthenticated: true });
    // IMPORTANT: Requirement - immediately show profile completion
    setActivePage('profile');
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    setActivePage('home');
    setShowApplyNotice(null);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) return;
    
    const updatedUser: User = {
      ...authState.user,
      bio: profileBio,
      skills: profileSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      city: profileCity,
      isProfileComplete: true
    };
    setAuthState({ user: updatedUser, isAuthenticated: true });
    setActivePage('home');
    alert('Shabash! Profile updated. Now you can apply for any job.');
  };

  const handleApply = (job: Job) => {
    if (!authState.isAuthenticated) {
      setActivePage('auth');
      return;
    }
    if (!authState.user?.isProfileComplete) {
      setShowApplyNotice(job);
      return;
    }
    alert(`Application sent for ${job.title}! Good luck.`);
  };

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || job.location === selectedCity;
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const renderHome = () => (
    <div className="space-y-12 pb-20">
      {/* Profile Incomplete Banner - STICKY ALERT */}
      {authState.isAuthenticated && !authState.user?.isProfileComplete && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-4 shadow-lg animate-pulse">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold text-lg">Action Required!</p>
                <p className="text-sm opacity-90">Please complete your profile details to unlock job applications.</p>
              </div>
            </div>
            <button 
              onClick={() => setActivePage('profile')}
              className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-full text-sm font-bold shadow-md transition-all whitespace-nowrap"
            >
              Complete My Profile
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-[#05382b] text-white overflow-hidden pt-12">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/10 skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-emerald-400/10 -skew-x-12 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 w-full">
          <div className="inline-block px-4 py-1.5 bg-emerald-400/20 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
            Connecting Pakistan's Talent
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1]">
            Unlock Your <span className="text-emerald-400">Future</span><br />
            in Every City of Pakistan
          </h1>
          <p className="text-emerald-100/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            From Karachi to Quetta, find the career you've always wanted. 
            No pictures, no noise—just pure opportunities.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-3 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex-1 w-full relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Job title, skills or company..." 
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-gray-900 border-none outline-none text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <select 
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white text-gray-900 border-none outline-none text-base appearance-none cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <button 
              onClick={() => setActivePage('jobs')}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900">Browse by City</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Peshawar', 'Quetta'].map(loc => (
            <div 
              key={loc}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all cursor-pointer text-center"
              onClick={() => { setSelectedCity(loc); setActivePage('jobs'); }}
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold mb-1">{loc}</h4>
              <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Find Jobs</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Latest Jobs</h2>
            <p className="text-gray-500 text-sm mt-1">Recently posted opportunities from top firms.</p>
          </div>
          <button 
            onClick={() => setActivePage('jobs')} 
            className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center group"
          >
            Browse all 
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_JOBS.slice(0, 9).map(job => (
            <JobCard key={job.id} job={job} user={authState.user} onApply={handleApply} />
          ))}
        </div>
      </section>
    </div>
  );

  const renderJobs = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Modern Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-8">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Location</h3>
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-700"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Pakistan</option>
                {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Industry</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {JOB_CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center group cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="h-5 w-5 text-emerald-600 border-gray-200 focus:ring-emerald-500 rounded-lg cursor-pointer transition-all" 
                    />
                    <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => { setSelectedCity(''); setSelectedCategory(''); }}
              className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl text-xs hover:bg-red-100 transition-colors border border-red-100"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Job Listings Grid */}
        <main className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">{filteredJobs.length} Jobs</h2>
              <p className="text-gray-400 text-sm">Showing active roles in Pakistan.</p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-gray-400">Sort by:</span>
              <select className="text-xs font-black text-gray-700 border-none bg-transparent focus:ring-0 cursor-pointer">
                <option>Newest First</option>
                <option>Salary: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} user={authState.user} onApply={handleApply} />
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">Try adjusting your filters or search keywords to find more roles.</p>
                <button 
                  onClick={() => { setSelectedCity(''); setSelectedCategory(''); setSearchQuery(''); }}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                >
                  Reset Everything
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );

  const renderProfile = () => {
    const isNewUser = !authState.user?.isProfileComplete;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-emerald-900/5 overflow-hidden border border-emerald-50">
          <div className="bg-emerald-600 py-16 px-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="0" cy="0" r="40" fill="white" />
                <circle cx="100" cy="100" r="30" fill="white" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-white flex items-center justify-center border-4 border-emerald-500 shadow-2xl mx-auto mb-6 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-5xl font-black text-emerald-600">
                  {authState.user?.fullName?.[0]}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white">
                {isNewUser ? 'Complete Profile' : 'Professional Dashboard'}
              </h1>
              <p className="text-emerald-100 text-sm mt-2 font-medium">Building the future of Pakistan's workforce.</p>
            </div>
          </div>
          
          <div className="p-10 md:p-16">
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2 px-1">Current City</label>
                  <select 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-700"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                  >
                    <option value="">Select your city...</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="relative">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2 px-1">Top Skills (Separated by commas)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sales, Python, Management, Accounting"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-700"
                    value={profileSkills}
                    onChange={(e) => setProfileSkills(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2 px-1">About Your Professional Career</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Briefly describe your experience and what you're looking for..."
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-700 resize-none"
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                >
                  Finalize & Apply
                </button>
                <button 
                  type="button"
                  onClick={() => setActivePage('home')}
                  className="px-10 py-5 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Later
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderAuth = () => (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8faf9] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-emerald-900/5 p-10 md:p-14 border border-emerald-50">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3">{isLoginMode ? 'Ahlan wa Sahlan' : 'Create Profile'}</h2>
          <p className="text-gray-400 font-medium">{isLoginMode ? 'Welcome back to Pakistan\'s No. 1 Job Portal.' : 'Join 50,000+ professionals across Pakistan.'}</p>
        </div>

        <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-5">
          {!isLoginMode && (
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <input 
            type="email" 
            required
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            required
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-700"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 mt-4"
          >
            {isLoginMode ? 'Login to Account' : 'Register Now'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-emerald-600 font-black text-sm hover:underline tracking-tight"
          >
            {isLoginMode ? 'Don\'t have an account? Sign Up Free' : 'Already registered? Login Here'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-200">
      <Navbar 
        user={authState.user} 
        onLogout={handleLogout} 
        onNavigate={setActivePage} 
        activePage={activePage}
      />
      
      {/* Enhanced Notice Modal */}
      {showApplyNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-3xl text-center border border-emerald-50 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Complete Profile First</h3>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              Employers need to see your <span className="text-emerald-600 font-bold">Skills</span> and <span className="text-emerald-600 font-bold">City</span> before you can apply for <span className="text-gray-900 font-bold">{showApplyNotice.title}</span>.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => { setShowApplyNotice(null); setActivePage('profile'); }}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
              >
                Go to Profile Setup
              </button>
              <button 
                onClick={() => setShowApplyNotice(null)}
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activePage === 'home' && renderHome()}
        {activePage === 'jobs' && renderJobs()}
        {activePage === 'profile' && renderProfile()}
        {activePage === 'auth' && renderAuth()}
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-[#05382b] text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center">
                <span className="text-3xl font-black text-emerald-400 tracking-tighter">Pak</span>
                <span className="text-3xl font-black text-white tracking-tighter">Jobs</span>
              </div>
              <p className="text-emerald-100/50 text-base leading-relaxed font-medium">
                The largest and most trusted job portal in Pakistan. Empowering the youth and professionals with real opportunities from real companies.
              </p>
              <div className="flex space-x-5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
                    <span className="text-xs">S{i}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs mb-8">Resources</h4>
              <ul className="space-y-5">
                {['Find Jobs', 'Career Advice', 'Resume Builder', 'Premium Subscriptions', 'Job Alerts'].map(item => (
                  <li key={item} className="text-emerald-100/70 hover:text-emerald-300 transition-colors cursor-pointer font-bold">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs mb-8">For Businesses</h4>
              <ul className="space-y-5">
                {['Post a Job', 'Search Talent', 'Enterprise Solutions', 'Advertising', 'Customer Success'].map(item => (
                  <li key={item} className="text-emerald-100/70 hover:text-emerald-300 transition-colors cursor-pointer font-bold">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs mb-8">Cities</h4>
              <ul className="grid grid-cols-2 gap-4">
                {['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Peshawar', 'Quetta', 'Multan', 'Sialkot'].map(item => (
                  <li key={item} className="text-emerald-100/70 hover:text-emerald-300 transition-colors cursor-pointer font-bold">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-emerald-100/30 text-xs font-black uppercase tracking-widest">
            <p>© 2024 PakJobs Portal PVT LTD. Registered in Islamabad.</p>
            <div className="flex space-x-12">
              <span className="hover:text-emerald-300 cursor-pointer">Privacy</span>
              <span className="hover:text-emerald-300 cursor-pointer">Security</span>
              <span className="hover:text-emerald-300 cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
