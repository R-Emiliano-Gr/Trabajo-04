const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Cargar tareas almacenadas desde el backend
loadTasksFromBackend();

taskForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Por favor, ingrese una tarea.');
        return;
    }

    await addTaskToBackend(taskText);
    taskInput.value = '';
    loadTasksFromBackend();
});

// Función para agregar tarea en el backend
async function addTaskToBackend(taskText) {
    const response = await fetch('http://localhost:3000/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: taskText })
    });
    const data = await response.json();
    return data;
}

// Función para cargar tareas desde el backend
async function loadTasksFromBackend() {
    const response = await fetch('http://localhost:3000/tareas');
    const data = await response.json();
    taskList.innerHTML = ''; // Limpiar la lista antes de cargar
    data.tareas.forEach(task => {
        addTask(task.id, task.descripcion, task.completada === 1);
    });
}

// Función para agregar una tarea en la lista
function addTask(id, taskText, completed) {
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
        await deleteTaskFromBackend(id);
        li.remove();
    });

    // Botón para marcar la tarea como completada
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Completar';
    completeButton.classList.add('complete-button');
    completeButton.addEventListener('click', function() {
        taskTextSpan.classList.toggle('completed-text');
        if (taskTextSpan.classList.contains('completed-text')) {
            deleteButton.style.display = 'none'; // Ocultar botón de eliminar cuando esté completada
            completeButton.disabled = true; // Desactivar botón de completar
        }
    });

    // Crear un contenedor para los botones
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);

    li.appendChild(taskTextSpan);
    li.appendChild(buttonContainer);
    taskList.appendChild(li);
}

// Función para eliminar tarea del backend
async function deleteTaskFromBackend(id) {
    await fetch(`http://localhost:3000/tareas/${id}`, {
        method: 'DELETE'
    });
}
