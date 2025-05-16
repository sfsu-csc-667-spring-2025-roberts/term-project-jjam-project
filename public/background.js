// background.js: Handles background logic for Auto-Format AI Chrome extension

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'formatText') {
    // TODO: Replace with real AI formatting logic (call server or run WASM)
    const { text, formality, length, preserveTone } = message.req;
    // Placeholder: just trim and add a note
    const formatted = text.trim() + '\n\n[Formatted: formality=' + formality + ', length=' + length + ', preserveTone=' + preserveTone + ']';
    sendResponse({ formatted });
    return true;
  }
});
