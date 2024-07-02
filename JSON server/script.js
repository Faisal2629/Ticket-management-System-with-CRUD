document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/tickets';
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskIdField = document.getElementById('task-id');

    async function fetchTasks() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const tasks = await response.json();
            displayTasks(tasks);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.status}</td>
                <td>${new Date(task.dueDate).toLocaleString()}</td>
                <td>
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </td>
            `;
            taskList.appendChild(row);
        });
    }

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const task = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            status: document.getElementById('status').value,
            dueDate: document.getElementById('dueDate').value
        };
        const taskId = taskIdField.value;

        try {
            if (taskId) {
                await updateTask(taskId, task);
            } else {
                await createTask(task);
            }
            taskForm.reset();
            taskIdField.value = '';
            fetchTasks();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function createTask(task) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Failed to create task');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function updateTask(id, task) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Failed to update task');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete task');
            fetchTasks();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch task');
                const task = await response.json();
                document.getElementById('title').value = task.title;
                document.getElementById('description').value = task.description;
                document.getElementById('status').value = task.status;
                document.getElementById('dueDate').value = new Date(task.dueDate).toISOString().slice(0, 16);
                taskIdField.value = task.id;
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deleteTask(id);
        }
    });

    fetchTasks();
});
