// scripts/todo.js

function initTodo() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const addButton = document.querySelector('.ajout'); // Utilisez querySelector avec la classe

    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const li = document.createElement('li');
            li.textContent = taskText;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() {
                taskList.removeChild(li);
            };
            li.appendChild(deleteButton);

            taskList.appendChild(li);
            taskInput.value = '';
        }
    }

     addButton.addEventListener('click', addTask); // Utilisez addEventListener

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
}

// Pas de DOMContentLoaded ici ! initTodo() est appelé par script.js