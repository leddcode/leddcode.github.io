/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');

describe('Terminal Script', () => {
    let commandLine;
    let results;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        // Clear variables
        window.commandHistory = [];
        window.historyIndex = -1;

        // Mock scroll
        window.scrollTo = jest.fn();

        eval(scriptContent);

        commandLine = document.getElementById('command-line');
        results = document.getElementById('results');
    });

    const runCommand = (cmd) => {
        commandLine.value = cmd;
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        commandLine.dispatchEvent(enterEvent);
    };

    describe('Basic Commands', () => {
        test('help command outputs list of commands', () => {
            runCommand('help');
            expect(results.innerHTML).toContain('ls, pwd, whoami, clear, date, sudo, theme, matrix, neofetch, echo, calc');
        });

        test('whoami command outputs leddcode with link', () => {
            runCommand('whoami');
            expect(results.innerHTML).toContain('leddcode');
            expect(results.innerHTML).toContain('href="https://www.linkedin.com/in/hanochrizz/"');
        });

        test('pwd command outputs current directory', () => {
            runCommand('pwd');
            expect(results.innerHTML).toContain('/home/leddcode');
        });

        test('date command outputs current date', () => {
            const mockDate = new Date('2023-01-01T00:00:00Z');
            const originalDate = global.Date;
            global.Date = class extends Date {
                constructor() {
                    super();
                    return mockDate;
                }
            };

            runCommand('date');
            expect(results.innerHTML).toContain(mockDate.toString());

            global.Date = originalDate;
        });

        test('sudo command outputs permission denied', () => {
            runCommand('sudo');
            expect(results.innerHTML).toContain('Permission denied');
        });

        test('ls command outputs list of files', () => {
            runCommand('ls');
            expect(results.innerHTML).toContain('about.sh');
            expect(results.innerHTML).toContain('aranea.py');
            expect(results.innerHTML).toContain('xsstrike.py');
            expect(results.innerHTML).toContain('commands.txt');
        });
    });

    describe('File Reading Commands', () => {
        test('cat about.sh command outputs about info', () => {
            runCommand('cat about.sh');
            expect(results.innerHTML).toContain("I'm a cybersecurity specialist");
        });

        test('cat commands.txt command outputs commands list', () => {
            runCommand('cat commands.txt');
            expect(results.innerHTML).toContain('whoami');
            expect(results.innerHTML).toContain('path/to/html_file');
        });

        test('cat empty outputs instruction', () => {
            runCommand('cat');
            expect(results.innerHTML).toContain('Choose a file to be read.');
        });

        test('cat non-existent file outputs not found', () => {
            runCommand('cat random.txt');
            expect(results.innerHTML).toContain('Command not found');
        });

        test('sh about.sh and ./about.sh output about info', () => {
            runCommand('sh about.sh');
            expect(results.innerHTML).toContain("I'm a cybersecurity specialist");

            runCommand('./about.sh');
            expect(results.innerHTML).toContain("I'm a cybersecurity specialist");
        });
    });
});

describe('Special Commands', () => {
    let commandLine;
    let results;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        window.commandHistory = [];
        window.historyIndex = -1;
        window.scrollTo = jest.fn();

        const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');
        eval(scriptContent);

        commandLine = document.getElementById('command-line');
        results = document.getElementById('results');
    });

    const runCommand = (cmd) => {
        commandLine.value = cmd;
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        commandLine.dispatchEvent(enterEvent);
    };

    test('clear command clears results', () => {
        runCommand('echo hello');
        expect(results.innerHTML).toContain('hello');
        runCommand('clear');
        expect(results.innerHTML).toBe('');
    });

    test('echo command outputs text and sanitizes HTML', () => {
        runCommand('echo Hello World!');
        expect(results.innerHTML).toContain('Hello World!');

        runCommand('echo <script>alert("XSS")</script>');
        expect(results.innerHTML).toContain('&lt;script&gt;alert("XSS")&lt;/script&gt;');
    });

    test('calc command calculates basic math', () => {
        runCommand('calc 5 + 5');
        expect(results.innerHTML).toContain('10');

        runCommand('calc 2 * 3');
        expect(results.innerHTML).toContain('6');

        runCommand('calc invalid_input');
        expect(results.innerHTML).toContain('Invalid expression');

        runCommand('calc');
        expect(results.innerHTML).toContain('Usage: calc [expression]');
    });

    test('theme command changes theme', () => {
        runCommand('theme dracula');
        expect(document.body.className).toBe('theme-dracula');
        expect(results.innerHTML).toContain('Theme changed to dracula');

        runCommand('theme default');
        expect(document.body.className).toBe('');
        expect(results.innerHTML).toContain('Theme changed to default');

        runCommand('theme invalid');
        expect(results.innerHTML).toContain('Theme not found: invalid');
    });
});

describe('Command History and Autocomplete', () => {
    let commandLine;
    let results;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        window.commandHistory = [];
        window.historyIndex = -1;
        window.scrollTo = jest.fn();

        const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');
        eval(scriptContent);

        commandLine = document.getElementById('command-line');
        results = document.getElementById('results');
    });

    const runCommand = (cmd) => {
        commandLine.value = cmd;
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        commandLine.dispatchEvent(enterEvent);
    };

    const pressKey = (key) => {
        const event = new KeyboardEvent('keydown', { key: key });
        commandLine.dispatchEvent(event);
    };

    test('arrow up/down navigates command history', () => {
        runCommand('echo 1');
        runCommand('echo 2');
        runCommand('echo 3');

        pressKey('ArrowUp');
        expect(commandLine.value).toBe('echo 3');

        pressKey('ArrowUp');
        expect(commandLine.value).toBe('echo 2');

        pressKey('ArrowDown');
        expect(commandLine.value).toBe('echo 3');

        pressKey('ArrowDown');
        expect(commandLine.value).toBe('');
    });

    test('tab autocompletes basic commands', () => {
        commandLine.value = 'wh';
        pressKey('Tab');
        expect(commandLine.value).toBe('whoami ');
    });

    test('tab autocompletes with common prefix', () => {
        // e.g., 'c' -> matches 'cat', 'clear', 'calc'
        commandLine.value = 'c';
        pressKey('Tab');
        expect(commandLine.value).toBe('c');

        commandLine.value = 'ca';
        pressKey('Tab');
        // 'cat' and 'calc' -> common prefix is 'ca'
        expect(commandLine.value).toBe('ca');
    });

    test('tab autocompletes file names', () => {
        commandLine.value = 'cat ab';
        pressKey('Tab');
        expect(commandLine.value).toBe('cat about.sh');
    });
});
