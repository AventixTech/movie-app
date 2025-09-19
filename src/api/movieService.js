import axios from 'axios';
import { getToken } from '../auth/AuthService';

const MOVIE_API = 'http://localhost:5000/api/movies';

export async function addMovie(movieData) {
  return axios.post(MOVIE_API, movieData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function getMovies() {
  return axios.get(MOVIE_API);
}

export async function updateMovie(id, movieData) {
  return axios.put(`${MOVIE_API}/${id}`, movieData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function deleteMovie(id) {
  return axios.delete(`${MOVIE_API}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
