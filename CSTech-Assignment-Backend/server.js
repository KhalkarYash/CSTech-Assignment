// server.js
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
  })
);

// Agent model
const Agent = mongoose.model(
  "Agent",
  new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
  })
);

// Task model
const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    firstName: String,
    phone: String,
    notes: String,
  })
);

// Middleware for authentication
const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: "Invalid token." });
  }
};

// User register route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).send({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// User logout route
app.delete("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200).send("Logged out successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Add agent route
app.post("/agents", auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res
        .status(400)
        .json({ error: "Agent with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const agent = new Agent({ name, email, mobile, password: hashedPassword });

    await agent.save();
    res.status(201).json({ message: "Agent added successfully", agent });
  } catch (error) {
    console.error("Error adding agent:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Multer for file upload validation
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only CSV, XLS, and XLSX files are allowed."
        ),
        false
      );
    }
    cb(null, true);
  },
});

// CSV upload and distribution route
app.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (data) => {
        if (!data.FirstName || !data.Phone || !data.Notes) {
          return res.status(400).json({
            error: "CSV file must contain FirstName, Phone, and Notes columns.",
          });
        }
        results.push(data);
      })
      .on("end", async () => {
        const agents = await Agent.find();
        if (agents.length === 0) {
          return res.status(400).json({ error: "No agents available." });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: "CSV file is empty" });
        }

        const tasksPerAgent = Math.floor(results.length / agents.length);
        let distributedTasks = [];
        let index = 0;

        await Task.deleteMany(); // Clear previous tasks before inserting new ones

        agents.forEach((agent) => {
          let taskCount = tasksPerAgent;
          if (index < results.length % agents.length) taskCount++; // Distribute extra tasks
          const agentTasks = results.slice(index, index + taskCount);

          agentTasks.forEach((task) => {
            const newTask = new Task({
              agentEmail: agent.email,
              firstName: task.FirstName,
              phone: task.Phone,
              notes: task.Notes,
            });
            newTask.save();
          });

          distributedTasks.push({ agent: agent.email, tasks: agentTasks });
          index += taskCount;
        });

        res.send({
          message: "Tasks distributed successfully",
          distributedTasks,
        });
      })
      .on("error", (error) => {
        console.error("CSV Parsing Error:", error);
        res.status(500).json({ error: "Error processing CSV file" });
      });
  } catch (error) {
    console.error("CSV Upload Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API to fetch distributed tasks for each agent
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
