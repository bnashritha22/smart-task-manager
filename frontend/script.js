const API = "http://localhost:5000/api/tasks";

function showTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  const el = document.getElementById("todayDate");
  if (el) el.textContent = "Today: " + today;
  return today;
}

// Smart priority (used only if user doesn't choose one)
function suggestPriority(dueDate) {
  if (!dueDate) return "Low";

  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "High";
  if (diffDays === 1) return "Medium";
  return "Low";
}

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let completedCount = 0;
  const today = showTodayDate();

  tasks.forEach(task => {
    if (task.completed) completedCount++;

    const div = document.createElement("div");
    div.className = "task";

    const dateOnly = task.dueDate
      ? task.dueDate.split("T")[0]
      : "No date";

    if (dateOnly === today) {
      div.classList.add("today");
    }

    const priorityClass = (task.priority || "Low").toLowerCase();

    div.innerHTML = `
      <div>
        <strong style="${task.completed ? "text-decoration: line-through;" : ""}">
          ${task.title}
        </strong><br>
        <small>${task.category || "General"}</small><br>
        <small>📅 ${dateOnly}</small>
      </div>

      <div style="display:flex; gap:6px; align-items:center;">
        <span class="badge ${priorityClass}">
          ${task.priority || "Low"}
        </span>

        ${!task.completed ? `<button onclick="completeTask('${task._id}')">✓</button>` : ""}
        <button onclick="deleteTask('${task._id}')">🗑</button>
      </div>
    `;

    list.appendChild(div);
  });

  // Dashboard numbers
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent = completedCount;
  document.getElementById("pending").textContent = tasks.length - completedCount;

  // ⭐ Productivity Score
  const score = tasks.length === 0
    ? 0
    : Math.round((completedCount / tasks.length) * 100);

  const scoreEl = document.getElementById("productivityScore");
  if (scoreEl) {
    scoreEl.textContent = "Productivity Score: " + score + "%";
  }
}

async function addTask() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const dueDate = document.getElementById("dueDate").value;
  let priority = document.getElementById("priority").value;

  if (!title) {
    alert("Enter a task title");
    return;
  }

  // Use smart priority only if user didn’t choose
  if (!priority) {
    priority = suggestPriority(dueDate);
  }

  await fetch(API + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      priority,
      category,
      dueDate
    })
  });

  document.getElementById("title").value = "";
  loadTasks();
}

async function completeTask(id) {
  await fetch(API + "/complete/" + id, {
    method: "PUT"
  });
  loadTasks();
}

async function deleteTask(id) {
  try {
    const res = await fetch(API + "/delete/" + id, {
      method: "DELETE"
    });

    const data = await res.json();
    console.log("Deleted:", data);

    loadTasks();

  } catch (error) {
    console.log("Delete error:", error);
    alert("Delete failed — check server");
  }
}

loadTasks();
