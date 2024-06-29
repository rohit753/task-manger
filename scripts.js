document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const taskStart = document.getElementById("taskStart").value;
    const taskDeadline = document.getElementById("taskDeadline").value;

    const task = {
      id: Date.now(),
      name: taskName,
      start: new Date(taskStart),
      deadline: new Date(taskDeadline),
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    setNotification(task);

    taskForm.reset();
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
      const id = parseInt(e.target.parentElement.getAttribute("data-id"));
      const task = tasks.find((t) => t.id === id);
      document.getElementById("taskName").value = task.name;
      document.getElementById("taskStart").value = task.start
        .toISOString()
        .slice(0, 16);
      document.getElementById("taskDeadline").value = task.deadline
        .toISOString()
        .slice(0, 16);
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      displayTasks();
    } else if (e.target.classList.contains("delete")) {
      const id = parseInt(e.target.parentElement.getAttribute("data-id"));
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      displayTasks();
    }
  });

  function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("data-id", task.id);
      listItem.innerHTML = `${
        task.name
      } - Start: ${task.start.toLocaleString()} - Deadline: ${task.deadline.toLocaleString()}
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>`;
      taskList.appendChild(listItem);
    });
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function setNotification(task) {
    const now = new Date();
    const timeToStart = task.start - now;
    const timeToDeadline = task.deadline - now;

    if (timeToStart > 0) {
      setTimeout(() => {
        alert(`Task "${task.name}" is starting now!`);
      }, timeToStart);
    }

    if (timeToDeadline > 0) {
      setTimeout(() => {
        alert(`Task "${task.name}" is due now!`);
      }, timeToDeadline);
    }
  }

  displayTasks();
});
