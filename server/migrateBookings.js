const mongoose = require("mongoose");
const fs = require("fs");
const Booking = require("./models/Booking");

// 1. Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/moviebooking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("✅ MongoDB connected...");

  try {
    // 2. Read Firebase JSON export
    const data = JSON.parse(fs.readFileSync("bookings.json", "utf8"));

    // 3. Convert Firebase object into array
    const bookingsArray = Object.keys(data.bookings).map((key) => ({
      ...data.bookings[key],
      firebaseId: key, // keep Firebase unique ID
    }));

    // 4. Insert into MongoDB
    await Booking.insertMany(bookingsArray);

    console.log("🎉 Bookings migrated successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    mongoose.connection.close();
  }
});

