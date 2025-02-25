const express = require("express");
const { Redis } = require("@upstash/redis");
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL, // e.g., "https://global-redis.upstash.io"
  token: process.env.KV_REST_API_TOKEN, // your Upstash token
});

const STATUS_KEY = "homeStatus";

// Endpoint to read your status
app.get("/status", async (req, res) => {
  try {
    const status = await redis.get(STATUS_KEY);
    res.json({ status });
  } catch (err) {
    console.error("Error reading status:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update your status (from Geofency webhook)
app.post("/status", async (req, res) => {
  try {
    // Geofency sends: entry = 1 for entering, entry = 0 for leaving
    const entry = req.body.entry;
    
    // Convert Geofency's entry/exit to home/away status
    const status = entry === "1" ? "home" : "away";
    
    await redis.set(STATUS_KEY, status);
    res.json({ message: "Status updated", status });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: err.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;
