import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaTimes, FaCheckCircle, FaUser, FaEnvelope, FaChair, FaCalendar, FaTicketAlt, FaClock } from 'react-icons/fa';
import axios from "axios";


const BookingModal = ({ movie, onClose, onBook }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seats, setSeats] = useState(1);
  const [movieDate, setMovieDate] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [latestBooking, setLatestBooking] = useState(null);
  



  useEffect(() => {
    const token = localStorage.getItem("token");
console.log("Token from localStorage:", token);

    if (user) {
      setName(user?.displayName || '');
      setEmail(user?.email || '');
    }
    
    // default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMovieDate(tomorrow.toISOString().split('T')[0]);
   
    
    // default ticket price based on movie
    if (movie) {
      setTicketPrice(movie.ticketPrice || 250);
    }
  }, [user, movie]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (seats < 1 || seats > 5) newErrors.seats = 'Select 1-5 seats';
    
    
    if (!movieDate) newErrors.movieDate = 'Date is required';
    else {
      const selectedDate = new Date(movieDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.movieDate = 'Cannot select past date';
    }
    
    if (!ticketPrice || ticketPrice < 50) newErrors.ticketPrice = 'Invalid price';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {

  e.preventDefault();
   console.log("Form submitted"); // Add this
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to book.");
    return;
  }

  if (!validateForm()) return;

  // Make sure movieId exists
  if (!movie?.id) {
    console.error("Cannot book: movie.id is undefined");
    return;
  }
  const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  console.log("Decoded user:", userData);
const bookingData = { 
  movieId: movie.id,
  movieName: movie.title || '',
  email: userData.email,  // must match backend schema
   name: userData.name,    // must not be empty
  
  userEmail: userData.email, // ✅ send as userEmail
   userName: userData.name, 
  movieDate: movieDate,
  bookingTime: Date.now(),
  seats: Number(seats),
  ticketPrice: String(ticketPrice),
};

  console.log("Sending token:", token);

  try {
    const token = localStorage.getItem("token");
    console.log("Sending token:", token);

    const res = await axios.post(
      "http://localhost:5000/api/bookings",
      bookingData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Booking success:", res.data);
    const createdBooking = res.data.booking;
    setLatestBooking(createdBooking);
    setTotalAmount(res.data.totalAmount || seats * Number(ticketPrice));
    setSuccess(true);

  } catch (err) {
    console.error("Booking failed:", err.response?.data || err.message || err);
     console.error("Full error object:", err); // Add this
    console.error("Error response:", err.response); // Add this
  }
};


  const handleSeatChange = (change) => {
    const newSeats = seats + change;
    if (newSeats >= 1 && newSeats <= 10) {
      setSeats(newSeats);
    }
  };
  const handleCloseSuccess = () => {
    setSuccess(false);
    onClose();
  };


  if (!movie) return null;

  if (!user) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="booking-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Authentication Required</h2>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <div className="auth-required">
              <div className="auth-icon">
                <FaUser />
              </div>
              <p>Please log in to book tickets for {movie.title}.</p>
              <button className="btn btn-primary" onClick={onClose}>
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{success ? 'Booking Confirmed!' : 'Book Tickets'}</h2>
          <button className="close-btn" onClick={success ? handleCloseSuccess :onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {success ? (
            <div className="success-message">
              <div className="success-icon">
                <FaCheckCircle />
              </div>
              <h3>Your booking is confirmed!</h3>
              <p>You've successfully booked {seats} seat(s) for {movie.title}.</p>
              
          <div className="booking-details">
            <p><strong>Date:</strong> {new Date(movieDate).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
            <p><strong>Confirmation #:</strong> {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>

              <div className="success-actions">
                <button className="btn btn-primary" onClick={handleCloseSuccess}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="movie-info">
                <img src={movie.poster || '/placeholder-movie.jpg'} alt={movie.title} />
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre || 'Movie'} • {movie.runtime || '2h 15m'}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser /> Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="seats">
                    <FaChair /> Seats
                  </label>
                  <div className="seat-selector">
                    <button 
                      type="button" 
                      className="seat-btn"
                      onClick={() => handleSeatChange(-1)}
                    >
                      -
                    </button>
                    <span className="seat-count">{seats}</span>
                    <button 
                      type="button" 
                      className="seat-btn"
                      onClick={() => handleSeatChange(1)}
                    >
                      +
                    </button>
                  </div>
                  {errors.seats && <span className="error-text">{errors.seats}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="movieDate">
                    <FaCalendar /> Date
                  </label>
                  <input
                    id="movieDate"
                    type="date"
                    value={movieDate}
                    onChange={e => setMovieDate(e.target.value)}
                    className={errors.movieDate ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.movieDate && <span className="error-text">{errors.movieDate}</span>}
                </div>
              
                <div className="form-group">
                  <label htmlFor="ticketPrice">
                    <FaTicketAlt /> Price per Ticket (₹)
                  </label>
                  <input
                    id="ticketPrice"
                    type="number"
                    min="50"
                    step="50"
                    value={ticketPrice}
                    onChange={e => setTicketPrice(e.target.value)}
                    className={errors.ticketPrice ? 'error' : ''}
                  />
                  {errors.ticketPrice && <span className="error-text">{errors.ticketPrice}</span>}
                </div>
                <div className="total-price">
                  <span>Total Amount</span>
                  <span>
                    ₹{success 
                        ? totalAmount                  
                        : seats * Number(ticketPrice)} 
                  </span>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;