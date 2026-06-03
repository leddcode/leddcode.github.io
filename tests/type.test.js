/**
 * @jest-environment jsdom
 */

describe('type function', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="terminal"></div>
      <div id="results"></div>
      <input id="command-line" style="display: none;" />
      <div id="prompt" style="display: none;"></div>
      <canvas id="matrix-canvas"></canvas>
    `;
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should type and erase text correctly', () => {
    const { type } = require('../script.js');

    const element = document.createElement('div');

    // Clear mocks so we can test the specific call
    global.setInterval.mockClear();
    global.clearInterval.mockClear();

    // Now test our specific call
    type('hi', element);

    expect(global.setInterval).toHaveBeenCalledTimes(1);

    // Test typing phase
    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('h');

    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('hi');

    // Step forward when it hits erase=true condition
    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('hi');

    // Test erasing phase
    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('h');

    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('');

    expect(global.clearInterval).toHaveBeenCalledTimes(1);
    expect(document.getElementById('prompt').style.display).toBe('block');
    expect(document.getElementById('command-line').style.display).toBe('block');
  });

  it('should handle empty text gracefully', () => {
    const { type } = require('../script.js');

    const element = document.createElement('div');
    global.setInterval.mockClear();
    global.clearInterval.mockClear();

    type('', element);

    // Erase phase starts immediately
    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('');

    jest.advanceTimersByTime(30);
    expect(element.innerHTML).toBe('');

    expect(global.clearInterval).toHaveBeenCalledTimes(1);
  });
});
