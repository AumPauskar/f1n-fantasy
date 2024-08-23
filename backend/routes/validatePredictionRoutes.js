import express from 'express';
import Prediction from '../models/predictionModel.js';
import RaceResult from '../models/raceResultModel.js';
import User from '../models/userModel.js';
import Points from '../models/pointsModel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/validatepredictions', async (req, res) => {
  const { authname, authpasswd, rd, id } = req.body;

  if (authname !== "root" || authpasswd !== "root") {
    return res.status(401).send("Unauthorized");
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const user = await User.findById(new mongoose.Types.ObjectId(id));
    if (!user) {
      return res.status(404).send("User not found");
    }

    const raceResult = await RaceResult.findOne({ rd });
    if (!raceResult) {
      return res.status(404).send("Round not found");
    }

    const f1Results = raceResult.finishers;
    const userPrediction = await Prediction.findOne({ id, rd });
    if (!userPrediction) {
      return res.status(404).send("Predictions not found");
    }
    const f1Predictions = userPrediction.predictions;

    let points = 0;
    for (let i = 0; i < f1Results.length; i++) {
      if (f1Results[i] === f1Predictions[i]) {
        points += 25;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 1) {
        points += 18;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 2) {
        points += 15;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 3) {
        points += 12;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 4) {
        points += 10;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 5) {
        points += 8;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 6) {
        points += 6;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 7) {
        points += 4;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 8) {
        points += 2;
      } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 9) {
        points += 1;
      }
    }

    return res.status(200).send(points.toString());
  } catch (err) {
    console.error("Error", err);
    return res.status(500).send("Internal server error");
  }
});

export default router;