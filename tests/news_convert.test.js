/**
 * @jest-environment jsdom
 */

const { handleNewsCommand, handleConvertCommand } = require('../script.js');

describe('News Command', () => {
    test('returns loading HTML and fetches news', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ hits: [{ title: 'Test', url: 'https://test.com' }] })
            })
        );
        const result = handleNewsCommand(['AI'], 'out-1');
        expect(result).toContain('out-1');
        expect(result).toContain('Fetching news...');
    });
});

describe('Convert Command', () => {
    test('returns loading HTML and fetches rates', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ rates: { EUR: 0.85 } })
            })
        );
        const result = handleConvertCommand(['100', 'USD', 'to', 'EUR'], 'out-2');
        expect(result).toContain('out-2');
        expect(result).toContain('Fetching conversion rates...');
    });

    test('returns error for invalid usage', () => {
        const result = handleConvertCommand(['100'], 'out-3');
        expect(result).toContain('Usage: convert');
    });

    test('returns error for invalid amount', () => {
        const result = handleConvertCommand(['abc', 'USD', 'to', 'EUR'], 'out-4');
        expect(result).toContain('Error: Invalid amount');
    });
});
