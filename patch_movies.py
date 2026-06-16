import re

with open("script.js", "r") as f:
    content = f.read()

# 1. Add handleMoviesCommand before handlePodcastCommand
func = """
function handleMoviesCommand(args, id) {
    if (args.length === 0) {
        return "Usage: movies [query]<br>Example: movies matrix";
    }
    const query = args.join(' ').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setTimeout(() => {
        fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=movie&limit=3`)
            .then(response => {
                if (!response.ok) throw new Error("Not found");
                return response.json();
            })
            .then(data => {
                const el = document.getElementById(id);
                if (!el) return;

                if (data && data.results && data.results.length > 0) {
                    let moviesHtml = data.results.map(movie => {
                        let shortDesc = movie.shortDescription || movie.longDescription || "No description available.";
                        if (shortDesc.length > 100) shortDesc = shortDesc.substring(0, 100) + '...';
                        return `<li><a href="${movie.trackViewUrl}" target="_blank" class="link">${movie.trackName}</a> (${movie.releaseDate ? movie.releaseDate.substring(0,4) : 'N/A'})<br><span style="font-size: 0.9em; color: #888;">${shortDesc}</span></li>`;
                    }).join('');

                    el.innerHTML = `
<div style="border-left: 3px solid #e50914; padding-left: 10px; margin: 10px 0;">
    <span style="color: #e50914; font-weight: bold;">[MOVIE SEARCH]</span> ${query}<br>
    <ul style="margin: 0; padding-left: 20px;">
        ${moviesHtml}
    </ul>
</div>`;
                } else {
                    el.innerHTML = `<div style="color: #ffaa00;">[MOVIE SEARCH] No movies found for '${query}'.</div>`;
                }
                const termDiv = document.getElementById('terminal');
                if (termDiv) termDiv.scrollTop = termDiv.scrollHeight;
            })
            .catch(err => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = `<div style="color: #ff3333;">[API UPLINK FAILED] Unable to fetch movie data for '${query}'.</div>`;
            });
    }, 100);

    return `<div id="${id}"><span style="color: #888;">[Searching movies for '${query}'...]</span></div>`;
}
"""

content = content.replace("function handlePodcastCommand", func + "\nfunction handlePodcastCommand")

# 2. Add 'movies' to customCommands array
content = re.sub(r"const customCommands = \['([^']+)',", r"const customCommands = ['\1', 'movies',", content)

# 3. Hook in handleEnter
content = content.replace("} else if (cmdName === 'music') {", "} else if (cmdName === 'movies') {\n            outputHTML = handleMoviesCommand(args, outId);\n        } else if (cmdName === 'music') {")

# 4. Export in module.exports
content = content.replace("handleMatrixCommand,", "handleMatrixCommand, handleMoviesCommand,")

# 5. Update updateEcosystem
content = content.replace("let podcastHtml = handlePodcastCommand(['Lex Fridman']);", "let podcastHtml = handlePodcastCommand(['Lex Fridman']);\n    let moviesHtml = handleMoviesCommand(['matrix'], 'movies-preview');")
content = content.replace("<strong>TVMaze Database:</strong><br>\n                ${tvHtml}\n            </div>", "<strong>TVMaze Database:</strong><br>\n                ${tvHtml}\n            </div>\n            <div style=\"margin-bottom: 10px;\">\n                <strong>Movie Search API:</strong><br>\n                ${moviesHtml}\n            </div>")

with open("script.js", "w") as f:
    f.write(content)
