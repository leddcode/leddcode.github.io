import re

with open("script.js", "r") as f:
    content = f.read()

# 1. Add handleBrainstormCommand before handleDocparseCommand
func = """
function handleBrainstormCommand(args, id) {
    if (args.length === 0) {
        return "Usage: brainstorm [topic]<br>Example: brainstorm app features";
    }
    const topic = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            const ideas = [
                `Implement a real-time multiplayer mode for ${topic}.`,
                `Add an AI-powered suggestions engine for ${topic}.`,
                `Introduce gamification with XP and rewards for ${topic}.`,
                `Integrate an advanced voice-to-text input system.`,
                `Create a customizable dashboard widget for it.`
            ];

            // Randomly pick 3 ideas using the secure getRandom
            let pickedIdeas = [];
            while(pickedIdeas.length < 3) {
                let idea = ideas[Math.floor(getRandom() * ideas.length)];
                if(!pickedIdeas.includes(idea)) pickedIdeas.push(idea);
            }

            let ideasHtml = pickedIdeas.map(idea => `<li><span style="color: var(--command-color);">${idea}</span></li>`).join('');

            el.innerHTML = `
<div style="border-left: 3px solid #ffcc00; padding-left: 10px; margin: 10px 0;">
    <span style="color: #ffcc00; font-weight: bold;">[AI BRAINSTORMING]</span> Ideas for "${topic}"<br>
    <ul style="margin: 0; padding-left: 20px;">
        ${ideasHtml}
    </ul>
</div>`;
            const termDiv = document.getElementById('terminal');
            if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
        }
    }, 800);

    return `<div id="${id}"><span style="color: #888;">[Brainstorming ideas for '${topic}'...]</span></div>`;
}
"""

content = content.replace("function handleDocparseCommand", func + "\nfunction handleDocparseCommand")

# 2. Add 'brainstorm' to customCommands array
content = re.sub(r"const customCommands = \['([^']+)',", r"const customCommands = ['\1', 'brainstorm',", content)

# 3. Hook in handleEnter
content = content.replace("} else if (cmdName === 'music') {", "} else if (cmdName === 'brainstorm') {\n            outputHTML = handleBrainstormCommand(args, outId);\n        } else if (cmdName === 'music') {")

# 4. Export in module.exports
content = content.replace("handleBuyCommand,", "handleBrainstormCommand, handleBuyCommand,")

# 5. Update updateIntelligence
content = content.replace("let factHtml = handleFactCommand('fact-preview');", "let brainstormHtml = handleBrainstormCommand(['app features'], 'brainstorm-preview');\n    let factHtml = handleFactCommand('fact-preview');")
content = content.replace("</div>\n        <div class=\"ai-hub-card\">\n            <h3 class=\"ai-hub-title\">Automation Workflows</h3>", "</div>\n        <div class=\"ai-hub-card\">\n            <h3 class=\"ai-hub-title\">AI Brainstorming</h3>\n            ${brainstormHtml}\n        </div>\n        <div class=\"ai-hub-card\">\n            <h3 class=\"ai-hub-title\">Automation Workflows</h3>")


with open("script.js", "w") as f:
    f.write(content)
