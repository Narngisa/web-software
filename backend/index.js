const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

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
  res.send("Welcome to the Prisma + Supabase backend!");
});

// Get current user
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        birthday: true,
        gender: true
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, birthday, gender } = req.body;

    if (!username || !email || !password || !firstname || !lastname || !birthday || !gender) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      return res.status(409).json({ error: "Username or email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstname,
        lastname,
        birthday: new Date(birthday),
        gender,
      },
    });

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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

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

// Update user
app.put("/api/user/:id", authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { username, email, firstname, lastname, birthday, gender } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { username, email, firstname, lastname, birthday: new Date(birthday), gender },
    });

    res.json({ message: "User updated successfully", updated });
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
      return res.status(403).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
