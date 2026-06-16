import re

with open("script.js", "r") as f:
    content = f.read()

# 1. Add hangman state next to window.gameState
state = """
window.hangmanState = {
    active: false,
    word: '',
    guessed: [],
    attempts: 0,
    maxAttempts: 6
};
"""
content = content.replace("window.gameState = {\n    active: false,\n    target: 0,\n    attempts: 0\n};", "window.gameState = {\n    active: false,\n    target: 0,\n    attempts: 0\n};\n" + state)


# 2. Add handleHangmanCommand before handleQuestsCommand (or anywhere logical)
func = """
function handleHangmanCommand(args) {
    const words = ["CYBERPUNK", "HACKER", "TERMINAL", "MATRIX", "ENCRYPTION", "FIREWALL", "NETWORK", "PROTOCOL"];

    if (!window.hangmanState.active || (args[0] && args[0].toLowerCase() === 'start')) {
        window.hangmanState.active = true;
        window.hangmanState.word = words[Math.floor(getRandom() * words.length)];
        window.hangmanState.guessed = [];
        window.hangmanState.attempts = 0;

        // For UI previews where args[0] might be 'status' but game wasn't active
        if (args[0] && args[0].toLowerCase() === 'status') {
             // just let it show the initial state
        } else {
             return `<span style="color: #00ff00;">[HANGMAN STARTED]</span> Guess a letter to begin. Type 'quit' to exit.<br>` + renderHangman();
        }
    }

    if (args.length > 0) {
        let guess = args[0].toUpperCase();
        if (guess === 'STATUS') {
             // Just show status
        } else if (guess.length === 1 && guess.match(/[A-Z]/)) {
            if (!window.hangmanState.guessed.includes(guess)) {
                window.hangmanState.guessed.push(guess);
                if (!window.hangmanState.word.includes(guess)) {
                    window.hangmanState.attempts++;
                }
            } else {
                return `<span style="color: #ffaa00;">You already guessed '${guess}'.</span><br>` + renderHangman();
            }
        } else if (guess.length > 1) {
            return `<span style="color: #ff3333;">Please guess only one letter at a time.</span><br>` + renderHangman();
        }
    }

    let output = renderHangman();

    // Check win/loss
    if (window.hangmanState.attempts >= window.hangmanState.maxAttempts) {
        output += `<br><span style="color: #ff3333; font-weight: bold;">GAME OVER.</span> The word was ${window.hangmanState.word}.`;
        window.hangmanState.active = false;
    } else {
        const hasWon = window.hangmanState.word.split('').every(char => window.hangmanState.guessed.includes(char));
        if (hasWon) {
            output += `<br><span style="color: #00ff00; font-weight: bold;">YOU WIN!</span>`;
            if (typeof addXP === 'function') {
                addXP(30);
                output += " (+30 XP)";
            }
            window.hangmanState.active = false;
        }
    }

    return output;
}

function renderHangman() {
    const s = window.hangmanState;
    const stages = [
        `
  +---+
  |   |
      |
      |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
        `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
    ];

    let wordDisplay = s.word.split('').map(char => s.guessed.includes(char) ? char : '_').join(' ');

    return `
<div style="border: 1px dashed var(--accent-color); padding: 10px; margin: 10px 0; width: fit-content;">
<pre style="color: var(--command-color); margin: 0; font-weight: bold;">${stages[s.attempts]}</pre>
<br>
<span style="color: var(--user-color); font-size: 1.2em; letter-spacing: 2px;">${wordDisplay}</span><br><br>
<span style="color: #888;">Guessed: ${s.guessed.join(', ')}</span><br>
<span style="color: #ff3333;">Strikes: ${s.attempts} / ${s.maxAttempts}</span>
</div>`;
}
"""

content = content.replace("function handleGuessCommand", func + "\nfunction handleGuessCommand")


# 3. Hook in handleEnter
# Around line 2810 (where window.gameState is checked)
target = """    if (window.gameState && window.gameState.active && command !== 'quit') {
        outputHTML = handleGuessCommand([rawCommand]);
    } else if (window.gameState && window.gameState.active && command === 'quit') {
        window.gameState.active = false;
        outputHTML = "Game aborted.";
    } else {"""
replacement = """    if (window.gameState && window.gameState.active && command !== 'quit') {
        outputHTML = handleGuessCommand([rawCommand]);
    } else if (window.gameState && window.gameState.active && command === 'quit') {
        window.gameState.active = false;
        outputHTML = "Game aborted.";
    } else if (window.hangmanState && window.hangmanState.active && command !== 'quit') {
        outputHTML = handleHangmanCommand([rawCommand]);
    } else if (window.hangmanState && window.hangmanState.active && command === 'quit') {
        window.hangmanState.active = false;
        outputHTML = "Hangman game aborted.";
    } else {"""

content = content.replace(target, replacement)

# Add to customCommands
content = re.sub(r"const customCommands = \['([^']+)',", r"const customCommands = ['\1', 'hangman',", content)

# Hook in main command switch
content = content.replace("} else if (cmdName === 'music') {", "} else if (cmdName === 'hangman') {\n            outputHTML = handleHangmanCommand(args);\n        } else if (cmdName === 'music') {")

# Export
content = content.replace("handleHackCommand,", "handleHackCommand, handleHangmanCommand,")

# Update updateGames
content = content.replace("let riddleHtml = handleRiddleCommand();", "let riddleHtml = handleRiddleCommand();\n    let hangmanHtml = handleHangmanCommand(['status']);")

content = content.replace("<h3>Trivia Challenge</h3>\n                ${triviaHtml}\n            </div>", "<h3>Trivia Challenge</h3>\n                ${triviaHtml}\n            </div>\n            <div style=\"flex: 1; min-width: 300px;\">\n                <h3>Hangman</h3>\n                ${hangmanHtml}\n                <div style=\"font-size: 0.8em; color: #888;\">Type 'hangman start' in terminal to play.</div>\n            </div>")

with open("script.js", "w") as f:
    f.write(content)
