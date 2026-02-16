const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


// ✅ CREATE TASK
router.post("/add", async (req, res) => {
    try {
        const { title } = req.body;

        const newTask = new Task({ title });
        await newTask.save();

        console.log("Task saved:", newTask);
        res.json({ message: "Task added", task: newTask });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ GET ALL TASKS
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ UPDATE TASK STATUS
router.put("/complete/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { completed: true },
            { new: true }
        );

        res.json({ message: "Task completed", task });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;

// ✅ DELETE TASK
router.delete("/delete/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

