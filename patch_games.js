const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');
const search = `    let hangmanHtml = handleHangmanCommand(['status']);`;
const replacement = `    let hangmanHtml = handleHangmanCommand(['status']);
    let snakeHtml = handleSnakeCommand([]);
    let scrambleHtml = handleScrambleCommand([]);
    let binaryHtml = handleBinaryCommand([]);`;

content = content.replace(search, replacement);

const search2 = `                \${hangmanHtml}
                <div style="font-size: 0.8em; color: #888;">Type 'hangman start' in terminal to play.</div>
            </div>
            <div style="flex: 1; min-width: 300px;">`;

const replacement2 = `                \${hangmanHtml}
                <div style="font-size: 0.8em; color: #888;">Type 'hangman start' in terminal to play.</div>
            </div>
            <div style="flex: 1; min-width: 300px;">
                <h3>Snake</h3>
                <div style="background: #000; padding: 10px; border-radius: 5px; font-family: monospace;">\${snakeHtml}</div>
                <div style="font-size: 0.8em; color: #888; margin-top: 5px;">Type 'snake' in terminal to play.</div>
            </div>
            <div style="flex: 1; min-width: 300px;">
                <h3>Word Scramble</h3>
                \${scrambleHtml}
                <div style="font-size: 0.8em; color: #888;">Type 'scramble' in terminal to play.</div>
            </div>
            <div style="flex: 1; min-width: 300px;">
                <h3>Binary Challenge</h3>
                \${binaryHtml}
                <div style="font-size: 0.8em; color: #888;">Type 'binary' in terminal to play.</div>
            </div>
            <div style="flex: 1; min-width: 300px;">`;

content = content.replace(search2, replacement2);
fs.writeFileSync('script.js', content);
console.log('patched');
