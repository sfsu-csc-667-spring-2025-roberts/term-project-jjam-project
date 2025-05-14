// popup.js: Handles UI logic for Auto-Format AI Chrome extension

document.addEventListener('DOMContentLoaded', () => {
  // Dark/light mode toggle
  const modeBtn = document.getElementById('mode-toggle');
  modeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
  // Set initial theme
  if (window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // Adaptive textarea resizing
  const inputText = document.getElementById('input-text');
  inputText.addEventListener('input', () => {
    inputText.style.height = 'auto';
    inputText.style.height = (inputText.scrollHeight) + 'px';
  });

  // Drag & drop file support
  const fileDrop = document.getElementById('file-drop');
  fileDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDrop.style.background = '#dbeafe';
  });
  fileDrop.addEventListener('dragleave', (e) => {
    fileDrop.style.background = '';
  });
  fileDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDrop.style.background = '';
    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        inputText.value = event.target.result;
        inputText.dispatchEvent(new Event('input'));
      };
      reader.readAsText(file);
    }
  });

  // Formatting controls
  const formalitySlider = document.getElementById('formality-slider');
  const lengthSlider = document.getElementById('length-slider');
  const toneToggle = document.getElementById('tone-toggle');

  // Format button
  const formatBtn = document.getElementById('format-btn');
  const beforeText = document.getElementById('before-text');
  const afterText = document.getElementById('after-text');
  const diffHighlight = document.getElementById('diff-highlight');

  formatBtn.addEventListener('click', async () => {
    beforeText.textContent = inputText.value;
    afterText.textContent = 'Formatting...';
    diffHighlight.textContent = '';
    // Send text to background/AI for formatting
    const req = {
      text: inputText.value,
      formality: formalitySlider.value,
      length: lengthSlider.value,
      preserveTone: toneToggle.checked
    };
    chrome.runtime.sendMessage({ action: 'formatText', req }, (response) => {
      if (response && response.formatted) {
        afterText.textContent = response.formatted;
        // TODO: Compute diff and highlight
      } else {
        afterText.textContent = 'Formatting failed.';
      }
    });
  });

  // Copy, PDF, Google Docs export buttons
  document.getElementById('copy-btn').onclick = () => {
    navigator.clipboard.writeText(afterText.textContent);
  };
  document.getElementById('pdf-btn').onclick = () => {
    // Simple PDF export using window.print()
    window.print();
  };
  document.getElementById('gdocs-btn').onclick = () => {
    alert('Export to Google Docs coming soon!');
  };
});
