import axios from 'axios';
import { getToken } from '../auth/AuthService';

const USER_API = 'http://localhost:5000/api/users';

export async function addUser(userData) {
  return axios.post(USER_API, userData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function getUsers() {
  return axios.get(USER_API, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function updateUser(id, userData) {
  return axios.put(`${USER_API}/${id}`, userData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function deleteUser(id) {
  return axios.delete(`${USER_API}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
