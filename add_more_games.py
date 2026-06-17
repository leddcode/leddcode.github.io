import sys
import re

with open('script.js', 'r') as f:
    content = f.read()

# Update handleGamesCommand list
new_list = """    const gamesList = [
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
    ];"""

content = re.sub(r'const gamesList = \[.*?\];', new_list, content, flags=re.DOTALL)

# Add Snake Logic
snake_logic = """
window.snakeState = {
    active: false,
    snake: [{x: 5, y: 5}],
    food: {x: 10, y: 5},
    dx: 1,
    dy: 0,
    score: 0,
    width: 20,
    height: 10
};

function handleSnakeCommand(args) {
    if (!window.snakeState.active) {
        window.snakeState.active = true;
        window.snakeState.snake = [{x: 5, y: 5}];
        window.snakeState.food = {x: 10, y: 5};
        window.snakeState.dx = 1;
        window.snakeState.dy = 0;
        window.snakeState.score = 0;
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
"""

# Scramble logic
scramble_logic = """
window.scrambleState = {
    active: false,
    word: '',
    original: ''
};

function handleScrambleCommand(args) {
    const terms = ["JAVASCRIPT", "PYTHON", "CYBERSECURITY", "FRONTEND", "BACKEND", "ALGORITHM", "DATABASE", "FIREWALL"];

    if (!window.scrambleState.active) {
        const word = terms[Math.floor(getRandom() * terms.length)];
        window.scrambleState.active = true;
        window.scrambleState.original = word;
        window.scrambleState.word = word.split('').sort(() => getRandom() - 0.5).join('');

        return `
<div style="border: 1px solid #00ffff; padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: #00ffff;">/// WORD SCRAMBLE</h3>
    <p>Unscramble this term: <strong style="letter-spacing: 2px;">${window.scrambleState.word}</strong></p>
    <div style="font-size: 0.8em; color: #888;">Type your guess in the terminal.</div>
</div>`;
    }

    if (args && args.length > 0) {
        if (args[0].toUpperCase() === window.scrambleState.original) {
            window.scrambleState.active = false;
            addXP(15);
            return `<span style="color: #00ff00; font-weight: bold;">CORRECT!</span> (+15 XP)`;
        } else {
            return `<span style="color: #ff3333;">Incorrect.</span> Keep trying or type 'quit'.`;
        }
    }
    return "Please provide a guess.";
}
"""

# Binary challenge
binary_logic = """
window.binaryState = {
    active: false,
    decimal: 0
};

function handleBinaryCommand(args) {
    if (!window.binaryState.active) {
        window.binaryState.active = true;
        window.binaryState.decimal = Math.floor(getRandom() * 64) + 1;
        return `
<div style="border: 1px solid #ff00ff; padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: #ff00ff;">/// BINARY CHALLENGE</h3>
    <p>Convert this decimal to 8-bit binary: <strong>${window.binaryState.decimal}</strong></p>
    <div style="font-size: 0.8em; color: #888;">Example format: 00010101</div>
</div>`;
    }

    if (args && args.length > 0) {
        const target = window.binaryState.decimal.toString(2).padStart(8, '0');
        if (args[0] === target) {
            window.binaryState.active = false;
            addXP(25);
            return `<span style="color: #00ff00; font-weight: bold;">CORRECT!</span> Mastery of the machine achieved. (+25 XP)`;
        } else {
            return `<span style="color: #ff3333;">Incorrect.</span> The binary representation of ${window.binaryState.decimal} is not that. Try again.`;
        }
    }
    return "Please provide binary answer.";
}
"""

# Insert logics
match = re.search(r'function handleGamesCommand\(args\) \{.*?return \".*?\";\s*\}', content, re.DOTALL)
if match:
    insertion_point = match.end()
    content = content[:insertion_point] + "\n" + snake_logic + scramble_logic + binary_logic + content[insertion_point:]

# Update handleGamesCommand switch
content = content.replace('switch (selectedGame.name) {',
                         'switch (selectedGame.name) {\n            case "snake": return handleSnakeCommand([]);\n            case "scramble": return handleScrambleCommand([]);\n            case "binary": return handleBinaryCommand([]);')

# Update handleEnter for new states
enter_states = """    } else if (window.snakeState && window.snakeState.active && command !== 'quit') {
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
        outputHTML = "Binary challenge aborted.";"""

content = content.replace("    } else if (window.riddleState && window.riddleState.active && command === 'quit') {",
                          enter_states + "\n    } else if (window.riddleState && window.riddleState.active && command === 'quit') {")

# Register commands
content = content.replace("'achievements', 'games', 'hangman'", "'achievements', 'games', 'snake', 'scramble', 'binary', 'hangman'")
content = content.replace("handleFeaturerequestCommand, handleGamesCommand,", "handleFeaturerequestCommand, handleGamesCommand, handleSnakeCommand, handleScrambleCommand, handleBinaryCommand,")

# Also add window states to the top
content = content.replace("window.riddleState = {", "window.snakeState = { active: false };\nwindow.scrambleState = { active: false };\nwindow.binaryState = { active: false };\nwindow.riddleState = {")

with open('script.js', 'w') as f:
    f.write(content)
