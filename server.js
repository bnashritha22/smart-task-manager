const taskRoutes = require("./routes/taskRoutes");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


// ✅ CONNECT TO MONGODB (no extra options)
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ ROOT TEST ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
    console.log("Root route accessed");
    res.send("Server is alive");
});

// ✅ AUTH ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


// ✅ START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
