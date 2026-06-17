import sys
import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. State Initializations (Place at the top near other states)
states = """
window.gamesState = { active: false };
window.snakeState = { active: false };
window.scrambleState = { active: false };
window.binaryState = { active: false };
window.triviaState = { active: false };
window.riddleState = { active: false };
"""

if "window.gamesState =" not in content:
    content = content.replace("window.hangmanState = {", states + "\nwindow.hangmanState = {")

# 2. handleGamesCommand
games_cmd = """
function handleGamesCommand(args) {
    const gamesList = [
        { name: 'hangman', desc: 'Classic word guessing game' },
        { name: 'guess', desc: 'Number guessing game' },
        { name: 'trivia', desc: 'Test your knowledge across categories' },
        { name: 'riddle', desc: 'Solve the daily enigma' },
        { name: 'slots', desc: 'Risk XP for a chance at a jackpot' },
        { name: 'rps', desc: 'Rock, Paper, Scissors against the AI' },
        { name: 'hack', desc: 'Simulate a network breach' },
        { name: 'snake', desc: 'The classic snake game (terminal version)' },
        { name: 'scramble', desc: 'Unscramble the technical term' },
        { name: 'binary', desc: 'Convert decimal to binary challenge' }
    ];

    if (args.length === 0) {
        window.gamesState.active = true;
        let listHtml = gamesList.map((g, i) => `[${i + 1}] <span style="color: var(--command-color);">${g.name}</span> - ${g.desc}`).join('<br>');
        return `
<div style="border: 1px solid var(--accent-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--accent-color);">/// MINI-GAMES SELECTOR</h3>
    <p>Please select a game by entering its number or name:</p>
    ${listHtml}
    <p style="margin-top: 10px; font-size: 0.8em; color: #888;">Type 'quit' to exit selector.</p>
</div>`;
    }

    const selection = args[0].toLowerCase();
    const gameByIndex = gamesList[parseInt(selection) - 1];
    const gameByName = gamesList.find(g => g.name === selection);
    const selectedGame = gameByIndex || gameByName;

    if (selectedGame) {
        window.gamesState.active = false;
        switch (selectedGame.name) {
            case 'hangman': return handleHangmanCommand(['start']);
            case 'guess': return handleGuessCommand([]);
            case 'trivia': return handleTriviaCommand('trivia-' + Date.now(), []);
            case 'riddle': return handleRiddleCommand([]);
            case 'slots': return handleSlotsCommand();
            case 'rps': return handleRpsCommand([]);
            case 'hack': return handleHackCommand(['127.0.0.1'], 'hack-' + Date.now());
            case 'snake': return handleSnakeCommand([]);
            case 'scramble': return handleScrambleCommand([]);
            case 'binary': return handleBinaryCommand([]);
            default: return "Game not implemented yet.";
        }
    }

    return "Invalid selection. Please choose from the list or type 'quit'.";
}

function handleSnakeCommand(args) {
    if (!window.snakeState.active) {
        window.snakeState.active = true;
        window.snakeState.snake = [{x: 5, y: 5}];
        window.snakeState.food = {x: 10, y: 5};
        window.snakeState.dx = 1;
        window.snakeState.dy = 0;
        window.snakeState.score = 0;
        window.snakeState.width = 20;
        window.snakeState.height = 10;
        return renderSnake() + "<br>Use 'w', 'a', 's', 'd' to move. Type 'quit' to exit.";
    }

    if (args && args.length > 0) {
        const move = args[0].toLowerCase();
        if (move === 'w' && window.snakeState.dy === 0) { window.snakeState.dx = 0; window.snakeState.dy = -1; }
        else if (move === 's' && window.snakeState.dy === 0) { window.snakeState.dx = 0; window.snakeState.dy = 1; }
        else if (move === 'a' && window.snakeState.dx === 0) { window.snakeState.dx = -1; window.snakeState.dy = 0; }
        else if (move === 'd' && window.snakeState.dx === 0) { window.snakeState.dx = 1; window.snakeState.dy = 0; }
    }

    const head = {x: window.snakeState.snake[0].x + window.snakeState.dx, y: window.snakeState.snake[0].y + window.snakeState.dy};

    if (head.x < 0 || head.x >= window.snakeState.width || head.y < 0 || head.y >= window.snakeState.height ||
        window.snakeState.snake.some(p => p.x === head.x && p.y === head.y)) {
        window.snakeState.active = false;
        return `<span style="color: #ff3333;">GAME OVER!</span> Score: ${window.snakeState.score}`;
    }

    window.snakeState.snake.unshift(head);

    if (head.x === window.snakeState.food.x && head.y === window.snakeState.food.y) {
        window.snakeState.score += 10;
        addXP(5);
        window.snakeState.food = {
            x: Math.floor(getRandom() * window.snakeState.width),
            y: Math.floor(getRandom() * window.snakeState.height)
        };
    } else {
        window.snakeState.snake.pop();
    }

    return renderSnake() + "<br>Next move (w/a/s/d)?";
}

function renderSnake() {
    let board = "";
    for (let y = 0; y < window.snakeState.height; y++) {
        for (let x = 0; x < window.snakeState.width; x++) {
            if (window.snakeState.snake.some(p => p.x === x && p.y === y)) board += "O";
            else if (window.snakeState.food.x === x && window.snakeState.food.y === y) board += "@";
            else board += ".";
        }
        board += "\\n";
    }
    return `<pre style="line-height: 1; font-family: monospace; color: #00ff00;">${board}</pre>Score: ${window.snakeState.score}`;
}

function handleScrambleCommand(args) {
    const terms = ["JAVASCRIPT", "PYTHON", "CYBERSECURITY", "FRONTEND", "BACKEND", "ALGORITHM", "DATABASE", "FIREWALL"];
    if (!window.scrambleState.active) {
        const word = terms[Math.floor(getRandom() * terms.length)];
        window.scrambleState.active = true;
        window.scrambleState.original = word;
        window.scrambleState.word = word.split('').sort(() => getRandom() - 0.5).join('');
        return `<div style="border: 1px solid #00ffff; padding: 10px; margin: 10px 0;"><h3>/// WORD SCRAMBLE</h3><p>Unscramble: <strong>${window.scrambleState.word}</strong></p></div>`;
    }
    if (args && args.length > 0) {
        if (args[0].toUpperCase() === window.scrambleState.original) {
            window.scrambleState.active = false;
            addXP(15);
            return `<span style="color: #00ff00;">CORRECT!</span> (+15 XP)`;
        }
        return "Incorrect. Try again.";
    }
    return "Guess?";
}

function handleBinaryCommand(args) {
    if (!window.binaryState.active) {
        window.binaryState.active = true;
        window.binaryState.decimal = Math.floor(getRandom() * 64) + 1;
        return `<div style="border: 1px solid #ff00ff; padding: 10px; margin: 10px 0;"><h3>/// BINARY CHALLENGE</h3><p>Decimal: <strong>${window.binaryState.decimal}</strong></p></div>`;
    }
    if (args && args.length > 0) {
        const target = window.binaryState.decimal.toString(2).padStart(8, '0');
        if (args[0] === target) {
            window.binaryState.active = false;
            addXP(25);
            return `<span style="color: #00ff00;">CORRECT!</span> (+25 XP)`;
        }
        return "Wrong binary.";
    }
    return "Binary?";
}
"""

if "function handleGamesCommand" not in content:
    content = content.replace("function handleHangmanCommand(args) {", games_cmd + "\nfunction handleHangmanCommand(args) {")

# 3. handleEnter updates
enter_updates = """
    if (window.gameState && window.gameState.active && command !== 'quit') {
        outputHTML = handleGuessCommand([rawCommand]);
    } else if (window.gameState && window.gameState.active && command === 'quit') {
        window.gameState.active = false;
        outputHTML = "Game aborted.";
    } else if (window.hangmanState && window.hangmanState.active && command !== 'quit') {
        outputHTML = handleHangmanCommand([rawCommand]);
    } else if (window.hangmanState && window.hangmanState.active && command === 'quit') {
        window.hangmanState.active = false;
        outputHTML = "Hangman game aborted.";
    } else if (window.gamesState && window.gamesState.active && command !== 'quit') {
        outputHTML = handleGamesCommand([rawCommand]);
    } else if (window.gamesState && window.gamesState.active && command === 'quit') {
        window.gamesState.active = false;
        outputHTML = "Selector closed.";
    } else if (window.snakeState && window.snakeState.active && command !== 'quit') {
        outputHTML = handleSnakeCommand([rawCommand]);
    } else if (window.snakeState && window.snakeState.active && command === 'quit') {
        window.snakeState.active = false;
        outputHTML = "Snake game aborted.";
    } else if (window.scrambleState && window.scrambleState.active && command !== 'quit') {
        outputHTML = handleScrambleCommand([rawCommand]);
    } else if (window.scrambleState && window.scrambleState.active && command === 'quit') {
        window.scrambleState.active = false;
        outputHTML = "Scramble game aborted.";
    } else if (window.binaryState && window.binaryState.active && command !== 'quit') {
        outputHTML = handleBinaryCommand([rawCommand]);
    } else if (window.binaryState && window.binaryState.active && command === 'quit') {
        window.binaryState.active = false;
        outputHTML = "Binary challenge aborted.";
    } else if (window.triviaState && window.triviaState.active && command !== 'quit') {
        outputHTML = handleTriviaCommand('trivia-' + Date.now(), [rawCommand]);
    } else if (window.triviaState && window.triviaState.active && command === 'quit') {
        window.triviaState.active = false;
        outputHTML = "Trivia game aborted.";
    } else if (window.riddleState && window.riddleState.active && command !== 'quit') {
        outputHTML = handleRiddleCommand([rawCommand]);
    } else if (window.riddleState && window.riddleState.active && command === 'quit') {
        window.riddleState.active = false;
        outputHTML = "Riddle aborted.";
    } else {
"""

enter_search = r"if \(window\.gameState.*?else \{"
content = re.sub(enter_search, enter_updates, content, flags=re.DOTALL)

# 4. Command registration
content = content.replace("['achievements',", "['achievements', 'games', 'snake', 'scramble', 'binary',")
content = content.replace("handleFeaturerequestCommand,", "handleFeaturerequestCommand, handleGamesCommand, handleSnakeCommand, handleScrambleCommand, handleBinaryCommand,")

with open('script.js', 'w') as f:
    f.write(content)
