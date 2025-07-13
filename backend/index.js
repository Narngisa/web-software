const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

// JWT middleware
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

// Get current user
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      `SELECT id, username, email, firstname, lastname, birthday, sex, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, birthday, sex } = req.body;

    if (!username || !email || !password || !firstname || !lastname || !birthday || !sex) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check existing user
    const exists = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Username or email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      `INSERT INTO users (username, email, password, firstname, lastname, birthday, sex)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [username, email, hashedPassword, firstname, lastname, birthday, sex]
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const result = await pool.query(
      "SELECT id, username, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const TOKEN = jwt.sign(
      { userId: user.id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", TOKEN });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

// Update user info (excluding password)
app.put("/api/user/:id", authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this user" });
    }

    const { username, email, firstname, lastname, birthday, sex } = req.body;

    const result = await pool.query(
      `UPDATE users SET username=$1, email=$2, firstname=$3, lastname=$4, birthday=$5, sex=$6
       WHERE id=$7 RETURNING id, username, email, firstname, lastname, birthday, sex`,
      [username, email, firstname, lastname, birthday, sex, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Change password
app.put("/api/user/:id/password", authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;

    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to change password" });
    }

    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(oldPassword, userPassword);

    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password=$1 WHERE id=$2",
      [hashedNewPassword, userId]
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
