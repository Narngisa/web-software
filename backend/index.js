const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

require('dotenv').config({ debug: true });

const jwtSecret = process.env.JWT_SECRET;

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/ND_db').then(() => console.log("MongoDB connected")).catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user); // ต้องมี username ใน user object
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signup", async (req, res) => {
    try {
        const { username, email, password, firstname, lastname, birthday, sex } = req.body;

        // Basic validation
        if (!username || !email || !password || !firstname || !lastname || !birthday || !sex) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ error: "Username or email already in use." });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
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
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่าใส่ครบหรือยัง
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // ค้นหาผู้ใช้จาก email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // สร้าง JWT token
    const TOKEN = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // ส่งข้อมูลกลับไป
    res.json({
      message: "Login successful",
      TOKEN,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

app.put("/api/user/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // ตรวจสอบว่า id ใน token ตรงกับ id ที่ส่งมา
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this user" });
    }

    const { username, email, password, firstname, lastname, birthday, sex } = req.body;

    // อัปเดตข้อมูล
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, password, firstname, lastname, birthday, sex },
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

app.put("/api/user/:id/password", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // เช็ค userId ใน token กับ param id ต้องตรงกัน
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to change password" });
    }

    // หา user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ตรวจสอบ oldPassword
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Old password is incorrect" });

    // hash newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่าน
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});