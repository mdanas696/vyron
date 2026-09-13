require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "VYRON API is running." });
});

app.use("/api/auth", authRoutes);

// Sprint 2+ will mount here:
// app.use("/api/events", eventRoutes);
// app.use("/api/tracker", trackerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`VYRON API listening on port ${PORT}`));
