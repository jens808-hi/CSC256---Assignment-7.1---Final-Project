/* HuMAI Academy: Hero Command
  state.js — Shared Learner Data
  
  This file stores the user information shared by every module.

  Stores:
  - XP total
  - Hero streak
  - Total game sessions completed
  - Earned hero badges / insignias
  - Sound setting
  - Last active game, used by the shared Play Again button

  File does NOT use an API or database, uses browser localStorage

  All JavaScript files sit in the SAME folder:

  humai-academy/
  index.html
  app.js
  state.js
  ui.js
  humi-coach.js
  humi-tips.js
  level-progress.js
  memory-glitch.js
  thinkquest.js
*/

/* JavaScript using export to import files and use state */
export const state = {
  /* Loads saved XP from localStorage or starts with 420 XP for demo purposes */
  xp: Number(localStorage.getItem('humai-xp')) || 420, 
  /* Loads the save learning streak or starts the demo with a 3 day streak */
  streak: Number(localStorage.getItem('humai-streak')) || 3,
  /* Loads the number of completed games or starts with zero completed games */
  gamesPlayed: Number(localStorage.getItem('humai-games-played')) || 0,
  /* Loads saved badges and converts the stored JSON text back into an array */
  badges: JSON.parse(
    /* Gets the saved badges or uses the 2 starting demo badges */
    localStorage.getItem('humai-badges') ||
    /* JSON text creates the default first spark (star) and Pattern Pilot badges */
    '["First Spark", "Pattern Pilot"]'
  ),
  soundOn: true, /* True means game sounds are currently turned on */
  activeGame: null /* Null means no game is currently active */
};

/* badgeCatalog contains the complete list of badges available in HuMAI Academy */
export const badgeCatalog = [
  {
    name: 'First Spark', /* badge name for completeing first mission */
    icon: '⚡', /* associated badge emoji */
    text: 'Completed your first mission', /* description explaining how to earn this badge */
    color: '#fff3bd' /* badge's background or accent color */
  },
  {
    name: 'Pattern Pilot', /* badge name for restoring HuMi's memory core challenge */
    icon: '🧩', /* associated badge emoji */
    text: 'Restored HuMi’s memory core', /* description explaining how to earn this badge */
    color: '#dceeff' /* badge's background or accent color */
  },
  {
    name: 'Data Detective', /* badge name for completeing 5 ThinkQuest missions */
    icon: '🔎', /* associated badge emoji */
    text: 'Complete 5 ThinkQuest missions', /* description explaining how to earn this badge */
    color: '#eadfff' /* badge's background or accent color */
  },
  {
    name: 'Knowledge Catcher', /* badge name for catching 25 helpful falling objects */
    icon: '🧺', /* associated badge emoji */
    text: 'Catch 25 helpful ideas', /* description explaining how to earn this badge */
    color: '#dcfff1' /* badge's background or accent color */
  },
  {
    name: 'Streak Star', /* badge name for earning rewards for 7 days in a row */
    icon: '🌟', /* associated badge emoji */
    text: 'Learn for 7 days in a row', /* description explaining how to earn this badge */
    color: '#fff0d6' /* badge's background or accent color */
  },
  {
    name: 'AI Explorer', /* badge name for reaching Level 3 as an AI Explorer */
    icon: '🚀', /* associated badge emoji */
    text: 'Reach Level 3', /* description explaining how to earn this badge */
    color: '#e7ebff' /* badge's background or accent color */
  }
];

/* persistState saves the current users progress in browser localStorage */
export function persistState() {
  localStorage.setItem('humai-xp', state.xp); /* Saves the current XP using humai-xp localStorage key */
  localStorage.setItem('humai-streak', state.streak); /* Saves the current users learning streak using the humai-streak key */
  localStorage.setItem('humai-games-played', state.gamesPlayed); /* Saves teh completed game count using the humai-games-played key */
  localStorage.setItem('humai-badges', JSON.stringify(state.badges)); /* Converts the badge array into JSON text before saving it */
}

/* addXp gives the user XP and optionally awards a badge */
export function addXp(amount, badgeName = null) {
  state.xp += amount; /* Adds the supplied XP amount to the users current XP total */
  state.gamesPlayed += 1; /* Increases the completed game count by one */
  /* Checks whether a badge was provided and has not already been earned */
  if (badgeName && !state.badges.includes(badgeName)) {
    /* Adds the new badge to the users badge array */
    state.badges.push(badgeName);
  }
  /* Saves the updated progress to localStorage */
  persistState();
}

/* resetDemoProgress restores the users progress to the orginal demo value */
export function resetDemoProgress() {
  state.xp = 420; /* Reset Xp back to the starting demo amount */
  state.streak = 3; /* Resets the learning streak back to 3 days */
  state.gamesPlayed = 0; /* Resest the completed game count back to zero */
  state.badges = ['First Spark', 'Pattern Pilot']; /* Resets the badge collection to the 2 original demo badges */
  state.activeGame = null; /* Clears the currently active game */
  persistState(); /* Saves all of the reset values to localStorage */
}
