import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Adds a new user to the database
router.post("/createusers", async (req, res) => {
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
  router.get("/getusers", async (req, res) => {
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

export default router;