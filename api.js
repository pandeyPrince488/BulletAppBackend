const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config(); // Load environment variables from .env file

const bookingmodel = require('./booking');
const adminmodel = require('./aRegister');
const baddmodel = require('./bikeAdd');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://bullet-k42eosfx7-prince-pandeys-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight OPTIONS requests

// Middleware
app.use(express.json());
app.use(express.static("attach"));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Client Booking
app.post("/ClintBooking", async (req, res) => {
  try {
    const { cname, cemail, service, mobile, detail } = req.body;
    await bookingmodel.create({ cname, cemail, service, mobile, detail });
    res.status(200).json({ msg: "Data Inserted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid arguments" });
  }
});

// Admin Registration
app.post("/adminRegister", async (req, res) => {
  try {
    const { id, yname, mobile, password } = req.body;
    await adminmodel.create({ id, yname, mobile, password });
    res.status(200).json({ msg: "Data inserted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "This phone number may already be registered" });
  }
});

// Admin Login
app.post("/adminLogin", async (req, res) => {
  const { yname, password } = req.body;
  try {
    let login = await adminmodel.findOne({ password });
    if (login) {
      res.send(login);
    } else {
      res.status(400).json({ error: "Wrong User" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch Service Details
app.get("/fetchDetail", async (req, res) => {
  try {
    let data = await bookingmodel.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'attach');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  }
});
const upload = multer({ storage: storage }).single('attachment');

// Add Bike
app.post('/adding', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: "Error in Image Uploading" });
    }
    try {
      const { bname, mileage, description, price } = req.body;
      await baddmodel.create({
        bname, mileage, description, price,
        attachment: req.file.filename
      });
      res.status(200).json({ Success: "Your bike is Added" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Bike is not added" });
    }
  });
});

// Fetch Bike Details
app.get("/fetchBikedetail", async (req, res) => {
  try {
    let data = await baddmodel.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Dynamic Port for Render
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
