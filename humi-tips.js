/* HuMAI Academy: Hero Command
   20 Offline HuMi Hero Tips - humi-tips.js

  This module works offline because the tips are already written in this file.
  File contains 20 ready-made learning tips from HuMi.

  The tips appear on the dashboard and can be changed using the
  Previous, Next, and Surprise Tip buttons.*/

/*  Stores all 20 HuMi tips inside an array. Each tip has a title, message, category, and emoji icon */
const humiTips = [
   /* Tip 1 teaches the user to check where information comes from */
  { title: 'Great thinkers check their clues.', message: 'When you learn something new, ask: “Where did this information come from?”', category: 'Fact checking', icon: '🔎' },
  /* Tip 2 explains that AI can be useful but is not always correct */
  { title: 'AI can help, but it can make mistakes.', message: 'Use AI as a helpful tool, then double-check important answers with a reliable source.', category: 'AI literacy', icon: '🤖' },
  /* Tip 3 teaches the user how to ask clearer questions */
  { title: 'Clear questions unlock clearer answers.', message: 'Try adding details, such as who, what, where, or how, when you ask a question.', category: 'Asking questions', icon: '💬' },
   /* Tip 4 teaches children to protect their personal information online */
  { title: 'Your private information is a superpower.', message: 'Keep things like passwords, home addresses, and full names protected online.', category: 'Digital safety', icon: '🛡️' },
   /* Tip 5 reminds users to stop and think before doing something online */
  { title: 'A pause can be a power move.', message: 'Before you click, share, or believe something online, take a moment to think.', category: 'Digital safety', icon: '⏸️' },
  /* Tip 6 teaches users to look for patterns when solving problems */
  { title: 'Patterns help your brain solve puzzles.', message: 'Look for what repeats, what changes, and what belongs together.', category: 'Pattern thinking', icon: '🧩' },
  /* Tip 7 explains that mistakes can help us learn and improve */
  { title: 'Mistakes are learning signals.', message: 'When an answer is wrong, your brain gets a new clue for what to try next time.', category: 'Growth mindset', icon: '🌱' },
  /* Tip 8 teaches users that reliable information should have evidence */
  { title: 'Good sources show their evidence.', message: 'Trustworthy information often explains where facts, numbers, or ideas came from.', category: 'Fact checking', icon: '📚' },
  /* Tip 9 teaches users to be respectful when communicating online */
  { title: 'Be kind in every digital mission.', message: 'Use respectful words online, just like you would when talking to a teammate in person.', category: 'Digital citizenship', icon: '💙' },
  /* Tip 10 teaches users to solve large problems one small step at a time */
  { title: 'Break big problems into tiny missions.', message: 'Start with one small step, then solve the next step after that.', category: 'Problem solving', icon: '🪜' },
  /* Tip 11 gives users a strategy for remembering where things are */
  { title: 'Memory gets stronger with smart clues.', message: 'Try remembering where a card is by noticing what is beside it or what color area it is near.', category: 'Memory skills', icon: '🧠' },
   /* Tip 12 reminds users that exciting headlines are not always true */
  { title: 'Not every shiny headline is true.', message: 'Exciting posts can still be incorrect. Look for proof before you share them.', category: 'Fact checking', icon: '✨' },
   /* Tip 13 encourages users to ask a trusted adult for help online */
  { title: 'Ask a trusted adult when something feels confusing.', message: 'A parent, guardian, teacher, or trusted grown-up can help you make a safe choice.', category: 'Digital safety', icon: '🧑‍🏫' },
  /* Tip 14 reminds users that practice helps them improve */
  { title: 'Practice turns skills into superpowers.', message: 'You do not have to get everything right on the first try. Every round helps you improve.', category: 'Growth mindset', icon: '⚡' },
  /* Tip 15 teaches users to compare information from multiple sources */
  { title: 'Compare more than one source.', message: 'If two reliable places agree on a fact, that gives you a stronger reason to trust it.', category: 'Fact checking', icon: '🔁' },
  /* Tip 16 encourages curiosity and deeper thinking */
  { title: 'Your curiosity is a hero skill.', message: 'Questions like “How do we know?” and “What else could be true?” help you learn deeply.', category: 'Critical thinking', icon: '💡' },
  /* Tip 17 teaches users to use technology for a specific purpose */
  { title: 'Use technology with purpose.', message: 'Before using an app or tool, think about what you want to learn, create, or solve.', category: 'AI literacy', icon: '🎯' },
  /* Tip 18 reminds users that taking breaks can help their brain */
  { title: 'Take a brain break when you need one.', message: 'A short stretch, drink of water, or deep breath can help you return ready to learn.', category: 'Healthy habits', icon: '🌤️' },
  /* Tip 19 teaches users that working together can create better solutions */
  { title: 'Teamwork makes missions stronger.', message: 'Sharing ideas and listening to others can help everyone discover better solutions.', category: 'Collaboration', icon: '🤝' },
  /* Tip 20 encourages users to celebrate their progress */
  { title: 'Celebrate every learning win.', message: 'A new idea, a solved puzzle, and a brave question all deserve a hero-level celebration.', category: 'Growth mindset', icon: '🏆' }
];

/* Keeps track of which tip is currently being displayed */
let currentTipIndex = 0;

/* Shortcut for finding one HTML element on the page */
const $ = (selector) => document.querySelector(selector);

/* Starts the dashboard with the first HuMi tip */
export function initializeHumiTips() {
  /* Sets the current tip number back to the first tip */
  currentTipIndex = 0;
  /* Displays the first tip on the dashboard */
  renderCurrentTip();
}

/* Shows the next tip and returns to Tip 1 after the last tip */
export function showNextHumiTip() {
   /* Increases the tip number by one and loops back to zero when needed */
  currentTipIndex = (currentTipIndex + 1) % humiTips.length;
  /* Updates the dashboard with the new tip */
  renderCurrentTip();
}

/* Moves to the previous tip and loops from Tip 1 back to Tip 20 */
export function showPreviousHumiTip() {
   /* Decreases the tip number by one and loops back to the last tip when needed */
  currentTipIndex = (currentTipIndex - 1 + humiTips.length) % humiTips.length;
  /* Updatesthe dashboard with the new tip */
  renderCurrentTip();
}

/* Choosea a random tip that is different from the current tip */
export function showRandomHumiTip() {
  /* Stops if there are not at least two tips to choose from */
  if (humiTips.length < 2) return;

  /* Starts by using the currently displayed tip number */
  let nextIndex = currentTipIndex;
  /* Keeps choosing a random tip until it is different from the current one */
  while (nextIndex === currentTipIndex) {
    /* Picks a random number between zero and the number of available tips */
    nextIndex = Math.floor(Math.random() * humiTips.length);
  }
  /* Saves the new random tip number */
  currentTipIndex = nextIndex;
  /* Displays the new random tip on the dashboard */
  renderCurrentTip();
}

/* Givea other JavaScript files access to the current HuMi tip information */
export function getCurrentHumiTip() {
   /* Returns the current tip along with its number and the total number of tips */
  return {
    /* Copies the title, message, category, and icon from the current tip */
    ...humiTips[currentTipIndex],
    /* Converts the zero-based array number into a user-friendly tip number */
    number: currentTipIndex + 1,
    /* Tells the dashboard how many total tips are available */
    total: humiTips.length
  };
}

/*  renderCurrentTip updates the HuMi Tip card that is already on the webpage.
  It finds the existing HTML elements and replaces their text with the current tip */
function renderCurrentTip() {
  /* Geta the information for whichever tip is currently selected */
  const tip = getCurrentHumiTip();
  /* Finds the emoji icon inside the HuMi tip card */
  const icon = $('.tip-humi');
  /* Finds the main title inside the HuMi tip card */
  const title = $('.humi-tip-card h3');
  /* Finds the paragraph that contains the tip message */
  const message = $('.humi-tip-card p:not(.eyebrow)');
   /* Finds the category or description element on the dashboard */
  const category = $('#humiTipCategory, #humiTipDescription');
  /* Finds the element that shows which tip number is being displayed */
  const counter = $('#humiTipCounter');
  /* Finds the element that shows the hero skill category */
  const details = $('#humiTipDetails');

  /* Changes the visible emoji to match the current tip */
  if (icon) icon.textContent = tip.icon;
  /* Changes the visible title to match the current tip */
  if (title) title.textContent = tip.title;
   /* Changes the visible message to match the current tip */
  if (message) message.textContent = tip.message;
  /* Changes the visible category to match the current tip */
  if (category) category.textContent = tip.category;
  /* Shows the current tip number and the total number of tips */
  if (counter) counter.textContent = `Tip ${tip.number} of ${tip.total}`;
  /* Shows the skill category underneath the tip details */
  if (details) details.textContent = `Hero skill: ${tip.category}`;
}
