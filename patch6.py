import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add logFeedback globally
new_func = """
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
"""

content = new_func + "\n" + content

# 2. Add feedback widget to outputHTML inside handleEnter
old_block = """        outputElement = document.createElement('div');
        outputElement.innerHTML = outputHTML + xpMsg + proactiveSuggestion;
        outputElement.classList.add("output");"""

new_block = """
        let feedbackWidget = "";
        const isTestEnvForFeedback = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
        if (!isTestEnvForFeedback && outputHTML !== 'Command not found' && command !== '' && command !== 'clear') {
            feedbackWidget = `<div style="font-size: 0.8em; text-align: right; margin-top: 5px;">Was this helpful? <a href="#" class="link" onclick="window.logFeedback(true);return false;">[Yes]</a> <a href="#" class="link" onclick="window.logFeedback(false);return false;">[No]</a></div>`;
        }

        outputElement = document.createElement('div');
        outputElement.innerHTML = outputHTML + xpMsg + proactiveSuggestion + feedbackWidget;
        outputElement.classList.add("output");"""

if old_block in content:
    content = content.replace(old_block, new_block)

with open('script.js', 'w') as f:
    f.write(content)
