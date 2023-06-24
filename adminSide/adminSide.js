const express = require("express");
const router = express.Router();
const admincollection = require("../adminControllers/adminControllers");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await admincollection.findOne({ email: email });

    if (check) {
      // Generate a JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);

      res.json({ token });
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json("Unauthorized");
    }

    req.email = decoded.email;
    next();
  });
};

router.post("/adminsignup", async (req, res) => {
  const { email, password } = req.body;

  const data = {
    email: email,
    password: password,
  };

  try {
    const check = await admincollection.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      res.json("notexist");
      await admincollection.insertMany([data]);
    }
  } catch (e) {
    res.json("fail");
  }
});

// Protected route example
router.get("/protectedRoute", verifyToken, (req, res) => {
  // Access the authenticated user's email from req.email
  res.json({ message: "This is a protected route", email: req.email });
});

module.exports = router;
