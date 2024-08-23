import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Adds a new user to the database
router.post("/createusers", async (req, res) => {
  const { name, passwd } = req.body;
  try {
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, passwd });
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({id:user._id, name:user.name, token: token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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
      const users = await User.find({}, { _id: 1, name: 1, passwd: 1 }).exec();
      res.send(users);
    } catch (err) {
      console.error("Error retrieving users", err);
      res.status(500).send("Internal server error");
    }
});

// API route to check if the user exists
router.post("/checkuser", async (req, res) => { // Changed to POST for security
  const { name, passwd } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(passwd, user.passwd);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({id:user._id, name:user.name, token:token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// API route to delete a user
router.delete("/deleteuser", async (req, res) => {
  const { name, passwd } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(passwd, user.passwd);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    await User.findOneAndDelete({ name });
    res.status(200).json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/isUserAuth', auth, (req, res) => {
  res.status(200).json({ msg: "Authenticated" });
});

export default router;