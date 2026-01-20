const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./user");

const app = express();

// ✅ allows reading JSON body (req.body)
app.use(express.json());

// ✅ connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

// ✅ simple home route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ SIGNUP (must be POST)
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    await User.create({ email, password: hashed });

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
