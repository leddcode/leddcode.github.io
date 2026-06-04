import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add handleTranslateCommand
new_func = """
function handleTranslateCommand(args, id) {
    if (args.length < 3) {
        return "Usage: translate [from_lang] [to_lang] [text]<br>Example: translate en es hello world";
    }

    const fromLang = args[0].toLowerCase();
    const toLang = args[1].toLowerCase();
    const text = args.slice(2).join(' ');
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data.responseData && data.responseData.translatedText) {
                    const translated = data.responseData.translatedText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    el.innerHTML = `
<div style="border-left: 3px solid #7aa2f7; padding-left: 10px;">
    <span style="color: #7aa2f7; font-weight: bold;">[TRANSLATOR: ${fromLang.toUpperCase()} -> ${toLang.toUpperCase()}]</span><br>
    <span style="color: var(--command-color);">ORIGINAL:</span> ${safeText}<br>
    <span style="color: var(--user-color); font-weight: bold;">TRANSLATED:</span> <span style="font-size: 1.1em; color: #7aa2f7;">${translated}</span>
</div>`;
                } else {
                    el.innerHTML = `<div style="color: #ff3333;">[ERROR] Translation failed. Check language codes.</div>`;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch translation.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Translating text...]</span></div>`;
}
"""

if "function handleTranslateCommand" not in content:
    content = content.replace("function handleTodoCommand", new_func + "\nfunction handleTodoCommand")

# 2. Add 'translate' to customCommands
content = content.replace("'convert']", "'convert', 'translate']")

# 3. Add to commandRegistry help
content = re.sub(r"('help': \(\) => `[^`]+)(`)", r"\1, translate\2", content)

# 4. Add to handleEnter
enter_injection = """
        } else if (cmdName === 'translate') {
            outputHTML = handleTranslateCommand(args, outId);
"""
content = content.replace("} else if (cmdName === 'convert') {", enter_injection + "        } else if (cmdName === 'convert') {")

# Also add it to module.exports for jest
content = content.replace("handleNewsCommand }", "handleNewsCommand, handleConvertCommand, handleTranslateCommand }")

with open('script.js', 'w') as f:
    f.write(content)
