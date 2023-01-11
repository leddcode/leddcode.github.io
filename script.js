const terminal = document.getElementById('terminal');
const results = document.getElementById('results');
const commandLine = document.getElementById('command-line');

const greeting = `Hello, Universe! Welcome to the @leddcode machine. 
Here you can find information about me and some of my projects...                   `;

const about = `I'm a cybersecurity specialist with a passion for coding and a love for chocolate. 
With experience in both penetration testing and the development of web and mobile apps, 
I am dedicated to helping organizations secure their systems and protect their data.`

const aranea = `Aranea may be used as an additional OSINT tool for web application investigations, 
by crawling the links of the webapp or by examining the JavaScript files for likely useful data.
 <a href="https://github.com/leddcode/Aranea" class="link" target="_blank">https://github.com/leddcode/Aranea</a>`
 
 const oculus = `Oculus is a Domain OSINT Tool used to discover environments, directories, and subdomains of a particular domain. 
 Additionally, it is useful for searching S3 Buckets, Azure Blob Containers, Firebase DBs, 
 leaked email addresses and MX records of a domain. <a href="https://github.com/leddcode/Oculus" class="link" target="_blank">https://github.com/leddcode/Oculus</a>`
 
 const glazgo = `GlazGo is a powerful fuzzing tool for pentesters and security researchers to investigate web applications and APIs.
  This tool is a compiled executable file that can be used when other tools are unavailable,
 such as when testing a web application in a black-box environment on a corporate machine. 
 It helps to invetigate web apps and APIs by automating the process of providing expected and unexpected inputs in order to uncover application resources or to cause any unexpected behavior or crashes.
  <a href="https://github.com/leddcode/GlazGo" class="link" target="_blank">https://github.com/leddcode/GlazGo</a>`

const xsstrike = `This tool is an upgraded version of a well-known Cross-Site Scripting detection suite: 
<a href="https://github.com/leddcode/XSStrike" class="link" target="_blank">https://github.com/leddcode/XSStrike</a>.
The features that I have developed have been incorporated into the XSStrike-Reborn project: 
<a href="https://github.com/ItsIgnacioPortal/XSStrike-Reborn/releases" class="link" target="_blank">https://github.com/ItsIgnacioPortal/XSStrike-Reborn/releases</a>.`

const trophy = `Monitor HTTP requests: <a href="https://trophy.onrender.com/" class="link" target="_blank">https://trophy.onrender.com/</a>`

function type(text, element) {
  const characters = text.split('');

  let interval;
  let currentText = '';
  let index = 0;
  let erase = false;

  interval = setInterval(() => {
    if (erase) {
      currentText = currentText.slice(0, -1);
      element.innerHTML = currentText;

      if (currentText.length === 0) {
        clearInterval(interval);
        document.getElementById('prompt').style.display = 'block';
        commandLine.style.display = 'block';
      }
    } else {
      const nextCharacter = characters[index];
      if (!nextCharacter) {
        erase = true;
        return;
      }
      currentText += nextCharacter;
      element.innerHTML = currentText;
      index++;
    }
  }, 30);
}

type(greeting, results);

commandLine.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
	  const command = commandLine.value.trim().toLowerCase();
	  commandLine.value = '';
	  const prompt = document.createElement('div');
	  prompt.innerHTML = '<span class="user">leddcode</span>@localhost:~$ ' + command;

    let output;
	  if (command === 'ls') {
      output = document.createElement('div');
	  	output.innerHTML = `
      about.sh
      <a href="https://github.com/leddcode/Aranea" class="link" target="_blank">aranea.py</a>
      commands.txt
      <a href="https://github.com/leddcode/Oculus" class="link" target="_blank">oculus.py</a>
      <a href="https://trophy.onrender.com/" class="link" target="_blank">trophy.html</a>
      <a href="https://github.com/leddcode/XSStrike" class="link" target="_blank">xsstrike.py</a>
      <a href="https://github.com/leddcode/GlazGo" class="link" target="_blank">GlazGo.exe</a>
      `;
	  } else if (command === 'python oculus.py') {
      window.open("https://github.com/leddcode/Oculus", "_blank");
      output = document.createElement('div');
	  	output.innerHTML = oculus;
	  } else if (command === 'python aranea.py') {
      window.open("https://github.com/leddcode/Aranea", "_blank");
      output = document.createElement('div');
	  	output.innerHTML = aranea;
	  } else if (command === 'python xsstrike.py') {
      window.open("https://github.com/leddcode/XSStrike", "_blank");
      output = document.createElement('div');
	  	output.innerHTML = xsstrike;
	  } else if (command === './glazgo.exe') {
      window.open("https://github.com/leddcode/GlazGo/releases", "_blank");
      output = document.createElement('div');
	  	output.innerHTML = glazgo;
	  } else if (command === 'open trophy.html') {
      window.open("https://trophy.onrender.com/", "_blank");
      output = document.createElement('div');
	  	output.innerHTML = trophy;
	  } else if (command === 'whoami') {
      output = document.createElement('div');
      output.innerHTML = `<a href="${atob('aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2hhbm9jaHJpenov')}" class="link" target="_blank">leddcode</a>`;
    } else if (command === './about.sh' || command === 'sh about.sh') {
      output = document.createElement('div');
      output.innerHTML = about;
    } else if (command === 'cat about.sh') {
      output = document.createElement('div');
      output.innerHTML = `echo "${about}"`;
    } else if (command === 'cat commands.txt') {
      output = document.createElement('div');
      output.innerHTML = `
      <ol>
        <li><span class="command">whoami</span></li>
        <li><span class="command">cat</span> path/to/file</li>
        <li><span class="command">open</span> path/to/html_file</li>
        <li><span class="command">python</span> path/to/python_file</li>
        <li><span class="command">sh</span> path/to/sh_file or ./path/to/sh_file</li>
      </ol>`;
    } else if (command === 'cat oculus.py') {
      output = document.createElement('div');
      output.innerHTML = `print('${oculus}')`;
    } else if (command === 'cat aranea.py') {
      output = document.createElement('div');
      output.innerHTML = `print('${aranea}')`;
    } else if (command === 'cat xsstrike.py') {
      output = document.createElement('div');
      output.innerHTML = `print('${xsstrike}')`;
    } else if (command === 'cat glazgo.exe') {
      output = document.createElement('div');
      output.innerHTML = `fmt.Println("${glazgo}")`;
    } else if (command === 'cat trophy.html') {
      output = document.createElement('div');
      output.innerHTML = `
      <pre>
      &lt;html&gt;
        &lt;body&gt;
          ${trophy}
        &lt;/body&gt;
      &lt;/html&gt;
      </pre>`;
    } else if (command === 'cat') {
      output = document.createElement('div');
      output.innerHTML = `Choose a file to be read.`;
    } else if (command === 'python') {
      output = document.createElement('div');
      output.innerHTML = `Choose a Python file to run.`;
    } else if (command.startsWith('python3')) {
      output = document.createElement('div');
      output.innerHTML = `Command 'python3' not found, did you mean: command 'python' from deb python-is-python3?`;
    } else if (command.startsWith('bash')) {
      output = document.createElement('div');
      output.innerHTML = `Command 'bash' not found, did you mean: command 'sh'?`;
    } else if (command === 'sh') {
      output = document.createElement('div');
      output.innerHTML = `Choose a SH file to run.`;
    } else if (command === 'open') {
      output = document.createElement('div');
      output.innerHTML = `Choose an HTML file to open.`;
    } else if (command === 'clear') {
      results.innerHTML = '';
    } else {
      output = document.createElement('div');
			output.innerHTML = 'Command not found';
		}
    output.classList.add("output");
    results.appendChild(prompt);
    results.appendChild(output);

		output.insertAdjacentHTML('afterend', '<div><br></div>');
	}
});
