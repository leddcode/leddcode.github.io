function handleHelpCommand(args) {
    if (args.length === 0) {
        return commandRegistry['help']();
    }

    const subCommand = args[0].toLowerCase();

    if (subCommand === 'games') {
        return `
<div style="border: 1px solid var(--accent-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--accent-color);">/// MINI-GAMES MANUAL</h3>
    <p>The system includes several interactive modules for XP generation and entertainment:</p>
    <ul>
        <li><span style="color: var(--command-color);">hangman</span>: Classic word guessing game. (30 XP)</li>
        <li><span style="color: var(--command-color);">guess</span>: Number guessing game.</li>
        <li><span style="color: var(--command-color);">trivia</span>: Test your knowledge across categories.</li>
        <li><span style="color: var(--command-color);">riddle</span>: Solve the daily enigma. (5 XP)</li>
        <li><span style="color: var(--command-color);">slots</span>: Risk XP for a chance at a jackpot.</li>
        <li><span style="color: var(--command-color);">rps</span>: Rock, Paper, Scissors against the AI. (20 XP)</li>
        <li><span style="color: var(--command-color);">hack</span>: Simulate a network breach. (50 XP)</li>
    </ul>
    <p style="font-size: 0.9em; font-style: italic;">Note: Most games can be played directly from the 'games' tab as well.</p>
</div>`;
    }

    if (subCommand === 'music') {
        return `
<div style="border-left: 3px solid #ff00ff; padding-left: 10px; margin: 10px 0;">
    <span style="color: #ff00ff; font-weight: bold;">[MUSIC PLAYER HELP]</span><br>
    <span style="color: var(--command-color);">Usage:</span> music [play|stop|next]<br>
    <span style="color: var(--command-color);">play</span>: Starts the lo-fi radio stream.<br>
    <span style="color: var(--command-color);">stop</span>: Pauses the current stream.<br>
    <span style="color: var(--command-color);">next</span>: Cycles through available audio channels.
</div>`;
    }

    return `No detailed help available for '${subCommand}'. Try 'help' for a list of commands.`;
}
