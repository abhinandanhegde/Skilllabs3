const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const formError = document.getElementById('formError');
const filterButtons = document.querySelectorAll('.filter-btn');
const dailyTip = document.getElementById('dailyTip');

let tasks = [];
let currentFilter = 'all';

taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = taskInput.value.trim();

    if (title === '') {
        formError.textContent = 'Please enter a task!';
        return;
    }

    tasks.push({
        id: Date.now(),
        title: title,
        completed: false
    });

    taskInput.value = '';
    formError.textContent = '';

    renderTasks();
});

function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(function (task) {
        if (currentFilter === 'pending') {
            return !task.completed;
        }

        if (currentFilter === 'completed') {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = 'No tasks found.';
        taskList.appendChild(li);
    }

    filteredTasks.forEach(function (task) {
        const li = document.createElement('li');
        li.className = 'task';

        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task as completed');

        checkbox.addEventListener('change', function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const span = document.createElement('span');
        span.className = 'title';
        span.textContent = task.title;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', 'Delete task');

        deleteButton.addEventListener('click', function () {
            tasks = tasks.filter(function (t) {
                return t.id !== task.id;
            });

            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    const completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;

    taskCount.textContent =
        `${tasks.length} tasks | ${completedCount} completed | ${tasks.length - completedCount} pending`;
}

filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        renderTasks();
    });
});

async function loadDailyTip() {
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');

        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }

        const data = await response.json();

        dailyTip.textContent = `${data.quote} — ${data.author}`;
    } catch (error) {
        dailyTip.textContent = 'Stay consistent. Small steps lead to big results.';
    }
}

renderTasks();
loadDailyTip();