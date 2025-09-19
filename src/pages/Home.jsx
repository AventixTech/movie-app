import React, { useState, useEffect, useContext } from 'react';
import tmdb from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import BookingModal from '../components/BookingModal';
import Navbar from '../components/Navbar';
import { addBooking } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ genre: '', language: '', rating: 0 });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let endpoint = '';
    const params = [];
    
    const normalizedSearch = search.trim().replace(/\s+/g, ' ');
    if (normalizedSearch) {
      endpoint = `/search/movie?query=${encodeURIComponent(normalizedSearch)}&page=${page}`;
    } else if (filters.genre || filters.language || filters.rating > 0) {
      endpoint = `/discover/movie?page=${page}`;
      if (filters.genre) params.push(`with_genres=${filters.genre}`);
      if (filters.language) params.push(`with_original_language=${filters.language}`);
      if (filters.rating > 0) params.push(`vote_average.gte=${filters.rating}`);
      if (params.length) endpoint += `&${params.join('&')}`;
    } else {
      endpoint = `/movie/popular?page=${page}`;
    }
    tmdb.get(endpoint).then(res => {
      setMovies(res.data.results);
      setTotalPages(Math.min(150, res.data.total_pages));
    });
  }, [search, page, filters.genre, filters.language, filters.rating]);

  const filteredMovies = movies;

  const handleBook = async (bookingDetails) => {
    if (!user) return;
    await addBooking({
      ...bookingDetails,
      movieName: selectedMovie?.title,
      movieDate: bookingDetails.movieDate,
      ticketPrice: bookingDetails.ticketPrice,
      userEmail: user.email,
      userName: user.displayName || bookingDetails.name,
      bookingTime: Date.now(),
    });
    setSelectedMovie(null);
    
  };

  return (
    <div>
      <Navbar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />
      <div className="movie-list">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onBook={setSelectedMovie} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
      <BookingModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
        onBook={handleBook}
        showtime={selectedMovie?.showtime}
        ticketPrice={selectedMovie?.ticketPrice}
      />
    </div>
  );
};

export default Home;
