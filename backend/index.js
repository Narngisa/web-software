const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8080;

if (!jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // เปลี่ยนตาม origin frontend
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/ND_db')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

// ─────────────────────────────────────────
// ✅ Get current user (must be logged in)
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, birthday, sex } = req.body;

    if (!username || !email || !password || !firstname || !lastname || !birthday || !sex) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "Username or email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      birthday,
      sex
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

    const TOKEN = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", TOKEN });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ Update user info (excluding password)
app.put("/api/user/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this user" });
    }

    const { username, email, firstname, lastname, birthday, sex } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, firstname, lastname, birthday, sex },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Change password
app.put("/api/user/:id/password", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to change password" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
