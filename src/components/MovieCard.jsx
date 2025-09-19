import React from 'react';


const languageNames = {
  en: 'English', hi: 'Hindi', fr: 'French', es: 'Spanish', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', de: 'German', it: 'Italian', ru: 'Russian', pt: 'Portuguese', ar: 'Arabic', tr: 'Turkish', pl: 'Polish', nl: 'Dutch', sv: 'Swedish', da: 'Danish', fi: 'Finnish', no: 'Norwegian', el: 'Greek', he: 'Hebrew', th: 'Thai', cs: 'Czech', hu: 'Hungarian', ro: 'Romanian', id: 'Indonesian', vi: 'Vietnamese', uk: 'Ukrainian', bg: 'Bulgarian', ms: 'Malay', fa: 'Persian', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', pa: 'Punjabi', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', ur: 'Urdu'
};

const MovieCard = ({ movie, onBook }) => (
  <div className="movie-card">
    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
    <h2>{movie.title}</h2>
    <div className="movie-card-info">
      <span className="movie-pill rating">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
      {Array.isArray(movie.genre_names) && movie.genre_names.length > 0 && (
        <span className="movie-pill genre">{movie.genre_names.join(", ")}</span>
      )}
      {Array.isArray(movie.genres) && movie.genres.length > 0 && (
        <span className="movie-pill genre">{movie.genres.map(g => g.name).join(", ")}</span>
      )}
      {movie.original_language && <span className="movie-pill language">{languageNames[movie.original_language] || movie.original_language.toUpperCase()}</span>}
    </div>
    <button onClick={() => onBook(movie)}>Book</button>
  </div>
);

export default MovieCard;
