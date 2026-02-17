const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  movieName: { type: String, required: true },
  name: { type: String, required: true },
  user: {ref: 'User', type: mongoose.Schema.Types.ObjectId, required: true},
  email: { type: String, required: true },
  seats: { type: Number, required: true },
  movieDate: { type: String, required: true },
  ticketPrice: { type: String, required: true }, 
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  bookingTime: { type: Number, default: Date.now },
  totalAmount: { type: Number, default: 0 },
  // movieTime: { type: String, required: true },

}, { timestamps: true }); 

module.exports = mongoose.model("Booking", bookingSchema);

