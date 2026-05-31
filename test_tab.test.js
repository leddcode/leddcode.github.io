const fs = require('fs');
const path = require('path');

describe('Tab Autocompletion', () => {
  let commandLine;
  let fileList;

  beforeEach(() => {
    jest.resetModules();
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // We need to properly mock or handle global window variables in script.js
    // Let's require it and test Tab key
    require('./script.js');
    commandLine = document.getElementById('command-line');
  });

  it('should autocomplete common prefix for multiple matches (parts.length === 1)', () => {
    // Commands in script.js cmdList that start with 'c':
    // cat, clear, calc. Common prefix is 'c'.
    // If we type 'c' and hit Tab, it should leave 'c' as the common prefix.
    commandLine.value = 'c';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    // The common prefix of cat, clear, calc is 'c'
    expect(commandLine.value).toBe('c');
  });

  it('should autocomplete to common prefix "ca" for "cat" and "calc" when typed "ca"', () => {
    commandLine.value = 'ca';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    // The common prefix of cat and calc is 'ca'
    expect(commandLine.value).toBe('ca');
  });

  it('should autocomplete single match correctly (parts.length === 1)', () => {
    commandLine.value = 'wh';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    expect(commandLine.value).toBe('whoami ');
  });

  it('should do nothing if no match found (parts.length === 1)', () => {
    commandLine.value = 'zzz';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    expect(commandLine.value).toBe('zzz');
  });

  it('should autocomplete single file match (parts.length === 2)', () => {
    // Files in script.js: commands.txt, about.sh, trophy.html, xsstrike.py, glazgo.exe, oculus.py, diablob.py, aranea.py
    // Type 'cat o' -> 'cat oculus.py'
    commandLine.value = 'cat o';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    expect(commandLine.value).toBe('cat oculus.py');
  });

  it('should autocomplete common prefix for multiple file matches (parts.length === 2)', () => {
    // Files in script.js: commands.txt, about.sh, trophy.html, xsstrike.py, glazgo.exe, oculus.py, diablob.py, aranea.py
    // Let's type 'cat a' -> matches about.sh and aranea.py, common prefix 'a'
    commandLine.value = 'cat a';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    // about.sh and aranea.py -> common prefix 'a'
    expect(commandLine.value).toBe('cat a');
  });

  it('should do nothing if no file match found (parts.length === 2)', () => {
    commandLine.value = 'cat zzz';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    expect(commandLine.value).toBe('cat zzz');
  });

  it('should not autocomplete if parts length > 2', () => {
    commandLine.value = 'cat about.sh extra';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    commandLine.dispatchEvent(event);

    expect(commandLine.value).toBe('cat about.sh extra');
  });
});
