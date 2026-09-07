/* HuMAI Academy: Hero Command
   Pattern Pilot Progress Module - level-progress.js

  This file controls the learner's level progress card.

  It updates:
  - The current level number
  - The current level name
  - The hero icon
  - The XP progress bar
  - XP needed for the next level
  - The current level's XP amount

  Each level requires 300 XP.

  When the learner reaches 600 total XP,
  Level 2: Pattern Pilot is considered complete.

  After Level 2 is complete, the file shows a visual preview of future missions.
  These preview cards are not playable, it's just for demo purposes */

/* Imports the shared state object so we can read the user's XP */
import { state } from './state.js';
/* Creates a shortcut for finding one HTML element at a time */
const $ = (selector) => document.querySelector(selector);

/* Each level requires 300 XP. Starting demo XP is 420, so the user begins
Level 2: Pattern Pilot with 120 XP earned inside that level */
const XP_PER_LEVEL = 300;

/* Stores the information for each level */
const levels = [
  { number: 1, name: 'Spark Starter', icon: '⚡' },
  { number: 2, name: 'Pattern Pilot', icon: '🚀' },
  { number: 3, name: 'Data Detective', icon: '🔎' },
  { number: 4, name: 'Logic Legend', icon: '🧠' },
  { number: 5, name: 'AI Guardian', icon: '🛡️' }
];

/* Store sinformation about future games. These cards are only previews 
and do not launch actual games */
const nextGamePreviews = [
  {
    icon: '🔎',
    title: 'Data Detective',
    subtitle: 'Coming next',
    description: 'Follow clues, compare sources, and solve mystery missions.',
    color: 'cyan'
  },
  {
    icon: '⚙️',
    title: 'Code Core Rescue',
    subtitle: 'Coming next',
    description: 'Repair a virtual machine by arranging simple logic steps.',
    color: 'purple'
  },
  {
    icon: '🛡️',
    title: 'Safety Shield Squad',
    subtitle: 'Coming next',
    description: 'Use smart online choices to protect HuMi’s digital city.',
    color: 'gold'
  }
];

/* Remembers whether the future-game preview has already been shown.
  This prevents the preview from opening repeatedly */
let previewWasShown = false;

/* Starts the level-progress system when the website loads */
export function initializeLevelProgress() {
  /* Calculates and displays the user's current level */
  updateLevelProgress();
}

/* Reads the user's XP and updates the level card on the dashboard */
export function updateLevelProgress() {
  /* Gets the user's current total XP from shared state */
  const totalXp = state.xp;

  /* Calculates  the user's level from their total XP.
  Example:
    420 / 300 = 1.4
    Math.floor(1.4) = 1
    1 + 1 = Level 2 */
  const calculatedLevelNumber = Math.floor(totalXp / XP_PER_LEVEL) + 1;

  /* Make sure the calculated level does not go past
    the number of levels defined in the levels array */
  const safeLevelNumber = Math.min(calculatedLevelNumber, levels.length);
  
  /* Get the information for the learner's current level.
  Arrays start counting at 0, so subtract 1 from the level number */
  const currentLevel = levels[safeLevelNumber - 1];

    /* Calculates  how much XP the user has earned inside the current 300XP level.
  Example:
    420 % 300 = 120 XP inside Level 2. */
  const xpInsideCurrentLevel = totalXp % XP_PER_LEVEL;

  /* Converts the current level XP into a percentage that can be used to 
  fill the progress bar */
  const progressPercent = Math.min(100, (xpInsideCurrentLevel / XP_PER_LEVEL) * 100);

  /* Calculates how much XP remains before the next level.
  Example: 300 - 120 = 180 XP remaining */
  const xpRemaining = XP_PER_LEVEL - xpInsideCurrentLevel;

  /* Finds the HTML element that displays the level number */
  const levelNumber = $('#levelNumber');
  /* Find the HTML element that displays the level name */
  const levelName = $('#levelName');
  /* Finds the HTML element that displays the level icon */
  const levelIcon = $('#levelIcon');
  /* Finds the HTML element that acts as the XP progress bar */
  const progressBar = $('#levelProgress');
  /* Finds the HTML element that displays XP remaining */
  const xpToLevel = $('#xpToLevel');
  /* Finds the HTML element that displays current level XP */
  const currentLevelXp = $('#currentLevelXp');

  /* If the level number element exists, displays the current level number */
  if (levelNumber) levelNumber.textContent = currentLevel.number;
  /* If the level name element exists, displays the current level name */
  if (levelName) levelName.textContent = currentLevel.name;
   /* If the level icon element exists, displays the icon for the current level */
  if (levelIcon) levelIcon.textContent = currentLevel.icon;
  /* If the progress bar exists, changes its width to match the XP percentage */
  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  /* If the XP-remaining element exists, shows how much XP is needed for the next level */
  if (xpToLevel) xpToLevel.textContent = `${xpRemaining} XP`;
  /* If the current-level XP element exists, show the user's progress inside the current level  */
  if (currentLevelXp) currentLevelXp.textContent = `${xpInsideCurrentLevel} / ${XP_PER_LEVEL} XP`;

  /* Level 2 requires 600 total XP. 2 levels × 300 XP = 600 XP. 
  This creates a true/false value that tells us whether Pattern Pilot
  has been completed */
  const patternPilotComplete = totalXp >= XP_PER_LEVEL * 2;
 /* Only shows the future game preview if Level 2 is complete and the 
 preview has not already been displayed */
  if (patternPilotComplete && !previewWasShown) {
    /* Remembers that the preview has already been shown */
    previewWasShown = true;
    /* Creates and displays the future game preview */
    showNextGamePreview();
  }
}

/* Creates and opens the visual-only preview of the future missions */
export function showNextGamePreview() {
  /* Finds the HTML element that will contain the preview modal */
  const modal = $('#nextGamesModal');
    /* Stops if the modal element does not exist.
  This prevents a JavaScript error */
  if (!modal) return;

   /* Creates an HTML card for every futuregame preview */
  const cards = nextGamePreviews.map((game) => `
    <article class="next-game-card ${game.color}">
      <div class="next-game-icon">${game.icon}</div>
      <p class="next-game-status">${game.subtitle}</p>
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <span class="preview-lock">🔒 Preview only</span>
    </article>
  `).join('');

  /* Build the complete modal HTML
  The modal contains:
    - A close button
    - A completion message
    - Future-game preview cards
    - A button to return to Hero Command */
  modal.innerHTML = `
    <div class="next-games-modal-card" role="dialog" aria-modal="true" aria-labelledby="nextGamesTitle">
      <button class="next-games-close" id="closeNextGamesPreview" type="button" aria-label="Close preview">×</button>
      <div class="next-games-energy">⚡</div>
      <p class="eyebrow">LEVEL 2 COMPLETE</p>
      <h2 id="nextGamesTitle">Pattern Pilot powers unlocked!</h2>
      <p class="next-games-intro">HuMi has detected new missions on the horizon. Here is a preview of what comes next in Hero Command.</p>
      <div class="next-games-grid">${cards}</div>
      <button class="primary-button" id="continueAfterPreview" type="button">
        Return to Hero Command <span>→</span>
      </button>
    </div>
  `;

  /* Remove the hidden class so the preview becomes visible */
  modal.classList.remove('hidden');

  /* Connects the X button to the function that closes the preview */
  $('#closeNextGamesPreview')?.addEventListener('click', hideNextGamePreview);
  /* Connect the return button to the same close function */
  $('#continueAfterPreview')?.addEventListener('click', hideNextGamePreview);
}

/* Hides the visual-only future game preview */
export function hideNextGamePreview() {
   /* Finds the preview modal and add the hidden class.
  The ?. prevents an error if the element does not exist. */
  $('#nextGamesModal')?.classList.add('hidden');
}
