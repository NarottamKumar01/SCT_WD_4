const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');
const toggleMode = document.getElementById('toggle-mode');
const searchBox = document.getElementById('search-box');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const toast = document.getElementById('toast');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = "all";
let theme = localStorage.getItem("theme") || "light";
if (theme === "dark") {
  document.body.classList.add("dark");
  toggleMode.textContent = "☀️";
}

// ✅ Render all tasks based on current filter
function renderTasks() {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const search = searchBox.value.toLowerCase();

  filtered
    .filter(task => task.text.toLowerCase().includes(search))
    .forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div>
          <span onclick="toggleComplete(${index})">${task.text}</span><br/>
          <small>📅 ${task.date || "No due date"} | 🔥 ${task.priority}</small>
        </div>
        <div class="task-buttons">
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="confirmDelete(${index})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return showToast("❗ Task cannot be empty");

  const date = taskDate.value;
  const priority = taskPriority.value;

  tasks.push({ text, completed: false, date, priority });
  taskInput.value = '';
  taskDate.value = '';
  taskPriority.value = 'Low';
  renderTasks();
  showToast("✅ Task added");
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    renderTasks();
    showToast("✏️ Task updated");
  }
}

function confirmDelete(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    deleteTask(index);
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  showToast("🗑️ Task deleted");
}

// Filters
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  });
});

// Dark/Light toggle
toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains("dark");
  toggleMode.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Search
searchBox.addEventListener('input', renderTasks);

// Sort by date
function sortByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTasks();
}

// Sort by priority
function sortByPriority() {
  const order = { "High": 1, "Medium": 2, "Low": 3 };
  tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  renderTasks();
}

// Clear all completed
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
  showToast("✅ Completed tasks cleared");
}

// Toast
function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

// Add task (enter or button)
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Start
renderTasks();
