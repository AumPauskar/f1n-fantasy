import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import User from "./models/userModel.js";
import RaceResult from "./models/raceResultModel.js";
import Prediction from "./models/predictionModel.js";

// Default MongoDB connection string
let url = process.env.MONGO_URL || "mongodb://localhost:27017/f1mongo"; // Include the database name in the URL

// Connect to MongoDB using Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Create a new express application
const app = express();
app.use(express.json());

// Returns the server status
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Adds a new user to the database
app.post("/api/v1/createusers", async (req, res) => {
  const { name, passwd } = req.body;
  console.log("name", name);
  console.log("passwd", passwd);

  if (!name || !passwd) {
    return res.status(400).send("Both 'name' and 'passwd' fields are required");
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(200).send("User already exists");
    }

    // Create a new user
    const newUser = new User({ name, passwd });
    await newUser.save();

    return res.status(200).send("User created");
  } catch (err) {
    console.error("Error creating user", err);
    return res.status(500).send("Internal server error");
  }
});

// Returns all users in the database
app.get("/api/v1/getusers", async (req, res) => {
  const { name, passwd } = req.body;
  console.log("rootuname", name);
  console.log("rootupasswd", passwd);

  if (name !== "root" || passwd !== "root") {
    return res.status(401).send("Unauthorized");
  }

  try {
    const users = await User.find({}, { _id: 0, name: 1, passwd: 1 }).exec();
    res.send(users);
  } catch (err) {
    console.error("Error retrieving users", err);
    res.status(500).send("Internal server error");
  }
});


// Adds race results to the database
app.post("/api/v1/addraceresults", async (req, res) => {
    const { name, passwd, rd, finishers, dnf } = req.body;
    if (!name || !passwd || !rd || !finishers) {
      return res.status(400).send("All fields are required");
    }
    if (name !== "root" || passwd !== "root") {
      return res.status(401).send("Unauthorized");
    }
  
    try {
      // Check if the round already exists
      const existingResult = await RaceResult.findOne({ rd });
      if (existingResult) {
        return res.status(409).send("Round already exists");
      }
  
      // Create a new race result
      const newRaceResult = new RaceResult({ rd, finishers, dnf });
      await newRaceResult.save();
  
      console.log("name", name);
      console.log("passwd", passwd);
      console.log("rd", rd);
      console.log("finishers", finishers);
      console.log("dnf", dnf);
      return res.status(200).send("Results added");
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("Internal server error");
    }
});

// tests db connection
app.get("/test", async (req, res) => {
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

// Adds user predictions to the database
app.post("/api/v1/userprecictions", async (req, res) => {
    const { name, passwd, rd, predictions } = req.body;
  
    // if name and password found in the database then add the predictions in database -> users collection
    if (!name || !passwd || !rd || !predictions) {
      return res.status(400).send("All fields are required");
    }
  
    try {
      // Check if the user exists and is authorized
      const user = await User.findOne({ name, passwd });
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
  
      // If the user is authorized, add the predictions to the database -> predictions collection
      const query = { name, rd }; // Query to find the document to update
      const update = { name, rd, predictions }; // Update command
      const options = { upsert: true, new: true }; // Option to insert if document doesn't exist
  
      const result = await Prediction.findOneAndUpdate(query, update, options);
  
      if (result) {
        return res.status(200).send(result.upserted ? "Predictions added" : "Predictions updated");
      }
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("Internal server error");
    }
});
  

// upon giving name, passwd and rd, the predictions of the user are returned
app.get("/api/v1/userpredictions", async (req, res) => {
    const { name, passwd, rd } = req.body;
    if (!name || !passwd || !rd) {
      return res.status(400).send("All fields are required");
    }
  
    try {
      // Check if the user exists and is authorized
      const user = await User.findOne({ name, passwd });
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
  
      // If the user is authorized, fetch the predictions from the database
      const result = await Prediction.find({ name, rd }).exec();
      res.send(result);
    } catch (err) {
      console.error("Error", err);
      res.status(500).send("Internal server error");
    }
});

/* this route does the following things:
    1. gets user name and round from the request
    2. checks if the user exists and the round exists
    3. checks the results and predictions and does the following
        - if the element's position is same in both results and predictions, then point += 25
        - if the element's position varies by 1 in both results and predictions, then point += 18
        - if the element's position varies by 2 in both results and predictions, then point += 15
        - if the element's position varies by 3 in both results and predictions, then point += 12
        - if the element's position varies by 4 in both results and predictions, then point += 10
        - if the element's position varies by 5 in both results and predictions, then point += 8
        - if the element's position varies by 6 in both results and predictions, then point += 6
        - if the element's position varies by 7 in both results and predictions, then point += 4
        - if the element's position varies by 8 in both results and predictions, then point += 2
        - if the element's position varies by 9 in both results and predictions, then point += 1
    4. returns the points of the user
*/


// Validate predictions
app.get("/api/v1/validatepredictions", async (req, res) => {
    const { authname, authpasswd, rd, name } = req.body;
  
    console.log("authname", authname);
    console.log("authpasswd", authpasswd);
  
    // check if auth name and passwd are correct -> superuser root
    if (authname !== "root" || authpasswd !== "root") {
      return res.status(401).send("Unauthorized");
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Check if the round exists
      const raceResult = await RaceResult.findOne({ rd });
      if (!raceResult) {
        return res.status(404).send("Round not found");
      }
  
      // Store the finishers of the round
      const f1Results = raceResult.finishers;
  
      // Store the predictions of the user for the round
      const userPrediction = await Prediction.findOne({ name, rd });
      if (!userPrediction) {
        return res.status(404).send("Predictions not found");
      }
      const f1Predictions = userPrediction.predictions;
  
      console.log("f1Results", f1Results);
      console.log("f1Predictions", f1Predictions);
  
      // Calculate the points
      let points = 0;
  
      for (let i = 0; i < f1Results.length; i++) {
        if (f1Results[i] === f1Predictions[i]) {
          points += 25;
          console.log("+25", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 1) {
          points += 18;
          console.log("+18", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 2) {
          points += 15;
          console.log("+15", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 3) {
          points += 12;
          console.log("+12", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 4) {
          points += 10;
          console.log("+10", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 5) {
          points += 8;
          console.log("+8", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 6) {
          points += 6;
          console.log("+6", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 7) {
          points += 4;
          console.log("+4", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 8) {
          points += 2;
          console.log("+2", f1Results[i], f1Predictions[i]);
        } else if (Math.abs(f1Results.indexOf(f1Predictions[i]) - i) === 9) {
          points += 1;
          console.log("+1", f1Results[i], f1Predictions[i]);
        }
      }
  
      return res.status(200).send(points.toString());
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("Internal server error");
    }
});

// Check all race results
app.get("/api/v1/checkallraceresults", async (req, res) => {
    console.log("GET /api/v1/checkallraceresults called");
  
    try {
      const result = await RaceResult.find().exec();
      res.status(200).send(result);
    } catch (err) {
      console.error("Error", err);
      res.status(500).send("Internal server error");
    }
  });

// sample hello world route
app.get("/", (req, res) => {
    console.log("GET / called");
    res.send("Hello World");
});