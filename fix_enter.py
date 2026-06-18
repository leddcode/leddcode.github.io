import sys
import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. handleEnter logic for interactive states
interactive_logic = """
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

# Find start of handleEnter interactive logic
search_start = r"if \(window\.gameState.*?else \{"
content = re.sub(search_start, interactive_logic, content, flags=re.DOTALL)

# 2. handleEnter command routing for 'games'
games_route = """        } else if (cmdName === 'games') {
            outputHTML = handleGamesCommand(args);
        } else if (cmdName === 'snake') {
            outputHTML = handleSnakeCommand(args);
        } else if (cmdName === 'scramble') {
            outputHTML = handleScrambleCommand(args);
        } else if (cmdName === 'binary') {
            outputHTML = handleBinaryCommand(args);"""

if "cmdName === 'games'" not in content:
    content = content.replace("} else if (cmdName === 'hangman') {", games_route + "\n        } else if (cmdName === 'hangman') {")

# 3. Ensure handleRiddleCommand and handleTriviaCommand calls use args
content = content.replace("handleTriviaCommand(outId)", "handleTriviaCommand(outId, args)")
content = content.replace("handleRiddleCommand()", "handleRiddleCommand(args)")

with open('script.js', 'w') as f:
    f.write(content)
