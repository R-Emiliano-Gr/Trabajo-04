const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Cargar tareas almacenadas al iniciar
loadTasks();

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Por favor, ingrese una tarea.');
        return;
    }

    addTask(taskText, false);
    taskInput.value = '';
    saveTasks();
});

function addTask(taskText, completed, id) {
    const li = document.createElement('li');
    
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskText;

    if (completed) {
        taskTextSpan.classList.add('completed-text');
    }

    // Botón para eliminar la tarea
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', async function() {
        await deleteTask(id);
        li.remove();
    });

    // Botón para marcar la tarea como completada
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Completar';
    completeButton.classList.add('complete-button');
    completeButton.addEventListener('click', async function() {
        await completeTask(id);
        taskTextSpan.classList.add('completed-text');
        completeButton.style.display = 'none';  // Ocultar el botón de completar
    });

    // Crear un contenedor para los botones
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);

    li.appendChild(taskTextSpan);
    li.appendChild(buttonContainer);
    taskList.appendChild(li);
}

// Guardar tareas en localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.querySelector('.task-text').classList.contains('completed-text')
        });
    });
}

// Cargar tareas desde el backend
async function loadTasks() {
    const response = await fetch('http://localhost:3000/tareas');
    const data = await response.json();
    data.tareas.forEach(task => {
        addTask(task.descripcion, task.completada === 1, task.id);
    });
}

// Eliminar tarea desde el backend
async function deleteTask(id) {
    await fetch(`http://localhost:3000/tareas/${id}`, {
        method: 'DELETE'
    });
}

// Marcar tarea como completada en el backend
async function completeTask(id) {
    await fetch(`http://localhost:3000/tareas/${id}/completar`, {
        method: 'PUT'
    });
}
