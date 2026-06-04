import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add handleIssuesCommand
new_func = """
function handleIssuesCommand(args, id) {
    if (args.length !== 1 || !args[0].includes('/')) {
        return "Usage: issues [user/repo]<br>Example: issues leddcode/Oculus";
    }

    const repo = args[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=5`)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok or repo not found");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data.length === 0) {
                    el.innerHTML = `<div style="color: #ffaa00;">[GITHUB] No open issues found for '${repo}'.</div>`;
                } else {
                    let issuesHtml = data.map(issue => {
                        return `<li><a href="${issue.html_url}" target="_blank" class="link">#${issue.number} ${issue.title}</a> [${issue.user.login}]</li>`;
                    }).join('');

                    const resultHtml = `
<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;">
    <span style="color: var(--user-color); font-weight: bold;">[GITHUB ISSUES]</span> ${repo}<br><br>
    <ul style="margin: 0; padding-left: 20px;">
        ${issuesHtml}
    </ul>
</div>`;
                    el.innerHTML = resultHtml;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch issues for '${repo}'. Check spelling or rate limits.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Fetching open issues for ${repo}...]</span></div>`;
}
"""

if "function handleIssuesCommand" not in content:
    content = content.replace("function handleTodoCommand", new_func + "\nfunction handleTodoCommand")

# 2. Add 'issues' to customCommands
content = content.replace("'analyze']", "'analyze', 'issues']")

# 3. Add to commandRegistry help
content = re.sub(r"('help': \(\) => `[^`]+)(`)", r"\1, issues\2", content)

# 4. Add to handleEnter
enter_injection = """
        } else if (cmdName === 'issues') {
            outputHTML = handleIssuesCommand(args, outId);
"""
content = content.replace("} else if (cmdName === 'analyze') {", enter_injection + "        } else if (cmdName === 'analyze') {")

# Also add it to module.exports
content = content.replace("handleAnalyzeCommand }", "handleAnalyzeCommand, handleIssuesCommand }")

with open('script.js', 'w') as f:
    f.write(content)
