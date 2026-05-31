/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const scriptCode = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

describe('New Back to the Future Commands', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    window.scrollTo = jest.fn();

    // Mock requestAnimationFrame for starfield
    window.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
    window.cancelAnimationFrame = jest.fn(clearTimeout);
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ fillStyle: '', fillRect: jest.fn(), beginPath: jest.fn(), arc: jest.fn(), fill: jest.fn() }));

    const scriptTags = document.getElementsByTagName('script');
    for (let i = scriptTags.length - 1; i >= 0; i--) {
      scriptTags[i].parentNode.removeChild(scriptTags[i]);
    }

    try {
        eval(scriptCode);
    } catch(e) {}
  });

  function simulateCommand(cmdString) {
    const commandLine = document.getElementById('command-line');
    commandLine.value = cmdString;
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    commandLine.dispatchEvent(enterEvent);

    const outputElements = document.getElementsByClassName('output');
    return outputElements.length > 0 ? outputElements[outputElements.length - 1] : null;
  }

  test('bttf command changes theme and prompt variables', () => {
    const lastOutput = simulateCommand('bttf');
    expect(document.body.className).toBe('theme-bttf');
    expect(window.terminalUser).toBe('marty');
    expect(window.terminalHost).toBe('delorean');
    expect(lastOutput.innerHTML).toContain('1.21 GIGAWATTS!!');
  });

  test('timetravel command enables starfield and changes date', () => {
    // Requires a year argument
    const emptyOutput = simulateCommand('timetravel');
    expect(emptyOutput.innerHTML).toContain('Usage: timetravel [year]');

    const invalidOutput = simulateCommand('timetravel abc');
    expect(invalidOutput.innerHTML).toContain('Invalid year.');

    const successOutput = simulateCommand('timetravel 1985');
    expect(successOutput.innerHTML).toContain('SUCCESS! Arrived in 1985');

    // Check if starfield was triggered (canvas should be display block)
    const starfieldCanvas = document.getElementById('starfield-canvas');
    expect(starfieldCanvas.style.display).toBe('block');

    // Check if date command is overridden
    const dateOutput = simulateCommand('date');
    expect(dateOutput.innerHTML).toContain('1985');
    expect(dateOutput.innerHTML).toContain('(Simulated)');
  });

  test('flux command returns ascii', () => {
    const lastOutput = simulateCommand('flux');
    expect(lastOutput.innerHTML).toContain('Flux Capacitor is fluxing');
  });

  test('sysinfo command returns stylized specs', () => {
    const lastOutput = simulateCommand('sysinfo');
    expect(lastOutput.innerHTML).toContain('Quantum Processor v9.4');
  });

  test('weather command handles args', () => {
    const emptyOutput = simulateCommand('weather');
    expect(emptyOutput.innerHTML).toContain('Usage: weather [city]');

    const cityOutput = simulateCommand('weather Hill Valley');
    expect(cityOutput.innerHTML).toContain('METEOROLOGICAL REPORT FOR:</span> Hill Valley');
  });

  test('guess command handles state properly', () => {
    // Start game
    const startOutput = simulateCommand('guess');
    expect(startOutput.innerHTML).toContain("I'm thinking of a number between 1 and 100");
    expect(window.gameState.active).toBe(true);

    // Provide invalid guess
    const invalidOutput = simulateCommand('abc');
    expect(invalidOutput.innerHTML).toContain('Please enter a valid number');

    // Win the game (cheat by setting target)
    window.gameState.target = 42;

    // Too low
    const lowOutput = simulateCommand('10');
    expect(lowOutput.innerHTML).toContain('Too low!');

    // Too high
    const highOutput = simulateCommand('90');
    expect(highOutput.innerHTML).toContain('Too high!');

    // Correct
    const winOutput = simulateCommand('42');
    expect(winOutput.innerHTML).toContain('Congratulations! You guessed the number in 3 attempts!');
    expect(window.gameState.active).toBe(false);
  });
});
