import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

const genres = [
  { id: '', name: 'All Genres' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const languages = [
  { code: '', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'th', name: 'Thai' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ms', name: 'Malay' },
  { code: 'fa', name: 'Persian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'ur', name: 'Urdu' },
];

const Navbar = ({ filters, setFilters, search, setSearch, filterDate, setFilterDate }) => {
  const isAdminDashboard = typeof window !== 'undefined' && window.location.pathname === '/admin';
  const [theme, setTheme] = useState('light');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useContext(AuthContext);
   const [showAuthModal, setShowAuthModal] = useState(false);
  console.log("Current user:", user);
  console.log("Is admin:", isAdmin);
  console.log("User email:", user?.email);
  

  // Debug logging
  useEffect(() => {
    console.log("Current user:", user);
    console.log("Is admin:", isAdmin);
    console.log("User email:", user?.email);
  }, [user, isAdmin]);

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <nav className="navbar sticky-navbar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <h1 style={{ marginRight: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Movie Explorer</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          {search !== undefined && setSearch && (
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                minWidth: '160px',
                maxWidth: '220px',
                background: theme === 'dark' ? '#222' : '#fff',
                color: theme === 'dark' ? '#fff' : '#222',
                border: theme === 'dark' ? '1px solid #444' : '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.18)' : '0 2px 8px rgba(55,48,163,0.10)',
                outline: 'none',
              }}
            />
          )}
          
          {filters && setFilters && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => setShowDropdown(d => !d)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: theme === 'dark' ? '1px solid #444' : '1px solid #e5e7eb', background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', cursor: 'pointer' }}
              >
                Filters ▼
              </button>
              {showDropdown && (
                <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 10, background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', border: theme === 'dark' ? '1px solid #444' : '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', padding: '1rem', minWidth: '220px' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label htmlFor="genre-filter" style={{ marginRight: '0.5rem' }}>Genre:</label>
                    <select
                      id="genre-filter"
                      value={filters.genre}
                      onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}
                      style={{ padding: '0.5rem', borderRadius: '8px', border: theme === 'dark' ? '1px solid #444' : '1px solid #e5e7eb', background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', width: '100%' }}
                    >
                      {genres.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label htmlFor="language-filter" style={{ marginRight: '0.5rem' }}>Language:</label>
                    <select
                      id="language-filter"
                      value={filters.language}
                      onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
                      style={{ padding: '0.5rem', borderRadius: '8px', border: theme === 'dark' ? '1px solid #444' : '1px solid #e5e7eb', background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222', width: '100%' }}
                    >
                      {languages.map(l => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rating-slider" style={{ marginRight: '0.5rem' }}>Min Rating: {filters.rating || 0}</label>
                    <input
                      id="rating-slider"
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.rating || 0}
                      onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAdminDashboard && filterDate !== undefined && setFilterDate && (
            <div className="filter-bar" style={{ position: 'relative', minWidth: '180px' }}>
              <input
                id="date-filter"
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem', background: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#222' }}
              />
            </div>
          )}
          
          <button onClick={toggleTheme} style={{ padding: '0.5rem 1rem', background: '#222', color: '#fff', border: 'none' }}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          
          {/* Show Admin Dashboard button only if user is admin */}
          {user && isAdmin && (
  <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
)}

        </div>
        
        {/* <div style={{ marginLeft: '1.5rem' }}>
          {user ? (
  <>
    <span>{user.name || user.email}</span>

    <button onClick={logout}>Logout</button>
  </>
) : (
  <button onClick={() => navigate('/login')}>Login / Signup</button>
)}

        </div>
      </div>
    </nav>
  );
}; */}
<div style={{ marginLeft: '1.5rem' }}>
        {user ? (
          <>
            <span>{user.name || user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setShowAuthModal(true)}>Login / Signup</button>
        )}
      </div>
      
      {/* Add the AuthModal component */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
</div>
     </nav>
  );
};


export default Navbar;