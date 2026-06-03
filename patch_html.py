import re

with open('index.html', 'r') as f:
    content = f.read()

# Add agent profile and ids to system status
sidebar_replace = """        <div id="sidebar">
            <div class="sidebar-section">
                <div class="sidebar-header">AGENT PROFILE</div>
                <div class="sys-stats" id="agent-profile">
                    <div class="stat-row"><span>LVL:</span><span class="stat-val" id="sidebar-level">1</span></div>
                    <div class="stat-row"><span>XP:</span><span class="stat-val" id="sidebar-xp">0 / 100</span></div>
                </div>
            </div>
            <div class="sidebar-section">
                <div class="sidebar-header">EXPLORER</div>"""
content = content.replace('        <div id="sidebar">\n            <div class="sidebar-section">\n                <div class="sidebar-header">EXPLORER</div>', sidebar_replace)

content = content.replace('<div class="stat-row"><span>CPU:</span><span class="stat-val good">12%</span></div>', '<div class="stat-row"><span>CPU:</span><span class="stat-val good" id="sys-cpu">12%</span></div>')
content = content.replace('<div class="stat-row"><span>MEM:</span><span class="stat-val warn">64%</span></div>', '<div class="stat-row"><span>MEM:</span><span class="stat-val warn" id="sys-mem">64%</span></div>')

# Add tabs
tabs_replace = """                <div class="tab" data-target="network"><span class="tab-icon">🌐</span> network</div>
                <div class="tab" data-target="tasks"><span class="tab-icon">📋</span> tasks</div>
                <div class="tab" data-target="settings"><span class="tab-icon">⚙️</span> settings</div>"""
content = content.replace('                <div class="tab" data-target="network"><span class="tab-icon">🌐</span> network</div>', tabs_replace)

# Add tab contents
tab_contents_replace = """                <div id="network" class="tab-content" >
                    <h2>Network Monitor</h2>
                    <div id="network-data"></div>
                </div>
                <div id="tasks" class="tab-content" >
                    <h2>Task Manager</h2>
                    <div id="tasks-data"></div>
                </div>
                <div id="settings" class="tab-content" >
                    <h2>System Settings</h2>
                    <div id="settings-data"></div>
                </div>"""
content = content.replace("""                <div id="network" class="tab-content" >
                    <h2>Network Monitor</h2>
                    <div id="network-data"></div>
                </div>""", tab_contents_replace)

with open('index.html', 'w') as f:
    f.write(content)
