import { realtimeDb } from '../auth/firebase';
import { ref, push, get } from 'firebase/database';

export const addBooking = async (booking) => {
  await push(ref(realtimeDb, 'bookings'), booking);
};

export const getBookings = async () => {
  const snapshot = await get(ref(realtimeDb, 'bookings'));
  const val = snapshot.val();
  if (!val) return [];
  return Object.entries(val).map(([id, data]) => ({ id, ...data }));
};
