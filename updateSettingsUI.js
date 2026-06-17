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
            <h3>Visual Effects</h3>
            <p>Toggle advanced visual overlays and system animations.</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="settings-btn" onclick="handleMatrixCommand(); updateSettingsUI();">Toggle Matrix Effect</button>
                <button class="settings-btn" onclick="handleStarfieldCommand(); updateSettingsUI();">Toggle Starfield</button>
            </div>
        </div>
        <div class="settings-section" style="margin-top: 30px;">
            <h3>Data Management</h3>
            <p>Resetting data will clear your XP, Level, command history, and tasks.</p>
            <button class="danger-btn" onclick="window.resetDataFromUI()">Reset All Data</button>
        </div>
    `;
}
