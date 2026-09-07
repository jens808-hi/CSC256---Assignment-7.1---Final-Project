/* HuMAI Academy: Hero Command
   Offline HuMi Hero Support - humi-coach.js 

  This module gives HuMi a  pre-written chat experience.

  Does NOT use ChatGPT, Gemini, Claude, an API key, or Internet access; pre-scripted
  Uses simple keyword checks to select a suitable kid-friendly response.
*/

/* Shortcut for finding one HTML element on the page */
const $ = (selector) => document.querySelector(selector);

/* initializeCoach sets up HuMi's welcome message when the learner opens
  the HuMi Hero Support screen for the first time */
export function initializeCoach() {
  const chatLog = $('#chatLog'); /* Finds the area where HuMi's chat messages will appear */

   /* Stops the function if the chat area does not exist in the HTML */
  if (!chatLog) return;

  /* Stopa the function if chat messages are already showing */
  if (chatLog.children.length > 0) return;

  /* Adds HuMi's first welcome message to the chat */
  addMessage(
    'Hi, Explorer! I’m HuMi, your learning buddy. I can help you choose a game, explain a tricky idea, or celebrate your progress!',
    'bot'
  );
}

/* sendCoachMessage shows the user's message and then creates HuMi's reply */
export function sendCoachMessage(text) {
  /* Removes extra spaces from the beginning and end of the message */
  const cleanText = text.trim();

  /* Ignores the message if the learner did not type anything */
  if (!cleanText) return;

  /* Adds the user's message to the chat window */
  addMessage(cleanText, 'user');

  // Clear the chat input box after the learner sends their message.
  const input = $('#chatInput');
  if (input) input.value = '';

  // The brief pause makes the demo feel more like a real conversation.
  setTimeout(() => { /* Waits a short moment before HuMi responds to make it feel like a real chat */
    addMessage(createHumiReply(cleanText), 'bot'); /* Creates HuMi's reply and add it to the chat as a bot message */
  }, 420);
}

 /* addMessage creates a new chat bubble and places it inside the chat area */
function addMessage(text, sender) {
  /* Finds the chat area where the new message should appear */
  const chatLog = $('#chatLog');
  /* Stops if the chat area cannot be found */
  if (!chatLog) return;

  /* Creates a new div element to hold the chat message */
  const message = document.createElement('div');
  /* Givea the message a class based on whether it came from the user */
  message.className = `message ${sender === 'user' ? 'user' : ''}`;

  /* Convert special HTML characters into safe text, prevents typed text from being treated as webpage code */
  const safeText = text
    .replaceAll('&', '&amp;') /* Replaces ampersands with safe HTML text */
    .replaceAll('<', '&lt;') /* Replaces less-than symbols with safe HTML text */
    .replaceAll('>', '&gt;'); /* Replaces greater-than symbols with safe HTML text */

  /* Builds the chat bubble with the correct sender name and message */
  message.innerHTML = `
    <strong>${sender === 'user' ? 'YOU' : '🤖 HUMI'}</strong> 
    ${safeText}
  `;

  /* Adds the new message bubble to the chat area */
  chatLog.appendChild(message);

   /* Automatically scrolls down so the newest message can be seen */
  chatLog.scrollTop = chatLog.scrollHeight;
}

/* createHumiReply looks at the user's words and chooses a prepared response, keeps HuMi simple, reliable, and completely offline */
function createHumiReply(message) {
  /* Converts the user's message to lowercase to make word checking easier */
  const text = message.toLowerCase();
  /* Checks if the user is asking about playing a game */
  if (text.includes('play') || text.includes('next') || text.includes('game')) {
    /* Returna a preloded recommendation for the Memory Glitch game */
    return 'I recommend HuMi’s Memory Glitch! It builds pattern power, and you can earn a Pattern Pilot badge. Want to give it a try?';
  }
  /* Checks if the user is asking about AI or artificial intelligence */
  if (text.includes('ai') || text.includes('artificial intelligence')) {
    /* Returns a simple kid-friendly explanation of artificial intelligence */
    return 'AI is a tool that finds patterns in lots of information to help with things like answering questions, creating pictures, and translating words. Smart explorers remember that AI can make mistakes, so important answers should be checked.';
  }
  /* Checks if the user wants a tip, wants to learn, or needs help */
  if (text.includes('tip') || text.includes('learn') || text.includes('help me')) {
    /* Returns a preloaded tip about checking where information comes from */
    return 'Here is a hero-thinking tip: when you see a new fact, ask “How do we know this?” Looking for a reliable source is like using a flashlight to find the truth!';
  }
  /* Checks if the user is talking about memory or matching */
  if (text.includes('memory') || text.includes('match')) {
    /* Returns a helpful memory game strategy */
    return 'Memory games get easier when you notice landmarks. Try remembering a card by what is near it: “the lightning card is beside the robot.”';
  }
   /* Checks if the user is asking about online safety or privacy */
  if (text.includes('safe') || text.includes('privacy') || text.includes('password')) {
    /* Returns a preloaded reminder about protecting personal information */
    return 'Your private information is a superpower. Keep passwords, home addresses, and other personal details protected. Ask a trusted adult when something online feels confusing.';
  }
  /* Checks if the user is feeling stuck, wrong, or having trouble */
  if (text.includes('wrong') || text.includes('mistake') || text.includes('hard')) {
    /* Returns an encouraging message reminding the user that mistakes help us learn */
    return 'Every mistake is a new clue, Explorer! Take a breath, look for patterns, and try one small step at a time. You are building your learning powers.';
  }
  /* Gives a general response when none of the special keywords were detected */
  return 'That is a thoughtful question! I can help with games, AI basics, safe online choices, and learning tips. Try asking, “What should I play next?”';
}
