console.log("script.js loaded");
const API = "http://localhost:5000/api/tasks";

// LOAD TASKS
async function loadTasks() {
    const res = await fetch(API);
    const tasks = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${task.title} - ${task.completed ? "✅" : "❌"}
            <button onclick="completeTask('${task._id}')">Complete</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

// ADD TASK
async function addTask() {
    const title = document.getElementById("taskInput").value;

    await fetch(API + "/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    loadTasks();
}

// COMPLETE TASK
async function completeTask(id) {
    await fetch(API + "/complete/" + id, { method: "PUT" });
    loadTasks();
}

// DELETE TASK
async function deleteTask(id) {
    await fetch(API + "/delete/" + id, { method: "DELETE" });
    loadTasks();
}

loadTasks();
