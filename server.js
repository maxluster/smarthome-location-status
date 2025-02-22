const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Get the status from Vercel KV store
app.get("/status", async (req, res) => {
  try {
    const { KEY } = process.env;
    const response = await fetch(
      `https://${process.env.VERCEL_DOMAIN}/kv/${KEY}`,
    );
    if (!response.ok) {
      throw new Error("Failed to get status from Vercel KV store");
    }
    const statusCode = await response.json();
    res.status(statusCode).send(statusCode);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Failed to get status from Vercel KV store" });
  }
});

// Set the status to 'away'
app.post("/status/away", async (req, res) => {
  try {
    const { KEY } = process.env;
    await fetch(`https://${process.env.VERCEL_DOMAIN}/kv/${KEY}`, {
      method: "PUT",
      body: JSON.stringify({ value: "away" }),
    });
    res.status(200).send({ message: 'Status set to "away"' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to set status to "away"' });
  }
});

// Set the status to 'home'
app.post("/status/home", async (req, res) => {
  try {
    const { KEY } = process.env;
    await fetch(`https://${process.env.VERCEL_DOMAIN}/kv/${KEY}`, {
      method: "PUT",
      body: JSON.stringify({ value: "home" }),
    });
    res.status(200).send({ message: 'Status set to "home"' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to set status to "home"' });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
