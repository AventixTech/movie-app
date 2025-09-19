import axios from 'axios';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '888addb98bb72ec89f4d1b5244614680', // TMDb API key
  },
});

export default tmdb;
