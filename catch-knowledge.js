/* HuMAI Academy: Hero Command Center
   Offline Arcade Game Module - uses catch-knowledge.js
  
  Game runs locally in the browser without an API.

  - Icons fall down the screen for the player to catch them
  - Red glitch icons are obstacles the user must avoid catching
  - The user moves a basket left and right to catch helpful items

  Handles:
  - Start Game overlay
  - 30-second timer
  - Falling item creation and animation
  - Basket movement
  - Simple collision detection
  - Score, toast feedback, XP, and results popup */

/* Imports the function that adds XP to the users progress */
import { addXp } from './state.js';
/* Imports the functions that update the dashboard adn show game messages */
import { updateDashboard, showResult, showToast } from './ui.js';
/* $ is a shortcut for finding an element on the page */ 
const $ = (selector) => document.querySelector(selector);

/* Stores the current Catch the Knowledge game information */
let game = null;

/* resetCatchKnowledge creates a new game without starting it yet */
export function resetCatchKnowledge() {
  /* Stops timers and remove objects from the previous game */
  stopCatchKnowledge();
  /* Creates the starting information for a new game */
  game = {
    score: 0, /* Starts the player's score at zero */
    time: 30, /* Gives the player 30 seconds to play */
    basketX: 50,  /* Starts the basket in the middle of the screen */
    timer: null, /* Stores the game countdown timer here */
    spawnTimer: null,  /* Store the falling-item timer here. */
    running: false, /* The game starts paused until the user clicks Start */
    items: []  /* Stores all falling items currently on the screen */
  };

  /* Find the score shown at the top of the game */
  const topScore = $('#catchScore'); 
  const bottomScore = $('#catchScoreBottom'); /* Finds the score shown at the bottom of the game */
  const timer = $('#catchTime');  /* Finds the timer shown on the game screen */
  const basket = $('#catchBasket'); /* Finds the basket the user moves */
  /* Resets the top score display to zero */
  if (topScore) topScore.textContent = '0'; 
  if (bottomScore) bottomScore.textContent = '0'; /* Resets the bottom score display to zero */
  if (timer) timer.textContent = '00:30';  /* Resets the timer display to 30 seconds */
  if (basket) basket.style.left = 'calc(50% - 30px)'; /* Puts the basket back in the middle of the game */

  const overlay = $('#catchOverlay'); /* Find the start-game overlay on the page */
  if (!overlay) { /* Stops if the start-game overlay cannot be found */
    console.warn('Catch the Knowledge overlay is missing. Check #catchOverlay in index.html.'); /* Shows a warning in the browser console for troubleshooting */
    return;  /* Leaves the function because the overlay is required */
  }

  /* Shows the start screen by removing the hidden class */
  /* Puts the start screen content inside the overlay */
  overlay.classList.remove('hidden');
  overlay.innerHTML = ` 
    <div>
      <span>🧺</span>
      <h3>Ready to catch knowledge?</h3>
      <p>Collect helpful ideas and avoid red glitches.</p>
      <button class="primary-button" id="startCatchButton" type="button">
        Start game <span>▶</span>
      </button>
    </div>
  `;

  /* Finds the Start Game button after creating it above */
  $('#startCatchButton')?.addEventListener('click', startCatchKnowledge);
}

/* startCatchKnowledge starts the timer and falling objects */
export function startCatchKnowledge() {
  if (!game || game.running) return; /* Does nothing if there is no game or the game is already running */

  const arena = $('#catchGame'); /* Finds the main game area on the page */
  const overlay = $('#catchOverlay'); /* Find the start-game overlay */

  /* Stops if the game area or overlay is missing. */
  if (!arena || !overlay) { 
     /* Shows a warning in the browser console for troubleshooting */
    console.warn('Catch the Knowledge game arena is missing. Check #catchGame and #catchOverlay.');
    return; /* Leaves the function because required elements are missing */
  }

  game.running = true; /* Marks the game as currently running */
  overlay.classList.add('hidden'); /* Hides the start screen while the game is playing */
  arena.focus(); /* Gives the game area keyboard focus for controls */

  /* Creates a new falling item every 700 milliseconds */
  game.spawnTimer = setInterval(spawnFallingItem, 700);

  /* Reduces the visible time once every second */
  game.timer = setInterval(() => {
    game.time -= 1; /* Subtracts one second from the remaining time */

    const timer = $('#catchTime'); /* Finds the timer display on the page */
    if (timer) { /* Updates the visible timer if it exists */
      timer.textContent = `00:${String(Math.max(0, game.time)).padStart(2, '0')}`;  /* Shows the remaining seconds with two digits */
    }

    if (game.time <= 0) { /* Ends the game when the timer reaches zero */
      finishCatchKnowledge();  /* Finishes the game and show the results */
    }
  }, 1000);
}

/* stopCatchKnowledge stops all game movement and removes all falling items */
export function stopCatchKnowledge() {
  clearInterval(game?.timer); /* Stops the main countdown timer if one is running */
  clearInterval(game?.spawnTimer); /* Stops creating new falling items */

  if (!game) return; /* Stops here if there is no current game */

  game.running = false;  /* Marks the game as no longer running */

  /* Copies the array because cleanup removes items from the original array*/
  [...game.items].forEach(cleanupFallingItem);
  game.items = []; /* Empty the list of active falling items. */
}

/* moveKnowledgeBasket moves the basket left or right.
  direction: -1 means left; 1 means right */
export function moveKnowledgeBasket(direction) {
  if (!game) return; /* Does nothing if a game has not been created yet */

  /* Keeps basket movement inside the game arena */
  game.basketX = Math.max(5, Math.min(95, game.basketX + (direction * 8)));

  const basket = $('#catchBasket'); /* Finds the basket on the page */
  if (basket) { /* Moves the basket if the element exists */
    basket.style.left = `calc(${game.basketX}% - 30px)`; /* Changes the basket's left position based on its new location */
  }
}

/* spawnFallingItem creates one helpful item or one red glitch */
function spawnFallingItem() {
  if (!game?.running) return;  /* Does nothing if the game is not currently running */

  const arena = $('#catchGame'); /* Finds the main game area */
  if (!arena) return; /* Stops if the game area cannot be found */

  /* These icons give the player helpful knowledge items */
  const helpfulItems = ['💡', '✓', '🔎', '🛡️', '📚', '⭐'];
  const glitchItems = ['⚠️', '✖', '❗']; /* These icons represent bad glitch items */
  const isGlitch = Math.random() < 0.29; /* Give each new item a 29% chance of being a glitch */

  const item = { /* Creates the information needed for the falling item */
    isGlitch, /* Remembers whether this item is a bad glitch */
    /* Randomly chooses an icon from the correct list */
    symbol: (isGlitch ? glitchItems : helpfulItems)[  
      Math.floor(Math.random() * (isGlitch ? glitchItems.length : helpfulItems.length))
    ],
    x: 6 + (Math.random() * 86), /* Gives the item a random horizontal starting position */
    y: -12, /* Starts the item slightly above the visible game area */
    speed: 1.1 + (Math.random() * 1.4),  /* Gives the item a random falling speed */
    element: null,  /* Stores the item's HTML element here later */
    frame: null /* Stores the browser animation frame here later */
  };

  const itemElement = document.createElement('div'); /* Creates a new div element for the falling item */
  itemElement.className = `falling-knowledge ${isGlitch ? 'bad' : ''}`;  /* Gives the item its normal or glitch CSS class */
  itemElement.textContent = item.symbol; /* Displays the selected emoji inside the item */
  itemElement.style.left = `${item.x}%`; /* Places the item at its random horizontal position */
  itemElement.style.top = `${item.y}px`;  /* Places the item at its starting vertical position */

  arena.appendChild(itemElement);  /* Adds the falling item to the game area */
  item.element = itemElement; /* Saves the HTML element inside the item object */
  game.items.push(item);  /* Adds the item to the list of active falling items */

  animateFallingItem(item); /* Starts moving the new item downward */
}

/* animateFallingItem smoothly moves one item down the screen */
function animateFallingItem(item) {
  const nextFrame = () => { /* nextFrame runs repeatedly while the item is falling */
    if (!game?.running || !item.element) {  /* Removes the item if the game stopped or the item no longer exists */
      cleanupFallingItem(item); /* Cleans the item up and stop its animation */
      return; /* Stops running this animation frame */
    }

    /* Moves the item farther down the screen */
    item.y += item.speed * 3.2; 
    /* Updates the item's position on the page */
    item.element.style.top = `${item.y}px`;

    /* This is simple collision detection for the demo, item is caught when it is near the basket horizontally and has reached the basket's vertical level */
    const basketCenter = game.basketX;  /* Uses the basket's position as the center point for catching */
    const itemCenter = item.x + 3;  /* Estimates the center position of the falling item */
    const isNearBasket = Math.abs(itemCenter - basketCenter) < 10; /* Checks whether the item is close enough to the basket horizontally */
    const isAtBasketHeight = item.y > 315 && item.y < 370;  /* Checks whether the item has reached the basket's height */

    /* Catches the item when it is near the basket and at the right height */
    if (isNearBasket && isAtBasketHeight) { 
      /* Processes the caught item and update the score */
      handleCaughtItem(item); 
      /* Stops moving this item because it was caught */
      return; 
    }

    /* Removes the item if it falls below the game area */
    if (item.y > 430) {
      cleanupFallingItem(item);  /* Removes the missed item from the game */
      return; /* Stops this item's animation */
    }
    /* Asks the browser to run this movement again on the next frame */
    item.frame = requestAnimationFrame(nextFrame);
  };
   /* Starts the item's animation loop */
  item.frame = requestAnimationFrame(nextFrame);
}

/* handleCaughtItem updates the score when an item reaches the basket */
function handleCaughtItem(item) {
  if (!game) return;  /* Stops if there is no active game */

  /* Checks whether the player caught a bad glitch */
  if (item.isGlitch) { 
    /* Takes away 5 points but never let the score go below zero */
    game.score = Math.max(0, game.score - 5); 
    /* Tells the player they caught a glitch */
    showToast('⚠️ A glitch slipped in! Keep looking for helpful ideas.');  
  } else {
    game.score += 10; /* Gives the player 10 points for catching something helpful */

    /* Shows encouragement every time the score reaches another 30 points */
    if (game.score % 30 === 0) { 
      /* Tells the player they caught a helpful knowledge clue */
      showToast('✨ Nice catch! That was a helpful knowledge clue.');
    }
  }
  /* Finds the score shown at the top of the game */
  const topScore = $('#catchScore');
  /* Finds the score shown at the bottom of the game */
  const bottomScore = $('#catchScoreBottom');
  /* Updates the top score if the element exists */
  if (topScore) topScore.textContent = game.score;
  /* Updates the bottom score if the element exists */
  if (bottomScore) bottomScore.textContent = game.score;

   /* Removes the caught item from the game */
  cleanupFallingItem(item);
}

/* cleanupFallingItem stops and removes one falling item */
function cleanupFallingItem(item) {
  /* Stops the item's animation if it has one running */
  if (item.frame) cancelAnimationFrame(item.frame); 
  /* Removes the item's HTML element from the page */
  item.element?.remove(); 

  /* Checks whether the game object still exists */
  if (game) { 
     /* Removse this item from the list of active falling items */
    game.items = game.items.filter((activeItem) => activeItem !== item);
  }
}

/* finishCatchKnowledge ends the 30-second round and awards XP */
function finishCatchKnowledge() {
  /* Does nothing if the game is already stopped */
  if (!game?.running) return;

  /* Saves the final score before stopping the game */
  const finalScore = game.score;  
  /* Stops the timer, animations, and falling items */
  stopCatchKnowledge(); 

  /* 15 base XP plus one bonus XP for every 10 game points */
  const earnedXp = 15 + Math.floor(finalScore / 10);
  
   /* Adds the earned XP to the users saved progress. */
  addXp(earnedXp);
  /* Refreshes the main dashboard with the new XP total */
  updateDashboard();

   /* Shows the final results popup to the player */
  showResult({
    emoji: '🧺', /* Uses the basket emoji for the results screen */
    eyebrow: 'ARCADE COMPLETE!', /* Displays this small heading above the results title */
    title: 'Knowledge collected!', /* Displays the main results message */
    text: `You caught ${finalScore / 10} helpful ideas for HuMi’s learning lab.`, /* Tells the user how many helpful ideas they caught */
    xp: earnedXp,  /* Shows how much XP the user earned. */
    badge: '💡 Keep catching facts and dodging glitches!',  /* Displays an encouraging message about the game */
    replay: 'catch', /* Tells the results screen which game should be replayed */
    stats: [  /* Shows the player's final game statistics */
      { label: 'SCORE', value: finalScore }, /* Displays the final score */
      { label: 'TIME', value: '00:30' }  /* Displays the original 30-second game length */
    ]
  });
}
