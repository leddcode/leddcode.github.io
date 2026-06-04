import re

with open('script.js', 'r') as f:
    content = f.read()

# Replace handleRecallCommand
old_func = """function handleRecallCommand(args) {
    let memory = [];
    try {
        const stored = localStorage.getItem('termMemoryList');
        if (stored) memory = JSON.parse(stored);
    } catch (e) {}

    if (args.length === 0) {
        if (memory.length === 0) return "Memory is empty.";
        let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// CONTEXTUAL MEMORY</h3><table style="width: 100%; border-collapse: collapse;">`;
        for (const item of memory) {
            html += `<tr><td style="color: var(--command-color); padding-right: 20px;">${item.key}</td><td>${item.value} <span style="font-size:0.8em;color:#888;">[${new Date(item.time).toLocaleTimeString()}]</span></td></tr>`;
        }
        html += `</table></div>`;
        return html;
    }

    const keyword = args.join(' ').toLowerCase();
    const filteredMemory = memory.filter(m => m.key.toLowerCase().includes(keyword) || m.value.toLowerCase().includes(keyword));

    if (filteredMemory.length > 0) {
        let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// SEARCH RESULTS FOR '${keyword}'</h3><table style="width: 100%; border-collapse: collapse;">`;
        for (const item of filteredMemory) {
            html += `<tr><td style="color: var(--command-color); padding-right: 20px;">${item.key}</td><td>${item.value} <span style="font-size:0.8em;color:#888;">[${new Date(item.time).toLocaleTimeString()}]</span></td></tr>`;
        }
        html += `</table></div>`;
        return html;
    } else {
        return `No memory found matching: ${keyword}`;
    }
}"""

new_func = """function handleRecallCommand(args) {
    let memory = [];
    try {
        const stored = localStorage.getItem('termMemoryList');
        if (stored) memory = JSON.parse(stored);
    } catch (e) {}

    if (args.length === 0) {
        if (memory.length === 0) return "Memory is empty.";
        let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// CONTEXTUAL MEMORY</h3><table style="width: 100%; border-collapse: collapse;">`;
        for (const item of memory) {
            html += `<tr><td style="color: var(--command-color); padding-right: 20px;">${item.key}</td><td>${item.value} <span style="font-size:0.8em;color:#888;">[${new Date(item.time).toLocaleTimeString()}]</span></td></tr>`;
        }
        html += `</table></div>`;
        return html;
    }

    const keyword = args.join(' ').toLowerCase();
    const queryTokens = new Set(keyword.split(/\\s+/));

    // First try exact string match
    let filteredMemory = memory.filter(m => m.key.toLowerCase().includes(keyword) || m.value.toLowerCase().includes(keyword));

    // If exact string match fails, use Jaccard similarity (word overlap)
    if (filteredMemory.length === 0) {
        const scoredMemory = memory.map(m => {
            const memTokens = new Set((m.key + " " + m.value).toLowerCase().split(/\\s+/));
            const intersection = new Set([...queryTokens].filter(x => memTokens.has(x)));
            const union = new Set([...queryTokens, ...memTokens]);
            const score = intersection.size / union.size;
            return { item: m, score };
        });

        filteredMemory = scoredMemory.filter(m => m.score > 0.1).sort((a, b) => b.score - a.score).map(m => m.item);
    }

    if (filteredMemory.length > 0) {
        let html = `<div style="border: 1px solid var(--command-color); padding: 10px; margin: 10px 0;"><h3 style="margin-top: 0; color: var(--user-color);">/// SEARCH RESULTS FOR '${keyword}'</h3><table style="width: 100%; border-collapse: collapse;">`;
        for (const item of filteredMemory) {
            html += `<tr><td style="color: var(--command-color); padding-right: 20px;">${item.key}</td><td>${item.value} <span style="font-size:0.8em;color:#888;">[${new Date(item.time).toLocaleTimeString()}]</span></td></tr>`;
        }
        html += `</table></div>`;
        return html;
    } else {
        return `No memory found matching: ${keyword}`;
    }
}"""

if old_func in content:
    content = content.replace(old_func, new_func)

with open('script.js', 'w') as f:
    f.write(content)
