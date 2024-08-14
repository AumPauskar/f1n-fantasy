import express from 'express';
import mongoose from 'mongoose'; // Add this line

const router = express.Router();

router.get("/", (req, res) => {
    console.log("GET / called");
    res.send("Hello World");
});

// tests db connection
router.get("/test", async (req, res) => {
    try {
        // Check if Mongoose is connected
        if (mongoose.connection.readyState === 1) {
            console.log("Successfully connected to MongoDB");
            return res.status(200).send("Successfully connected to MongoDB");
        } else {
            console.error("Not connected to MongoDB");
            return res.status(500).send("Internal server error");
        }
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        return res.status(500).send("Internal server error");
    }
});

export default router;