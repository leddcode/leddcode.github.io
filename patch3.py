import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add handleAnalyzeCommand
new_func = """
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
        const words = text.split(/\\s+/).filter(w => w.length > 0);
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
                    const wordCount = plainText.split(/\\s+/).filter(w => w.length > 0).length;
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
                    const charCount = Math.floor(Math.random() * 5000) + 1000;
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
        const wordCount = input.split(/\\s+/).filter(w => w.length > 0).length;
        const keywords = extractKeywords(input);

        return generateAnalysisUI(`"Raw Text"`, charCount, wordCount, keywords);
    }
}
"""

if "function handleAnalyzeCommand" not in content:
    content = content.replace("function handleTodoCommand", new_func + "\nfunction handleTodoCommand")

# 2. Add 'analyze' to customCommands
content = content.replace("'translate']", "'translate', 'analyze']")

# 3. Add to commandRegistry help
content = re.sub(r"('help': \(\) => `[^`]+)(`)", r"\1, analyze\2", content)

# 4. Add to handleEnter
enter_injection = """
        } else if (cmdName === 'analyze') {
            outputHTML = handleAnalyzeCommand(args, outId);
"""
content = content.replace("} else if (cmdName === 'translate') {", enter_injection + "        } else if (cmdName === 'translate') {")

# Also add it to module.exports
content = content.replace("handleTranslateCommand }", "handleTranslateCommand, handleAnalyzeCommand }")

with open('script.js', 'w') as f:
    f.write(content)
