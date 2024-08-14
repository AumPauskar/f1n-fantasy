import express from 'express';
import RaceResult from '../models/raceResultModel.js';

const router = express.Router();

router.post('/addraceresults', async (req, res) => {
  const { name, passwd, rd, finishers, dnf } = req.body;
  if (!name || !passwd || !rd || !finishers) {
    return res.status(400).send("All fields are required");
  }
  if (name !== "root" || passwd !== "root") {
    return res.status(401).send("Unauthorized");
  }

  try {
    const existingResult = await RaceResult.findOne({ rd });
    if (existingResult) {
      return res.status(409).send("Round already exists");
    }

    const newRaceResult = new RaceResult({ rd, finishers, dnf });
    await newRaceResult.save();

    return res.status(200).send("Results added");
  } catch (err) {
    console.error("Error", err);
    return res.status(500).send("Internal server error");
  }
});

router.get('/checkallraceresults', async (req, res) => {
  try {
    const result = await RaceResult.find().exec();
    res.status(200).send(result);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Internal server error");
  }
});

export default router;