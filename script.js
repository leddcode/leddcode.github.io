const results = document.getElementById('results');
const commandLine = document.getElementById('command-line');

const commandHistory = [];
let historyIndex = -1;

const fileList = ['about.sh', 'aranea.py', 'commands.txt', 'diablob.py', 'glazgo.exe', 'oculus.py', 'trophy.html', 'xsstrike.py'];
const cmdList = ['ls', 'whoami', 'cat', 'open', 'python', 'sh', 'clear', 'pwd', 'date', 'help', 'sudo'];

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
  'help': () => `ls, pwd, whoami, clear, date, sudo, theme, matrix, neofetch, echo, calc`,
};

// Add new command aliases
cmdList.push('theme', 'matrix', 'neofetch', 'echo', 'calc');

commandLine.addEventListener('keydown', function(e) {
	if (e.key === 'ArrowUp') {
		e.preventDefault();
		if (commandHistory.length > 0) {
			if (historyIndex === -1) {
				historyIndex = commandHistory.length - 1;
			} else if (historyIndex > 0) {
				historyIndex--;
			}
			commandLine.value = commandHistory[historyIndex];
		}
	} else if (e.key === 'ArrowDown') {
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
	} else if (e.key === 'Tab') {
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
	} else if (e.key === 'Enter') {
	  const command = commandLine.value.trim().toLowerCase();
      const rawCommand = commandLine.value.trim();

	  if (command !== '') {
		commandHistory.push(rawCommand);
	  }
	  historyIndex = -1;

	  commandLine.value = '';
	  const prompt = document.createElement('div');
	  prompt.innerHTML = '<span class="user">leddcode</span>@localhost:~$ ';
		  prompt.appendChild(document.createTextNode(command));

      let outputElement = null;
      let outputHTML = '';

      const args = rawCommand.split(' ').slice(1);
      const cmdName = command.split(' ')[0];


      if (commandRegistry[command]) {
          outputHTML = commandRegistry[command]();
      } else if (cmdName === 'matrix') {
          const canvas = document.getElementById('matrix-canvas');
          if (canvas.style.display === 'block') {
              canvas.style.display = 'none';
              clearInterval(window.matrixInterval);
              window.matrixInterval = null;
              outputHTML = "Matrix effect disabled.";
          } else {
              canvas.style.display = 'block';

              const ctx = canvas.getContext('2d');
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;

              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\|{}<>[]^~';
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
              outputHTML = "Matrix effect enabled. Run 'matrix' again to disable.";
          }
      } else if (cmdName === 'calc') {
          const expression = args.join('');
          if (expression) {
              try {
                  // Only allow basic math characters to prevent injection
                  if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                      outputHTML = String(evaluateMath(expression));
                  } else {
                      outputHTML = "Invalid expression. Only numbers and basic operators (+ - * /) are allowed.";
                  }
              } catch (e) {
                  outputHTML = "Error evaluating expression.";
              }
          } else {
              outputHTML = "Usage: calc [expression]<br>Example: calc 5 + 2 * 3";
          }
      } else if (cmdName === 'echo') {
          outputHTML = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
      } else if (cmdName === 'neofetch') {
          outputHTML = `
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
      } else if (cmdName === 'theme') {
          if (args.length === 0) {
              outputHTML = "Usage: theme [name]<br>Available themes: dracula, light, matrix, ocean, default";
          } else {
              const themeName = args[0].toLowerCase();
              const validThemes = ['dracula', 'light', 'matrix', 'ocean'];
              if (validThemes.includes(themeName)) {
                  document.body.className = 'theme-' + themeName;
                  outputHTML = `Theme changed to ${themeName}`;
              } else if (themeName === 'default') {
                  document.body.className = '';
                  outputHTML = `Theme changed to default`;
              } else {
                  outputHTML = `Theme not found: ${themeName.replace(/</g, "&lt;").replace(/>/g, "&gt;")}`;
              }
          }

      } else if (command.startsWith('python3')) {
          outputHTML = `Command 'python3' not found, did you mean: command 'python' from deb python-is-python3?`;
      } else if (command.startsWith('bash')) {
          outputHTML = `Command 'bash' not found, did you mean: command 'sh'?`;
      } else {
          outputHTML = 'Command not found';
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
});
