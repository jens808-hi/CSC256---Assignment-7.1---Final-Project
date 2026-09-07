/* HuMAI Academy: Hero Command
   HuMi's Memory Glitch Game - memory-glitch.js
 
  This file controls HuMi's Memory Glitch matching game.

  The user:
  - Flips cards to reveal their symbols
  - Finds two matching symbols
  - Earns points for successful matches
  - Can use hints to find matching cards
  - Has 60 seconds to complete the game
  - Earns XP when the game ends

  <div id="memoryBoard"></div>
  <span id="memoryScore">0</span>
  <span id="memoryMoves">0</span>
  <span id="memoryMatches">0 / 6</span>
  <span id="memoryTime">01:00</span>
  <p id="memoryMessage"></p>
  <button id="hintButton" type="button">Use Hint</button>
*/

/* Imports the function that adds XP to the user's progress */
import { addXp } from './state.js';
/* Imports functions that update the dashboard and show the results popup */
import { updateDashboard, showResult } from './ui.js';

/* $ is a shortcut for finding one HTML element on the page. */
const $ = (selector) => document.querySelector(selector);

/* Stores the current Memory Glitch game information */
let game = null;

/* shuffle creates a randomly ordered copy of an array, original array is copied first so
the original data is not changed */
function shuffle(cards) {
  /* Creates a copy of the cards array */
  const mixedCards = [...cards];

   /* Starts at the last card and work backward through the array */
  for (let index = mixedCards.length - 1; index > 0; index -= 1) {
    /* Picks a random position from the beginning through the current position */
    const randomIndex = Math.floor(Math.random() * (index + 1));

    /* Swaps the current card with the randomly selected card */
    [mixedCards[index], mixedCards[randomIndex]] = [
      mixedCards[randomIndex],
      mixedCards[index]
    ];
  }
  /* Returns the shuffled copy of the cards. */
  return mixedCards;
}

/* startMemoryGlitch starts a fresh 60-second Memory Glitch game */
export function startMemoryGlitch() {
  /* Writes a message to the browser console for debugging */
  console.log('Memory Glitch started');

  /* Stops the previous round's timer if another game was already running */
  if (game?.timer) {
    /* Clears the old countdown timer */
    clearInterval(game.timer);
  }

  /* Finds the HTML element where the memory cards will be displayed */
  const board = $('#memoryBoard');

  /* Stops the game if the memory board is missing from the HTML */
  if (!board) {
    /* Stops the game if the memory board is missing from the HTML */
    console.error(
      'Memory Glitch cannot start: #memoryBoard is missing from index.html.'
    );
    /* Stops the function so JavaScript does not continue with a missing element */
    return;
  }

   /* These six symbols are the matching memory pairs used in the game */
  const symbols = ['⚡', '🤖', '🧠', '🔵', '💡', '🛡️'];

   /* Creates the complete game object that stores the current game state */
  game = {
    /* Creates two copies of every symbol so each symbol has a matching pair */
    cards: shuffle([...symbols, ...symbols]).map((symbol, id) => ({
      id,  /* Give every card its own unique ID number. */
      symbol,  /* Store the symbol shown on the front of the card. */
      flipped: false, /* false means the card is currently face-down. */
      matched: false /* false means the card has not been successfully matched yet. */
    })),
    first: null,  /* first stores the first card selected by the learner. */
    second: null, /* second stores the second card selected by the learner. */
    moves: 0, /* second stores the second card selected by the learner. */
    matches: 0, /* Count how many matching pairs the learner has found. */
    score: 0,  /* Store the learner's current game score. */
    time: 60,  /* Give the learner 60 seconds to complete the game. */
    hints: 2,  /* Give the learner two available hints. */
    locked: false, /* locked prevents the learner from clicking cards during comparisons. */
    running: true,  /* running tells the program that the game is currently active. */
    timer: null  /* timer will store the countdown timer later. */
  };

  /* Draw all 12 shuffled memory cards on the screen. */
  renderBoard();

   /* Update the score, moves, matches, and timer display. */
  updateGameUI();

   /* Find the message area underneath the memory game. */
  const message = $('#memoryMessage');

  /* Only change the message if the HTML element exists. */
  if (message) {

    /* Tells the user how to begin the memory challenge */
    message.textContent = '🤖 Find the matching power memories!';
  }

  /* Finds the message area underneath the memory game */
  const hintButton = $('#hintButton');

   /* Only changes the button if it exists */
  if (hintButton) {
     /* Enables the Hint button at the beginning of the game */
    hintButton.disabled = false;
  }

  /* Runs the following code once every second to control the game timer */
  game.timer = window.setInterval(() => {
     /* Stops this timer cycle if the game is no longer running */
    if (!game?.running) {
      /* Return prevents the timer from changing anything else */
      return;
    }
    /* Removes one second from the remaining game time */
    game.time -= 1;
    /* Updates the visible timer on the screen */
    updateGameUI();
    /* Checks whether the 60-second timer has reached zero */
    if (game.time <= 0) {
        /* Ends the game because the learner ran out of time */
      finishMemoryGlitch(false);
    }
  }, 1000);
}

/* stopMemoryGlitch stops the active Memory Glitch game timer */
export function stopMemoryGlitch() {
    /* Stops the countdown timer if one is currently running */
  if (game?.timer) {
    /* Clears the timer so it stops counting down */
    clearInterval(game.timer);
  }

  /* Only changes the game state if a game currently exists */
  if (game) {
    /* Marks the game as no longer running */
    game.running = false;
  }
}

/*  renderBoard draws all 12 memory cards on the webpage. The "flipped" and "matched" CSS 
classes control how the cards look. */
function renderBoard() {
  /* Finds the HTML container where the cards should be displayed */
  const board = $('#memoryBoard');
  /* Stops if the board or current game does not exist */
  if (!board || !game) {
    /* Return prevents errors when required information is missing */
    return;
  }

  /* Creates HTML for every card in the current game */
  board.innerHTML = game.cards.map((card) => `
    <button
      class="memory-card-tile ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}"
      data-memory-card="${card.id}"
      type="button"
      aria-label="Memory card"
      aria-pressed="${card.flipped || card.matched ? 'true' : 'false'}"
    >
      <span class="memory-card-inner">
        <span class="memory-card-face memory-card-back">✦</span>
        <span class="memory-card-face memory-card-front">${card.symbol}</span>
      </span>
    </button>
  `).join('');
}

/*  updateGameUI updates the visible game statistics */
function updateGameUI() {
   /* Stops if there is no active game */
  if (!game) {
    /* Return prevents the function from trying to use missing game data */
    return;
  }

  /* Finds the score display on the page */
  const score = $('#memoryScore');

  /* Finds the moves display on the page */
  const moves = $('#memoryMoves');

  /* Finds the matches display on the page */
  const matches = $('#memoryMatches');


  /* Finds the timer display on the page */
  const time = $('#memoryTime');

   /* Updates the score if the score element exists */
  if (score) {
     /* Displays the current game score */
    score.textContent = game.score;
  }

  /* Updates the moves counter if the element exists */
  if (moves) {
    /* Displays the number of moves made */
    moves.textContent = game.moves;
  }

  /* Updates the matches counter if the element exists */
  if (matches) {
    /* Shows the number of completed matches out of six */
    matches.textContent = `${game.matches} / 6`;
  }

  /* Updates the matches counter if the element exists */
  if (time) {
    /* Displays the remaining seconds using a two-digit format */
    time.textContent = `00:${String(Math.max(0, game.time)).padStart(2, '0')}`;
  }
}

/* selectMemoryCard handles the learner clicking a memory card */
export function selectMemoryCard(cardId) {
  /* Ignores the click if the game is stopped or the board is temporarily locked */
  if (!game?.running || game.locked) {
    /* Returns so another card cannot be selected right now */
    return;
  }

   /* Finds the card whose ID matches the card the user clicked */
  const selectedCard = game.cards.find(
    (card) => card.id === Number(cardId)
  );

  /*  Ignores the selection if the card does not exist, is already flipped, or has already been matched */
  if (!selectedCard || selectedCard.flipped || selectedCard.matched) {
     /* Returns because this card cannot be selected */
    return;
  }

  /* Marks the selected card as flipped.
    renderBoard() will then use this information to show the card's symbol */
  selectedCard.flipped = true;

  /*  If this is the user's first card, save it and wait for another card */
  if (!game.first) {
    /* Stores the selected card as the first card */
    game.first = selectedCard;
    /* Redraws the board so the selected card appears flipped */
    renderBoard();
    /* Finds the message displayed to the user */
    const message = $('#memoryMessage');

    /* Only updates the message if the element exists */
    if (message) {
       /* Tells the user  to choose a second card */
      message.textContent = '🤖 One power memory found. Choose another card!';
    }
     /* Stops here until the user  selects a second card */
    return;
  }

  /* A second card has now been selected.
    Locks the board while JavaScript compares the two cards */
  game.second = selectedCard;
  /* Increases the move counter because a pair was attempted */
  game.moves += 1;
  /* Prevents additional cards from being selected during the comparison */
  game.locked = true;

  /* Redraws the board so both selected cards are visible */
  renderBoard();
  /* Updates the visible move and score information */
  updateGameUI();
  /* Checks whether both selected cards contain the same symbol */
  const isMatch = game.first.symbol === game.second.symbol;

  /*  If the symbols match, keep the cards open and mark them as solved */
  if (isMatch) {
    /* Waits a little  before completing the matching pair */
    window.setTimeout(() => {
       /* Stops if the game ended before the delay finished */
      if (!game?.running) {
         /* Returns without changing the game */
        return;
      }

      /* Marks the first matching card as solved */
      game.first.matched = true;
      /* Marks the second matching card as solved */
      game.second.matched = true;
      /* Increases the number of completed matches */
      game.matches += 1;
       /* Gives the user 100 points for finding a matching pair */
      game.score += 100;
      /* Clears the first selected card so a new pair can be chosen */
      game.first = null;
      /* Clears the second selected card as well */
      game.second = null;
      /* Unlocks the board so the learner can choose another pair */
      game.locked = false;

      /* Finds the learner message area */
      const message = $('#memoryMessage');

       /* Only updates the message if the element exists */
      if (message) {
        /* Celebrates the successful memory match */
        message.textContent =
          '🤖 Match found! HuMi’s circuits are glowing!';
      }

      /* Redraws the board so the matched cards stay visibly solved */
      renderBoard();
      /* Updates the score and match counters */
      updateGameUI();

      /* Checks whether all six matching pairs have been found */
      if (game.matches === 6) {
        /* Finish the game because the user  solved every pair. */
        finishMemoryGlitch(true);
      }
    }, 420);
     /* Stops here because the matching-card logic is complete */
    return;
  }

  /* If the cards do not match, keep them visible briefly so the learner can remember their locations */
  window.setTimeout(() => {
    /* Stop if the game ended before the delay finished. */
    if (!game?.running) {
      /* Return without changing the game. */
      return;
    }

    /* Turns the first non-matching card face-down again */
    game.first.flipped = false;
     /* Turns the second non-matching card face-down again */
    game.second.flipped = false;
    /* Clears the saved first card */
    game.first = null;
    /* Clears the saved second card. */
    game.second = null;
    /* Unlocks the board for the next attempt */
    game.locked = false;
     /* Finds the user message area */
    const message = $('#memoryMessage');

    /* Only updates the message if the element exists */
    if (message) {
        /* Give the user a friendly message after an incorrect match */
      message.textContent =
        '🤖 Oops! Remember where those power cores were and try again.';
    }
    /* Redraws the board so the cards turn face-down again */
    renderBoard();
  }, 900);
}

/* useMemoryHint reveals the location of one matching pair for a short time */
export function useMemoryHint() {
  /* Stops if the game is inactive, locked, or has no hints remaining */
  if (!game?.running || game.locked || game.hints <= 0) {
    /* Returns because a hint cannot be used right now */
    return;
  }
  /* Finds cards that are not already solved or currently flipped */
  const availableCards = game.cards.filter(
    (card) => !card.matched && !card.flipped
  );

   /* Selects the first available card as the starting point for the hint */
  const firstCard = availableCards[0];
  /* Finds another available card with the same symbol.
    The ID check makes sure JavaScript does not select the same card twice */
  const secondCard = availableCards.find((card) => (
    card.symbol === firstCard?.symbol && card.id !== firstCard?.id
  ));

    /* Stops if JavaScript could not find a complete matching pair */
  if (!firstCard || !secondCard) {
     /* Returns because there is nothing useful to highlight */
    return;
  }

  /* Uses one hint from the user's two available hints */
  game.hints -= 1;
  /* Removes 15 points for using a hint, but never allow the score below zero */
  game.score = Math.max(0, game.score - 15);

   /* Finds the HTML buttons that represent the two matching cards */
  const matchingTiles = [firstCard.id, secondCard.id].map((id) => (
    /* Find the card button using its data-memory-card attribute. */
    document.querySelector(`[data-memory-card="${id}"]`)
  ));

  /* Adds the "hinted" CSS class to both matching cards */
  matchingTiles.forEach((tile) => {
    /* Only adds the class if the card element exists */
    tile?.classList.add('hinted');
  });

  /* Finds the message area for the learner */
  const message = $('#memoryMessage');

   /* Only updates the message if the element exists */
  if (message) {

    /* Tells the user that a hint was activated and how many remain */
    message.textContent =
      `🤖 Hint activated! You have ${game.hints} ` +
      `hint${game.hints === 1 ? '' : 's'} left.`;
  }

  /* Finds the Hint button */
  const hintButton = $('#hintButton');

  /* Only updates the button if it exists */
  if (hintButton) {
    /* Disables the button when the user has used the final hint */
    hintButton.disabled = game.hints === 0;
  }
  /* Updates the visible score after the hint penalty */
  updateGameUI();
  /*  Removes the visual hint after 1.5 seconds */
  window.setTimeout(() => {
    /* Removes the "hinted" class from each highlighted card */
    matchingTiles.forEach((tile) => {
      /* Only removes the class if the card still exists */
      tile?.classList.remove('hinted');
    });
  }, 1500);
}

/* finishMemoryGlitch ends the current game and opens the shared results popup.
  won = true means the user found all six pairs.
  won = false means the user ran out of time. */
function finishMemoryGlitch(won) {
  /* Stops if there is no active game or the game already ended */
  if (!game?.running) {
     /* Returns so the results cannot be shown more than once */
    return;
  }

  /* Marks the game as finished */
  game.running = false;

  /* Stops the countdown timer if it exists */
  if (game.timer) {
    /* Clears the timer so it stops running */
    clearInterval(game.timer);
  }

   /* If the user found all six pairs, calculate their completion reward */
  if (won) {
     /* Gives 50 base XP plus a time bonus for finishing quickly */
    const earnedXp = 50 + Math.max(0, Math.floor(game.time / 5));

    /* Adds the earned XP and award the Pattern Pilot badge */
    addXp(earnedXp, 'Pattern Pilot');
    /* Refreshes the dashboard so the new XP and badge appear */
    updateDashboard();

    /* Opens the shared mission-results popup with the final game information */
    showResult({
       /* Celebration emoji shown at the top of the results popup */
      emoji: '🎉',
      /* Small heading displayed above the main result title */
      eyebrow: 'MISSION COMPLETE!',
      /* Main title shown to the user */
      title: 'Power restored!',
       /* Explains what the user accomplished */
      text: 'You reconnected every scrambled memory core. HuMi is back online!',
      /* Displays the amount of XP earned */
      xp: earnedXp,
      /* Tells the user that they earned the Pattern Pilot badge */
      badge: '🏅 Pattern Pilot badge earned!',
      /* Tells the results screen which game should be replayed */
      replay: 'memory',
       /* Displays final game statistics */
      stats: [
        /* Shows the users final score */
        { label: 'SCORE', value: game.score },
         /* Shows how many moves the user made */
        { label: 'MOVES', value: game.moves },

        {
          /* Shows how much time was left when the learner finished */
          label: 'TIME',
          value: `00:${String(game.time).padStart(2, '0')}`
        }
      ]
    });
    /* Stops here because the winning result has already been displayed */
    return;
  }
  /* If the learner runs out of time, give them a small participation reward */
  addXp(5);
  /* Refreshes the dashboard so the new XP appears */
  updateDashboard();

  /* Shows the results popup for the unsuccessful round */
  showResult({
    emoji: '⏱️', /* Uses a timer emoji to show that time ran out */
    eyebrow: 'GOOD TRY!',  /* Uses a positive heading instead of calling the round a failure */
    title: 'The glitch needs one more try',  /* Encourages the user to try the puzzle again */
    text: `You found ${game.matches} of 6 matches. HuMi knows you can restore the rest!`, /* Explains how many matches the learner successfully found */
    xp: 5, /* Gives 5 XP even though the user did not finish */
    badge: '🤖 Practice makes every circuit stronger.', /* Shows an encouraging practice message */
    replay: 'memory', /* Tells the results screen which game should be replayed */
    stats: [ /* Displays the final statistics from the round */
      { label: 'MATCHES', value: `${game.matches}/6` },   /* Shows how many matching pairs were found */
      { label: 'MOVES', value: game.moves } /* Shows how many moves the learner attempted */
    ]
  });
}

