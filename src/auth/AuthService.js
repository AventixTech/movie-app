import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem('token', res.data.token);
   console.log(" Login Successful:");
  console.log("User:", res.data.user);
  console.log("JWT:", res.data.token);
  return res;
}

export async function register(name, email, password) {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
}

export function getToken() {
  return localStorage.getItem('token');
}
