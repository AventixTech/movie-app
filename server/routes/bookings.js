const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
 // enable when JWT ready
const router = express.Router();

// Create booking
// router.post("/", async (req, res) => {
  
//   try {
//     console.log("Booking POST body:", req.body);
//     const { movieId, movieName, seats, movieDate, ticketPrice, userEmail, userName, name, email, } = req.body;

// if (!movieId || !movieName || !seats || !movieDate || !ticketPrice || !userEmail || !userName || !name || !email) {
//   return res.status(400).json({ error: "Missing required fields" });
// }


// const pricePerTicket = Number(ticketPrice);
// const totalAmount = seats * pricePerTicket;

// const newBooking = new Booking({
//   movieId,
//   movieName,
//   seats,
//   movieDate,
//   // movieTime,
//   ticketPrice: pricePerTicket.toString(),
//    userEmail,
//    userName,
//   bookingTime: Date.now(),
//   totalAmount,
//   name,
//   email
// });

//     const savedBooking = await newBooking.save();
//     console.log("Booking saved:", savedBooking);

//     res.status(201).json({ message: "Booking saved successfully", booking: savedBooking });
//   } catch (err) {
//     console.error("Booking POST error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// CREATE BOOKING (JWT PROTECTED)
router.post("/", auth, async (req, res) => {
  try {
   
    console.log("BODY:", req.body);
    console.log("REQ.USER 👉", req.user);

    const {
      movieId,
      movieName,
      seats,
      movieDate,
      ticketPrice,
      userEmail,
      userName,
      name,
      email,
    } = req.body;

    if (
      !movieId ||
      !movieName ||
      !seats ||
      !movieDate ||
      !ticketPrice ||
      !userEmail ||
      !userName ||
      !name ||
      !email
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
 // 🔹 Debug: check user id before saving
    console.log("REQ.USER.ID 👉", req.user?.id);
    const pricePerTicket = Number(ticketPrice);
    const totalAmount = seats * pricePerTicket;

    const newBooking = new Booking({
      movieId,
      movieName,
      seats,
      movieDate,
      ticketPrice: pricePerTicket.toString(),
      user: req.user.id,
      userEmail,
      userName,
      name,
      email,
      bookingTime: Date.now(),
      totalAmount,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: "Booking saved successfully",
      booking: savedBooking,
    });
  } catch (err) {
    console.error("Booking POST error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  Get all bookings (latest first)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Booking GET error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get totals per booking
router.get("/totals", async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $project: {
          movieName: 1,
          seats: 1,
          ticketPrice: 1,
          totalAmount: { $multiply: ["$seats", { $toDouble: "$ticketPrice" }] }
        }
      }
    ]);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get overall revenue
router.get("/revenue", async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$seats", { $toDouble: "$ticketPrice" }] } },
          totalSeats: { $sum: "$seats" },
          totalBookings: { $sum: 1 }
        }
      }
    ]);
    res.json(result[0] || { totalRevenue: 0, totalSeats: 0, totalBookings: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking deleted successfully",
      deletedBooking,
    });
  } catch (error) {
    console.error(" Delete booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Update booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error("Booking UPDATE error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
