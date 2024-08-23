import express from 'express';
import User from '../models/userModel.js';
import Prediction from '../models/predictionModel.js';

const router = express.Router();

router.post('/userpredictions/:id', async (req, res) => {
  const rd = parseInt(process.env.CURRENT_ROUND) || 12; // Fetch round from environment variable
  const id = req.params.id;
  const { predictions } = req.body; // Destructure predictions from req.body
  console.log("data", id, rd, predictions);

  if (!id || !rd || !predictions) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // Check if a prediction for the same user and round already exists
    const existingPrediction = await Prediction.findOne({ id: id, rd: rd });
    if (existingPrediction) {
      return res.status(409).send("Prediction for this round already exists");
    }

    // Add the new prediction
    const newPrediction = new Prediction({ id: id, rd: rd, predictions });
    await newPrediction.save();

    return res.status(201).send("Predictions added");
  } catch (err) {
    console.error("Error", err);
    return res.status(500).send("Internal server error");
  }
});

router.get('/userpredictions/:id', async (req, res) => {
  const rd = process.env.CURRENT_ROUND; // Fetch round from environment variable
  const id = req.params.id;
  if (!id || !rd) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const result = await Prediction.find({ userId: id, round: rd });
    res.send(result);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Internal server error");
  }
});

export default router;