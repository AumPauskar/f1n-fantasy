import express from 'express';
import Prediction from '../models/predictionModel.js';
import RaceResult from '../models/raceResultModel.js';
import User from '../models/userModel.js';
import Points from '../models/pointsModel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/validatepredictions', async (req, res) => {
  const { authname, authpasswd, rd, id } = req.body;

  try {
    const points = await validateAndCalculatePoints(authname, authpasswd, rd, id);
    const pointsUpdate = await updatePointsDB(authname, authpasswd, rd, id);
    return res.status(200).send(points.toString());
  } catch (err) {
    if (err.message === "Unauthorized") {
      return res.status(401).send("Unauthorized");
    } else if (err.message === "Invalid ID format") {
      return res.status(400).send("Invalid ID format");
    } else if (err.message === "User not found" || err.message === "Round not found" || err.message === "Predictions not found") {
      return res.status(404).send(err.message);
    } else {
      console.error("Error", err);
      return res.status(500).send("Internal server error");
    }
  }
});

async function validateAndCalculatePoints(authname, authpasswd, rd, id) {
  if (authname !== "root" || authpasswd !== "root") {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  rd = parseInt(rd);
  if (isNaN(rd)) {
    throw new Error("Invalid round number");
  }

  const user = await User.findById(new mongoose.Types.ObjectId(id));
  if (!user) {
    throw new Error("User not found");
  }

  const raceResult = await RaceResult.findOne({ rd });
  if (!raceResult) {
    throw new Error("Round not found");
  }

  const f1Results = raceResult.finishers;
  const userPrediction = await Prediction.findOne({ id, rd });
  if (!userPrediction) {
    throw new Error("Predictions not found");
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

  // Update the user's points in the database
  user.points = points;
  await user.save();

  return points;
}

async function updatePointsDB(authname, authpasswd, rd, id) {
  if (authname !== "root" || authpasswd !== "root") {
    throw new Error("Unauthorized");
  }

  rd = parseInt(rd);
  if (isNaN(rd)) {
    throw new Error("Invalid round number");
  }

  const user = await User.findById(new mongoose.Types.ObjectId(id));
  if (!user) {
    throw new Error("User not found");
  }

  const points = await validateAndCalculatePoints(authname, authpasswd, rd, id);
  const pointsDB = await Points.findOne({ id: user.id });
  if (!pointsDB) {
    const newPoints = new Points({
      id: user.id,
      ppr: [],
      points: points
    });
    await newPoints.save();
  } else {
    pointsDB.points += points;
    await pointsDB.save();
  }

  return 200;
}

// route to get points for a user in points collection
router.get('/getpoints/:id', async (req, res) => {
  const id = req.params.id;
  const points = await Points.findOne({ id: id });
  if (!points) {
    return res.status(404).send("Points not found");
  }
  res.send(points);
});

export default router;