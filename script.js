const results = document.getElementById('results');
const commandLine = document.getElementById('command-line');

const commandHistory = [];
let historyIndex = -1;

const fileList = ['about.sh', 'aranea.py', 'commands.txt', 'diablob.py', 'glazgo.exe', 'oculus.py', 'trophy.html', 'xsstrike.py'];

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

type(greeting, results);


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
      commands.txt
      <a href="https://github.com/leddcode/Diablob" class="link" target="_blank">diablob.py</a>
      <a href="https://github.com/leddcode/GlazGo" class="link" target="_blank">glazgo.exe</a>
      <a href="https://github.com/leddcode/Oculus" class="link" target="_blank">oculus.py</a>
      <a href="https://trophy.onrender.com/" class="link" target="_blank">trophy.html</a>
      <a href="https://github.com/leddcode/XSStrike" class="link" target="_blank">xsstrike.py</a>
      `,
  'python oculus.py': () => { window.open("https://github.com/leddcode/Oculus", "_blank"); return oculus; },
  'python aranea.py': () => { window.open("https://github.com/leddcode/Aranea", "_blank"); return aranea; },
  'python diablob.py': () => { window.open("https://github.com/leddcode/Diablob", "_blank"); return diablob; },
  'python xsstrike.py': () => { window.open("https://github.com/leddcode/XSStrike", "_blank"); return xsstrike; },
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
  'help': () => `ls, pwd, whoami, clear, date, sudo, theme, matrix, neofetch, echo, calc, bttf, timetravel, flux, sysinfo, weather, guess`,
};

// Generate cmdList dynamically
const customCommands = ['theme', 'matrix', 'neofetch', 'echo', 'calc', 'bttf', 'timetravel', 'flux', 'sysinfo', 'weather', 'guess'];
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
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
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
        window.gameState.target = Math.floor(Math.random() * 100) + 1;
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

function handleWeatherCommand(args) {
    if (args.length === 0) {
        return "Usage: weather [city]<br>Example: weather Neo-Tokyo";
    }
    const city = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const conditions = ['Acid Rain', 'Nuclear Fallout', 'Cybernetic Smog', 'Neon Showers', 'Clear Sky (Simulation)'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 50) + 10;

    return `
<div style="border-left: 3px solid var(--link-color); padding-left: 10px;">
    <span style="color: var(--user-color); font-weight: bold;">METEOROLOGICAL REPORT FOR:</span> ${city}<br>
    <span style="color: var(--command-color);">STATUS:</span> ${condition}<br>
    <span style="color: var(--command-color);">TEMP:</span> ${temp}°C / ${Math.round(temp * 9/5 + 32)}°F<br>
    <span style="color: var(--command-color);">RADIATION LEVEL:</span> ${(Math.random() * 5).toFixed(2)} Rad/h
</div>`;
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
        // The host text is immediately after the span, but since it's hardcoded as "@localhost:~$ "
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
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * canvas.width
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
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
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

function handleEnter(e) {
    const command = commandLine.value.trim().toLowerCase();
    const rawCommand = commandLine.value.trim();

    if (command !== '') {
        commandHistory.push(rawCommand);
    }
    historyIndex = -1;

    commandLine.value = '';
    const prompt = document.createElement('div');
    prompt.innerHTML = `<span class="user">${window.terminalUser || 'leddcode'}</span>@${window.terminalHost || 'localhost'}:~$ `;
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
            outputHTML = handleWeatherCommand(args);
        } else if (cmdName === 'guess') {
            outputHTML = handleGuessCommand(args);
        } else if (command.startsWith('python3')) {
            outputHTML = `Command 'python3' not found, did you mean: command 'python' from deb python-is-python3?`;
        } else if (command.startsWith('bash')) {
            outputHTML = `Command 'bash' not found, did you mean: command 'sh'?`;
        } else {
            outputHTML = 'Command not found';
        }
    }

    if (outputHTML !== null) {
        outputElement = document.createElement('div');
        outputElement.innerHTML = outputHTML;
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

    window.scrollTo(0, document.body.scrollHeight);
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
    module.exports = { type, handleArrowUp, handleArrowDown, handleTab, handleEnter, handleMatrixCommand, handleCalcCommand, handleEchoCommand, handleNeofetchCommand, handleThemeCommand, handleBttfCommand, handleTimetravelCommand, handleFluxCommand, handleSysinfoCommand, handleWeatherCommand, handleGuessCommand, handleStarfieldCommand };
}
