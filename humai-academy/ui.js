/* HuMAI Academy
  Shared User Interface Module

  This file controls visual updates that are shared across the website.


   It handles:
  - XP and streak numbers
  - Reward totals
  - Badge cards
  - Game cards
  - Toast messages
  - Mission results popup */

/* Imports the shared learner data and the list of available badges */
import { state, badgeCatalog } from './state.js';

/* Imports the function that updates the learner's level progress */
import { updateLevelProgress } from './level-progress.js';

/* $ is a shortcut for finding one HTML element on the page */
const $ = (selector) => document.querySelector(selector);


/* updateText safely changes the text inside an HTML element.
  selector = tells JavaScript which HTML element to find.
  value = tells JavaScript what text to put inside that element */
function updateText(selector, value) {
  /* Finds the HTML element using the selector provided*/
  const element = $(selector);
  /* Only changes the element if it was found on the page */
  if (element) {
    /* Replaces the element's existing text with the new value */
    element.textContent = value;
  }
}


/*  updateDashboard refreshes the learner information shown across the site */
export function updateDashboard() {
  /* Updates the XP number shown at the top of the dashboard */
  updateText('#xpTop', state.xp);
  /* Updates the XP number shown at the top of the dashboard */
  updateText('#streakTop', state.streak);

  /* Updates the XP total shown on the Rewards screen */
  updateText('#rewardXp', state.xp);
  /* Updates the learning streak shown on the Rewards screen */
  updateText('#rewardStreak', state.streak);
  /* Updates the total number of games the learner has completed */
  updateText('#gamesPlayed', state.gamesPlayed);
   /* Updates the number of badges the learner has earned */
  updateText('#badgeCount', state.badges.length);
  /* Rebuilds the badge cards using the learner's current progress */
  renderBadges();
  /* Updates the level progress bar and level information */
  updateLevelProgress();
}


/* Builds the badge cards displayed on the Rewards screen */
export function renderBadges() {
  /* Finds the HTML container where the badge cards should appear */
  const badgeGrid = $('#badgeGrid');
   /* Stops if the badge container does not exist on the page */
  if (!badgeGrid) {
    /* Returns prevents the rest of the function from causing an error */
    return;
  }
  /* Creates one HTML badge card for every badge in the badge catalog */
  badgeGrid.innerHTML = badgeCatalog
    /* Runs this code once for every badge in badgeCatalog */
    .map((badge) => {
      /* Checks whether the user has already earned this badge */
      const isEarned = state.badges.includes(badge.name);
      /* Gives earned badges the "earned" class and locked badges the "locked" class */
      const statusClass = isEarned ? 'earned' : 'locked';
      /* Shows the badge description if earned or a locked message if not earned */
      const badgeMessage = isEarned
        ? badge.text
        : 'Keep playing to unlock';

      /* Returns the HTML used to create one badge card */
      return `
        <article class="badge ${statusClass}">
          <div class="badge-icon badge-color-${badge.color}">
            ${badge.icon}
          </div>
          <h3>${badge.name}</h3>
          <p>${badgeMessage}</p>
        </article>
      `;
    })
    .join('');
}

/*  renderGameGrid creates the game cards shown in the Game Zone */
export function renderGameGrid(games) {
  /* Finds the HTML container where the game cards should appear */
  const gameGrid = $('#gamesGrid');
   /* Stops if the game grid does not exist on the page */
  if (!gameGrid) {
    /* Returns prevents the function from causing an error */
    return;
  }

   /* Creates one game card for every game in the games array */
  gameGrid.innerHTML = games
  /* Runs this code once for every game in the list */
    .map((game) => {
      /* Returns the HTML used to create one game card */
      return `
        <article class="game-card ${game.artClass}">
          <div class="game-card-art">
            ${game.art}
          </div>

          <div class="game-card-body">
            <span class="game-tag ${game.tagClass}">
              ${game.tag}
            </span>

            <h3>${game.title}</h3>

            <p>${game.description}</p>

            <div class="game-card-footer">
              <span>⭐ +${game.xp} XP</span>

              <button
                class="round-play"
                data-game="${game.id}"
                type="button"
                aria-label="Play ${game.title}"
              >
                ▶
              </button>
            </div>
          </div>
        </article>
      `;
    })
    /* Combines all of the game card HTML into one large string */
    .join('');
}


/* showToast displays a short notification message at the bottom of the screen */
export function showToast(message) {
  /* Finds the toast notification element on the page */
  const toast = $('#toast');

  /* Stops if the toast element does not exist */
  if (!toast) {
    /* Returns prevents the function from causing an error */
    return;
  }

  /* Puts the provided message inside the toast notification */
  toast.textContent = message;
  /* Adds the "show" class so CSS makes the toast visible */
  toast.classList.add('show');
  /* Cancels any previous timer before starting a new one */
  clearTimeout(showToast.timer);
  /* Starts a new timer to hide the toast after a short delay */
  showToast.timer = setTimeout(() => {
     /* Removes the "show" class so CSS hides the toast */
    toast.classList.remove('show');
  }, 2800);
}

/* showResult opens the shared mission-results popup after a game ends */
export function showResult(result) {
  /* Finds the mission-results modal on the page */
  const modal = $('#resultModal');
   /* Stops if the results modal does not exist */
  if (!modal) {
     /* Returns prevents the function from causing an error */
    return;
  }

  /* Remembers which game should be played again if the learner clicks Replay */
  state.activeGame = result.replay;
   /* Shows the result emoji or use a celebration emoji if none was provided */
  updateText('#modalEmoji', result.emoji || '🎉');
  /* Shows the small heading above the results title */
  updateText('#resultEyebrow', result.eyebrow || 'MISSION COMPLETE!');
  /* Shows the main results title */
  updateText('#resultTitle', result.title || 'Great work!');
   /* Shows the main explanation or celebration message */
  updateText('#resultText', result.text || 'You completed the mission.');
    /* Shows how much XP the user earned */
  updateText('#earnedXp', result.xp || 0);
  /* Shows the badge or achievement message earned from the mission */
  updateText('#badgeEarned', result.badge || '');
   /* Finds the area where the final game statistics should appear */
  const resultStats = $('#resultStats');

  /* Only creates statistics if the results-statistics area exists */
  if (resultStats) {
    /* Uses the provided stats array or use an empty array if none was provided */
    const stats = Array.isArray(result.stats) ? result.stats : [];
    /* Creates one statistics box for every item in the stats array */
    resultStats.innerHTML = stats
    /* Runs this code once for every result statistic */
      .map((item) => {
        /* Returns the HTML used to display one statistic */
        return `
          <div class="result-stat">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
          </div>
        `;
      })
      /* Combines all statistic boxes into one HTML string */
      .join('');
  }
  /* Removes the "hidden" class so the results modal becomes visible. */
  modal.classList.remove('hidden');
}


/* hideResult closes the shared mission-results popup */
export function hideResult() {
   /* Finds the results modal and add the "hidden" class to hide it */
  $('#resultModal')?.classList.add('hidden');
}