const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests

// Multer Setup (for handling file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set unique filename
  },
});
const upload = multer({ storage: storage });

// POST route to handle report submission
app.post("/api/report", upload.single("evidence"), (req, res) => {
  const { crimeType, details } = req.body;
  const evidence = req.file; // The uploaded file data will be in req.file

  // Simulate saving report to database and generating a ticket ID
  const ticketId = "CYB" + Math.floor(Math.random() * 1000000);

  console.log("Received report:", crimeType, details, evidence);

  // Respond with a success message and ticket ID
  res.json({
    success: true,
    ticketId: ticketId,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
