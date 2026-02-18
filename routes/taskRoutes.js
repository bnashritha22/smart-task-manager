const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


// ADD TASK
router.post("/add", async (req, res) => {
  try {
    const { title, priority, category, dueDate } = req.body;

    const newTask = new Task({
      title,
      priority,
      category,
      dueDate
    });

    await newTask.save();
    res.json({ message: "Task added", task: newTask });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// COMPLETE TASK
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


// ⭐ DELETE TASK (THIS MUST EXIST)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
