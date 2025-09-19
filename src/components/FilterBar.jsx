import React from 'react';

const FilterBar = ({ filters, setFilters }) => (
  <div className="filter-bar" style={{ background: 'linear-gradient(90deg, #e0e7ff 0%, #c7d2fe 100%)', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 12px rgba(55,48,163,0.08)' }}>
    <select value={filters.genre} onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))} style={{ background: '#3730a3', color: '#fff', borderRadius: '8px', border: 'none', padding: '0.6rem 1rem', fontSize: '1rem', marginRight: '1rem' }}>
      <option value="" style={{ background: '#fff', color: '#3730a3' }}>All Genres</option>
      
    </select>
    <select value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))} style={{ background: '#3730a3', color: '#fff', borderRadius: '8px', border: 'none', padding: '0.6rem 1rem', fontSize: '1rem', marginRight: '1rem' }}>
      <option value="" style={{ background: '#fff', color: '#3730a3' }}>All Languages</option>
     
    </select>
    <input type="range" min="0" max="10" value={filters.rating} onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))} style={{ accentColor: '#5145cd', marginRight: '1rem' }} />
    <span style={{ color: '#3730a3', fontWeight: 600 }}>Min Rating: {filters.rating}</span>
  </div>
);

export default FilterBar;
