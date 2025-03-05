document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    
    if (taskText === "") return;
    
    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `
        <input type="checkbox" onchange="toggleTask(this)">
        <span class="task">${taskText}</span>
        <button onclick="deleteTask(this)">❌</button>
    `;
    
    taskList.appendChild(li);
    saveTasks();
    taskInput.value = "";
}

function deleteTask(button) {
    button.parentElement.remove();
    saveTasks();
}

function toggleTask(checkbox) {
    let taskSpan = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskSpan.style.textDecoration = "line-through";
    } else {
        taskSpan.style.textDecoration = "none";
    }
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        let taskText = li.querySelector(".task").textContent;
        let completed = li.querySelector("input").checked;
        tasks.push({ text: taskText, completed: completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    tasks.forEach(task => {
        let li = document.createElement("li");
        li.classList.add("task-item");
        li.innerHTML = `
            <input type="checkbox" onchange="toggleTask(this)" ${task.completed ? "checked" : ""}>
            <span class="task" style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</span>
            <button onclick="deleteTask(this)">❌</button>
        `;
        taskList.appendChild(li);
    });
}

