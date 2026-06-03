import re

with open('script.js', 'r') as f:
    content = f.read()

# Hook updateUIProfile into saveUserData
saveUserData_replacement = """function updateUIProfile() {
    const data = getUserData();
    const lvlEl = document.getElementById('sidebar-level');
    const xpEl = document.getElementById('sidebar-xp');
    if (lvlEl && xpEl) {
        lvlEl.textContent = data.level;
        xpEl.textContent = `${data.xp} / ${data.level * 100}`;
    }
}

function saveUserData(data) {
    try {
        localStorage.setItem('termUserData', JSON.stringify(data));
        updateUIProfile();
    } catch (e) {}
}"""
content = content.replace("""function saveUserData(data) {
    try {
        localStorage.setItem('termUserData', JSON.stringify(data));
    } catch (e) {}
}""", saveUserData_replacement)

# Hook updateUIProfile on page load, add random stat fluctuations, make functions global if they need to be
init_block = """
document.addEventListener('DOMContentLoaded', () => {
    updateUIProfile();

    // CPU/MEM fluctuation
    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
        setInterval(() => {
            const cpuEl = document.getElementById('sys-cpu');
            const memEl = document.getElementById('sys-mem');
            if (cpuEl && memEl) {
                const cpu = Math.floor(Math.random() * 30) + 5;
                const mem = Math.floor(Math.random() * 20) + 50;

                cpuEl.textContent = `${cpu}%`;
                cpuEl.className = `stat-val ${cpu > 25 ? 'warn' : 'good'}`;

                memEl.textContent = `${mem}%`;
                memEl.className = `stat-val ${mem > 60 ? 'warn' : 'good'}`;
            }
        }, 3000);
    }
});

// Settings UI functions
window.changeThemeFromUI = function(themeName) {
    const validThemes = ['dracula', 'light', 'matrix', 'ocean'];
    if (validThemes.includes(themeName)) {
        document.body.className = 'theme-' + themeName;
    } else {
        document.body.className = '';
    }
    updateSettingsUI();
};

window.resetDataFromUI = function() {
    if(confirm("Are you sure you want to reset all data? This cannot be undone.")) {
        localStorage.removeItem('termUserData');
        localStorage.removeItem('termTodo');
        location.reload();
    }
};

// Task UI functions
window.toggleTaskFromUI = function(id) {
    let todoList = [];
    try {
        const stored = localStorage.getItem('termTodo');
        if (stored) todoList = JSON.parse(stored);

        const task = todoList.find(t => t.id === id);
        if (task) {
            task.done = !task.done;
            localStorage.setItem('termTodo', JSON.stringify(todoList));
            updateTasksUI();
        }
    } catch (e) {}
};

window.deleteTaskFromUI = function(id) {
    let todoList = [];
    try {
        const stored = localStorage.getItem('termTodo');
        if (stored) todoList = JSON.parse(stored);

        todoList = todoList.filter(t => t.id !== id);
        localStorage.setItem('termTodo', JSON.stringify(todoList));
        updateTasksUI();
    } catch (e) {}
};

window.addTaskFromUI = function() {
    const input = document.getElementById('new-task-input');
    const taskText = input.value.trim();
    if (!taskText) return;

    // basic sanitize
    const cleanTask = taskText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let todoList = [];
    try {
        const stored = localStorage.getItem('termTodo');
        if (stored) todoList = JSON.parse(stored);

        todoList.push({ id: Date.now().toString(36), task: cleanTask, done: false });
        localStorage.setItem('termTodo', JSON.stringify(todoList));
        updateTasksUI();
    } catch (e) {}
};
"""

# Append UI update functions before the end or near updateNetwork
tasks_settings_funcs = """
function updateTasksUI() {
    const tasksData = document.getElementById('tasks-data');
    if (!tasksData) return;

    let todoList = [];
    try {
        const stored = localStorage.getItem('termTodo');
        if (stored) todoList = JSON.parse(stored);
    } catch (e) {}

    let tasksHTML = '<div class="tasks-container">';

    if (todoList.length === 0) {
        tasksHTML += '<p style="color: #888; font-style: italic;">No tasks found. Add one below or use the "todo add" command.</p>';
    } else {
        tasksHTML += '<ul class="task-list">';
        todoList.forEach(t => {
            const checked = t.done ? 'checked' : '';
            const textStyle = t.done ? 'text-decoration: line-through; color: #888;' : '';
            tasksHTML += `
                <li class="task-item">
                    <input type="checkbox" ${checked} onchange="window.toggleTaskFromUI('${t.id}')">
                    <span style="flex: 1; margin-left: 10px; ${textStyle}">${t.task}</span>
                    <button class="task-del-btn" onclick="window.deleteTaskFromUI('${t.id}')">✖</button>
                </li>
            `;
        });
        tasksHTML += '</ul>';
    }

    tasksHTML += `
        <div class="add-task-form">
            <input type="text" id="new-task-input" placeholder="Enter new task..." onkeypress="if(event.key==='Enter') window.addTaskFromUI()">
            <button onclick="window.addTaskFromUI()">Add Task</button>
        </div>
    </div>`;

    tasksData.innerHTML = tasksHTML;
}

function updateSettingsUI() {
    const settingsData = document.getElementById('settings-data');
    if (!settingsData) return;

    const currentTheme = document.body.className.replace('theme-', '') || 'default';

    const themes = ['default', 'dracula', 'light', 'matrix', 'ocean'];
    let themesHTML = '<div class="theme-grid">';
    themes.forEach(t => {
        const activeClass = t === currentTheme ? 'active-theme' : '';
        themesHTML += `
            <div class="theme-card ${activeClass}" onclick="window.changeThemeFromUI('${t}')">
                <div class="theme-preview theme-preview-${t}"></div>
                <div class="theme-name">${t}</div>
            </div>
        `;
    });
    themesHTML += '</div>';

    settingsData.innerHTML = `
        <div class="settings-section">
            <h3>Appearance</h3>
            <p>Select a theme to change the terminal's look and feel.</p>
            ${themesHTML}
        </div>
        <div class="settings-section" style="margin-top: 30px;">
            <h3>Data Management</h3>
            <p>Resetting data will clear your XP, Level, command history, and tasks.</p>
            <button class="danger-btn" onclick="window.resetDataFromUI()">Reset All Data</button>
        </div>
    `;
}
"""

content = content + init_block + tasks_settings_funcs

# Update the tab click event listener
tab_click_replace = """        if (target === 'terminal') {
            document.getElementById('command-line').focus();
        } else if (target === 'metrics') {
            updateMetrics();
        } else if (target === 'network') {
            updateNetwork();
        } else if (target === 'tasks') {
            updateTasksUI();
        } else if (target === 'settings') {
            updateSettingsUI();
        }"""
content = content.replace("""        if (target === 'terminal') {
            document.getElementById('command-line').focus();
        } else if (target === 'metrics') {
            updateMetrics();
        } else if (target === 'network') {
            updateNetwork();
        }""", tab_click_replace)

with open('script.js', 'w') as f:
    f.write(content)
