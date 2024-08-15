import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Default MongoDB connection string
let url = process.env.MONGO_URL || "mongodb://localhost:27017/f1mongo"; // Include the database name in the URL

// Connect to MongoDB using Mongoose
mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Create a new express application
const app = express();
app.use(cors());
app.use(express.json());

// Use the combined routes
app.use(routes);

// Returns the server status
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});