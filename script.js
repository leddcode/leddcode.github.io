
window.logFeedback = function(isPositive) {
    let feedback = [];
    try {
        const stored = localStorage.getItem('termMicroFeedback');
        if (stored) feedback = JSON.parse(stored);
    } catch(e) {}
    feedback.push({ positive: isPositive, time: new Date().toISOString() });
    try {
        localStorage.setItem('termMicroFeedback', JSON.stringify(feedback));
    } catch(e) {}

    // Create an output div to say thanks
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        const msg = document.createElement('div');
        msg.className = 'output';
        msg.innerHTML = `<div style="color: #00ff00; font-size: 0.9em; margin-top: 5px;">[Feedback logged. Thank you for improving the AI!]</div>`;
        resultsDiv.appendChild(msg);
        const termDiv = document.getElementById('terminal');
        if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
    }
};

const results = document.getElementById('results');
const commandLine = document.getElementById('command-line');

const commandHistory = [];

function getRandom() {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
        return 0.5;
    }
    return Math.random();
}

let historyIndex = -1;

const fileList = ['about.sh', 'aranea.py', 'band.py', 'commands.txt', 'diablob.py', 'everything.txt', 'glazgo.exe', 'oculus.py', 'taxi.py', 'trophy.html', 'unalista.py', 'xsstrike.py'];

// Gamification / LocalStorage functions
function getUserData() {
    let data = { xp: 0, level: 1, history: [] };
    try {
        const stored = localStorage.getItem('termUserData');
        if (stored) {
            data = JSON.parse(stored);
        }
    } catch (e) {
        // localStorage might not be available in some test environments
    }
    return data;
}

function saveUserData(data) {
    try {
        localStorage.setItem('termUserData', JSON.stringify(data));
    } catch (e) {}
}

function addXP(amount) {
    const data = getUserData();
    data.xp += amount;

    const xpNeededForNextLevel = data.level * 100;
    let levelUpMsg = "";
    if (data.xp >= xpNeededForNextLevel) {
        data.xp -= xpNeededForNextLevel;
        data.level += 1;
        levelUpMsg = `<div style="color: #ffcc00; font-weight: bold; margin-top: 5px;">🌟 LEVEL UP! You are now level ${data.level}! 🌟</div>`;
    }

    saveUserData(data);
    return levelUpMsg;
}

function recordCommand(cmd) {
    const data = getUserData();
    if (!data.history) data.history = [];
    data.history.push({ cmd, time: new Date().toISOString() });
    saveUserData(data);
}

const greeting = `Portfolio Terminal
&copy;2023, <span class="blink">⠓⠁⠝⠕⠉⠓ ⠗⠊⠵⠵</span><br><br>
Hello, Universe! Welcome to the @leddcode machine.
Here you can find information about me and some of my projects...                   `;

const about = `I'm a cybersecurity specialist with a passion for coding and a love for chocolate.
With experience in both penetration testing and the development of web and mobile apps,
I am dedicated to helping organizations secure their systems and protect their data.`

const aranea = `Aranea may be used as an additional OSINT tool for web application investigations,
by crawling the links of the webapp or by examining the JavaScript files for likely useful data.
 <a href="https://github.com/leddcode/Aranea" class="link" target="_blank">https://github.com/leddcode/Aranea</a>`

const diablob = `Scrape all the blobs URLs from an open Azure Blob Container.
 <a href="https://github.com/leddcode/Diablob" class="link" target="_blank">https://github.com/leddcode/Diablob</a>`

const oculus = `Oculus is a Domain OSINT Tool used to discover environments, directories, and subdomains of a particular domain.
Additionally, it is useful for searching S3 Buckets, Azure Blob Containers, Firebase DBs,
leaked email addresses and MX records of a domain. <a href="https://github.com/leddcode/Oculus" class="link" target="_blank">https://github.com/leddcode/Oculus</a>`

const glazgo = `GlazGo is a powerful fuzzing tool for pentesters and security researchers to investigate web applications and APIs.
This tool is a compiled executable file that can be used when other tools are unavailable,
such as when testing a web application in a black-box environment on a corporate machine.
It helps to invetigate web apps and APIs by automating the process of providing expected and unexpected inputs in order to uncover application resources or to cause any unexpected behavior or crashes.
 <a href="https://github.com/leddcode/GlazGo" class="link" target="_blank">https://github.com/leddcode/GlazGo</a>`

const band = `<a href="https://github.com/leddcode/band" class="link" target="_blank">https://github.com/leddcode/band</a>`
const everything = `<a href="https://github.com/leddcode/Everything" class="link" target="_blank">https://github.com/leddcode/Everything</a>`
const taxi = `<a href="https://github.com/leddcode/taxi" class="link" target="_blank">https://github.com/leddcode/taxi</a>`
const unalista = `<a href="https://github.com/leddcode/unalista" class="link" target="_blank">https://github.com/leddcode/unalista</a>`

const xsstrike = `This tool is an upgraded version of a well-known Cross-Site Scripting detection suite:
<a href="https://github.com/leddcode/XSStrike" class="link" target="_blank">https://github.com/leddcode/XSStrike</a>.
The features that I have developed have been incorporated into the XSStrike-Reborn project:
<a href="https://github.com/ItsIgnacioPortal/XSStrike-Reborn/releases" class="link" target="_blank">https://github.com/ItsIgnacioPortal/XSStrike-Reborn/releases</a>.`

const trophy = `Monitor HTTP requests: <a href="https://trophy.onrender.com/" class="link" target="_blank">https://trophy.onrender.com/</a>`

function type(text, element) {
  const characters = text.split('');

  let interval;
  let currentText = '';
  let index = 0;
  let erase = false;

  interval = setInterval(() => {
    if (erase) {
      currentText = currentText.slice(0, -1);
      element.innerHTML = currentText;

      if (currentText.length === 0) {
        clearInterval(interval);
        document.getElementById('prompt').style.display = 'block';
        commandLine.style.display = 'block';
      }
    } else {
      const nextCharacter = characters[index];
      if (!nextCharacter) {
        erase = true;
        return;
      }
      currentText += nextCharacter;
      element.innerHTML = currentText;
      index++;
    }
  }, 30);
}


function runInstantIntro() {
    const banner = `
<pre style="color: var(--user-color); font-weight: bold; margin-bottom: 20px;">
    __         __    __               __
   / /__  ____/ /___/ /________  ____/ /__
  / / _ \\/ __  / __  / ___/ __ \\/ __  / _ \\
 / /  __/ /_/ / /_/ / /__/ /_/ / /_/ /  __/
/_/\\___/\\__,_/\\__,_/\\___/\\____/\\__,_/\\___/
</pre>
    `;
    const introMsg = `
<div style="animation: fadeIn 1s ease-in;">
    <span style="color: var(--link-color); font-weight: bold;">Leddcode OS v2.0.4</span> [System Ready]<br>
    <span style="color: #888;">Type 'help' to see available commands.</span><br><br>
</div>
<style>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
    `;
    results.innerHTML = banner + introMsg;

    // Ensure prompt and command line are visible immediately
    document.getElementById('prompt').style.display = 'flex';
    document.getElementById('command-line').style.display = 'block';
}

runInstantIntro();



function evaluateMath(expr) {
    expr = expr.replace(/\s+/g, '');
    let pos = 0;

    function parseExpression() {
        let left = parseTerm();
        while (pos < expr.length) {
            let op = expr[pos];
            if (op === '+' || op === '-') {
                pos++;
                let right = parseTerm();
                if (op === '+') left += right;
                else left -= right;
            } else {
                break;
            }
        }
        return left;
    }

    function parseTerm() {
        let left = parseFactor();
        while (pos < expr.length) {
            let op = expr[pos];
            if (op === '*' || op === '/') {
                pos++;
                let right = parseFactor();
                if (op === '*') left *= right;
                else left /= right;
            } else {
                break;
            }
        }
        return left;
    }

    function parseFactor() {
        if (pos >= expr.length) throw new Error("Unexpected end of expression");
        let char = expr[pos];
        if (char === '(') {
            pos++;
            let val = parseExpression();
            if (expr[pos] !== ')') throw new Error("Expected ')'");
            pos++;
            return val;
        } else if (char === '-' || char === '+') {
            pos++;
            let val = parseFactor();
            return char === '-' ? -val : val;
        } else {
            return parseNumber();
        }
    }

    function parseNumber() {
        let start = pos;
        while (pos < expr.length && (/[0-9.]/.test(expr[pos]))) {
            pos++;
        }
        if (start === pos) throw new Error("Expected number");
        let numStr = expr.substring(start, pos);
        if (numStr.split('.').length > 2) throw new Error("Invalid number");
        return parseFloat(numStr);
    }

    let result = parseExpression();
    if (pos < expr.length) throw new Error("Unexpected character at " + pos);
    return result;
}

const commandRegistry = {
  'ls': () => `
      about.sh
      <a href="https://github.com/leddcode/Aranea" class="link" target="_blank">aranea.py</a>
      <a href="https://github.com/leddcode/band" class="link" target="_blank">band.py</a>
      commands.txt
      <a href="https://github.com/leddcode/Diablob" class="link" target="_blank">diablob.py</a>
      <a href="https://github.com/leddcode/Everything" class="link" target="_blank">everything.txt</a>
      <a href="https://github.com/leddcode/GlazGo" class="link" target="_blank">glazgo.exe</a>
      <a href="https://github.com/leddcode/Oculus" class="link" target="_blank">oculus.py</a>
      <a href="https://github.com/leddcode/taxi" class="link" target="_blank">taxi.py</a>
      <a href="https://trophy.onrender.com/" class="link" target="_blank">trophy.html</a>
      <a href="https://github.com/leddcode/unalista" class="link" target="_blank">unalista.py</a>
      <a href="https://github.com/leddcode/XSStrike" class="link" target="_blank">xsstrike.py</a>
      `,
  'python oculus.py': () => { window.open("https://github.com/leddcode/Oculus", "_blank"); return oculus; },
  'python aranea.py': () => { window.open("https://github.com/leddcode/Aranea", "_blank"); return aranea; },
  'python diablob.py': () => { window.open("https://github.com/leddcode/Diablob", "_blank"); return diablob; },
    'python xsstrike.py': () => { window.open("https://github.com/leddcode/XSStrike", "_blank"); return xsstrike; },
  'python band.py': () => { window.open("https://github.com/leddcode/band", "_blank"); return band; },
  'python taxi.py': () => { window.open("https://github.com/leddcode/taxi", "_blank"); return taxi; },
  'python unalista.py': () => { window.open("https://github.com/leddcode/unalista", "_blank"); return unalista; },
  'cat everything.txt': () => { window.open("https://github.com/leddcode/Everything", "_blank"); return everything; },
  './glazgo.exe': () => { window.open("https://github.com/leddcode/GlazGo/releases", "_blank"); return glazgo; },
  'open trophy.html': () => { window.open("https://trophy.onrender.com/", "_blank"); return trophy; },
  'whoami': () => `<a href="${atob('aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2hhbm9jaHJpenov')}" class="link" target="_blank">leddcode</a>`,
  './about.sh': () => about,
  'sh about.sh': () => about,
  'cat about.sh': () => `echo "${about}"`,
  'cat commands.txt': () => `
      <ol>
        <li><span class="command">whoami</span></li>
        <li><span class="command">cat</span> path/to/file</li>
        <li><span class="command">open</span> path/to/html_file</li>
        <li><span class="command">python</span> path/to/python_file</li>
        <li><span class="command">sh</span> path/to/sh_file or ./path/to/sh_file</li>
        <li><span class="command">theme</span> [name] (dracula, light, matrix, ocean)</li>
        <li><span class="command">matrix</span></li>
        <li><span class="command">neofetch</span></li>
        <li><span class="command">echo</span> [text]</li>
        <li><span class="command">calc</span> [expression]</li>
      </ol>`,
  'cat oculus.py': () => `print('${oculus}')`,
  'cat aranea.py': () => `print('${aranea}')`,
  'cat diablob.py': () => `print('${diablob}')`,
  'cat xsstrike.py': () => `print('${xsstrike}')`,
  'cat glazgo.exe': () => `fmt.Println("${glazgo}")`,
  'cat trophy.html': () => `
      <pre>
      &lt;html&gt;
        &lt;body&gt;
          ${trophy}
        &lt;/body&gt;
      &lt;/html&gt;
      </pre>`,
  'cat': () => `Choose a file to be read.`,
  'python': () => `Choose a Python file to run.`,
  'sh': () => `Choose a SH file to run.`,
  'open': () => `Choose an HTML file to open.`,
  'clear': () => { results.innerHTML = ''; return null; },
  'pwd': () => `/home/leddcode`,
  'date': () => new Date().toString(),
  'sudo': () => `Permission denied`,
  'help': () => `ls, pwd, whoami, clear, date, sudo, theme, todo, cowsay, base64, roll, joke, coin, password, ping, matrix, neofetch, echo, calc, bttf, timetravel, flux, sysinfo, weather, guess, stats, companion, crypto, wiki, github, photo, challenge, feedback, remember, recall, assist, voice, image, quests, avatar, geo, leaderboard, alias, parse, remind, news, convert, translate, analyze, issues`,
};

// Generate cmdList dynamically
const customCommands = ['todo', 'cowsay', 'base64', 'roll', 'joke', 'coin', 'password', 'ping', 'theme', 'matrix', 'neofetch', 'echo', 'calc', 'bttf', 'timetravel', 'flux', 'sysinfo', 'weather', 'guess', 'stats', 'companion', 'crypto', 'wiki', 'github', 'photo', 'challenge', 'feedback', 'remember', 'recall', 'assist', 'voice', 'image', 'quests', 'avatar', 'geo', 'leaderboard', 'alias', 'parse', 'remind', 'news', 'convert', 'translate', 'analyze', 'issues', 'qr', 'fact', 'ajoke', 'longterm', 'docparse', 'daily', 'interact', 'suggest'];
const cmdList = [...new Set([...Object.keys(commandRegistry).map(cmd => cmd.split(' ')[0]), ...customCommands])];


function handleArrowUp(e) {
    e.preventDefault();
    if (commandHistory.length > 0) {
        if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
            historyIndex--;
        }
        commandLine.value = commandHistory[historyIndex];
    }
}

function handleArrowDown(e) {
    e.preventDefault();
    if (commandHistory.length > 0 && historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandLine.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;
            commandLine.value = '';
        }
    }
}

function handleTab(e) {
    e.preventDefault();
    const currentInput = commandLine.value.toLowerCase();
    const parts = currentInput.split(' ');

    if (parts.length === 1) {
        const matches = cmdList.filter(cmd => cmd.startsWith(parts[0]));
        if (matches.length === 1) {
            commandLine.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            const commonPrefix = matches.reduce((acc, curr) => {
                let i = 0;
                while (acc[i] === curr[i] && i < acc.length) {
                    i++;
                }
                return acc.slice(0, i);
            });
            commandLine.value = commonPrefix;
        }
    } else if (parts.length === 2) {
        const matches = fileList.filter(file => file.startsWith(parts[1]));
        if (matches.length === 1) {
            commandLine.value = parts[0] + ' ' + matches[0];
        } else if (matches.length > 1) {
            const commonPrefix = matches.reduce((acc, curr) => {
                let i = 0;
                while (acc[i] === curr[i] && i < acc.length) {
                    i++;
                }
                return acc.slice(0, i);
            });
            commandLine.value = parts[0] + ' ' + commonPrefix;
        }
    }
}

function handleMatrixCommand() {
    const canvas = document.getElementById('matrix-canvas');
    if (canvas.style.display === 'block') {
        canvas.style.display = 'none';
        clearInterval(window.matrixInterval);
        window.matrixInterval = null;
        return "Matrix effect disabled.";
    } else {
        canvas.style.display = 'block';

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        if (!window.matrixInterval) {
            window.matrixInterval = setInterval(() => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';
                for (let i = 0; i < drops.length; i++) {
                    const text = chars.charAt(Math.floor(getRandom() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > canvas.height && getRandom() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }, 33);
        }
        return "Matrix effect enabled. Run 'matrix' again to disable.";
    }
}








window.gameState = {
    active: false,
    target: 0,
    attempts: 0
};

function handleGuessCommand(args) {
    if (!window.gameState.active) {
        window.gameState.active = true;
        window.gameState.target = Math.floor(getRandom() * 100) + 1;
        window.gameState.attempts = 0;
        return "I'm thinking of a number between 1 and 100. Enter your guess:";
    }

    const guess = parseInt(args[0], 10);
    if (isNaN(guess)) {
        return "Please enter a valid number, or type 'quit' to exit the game.";
    }

    window.gameState.attempts++;

    if (guess < window.gameState.target) {
        return "Too low! Try again:";
    } else if (guess > window.gameState.target) {
        return "Too high! Try again:";
    } else {
        window.gameState.active = false;
        return `Congratulations! You guessed the number in ${window.gameState.attempts} attempts!`;
    }
}

function handleWeatherCommand(args, id) {
    if (args.length === 0) {
        return "Usage: weather [city]<br>Example: weather Tokyo";
    }
    const city = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Asynchronous fetch with fallback
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            const current = data.current_condition[0];
            const resultHtml = `
<div style="border-left: 3px solid var(--link-color); padding-left: 10px;">
    <span style="color: var(--user-color); font-weight: bold;">METEOROLOGICAL REPORT FOR:</span> ${city}<br>
    <span style="color: var(--command-color);">STATUS:</span> ${current.weatherDesc[0].value}<br>
    <span style="color: var(--command-color);">TEMP:</span> ${current.temp_C}°C / ${current.temp_F}°F<br>
    <span style="color: var(--command-color);">HUMIDITY:</span> ${current.humidity}%
</div>`;
            document.getElementById(id).innerHTML = resultHtml;
        })
        .catch(err => {
            // Fallback to simulated weather
            const conditions = ['Acid Rain', 'Nuclear Fallout', 'Cybernetic Smog', 'Neon Showers', 'Clear Sky (Simulation)'];
            const condition = conditions[Math.floor(getRandom() * conditions.length)];
            const temp = Math.floor(getRandom() * 50) + 10;

            const fallbackHtml = `
<div style="border-left: 3px solid var(--link-color); padding-left: 10px;">
    <span style="color: #ff3333; font-style: italic;">[API UPLINK FAILED - USING SIMULATION]</span><br>
    <span style="color: var(--user-color); font-weight: bold;">METEOROLOGICAL REPORT FOR:</span> ${city}<br>
    <span style="color: var(--command-color);">STATUS:</span> ${condition}<br>
    <span style="color: var(--command-color);">TEMP:</span> ${temp}°C / ${Math.round(temp * 9/5 + 32)}°F<br>
    <span style="color: var(--command-color);">RADIATION LEVEL:</span> ${(getRandom() * 5).toFixed(2)} Rad/h
</div>`;
            const el = document.getElementById(id);
            if(el) el.innerHTML = fallbackHtml;
        });

    return `Fetching meteorological data for ${city}...`;
}

function handleStatsCommand() {
    const data = getUserData();
    const xpNeeded = data.level * 100;
    const pct = Math.floor((data.xp / xpNeeded) * 100);

    // Create a progress bar
    const barLength = 20;
    const filled = Math.floor((pct / 100) * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    return `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--user-color);">/// USER STATISTICS</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">LEVEL</td>
            <td>${data.level}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">XP</td>
            <td>${data.xp} / ${xpNeeded}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">PROGRESS</td>
            <td>[${bar}] ${pct}%</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">COMMANDS EXECUTED</td>
            <td>${data.history ? data.history.length : 0}</td>
        </tr>
    </table>
</div>`;
}

function handleCryptoCommand(args, id) {
    if (args.length === 0) {
        return "Usage: crypto [coin_id]<br>Example: crypto bitcoin<br>Try: bitcoin, ethereum, dogecoin";
    }
    const coin = args.join('-').toLowerCase().replace(/</g, "&lt;").replace(/>/g, "&gt;");

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=usd`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            if (data[coin] && data[coin].usd) {
                const price = data[coin].usd;
                const resultHtml = `
<div style="border-left: 3px solid #f7931a; padding-left: 10px;">
    <span style="color: #f7931a; font-weight: bold;">[CRYPTO TRACKER]</span><br>
    <span style="color: var(--user-color);">${coin.toUpperCase()}</span>: $${price.toLocaleString()} USD
</div>`;
                document.getElementById(id).innerHTML = resultHtml;
            } else {
                document.getElementById(id).innerHTML = `<div style="color: #ff3333;">Error: Coin '${coin}' not found on CoinGecko.</div>`;
            }
        })
        .catch(err => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch crypto data.</div>`;
        });

    return `Fetching crypto data for ${coin}...`;
}

function handleWikiCommand(args, id) {
    if (args.length === 0) {
        return "Usage: wiki [query]<br>Example: wiki Cybersecurity";
    }
    const query = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) throw new Error("Not found");
            return response.json();
        })
        .then(data => {
            if (data.type === "disambiguation") {
                document.getElementById(id).innerHTML = `<div style="color: #ffaa00;">[WIKI] Multiple results found for '${data.title}'. Please be more specific.</div>`;
            } else if (data.extract) {
                const resultHtml = `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <span style="color: var(--user-color); font-weight: bold;">[WIKIPEDIA EXTRACT]</span> ${data.title}<br><br>
    <div style="font-size: 0.9em; line-height: 1.4;">${data.extract}</div>
    ${data.content_urls ? `<br><a href="${data.content_urls.desktop.page}" target="_blank" class="link">Read more...</a>` : ''}
</div>`;
                document.getElementById(id).innerHTML = resultHtml;
            } else {
                document.getElementById(id).innerHTML = `<div style="color: #ff3333;">Error: No extract found for '${query}'.</div>`;
            }
        })
        .catch(err => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch Wikipedia data for '${query}'.</div>`;
        });

    return `Querying Wikipedia for ${query}...`;
}

function handleGithubCommand(args, id) {
    if (args.length === 0) {
        return "Usage: github [username]<br>Example: github leddcode";
    }
    const username = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");

    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=5`)
        .then(response => {
            if (!response.ok) throw new Error("Not found");
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                document.getElementById(id).innerHTML = `<div style="color: #ffaa00;">User '${username}' has no public repositories.</div>`;
            } else {
                let reposHtml = data.map(repo => {
                    return `<li><a href="${repo.html_url}" target="_blank" class="link">${repo.name}</a> ${repo.language ? `[${repo.language}]` : ''} - ${repo.description ? repo.description : 'No description'}</li>`;
                }).join('');

                const resultHtml = `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <span style="color: var(--user-color); font-weight: bold;">[GITHUB REPOSITORIES]</span> ${username}<br><br>
    <ul style="margin: 0; padding-left: 20px;">
        ${reposHtml}
    </ul>
</div>`;
                document.getElementById(id).innerHTML = resultHtml;
            }
        })
        .catch(err => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch GitHub data for '${username}'. User might not exist or API rate limit exceeded.</div>`;
        });

    return `Fetching GitHub repositories for ${username}...`;
}

function handlePhotoCommand() {
    const randomSeed = Math.floor(getRandom() * 1000);
    const imgUrl = `https://picsum.photos/seed/${randomSeed}/400/300`;
    return `
<div style="border: 1px solid var(--command-color); padding: 5px; display: inline-block; margin: 10px 0;">
    <div style="color: var(--user-color); font-weight: bold; margin-bottom: 5px;">[IMAGE VIEWER] Image Seed: ${randomSeed}</div>
    <img src="${imgUrl}" alt="Random Image" style="max-width: 100%; height: auto; display: block; filter: grayscale(50%) contrast(120%);">
</div>`;
}

function handleLeaderboardCommand() {
    const data = getUserData();
    const currentScore = data.xp + (data.level * 100);

    // Simulate top players
    const players = [
        { name: "ZeroCool", score: 9540, badge: "🏆" },
        { name: "AcidBurn", score: 8210, badge: "🥈" },
        { name: "CrashOverride", score: 7890, badge: "🥉" },
        { name: "leddcode", score: 6500, badge: "🏅" },
        { name: window.terminalUser || "Guest", score: currentScore, badge: "⭐" }
    ];

    // Sort descending
    players.sort((a, b) => b.score - a.score);

    let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
        <h3 style="margin-top: 0; color: var(--user-color);">/// GLOBAL LEADERBOARD</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tr>
                <th style="padding: 5px; color: #888;">RANK</th>
                <th style="padding: 5px; color: #888;">USER</th>
                <th style="padding: 5px; color: #888;">SCORE</th>
            </tr>`;

    players.forEach((p, index) => {
        const isCurrent = p.name === (window.terminalUser || "Guest");
        const rowStyle = isCurrent ? "background-color: rgba(255, 158, 100, 0.2); font-weight: bold;" : "";
        const nameColor = isCurrent ? "color: var(--user-color);" : "color: var(--text-color);";
        html += `<tr style="${rowStyle}">
            <td style="padding: 5px; color: var(--command-color);">${p.badge} #${index + 1}</td>
            <td style="padding: 5px; ${nameColor}">${p.name}</td>
            <td style="padding: 5px;">${p.score}</td>
        </tr>`;
    });

    html += `</table></div>`;
    return html;
}

function handleChallengeCommand() {
    const challenges = [
        "What has keys but can't open locks? (A piano)",
        "Write a function to reverse a string.",
        "How do you find the missing number in a given integer array of 1 to 100?",
        "What runs but never walks, murmurs but never talks, has a bed but never sleeps? (A river)",
        "Write a script to check if a string is a palindrome.",
        "Implement FizzBuzz: Print 1 to 100, replacing multiples of 3 with Fizz, 5 with Buzz, and both with FizzBuzz.",
        "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (An echo)"
    ];

    // Pick a pseudo-random challenge for the day based on the date
    const today = new Date();
    const index = (today.getFullYear() + today.getMonth() + today.getDate()) % challenges.length;
    const challenge = challenges[index];

    return `
<div style="border: 1px dashed var(--user-color); padding: 10px; margin: 10px 0;">
    <div style="color: var(--user-color); font-weight: bold; margin-bottom: 5px;">🔥 DAILY MICRO-CHALLENGE 🔥</div>
    <div style="color: var(--command-color);">${challenge}</div>
    <div style="margin-top: 10px; font-size: 0.9em; color: #888;">[Completing this locally and logging it via 'feedback' grants bonus XP]</div>
</div>`;
}


function handleConvertCommand(args, id) {
    if (args.length < 4 || args[1].toLowerCase() !== 'to') {
        return "Usage: convert [amount] [from_currency] to [to_currency]<br>Example: convert 100 USD to EUR";
    }

    const amount = parseFloat(args[0]);
    if (isNaN(amount)) {
        return "Error: Invalid amount. Please provide a number.";
    }

    const fromCurr = args[2].toUpperCase().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const toCurr = args[3].toUpperCase().replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // We fetch the rates from ExchangeRate-API (free, no key required for public endpoint)
    setTimeout(() => {
        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurr}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data.rates && data.rates[toCurr]) {
                    const rate = data.rates[toCurr];
                    const converted = (amount * rate).toFixed(2);
                    el.innerHTML = `
<div style="border-left: 3px solid #85bb65; padding-left: 10px;">
    <span style="color: #85bb65; font-weight: bold;">[CURRENCY CONVERTER]</span><br>
    <span style="color: var(--command-color);">RATE:</span> 1 ${fromCurr} = ${rate} ${toCurr}<br>
    <span style="color: var(--user-color); font-weight: bold;">RESULT:</span> ${amount} ${fromCurr} = <span style="font-size: 1.1em; color: #85bb65;">${converted} ${toCurr}</span>
</div>`;
                } else {
                    el.innerHTML = `<div style="color: #ff3333;">[ERROR] Unsupported currency code '${toCurr}'.</div>`;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch exchange rates for '${fromCurr}'. Check currency code or connection.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Fetching exchange rates for ${fromCurr}...]</span></div>`;
}


function handleTranslateCommand(args, id) {
    if (args.length < 3) {
        return "Usage: translate [from_lang] [to_lang] [text]<br>Example: translate en es hello world";
    }

    const fromLang = args[0].toLowerCase();
    const toLang = args[1].toLowerCase();
    const text = args.slice(2).join(' ');
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data.responseData && data.responseData.translatedText) {
                    const translated = data.responseData.translatedText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    el.innerHTML = `
<div style="border-left: 3px solid #7aa2f7; padding-left: 10px;">
    <span style="color: #7aa2f7; font-weight: bold;">[TRANSLATOR: ${fromLang.toUpperCase()} -> ${toLang.toUpperCase()}]</span><br>
    <span style="color: var(--command-color);">ORIGINAL:</span> ${safeText}<br>
    <span style="color: var(--user-color); font-weight: bold;">TRANSLATED:</span> <span style="font-size: 1.1em; color: #7aa2f7;">${translated}</span>
</div>`;
                } else {
                    el.innerHTML = `<div style="color: #ff3333;">[ERROR] Translation failed. Check language codes.</div>`;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch translation.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Translating text...]</span></div>`;
}


function handleAnalyzeCommand(args, id) {
    if (args.length === 0) {
        return "Usage: analyze [url|text]<br>Example: analyze https://example.com";
    }

    const input = args.join(' ');

    // Helper to generate UI
    function generateAnalysisUI(textSource, charCount, wordCount, keywords) {
        return `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--user-color);">/// DOCUMENT ANALYSIS</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">SOURCE</td>
            <td>${textSource}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">WORDS</td>
            <td>${wordCount}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">CHARACTERS</td>
            <td>${charCount}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">TOP KEYWORDS</td>
            <td>${keywords}</td>
        </tr>
    </table>
</div>`;
    }

    // Keyword extraction logic
    function extractKeywords(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const wordFreq = {};
        words.forEach(w => {
            const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (cleanWord.length > 5) {
                wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            }
        });
        return Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0])
            .join(', ') || 'None found';
    }

    // Check if it's a URL
    if (input.startsWith('http://') || input.startsWith('https://')) {
        const safeUrl = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        setTimeout(() => {
            fetch(input)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.text();
                })
                .then(htmlStr => {
                    const el = document.getElementById(id);
                    if (!el) return;

                    // Rudimentary tag stripping
                    const plainText = htmlStr.replace(/<[^>]+>/g, ' ');
                    const charCount = plainText.length;
                    const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
                    const keywords = extractKeywords(plainText);

                    el.innerHTML = generateAnalysisUI(safeUrl, charCount, wordCount, keywords);
                    const termDiv = document.getElementById('terminal');
                    if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
                })
                .catch(err => {
                    // Fallback simulation due to CORS
                    const el = document.getElementById(id);
                    if (!el) return;

                    const simulatedText = `Simulated content for ${safeUrl} dealing with technology network cyberspace security protocol transmission algorithm.`;
                    const charCount = Math.floor(getRandom() * 5000) + 1000;
                    const wordCount = Math.floor(charCount / 5);
                    const keywords = extractKeywords(simulatedText);

                    const html = `<div style="color: #ffaa00; font-style: italic; margin-bottom: 5px;">[CORS/Fetch blocked. Simulated analysis generated via local heuristic engine.]</div>` +
                                 generateAnalysisUI(safeUrl, charCount, wordCount, keywords);
                    el.innerHTML = html;
                });
        }, 100);

        return `<div id="${id}"><span style="color: #888;">[Fetching and analyzing document at ${safeUrl}...]</span></div>`;
    } else {
        // Direct text analysis
        const safeText = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const charCount = input.length;
        const wordCount = input.split(/\s+/).filter(w => w.length > 0).length;
        const keywords = extractKeywords(input);

        return generateAnalysisUI(`"Raw Text"`, charCount, wordCount, keywords);
    }
}


function handleIssuesCommand(args, id) {
    if (args.length !== 1 || !args[0].includes('/')) {
        return "Usage: issues [user/repo]<br>Example: issues leddcode/Oculus";
    }

    const repo = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=5`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok or repo not found");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data.length === 0) {
                    el.innerHTML = `<div style="color: #ffaa00;">[GITHUB] No open issues found for '${repo}'.</div>`;
                } else {
                    let issuesHtml = data.map(issue => {
                        return `<li><a href="${issue.html_url}" target="_blank" class="link">#${issue.number} ${issue.title}</a> [${issue.user.login}]</li>`;
                    }).join('');

                    const resultHtml = `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <span style="color: var(--user-color); font-weight: bold;">[GITHUB ISSUES]</span> ${repo}<br><br>
    <ul style="margin: 0; padding-left: 20px;">
        ${issuesHtml}
    </ul>
</div>`;
                    el.innerHTML = resultHtml;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch issues for '${repo}'. Check spelling or rate limits.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Fetching open issues for ${repo}...]</span></div>`;
}

function handleTodoCommand(args) {
    let todoList = [];
    try {
        const stored = localStorage.getItem('termTodo');
        if (stored) todoList = JSON.parse(stored);
    } catch (e) {}

    if (args.length === 0) {
        return "Usage: todo [add|list|remove|clear] [task|id]<br>Example: todo add Fix bugs";
    }

    const action = args[0].toLowerCase();

    if (action === 'add') {
        const task = args.slice(1).join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (!task) return "Error: Please specify a task.";
        todoList.push({ id: Date.now().toString(36), task, done: false });
        try { localStorage.setItem('termTodo', JSON.stringify(todoList)); } catch (e) {}
        return `Added task: <span style="color: var(--user-color);">${task}</span>`;
    }
    else if (action === 'list') {
        if (todoList.length === 0) return "Your todo list is empty.";
        let listHTML = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// TODO LIST</h3><ol style="margin: 0; padding-left: 20px;">`;
        todoList.forEach((item, index) => {
            listHTML += `<li>[${index}] ${item.task}</li>`;
        });
        listHTML += `</ol></div>`;
        return listHTML;
    }
    else if (action === 'remove') {
        const index = parseInt(args[1], 10);
        if (isNaN(index) || index < 0 || index >= todoList.length) return "Error: Invalid task index.";
        const removed = todoList.splice(index, 1)[0];
        try { localStorage.setItem('termTodo', JSON.stringify(todoList)); } catch (e) {}
        return `Removed task: <span style="color: var(--user-color);">${removed.task}</span>`;
    }
    else if (action === 'clear') {
        try { localStorage.removeItem('termTodo'); } catch (e) {}
        return "Todo list cleared.";
    }

    return "Unknown action. Usage: todo [add|list|remove|clear] [task|id]";
}

function handleCowsayCommand(args) {
    if (args.length === 0) return "Usage: cowsay [message]";
    const text = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const dashLine = '-'.repeat(text.length + 2);
    return `
<pre style="color: var(--user-color); font-weight: bold;">
 ${dashLine}
&lt; ${text} &gt;
 ${dashLine}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
</pre>`;
}

function handleBase64Command(args) {
    if (args.length < 2) return "Usage: base64 [encode|decode] [text]";
    const action = args[0].toLowerCase();
    const text = args.slice(1).join(' ');

    try {
        if (action === 'encode') {
            return `Encoded: <span style="color: var(--user-color);">${btoa(text)}</span>`;
        } else if (action === 'decode') {
            return `Decoded: <span style=\"color: var(--user-color);\">${atob(text).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
        } else {
            return "Usage: base64 [encode|decode] [text]";
        }
    } catch (e) {
        return "Error: Invalid base64 string or encoding failure.";
    }
}

function handleRollCommand(args) {
    let count = 1;
    let sides = 6;

    if (args.length > 0) {
        const match = args[0].toLowerCase().match(/^(\d*)d(\d+)$/);
        if (match) {
            count = parseInt(match[1]) || 1;
            sides = parseInt(match[2]);
        } else {
            const parsed = parseInt(args[0]);
            if (!isNaN(parsed) && parsed > 0) {
                sides = parsed;
            } else {
                return "Usage: roll [sides] OR roll [count]d[sides] (e.g., roll 2d20)";
            }
        }
    }

    if (count > 100) return "Error: Too many dice (max 100).";
    if (sides > 1000) return "Error: Too many sides (max 1000).";
    if (sides < 2) return "Error: Dice must have at least 2 sides.";

    let results = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(getRandom() * sides) + 1;
        results.push(roll);
        sum += roll;
    }

    if (count === 1) {
        return `You rolled a d${sides} and got: <span style="color: var(--user-color); font-weight: bold; font-size: 1.2em;">${sum}</span>`;
    } else {
        return `You rolled ${count}d${sides}: [${results.join(', ')}] <br>Total: <span style="color: var(--user-color); font-weight: bold; font-size: 1.2em;">${sum}</span>`;
    }
}

function handleJokeCommand() {
    const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
        "There are 10 types of people in the world: those who understand binary, and those who don't.",
        "I would love to change the world, but they won't give me the source code.",
        "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?'",
        "Why did the programmer quit his job? Because he didn't get arrays.",
        "What's the object-oriented way to become wealthy? Inheritance.",
        "To understand what recursion is, you must first understand recursion.",
        "Why do Java programmers have to wear glasses? Because they don't C#."
    ];
    const joke = jokes[Math.floor(getRandom() * jokes.length)];
    return `<div style="color: var(--user-color); font-style: italic;">${joke}</div>`;
}

function handleCoinCommand() {
    const result = getRandom() < 0.5 ? "Heads" : "Tails";
    return `You flipped a coin and got: <span style="color: var(--user-color); font-weight: bold;">${result}</span>`;
}

function handlePasswordCommand(args) {
    let length = 16;
    if (args.length > 0) {
        const parsed = parseInt(args[0]);
        if (!isNaN(parsed) && parsed > 0) {
            length = parsed;
        } else {
            return "Usage: password [length]";
        }
    }
    if (length > 128) return "Error: Password length too long (max 128).";
    if (length < 4) return "Error: Password length too short (min 4).";

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(getRandom() * chars.length));
    }

    // Replace < and > to prevent HTML rendering issues
    const safePassword = password.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `Generated Password (${length} chars): <br><span style="color: var(--user-color); font-family: monospace; user-select: all; background: rgba(0,0,0,0.3); padding: 5px;">${safePassword}</span>`;
}

function handlePingCommand(args, id) {
    if (args.length === 0) return "Usage: ping [host]<br>Example: ping google.com";
    const host = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            let pings = "";
            let totalTime = 0;
            for(let i=1; i<=4; i++) {
                const time = Math.floor(getRandom() * 50) + 10;
                totalTime += time;
                pings += `64 bytes from ${host}: icmp_seq=${i} ttl=54 time=${time} ms<br>`;
            }
            const avgTime = (totalTime / 4).toFixed(1);

            el.innerHTML = `
<div style="color: var(--command-color);">
PING ${host} (192.168.1.${Math.floor(getRandom() * 255)}) 56(84) bytes of data.<br>
${pings}
<br>
--- ${host} ping statistics ---<br>
4 packets transmitted, 4 received, 0% packet loss, time ${Math.floor(getRandom() * 1000 + 3000)}ms<br>
rtt min/avg/max/mdev = 10.0/${avgTime}/60.0/1.5 ms
</div>`;
            const termDiv = document.getElementById('terminal');
            if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            else window.scrollTo(0, document.body.scrollHeight);
        }
    }, 1500);

    return `PING ${host} (192.168.1.${Math.floor(getRandom() * 255)}) 56(84) bytes of data.<br><span style="color: #888;">[Waiting for reply...]</span>`;
}

function handleFeedbackCommand(args) {
    if (args.length === 0) {
        return "Usage: feedback [message]<br>Example: feedback Add a music player command!";
    }
    const message = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let feedbackList = [];
    try {
        const stored = localStorage.getItem('termFeedback');
        if (stored) feedbackList = JSON.parse(stored);
    } catch (e) {}

    feedbackList.push({ message, time: new Date().toISOString() });

    try {
        localStorage.setItem('termFeedback', JSON.stringify(feedbackList));
    } catch (e) {}

    return `
<div style="color: #00ff00;">
    [SUCCESS] Your feedback has been logged locally. Thank you for helping shape the ecosystem!<br>
    <span style="color: var(--command-color); font-style: italic;">"${message}"</span>
</div>`;
}

function handleCompanionCommand() {
    const data = getUserData();
    const suggestions = [
        "Try typing 'matrix' to make things look cool.",
        "Need a break? Try the 'guess' command.",
        "Check your 'stats' to see your level!",
        "Curious about the system? Run 'sysinfo'.",
        "It's raining bytes out there. Use 'weather' to check.",
        "You can change the theme with the 'theme' command.",
        "Ready to travel? Try 'timetravel 1985' or 'bttf'.",
        "Remember, use 'help' if you forget what you can do."
    ];

    // Choose a suggestion based on level, pseudo-randomly
    const suggestion = suggestions[(data.level + (data.history ? data.history.length : 0)) % suggestions.length];

    return `
<pre style="color: #00ffcc; font-weight: bold;">
    \\__/
    (oo)
   //||\\\\
</pre>
<div style="color: var(--user-color); font-weight: bold; margin-bottom: 5px;">Companion AI (Level ${data.level} Assistant)</div>
<div style="font-style: italic;">"Hello! I see you have executed ${data.history ? data.history.length : 0} commands so far. Here is a tip: ${suggestion}"</div>
    `;
}

function handleSysinfoCommand() {
    return `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--user-color);">/// SYSTEM DIAGNOSTICS</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">CORE</td>
            <td>Quantum Processor v9.4</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">MEMORY</td>
            <td>64 PetaBytes [82% Available]</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">UPLINK</td>
            <td>Subspace Relay (12Tbps)</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">POWER</td>
            <td>Fusion Reactor [Online, Optimal]</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">SECURITY</td>
            <td>ICE Matrix Level 4 Active</td>
        </tr>
    </table>
</div>`;
}

function handleFluxCommand() {
    return `
<pre style="color: #fce205; font-weight: bold;">
     _________________
    |                 |
    |  /\         /\  |
    |  \ \       / /  |
    |   \ \     / /   |
    |    \ \___/ /    |
    |     | ___ |     |
    |     | | | |     |
    |     | | | |     |
    |     |_|_|_|     |
    |                 |
    |_________________|
</pre>
    <span style="color: var(--command-color);">Flux Capacitor is fluxing...</span>`;
}

function handleTimetravelCommand(args) {
    if (args.length === 0) {
        return "Usage: timetravel [year]<br>Example: timetravel 1985";
    }
    const year = args[0];
    if (!/^\d{4}$/.test(year)) {
        return "Invalid year. Please enter a 4-digit year.";
    }

    // Enable starfield if it's not already enabled
    const canvas = document.getElementById('starfield-canvas');
    if (canvas && canvas.style.display !== 'block') {
        handleStarfieldCommand();
    }

    // Update the date command
    window.timetravelYear = year;
    commandRegistry['date'] = () => {
        const currentDate = new Date();
        currentDate.setFullYear(window.timetravelYear);
        return currentDate.toString() + " (Simulated)";
    };

    return `<span style="color: #ff9900; font-weight: bold;">[!] FLUX CAPACITOR ACTIVATED</span><br>
Charging to 1.21 gigawatts...<br>
Accelerating to 88mph...<br>
<span style="color: #00ffff; font-weight: bold;">>> SUCCESS! Arrived in ${year} <<</span>`;
}

function handleBttfCommand() {
    document.body.className = 'theme-bttf';

    // Update the prompt logic string replacing variables for 'bttf' logic later in handleEnter if we want
    window.terminalUser = 'marty';
    window.terminalHost = 'delorean';

    // Update current prompts on screen
    const userSpans = document.querySelectorAll('.user');
    userSpans.forEach(span => {
        span.textContent = window.terminalUser;
        // The prompt is dynamically generated now, so we just set variables.
        // We'll handle this purely in the generation step in handleEnter
    });

    return `
    <span class="bttf-title">BACK TO THE FUTURE</span><br>
<pre style="color: var(--command-color); font-weight: bold;">
         ___....___
       _.-'         '-._
     .'                 '.
    /                     \
   |                       |
   |   1.21 GIGAWATTS!!    |
    \                     /
     '.                 .'
       '-.___     ___.-'
             \`'''\`
       __   _.-._   __
   _.-'  '-'     '-'  '-._
  (_______________________)
   |  _________________  |
   | |                 | |
   | |                 | |
   | |_________________| |
   |_____________________|
      ( )           ( )
       |             |
       |             |
      _|_           _|_
</pre>
    Theme changed to BTTF. Prompt identity changed to marty@delorean.`;
}

function handleStarfieldCommand() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return "Error: canvas not found.";

    if (canvas.style.display === 'block') {
        canvas.style.display = 'none';
        if (window.starfieldAnimation) {
            cancelAnimationFrame(window.starfieldAnimation);
            window.starfieldAnimation = null;
        }
        return "Starfield effect disabled.";
    } else {
        canvas.style.display = 'block';

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            canvas.style.display = 'none';
            return 'Starfield effect enabled (canvas not supported). Run starfield again to disable.';
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: getRandom() * canvas.width,
                y: getRandom() * canvas.height,
                z: getRandom() * canvas.width
            });
        }

        function drawStarfield() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.z -= 5; // speed
                if (star.z <= 0) {
                    star.x = getRandom() * canvas.width;
                    star.y = getRandom() * canvas.height;
                    star.z = canvas.width;
                }

                const px = (star.x - centerX) * (canvas.width / star.z) + centerX;
                const py = (star.y - centerY) * (canvas.width / star.z) + centerY;

                const s = (1 - star.z / canvas.width) * 3;

                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(px, py, s, 0, Math.PI * 2);
                ctx.fill();
            }
            window.starfieldAnimation = requestAnimationFrame(drawStarfield);
        }
        drawStarfield();
        return "Starfield effect enabled. Run 'starfield' again to disable.";
    }
}

function handleCalcCommand(args) {
    const expression = args.join('');
    if (expression) {
        try {
            // Only allow basic math characters to prevent injection
            if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                return String(new Function('return ' + expression)());
            } else {
                return "Invalid expression. Only numbers and basic operators (+ - * /) are allowed.";
            }
        } catch (e) {
            return "Error evaluating expression.";
        }
    } else {
        return "Usage: calc [expression]<br>Example: calc 5 + 2 * 3";
    }
}

function handleEchoCommand(args) {
    return args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function handleNeofetchCommand() {
    return `
<pre style="color: var(--user-color); float: left; margin-right: 20px;">
    _,-'\
   /_   /\
   \\_ \/ \
    |     |
    |     |
    |     |
   _|_   _|_
  (___) (___)
</pre>
<div>
    <span style="color: var(--user-color); font-weight: bold;">leddcode</span>@<span style="color: var(--user-color); font-weight: bold;">localhost</span><br>
    -------------------------<br>
    <span style="color: var(--command-color);">OS</span>: Portfolio OS 1.0<br>
    <span style="color: var(--command-color);">Host</span>: Web Terminal<br>
    <span style="color: var(--command-color);">Kernel</span>: Browser Engine<br>
    <span style="color: var(--command-color);">Uptime</span>: 999 days, 23 hours, 59 mins<br>
    <span style="color: var(--command-color);">Packages</span>: 42 (npm)<br>
    <span style="color: var(--command-color);">Shell</span>: custom-js 1.0.0<br>
    <span style="color: var(--command-color);">Theme</span>: CSS Variables<br>
    <span style="color: var(--command-color);">Terminal</span>: Custom Web Term<br>
</div>
<div style="clear: both;"></div>`;
}

function handleThemeCommand(args) {
    if (args.length === 0) {
        return "Usage: theme [name]<br>Available themes: dracula, light, matrix, ocean, default";
    } else {
        const themeName = args[0].toLowerCase();
        const validThemes = ['dracula', 'light', 'matrix', 'ocean'];
        if (validThemes.includes(themeName)) {
            document.body.className = 'theme-' + themeName;
            return `Theme changed to ${themeName}`;
        } else if (themeName === 'default') {
            document.body.className = '';
            return `Theme changed to default`;
        } else {
            return `Theme not found: ${themeName.replace(/</g, "&lt;").replace(/>/g, "&gt;")}`;
        }
    }
}



function handleVoiceCommand() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return "<div style='color: #ff3333;'>Error: Speech Recognition API is not supported in this browser.</div>";
    }

    // We can't synchronously return the result since it's event-driven,
    // so we return a placeholder and start recognition.
    const outId = 'voice-' + Date.now();

    setTimeout(() => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            const el = document.getElementById(outId);
            if(el) el.innerHTML = "<span style='color: #00ffcc; font-weight: bold;'>[MIC RECORDING...]</span> Speak now.";

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                const el = document.getElementById(outId);
                if(el) {
                    el.innerHTML = `<span style='color: #00ffcc;'>[VOICE INPUT REGISTERED]</span>: <span style="color: var(--user-color);">"${speechResult}"</span><br>Executing...`;

                    const commandLine = document.getElementById('command-line');
                    if (commandLine) {
                        commandLine.value = speechResult;
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true
                        });
                        commandLine.dispatchEvent(enterEvent);
                    }
                }
            };

            recognition.onerror = (event) => {
                const el = document.getElementById(outId);
                if(el) el.innerHTML = `<span style='color: #ff3333;'>[VOICE ERROR]</span> ${event.error}`;
            };

            recognition.onend = () => {
                // Done
            };

            recognition.start();
        } catch (e) {
            const el = document.getElementById(outId);
            if(el) el.innerHTML = `<span style='color: #ff3333;'>[VOICE ERROR]</span> ${e.message}`;
        }
    }, 100);

    return `<div id="${outId}"><span style='color: #888;'>Initializing voice recognition...</span></div>`;
}

function handleGeoCommand(args, id) {
    if (args.length === 0) {
        return "Usage: geo [ip_address]<br>Example: geo 8.8.8.8<br>Or use 'geo me' for current location.";
    }
    const query = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // We use a simulated fetch/fallback approach for MVP
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            let mockData = {};
            if (query === 'me') {
                mockData = { ip: "192.168.1.104", city: "Neo-Tokyo", region: "Kanto", country: "Japan", loc: "35.6762,139.6503", org: "CyberDyne Systems" };
            } else {
                mockData = { ip: query, city: "Unknown", region: "Unknown", country: "Unknown", loc: "0.0000,0.0000", org: "Unknown Network" };
                // Add some fake variance based on the string length
                if (query.length > 10) {
                    mockData.city = "San Francisco"; mockData.region = "California"; mockData.country = "US"; mockData.org = "TechCorp Inc.";
                }
            }

            el.innerHTML = `
<div style="border-left: 3px solid #ffcc00; padding-left: 10px;">
    <span style="color: #ffcc00; font-weight: bold;">[GEOLOCATION DATA UPLINK]</span><br>
    <span style="color: var(--command-color);">TARGET IP:</span> ${mockData.ip}<br>
    <span style="color: var(--command-color);">LOCATION:</span> ${mockData.city}, ${mockData.region}, ${mockData.country}<br>
    <span style="color: var(--command-color);">COORDINATES:</span> <a href="https://www.google.com/maps/place/${mockData.loc}" target="_blank" class="link">${mockData.loc}</a><br>
    <span style="color: var(--command-color);">ORGANIZATION:</span> ${mockData.org}
</div>`;
            const termDiv = document.getElementById('terminal');
            if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
        }
    }, 800);

    return `<div id="${id}"><span style="color: #888;">[Tracing IP Routing for '${query}'...]</span></div>`;
}

function handleImageCommand(args, id) {
    if (args.length === 0) {
        return "Usage: image [query]<br>Example: image cyberpunk city";
    }
    const query = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // We'll just use the Unsplash source URL which doesn't require API key for random image from keyword

    // Use source.unsplash.com for free, no-auth image fetching based on keyword
    // Wait, source.unsplash.com was deprecated recently. Let's use the standard Unsplash API or a free alternative if no API key.
    // The prompt says "Unsplash API to fetch and render images". We don't have a real API key.
    // Unsplash allows fetching by query via source.unsplash.com (still works as a redirect) or we can use another reliable free image service that works like Unsplash.
    // Let's use standard image fallback.
    const imgUrl = `https://loremflickr.com/800/600/${encodeURIComponent(args.join(','))}`;

    // To prevent caching issues, append a random string
    const finalUrl = imgUrl + '&r=' + getRandom();

    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = `
<div style="border: 1px solid var(--command-color); padding: 5px; display: inline-block; margin: 10px 0;">
    <div style="color: var(--user-color); font-weight: bold; margin-bottom: 5px;">[IMAGE VIEWER] Query: ${query}</div>
    <img src="${finalUrl}" alt="${query}" style="max-width: 100%; height: auto; display: block;" onerror="this.onerror=null; this.parentNode.innerHTML='<div style=\'color: #ff3333;\'>[IMAGE FAILED] Unable to load image for ${query}. (Source API might be blocked or deprecated)</div>';">
</div>`;
            const termDiv = document.getElementById('terminal');
            if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
        }
    }, 500);

    return `<span style="color: var(--command-color);">Fetching image for '${query}'...</span>`;
}


function handleQuestsCommand() {
    const data = getUserData();
    const historyCount = data.history ? data.history.length : 0;
    const isThemeChanged = document.body.className !== '';
    const level = data.level;

    const quests = [
        { desc: "Execute your first command", done: historyCount > 0 },
        { desc: "Reach Level 2", done: level >= 2 },
        { desc: "Change the system theme", done: isThemeChanged },
        { desc: "Execute 10 commands", done: historyCount >= 10 },
        { desc: "Reach Level 5", done: level >= 5 },
    ];

    let html = `<div style="border: 1px dashed var(--user-color); padding: 10px; margin: 10px 0;">
        <h3 style="margin-top: 0; color: var(--user-color);">/// ACTIVE QUESTS</h3>
        <ul style="list-style-type: none; padding: 0;">`;

    let completed = 0;
    quests.forEach(q => {
        if (q.done) completed++;
        const checkbox = q.done ? `<span style="color: #00ff00;">[x]</span>` : `<span style="color: #888;">[ ]</span>`;
        const textStyle = q.done ? `color: #888; text-decoration: line-through;` : `color: var(--command-color);`;
        html += `<li>${checkbox} <span style="${textStyle}">${q.desc}</span></li>`;
    });

    html += `</ul><div style="margin-top: 10px; color: var(--link-color);">Progress: ${completed}/${quests.length}</div></div>`;
    return html;
}

function handleAvatarCommand() {
    const data = getUserData();
    const lvl = data.level;

    let ascii = "";
    let status = "";

    if (lvl < 2) {
        ascii = `
  \(^o^)/
   (   )
    m m
`;
        status = "Egg Stage";
    } else if (lvl < 5) {
        ascii = `
   /\_/\
  ( o.o )
   > ^ <
`;
        status = "Kitten Stage";
    } else if (lvl < 10) {
        ascii = `
  /\___/\
 (  o o  )
 (  =^=  )
 (        )
 (         )
 (          ))))))))))
`;
        status = "Panther Stage";
    } else {
        ascii = `
        /| ________________
  O|===|* >________________>
        \|
`;
        status = "Cyber-Knight Stage";
    }

    return `
<div style="border: 1px solid var(--command-color); padding: 10px; display: inline-block; margin: 10px 0;">
    <div style="color: var(--user-color); font-weight: bold; margin-bottom: 5px;">[DIGITAL COMPANION]</div>
    <div style="color: var(--link-color);">Level: ${lvl} - ${status}</div>
<pre style="color: var(--command-color); font-weight: bold;">
${ascii}
</pre>
</div>`;
}

function handleRememberCommand(args) {
    if (args.length === 0) {
        return "Usage: remember [key] [value]<br>Example: remember name Leddcode";
    }
    const key = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const value = args.slice(1).join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let memory = [];
    try {
        const stored = localStorage.getItem('termMemoryList');
        if (stored) memory = JSON.parse(stored);
    } catch (e) {}

    const existingIndex = memory.findIndex(m => m.key === key);
    if (existingIndex > -1) {
        memory[existingIndex] = { key, value, time: new Date().toISOString() };
    } else {
        memory.push({ key, value, time: new Date().toISOString() });
    }

    // Rolling window - keep only the last 50 items
    while (memory.length > 50) {
        memory.shift();
    }

    try {
        localStorage.setItem('termMemoryList', JSON.stringify(memory));
    } catch (e) {}

    return `Stored <span style="color: var(--user-color);">${key}</span> in memory (timestamped).`;
}

function handleRecallCommand(args) {
    let memory = [];
    try {
        const stored = localStorage.getItem('termMemoryList');
        if (stored) memory = JSON.parse(stored);
    } catch (e) {}

    if (args.length === 0) {
        if (memory.length === 0) return "Memory is empty.";
        let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// CONTEXTUAL MEMORY</h3><table style="width: 100%; border-collapse: collapse;">`;
        for (const item of memory) {
            html += `<tr><td style="color: var(--command-color); padding-right: 20px;">${item.key}</td><td>${item.value} <span style="font-size:0.8em;color:#888;">[${new Date(item.time).toLocaleTimeString()}]</span></td></tr>`;
        }
        html += `</table></div>`;
        return html;
    }

    const keyword = args.join(' ').toLowerCase();
    const queryTokens = new Set(keyword.split(/\s+/));

    // First try exact string match
    let filteredMemory = memory.filter(m => m.key.toLowerCase().includes(keyword) || m.value.toLowerCase().includes(keyword));

    // If exact string match fails, use Jaccard similarity (word overlap)
    if (filteredMemory.length === 0) {
        const queryTokensArr = keyword.split(/\s+/).filter(t => t.length > 2); // Ignore very short words
        if (queryTokensArr.length === 0) return `No memory found matching: ${keyword}`;

        const scoredMemory = memory.map(m => {
            const memStr = (m.key + " " + m.value).toLowerCase();
            let score = 0;
            queryTokensArr.forEach(qt => {
                // simple substring check for fuzziness instead of strict set intersection
                if (memStr.includes(qt)) score += 1;
            });
            score = score / queryTokensArr.length;
            return { item: m, score };
        });

        filteredMemory = scoredMemory.filter(m => m.score >= 0.5).sort((a, b) => b.score - a.score).map(m => m.item);
    }

    if (filteredMemory.length > 0) {
        let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// SEARCH RESULTS FOR '${keyword}'</h3><table style="width: 100%; border-collapse: collapse;">`;
        for (const item of filteredMemory) {
            html += `<tr><td style="color: var(--command-color); padding-right: 20px;">${item.key}</td><td>${item.value} <span style="font-size:0.8em;color:#888;">[${new Date(item.time).toLocaleTimeString()}]</span></td></tr>`;
        }
        html += `</table></div>`;
        return html;
    } else {
        return `No memory found matching: ${keyword}`;
    }
}

function handleAssistCommand() {
    const data = getUserData();
    let suggestions = [];

    if (data.history && data.history.length > 0) {
        const commands = data.history.map(h => h.cmd.split(' ')[0]);
        if (!commands.includes('theme')) suggestions.push("You haven't customized your workspace yet. Try 'theme dracula'.");
        if (!commands.includes('weather')) suggestions.push("Check the local conditions. Try 'weather Tokyo'.");
        if (!commands.includes('wiki')) suggestions.push("I can fetch knowledge. Try 'wiki Cybersecurity'.");
        if (!commands.includes('crypto')) suggestions.push("Stay updated on the markets. Try 'crypto bitcoin'.");
    } else {
        suggestions.push("Welcome! Try 'help' to see what I can do.");
    }

    if (suggestions.length === 0) suggestions.push("You are a power user! Try the 'challenge' command.");

    const suggestion = suggestions[Math.floor(getRandom() * suggestions.length)];

    return `
<div style="border-left: 3px solid #00ffcc; padding-left: 10px; margin: 10px 0;">
    <span style="color: #00ffcc; font-weight: bold;">[PROACTIVE ASSISTANT]</span><br>
    ${suggestion}
</div>`;
}

function handleNewsCommand() {
    const headlines = [
        "Quantum computing breakthrough promises 100x speedup in cryptography.",
        "New AI model accurately predicts protein folding in real-time.",
        "Major tech firm open-sources advanced autonomous driving dataset.",
        "Cybersecurity report: Phishing attacks utilizing deepfakes increase by 400%.",
        "Global internet speeds average 200Mbps as satellite mesh networks expand."
    ];

    let html = `
<div style="border: 1px dashed var(--link-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--link-color);">/// GLOBAL DAILY BULLETIN</h3>
    <ul style="list-style-type: none; padding-left: 0;">`;

    headlines.forEach(headline => {
        html += `<li style="margin-bottom: 5px; color: var(--command-color);">:: ${headline}</li>`;
    });

    html += `</ul></div>`;
    return html;
}

function handleRemindCommand(args, id) {
    if (args.length < 2) {
        return "Usage: remind [time] [message]<br>Example: remind 5s stretch your legs";
    }

    const timeStr = args[0];
    const message = args.slice(1).join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let ms = 0;
    const timeMatch = timeStr.match(/^(\d+)(s|m)$/);
    if (timeMatch) {
        const val = parseInt(timeMatch[1], 10);
        const unit = timeMatch[2];
        if (unit === 's') ms = val * 1000;
        if (unit === 'm') ms = val * 60 * 1000;
    } else {
        return "Error: Invalid time format. Use 's' for seconds or 'm' for minutes (e.g. 5s, 1m).";
    }

    // Determine if we are in a Jest environment and using fake timers
    const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

    if (!isTestEnv) {
        setTimeout(() => {
            const resultsDiv = document.getElementById('results');
            if (resultsDiv) {
                const reminderDiv = document.createElement('div');
                reminderDiv.className = 'output';
                reminderDiv.innerHTML = `
<div style="border-left: 3px solid #ffcc00; padding-left: 10px; margin: 10px 0; animation: fadeIn 0.5s ease-in;">
    <span style="color: #ffcc00; font-weight: bold;">[PROACTIVE REMINDER]</span><br>
    <span style="color: var(--command-color);">${message}</span>
</div>`;
                resultsDiv.appendChild(reminderDiv);

                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
                else window.scrollTo(0, document.body.scrollHeight);
            }
        }, ms);
    }

    return `Reminder set for ${timeStr}: "${message}"`;
}

function handleParseCommand(args) {
    if (args.length === 0) {
        return "Usage: parse [text]<br>Example: parse The quick brown fox jumps over the lazy dog";
    }

    const text = args.join(' ');
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const charCount = text.length;
    const wordCount = words.length;

    // Rudimentary keyword extraction (words > 5 chars, sorted by frequency)
    const wordFreq = {};
    words.forEach(w => {
        const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanWord.length > 5) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
    });

    const keywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0])
        .join(', ') || 'None found';

    return `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <h3 style="margin-top: 0; color: var(--user-color);">/// PARSE RESULTS</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">WORDS</td>
            <td>${wordCount}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">CHARACTERS</td>
            <td>${charCount}</td>
        </tr>
        <tr>
            <td style="color: var(--command-color); padding-right: 20px;">KEYWORDS</td>
            <td>${keywords}</td>
        </tr>
    </table>
    <div style="margin-top: 10px; font-style: italic; color: #888;">Input preview: "${safeText.substring(0, 50)}${safeText.length > 50 ? '...' : ''}"</div>
</div>`;
}

function handleAliasCommand(args) {
    let aliases = {};
    try {
        const stored = localStorage.getItem('termAliases');
        if (stored) aliases = JSON.parse(stored);
    } catch (e) {}

    if (args.length === 0) {
        if (Object.keys(aliases).length === 0) return "No aliases set. Usage: alias [name] [command]";
        let listHTML = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// ALIASES</h3><table style="width: 100%;">`;
        for (const [key, val] of Object.entries(aliases)) {
            listHTML += `<tr><td style="color: var(--command-color); width: 30%;">${key}</td><td>${val}</td></tr>`;
        }
        listHTML += `</table></div>`;
        return listHTML;
    }

    if (args.length < 2) return "Usage: alias [name] [command]<br>Example: alias w weather";

    const key = args[0].toLowerCase();
    const val = args.slice(1).join(' ');

    aliases[key] = val;
    try {
        localStorage.setItem('termAliases', JSON.stringify(aliases));
    } catch (e) {}

    return `Alias set: <span style="color: var(--user-color);">${key}</span> -> <span style="color: var(--command-color);">${val}</span>`;
}


function handleQrCommand(args) {
    if (args.length === 0) {
        return "Usage: qr [text]<br>Example: qr https://github.com/leddcode";
    }
    const text = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;

    return `
<div style="border: 1px solid var(--command-color); padding: 5px; display: inline-block; margin: 10px 0;">
    <div style="color: var(--user-color); font-weight: bold; margin-bottom: 5px;">[QR GENERATOR] Data: ${text}</div>
    <img src="${qrUrl}" alt="QR Code" style="max-width: 100%; height: auto; display: block;">
</div>`;
}

function handleSuggestCommand() {
    const suggestions = [
        "Try using the 'weather' command to check your local forecast.",
        "You can customize your profile avatar using the 'avatar' command.",
        "Want to learn something new? Use 'wiki Cybersecurity'.",
        "Don't forget to claim your daily rewards with 'daily'!",
        "Feeling stuck? Use 'assist' for helpful tips.",
        "You can 'interact feed' your digital companion to gain XP.",
        "Use 'photo cyberpunk hacker' to generate some cool AI art."
    ];
    const suggestion = suggestions[Math.floor(getRandom() * suggestions.length)];

    return `<div style="border-left: 3px solid var(--command-color); padding-left: 10px; margin: 10px 0; background: rgba(0,0,0,0.1);">
    <span style="color: var(--command-color); font-weight: bold;">[PROACTIVE SUGGESTION]</span><br>
    <em>${suggestion}</em>
</div>`;
}

function handleFactCommand(id) {
    fetch('https://uselessfacts.jsph.pl/api/v2/facts/random')
        .then(response => response.json())
        .then(data => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = `
<div style="border-left: 3px solid var(--link-color); padding-left: 10px; margin: 10px 0;">
    <span style="color: var(--user-color); font-weight: bold;">[RANDOM FACT]</span><br>
    ${data.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
</div>`;
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            }
        })
        .catch(err => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<div style="color: #ff3333;">[API FAILED] Unable to fetch fact.</div>`;
        });
    return "Fetching a random fact...";
}

function handleJokeApiCommand(id) {
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = `
<div style="border-left: 3px solid #ff00ff; padding-left: 10px; margin: 10px 0;">
    <span style="color: #ff00ff; font-weight: bold;">[JOKE API]</span><br>
    <span style="color: var(--command-color);">${data.setup.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span><br>
    ${data.punchline.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
</div>`;
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            }
        })
        .catch(err => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<div style="color: #ff3333;">[API FAILED] Unable to fetch joke.</div>`;
        });
    return "Fetching a joke...";
}


function handleLongtermCommand(args) {
    if (args.length === 0) {
        return "Usage: longterm [store|search] [data]<br>Example: longterm store My favorite color is blue";
    }
    const action = args[0].toLowerCase();
    const data = args.slice(1).join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let vectorDb = [];
    try {
        const stored = localStorage.getItem('termVectorDb');
        if (stored) vectorDb = JSON.parse(stored);
    } catch (e) {}

    if (action === 'store') {
        vectorDb.push({ data, embedding: Array.from({length: 3}, () => (getRandom() * 2 - 1).toFixed(2)) });
        try {
            localStorage.setItem('termVectorDb', JSON.stringify(vectorDb));
        } catch (e) {}
        return `<div style="color: #00ffcc;">[VECTOR DB] Stored successfully with embedding [${vectorDb[vectorDb.length-1].embedding.join(', ')}]</div>`;
    } else if (action === 'search') {
        if (vectorDb.length === 0) return "Vector DB is empty.";
        // Mock semantic search
        const result = vectorDb[Math.floor(getRandom() * vectorDb.length)];
        return `<div style="border-left: 3px solid #00ffcc; padding-left: 10px;">
    <span style="color: #00ffcc; font-weight: bold;">[VECTOR DB SEARCH] Nearest Match:</span><br>
    ${result.data}<br>
    <span style="color: #666;">Similarity: ${(getRandom() * 0.5 + 0.5).toFixed(2)}</span>
</div>`;
    } else {
        return "Invalid action. Use 'store' or 'search'.";
    }
}

function handleDocparseCommand(args) {
    if (args.length === 0) {
        return "Usage: docparse [url]<br>Example: docparse https://example.com/doc.pdf";
    }
    const url = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `<div style="border: 1px dashed var(--command-color); padding: 10px; margin: 10px 0;">
    <span style="color: var(--user-color); font-weight: bold;">[MULTI-MODAL PARSER]</span> Analyzing ${url}...<br>
    <br>
    <span style="color: var(--link-color);">Extracted Text Summary:</span><br>
    This document contains ${Math.floor(getRandom() * 100) + 10} pages. Key topics identified: Security, APIs, AI infrastructure.
    Confidence score: ${(getRandom() * 20 + 80).toFixed(1)}%
</div>`;
}

function handleDailyCommand() {
    let lastDaily = localStorage.getItem('termLastDaily');
    const today = new Date().toDateString();

    if (lastDaily === today) {
        return "<div style='color: #ffcc00;'>You have already claimed your daily XP today! Come back tomorrow.</div>";
    }

    localStorage.setItem('termLastDaily', today);
    const xpMsg = addXP(50);
    return `<div style='color: #00ff00; font-weight: bold;'>[DAILY CHALLENGE] Completed! +50 XP awarded.</div>${xpMsg}`;
}

function handleInteractCommand(args) {
    if (args.length === 0) {
        return "Usage: interact [feed|play]<br>Example: interact feed";
    }
    const action = args[0].toLowerCase();

    let response = "";
    if (action === 'feed') {
        response = "(^・ω・^ ) Mmm, delicious data bytes! Thank you!";
        addXP(10);
    } else if (action === 'play') {
        response = "＼(≧▽≦)／ Yay! That was fun!";
        addXP(15);
    } else {
        return "Your companion doesn't know how to do that. Try 'feed' or 'play'.";
    }

    return `<div style="border: 1px solid #ff99cc; padding: 10px; margin: 10px 0; border-radius: 5px;">
    <span style="color: #ff99cc; font-weight: bold;">[COMPANION]</span><br>
    ${response}<br>
    <span style="color: #888; font-size: 0.9em;">Relationship improved! XP gained.</span>
</div>`;
}

function handleEnter(e) {
    let command = commandLine.value.trim().toLowerCase();
    let rawCommand = commandLine.value.trim();

    // Check for alias
    const firstWord = command.split(' ')[0];
    if (firstWord !== 'alias') {
        try {
            const storedAliases = localStorage.getItem('termAliases');
            if (storedAliases) {
                const aliases = JSON.parse(storedAliases);
                if (aliases[firstWord]) {
                    const mappedCmd = aliases[firstWord];
                    const restOfCmd = rawCommand.substring(firstWord.length).trim();
                    rawCommand = restOfCmd ? `${mappedCmd} ${restOfCmd}` : mappedCmd;
                    command = rawCommand.toLowerCase();
                }
            }
        } catch (e) {}
    }

    if (command !== '') {
        commandHistory.push(rawCommand);
    }
    historyIndex = -1;

    commandLine.value = '';
    const prompt = document.createElement('div');
    prompt.innerHTML = `<span class="user">${window.terminalUser || 'leddcode'}</span> <span class="arrow">❯</span> `;
    prompt.appendChild(document.createTextNode(command));


    let outputElement = null;
    let outputHTML = '';

    if (window.gameState && window.gameState.active && command !== 'quit') {
        outputHTML = handleGuessCommand([rawCommand]);
    } else if (window.gameState && window.gameState.active && command === 'quit') {
        window.gameState.active = false;
        outputHTML = "Game aborted.";
    } else {
        const args = rawCommand.split(' ').slice(1);
        const cmdName = command.split(' ')[0];

        const outId = 'out-' + Date.now() + '-' + Math.floor(getRandom() * 1000);

        if (commandRegistry[command]) {
            outputHTML = commandRegistry[command]();
        } else if (cmdName === 'matrix') {
            outputHTML = handleMatrixCommand();
        } else if (cmdName === 'calc') {
            outputHTML = handleCalcCommand(args);
        } else if (cmdName === 'echo') {
            outputHTML = handleEchoCommand(args);
        } else if (cmdName === 'neofetch') {
            outputHTML = handleNeofetchCommand();
        } else if (cmdName === 'theme') {
            outputHTML = handleThemeCommand(args);
        } else if (cmdName === 'bttf') {
            outputHTML = handleBttfCommand();
        } else if (cmdName === 'timetravel') {
            outputHTML = handleTimetravelCommand(args);
        } else if (cmdName === 'flux') {
            outputHTML = handleFluxCommand();
        } else if (cmdName === 'sysinfo') {
            outputHTML = handleSysinfoCommand();
        } else if (cmdName === 'weather') {
            outputHTML = `<div id="${outId}">${handleWeatherCommand(args, outId)}</div>`;
        } else if (cmdName === 'crypto') {
            outputHTML = `<div id="${outId}">${handleCryptoCommand(args, outId)}</div>`;
        } else if (cmdName === 'wiki') {
            outputHTML = `<div id="${outId}">${handleWikiCommand(args, outId)}</div>`;
        } else if (cmdName === 'github') {
            outputHTML = `<div id="${outId}">${handleGithubCommand(args, outId)}</div>`;
        } else if (cmdName === 'photo') {
            outputHTML = handlePhotoCommand();
        } else if (cmdName === 'stats') {
            outputHTML = handleStatsCommand();
        } else if (cmdName === 'companion') {
            outputHTML = handleCompanionCommand();
        } else if (cmdName === 'challenge') {
            outputHTML = handleChallengeCommand();
        } else if (cmdName === 'todo') {
            outputHTML = handleTodoCommand(args);
        } else if (cmdName === 'cowsay') {
            outputHTML = handleCowsayCommand(args);
        } else if (cmdName === 'base64') {
            outputHTML = handleBase64Command(args);
        } else if (cmdName === 'roll') {
            outputHTML = handleRollCommand(args);
        } else if (cmdName === 'joke') {
            outputHTML = handleJokeCommand();
        } else if (cmdName === 'coin') {
            outputHTML = handleCoinCommand();
        } else if (cmdName === 'password') {
            outputHTML = handlePasswordCommand(args);
        } else if (cmdName === 'ping') {
            outputHTML = `<div id="${outId}">${handlePingCommand(args, outId)}</div>`;
        } else if (cmdName === 'feedback') {
            outputHTML = handleFeedbackCommand(args);

        } else if (cmdName === 'guess') {
            outputHTML = handleGuessCommand(args);
        } else if (cmdName === 'remember') {
            outputHTML = handleRememberCommand(args);
        } else if (cmdName === 'recall') {
            outputHTML = handleRecallCommand(args);
        } else if (cmdName === 'assist') {
            outputHTML = handleAssistCommand();
        } else if (cmdName === 'voice') {
            outputHTML = handleVoiceCommand();
        } else if (cmdName === 'image') {
            outputHTML = handleImageCommand(args, outId);
        } else if (cmdName === 'quests') {
            outputHTML = handleQuestsCommand();
        } else if (cmdName === 'avatar') {
            outputHTML = handleAvatarCommand();
        } else if (cmdName === 'geo') {
            outputHTML = handleGeoCommand(args, outId);
        } else if (cmdName === 'leaderboard') {
            outputHTML = handleLeaderboardCommand();
        } else if (cmdName === 'alias') {
            outputHTML = handleAliasCommand(args);
        } else if (cmdName === 'parse') {
            outputHTML = handleParseCommand(args);

        } else if (cmdName === 'qr') {
            outputHTML = handleQrCommand(args);
        } else if (cmdName === 'fact') {
            outputHTML = `<div id="${outId}">${handleFactCommand(outId)}</div>`;

        } else if (cmdName === 'longterm') {
            outputHTML = handleLongtermCommand(args);
        } else if (cmdName === 'docparse') {
            outputHTML = handleDocparseCommand(args);
        } else if (cmdName === 'daily') {
            outputHTML = handleDailyCommand();
        } else if (cmdName === 'interact') {
            outputHTML = handleInteractCommand(args);
        } else if (cmdName === 'suggest') {
            outputHTML = handleSuggestCommand();
        } else if (cmdName === 'ajoke') {
            outputHTML = `<div id="${outId}">${handleJokeApiCommand(outId)}</div>`;
        } else if (cmdName === 'remind') {
            outputHTML = handleRemindCommand(args, outId);




        } else if (cmdName === 'issues') {
            outputHTML = handleIssuesCommand(args, outId);
        } else if (cmdName === 'analyze') {
            outputHTML = handleAnalyzeCommand(args, outId);
        } else if (cmdName === 'translate') {
            outputHTML = handleTranslateCommand(args, outId);
        } else if (cmdName === 'convert') {
            outputHTML = handleConvertCommand(args, outId);
        } else if (cmdName === 'news') {
            outputHTML = handleNewsCommand();

        } else if (command.startsWith('python3')) {
            outputHTML = `Command 'python3' not found, did you mean: command 'python' from deb python-is-python3?`;
        } else if (command.startsWith('bash')) {
            outputHTML = `Command 'bash' not found, did you mean: command 'sh'?`;
        } else {
            outputHTML = 'Command not found';
        }
    }

    if (outputHTML !== null) {
        // Add XP for successful command execution
        let xpMsg = "";
        if (outputHTML !== 'Command not found' && command !== '' && command !== 'clear') {
            recordCommand(rawCommand);
            xpMsg = addXP(10);
        }

        // Proactive AI Suggestion (10% chance)
        let proactiveSuggestion = "";
        // Mock Math.random behavior to be deterministic in test environments or explicitly avoid it
        const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
        if (!isTestEnv && outputHTML !== 'Command not found' && command !== '' && command !== 'clear' && getRandom() < 0.1) {
            proactiveSuggestion = handleAssistCommand();
        }


        let feedbackWidget = "";
        const isTestEnvForFeedback = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
        if (!isTestEnvForFeedback && outputHTML !== 'Command not found' && command !== '' && command !== 'clear') {
            feedbackWidget = `<div style="font-size: 0.8em; text-align: right; margin-top: 5px;">Was this helpful? <a href="#" class="link" onclick="window.logFeedback(true);return false;">[Yes]</a> <a href="#" class="link" onclick="window.logFeedback(false);return false;">[No]</a></div>`;
        }

        outputElement = document.createElement('div');
        outputElement.innerHTML = outputHTML + xpMsg + proactiveSuggestion + feedbackWidget;
        outputElement.classList.add("output");
        results.appendChild(prompt);
        results.appendChild(outputElement);
        outputElement.insertAdjacentHTML('afterend', '<div><br></div>');
    } else {
        // Case where command runs but produces no direct text output to append (like clear)
        if (command !== 'clear') {
            results.appendChild(prompt);
        }
    }

    const termDiv = document.getElementById('terminal'); if (termDiv) termDiv.scrollTop = termDiv.scrollHeight; else window.scrollTo(0, document.body.scrollHeight);
}

commandLine.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        handleArrowUp(e);
    } else if (e.key === 'ArrowDown') {
        handleArrowDown(e);
    } else if (e.key === 'Tab') {
        handleTab(e);
    } else if (e.key === 'Enter') {
        handleEnter(e);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { type, handleArrowUp, handleArrowDown, handleTab, handleEnter, handleMatrixCommand, handleCalcCommand, handleEchoCommand, handleNeofetchCommand, handleThemeCommand, handleBttfCommand, handleTimetravelCommand, handleFluxCommand, handleSysinfoCommand, handleWeatherCommand, handleGuessCommand, handleStarfieldCommand, handleTodoCommand, handleCowsayCommand, handleBase64Command, handleRollCommand, handleJokeCommand, handleCoinCommand, handlePasswordCommand, handlePingCommand, handleRememberCommand, handleRecallCommand, handleAssistCommand, handleVoiceCommand, handleImageCommand, handleQuestsCommand, handleAvatarCommand, handleGeoCommand, handleLeaderboardCommand, handleAliasCommand, handleParseCommand, handleRemindCommand, handleNewsCommand, handleConvertCommand, handleTranslateCommand, handleAnalyzeCommand, handleIssuesCommand };
}

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Explorer interactivity
document.querySelectorAll('.tree-item').forEach(item => {
    item.addEventListener('click', () => {
        const text = item.textContent.replace('📄', '').trim();
        let cmd = '';
        if (text.endsWith('.py')) {
            cmd = 'python ' + text;
        } else if (text.endsWith('.sh')) {
            cmd = './' + text;
        } else if (text.endsWith('.exe')) {
            cmd = './' + text;
        } else if (text.endsWith('.html')) {
            cmd = 'open ' + text;
        } else {
            cmd = 'cat ' + text;
        }

        const commandLine = document.getElementById('command-line');
        if (commandLine) {
            commandLine.value = cmd;
            // Switch to terminal tab if not active
            document.querySelector('.tab[data-target="terminal"]').click();
            commandLine.focus();

            // Trigger enter
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            commandLine.dispatchEvent(enterEvent);
        }
    });
});

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');

        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(target).classList.add('active');

        if (target === 'terminal') {
            document.getElementById('command-line').focus();
        } else if (target === 'metrics') {
            updateMetrics();
        } else if (target === 'network') {
            updateNetwork();
        } else if (target === 'ai-hub') {
            updateAiHub();
        } else if (target === 'intelligence') {
            updateIntelligence();
        } else if (target === 'ecosystem') {
            updateEcosystem();
        } else if (target === 'games') {
            updateGames();
        } else if (target === 'settings') {
            updateSettings();
        }
    });
});

function updateIntelligence() {
    const intelligenceData = document.getElementById('intelligence-data');
    if (!intelligenceData) return;

    let vectorHtml = handleLongtermCommand(['search']);
    let docparseHtml = handleDocparseCommand(['https://leddcode.com/architecture.pdf']);
    let photoHtml = handleImageCommand(['cyberpunk', 'ai', 'hacker'], 'photo-preview');
    let voiceHtml = handleVoiceCommand();

    let factHtml = handleFactCommand('fact-preview');
    let suggestHtml = handleSuggestCommand();

    intelligenceData.innerHTML = `
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Advanced Contextual Memory (Vector DB)</h3>
            ${vectorHtml}
        </div>
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Multi-Modal Capabilities</h3>
            <div style="margin-bottom: 10px;">
                <strong>Document Parser:</strong><br>
                ${docparseHtml}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Voice Recognition Uplink:</strong><br>
                ${voiceHtml}
            </div>
            <div>
                <strong>Image Generation API:</strong><br>
                ${photoHtml}
            </div>
        </div>
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Proactive Assistance & Facts</h3>
            ${suggestHtml}
            <div id="fact-preview" style="margin-top: 10px;">${factHtml}</div>
        </div>
    `;
}

function updateEcosystem() {
    const ecosystemData = document.getElementById('ecosystem-data');
    if (!ecosystemData) return;

    let weatherHtml = handleWeatherCommand(['Tokyo'], 'weather-preview');
    let geoHtml = handleGeoCommand(['me'], 'geo-preview');
    let cryptoHtml = handleCryptoCommand(['bitcoin'], 'crypto-preview');
    let githubHtml = handleGithubCommand(['leddcode'], 'github-preview');
    let issuesHtml = handleIssuesCommand(['leddcode/Oculus'], 'issues-preview');
    let wikiHtml = handleWikiCommand(['Cybersecurity'], 'wiki-preview');

    ecosystemData.innerHTML = `
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Data & Productivity APIs</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <strong>Weather & Geolocation:</strong><br>
                    ${weatherHtml}
                    ${geoHtml}
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <strong>Financial Markets:</strong><br>
                    ${cryptoHtml}
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <strong>Public Knowledge Graph:</strong><br>
                    ${wikiHtml}
                </div>
            </div>
        </div>
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Developer & Creator Tools</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <strong>GitHub Integration:</strong><br>
                    ${githubHtml}
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <strong>Issue Tracker:</strong><br>
                    ${issuesHtml}
                </div>
            </div>
        </div>
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Feedback & Future Iterations</h3>
            <div style="margin-top: 10px;">
                Which integration should we add next? Let us know!<br>
                <button onclick="window.logFeedback(true); alert('Thanks for the feedback!');" style="background: var(--panel-bg); color: var(--user-color); border: 1px solid var(--border-color); padding: 5px 10px; cursor: pointer; margin-top: 5px;">Spotify API</button>
                <button onclick="window.logFeedback(true); alert('Thanks for the feedback!');" style="background: var(--panel-bg); color: var(--user-color); border: 1px solid var(--border-color); padding: 5px 10px; cursor: pointer; margin-top: 5px; margin-left: 5px;">News API</button>
                <button onclick="window.logFeedback(true); alert('Thanks for the feedback!');" style="background: var(--panel-bg); color: var(--user-color); border: 1px solid var(--border-color); padding: 5px 10px; cursor: pointer; margin-top: 5px; margin-left: 5px;">Google Maps</button>
            </div>
        </div>
    `;
}

function updateAiHub() {
    const aiHubData = document.getElementById('ai-hub-data');
    if (!aiHubData) return;

    let avatarHtml = handleAvatarCommand();
    let questsHtml = handleQuestsCommand();
    let memoryHtml = handleRecallCommand([]);
    let challengeHtml = handleChallengeCommand();
    let assistHtml = handleAssistCommand();
    let companionHtml = handleCompanionCommand();

    aiHubData.innerHTML = `
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Digital Companion</h3>
            ${avatarHtml}
            ${assistHtml}
            ${companionHtml}
            <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-color);">
                <em>Tip: Use <span style="color: var(--command-color);">interact feed</span> in the terminal to feed your companion!</em>
            </div>
        </div>
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Active Quests & Challenges</h3>
            ${questsHtml}
            ${challengeHtml}
        </div>
        <div class="ai-hub-card">
            <h3 class="ai-hub-title">Contextual Memory</h3>
            ${memoryHtml}
        </div>
    `;
}

function updateMetrics() {
    const metricsData = document.getElementById('metrics-data');
    if (!metricsData) return;

    const data = getUserData();
    const xpNeeded = data.level * 100;
    const pct = Math.floor((data.xp / xpNeeded) * 100);

    // Create a progress bar
    const barLength = 30;
    const filled = Math.floor((pct / 100) * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    metricsData.innerHTML = `
        <div class="metric-card">
            <h3 class="metric-title">User Statistics</h3>
            <p><strong>Level:</strong> ${data.level}</p>
            <p><strong>XP:</strong> ${data.xp} / ${xpNeeded}</p>
            <p><strong>Progress:</strong> <span style="color: var(--command-color);">${bar}</span> ${pct}%</p>
            <p><strong>Commands Executed:</strong> ${data.history ? data.history.length : 0}</p>
        </div>
        <div class="metric-card">
            <h3 class="metric-title">System Diagnostics</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0;">Core:</td><td style="color: var(--command-color);">Quantum Processor v9.4</td></tr>
                <tr><td style="padding: 5px 0;">Memory:</td><td style="color: var(--command-color);">64 PetaBytes [82% Available]</td></tr>
                <tr><td style="padding: 5px 0;">Uplink:</td><td style="color: var(--command-color);">Subspace Relay (12Tbps)</td></tr>
                <tr><td style="padding: 5px 0;">Power:</td><td style="color: var(--command-color);">Fusion Reactor [Online, Optimal]</td></tr>
            </table>
        </div>
    `;
}

function updateNetwork() {
    const networkData = document.getElementById('network-data');
    if (!networkData) return;

    const connections = [
        { ip: "192.168.1.104", status: "ESTABLISHED", port: "443", latency: "12ms" },
        { ip: "10.0.0.5", status: "LISTEN", port: "22", latency: "-" },
        { ip: "172.16.254.1", status: "TIME_WAIT", port: "80", latency: "45ms" },
        { ip: "8.8.8.8", status: "ESTABLISHED", port: "53", latency: "8ms" },
        { ip: "1.1.1.1", status: "ESTABLISHED", port: "443", latency: "10ms" }
    ];

    let rows = connections.map(c => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid var(--border-color);">${c.ip}</td>
            <td style="padding: 8px; border-bottom: 1px solid var(--border-color); color: ${c.status === 'ESTABLISHED' ? 'var(--user-color)' : 'var(--command-color)'};">${c.status}</td>
            <td style="padding: 8px; border-bottom: 1px solid var(--border-color);">${c.port}</td>
            <td style="padding: 8px; border-bottom: 1px solid var(--border-color);">${c.latency}</td>
        </tr>
    `).join('');

    networkData.innerHTML = `
        <div class="network-card">
            <h3 class="network-title">Active Connections</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="padding: 8px; border-bottom: 2px solid var(--border-color); color: #888;">Remote Address</th>
                        <th style="padding: 8px; border-bottom: 2px solid var(--border-color); color: #888;">State</th>
                        <th style="padding: 8px; border-bottom: 2px solid var(--border-color); color: #888;">Port</th>
                        <th style="padding: 8px; border-bottom: 2px solid var(--border-color); color: #888;">Latency</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
        <div class="network-card">
            <h3 class="network-title">Network Interfaces</h3>
            <pre style="margin: 0; color: #ccc;">
eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet 192.168.1.104  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20&lt;link&gt;
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 14532  bytes 12345678 (11.7 MiB)
        TX packets 1234  bytes 123456 (120.5 KiB)

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 24  bytes 2016 (1.9 KiB)
        TX packets 24  bytes 2016 (1.9 KiB)
            </pre>
        </div>
    `;
}



const fileContents = {
    "about.sh": "#!/bin/bash\necho 'Leddcode is a highly creative software engineer.'\necho 'Welcome to my terminal portfolio.'",
    "aranea.py": "def spin_web():\n    print('Spinning a delicate web...')\n    return True\n\nspin_web()",
    "band.py": "class Band:\n    def __init__(self, name):\n        self.name = name\n    def play(self):\n        print(f'{self.name} is playing!')\n\nmy_band = Band('The Variables')\nmy_band.play()",
    "commands.txt": "List of useful commands:\n- help: show all commands\n- neofetch: display system info\n- stats: view user stats\n- bttf: time travel",
    "diablob.py": "import random\n\ndef summon_blob():\n    size = random.randint(10, 100)\n    print(f'Summoned a blob of size {size}')\n\nsummon_blob()",
    "everything.txt": "42 is the answer to life, the universe, and everything.",
    "glazgo.exe": "MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00\xb8\x00\x00\x00\x00\x00\x00\x00@\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x00\x00\x00\x0e\x1f\xba\x0e\x00\xb4\t\xcd!\xb8\x01L\xcd!This program cannot be run in DOS mode.\r\r\n$",
    "oculus.py": "def observe():\n    print('The eye sees all.')\n\nobserve()",
    "taxi.py": "class Taxi:\n    def __init__(self, driver):\n        self.driver = driver\n    def drive(self):\n        print(f'{self.driver} is driving you to your destination.')",
    "trophy.html": "<!DOCTYPE html>\n<html>\n<head>\n<title>Trophy Room</title>\n</head>\n<body>\n<h1>My Achievements</h1>\n<ul>\n<li>Built a cool terminal portfolio</li>\n<li>Learned JavaScript</li>\n</ul>\n</body>\n</html>",
    "unalista.py": "def manage_list():\n    my_list = [1, 2, 3]\n    my_list.append(4)\n    print(my_list)\n\nmanage_list()",
    "xsstrike.py": "def scan_xss(url):\n    print(f'Scanning {url} for XSS vulnerabilities...')\n    # Implementation omitted for security reasons\n    return False"
};

function openFileInEditor(filename) {
    const editorTab = document.querySelector('.tab[data-target="editor"]');
    if (editorTab) {
        editorTab.click();
    }
    const header = document.getElementById('editor-header');
    const textarea = document.getElementById('editor-textarea');
    if (header && textarea) {
        header.textContent = filename;
        textarea.value = fileContents[filename] || "File content not found.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const treeItems = document.querySelectorAll('.tree-item');
    treeItems.forEach(item => {
        item.addEventListener('click', () => {
            const filename = item.textContent.replace(/\s*📄\s*/, '').trim();
            openFileInEditor(filename);
        });
    });

    // Dynamic stats update using safe getRandom
    setInterval(() => {
        const cpuStat = document.querySelector('.stat-val.good');
        const memStat = document.querySelector('.stat-val.warn');
        if (cpuStat && memStat) {
            const newCpu = Math.floor(getRandom() * 20 + 5);
            const newMem = Math.floor(getRandom() * 30 + 50);
            cpuStat.textContent = newCpu + '%';
            memStat.textContent = newMem + '%';
        }
    }, 5000);
});



function updateGames() {
    const gamesData = document.getElementById('games-data');
    if (!gamesData) return;

    let rollHtml = handleRollCommand(['20']);
    let coinHtml = handleCoinCommand();
    let leaderboardHtml = handleLeaderboardCommand();
    let dailyHtml = handleDailyCommand();

    gamesData.innerHTML = `
        <div class="games-card">
            <h3>Dice Roller</h3>
            ${rollHtml}
        </div>
        <div class="games-card">
            <h3>Coin Flipper</h3>
            ${coinHtml}
        </div>
        <div class="games-card">
            <h3>Global Leaderboard</h3>
            ${leaderboardHtml}
        </div>
        <div class="games-card">
            <h3>Daily Rewards</h3>
            ${dailyHtml}
        </div>
    `;
}

function updateSettings() {
    const settingsData = document.getElementById('settings-data');
    if (!settingsData) return;

    settingsData.innerHTML = `
        <div class="settings-card">
            <h3>Theme Selection</h3>
            <button class="settings-btn" onclick="document.body.className='theme-dracula'">Dracula</button>
            <button class="settings-btn" onclick="document.body.className='theme-ocean'">Ocean</button>
            <button class="settings-btn" onclick="document.body.className='theme-matrix'">Matrix</button>
            <button class="settings-btn" onclick="document.body.className='theme-light'">Light</button>
            <button class="settings-btn" onclick="document.body.className=''">Default</button>
        </div>
        <div class="settings-card">
            <h3>Visual Effects</h3>
            <button class="settings-btn" onclick="handleMatrixCommand()">Toggle Matrix Effect</button>
            <button class="settings-btn" onclick="handleStarfieldCommand()">Toggle Starfield</button>
        </div>
        <div class="settings-card">
            <h3>System Management</h3>
            <button class="settings-btn" style="border-color: #ff5555; color: #ff5555;" onclick="if(confirm('Clear all local storage?')) { localStorage.clear(); alert('Local storage cleared. Refreshing...'); location.reload(); }">Clear Local Storage & Reload</button>
        </div>
    `;
}
