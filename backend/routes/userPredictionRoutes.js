import express from 'express';
import User from '../models/userModel.js';
import Prediction from '../models/predictionModel.js';

const router = express.Router();

router.post('/userpredictions', async (req, res) => {
  const { name, passwd, rd, predictions } = req.body;

  if (!name || !passwd || !rd || !predictions) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ name, passwd });
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const query = { name, rd };
    const update = { name, rd, predictions };
    const options = { upsert: true, new: true };

    const result = await Prediction.findOneAndUpdate(query, update, options);

    if (result) {
      return res.status(200).send(result.upserted ? "Predictions added" : "Predictions updated");
    }
  } catch (err) {
    console.error("Error", err);
    return res.status(500).send("Internal server error");
  }
});

router.get('/userpredictions', async (req, res) => {
  const { name, passwd, rd } = req.body;
  if (!name || !passwd || !rd) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findOne({ name, passwd });
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const result = await Prediction.find({ name, rd });
    res.send(result);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Internal server error");
  }
});

export default router;