import re

with open('script.js', 'r') as f:
    content = f.read()

# Update Jaccard logic in handleRecallCommand
# It seems the token split is using the raw array args, which needs joining and lowering
old_jaccard = """    // If exact string match fails, use Jaccard similarity (word overlap)
    if (filteredMemory.length === 0) {
        const scoredMemory = memory.map(m => {
            const memTokens = new Set((m.key + " " + m.value).toLowerCase().split(/\\s+/));
            const intersection = new Set([...queryTokens].filter(x => memTokens.has(x)));
            const union = new Set([...queryTokens, ...memTokens]);
            const score = intersection.size / union.size;
            return { item: m, score };
        });

        filteredMemory = scoredMemory.filter(m => m.score > 0.1).sort((a, b) => b.score - a.score).map(m => m.item);
    }"""

# A more robust similarity logic (simple token overlap)
new_jaccard = """    // If exact string match fails, use Jaccard similarity (word overlap)
    if (filteredMemory.length === 0) {
        const queryTokensArr = keyword.split(/\\s+/).filter(t => t.length > 2); // Ignore very short words
        if (queryTokensArr.length === 0) return `No memory found matching: ${keyword}`;

        const scoredMemory = memory.map(m => {
            const memStr = (m.key + " " + m.value).toLowerCase();
            let score = 0;
            queryTokensArr.forEach(qt => {
                // simple substring check for fuzziness instead of strict set intersection
                if (memStr.includes(qt)) score += 1;
            });
            score = score / queryTokensArr.length;
            return { item: m, score };
        });

        filteredMemory = scoredMemory.filter(m => m.score >= 0.5).sort((a, b) => b.score - a.score).map(m => m.item);
    }"""

if old_jaccard in content:
    content = content.replace(old_jaccard, new_jaccard)

with open('script.js', 'w') as f:
    f.write(content)
