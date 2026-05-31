/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Read the HTML and script file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const scriptCode = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

describe('calc command', () => {
  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = html;

    // Mock window.scrollTo to prevent Not Implemented errors
    window.scrollTo = jest.fn();

    // Execute the script
    // We need to use eval so the script runs in the context of the JSDOM window
    // First remove the script tag from the HTML to avoid it trying to load script.js
    const scriptTags = document.getElementsByTagName('script');
    for (let i = scriptTags.length - 1; i >= 0; i--) {
      scriptTags[i].parentNode.removeChild(scriptTags[i]);
    }

    // Reset global state if necessary, but typically eval handles it
    try {
        eval(scriptCode);
    } catch(e) {}
  });

  test('handles invalid expression syntax triggering catch block', () => {
    const commandLine = document.getElementById('command-line');
    const results = document.getElementById('results');

    // Clear initial output from page load
    results.innerHTML = '';

    // Create an event that simulates pressing Enter
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter'
    });

    // Test invalid syntax '5 + /' to trigger catch block
    commandLine.value = 'calc 5 + /';
    commandLine.dispatchEvent(enterEvent);

    // The output should be appended to the results div
    // We get the last output block
    const outputElements = document.getElementsByClassName('output');
    const lastOutput = outputElements[outputElements.length - 1];

    expect(lastOutput.innerHTML).toBe('Error evaluating expression.');
  });

  test('handles valid expression correctly', () => {
    const commandLine = document.getElementById('command-line');
    const results = document.getElementById('results');

    // Clear initial output from page load
    results.innerHTML = '';

    // Create an event that simulates pressing Enter
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter'
    });

    // Test valid syntax
    commandLine.value = 'calc 5 + 5';
    commandLine.dispatchEvent(enterEvent);

    // The output should be appended to the results div
    // We get the last output block
    const outputElements = document.getElementsByClassName('output');
    const lastOutput = outputElements[outputElements.length - 1];

    expect(lastOutput.innerHTML).toBe('10');
  });

  test('handles invalid characters', () => {
    const commandLine = document.getElementById('command-line');
    const results = document.getElementById('results');

    // Clear initial output from page load
    results.innerHTML = '';

    // Create an event that simulates pressing Enter
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter'
    });

    // Test invalid syntax with non-math characters
    commandLine.value = 'calc 5 + a';
    commandLine.dispatchEvent(enterEvent);

    // The output should be appended to the results div
    // We get the last output block
    const outputElements = document.getElementsByClassName('output');
    const lastOutput = outputElements[outputElements.length - 1];

    expect(lastOutput.innerHTML).toBe('Invalid expression. Only numbers and basic operators (+ - * /) are allowed.');
  });

  test('shows usage when no expression provided', () => {
    const commandLine = document.getElementById('command-line');
    const results = document.getElementById('results');

    // Clear initial output from page load
    results.innerHTML = '';

    // Create an event that simulates pressing Enter
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter'
    });

    // Test empty
    commandLine.value = 'calc';
    commandLine.dispatchEvent(enterEvent);

    // The output should be appended to the results div
    // We get the last output block
    const outputElements = document.getElementsByClassName('output');
    const lastOutput = outputElements[outputElements.length - 1];

    expect(lastOutput.innerHTML).toBe('Usage: calc [expression]&lt;br&gt;Example: calc 5 + 2 * 3'.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  });
});
