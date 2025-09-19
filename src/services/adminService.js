import axios from 'axios';

export const updateBooking = async (_id, data) => {
  return await axios.put(`http://localhost:5000/api/bookings/${_id}`, data);
};

export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete failed", err.response?.data || err.message);
    throw err;
  }
};
