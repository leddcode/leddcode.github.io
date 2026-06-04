import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add handleConvertCommand
new_func = """
function handleConvertCommand(args, id) {
    if (args.length < 4 || args[1].toLowerCase() !== 'to') {
        return "Usage: convert [amount] [from_currency] to [to_currency]<br>Example: convert 100 USD to EUR";
    }

    const amount = parseFloat(args[0]);
    if (isNaN(amount)) {
        return "Error: Invalid amount. Please provide a number.";
    }

    const fromCurr = args[2].toUpperCase().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const toCurr = args[3].toUpperCase().replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // We fetch the rates from ExchangeRate-API (free, no key required for public endpoint)
    setTimeout(() => {
        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurr}`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data.rates && data.rates[toCurr]) {
                    const rate = data.rates[toCurr];
                    const converted = (amount * rate).toFixed(2);
                    el.innerHTML = `
<div style="border-left: 3px solid #85bb65; padding-left: 10px;">
    <span style="color: #85bb65; font-weight: bold;">[CURRENCY CONVERTER]</span><br>
    <span style="color: var(--command-color);">RATE:</span> 1 ${fromCurr} = ${rate} ${toCurr}<br>
    <span style="color: var(--user-color); font-weight: bold;">RESULT:</span> ${amount} ${fromCurr} = <span style="font-size: 1.1em; color: #85bb65;">${converted} ${toCurr}</span>
</div>`;
                } else {
                    el.innerHTML = `<div style="color: #ff3333;">[ERROR] Unsupported currency code '${toCurr}'.</div>`;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch exchange rates for '${fromCurr}'. Check currency code or connection.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Fetching exchange rates for ${fromCurr}...]</span></div>`;
}
"""

content = content.replace("function handleTranslateCommand", new_func + "\nfunction handleTranslateCommand")

if "function handleConvertCommand" not in content:
    content = content.replace("function handleTodoCommand", new_func + "\nfunction handleTodoCommand")


# 2. Add 'convert' to customCommands
content = content.replace("'news']", "'news', 'convert']")

# 3. Add to commandRegistry help
content = re.sub(r"('help': \(\) => `[^`]+)(`)", r"\1, convert\2", content)

# 4. Add to handleEnter
enter_injection = """
        } else if (cmdName === 'convert') {
            outputHTML = handleConvertCommand(args, outId);
"""
content = content.replace("} else if (cmdName === 'news') {", enter_injection + "        } else if (cmdName === 'news') {")

with open('script.js', 'w') as f:
    f.write(content)
