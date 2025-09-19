import axios from 'axios';
import { getToken } from '../auth/AuthService';

const BOOKING_API = 'http://localhost:5000/api/bookings';

export async function addBooking(bookingData) {
  return axios.post(BOOKING_API, bookingData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function getBookings() {
  return axios.get(BOOKING_API, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function updateBooking(id, bookingData) {
  return axios.put(`${BOOKING_API}/${id}`, bookingData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function deleteBooking(id) {
  return axios.delete(`${BOOKING_API}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
